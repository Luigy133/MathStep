import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calculator, Triangle, Gamepad2, BookOpen, 
  Sigma, DraftingCompass, BarChart3, ChevronLeft 
} from 'lucide-react';
import ArithmeticGame from './ArithmeticGame';
import SubjectMenu from './SubjectMenu';

/**
 * MainView component holding the original app logic
 */
export default function MainView() {
  const [nivel, setNivel] = useState('inicio');
  const [juniorsSubView, setJuniorsSubView] = useState<'main' | 'arithmetic' | 'menu'>('main');
  const navigate = useNavigate();

  // --- Pantalla de Bienvenida (Selector) ---
  if (nivel === 'inicio') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
        <h1 className="text-5xl font-extrabold text-slate-800 mb-4">Bienvenidos a MathStep</h1>
        <p className="text-xl text-slate-600 mb-12">Elige tu camino para comenzar:</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
          <button 
            onClick={() => setNivel('kids')}
            className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl border-b-6 border-blue-500 transition-all text-center"
          >
            <div className="text-6xl mb-4">🎈</div>
            <h2 className="text-2xl font-bold text-blue-800">Matemáticas-Kids</h2>
            <p className="text-slate-600 mt-2">Primaria: Aprende jugando.</p>
          </button>
          
          <button 
            onClick={() => { setNivel('juniors'); setJuniorsSubView('main'); }}
            className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl border-b-6 border-purple-500 transition-all text-center"
          >
            <div className="text-6xl mb-4">🚀</div>
            <h2 className="text-2xl font-bold text-purple-800">Matemáticas-Juniors</h2>
            <p className="text-slate-600 mt-2">Secundaria/Bachillerato: Refuerzo y método.</p>
          </button>
        </div>
      </div>
    );
  }

  // --- Pantalla según el nivel elegido ---
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6">
      {nivel === 'kids' ? (
        <div>
          <button onClick={() => setNivel('inicio')} className="mb-6 flex items-center text-blue-400 hover:text-blue-300 transition-colors">
            <ChevronLeft className="mr-1" /> Volver al inicio
          </button>
          <h1 className="text-4xl font-bold text-blue-400 mb-8">Bienvenido a Matemáticas-Kids</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Aritmética', icon: Calculator, color: 'text-blue-400' },
              { name: 'Geometría', icon: Triangle, color: 'text-green-400' },
              { name: 'Juegos', icon: Gamepad2, color: 'text-orange-400' },
              { name: 'Historia/Misterios', icon: BookOpen, color: 'text-purple-400' },
            ].map((item) => (
              <button key={item.name} className="p-6 bg-slate-800 rounded-2xl shadow-lg border border-slate-700 hover:border-slate-500 transition-all flex flex-col items-center">
                <item.icon className={`w-12 h-12 mb-4 ${item.color}`} />
                <span className="text-xl font-semibold">{item.name}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        // Juniors view
        juniorsSubView === 'arithmetic' ? (
          <ArithmeticGame onBack={() => setJuniorsSubView('main')} />
        ) : juniorsSubView === 'menu' ? (
          <SubjectMenu title="Aritmética" onBack={() => setJuniorsSubView('main')} />
        ) : (
          <div>
            <button onClick={() => setNivel('inicio')} className="mb-6 flex items-center text-purple-400 hover:text-purple-300 transition-colors">
              <ChevronLeft className="mr-1" /> Volver al inicio
            </button>
            <h1 className="text-4xl font-bold text-purple-400 mb-8">Bienvenido a Matemáticas-Juniors</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {[
                { name: 'Aritmética', icon: Sigma, color: 'text-blue-400', onClick: () => navigate('/temas/aritmetica') },
                { name: 'Geometría', icon: DraftingCompass, color: 'text-amber-400' },
                { name: 'Álgebra', icon: Calculator, color: 'text-purple-400' },
                { name: 'Trigonometría', icon: Triangle, color: 'text-orange-400' },
                { name: 'Estadística', icon: BarChart3, color: 'text-teal-400' },
              ].map((item) => (
                <button 
                  key={item.name} 
                  onClick={item.onClick}
                  className="p-6 bg-slate-800 rounded-2xl shadow-lg border border-slate-700 hover:border-slate-500 transition-all flex flex-col items-center"
                >
                  <item.icon className={`w-12 h-12 mb-4 ${item.color}`} />
                  <span className="text-lg font-semibold">{item.name}</span>
                </button>
              ))}
            </div>
          </div>
        )
      )}
    </div>
  );
}
