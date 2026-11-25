import { useState, useEffect, useRef } from 'react';
import { ArrowRight, Check, X, RotateCcw, ChevronLeft } from 'lucide-react';

interface Problem {
  num1: number;
  num2: number;
  operador: '+' | '-';
  resultado: number;
  operacionTexto: string;
  delta: number;
}

export default function ArithmeticGame({ onBack }: { onBack: () => void }) {
  const [problem, setProblem] = useState<Problem | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const generateProblem = () => {
    const num1 = Math.floor(Math.random() * 20) - 10;
    const num2 = Math.floor(Math.random() * 20) - 10;
    const operador = Math.random() > 0.5 ? '+' : '-';
    const resultado = operador === '+' ? num1 + num2 : num1 - num2;
    const delta = operador === '+' ? num2 : -num2;

    setProblem({
      num1, num2, operador, resultado,
      operacionTexto: `${num1} ${operador} (${num2})`,
      delta
    });
    setUserAnswer('');
    setFeedback(null);
  };

  useEffect(() => { generateProblem(); }, []);

  useEffect(() => {
    if (problem && inputRef.current) {
      inputRef.current.focus();
    }
  }, [problem]);

  const checkAnswer = () => {
    if (parseInt(userAnswer) === problem?.resultado) {
      setFeedback('correct');
      setScore(s => s + 1);
    } else {
      setFeedback('incorrect');
    }
    setAttempts(a => a + 1);
  };

  if (!problem) return null;

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-xl">
      <button onClick={onBack} className="flex items-center text-slate-500 hover:text-blue-600 mb-6">
        <ChevronLeft size={20} /> Volver a Juniors
      </button>

      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-purple-800">Aritmética: Enteros</h2>
        <div className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full font-bold">
          Puntos: {score} / {attempts}
        </div>
      </div>

      <div className="text-center mb-10">
        <p className="text-2xl font-mono mb-4 text-slate-700">{problem.operacionTexto} = ?</p>
        <input
          ref={inputRef}
          autoFocus
          type="number"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          className="text-center text-4xl p-4 w-32 border-4 border-purple-200 rounded-xl focus:border-purple-500 outline-none"
          placeholder="?"
        />
      </div>

      <div className="flex justify-center gap-4">
        <button onClick={checkAnswer} className="bg-purple-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-purple-700 flex items-center gap-2">
          <Check size={20} /> Comprobar
        </button>
        <button onClick={generateProblem} className="bg-slate-200 text-slate-700 px-8 py-3 rounded-xl font-bold hover:bg-slate-300 flex items-center gap-2">
          <RotateCcw size={20} /> Otro
        </button>
      </div>

      {feedback && (
        <div className={`mt-8 p-4 rounded-xl text-center font-bold ${feedback === 'correct' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {feedback === 'correct' ? '¡Excelente! 🎉' : `¡Casi! La respuesta era ${problem.resultado}`}
        </div>
      )}
    </div>
  );
}
