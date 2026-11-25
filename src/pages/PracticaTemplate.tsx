import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ChevronLeft, Lightbulb } from 'lucide-react';
import { practicasDisponibles, TipoPractica } from "../data/practicasIndex";
import VideoPlayer from '../components/VideoPlayer';
import confetti from 'canvas-confetti';
import Header from '../components/Header';
import { formatMath } from '../utils/mathFormatter';
import RendererSimple from '../components/RendererSimple';
import RendererPasoAPaso from '../components/RendererPasoAPaso';

export default function PracticaTemplate() {
  const navigate = useNavigate();
  const { categoria, subtema } = useParams();
  const clave = `${categoria}/${subtema}`;
  const practica = practicasDisponibles[clave];

  if (!practica) {
    return <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center">Práctica no encontrada para {clave}</div>;
  }

  if (practica.disponible === false) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100">
        <Header />
        <main className="p-6 max-w-4xl mx-auto text-center py-16">
          <h1 className="text-2xl font-bold mb-3">{practica.titulo}</h1>
          <p className="text-slate-400 mb-6">Esta práctica estará disponible próximamente.</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold transition-colors"
          >
            ← Volver
          </button>
        </main>
      </div>
    );
  }

  const [searchParams] = useSearchParams();
  const tipoUrl = searchParams.get('tipo') as TipoPractica | null;
  const nivelGuardado = (localStorage.getItem('mathstep_nivel') || 'basico') as any;
  const [tipo, setTipo] = useState<TipoPractica | undefined>(
    tipoUrl || (practica.tipos ? practica.tipos[0] : undefined)
  );
  const [ejercicios, setEjercicios] = useState(() => practica.generarEjercicios(nivelGuardado, tipo));
  const [esPrimeraVez, setEsPrimeraVez] = useState(false);
  
  const [ejercicioActual, setEjercicioActual] = useState(0);
  // ... (rest of state stays same)
  const [respuestaInput, setRespuestaInput] = useState('');
  const [feedback, setFeedback] = useState<'correcto' | 'incorrecto' | null>(null);
  const [pistaVisible, setPistaVisible] = useState(false);
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [correctos, setCorrectos] = useState(0);
  const [modalVideo, setModalVideo] = useState(false);
  const [intentosFallidos, setIntentosFallidos] = useState(0);
  const [mostrarRespuesta, setMostrarRespuesta] = useState(false);
  const [inputBloqueado, setInputBloqueado] = useState(false);
  const [tipoPropiedadFallida, setTipoPropiedadFallida] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const felicitacionesRef = useRef<HTMLDivElement>(null);

  // Sync default tipo when switching subtopics
  useEffect(() => {
    setTipo(tipoUrl || (practica.tipos ? practica.tipos[0] : undefined));
    setTipoPropiedadFallida(null);
  }, [clave, practica, tipoUrl]);

  // Update exercises when tipo changes
  useEffect(() => {
    setEjercicios(practica.generarEjercicios(nivelGuardado, tipo));
    setEjercicioActual(0);
    setCorrectos(0);
    setMostrarResultados(false);
    setIntentosFallidos(0);
    setMostrarRespuesta(false);
    setInputBloqueado(false);
    setRespuestaInput('');
    setFeedback(null);
  }, [nivelGuardado, tipo, practica]);

  useEffect(() => {
    const yaVisito = localStorage.getItem('mathstep_visito_practica');
    if (!yaVisito) {
      setEsPrimeraVez(true);
    }
  }, []);

  useEffect(() => {
    if (inputRef.current && !inputBloqueado) {
      inputRef.current.focus();
    }
  }, [ejercicioActual, inputBloqueado]);

  useEffect(() => {
    if (feedback === 'correcto' && felicitacionesRef.current) {
      const timer = setTimeout(() => {
        felicitacionesRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 120);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  const handleCerrarBienvenida = () => {
    setEsPrimeraVez(false);
    localStorage.setItem('mathstep_visito_practica', 'true');
  };

  const handleComprobar = (forzarResultado?: boolean, tipoPropiedad?: string) => {
    const esCorrecto =
      typeof forzarResultado === 'boolean'
        ? forzarResultado
        : respuestaInput.trim() !== '' && Number(respuestaInput) === Number(ejercicio.respuesta);

    if (esCorrecto) {
      setFeedback('correcto');
      setCorrectos(correctos + 1);
      setIntentosFallidos(0);
      setMostrarRespuesta(false);
      setInputBloqueado(true);
      setTipoPropiedadFallida(null);
    } else {
      setFeedback('incorrecto');
      setIntentosFallidos(prev => prev + 1);
      setInputBloqueado(true);
      setTipoPropiedadFallida(tipoPropiedad || null);
    }
  };

  const handleSiguiente = () => {
    if (ejercicioActual < ejercicios.length - 1) {
      setEjercicioActual(ejercicioActual + 1);
      setRespuestaInput('');
      setFeedback(null);
      setPistaVisible(false);
      setIntentosFallidos(0);
      setMostrarRespuesta(false);
      setInputBloqueado(false);
      setTipoPropiedadFallida(null);
    } else {
      setMostrarResultados(true);
    }
  };

  const handleReintentar = () => {
    setRespuestaInput('');
    setFeedback(null);
    setPistaVisible(false);
    setMostrarRespuesta(false);
    setInputBloqueado(false);
    setTipoPropiedadFallida(null);
  };

  const handleVolverAPracticar = () => {
    confetti.reset();
    const nivelGuardado = (localStorage.getItem('mathstep_nivel') || 'basico') as any;
    setEjercicios(practica.generarEjercicios(nivelGuardado, tipo));
    setEjercicioActual(0);
    setCorrectos(0);
    setMostrarResultados(false);
    setIntentosFallidos(0);
    setMostrarRespuesta(false);
    setInputBloqueado(false);
    setRespuestaInput('');
    setFeedback(null);
    setTipoPropiedadFallida(null);
  };

  const handleCambiarNivel = (nuevoNivel: any) => {
    confetti.reset();
    localStorage.setItem('mathstep_nivel', nuevoNivel);
    setEjercicios(practica.generarEjercicios(nuevoNivel, tipo));
    setEjercicioActual(0);
    setCorrectos(0);
    setMostrarResultados(false);
    setIntentosFallidos(0);
    setMostrarRespuesta(false);
    setInputBloqueado(false);
    setRespuestaInput('');
    setFeedback(null);
    setTipoPropiedadFallida(null);
  };

  const handleVerResultados = () => {
    setMostrarResultados(true);
  };

  const handleRepasarCaso = () => {
    setModalVideo(true);
  };

  const cerrarModal = () => {
    setModalVideo(false);
  };

  const ejercicio = ejercicios[ejercicioActual];
  const esUltimoEjercicio = ejercicioActual === ejercicios.length - 1;

  const getVideoTimestamp = () => {
    if (tipoPropiedadFallida) {
      const mapaCombinadas: Record<string, keyof typeof practica.timestamps> = {
        regla: 'regla',
        multiplicacion: 'ejemplo1',
        division: 'ejemplo2',
        potencia: 'ejemplo3',
        basico: 'ejemplo1',
        medio: 'ejemplo2',
        experto: 'ejemplo3',
      };
      const clavePropiedad = mapaCombinadas[tipoPropiedadFallida];
      if (clavePropiedad && practica.timestamps[clavePropiedad]) {
        return practica.timestamps[clavePropiedad];
      }
    }

    const claveDefault = practica.timestamps[ejercicio.caso as keyof typeof practica.timestamps]
      ? ejercicio.caso
      : `caso${ejercicio.caso}`;
    return (
      practica.timestamps[claveDefault as keyof typeof practica.timestamps] ||
      Object.values(practica.timestamps)[0]
    );
  };

  const videoTimestamp = getVideoTimestamp();

  if (mostrarResultados) {
    const precision = Math.round((correctos / ejercicios.length) * 100);
    return (
      <PantallaResultados 
        correctos={correctos} 
        total={ejercicios.length} 
        precision={precision} 
        navigate={navigate} 
        handleVolverAPracticar={handleVolverAPracticar}
        nivelActual={nivelGuardado}
        onCambiarNivel={handleCambiarNivel}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <Header />
      
      <main className="p-4 sm:p-6 max-w-4xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center text-slate-400 hover:text-slate-200 mb-3 sm:mb-6">
          <ChevronLeft /> Volver al tema
        </button>

        <div className="max-w-2xl mx-auto">
          {esPrimeraVez && (
            <div className="bg-violet-900/50 border border-violet-500 rounded-lg p-4 mb-6 relative">
              <button 
                onClick={handleCerrarBienvenida}
                className="absolute top-2 right-2 text-slate-400 hover:text-white"
              >
                ✕
              </button>
              <p className="text-violet-200 font-semibold mb-1">
                👋 ¡Bienvenido a la Práctica!
              </p>
              <p className="text-slate-300 text-sm">
                Por defecto empezarás en nivel <strong>Básico</strong>. 
                Puedes cambiar el nivel en cualquier momento en 
                <strong> ⚙️ Configuración</strong>.
              </p>
            </div>
          )}

          <h1 className="text-xl sm:text-2xl font-bold text-slate-100 mb-1.5 sm:mb-2">✏️ Practica: {practica.titulo}</h1>
          <p className="text-base sm:text-lg text-slate-300 mb-1">Ejercicio {ejercicioActual + 1} de {ejercicios.length}</p>
          <div className="w-full bg-[#EFF6FF] h-3 sm:h-4 rounded-full mb-4 sm:mb-6">
            <div className="bg-[#3B82F6] h-3 sm:h-4 rounded-full" style={{ width: `${((ejercicioActual + 1) / ejercicios.length) * 100}%` }}></div>
          </div>

          {practica.tipos && practica.tipos.length > 1 && !tipoUrl && (
            <div className="flex gap-2 mb-6 justify-center flex-wrap">
              {practica.tipos.map(t => (
                <button 
                  key={t}
                  onClick={() => setTipo(t)}
                  className={`px-4 py-2 rounded-lg font-bold ${tipo === t ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300'}`}
                >
                  {t === 'signos'
                    ? 'Ley de los Signos'
                    : t === 'propiedades'
                    ? 'Propiedades de la Potenciación'
                    : t === 'combinadas'
                    ? 'Propiedades Combinadas'
                    : t}
                </button>
              ))}
            </div>
          )}

          {ejercicio.pasos ? (
            <RendererPasoAPaso 
              ejercicio={ejercicio}
              inputBloqueado={inputBloqueado}
              ejercicioCompletado={feedback === 'correcto'}
              handleComprobar={handleComprobar}
              respuestaInput={respuestaInput}
              setRespuestaInput={setRespuestaInput}
              pistaVisible={pistaVisible}
              setPistaVisible={setPistaVisible}
            />
          ) : (
            <RendererSimple 
              ejercicio={ejercicio}
              respuestaInput={respuestaInput}
              setRespuestaInput={setRespuestaInput}
              inputBloqueado={inputBloqueado}
              ejercicioCompletado={feedback === 'correcto'}
              handleComprobar={handleComprobar}
              pistaVisible={pistaVisible}
              setPistaVisible={setPistaVisible}
            />
          )}



          {feedback === 'correcto' && (
            <div ref={felicitacionesRef} className="bg-slate-800 border border-emerald-900 p-5 sm:p-6 rounded-xl flex flex-col items-center gap-6 animate-fade-in">
              <div className="flex flex-col md:flex-row items-center gap-5 md:gap-8">
                <img src="/images/lapiz-aprobado.png" alt="Lápiz aprobado" className="w-28 h-28 md:w-36 md:h-36 flex-shrink-0 animate-bounce" />
                <div className="text-center md:text-left">
                  <p className="text-2xl font-bold text-emerald-400 mb-2">🎉 ¡Felicitaciones!</p>
                  <p className="text-base sm:text-lg text-slate-300 mb-3">
                    {clave === 'aritmetica/operaciones-combinadas'
                      ? `Has comprendido ${ejercicio.casoNombre}.`
                      : `Has comprendido el Caso ${ejercicio.caso}.`}
                  </p>
                  {!ejercicio.pasos && (
                    <p className="text-base md:text-lg text-slate-400 mb-3">{formatMath(ejercicio.explicacion)}</p>
                  )}
                  <p className="text-xl sm:text-2xl font-bold text-emerald-400">
                    {formatMath(ejercicio.operacion)}{' '}
                    <span className="whitespace-nowrap">= {ejercicio.respuesta} ✅</span>
                  </p>
                </div>
              </div>
              {esUltimoEjercicio ? (
                <div className="flex flex-col items-center">
                  <p className="text-lg md:text-xl text-green-300 mb-4">
                    ¡Buen trabajo! Finalizaste tu práctica.
                  </p>
                  <button 
                    onClick={handleVerResultados}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-lg font-semibold text-lg"
                  >
                    Revisa tus Resultados →
                  </button>
                </div>
              ) : (
                <button 
                  onClick={handleSiguiente}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-lg font-semibold text-lg"
                >
                  Siguiente ejercicio →
                </button>
              )}
            </div>
          )}

          {feedback === 'incorrecto' && (
            <div className="bg-slate-800 border border-rose-900 p-6 rounded-lg text-rose-300 flex flex-col items-center gap-8">
              <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
                <img src="/images/lapiz-desaprobado.png" alt="Lápiz pensativo" className="w-32 h-32 md:w-40 md:h-40 flex-shrink-0" />
                <div className="text-center md:text-left">
                  <p className="text-2xl font-bold text-red-300 mb-2">Aún no es correcto.</p>
                  <p className="text-lg md:text-xl text-slate-300 mb-4">¡Inténtalo de nuevo!</p>
                  <p className="text-base md:text-lg text-slate-400">
                    {ejercicio.caso === 'combinadas'
                      ? 'Con este ejercicio estás aprendiendo las Propiedades Combinadas de la Potenciación.'
                      : clave === 'aritmetica/operaciones-combinadas'
                      ? `Con este ejercicio estás aprendiendo ${ejercicio.casoNombre}.`
                      : `Con este ejercicio estás aprendiendo el Caso ${ejercicio.caso}: ${ejercicio.casoNombre}.`}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4 justify-center mb-4">
                <button onClick={handleRepasarCaso} className="bg-violet-500 hover:bg-violet-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2">
                  📺 Repasar {ejercicio.caso === 'signos' ? 'Ley de los Signos' : ejercicio.caso === 'propiedades' ? 'Propiedades' : ejercicio.caso === 'combinadas' ? 'Propiedades Combinadas' : clave === 'aritmetica/operaciones-combinadas' ? 'Operaciones Combinadas' : `el Caso ${ejercicio.caso}`}
                </button>
                
                {intentosFallidos < 3 && (
                  <button onClick={handleReintentar} className="bg-violet-500 hover:bg-violet-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2">🔄 Reintentar</button>
                )}
              </div>
              
              {intentosFallidos >= 3 && !mostrarRespuesta && (
                <button 
                  onClick={() => setMostrarRespuesta(true)}
                  title="Después de 3 intentos fallidos"
                  className="mt-4 text-slate-500 hover:text-slate-300 bg-slate-700 px-6 py-2 rounded-lg"
                >
                  👁️ Ver Respuesta
                </button>
              )}
              
              {mostrarRespuesta && (
                <div className="mt-6 p-4 bg-slate-900 rounded-lg border border-slate-700 text-center">
                  <p className="text-2xl font-bold text-blue-400 mb-2">{formatMath(ejercicio.operacion)} = {ejercicio.respuesta}</p>
                  <p className="text-base text-slate-300 mb-4">{formatMath(ejercicio.explicacion)}</p>
                  <button onClick={handleSiguiente} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold">Siguiente ejercicio →</button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {modalVideo && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-4 w-full max-w-3xl relative">
            <button 
              onClick={cerrarModal}
              className="absolute -top-3 -right-3 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg text-gray-700 font-bold z-10"
            >
              ✕
            </button>
            <VideoPlayer 
              videoUrl={practica.videoUrl}
              startTime={videoTimestamp.inicio}
              endTime={videoTimestamp.fin}
              onEnd={cerrarModal}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function PantallaResultados({ correctos, total, precision, handleVolverAPracticar, nivelActual, onCambiarNivel }: any) {
  useEffect(() => {
    const colors = ['#8B5CF6', '#A78BFA', '#C4B5FD', '#FBBF24', '#F59E0B', '#10B981', '#3B82F6'];
    
    // Un pequeño delay para que el componente se monte visualmente
    const timer = setTimeout(() => {
      // 1. Explosión central
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: colors,
        gravity: 0.8,
        ticks: 150
      });

      // 2. Explosión izquierda
      setTimeout(() => {
        confetti({
          particleCount: 80,
          angle: 60,
          spread: 70,
          origin: { x: 0, y: 0.7 },
          colors: colors,
          gravity: 0.8,
          ticks: 150
        });
      }, 200);

      // 3. Explosión derecha
      setTimeout(() => {
        confetti({
          particleCount: 80,
          angle: 120,
          spread: 70,
          origin: { x: 1, y: 0.7 },
          colors: colors,
          gravity: 0.8,
          ticks: 150
        });
      }, 400);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const incorrectos = total - correctos;
  const niveles: any[] = ['basico', 'medio', 'experto'];
  const indiceActual = niveles.indexOf(nivelActual);
  const nivelSiguiente = niveles[indiceActual + 1];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <Header />
      <div className="p-8 flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="flex flex-col items-center gap-8 max-w-lg w-full">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
            <img src="/images/lapiz-trofeo.png" alt="Lápiz con trofeo" className="w-32 h-32 md:w-40 md:h-40 flex-shrink-0 animate-bounce" />
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold mb-4">🎉 ¡Terminaste!</h1>
              <p className="text-xl mb-2">Completaste los {total} ejercicios.</p>
              
              <div className="space-y-1 mt-4 text-left">
                <p className="text-xl">✅ Correctos: {correctos} / {total}</p>
                <p className="text-xl">🤔 Incorrectos: {incorrectos} / {total}</p>
                <p className="text-xl font-bold">📊 Precisión: {precision}%</p>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 w-full text-center">
            {precision >= 80 ? (
              <>
                <p className="text-lg mb-2">
                  🌟 ¡Felicidades! Has dominado el Nivel {nivelActual.charAt(0).toUpperCase() + nivelActual.slice(1)}.
                </p>
                {nivelSiguiente ? (
                  <>
                    <p className="text-slate-400 mb-4">¿Listo para el siguiente reto?</p>
                    <button 
                      onClick={() => onCambiarNivel(nivelSiguiente)} 
                      className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-lg font-bold w-full transition-colors"
                    >
                      🚀 Probar el Nivel {nivelSiguiente.charAt(0).toUpperCase() + nivelSiguiente.slice(1)}
                    </button>
                  </>
                ) : (
                  <p className="text-emerald-400 font-semibold">¡Has alcanzado el nivel máximo!</p>
                )}
              </>
            ) : (
              <p className="text-lg">Sigue practicando el Nivel {nivelActual.charAt(0).toUpperCase() + nivelActual.slice(1)}. ¡Vas por buen camino!</p>
            )}
          </div>

          <button onClick={handleVolverAPracticar} className="text-slate-400 hover:text-white underline">Volver a Practicar ({nivelActual.charAt(0).toUpperCase() + nivelActual.slice(1)})</button>
        </div>
      </div>
    </div>
  );
}
