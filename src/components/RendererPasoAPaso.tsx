import React, { useState, useEffect, useRef } from 'react';
import { Lightbulb, CheckCircle2 } from 'lucide-react';
import { formatMath } from '../utils/mathFormatter';

export default function RendererPasoAPaso({
  ejercicio,
  inputBloqueado,
  ejercicioCompletado,
  handleComprobar,
  setRespuestaInput,
  pistaVisible,
  setPistaVisible,
}: any) {
  const pasos = ejercicio.pasos || [];
  const [pasoActual, setPasoActual] = useState(0);
  const [respuestas, setRespuestas] = useState<string[]>(() => new Array(pasos.length).fill(''));
  const [subRespuestas, setSubRespuestas] = useState<string[]>(() => new Array(pasos.length).fill(''));
  const [subPasosActivos, setSubPasosActivos] = useState<boolean[]>(() => new Array(pasos.length).fill(false));
  const [pistaSeleccion, setPistaSeleccion] = useState<string | null>(null);
  const [opcionErronea, setOpcionErronea] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const prevInputBloqueadoRef = useRef<boolean>(inputBloqueado);
  const prevEjercicioIdRef = useRef(ejercicio.id);

  useEffect(() => {
    prevEjercicioIdRef.current = ejercicio.id;
    prevInputBloqueadoRef.current = inputBloqueado;
    setPasoActual(0);
    setRespuestas(new Array(pasos.length).fill(''));
    setSubRespuestas(new Array(pasos.length).fill(''));
    setSubPasosActivos(new Array(pasos.length).fill(false));
    setPistaSeleccion(null);
    setOpcionErronea(null);
    setRespuestaInput('');
  }, [ejercicio.id, pasos.length]);

  useEffect(() => {
    setPistaSeleccion(null);
    setOpcionErronea(null);
  }, [pasoActual]);

  // Al hacer clic en "Reintentar" (inputBloqueado pasa de true -> false en el mismo ejercicio),
  // limpiar la respuesta incorrecta del paso/sub-paso actual y devolver el foco al input.
  useEffect(() => {
    const mismoEjercicio = prevEjercicioIdRef.current === ejercicio.id;
    const fueReintento = mismoEjercicio && prevInputBloqueadoRef.current && !inputBloqueado;

    if (fueReintento) {
      const paso = pasos[pasoActual];
      const esSubPaso = paso?.tipoPaso === 'seleccion' && Boolean(paso?.subPaso) && Boolean(subPasosActivos[pasoActual]);

      if (esSubPaso) {
        setSubRespuestas((prev) => {
          const next = [...prev];
          next[pasoActual] = '';
          return next;
        });
      } else {
        setRespuestas((prev) => {
          const next = [...prev];
          next[pasoActual] = '';
          return next;
        });
      }

      setRespuestaInput('');
    }

    prevInputBloqueadoRef.current = inputBloqueado;
    prevEjercicioIdRef.current = ejercicio.id;
  }, [inputBloqueado, ejercicio.id, pasoActual, pasos, subPasosActivos, setRespuestaInput]);

  const subPasoActivoActual = Boolean(subPasosActivos[pasoActual]);

  useEffect(() => {
    if (!inputBloqueado && inputRef.current) {
      inputRef.current.focus();
    }
  }, [pasoActual, ejercicio.id, inputBloqueado, subPasoActivoActual]);

  const esNumeroValido = (val: string): boolean =>
    val.trim() !== '' && val.trim() !== '-' && !Number.isNaN(Number(val));

  const normalizarInputNumerico = (raw: string): string => {
    const cleaned = raw.replace(/\s+/g, '');
    const esNegativo = cleaned.startsWith('-');
    const digitos = cleaned.replace(/[^0-9]/g, '');
    return esNegativo ? `-${digitos}` : digitos;
  };

  const handlePasoChange = (value: string) => {
    const nuevasRespuestas = [...respuestas];
    nuevasRespuestas[pasoActual] = value;
    setRespuestas(nuevasRespuestas);
    setRespuestaInput(value);
  };

  const handleSubPasoChange = (value: string) => {
    const nuevasSubRespuestas = [...subRespuestas];
    nuevasSubRespuestas[pasoActual] = value;
    setSubRespuestas(nuevasSubRespuestas);
    setRespuestaInput(value);
  };

  const handleToggleSigno = (esSubPaso: boolean) => {
    const actual = esSubPaso ? subRespuestas[pasoActual] || '' : respuestas[pasoActual] || '';
    const siguiente = actual.startsWith('-') ? actual.slice(1) : `-${actual}`;
    if (esSubPaso) {
      handleSubPasoChange(siguiente);
    } else {
      handlePasoChange(siguiente);
    }
    inputRef.current?.focus();
  };

  const handleSeleccionarOpcion = (opcion: string) => {
    const paso = pasos[pasoActual];
    if (!paso || inputBloqueado || ejercicioCompletado) return;
    const nuevasRespuestas = [...respuestas];
    nuevasRespuestas[pasoActual] = opcion;
    setRespuestas(nuevasRespuestas);

    const respuestaEsperada = paso.respuestaCorrecta ?? paso.respuesta;
    if (opcion === respuestaEsperada) {
      setPistaSeleccion(null);
      setOpcionErronea(null);

      if (paso.subPaso) {
        const nuevasSub = [...subRespuestas];
        nuevasSub[pasoActual] = '';
        setSubRespuestas(nuevasSub);

        const nuevosSubActivos = [...subPasosActivos];
        nuevosSubActivos[pasoActual] = true;
        setSubPasosActivos(nuevosSubActivos);
        setRespuestaInput('');
        return;
      }

      if (pasoActual < pasos.length - 1) {
        const siguientePaso = pasoActual + 1;
        setRespuestas((prev) => {
          const next = [...prev];
          next[siguientePaso] = '';
          return next;
        });
        setSubRespuestas((prev) => {
          const next = [...prev];
          next[siguientePaso] = '';
          return next;
        });
        setPasoActual(siguientePaso);
        setRespuestaInput('');
      } else {
        setRespuestaInput(String(ejercicio.respuesta));
        handleComprobar(true);
      }
    } else {
      setOpcionErronea(opcion);
      setPistaSeleccion(
        paso.pistaError ||
          'Recuerda la jerarquía de operaciones: primero corchetes, luego potencias (exponentes), y después multiplicación o división.'
      );
    }
  };

  const handleComprobarPaso = () => {
    const paso = pasos[pasoActual];
    if (!paso || inputBloqueado || ejercicioCompletado) return;
    const esSubPaso = paso.tipoPaso === 'seleccion' && Boolean(paso.subPaso) && subPasosActivos[pasoActual];

    if (esSubPaso) {
      const valorUsuario = subRespuestas[pasoActual] || '';
      const esCorrecto =
        esNumeroValido(valorUsuario) && Number(valorUsuario) === Number(paso.subPaso.respuesta);

      if (esCorrecto) {
        if (pasoActual < pasos.length - 1) {
          const siguientePaso = pasoActual + 1;
          setRespuestas((prev) => {
            const next = [...prev];
            next[siguientePaso] = '';
            return next;
          });
          setSubRespuestas((prev) => {
            const next = [...prev];
            next[siguientePaso] = '';
            return next;
          });
          setPasoActual(siguientePaso);
          setRespuestaInput('');
        } else {
          setRespuestaInput(String(ejercicio.respuesta));
          handleComprobar(true);
        }
      } else {
        handleComprobar(false, paso.subPaso.tipoPropiedad || paso.tipoPropiedad);
      }
      return;
    }

    const valorUsuario = respuestas[pasoActual] || '';
    const respuestaEsperada = paso.respuestaCorrecta ?? paso.respuesta;

    const esCorrecto =
      paso.tipo === 'input'
        ? esNumeroValido(valorUsuario) && Number(valorUsuario) === Number(respuestaEsperada)
        : valorUsuario === respuestaEsperada;

    if (esCorrecto) {
      if (pasoActual < pasos.length - 1) {
        const siguientePaso = pasoActual + 1;
        setRespuestas((prev) => {
          const next = [...prev];
          next[siguientePaso] = '';
          return next;
        });
        setSubRespuestas((prev) => {
          const next = [...prev];
          next[siguientePaso] = '';
          return next;
        });
        setPasoActual(siguientePaso);
        setRespuestaInput('');
      } else {
        setRespuestaInput(String(ejercicio.respuesta));
        handleComprobar(true);
      }
    } else {
      handleComprobar(false, paso.tipoPropiedad);
    }
  };

  // Extraer valores por rol para construir el contenedor de desarrollo paso a paso
  const idxBase = pasos.findIndex((p: any) => p.rol === 'base');
  const idxOp = pasos.findIndex((p: any) => p.rol === 'operacion');
  const idxExp = pasos.findIndex((p: any) => p.rol === 'exponente');
  const idxRes = pasos.findIndex((p: any) => p.rol === 'resultado');

  const rawBase = idxBase >= 0 ? respuestas[idxBase] : '';
  const rawOp = idxOp >= 0 ? respuestas[idxOp] : '';
  const rawExp = idxExp >= 0 ? respuestas[idxExp] : '';
  const rawRes = idxRes >= 0 ? respuestas[idxRes] : '';

  const formatBase = (val: string) => {
    if (!val || val === '-') return val || '';
    const num = Number(val);
    if (!Number.isNaN(num) && num < 0) return `(${num})`;
    return val;
  };

  const baseMostrada = rawBase ? formatBase(rawBase) : '?';
  const opSimbolo = rawOp === 'Sumar' ? '+' : rawOp === 'Restar' ? '-' : '';
  const exp1 = ejercicio.exp1;
  const exp2 = ejercicio.exp2;

  const idxFinal = idxRes >= 0 ? idxRes : pasos.length - 1;
  const ultimoPaso = idxFinal >= 0 ? pasos[idxFinal] : null;
  const rawFinal =
    idxFinal >= 0
      ? ultimoPaso?.subPaso
        ? subRespuestas[idxFinal]
        : respuestas[idxFinal]
      : '';
  const tieneResultadoFinal =
    idxFinal >= 0 &&
    rawFinal !== '' &&
    Number(rawFinal) === Number(ejercicio.respuesta) &&
    inputBloqueado;

  const esCombinado = pasos.some(
    (p: any) => Boolean(p.expresionSimplificada) || Boolean(p.subPaso?.expresionSimplificada)
  );

  const getExpresionSimplificadaPaso = (p: any): string | undefined =>
    p.subPaso?.expresionSimplificada || p.expresionSimplificada;

  const getResumenCompactoPaso = (paso: any, index: number): React.ReactNode => {
    if (paso.subPaso) {
      return esCombinado ? (
        <>
          {formatMath(respuestas[index])} = {subRespuestas[index]}
        </>
      ) : (
        `${respuestas[index]} = ${subRespuestas[index]}`
      );
    }

    if (esCombinado) {
      const matchOperacionFinal = paso.pregunta?.match(/^Operación final:\s*¿cuánto es\s*(.+?)\?$/i);
      if (matchOperacionFinal) {
        return (
          <>
            {formatMath(matchOperacionFinal[1])} = {respuestas[index]}
          </>
        );
      }

      const matchPotenciaFinal = paso.pregunta?.match(/^Calcula la potencia final:\s*(.+?)\s*=\s*\?$/i);
      if (matchPotenciaFinal) {
        return (
          <>
            {formatMath(matchPotenciaFinal[1])} = {respuestas[index]}
          </>
        );
      }

      return (
        <>
          {formatMath(paso.pregunta)} → {respuestas[index]}
        </>
      );
    }

    return `${paso.pregunta} ${respuestas[index]}`;
  };

  const completadoFinal = Boolean(ejercicioCompletado) || tieneResultadoFinal;

  const parsearOpcionDosNiveles = (op: string): { etiqueta?: string; expresion: string } => {
    const match = op.match(
      /^(Paréntesis|Corchetes|Llaves|Potencia|Multiplicación|División|Suma|Resta|Operación)\s+(.+)$/i
    );
    if (match) {
      return { etiqueta: match[1], expresion: match[2] };
    }
    return { expresion: op };
  };

  const getPreguntaPaso = (paso: any): string => {
    if (!esCombinado) return paso.pregunta;
    if (paso.tipoPaso === 'seleccion' && /^En .+,\s*¿qué operación sigue\?$/i.test(paso.pregunta)) {
      return '¿Qué operación sigue?';
    }
    return paso.pregunta;
  };

  const renderDesarrollo = () => {
    if (esCombinado) {
      const pasosCompletadosCount = completadoFinal ? pasos.length : pasoActual;
      const expresionesAMostrar = pasos
        .slice(0, pasosCompletadosCount)
        .map(getExpresionSimplificadaPaso)
        .filter((expr: string | undefined): expr is string => Boolean(expr));

      if (expresionesAMostrar.length === 0) {
        return (
          <span className="flex items-center justify-center flex-wrap gap-x-2 gap-y-1">
            <span>{formatMath(ejercicio.operacion)}</span>
          </span>
        );
      }

      const expresionActual = expresionesAMostrar[expresionesAMostrar.length - 1];

      return (
        <div className="flex flex-col items-center justify-center gap-1 w-full">
          <div className="text-xs sm:text-sm font-medium text-slate-400 leading-snug">
            {formatMath(ejercicio.operacion)}
          </div>
          <div className="flex items-center justify-center flex-wrap gap-x-2 text-lg sm:text-2xl font-bold text-emerald-300 leading-snug">
            <span className="text-slate-400">=</span>
            <span>{formatMath(expresionActual)}</span>
          </div>
        </div>
      );
    }

    if (!rawBase) {
      return (
        <span className="flex items-center justify-center flex-wrap gap-x-2">
          <span>{formatMath(ejercicio.operacion)}</span>
        </span>
      );
    }

    const tieneOperacionExp = Boolean(opSimbolo && exp1 !== undefined && exp2 !== undefined);
    const mostrarExpResultante = rawExp !== '' && idxExp >= 0 && pasoActual >= idxExp;

    return (
      <div className="flex flex-col items-center justify-center gap-1 w-full">
        <div className="text-xs sm:text-sm font-medium text-slate-400 leading-snug">
          {formatMath(ejercicio.operacion)}
        </div>
        <div className="flex items-center justify-center flex-wrap gap-x-1.5 text-lg sm:text-2xl font-bold text-emerald-300 leading-snug">
          <span className="text-slate-400">=</span>
          {tieneOperacionExp ? (
            <>
              <span>
                {baseMostrada}
                <sup>
                  {exp1}
                  {opSimbolo}
                  {exp2}
                </sup>
              </span>
              {mostrarExpResultante && (
                <>
                  <span className="text-slate-400">=</span>
                  <span>
                    {baseMostrada}
                    <sup>{rawExp}</sup>
                  </span>
                </>
              )}
              {rawRes !== '' && (
                <>
                  <span className="text-slate-400">=</span>
                  <span>{rawRes}</span>
                </>
              )}
            </>
          ) : mostrarExpResultante ? (
            <>
              <span>
                {baseMostrada}
                <sup>{rawExp}</sup>
              </span>
              {rawRes !== '' && (
                <>
                  <span className="text-slate-400">=</span>
                  <span>{rawRes}</span>
                </>
              )}
            </>
          ) : (
            <span>{baseMostrada}</span>
          )}
        </div>
      </div>
    );
  };

  const pasoActualObj = pasos[pasoActual];
  const mostrandoSoloSeleccion =
    pasoActualObj?.tipoPaso === 'seleccion' && !subPasosActivos[pasoActual];
  const valorInputActual =
    pasoActualObj?.tipoPaso === 'seleccion' && subPasosActivos[pasoActual]
      ? subRespuestas[pasoActual]
      : respuestas[pasoActual];

  const esPasoInputNumerico =
    (pasoActualObj?.tipoPaso === 'seleccion' &&
      subPasosActivos[pasoActual] &&
      Boolean(pasoActualObj?.subPaso)) ||
    (pasoActualObj?.tipoPaso !== 'seleccion' && pasoActualObj?.tipo === 'input');

  const valorValidoParaComprobar = esPasoInputNumerico
    ? esNumeroValido(valorInputActual || '')
    : (valorInputActual || '').trim() !== '';

  const mostrarPista = !completadoFinal && !inputBloqueado && Boolean(ejercicio.pista);
  const mostrarBarraAcciones = !completadoFinal && !inputBloqueado && (!mostrandoSoloSeleccion || mostrarPista);

  return (
    <>
      <div className="sticky top-2 z-30 bg-slate-800/95 backdrop-blur-md p-3.5 sm:p-4 rounded-xl mb-5 text-center text-lg sm:text-2xl font-bold text-blue-300 border border-slate-700 shadow-lg shadow-slate-950/60 min-h-[60px] flex items-center justify-center">
        {renderDesarrollo()}
      </div>

      {pasos.map((paso: any, index: number) => {
        const completado = index < pasoActual || completadoFinal;
        const activo = index === pasoActual && !completadoFinal;

        if (!activo && !completado) {
          return null;
        }

        if (completado) {
          return (
            <div
              key={index}
              className="mb-2 px-3 py-2 rounded-lg bg-slate-800/75 border border-emerald-700/40 flex items-center gap-2 text-sm text-emerald-300 font-medium"
            >
              <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
              <span className="leading-snug">
                {index + 1}. {getResumenCompactoPaso(paso, index)}
              </span>
            </div>
          );
        }

        const esPasoSeleccion = paso.tipoPaso === 'seleccion';
        const subPasoAbierto = Boolean(subPasosActivos[index]);
        const esSelectorLegacy = !esPasoSeleccion && paso.tipo === 'selector';
        const opciones = esPasoSeleccion
          ? paso.opciones || []
          : (paso.opciones || []).filter((op: string) => op === 'Sumar' || op === 'Restar');

        const preguntaMostrada = getPreguntaPaso(paso);

        return (
          <div
            key={index}
            className="mb-4 p-4 rounded-lg transition-all bg-slate-700 border-2 border-blue-500 animate-fade-in"
          >
            <div className="flex items-center justify-between gap-3 flex-wrap mb-2">
              <p className="font-medium text-slate-100">
                {esCombinado ? (
                  <>
                    Paso {index + 1}: {formatMath(preguntaMostrada)}
                  </>
                ) : (
                  `Paso ${index + 1}: ${preguntaMostrada}`
                )}
              </p>
            </div>

            {activo && !esPasoSeleccion && paso.tipo === 'input' && (
              <div className="flex items-stretch gap-2">
                <input
                  ref={inputRef}
                  autoFocus
                  type="text"
                  inputMode="numeric"
                  pattern="-?[0-9]*"
                  value={respuestas[index]}
                  onChange={(e) => handlePasoChange(normalizarInputNumerico(e.target.value))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && esNumeroValido(respuestas[index] || '') && !inputBloqueado) {
                      handleComprobarPaso();
                    }
                  }}
                  disabled={inputBloqueado}
                  className="flex-1 min-w-0 border-2 border-[#CBD5E1] rounded-lg p-3 text-lg focus:border-[#3B82F6] outline-none bg-slate-100 text-slate-900 disabled:opacity-50"
                  placeholder="Escribe tu respuesta..."
                />
                <button
                  type="button"
                  disabled={inputBloqueado}
                  onClick={() => handleToggleSigno(false)}
                  aria-label="Cambiar signo positivo o negativo"
                  className={`min-w-[56px] px-3 rounded-lg border-2 font-bold text-lg transition-all active:scale-95 disabled:opacity-50 select-none flex-shrink-0 ${
                    (respuestas[index] || '').startsWith('-')
                      ? 'bg-blue-600/30 border-blue-400 text-blue-200'
                      : 'bg-slate-800 border-slate-500 text-slate-100 hover:bg-slate-600'
                  }`}
                >
                  +/−
                </button>
              </div>
            )}

            {activo && esPasoSeleccion && !subPasoAbierto && (
              <div className="mt-3 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {opciones.map((op: string, opIndex: number) => {
                    const { etiqueta, expresion } = parsearOpcionDosNiveles(op);
                    return (
                      <button
                        key={`${op}-${opIndex}`}
                        type="button"
                        disabled={inputBloqueado}
                        onClick={() => handleSeleccionarOpcion(op)}
                        className={`flex flex-col items-center justify-center w-full px-4 py-3 rounded-xl border transition-all active:scale-[0.98] ${
                          opcionErronea === op
                            ? 'bg-rose-900/80 border-rose-500 text-rose-100'
                            : 'bg-slate-600/90 border-slate-500/60 text-slate-100 hover:bg-blue-600 hover:border-blue-400'
                        }`}
                      >
                        {esCombinado && etiqueta ? (
                          <>
                            <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-300/80 mb-0.5">
                              {etiqueta}
                            </span>
                            <span className="text-base sm:text-lg font-bold whitespace-nowrap">
                              {formatMath(expresion)}
                            </span>
                          </>
                        ) : (
                          <span className="text-base font-bold">
                            {esCombinado ? formatMath(op) : op}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
                {pistaSeleccion && (
                  <div className="bg-amber-950/60 border border-amber-500/60 text-amber-200 px-4 py-3 rounded-lg text-sm">
                    💡 {formatMath(pistaSeleccion)} Intenta de nuevo.
                  </div>
                )}
              </div>
            )}

            {activo && esPasoSeleccion && subPasoAbierto && paso.subPaso && (
              <div className="mt-3 space-y-3 border-t border-slate-600 pt-3 animate-fade-in">
                <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold">
                  <CheckCircle2 size={16} />
                  <span>Operación elegida: {formatMath(respuestas[index])}</span>
                </div>
                <p className="font-medium text-slate-100">{formatMath(paso.subPaso.pregunta)}</p>
                <div className="flex items-stretch gap-2">
                  <input
                    ref={inputRef}
                    autoFocus
                    type="text"
                    inputMode="numeric"
                    pattern="-?[0-9]*"
                    value={subRespuestas[index]}
                    onChange={(e) => handleSubPasoChange(normalizarInputNumerico(e.target.value))}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && esNumeroValido(subRespuestas[index] || '') && !inputBloqueado) {
                        handleComprobarPaso();
                      }
                    }}
                    disabled={inputBloqueado}
                    className="flex-1 min-w-0 border-2 border-[#CBD5E1] rounded-lg p-3 text-lg focus:border-[#3B82F6] outline-none bg-slate-100 text-slate-900 disabled:opacity-50"
                    placeholder="Escribe tu respuesta..."
                  />
                  <button
                    type="button"
                    disabled={inputBloqueado}
                    onClick={() => handleToggleSigno(true)}
                    aria-label="Cambiar signo positivo o negativo"
                    className={`min-w-[56px] px-3 rounded-lg border-2 font-bold text-lg transition-all active:scale-95 disabled:opacity-50 select-none flex-shrink-0 ${
                      (subRespuestas[index] || '').startsWith('-')
                        ? 'bg-blue-600/30 border-blue-400 text-blue-200'
                        : 'bg-slate-800 border-slate-500 text-slate-100 hover:bg-slate-600'
                    }`}
                  >
                    +/−
                  </button>
                </div>
              </div>
            )}

            {activo && esSelectorLegacy && (
              <div className="flex gap-3 mt-2">
                {opciones.map((op: string, opIndex: number) => (
                  <button
                    key={`${op}-${opIndex}`}
                    type="button"
                    disabled={inputBloqueado}
                    onClick={() => handlePasoChange(op)}
                    className={`flex-1 px-4 py-2.5 rounded-lg font-bold transition-colors ${
                      respuestas[index] === op
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-600 text-slate-200 hover:bg-slate-500'
                    }`}
                  >
                    {op}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {mostrarBarraAcciones && (
        <div className="flex gap-3 mb-6">
          {!mostrandoSoloSeleccion && (
            <button
              onClick={handleComprobarPaso}
              disabled={!valorValidoParaComprobar || inputBloqueado}
              className="bg-[#3B82F6] hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-bold flex-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Comprobar paso
            </button>
          )}
          {mostrarPista && (
            <button
              type="button"
              onClick={() => setPistaVisible(!pistaVisible)}
              className={`px-4 py-3 rounded-lg flex items-center justify-center gap-2 font-medium border transition-colors ${
                mostrandoSoloSeleccion ? 'w-full' : ''
              } ${
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
