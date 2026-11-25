import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, BarChart3, User, ChevronLeft, CheckCircle } from 'lucide-react';

export default function ConfiguracionPage() {
  const navigate = useNavigate();
  const [nivel, setNivel] = useState(localStorage.getItem('mathstep_nivel') || 'basico');
  const [mensaje, setMensaje] = useState('');

  const niveles = [
    { id: 'basico', nombre: 'Básico', descripcion: 'Números del 1 al 10. Ideal para empezar.', color: 'text-green-400' },
    { id: 'medio', nombre: 'Medio', descripcion: 'Números del 10 al 25. Un poco más de reto.', color: 'text-yellow-400' },
    { id: 'experto', nombre: 'Experto', descripcion: 'Números del 20 al 50. Para verdaderos maestros.', color: 'text-red-400' },
  ];

  const handleGuardar = () => {
    localStorage.setItem('mathstep_nivel', nivel);
    setMensaje('¡Nivel guardado!');
    setTimeout(() => {
      setMensaje('');
      navigate(-1);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-slate-800 border-b border-slate-700">
        <button className="flex items-center gap-2 text-xl font-bold" onClick={() => navigate('/')}>
          <img src="/images/logo.png" alt="MathStep" className="h-10 w-auto" />
        </button>
        <div className="flex gap-4">
          <button onClick={() => navigate('/configuracion')}><Settings /></button>
          <button onClick={() => navigate('/progreso')}><BarChart3 /></button>
          <button onClick={() => navigate('/perfil')}><User /></button>
        </div>
      </header>

      <main className="p-6 max-w-2xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center text-slate-400 hover:text-white mb-6">
          <ChevronLeft /> Volver
        </button>

        <h1 className="text-3xl font-bold mb-2">⚙️ Configuración</h1>
        <p className="text-slate-400 mb-8">Ajusta tu experiencia de aprendizaje.</p>

        <div className="space-y-4 mb-8">
          <h2 className="text-xl font-semibold mb-4">Nivel de dificultad:</h2>
          {niveles.map((n) => (
            <button
              key={n.id}
              onClick={() => setNivel(n.id)}
              className={`w-full p-6 rounded-xl border-2 transition-all flex items-center justify-between ${
                nivel === n.id ? 'border-violet-500 bg-slate-800' : 'border-slate-700 bg-slate-800 hover:border-slate-500'
              }`}
            >
              <div className="text-left">
                <h3 className={`text-lg font-bold ${n.color}`}>{n.nombre}</h3>
                <p className="text-slate-300">{n.descripcion}</p>
              </div>
              {nivel === n.id && <CheckCircle className="text-violet-500" />}
            </button>
          ))}
        </div>

        <button
          onClick={handleGuardar}
          className="w-full bg-violet-600 hover:bg-violet-500 text-white py-4 rounded-xl font-bold text-lg transition-colors"
        >
          Guardar Cambios
        </button>

        {mensaje && (
          <div className="mt-4 p-4 bg-green-900/50 text-green-300 text-center rounded-lg">
            {mensaje}
          </div>
        )}
      </main>
    </div>
  );
}
