import { useParams, useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';
import Header from '../components/Header';
import { practicasDisponibles } from '../data/practicasIndex';

export default function TemaPage() {
  const { categoria, subtema } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReproduciendo, setVideoReproduciendo] = useState(false);
  
  const clave = `${categoria}/${subtema}`;
  const practica = practicasDisponibles[clave];
  const rutaVolver =
    subtema === 'propiedades-combinadas' || subtema === 'operaciones-combinadas'
      ? `/temas/${categoria}/ejercicios-combinados`
      : `/temas/${categoria}`;

  if (!practica) {
    return <div className="min-h-screen bg-slate-900 text-slate-100 p-6">Tema no encontrado</div>;
  }

  if (practica.disponible === false) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100">
        <Header />

        <main className="p-6 max-w-4xl mx-auto">
          <button onClick={() => navigate(rutaVolver)} className="mb-4 text-slate-400 hover:text-white">
            ← Volver
          </button>

          <div className="bg-slate-800 border border-slate-700 p-8 rounded-2xl text-center">
            <span className="inline-block px-3 py-1 rounded-md text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30 mb-4">
              Próximamente
            </span>
            <h1 className="text-3xl font-bold mb-3">{practica.titulo}</h1>
            <p className="text-slate-400 max-w-xl mx-auto mb-6">
              Este tema y su práctica interactiva paso a paso estarán disponibles próximamente.
            </p>
            <button
              onClick={() => navigate(rutaVolver)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold transition-colors"
            >
              Volver a Ejercicios Combinados
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <Header />

      <main className="p-6 max-w-4xl mx-auto">
        <button onClick={() => navigate(rutaVolver)} className="mb-4 text-slate-400 hover:text-white">
          ← Volver
        </button>
        
        <h1 className="text-3xl font-bold capitalize mb-6">{practica.titulo}</h1>
        
        <div className="bg-slate-800 p-6 rounded-2xl mb-8">
          <h2 className="text-xl mb-4">{practica.titulo}</h2>
          <div className="relative aspect-video bg-slate-700 rounded-lg flex items-center justify-center overflow-hidden">
            <video
              key={practica.videoUrl}
              ref={videoRef}
              controls
              poster="/images/poster-math-step.png"
              className="w-full aspect-video rounded-lg"
              onPlay={() => setVideoReproduciendo(true)}
            >
              <source src={practica.videoUrl} type="video/mp4" />
              Tu navegador no soporta la reproducción de video.
            </video>

            {!videoReproduciendo && (
              <div 
                className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg cursor-pointer"
                onClick={() => {
                  videoRef.current?.play();
                  setVideoReproduciendo(true);
                }}
              >
                <div className="text-center">
                  <div className="bg-white/90 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 hover:scale-110 transition-transform">
                    <span className="text-4xl">▶️</span>
                  </div>
                  <p className="text-white text-lg font-semibold drop-shadow-lg">
                    Reproducir Video
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="text-center mb-6">
          <p className="text-lg md:text-xl text-slate-300 mb-2">
            Aprende a dominar este tema en nuestra sección de práctica.
          </p>
          <p className="text-base text-slate-400 mb-6">
            Elige tu nivel: <span className="text-green-400 font-semibold">Básico</span>, 
            <span className="text-yellow-400 font-semibold"> Medio</span> o 
            <span className="text-red-400 font-semibold"> Experto</span>.
          </p>
          
          <button 
            onClick={() => navigate(`/temas/${categoria}/${subtema}/practica`)} 
            className="px-6 py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold transition-colors text-lg"
          >
            🚀 Ir a la Práctica
          </button>
        </div>
      </main>
    </div>
  );
}
