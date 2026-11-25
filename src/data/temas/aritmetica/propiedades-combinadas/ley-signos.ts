export type Nivel = 'basico' | 'medio' | 'experto';
export type TipoCombinadas = 'combinadas';
export type TipoPropiedadPaso = 'regla' | 'multiplicacion' | 'division' | 'potencia';

export interface SubPasoCalculo {
  pregunta: string;
  respuesta: number;
  tipo: 'input';
  expresionSimplificada: string;
  tipoPropiedad?: TipoPropiedadPaso;
}

export interface PasoEjercicio {
  pregunta: string;
  respuesta: number | string;
  tipo: 'input' | 'selector';
  tipoPaso: 'input' | 'seleccion';
  opciones?: string[];
  respuestaCorrecta?: string;
  pistaError?: string;
  subPaso?: SubPasoCalculo;
  rol?: 'base' | 'operacion' | 'exponente' | 'resultado';
  expresionSimplificada?: string;
  tipoPropiedad?: TipoPropiedadPaso;
}

export interface Ejercicio {
  id: number;
  operacion: string;
  respuesta: number;
  caso: string;
  casoNombre: string;
  pista: string;
  explicacion: string;
  pasos: PasoEjercicio[];
}

export const infoSubtemaPropiedadesCombinadas = {
  id: 'propiedades-combinadas',
  titulo: 'Propiedades Combinadas de la Potenciación',
  subtitulo: 'Multiplicación, división y potencia de potencia',
  videoUrl: '/assets/poten_propied_combinadas.mp4?v=3',
  youtubeId: '',
  poster: '/images/poster-math-step.png',
  timestamps: {
    regla: { inicio: 19, fin: 69 },      // Regla de Oro
    ejemplo1: { inicio: 77, fin: 106 },  // Ejemplo 1 (Básico: 1:17 - 1:46)
    ejemplo2: { inicio: 107, fin: 140 }, // Ejemplo 2 (Medio: 1:47 - 2:20)
    ejemplo3: { inicio: 141, fin: 184 }, // Ejemplo 3 (Experto: 2:21 - 3:04)
  },
};

