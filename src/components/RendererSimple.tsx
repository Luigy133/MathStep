import React, { useEffect, useRef } from 'react';
import { Lightbulb } from 'lucide-react';
import { formatMath } from '../utils/mathFormatter';

export default function RendererSimple({
  ejercicio,
  respuestaInput,
  setRespuestaInput,
  inputBloqueado,
  ejercicioCompletado,
  handleComprobar,
  pistaVisible,
  setPistaVisible,
}: any) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!inputBloqueado && inputRef.current) {
      inputRef.current.focus();
    }
  }, [ejercicio.id, inputBloqueado]);

  const esNumeroValido = (val: string): boolean =>
    val.trim() !== '' && val.trim() !== '-' && !Number.isNaN(Number(val));

  const normalizarInputNumerico = (raw: string): string => {
    const cleaned = raw.replace(/\s+/g, '');
    const esNegativo = cleaned.startsWith('-');
    const digitos = cleaned.replace(/[^0-9]/g, '');
    return esNegativo ? `-${digitos}` : digitos;
  };

  const handleToggleSigno = () => {
    const actual = respuestaInput || '';
    const siguiente = actual.startsWith('-') ? actual.slice(1) : `-${actual}`;
    setRespuestaInput(siguiente);
    inputRef.current?.focus();
  };

  const mostrarPista = !ejercicioCompletado && !inputBloqueado && Boolean(ejercicio.pista);

  return (
    <>
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 mb-6">Resuelve: {formatMath(ejercicio.operacion)} = ?</h2>
      <div className="flex items-stretch gap-2 mb-4">
        <input
          ref={inputRef}
          autoFocus
          type="text"
          inputMode="numeric"
          pattern="-?[0-9]*"
          value={respuestaInput}
          onChange={(e) => setRespuestaInput(normalizarInputNumerico(e.target.value))}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && esNumeroValido(respuestaInput) && !inputBloqueado) {
              handleComprobar(Number(respuestaInput) === Number(ejercicio.respuesta));
            }
          }}
          disabled={inputBloqueado}
          className="flex-1 min-w-0 border-2 border-[#CBD5E1] rounded-lg p-3.5 sm:p-4 text-xl focus:border-[#3B82F6] outline-none bg-slate-100 text-slate-900 disabled:opacity-50"
          placeholder="Escribe tu respuesta..."
        />
        <button
          type="button"
          disabled={inputBloqueado}
          onClick={handleToggleSigno}
          aria-label="Cambiar signo positivo o negativo"
          className={`min-w-[56px] px-3 rounded-lg border-2 font-bold text-lg transition-all active:scale-95 disabled:opacity-50 select-none flex-shrink-0 ${
            (respuestaInput || '').startsWith('-')
              ? 'bg-blue-600/30 border-blue-400 text-blue-200'
              : 'bg-slate-800 border-slate-500 text-slate-100 hover:bg-slate-600'
          }`}
        >
          +/−
        </button>
      </div>
      {!ejercicioCompletado && !inputBloqueado && (
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => handleComprobar(Number(respuestaInput) === Number(ejercicio.respuesta))}
            disabled={!esNumeroValido(respuestaInput) || inputBloqueado}
            className="bg-[#3B82F6] hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-bold flex-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Comprobar
          </button>
          {mostrarPista && (
            <button
              type="button"
              onClick={() => setPistaVisible(!pistaVisible)}
              className={`px-4 py-3 rounded-lg flex items-center justify-center gap-2 font-medium border transition-colors ${
                pistaVisible
                  ? 'bg-amber-950/70 border-amber-400 text-amber-200'
                  : 'bg-slate-800 hover:bg-slate-700 border-slate-600 text-amber-300'
              }`}
            >
              <Lightbulb size={18} /> Pista
            </button>
          )}
        </div>
      )}
      {pistaVisible && mostrarPista && (
        <div className="bg-amber-950/50 border border-amber-500/40 p-4 rounded-lg mb-4 text-amber-200 text-sm">
          💡 {ejercicio.pista}
        </div>
      )}
    </>
  );
}
