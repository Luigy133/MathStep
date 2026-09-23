import { useState } from 'react';

/**
 * MathStep - Plataforma Educativa
 * Versión React + Tailwind
 */

export default function App() {
  // 'nivel' es nuestra variable de memoria. Inicia en 'inicio' (sin seleccionar)
  const [nivel, setNivel] = useState('inicio');

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
            onClick={() => setNivel('juniors')}
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
    <div className="min-h-screen bg-slate-50 p-6">
      <button 
        onClick={() => setNivel('inicio')}
        className="mb-6 text-blue-600 hover:underline"
      >
        ← Volver al inicio
      </button>

      {nivel === 'kids' ? (
        <h1 className="text-4xl font-bold text-blue-800">Bienvenido a Matemáticas-Kids</h1>
      ) : (
        <h1 className="text-4xl font-bold text-purple-800">Bienvenido a Matemáticas-Juniors</h1>
      )}
      
      {/* Aquí construiremos el contenido de cada sección después */}
    </div>
  );
}