export function generarEjerciciosPropiedadesCombinadas(
  nivel: Nivel,
  _tipo: TipoCombinadas = 'combinadas'
): Ejercicio[] {
  const randomInt = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  const pickBase = (lvl: Nivel): number => {
    const positivas = [2, 3, 4, 5];
    const absBase = positivas[randomInt(0, positivas.length - 1)];
    if (lvl === 'experto' && Math.random() < 0.5) {
      return -absBase;
    }
    return absBase;
  };

  const getMaxExpFinal = (base: number, lvl: Nivel): number => {
    const abs = Math.abs(base);
    if (abs === 2) return lvl === 'basico' ? 4 : 5;
    if (abs === 3) return lvl === 'basico' ? 3 : 4;
    return 3;
  };

  const pickExpFinal = (maxAllowed: number, permitirUno: boolean): number => {
    const limite = Math.max(2, maxAllowed);
    if (permitirUno && Math.random() < 0.2) {
      return 1;
    }
    return randomInt(2, limite);
  };

  interface PasoOperacionSpec {
    exprActual: string;
    operacionCorrecta: 'Potencia de potencia' | 'Multiplicación' | 'División';
    opciones: string[];
    pistaError: string;
    preguntaInput: string;
    preguntaInputDirecto?: string;
    respuestaInput: number;
    expresionSimplificada: string;
    tipoPropiedad: TipoPropiedadPaso;
  }

  const construirPasosCombinados = (
    operaciones: PasoOperacionSpec[],
    pasoFinalExpr: string,
    resultadoFinal: number
  ): PasoEjercicio[] => {
    const pasosOperaciones: PasoEjercicio[] = operaciones.map((op, index) => {
      const operacionesPendientes = operaciones.length - index;

      // Si solo queda una operación pendiente, pasar directamente al input numérico
      if (operacionesPendientes <= 1) {
        return {
          pregunta: op.preguntaInputDirecto || op.preguntaInput,
          respuesta: op.respuestaInput,
          tipo: 'input',
          tipoPaso: 'input',
          expresionSimplificada: op.expresionSimplificada,
          tipoPropiedad: op.tipoPropiedad,
        };
      }

      // Si hay más de una operación pendiente, pedir primero seleccionar la operación (jerarquía) y luego calcularla
      return {
        pregunta:
          index === 0
            ? '¿Qué operación debemos resolver primero?'
            : `En ${op.exprActual}, ¿qué operación sigue?`,
        respuesta: op.operacionCorrecta,
        respuestaCorrecta: op.operacionCorrecta,
        tipo: 'selector',
        tipoPaso: 'seleccion',
        opciones: op.opciones,
        pistaError: op.pistaError,
        tipoPropiedad: 'regla',
        subPaso: {
          pregunta: op.preguntaInput,
          respuesta: op.respuestaInput,
          tipo: 'input',
          expresionSimplificada: op.expresionSimplificada,
          tipoPropiedad: op.tipoPropiedad,
        },
      };
    });

    return [
      ...pasosOperaciones,
      {
        pregunta: `Calcula la potencia final: ${pasoFinalExpr} = ?`,
        respuesta: resultadoFinal,
        tipo: 'input',
        tipoPaso: 'input',
        expresionSimplificada: `${resultadoFinal}`,
        tipoPropiedad: 'regla',
      },
    ];
  };

  const envolver = (expr: string, tieneParentesisInternos: boolean): string =>
    tieneParentesisInternos ? `[${expr}]` : `(${expr})`;

  const generarEjercicio = (lvl: Nivel, permitirUno: boolean): Ejercicio => {
    const base = pickBase(lvl);
    const baseStr = base < 0 ? `(${base})` : `${base}`;
    const maxExpFinal = getMaxExpFinal(base, lvl);

    const plantillasDisponibles =
      lvl === 'basico'
        ? ['multDiv', 'divPow', 'powDivMult']
        : ['powMultDiv', 'powDivMult', 'multPowDiv', 'multDiv', 'divPow'];

    const plantilla = plantillasDisponibles[randomInt(0, plantillasDisponibles.length - 1)];

    switch (plantilla) {
      // (b^a × b^b2) ÷ b^c  [o con corchetes si hay paréntesis internos]
      case 'multDiv': {
        const a = randomInt(2, lvl === 'basico' ? 3 : 4);
        const b2 = randomInt(2, lvl === 'basico' ? 3 : 4);
        const exp1 = a + b2; // >= 4
        const expFinal = pickExpFinal(Math.min(maxExpFinal, exp1 - 2), permitirUno);
        const c = exp1 - expFinal; // >= 2 siempre
        const resultado = Math.pow(base, expFinal);

        const exprMult = `${baseStr}^${a} × ${baseStr}^${b2}`;
        const usaCorchetes = exprMult.includes('(');
        const grupoMult = envolver(exprMult, usaCorchetes);
        const nombreGrupoSing = usaCorchetes ? 'corchete' : 'paréntesis';
        const nombreGrupoPl = usaCorchetes ? 'corchetes' : 'paréntesis';

        const opInicial = `${grupoMult} ÷ ${baseStr}^${c}`;
        const paso1Expr = `${baseStr}^${exp1} ÷ ${baseStr}^${c}`;
        const paso2Expr = `${baseStr}^${expFinal}`;

        return {
          id: Math.random(),
          operacion: opInicial,
          respuesta: resultado,
          caso: 'combinadas',
          casoNombre: 'Propiedades Combinadas',
          pista: `Primero multiplica las potencias dentro del ${nombreGrupoSing} (suma exponentes) y luego divide (resta exponentes).`,
          explicacion: `${opInicial} = ${paso1Expr} = ${paso2Expr} = ${resultado}`,
          pasos: construirPasosCombinados(
            [
              {
                exprActual: opInicial,
                operacionCorrecta: 'Multiplicación',
                opciones: ['Multiplicación', 'División'],
                pistaError: `Recuerda la jerarquía: primero resolvemos lo que está dentro de los ${nombreGrupoPl} (aquí hay una multiplicación).`,
                preguntaInput: `¿Cuál es el exponente resultante de ${grupoMult}?`,
                respuestaInput: exp1,
                expresionSimplificada: paso1Expr,
                tipoPropiedad: 'multiplicacion',
              },
              {
                exprActual: paso1Expr,
                operacionCorrecta: 'División',
                opciones: ['Multiplicación', 'División'],
                pistaError: `Ya resolviste los ${nombreGrupoPl}. En la expresión restante tenemos una división (÷) de igual base.`,
                preguntaInput: `¿Cuál es el exponente resultante de ${paso1Expr}?`,
                preguntaInputDirecto: `División de igual base: en ${paso1Expr}, ¿cuál es el exponente resultante?`,
                respuestaInput: expFinal,
                expresionSimplificada: paso2Expr,
                tipoPropiedad: 'division',
              },
            ],
            paso2Expr,
            resultado
          ),
        };
      }

      // (b^a ÷ b^b2)^c  [o con corchetes si hay paréntesis internos]
      case 'divPow': {
        const c = maxExpFinal >= 3 && Math.random() < 0.35 ? 3 : 2;
        const maxExp1 = Math.max(1, Math.floor(maxExpFinal / c));
        const exp1 = randomInt(1, maxExp1);
        const b2 = randomInt(2, lvl === 'basico' ? 3 : 4);
        const a = b2 + exp1; // a > b2 y a >= 3
        const expFinal = exp1 * c; // >= 2
        const resultado = Math.pow(base, expFinal);

        const exprDiv = `${baseStr}^${a} ÷ ${baseStr}^${b2}`;
        const usaCorchetes = exprDiv.includes('(');
        const grupoDiv = envolver(exprDiv, usaCorchetes);
        const nombreGrupoSing = usaCorchetes ? 'corchete' : 'paréntesis';
        const nombreGrupoPl = usaCorchetes ? 'corchetes' : 'paréntesis';

        const opInicial = `${grupoDiv}^${c}`;
        const paso1Expr = `(${baseStr}^${exp1})^${c}`;
        const paso2Expr = `${baseStr}^${expFinal}`;

        return {
          id: Math.random(),
          operacion: opInicial,
          respuesta: resultado,
          caso: 'combinadas',
          casoNombre: 'Propiedades Combinadas',
          pista: `Primero divide las potencias dentro del ${nombreGrupoSing} (resta exponentes) y luego aplica potencia de potencia (multiplica exponentes).`,
          explicacion: `${opInicial} = ${paso1Expr} = ${paso2Expr} = ${resultado}`,
          pasos: construirPasosCombinados(
            [
              {
                exprActual: opInicial,
                operacionCorrecta: 'División',
                opciones: ['Potencia de potencia', 'División'],
                pistaError: `Recuerda la jerarquía: primero resolvemos la operación dentro de los ${nombreGrupoPl} (aquí hay una división) antes del exponente exterior.`,
                preguntaInput: `¿Cuál es el exponente resultante de ${grupoDiv}?`,
                respuestaInput: exp1,
                expresionSimplificada: paso1Expr,
                tipoPropiedad: 'division',
              },
              {
                exprActual: paso1Expr,
                operacionCorrecta: 'Potencia de potencia',
                opciones: ['Potencia de potencia', 'División'],
                pistaError: `Ya resolviste los ${nombreGrupoPl}. Ahora queda una potencia elevada a otro exponente: aplica potencia de potencia.`,
                preguntaInput: `¿Cuál es el exponente resultante de ${paso1Expr}?`,
                preguntaInputDirecto: `Potencia de potencia: en ${paso1Expr}, ¿cuál es el exponente resultante?`,
                respuestaInput: expFinal,
                expresionSimplificada: paso2Expr,
                tipoPropiedad: 'potencia',
              },
            ],
            paso2Expr,
            resultado
          ),
        };
      }

      // [(b^a)^b2 × b^c] ÷ b^d
      case 'powMultDiv': {
        const a = randomInt(2, 3);
        const b2 = randomInt(2, lvl === 'experto' ? 3 : 2);
        const c = randomInt(2, 4);
        const exp1 = a * b2; // >= 4
        const exp2 = exp1 + c; // >= 6
        const expFinal = pickExpFinal(Math.min(maxExpFinal, exp2 - 2), permitirUno);
        const d = exp2 - expFinal; // >= 2 siempre
        const resultado = Math.pow(base, expFinal);

        const potStr = `(${baseStr}^${a})^${b2}`;
        const exprGrupoInicial = `${potStr} × ${baseStr}^${c}`;
        const grupoInicial = envolver(exprGrupoInicial, exprGrupoInicial.includes('('));
        const opInicial = `${grupoInicial} ÷ ${baseStr}^${d}`;

        const exprGrupoPaso1 = `${baseStr}^${exp1} × ${baseStr}^${c}`;
        const usaCorchetesPaso1 = exprGrupoPaso1.includes('(');
        const grupoPaso1 = envolver(exprGrupoPaso1, usaCorchetesPaso1);
        const nombreGrupoPaso1Pl = usaCorchetesPaso1 ? 'corchetes' : 'paréntesis';

        const paso1Expr = `${grupoPaso1} ÷ ${baseStr}^${d}`;
        const paso2Expr = `${baseStr}^${exp2} ÷ ${baseStr}^${d}`;
        const paso3Expr = `${baseStr}^${expFinal}`;

        return {
          id: Math.random(),
          operacion: opInicial,
          respuesta: resultado,
          caso: 'combinadas',
          casoNombre: 'Propiedades Combinadas',
          pista: 'Sigue el orden: 1) Potencia de potencia, 2) Multiplicación dentro del agrupador, 3) División final.',
          explicacion: `${opInicial} = ${paso1Expr} = ${paso2Expr} = ${paso3Expr} = ${resultado}`,
          pasos: construirPasosCombinados(
            [
              {
                exprActual: opInicial,
                operacionCorrecta: 'Potencia de potencia',
                opciones: ['Potencia de potencia', 'Multiplicación', 'División'],
                pistaError:
                  'Recuerda la jerarquía: dentro de los corchetes primero resolvemos los paréntesis y exponentes (potencia de potencia) antes de multiplicar.',
                preguntaInput: `¿Cuál es el exponente resultante de ${potStr}?`,
                respuestaInput: exp1,
                expresionSimplificada: paso1Expr,
                tipoPropiedad: 'potencia',
              },
              {
                exprActual: paso1Expr,
                operacionCorrecta: 'Multiplicación',
                opciones: ['Multiplicación', 'División'],
                pistaError: `Recuerda la jerarquía: primero terminamos lo que está dentro de los ${nombreGrupoPaso1Pl} (multiplicación) antes de dividir.`,
                preguntaInput: `¿Cuál es el exponente resultante de ${grupoPaso1}?`,
                respuestaInput: exp2,
                expresionSimplificada: paso2Expr,
                tipoPropiedad: 'multiplicacion',
              },
              {
                exprActual: paso2Expr,
                operacionCorrecta: 'División',
                opciones: ['Multiplicación', 'División'],
                pistaError: `Ya resolviste los ${nombreGrupoPaso1Pl} y exponentes. Ahora queda una división (÷) de igual base.`,
                preguntaInput: `¿Cuál es el exponente resultante de ${paso2Expr}?`,
                preguntaInputDirecto: `División de igual base: en ${paso2Expr}, ¿cuál es el exponente resultante?`,
                respuestaInput: expFinal,
                expresionSimplificada: paso3Expr,
                tipoPropiedad: 'division',
              },
            ],
            paso3Expr,
            resultado
          ),
        };
      }

      // (b^a)^b2 ÷ (b^c × b^d)  [o con corchetes si hay paréntesis internos]
      case 'powDivMult': {
        const pares =
          lvl === 'experto'
            ? [
                [2, 3],
                [3, 2],
                [3, 3],
                [2, 4],
              ]
            : [
                [2, 3],
                [3, 2],
              ];
        const [a, b2] = pares[randomInt(0, pares.length - 1)];
        const exp1 = a * b2; // >= 6
        const expFinal = pickExpFinal(Math.min(maxExpFinal, exp1 - 4), permitirUno);
        const exp2 = exp1 - expFinal; // >= 4
        const c = randomInt(2, exp2 - 2);
        const d = exp2 - c; // >= 2 siempre
        const resultado = Math.pow(base, expFinal);

        const potStr = `(${baseStr}^${a})^${b2}`;
        const exprMult = `${baseStr}^${c} × ${baseStr}^${d}`;
        const usaCorchetesMult = exprMult.includes('(');
        const grupoMult = envolver(exprMult, usaCorchetesMult);
        const nombreGrupoSing = usaCorchetesMult ? 'corchete' : 'paréntesis';
        const nombreGrupoPl = usaCorchetesMult ? 'corchetes' : 'paréntesis';

        const opInicial = `${potStr} ÷ ${grupoMult}`;
        const paso1Expr = `${baseStr}^${exp1} ÷ ${grupoMult}`;
        const paso2Expr = `${baseStr}^${exp1} ÷ ${baseStr}^${exp2}`;
        const paso3Expr = `${baseStr}^${expFinal}`;

        return {
          id: Math.random(),
          operacion: opInicial,
          respuesta: resultado,
          caso: 'combinadas',
          casoNombre: 'Propiedades Combinadas',
          pista: `Resuelve primero la potencia de potencia, luego la multiplicación dentro del ${nombreGrupoSing} y al final divide restando exponentes.`,
          explicacion: `${opInicial} = ${paso1Expr} = ${paso2Expr} = ${paso3Expr} = ${resultado}`,
          pasos: construirPasosCombinados(
            [
              {
                exprActual: opInicial,
                operacionCorrecta: 'Potencia de potencia',
                opciones: ['Potencia de potencia', 'Multiplicación', 'División'],
                pistaError:
                  'Recuerda la jerarquía (PEMDAS) y el orden de izquierda a derecha: primero resolvemos la potencia de potencia antes que la multiplicación o la división.',
                preguntaInput: `¿Cuál es el exponente resultante de ${potStr}?`,
                respuestaInput: exp1,
                expresionSimplificada: paso1Expr,
                tipoPropiedad: 'potencia',
              },
              {
                exprActual: paso1Expr,
                operacionCorrecta: 'Multiplicación',
                opciones: ['Multiplicación', 'División'],
                pistaError: `Ya resolviste la potencia de potencia. Ahora resolvemos la multiplicación agrupada dentro de los ${nombreGrupoPl} antes de dividir.`,
                preguntaInput: `¿Cuál es el exponente resultante de ${grupoMult}?`,
                respuestaInput: exp2,
                expresionSimplificada: paso2Expr,
                tipoPropiedad: 'multiplicacion',
              },
              {
                exprActual: paso2Expr,
                operacionCorrecta: 'División',
                opciones: ['Multiplicación', 'División'],
                pistaError: `Ya resolviste exponentes y ${nombreGrupoPl}. Ahora sigue la división (÷) de igual base.`,
                preguntaInput: `¿Cuál es el exponente resultante de ${paso2Expr}?`,
                preguntaInputDirecto: `División de igual base: en ${paso2Expr}, ¿cuál es el exponente resultante?`,
                respuestaInput: expFinal,
                expresionSimplificada: paso3Expr,
                tipoPropiedad: 'division',
              },
            ],
            paso3Expr,
            resultado
          ),
        };
      }

      // (b^a × b^b2)^c ÷ b^d  [o con corchetes si hay paréntesis internos]
      case 'multPowDiv':
      default: {
        const a = randomInt(2, 3);
        const b2 = randomInt(2, 3);
        const c = 2;
        const exp1 = a + b2; // 4..6
        const exp2 = exp1 * c; // 8..12
        const expFinal = pickExpFinal(maxExpFinal, permitirUno); // 1..5
        const d = exp2 - expFinal; // >= 3
        const resultado = Math.pow(base, expFinal);

        const exprMult = `${baseStr}^${a} × ${baseStr}^${b2}`;
        const usaCorchetes = exprMult.includes('(');
        const grupoMult = envolver(exprMult, usaCorchetes);
        const nombreGrupoSing = usaCorchetes ? 'corchete' : 'paréntesis';
        const nombreGrupoPl = usaCorchetes ? 'corchetes' : 'paréntesis';

        const opInicial = `${grupoMult}^${c} ÷ ${baseStr}^${d}`;
        const paso1Expr = `(${baseStr}^${exp1})^${c} ÷ ${baseStr}^${d}`;
        const paso2Expr = `${baseStr}^${exp2} ÷ ${baseStr}^${d}`;
        const paso3Expr = `${baseStr}^${expFinal}`;

        return {
          id: Math.random(),
          operacion: opInicial,
          respuesta: resultado,
          caso: 'combinadas',
          casoNombre: 'Propiedades Combinadas',
          pista: `Resuelve primero la multiplicación dentro del ${nombreGrupoSing}, luego la potencia de potencia y por último la división.`,
          explicacion: `${opInicial} = ${paso1Expr} = ${paso2Expr} = ${paso3Expr} = ${resultado}`,
          pasos: construirPasosCombinados(
            [
              {
                exprActual: opInicial,
                operacionCorrecta: 'Multiplicación',
                opciones: ['Potencia de potencia', 'Multiplicación', 'División'],
                pistaError: `Recuerda la jerarquía: primero resolvemos lo que está dentro de los ${nombreGrupoPl} (multiplicación) antes de elevar al exponente exterior.`,
                preguntaInput: `¿Cuál es el exponente resultante de ${grupoMult}?`,
                respuestaInput: exp1,
                expresionSimplificada: paso1Expr,
                tipoPropiedad: 'multiplicacion',
              },
              {
                exprActual: paso1Expr,
                operacionCorrecta: 'Potencia de potencia',
                opciones: ['Potencia de potencia', 'División'],
                pistaError: `Ya resolviste los ${nombreGrupoPl}. Según la jerarquía, ahora sigue el exponente (potencia de potencia) antes que la división.`,
                preguntaInput: `¿Cuál es el exponente resultante de (${baseStr}^${exp1})^${c}?`,
                respuestaInput: exp2,
                expresionSimplificada: paso2Expr,
                tipoPropiedad: 'potencia',
              },
              {
                exprActual: paso2Expr,
                operacionCorrecta: 'División',
                opciones: ['Multiplicación', 'División'],
                pistaError: `Ya resolviste ${nombreGrupoPl} y exponentes. Ahora sigue la división (÷) de igual base.`,
                preguntaInput: `¿Cuál es el exponente resultante de ${paso2Expr}?`,
                preguntaInputDirecto: `División de igual base: en ${paso2Expr}, ¿cuál es el exponente resultante?`,
                respuestaInput: expFinal,
                expresionSimplificada: paso3Expr,
                tipoPropiedad: 'division',
              },
            ],
            paso3Expr,
            resultado
          ),
        };
      }
    }
  };

  const ejercicios: Ejercicio[] = [];
  const operacionesUsadas = new Set<string>();
  let cantidadConExpUno = 0;
  let intentos = 0;
  const maxIntentos = 300;

  while (ejercicios.length < 8 && intentos < maxIntentos) {
    intentos++;
    const permitirUno = cantidadConExpUno < 2;
    const nuevo = generarEjercicio(nivel, permitirUno);
    if (!operacionesUsadas.has(nuevo.operacion)) {
      operacionesUsadas.add(nuevo.operacion);
      if (Math.abs(nuevo.respuesta) === Math.abs(Number(nuevo.operacion.match(/\(-?\d+\)|\d+/)?.[0].replace(/[()]/g, '')))) {
        cantidadConExpUno++;
      }
      ejercicios.push(nuevo);
    }
  }

  return ejercicios;
}
