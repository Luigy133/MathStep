import { useState } from 'react';
import { ArrowRight, Wallet, TrendingUp, TrendingDown, Target } from 'lucide-react';

// Componente de Recta Numérica en SVG
const NumberLine = ({ position }: { position: number }) => {
  const range = 20; // -20 a 20
  const width = 600;
  const height = 100;
  const centerX = width / 2;
  const unit = width / (range * 2);

  const getX = (val: number) => centerX + val * unit;

  return (
    <svg width={width} height={height} className="overflow-visible">
      {/* Línea principal */}
      <line x1={0} y1={height / 2} x2={width} y2={height / 2} stroke="#94a3b8" strokeWidth="2" />
      
      {/* Divisiones */}
      {Array.from({ length: range * 2 + 1 }).map((_, i) => {
        const val = i - range;
        const x = getX(val);
        return (
          <g key={val}>
            <line x1={x} y1={height / 2 - 10} x2={x} y2={height / 2 + 10} stroke="#94a3b8" strokeWidth="1" />
            {val % 5 === 0 && (
              <text x={x} y={height / 2 + 30} textAnchor="middle" className="text-[10px] fill-slate-400 font-mono">
                {val}
              </text>
            )}
          </g>
        );
      })}

      {/* Marcador de Posición */}
      <circle cx={getX(position)} cy={height / 2} r="8" className="fill-blue-400 stroke-white stroke-2" />
    </svg>
  );
};

export default function InteractiveConcept({ onComplete }: { onComplete: () => void }) {
  const [balance, setBalance] = useState(0);
  const [history, setHistory] = useState<string[]>(['Inicio: 0 💰']);

  const updateBalance = (amount: number, type: string) => {
    const newBalance = Math.max(-20, Math.min(20, balance + amount)); // Limitar a rango [-20, 20]
    setBalance(newBalance);
    setHistory([...history, `${type}: ${amount > 0 ? '+' : ''}${amount} 💰`]);
  };

  return (
    <div className="max-w-4xl mx-auto bg-slate-800 p-8 rounded-3xl shadow-2xl border border-slate-700">
      <h2 className="text-3xl font-bold text-blue-400 mb-2">La Magia del Dinero en Z</h2>
      <p className="text-slate-400 mb-8">Mira cómo tu balance de dinero se mueve en la recta numérica:</p>

      {/* Visualización Híbrida */}
      <div className="bg-slate-900 p-8 rounded-2xl border border-slate-700 mb-8 flex flex-col items-center">
        <div className="mb-8 w-full overflow-x-auto">
          <NumberLine position={balance} />
        </div>
        <div className="flex items-center gap-4 text-2xl font-bold font-mono">
          <Wallet className="text-yellow-400" />
          <span>Balance:</span>
          <span className={`text-4xl ${balance >= 0 ? 'text-green-400' : 'text-red-500'}`}>
            {balance} 💰
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="grid grid-cols-2 gap-4">
          <button onClick={() => updateBalance(5, 'Pago')} className="bg-green-600 hover:bg-green-700 p-4 rounded-xl flex flex-col items-center gap-2">
            <TrendingUp /> Pago (+5)
          </button>
          <button onClick={() => updateBalance(-5, 'Compra')} className="bg-red-600 hover:bg-red-700 p-4 rounded-xl flex flex-col items-center gap-2">
            <TrendingDown /> Compra (-5)
          </button>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-700 h-40 overflow-y-auto space-y-2 text-sm font-mono text-slate-400">
          {history.map((h, i) => <div key={i} className="border-b border-slate-800 pb-1">{h}</div>)}
        </div>
      </div>

      <div className="mt-10 flex justify-end">
        <button onClick={onComplete} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2">
          Entendido, ¡vamos a practicar! <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
