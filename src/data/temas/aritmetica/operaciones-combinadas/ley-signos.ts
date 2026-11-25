export type Nivel = 'basico' | 'medio' | 'experto';
export type TipoOperacionesCombinadas = 'basico' | 'medio' | 'experto';
export type TipoPropiedadPaso = 'regla' | 'basico' | 'medio' | 'experto';

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

export const infoSubtemaOperacionesCombinadas = {
  id: 'operaciones-combinadas',
  titulo: 'Operaciones Combinadas de Números Enteros',
  subtitulo: 'Jerarquía de operaciones con signos de agrupación',
  videoUrl: '/assets/operaciones_combinadas.mp4',
  youtubeId: '',
  poster: '/images/poster-math-step.png',
  timestamps: {
    ejemplo1: { inicio: 105, fin: 133 }, // Ejemplo 1 (Básico): 1:45 a 2:13
    ejemplo2: { inicio: 134, fin: 172 }, // Ejemplo 2 (Medio): 2:14 a 2:52
    ejemplo3: { inicio: 173, fin: 223 }, // Ejemplo 3 (Experto): 2:53 a 3:43
  },
};

export function generarEjerciciosOperacionesCombinadas(
  nivel: Nivel,
  tipo?: TipoOperacionesCombinadas
): Ejercicio[] {
  const dificultad: TipoOperacionesCombinadas = tipo || nivel;

  const randomInt = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  const pickFrom = <T,>(items: T[]): T => items[randomInt(0, items.length - 1)];

  const fmtPar = (n: number): string => (n < 0 ? `(${n})` : `${n}`);
  const fmtTerm = (n: number): string => (n >= 0 ? `+ ${n}` : `- ${Math.abs(n)}`);

  const pickDivisorExacto = (valor: number, candidatosBase: number[], fallback: number): number => {
    const absVal = Math.abs(valor);
    const candidatos = candidatosBase.filter((div) => div > 1 && absVal % div === 0);
    return candidatos.length > 0 ? pickFrom(candidatos) : fallback;
  };

  interface PasoCombinadoSpec {
    exprActual: string;
    operacionCorrecta: string;
    opciones: string[];
    pistaError: string;
    preguntaInput: string;
    preguntaInputDirecto?: string;
    respuestaInput: number;
    expresionSimplificada: string;
    tipoPropiedad: TipoPropiedadPaso;
  }

  const tieneParentesisPendientes = (expr: string): boolean => {
    if (/-\s*\(-\d+\)|\+\s*\(-\d+\)/.test(expr)) return true;
    if (/\(-\d+\)\^\d+/.test(expr)) return true;
    return /\([^()]*[+\-×÷^][^()]*\)/.test(expr.replace(/\(-\d+\)/g, ''));
  };

  const construirPasos = (
    operaciones: PasoCombinadoSpec[],
    tipoPropiedadFinal: TipoPropiedadPaso
  ): PasoEjercicio[] => {
    return operaciones.map((op, index) => {
      const operacionesPendientes = operaciones.length - index;

      // Cuando solo queda una operación pendiente, pasar directamente al input numérico
      if (operacionesPendientes <= 1) {
        return {
          pregunta: op.preguntaInputDirecto || op.preguntaInput,
          respuesta: op.respuestaInput,
          tipo: 'input',
          tipoPaso: 'input',
          expresionSimplificada: op.expresionSimplificada,
          tipoPropiedad: tipoPropiedadFinal,
        };
      }

      const hayParentesis = tieneParentesisPendientes(op.exprActual);
      const hayCorchetes = op.exprActual.includes('[');

      const opcionesUnicas = Array.from(new Set(op.opciones)).filter((opcion) => {
        if (opcion === op.operacionCorrecta) return true;
        if (hayParentesis && /^Corchetes\b/i.test(opcion)) return false;
        if ((hayParentesis || hayCorchetes) && /^Llaves\b/i.test(opcion)) return false;
        return true;
      });

      return {
        pregunta:
          index === 0
            ? '¿Qué operación debemos resolver primero?'
            : `En ${op.exprActual}, ¿qué operación sigue?`,
        respuesta: op.operacionCorrecta,
        respuestaCorrecta: op.operacionCorrecta,
        tipo: 'selector',
        tipoPaso: 'seleccion',
        opciones: opcionesUnicas,
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
  };

  // NIVEL BÁSICO: Un solo paréntesis (al principio, en medio o al final) + operaciones combinadas, sin corchetes ni llaves, números pequeños (1-10)
  const generarBasico = (): Ejercicio => {
    const plantilla = pickFrom(['b_inicio', 'b_medio', 'b_final'] as const);

    switch (plantilla) {
      // Paréntesis al principio: (a + b) × c - d ÷ e  (estilo del video: (8 + 4) × 3 - 10 ÷ 5)
      case 'b_inicio': {
        const usaSuma = Math.random() < 0.7;
        const a = usaSuma ? randomInt(3, 9) : randomInt(6, 10);
        const b = usaSuma ? randomInt(2, 8) : randomInt(1, a - 2);
        const par = usaSuma ? a + b : a - b;
        const signoPar = usaSuma ? '+' : '-';

        const c = randomInt(2, 5);
        const paresDiv = [
          [4, 2],
          [6, 2],
          [6, 3],
          [8, 2],
          [8, 4],
          [9, 3],
          [10, 2],
          [10, 5],
        ];
        const [d, e] = pickFrom(paresDiv);
        const coc = d / e;
        const prod = par * c;

        const usaRestaFuera = prod > coc && Math.random() < 0.75;
        const signoFuera = usaRestaFuera ? '-' : '+';
        const res = usaRestaFuera ? prod - coc : prod + coc;

        const opInicial = `(${a} ${signoPar} ${b}) × ${c} ${signoFuera} ${d} ÷ ${e}`;
        const p1 = `${par} × ${c} ${signoFuera} ${d} ÷ ${e}`;
        const p2 = `${prod} ${signoFuera} ${d} ÷ ${e}`;
        const p3 = `${prod} ${signoFuera} ${coc}`;

        const opPar = `Paréntesis (${a} ${signoPar} ${b})`;
        const opMult = `Multiplicación ${par} × ${c}`;
        const opDiv = `División ${d} ÷ ${e}`;

        return {
          id: Math.random(),
          operacion: opInicial,
          respuesta: res,
          caso: 'ejemplo1',
          casoNombre: 'Operaciones Combinadas (Nivel Básico)',
          pista: 'Primero resuelve el paréntesis, luego multiplicación y división de izquierda a derecha, y por último suma o resta.',
          explicacion: `${opInicial} = ${p1} = ${p2} = ${p3} = ${res}`,
          pasos: construirPasos(
            [
              {
                exprActual: opInicial,
                operacionCorrecta: opPar,
                opciones: [opPar, `Multiplicación ${b} × ${c}`, opDiv],
                pistaError: 'Siempre comenzamos resolviendo la operación dentro del paréntesis.',
                preguntaInput: `¿Cuánto es ${a} ${signoPar} ${b}?`,
                respuestaInput: par,
                expresionSimplificada: p1,
                tipoPropiedad: 'basico',
              },
              {
                exprActual: p1,
                operacionCorrecta: opMult,
                opciones: [opMult, `Operación ${c} ${signoFuera} ${d}`, opDiv],
                pistaError: 'Multiplicación y división tienen la misma jerarquía; de izquierda a derecha va primero la multiplicación.',
                preguntaInput: `¿Cuánto es ${par} × ${c}?`,
                respuestaInput: prod,
                expresionSimplificada: p2,
                tipoPropiedad: 'basico',
              },
              {
                exprActual: p2,
                operacionCorrecta: opDiv,
                opciones: [`Operación ${prod} ${signoFuera} ${d}`, opDiv],
                pistaError: 'La división tiene prioridad sobre la suma y la resta.',
                preguntaInput: `¿Cuánto es ${d} ÷ ${e}?`,
                respuestaInput: coc,
                expresionSimplificada: p3,
                tipoPropiedad: 'basico',
              },
              {
                exprActual: p3,
                operacionCorrecta: 'Operación final',
                opciones: [],
                pistaError: '',
                preguntaInput: `Operación final: ¿cuánto es ${prod} ${signoFuera} ${coc}?`,
                preguntaInputDirecto: `Operación final: ¿cuánto es ${prod} ${signoFuera} ${coc}?`,
                respuestaInput: res,
                expresionSimplificada: `${res}`,
                tipoPropiedad: 'basico',
              },
            ],
            'basico'
          ),
        };
      }

      // Paréntesis en medio: a + b × (c - d) - e ÷ f
      case 'b_medio': {
        const a = randomInt(2, 10);
        const b = randomInt(2, 5);
        const c = randomInt(4, 10);
        let d = randomInt(2, 9);
        if (d === c) d = c - 2;
        const par = c - d; // puede ser positivo o negativo

        const paresDiv = [
          [4, 2],
          [6, 2],
          [6, 3],
          [8, 2],
          [8, 4],
          [9, 3],
          [10, 2],
          [10, 5],
        ];
        const [e, f] = pickFrom(paresDiv);
        const coc = e / f;

        const prod = b * par;
        const izq = a + prod;
        const res = izq - coc;

        const opInicial = `${a} + ${b} × (${c} - ${d}) - ${e} ÷ ${f}`;
        const p1 = `${a} + ${b} × ${fmtPar(par)} - ${e} ÷ ${f}`;
        const p2 = `${a} + ${fmtPar(prod)} - ${e} ÷ ${f}`;
        const p3 = `${a} + ${fmtPar(prod)} - ${coc}`;
        const p4 = `${izq} - ${coc}`;

        const opPar = `Paréntesis (${c} - ${d})`;
        const opMult = `Multiplicación ${b} × ${fmtPar(par)}`;
        const opDiv = `División ${e} ÷ ${f}`;
        const opSuma = `Suma ${a} + ${fmtPar(prod)}`;

        return {
          id: Math.random(),
          operacion: opInicial,
          respuesta: res,
          caso: 'ejemplo1',
          casoNombre: 'Operaciones Combinadas (Nivel Básico)',
          pista: 'Resuelve primero el paréntesis del centro, luego multiplicación y división, y al final suma y resta de izquierda a derecha.',
          explicacion: `${opInicial} = ${p1} = ${p2} = ${p3} = ${p4} = ${res}`,
          pasos: construirPasos(
            [
              {
                exprActual: opInicial,
                operacionCorrecta: opPar,
                opciones: [`Suma ${a} + ${b}`, opPar, opDiv],
                pistaError: 'El paréntesis tiene la máxima prioridad sin importar en qué parte de la operación esté.',
                preguntaInput: `¿Cuánto es ${c} - ${d}?`,
                respuestaInput: par,
                expresionSimplificada: p1,
                tipoPropiedad: 'basico',
              },
              {
                exprActual: p1,
                operacionCorrecta: opMult,
                opciones: [`Suma ${a} + ${b}`, opMult, opDiv],
                pistaError: 'Entre multiplicación y división, resolvemos de izquierda a derecha.',
                preguntaInput: `¿Cuánto es ${b} × ${fmtPar(par)}?`,
                respuestaInput: prod,
                expresionSimplificada: p2,
                tipoPropiedad: 'basico',
              },
              {
                exprActual: p2,
                operacionCorrecta: opDiv,
                opciones: [opSuma, opDiv],
                pistaError: 'Resuelve la división antes de continuar con sumas y restas.',
                preguntaInput: `¿Cuánto es ${e} ÷ ${f}?`,
                respuestaInput: coc,
                expresionSimplificada: p3,
                tipoPropiedad: 'basico',
              },
              {
                exprActual: p3,
                operacionCorrecta: opSuma,
                opciones: [opSuma, `Resta ${fmtPar(prod)} - ${coc}`],
                pistaError: 'Cuando solo quedan suma y resta, resolvemos de izquierda a derecha.',
                preguntaInput: `De izquierda a derecha, ¿cuánto es ${a} + ${fmtPar(prod)}?`,
                respuestaInput: izq,
                expresionSimplificada: p4,
                tipoPropiedad: 'basico',
              },
              {
                exprActual: p4,
                operacionCorrecta: 'Resta final',
                opciones: [],
                pistaError: '',
                preguntaInput: `Operación final: ¿cuánto es ${izq} - ${coc}?`,
                preguntaInputDirecto: `Operación final: ¿cuánto es ${izq} - ${coc}?`,
                respuestaInput: res,
                expresionSimplificada: `${res}`,
                tipoPropiedad: 'basico',
              },
            ],
            'basico'
          ),
        };
      }

      // Paréntesis al final: a × b - c + d ÷ (e - f)
      case 'b_final':
      default: {
        const a = randomInt(2, 6);
        const b = randomInt(2, 5);
        const c = randomInt(1, 9);

        const divisor = pickFrom([2, 3, 4, 5]);
        const coc = divisor === 2 ? randomInt(2, 5) : divisor === 3 ? randomInt(2, 3) : 2;
        const d = divisor * coc; // entre 4 y 10

        const f = randomInt(2, 5);
        const e = f + divisor; // máximo 10

        const prod = a * b;
        const izq = prod - c;
        const res = izq + coc;

        const opInicial = `${a} × ${b} - ${c} + ${d} ÷ (${e} - ${f})`;
        const p1 = `${a} × ${b} - ${c} + ${d} ÷ ${divisor}`;
        const p2 = `${prod} - ${c} + ${d} ÷ ${divisor}`;
        const p3 = `${prod} - ${c} + ${coc}`;
        const p4 = `${izq} + ${coc}`;

        const opPar = `Paréntesis (${e} - ${f})`;
        const opMult = `Multiplicación ${a} × ${b}`;
        const opDiv = `División ${d} ÷ ${divisor}`;
        const opResta = `Resta ${prod} - ${c}`;

        return {
          id: Math.random(),
          operacion: opInicial,
          respuesta: res,
          caso: 'ejemplo1',
          casoNombre: 'Operaciones Combinadas (Nivel Básico)',
          pista: 'Aunque el paréntesis esté al final, se resuelve primero. Luego multiplica, divide y al final resta y suma de izquierda a derecha.',
          explicacion: `${opInicial} = ${p1} = ${p2} = ${p3} = ${p4} = ${res}`,
          pasos: construirPasos(
            [
              {
                exprActual: opInicial,
                operacionCorrecta: opPar,
                opciones: [opMult, `Suma ${c} + ${d}`, opPar],
                pistaError: 'Siempre resolvemos primero lo que está dentro del paréntesis, aunque esté al final.',
                preguntaInput: `¿Cuánto es ${e} - ${f}?`,
                respuestaInput: divisor,
                expresionSimplificada: p1,
                tipoPropiedad: 'basico',
              },
              {
                exprActual: p1,
                operacionCorrecta: opMult,
                opciones: [opMult, `Resta ${b} - ${c}`, opDiv],
                pistaError: 'Entre multiplicación y división, avanzamos de izquierda a derecha.',
                preguntaInput: `¿Cuánto es ${a} × ${b}?`,
                respuestaInput: prod,
                expresionSimplificada: p2,
                tipoPropiedad: 'basico',
              },
              {
                exprActual: p2,
                operacionCorrecta: opDiv,
                opciones: [opResta, opDiv],
                pistaError: 'La división tiene prioridad sobre la resta y la suma.',
                preguntaInput: `¿Cuánto es ${d} ÷ ${divisor}?`,
                respuestaInput: coc,
                expresionSimplificada: p3,
                tipoPropiedad: 'basico',
              },
              {
                exprActual: p3,
                operacionCorrecta: opResta,
                opciones: [opResta, `Suma ${c} + ${coc}`],
                pistaError: 'Entre resta y suma al mismo nivel, resolvemos de izquierda a derecha.',
                preguntaInput: `De izquierda a derecha, ¿cuánto es ${prod} - ${c}?`,
                respuestaInput: izq,
                expresionSimplificada: p4,
                tipoPropiedad: 'basico',
              },
              {
                exprActual: p4,
                operacionCorrecta: 'Suma final',
                opciones: [],
                pistaError: '',
                preguntaInput: `Operación final: ¿cuánto es ${izq} + ${coc}?`,
                preguntaInputDirecto: `Operación final: ¿cuánto es ${izq} + ${coc}?`,
                respuestaInput: res,
                expresionSimplificada: `${res}`,
                tipoPropiedad: 'basico',
              },
            ],
            'basico'
          ),
        };
      }
    }
  };

  // NIVEL MEDIO: Paréntesis dentro de corchetes (corchete al principio o en medio) y paréntesis suelto al final, números pequeños, resultados enteros
  const generarMedio = (): Ejercicio => {
    const plantilla = pickFrom(['m_video', 'm_inicio_corch', 'm_medio_corch'] as const);

    switch (plantilla) {
      // Corchete en medio tras coeficiente y paréntesis suelto al final:
      // coef [ a - (b - c) - d ] ÷ (e - f)   (ejemplo del video: -6 [ 10 - (4 - 7) - 15 ] ÷ (13 - 10))
      case 'm_video': {
        const b = randomInt(2, 6);
        const diff = randomInt(2, 4);
        const c = b + diff; // máximo 10
        const r1 = b - c; // negativo
        const absR1 = Math.abs(r1);

        const a = randomInt(6, 10);
        const corcheteVal = pickFrom([-4, -3, -2, 2, 3, 4]);
        const d = a - r1 - corcheteVal;

        const divisor = randomInt(2, 4);
        const f = randomInt(4, 10);
        const e = f + divisor;

        const coefSign = Math.random() < 0.7 ? -1 : 1;
        const coef = coefSign * divisor * randomInt(1, 2);
        const prod = coef * corcheteVal;
        const res = prod / divisor;

        const opInicial = `${coef} [ ${a} - (${b} - ${c}) - ${d} ] ÷ (${e} - ${f})`;
        const p1 = `${coef} [ ${a} - ${fmtPar(r1)} - ${d} ] ÷ (${e} - ${f})`;
        const p2 = `${coef} [ ${a} + ${absR1} - ${d} ] ÷ (${e} - ${f})`;
        const p3 = `${coef} [ ${a} + ${absR1} - ${d} ] ÷ ${divisor}`;
        const p4 = `${coef} × ${fmtPar(corcheteVal)} ÷ ${divisor}`;
        const p5 = `${prod} ÷ ${divisor}`;

        const opPar1 = `Paréntesis (${b} - ${c})`;
        const opSigno = `Paréntesis -${fmtPar(r1)}`;
        const opPar2 = `Paréntesis (${e} - ${f})`;
        const opCorch = `Corchetes [ ${a} + ${absR1} - ${d} ]`;
        const opMult = `Multiplicación ${coef} × ${fmtPar(corcheteVal)}`;

        return {
          id: Math.random(),
          operacion: opInicial,
          respuesta: res,
          caso: 'ejemplo2',
          casoNombre: 'Operaciones Combinadas con Paréntesis y Corchetes',
          pista: 'Resuelve primero todos los paréntesis (empezando por el más interno y eliminando dobles signos), luego el corchete y al final multiplica y divide de izquierda a derecha.',
          explicacion: `${opInicial} = ${p1} = ${p2} = ${p3} = ${p4} = ${p5} = ${res}`,
          pasos: construirPasos(
            [
              {
                exprActual: opInicial,
                operacionCorrecta: opPar1,
                opciones: [opPar1, opPar2],
                pistaError: 'Siempre empezamos por el paréntesis más interno dentro del corchete.',
                preguntaInput: `¿Cuánto es ${b} - ${c}?`,
                respuestaInput: r1,
                expresionSimplificada: p1,
                tipoPropiedad: 'medio',
              },
              {
                exprActual: p1,
                operacionCorrecta: opSigno,
                opciones: [opSigno, opPar2],
                pistaError: 'Primero elimina el paréntesis que quedó dentro del corchete aplicando ley de signos (- por - = +).',
                preguntaInput: `Elimina el paréntesis aplicando ley de signos: ¿cuánto es -${fmtPar(r1)}?`,
                respuestaInput: absR1,
                expresionSimplificada: p2,
                tipoPropiedad: 'medio',
              },
              {
                exprActual: p2,
                operacionCorrecta: opPar2,
                opciones: [`Suma ${a} + ${absR1}`, `Resta ${absR1} - ${d}`, opPar2],
                pistaError: 'Antes de resolver el corchete, termina de resolver todos los paréntesis.',
                preguntaInput: `¿Cuánto es ${e} - ${f}?`,
                respuestaInput: divisor,
                expresionSimplificada: p3,
                tipoPropiedad: 'medio',
              },
              {
                exprActual: p3,
                operacionCorrecta: opCorch,
                opciones: [opCorch, `Multiplicación ${coef} × [ ${a} + ${absR1} - ${d} ]`],
                pistaError: 'Ya no quedan paréntesis; ahora resuelve el corchete completo antes de multiplicar o dividir afuera.',
                preguntaInput: `Resuelve dentro del corchete: ¿cuánto es ${a} + ${absR1} - ${d}?`,
                respuestaInput: corcheteVal,
                expresionSimplificada: p4,
                tipoPropiedad: 'medio',
              },
              {
                exprActual: p4,
                operacionCorrecta: opMult,
                opciones: [opMult, `División ${fmtPar(corcheteVal)} ÷ ${divisor}`],
                pistaError: 'Multiplicación y división tienen la misma jerarquía: se resuelven de izquierda a derecha.',
                preguntaInput: `¿Cuánto es ${coef} × ${fmtPar(corcheteVal)}?`,
                respuestaInput: prod,
                expresionSimplificada: p5,
                tipoPropiedad: 'medio',
              },
              {
                exprActual: p5,
                operacionCorrecta: 'División final',
                opciones: [],
                pistaError: '',
                preguntaInput: `Operación final: ¿cuánto es ${prod} ÷ ${divisor}?`,
                preguntaInputDirecto: `Operación final: ¿cuánto es ${prod} ÷ ${divisor}?`,
                respuestaInput: res,
                expresionSimplificada: `${res}`,
                tipoPropiedad: 'medio',
              },
            ],
            'medio'
          ),
        };
      }

      // Corchete al principio y paréntesis suelto al final:
      // [ a × (b - c) ± d ] ÷ (e - f)
      case 'm_inicio_corch': {
        const b = randomInt(2, 7);
        let c = randomInt(2, 9);
        if (c === b) c = b + 2;
        const r1 = b - c;

        const a = pickFrom([-4, -3, -2, 2, 3, 4]);
        const prod1 = a * r1;

        const divisor = randomInt(2, 4);
        let f = randomInt(2, 8);
        let e = f + divisor;
        if (e === b && f === c) {
          f += 1;
          e += 1;
        }

        const res = pickFrom([-5, -4, -3, -2, 2, 3, 4, 5]);
        const corcheteVal = res * divisor;
        let d = corcheteVal - prod1;
        if (d === 0) d = divisor;
        const corcheteReal = prod1 + d;
        const resReal = corcheteReal / divisor;

        const termD = fmtTerm(d);
        const opD = d >= 0 ? 'Suma' : 'Resta';
        const opInicial = `[ ${a} × (${b} - ${c}) ${termD} ] ÷ (${e} - ${f})`;
        const p1 = `[ ${a} × ${fmtPar(r1)} ${termD} ] ÷ (${e} - ${f})`;
        const p2 = `[ ${a} × ${fmtPar(r1)} ${termD} ] ÷ ${divisor}`;
        const p3 = `[ ${prod1} ${termD} ] ÷ ${divisor}`;
        const p4 = `${corcheteReal} ÷ ${divisor}`;

        const opPar1 = `Paréntesis (${b} - ${c})`;
        const opPar2 = `Paréntesis (${e} - ${f})`;
        const opMult = `Multiplicación ${a} × ${fmtPar(r1)}`;
        const opCorch = `Corchetes [ ${prod1} ${termD} ]`;

        return {
          id: Math.random(),
          operacion: opInicial,
          respuesta: resReal,
          caso: 'ejemplo2',
          casoNombre: 'Operaciones Combinadas con Paréntesis y Corchetes',
          pista: 'Resuelve primero todos los paréntesis, luego la multiplicación y suma/resta dentro del corchete, y al final divide.',
          explicacion: `${opInicial} = ${p1} = ${p2} = ${p3} = ${p4} = ${resReal}`,
          pasos: construirPasos(
            [
              {
                exprActual: opInicial,
                operacionCorrecta: opPar1,
                opciones: [opPar1, opPar2],
                pistaError: 'Resuelve primero el paréntesis interno dentro del corchete.',
                preguntaInput: `¿Cuánto es ${b} - ${c}?`,
                respuestaInput: r1,
                expresionSimplificada: p1,
                tipoPropiedad: 'medio',
              },
              {
                exprActual: p1,
                operacionCorrecta: opPar2,
                opciones: [opMult, opPar2],
                pistaError: 'Primero resuelve todos los paréntesis pendientes antes de continuar con el corchete.',
                preguntaInput: `¿Cuánto es ${e} - ${f}?`,
                respuestaInput: divisor,
                expresionSimplificada: p2,
                tipoPropiedad: 'medio',
              },
              {
                exprActual: p2,
                operacionCorrecta: opMult,
                opciones: [opMult, `${opD} ${fmtPar(r1)} ${termD}`],
                pistaError: 'Dentro del corchete, la multiplicación va antes que la suma o resta.',
                preguntaInput: `¿Cuánto es ${a} × ${fmtPar(r1)}?`,
                respuestaInput: prod1,
                expresionSimplificada: p3,
                tipoPropiedad: 'medio',
              },
              {
                exprActual: p3,
                operacionCorrecta: opCorch,
                opciones: [opCorch, `División [ ${prod1} ${termD} ] ÷ ${divisor}`],
                pistaError: 'Termina primero el corchete completo antes de dividir.',
                preguntaInput: `Resuelve el corchete: ¿cuánto es ${prod1} ${termD}?`,
                respuestaInput: corcheteReal,
                expresionSimplificada: p4,
                tipoPropiedad: 'medio',
              },
              {
                exprActual: p4,
                operacionCorrecta: 'División final',
                opciones: [],
                pistaError: '',
                preguntaInput: `Operación final: ¿cuánto es ${corcheteReal} ÷ ${divisor}?`,
                preguntaInputDirecto: `Operación final: ¿cuánto es ${corcheteReal} ÷ ${divisor}?`,
                respuestaInput: resReal,
                expresionSimplificada: `${resReal}`,
                tipoPropiedad: 'medio',
              },
            ],
            'medio'
          ),
        };
      }

      // Corchete en medio con resta/suma inicial y paréntesis suelto al final:
      // a - [ b + c × (d - e) ] ÷ (f - g)
      case 'm_medio_corch':
      default: {
        const d = randomInt(3, 9);
        let e = randomInt(2, 9);
        if (e === d) e = d - 2;
        const r1 = d - e;

        const c = randomInt(2, 3);
        const prod = c * r1;

        let b = randomInt(4, 10);
        let corcheteVal = b + prod;
        if (corcheteVal === 0 || Math.abs(corcheteVal) === 1) {
          b += 2;
          corcheteVal = b + prod;
        }

        const divisor = pickDivisorExacto(corcheteVal, [2, 3, 4, 5], 2);
        const esDivisible = corcheteVal % divisor === 0;
        if (!esDivisible) {
          b += Math.abs(corcheteVal) % 2;
          corcheteVal = b + prod;
        }
        const divisorReal = pickDivisorExacto(corcheteVal, [2, 3, 4, 5], Math.abs(corcheteVal));
        const coc = corcheteVal / divisorReal;

        let g = randomInt(2, 7);
        let f = g + divisorReal;
        if (f === d && g === e) {
          g += 1;
          f += 1;
        }

        const a = randomInt(4, 10);
        const res = a - coc;

        const opInicial = `${a} - [ ${b} + ${c} × (${d} - ${e}) ] ÷ (${f} - ${g})`;
        const p1 = `${a} - [ ${b} + ${c} × ${fmtPar(r1)} ] ÷ (${f} - ${g})`;
        const p2 = `${a} - [ ${b} + ${c} × ${fmtPar(r1)} ] ÷ ${divisorReal}`;
        const p3 = `${a} - [ ${b} + ${fmtPar(prod)} ] ÷ ${divisorReal}`;

        const opPar1 = `Paréntesis (${d} - ${e})`;
        const opPar2 = `Paréntesis (${f} - ${g})`;
        const opMult = `Multiplicación ${c} × ${fmtPar(r1)}`;

        const pasosMedio: PasoCombinadoSpec[] = [
          {
            exprActual: opInicial,
            operacionCorrecta: opPar1,
            opciones: [`Resta ${a} - ${b}`, opPar1, opPar2],
            pistaError: 'Siempre iniciamos con el paréntesis más interno dentro del corchete.',
            preguntaInput: `¿Cuánto es ${d} - ${e}?`,
            respuestaInput: r1,
            expresionSimplificada: p1,
            tipoPropiedad: 'medio',
          },
          {
            exprActual: p1,
            operacionCorrecta: opPar2,
            opciones: [`Suma ${b} + ${c}`, opMult, opPar2],
            pistaError: 'Resuelve primero todos los paréntesis pendientes antes de continuar con el corchete.',
            preguntaInput: `¿Cuánto es ${f} - ${g}?`,
            respuestaInput: divisorReal,
            expresionSimplificada: p2,
            tipoPropiedad: 'medio',
          },
          {
            exprActual: p2,
            operacionCorrecta: opMult,
            opciones: [`Suma ${b} + ${c}`, opMult],
            pistaError: 'Dentro del corchete, la multiplicación va antes que la suma.',
            preguntaInput: `¿Cuánto es ${c} × ${fmtPar(r1)}?`,
            respuestaInput: prod,
            expresionSimplificada: p3,
            tipoPropiedad: 'medio',
          },
        ];

        const p4 = `${a} - ${fmtPar(corcheteVal)} ÷ ${divisorReal}`;
        const p5 = `${a} - ${fmtPar(coc)}`;
        let explicacionPasos = `${opInicial} = ${p1} = ${p2} = ${p3}`;

        if (prod < 0) {
          const absProd = Math.abs(prod);
          const p3b = `${a} - [ ${b} - ${absProd} ] ÷ ${divisorReal}`;
          const opSignoProd = `Paréntesis +${fmtPar(prod)}`;
          const opCorch = `Corchetes [ ${b} - ${absProd} ]`;

          pasosMedio.push(
            {
              exprActual: p3,
              operacionCorrecta: opSignoProd,
              opciones: [opSignoProd, `División [ ${b} + ${fmtPar(prod)} ] ÷ ${divisorReal}`],
              pistaError: 'Primero elimina el paréntesis dentro del corchete aplicando ley de signos (+ por - = -).',
              preguntaInput: `Elimina el paréntesis aplicando ley de signos: ¿cuánto es +${fmtPar(prod)}?`,
              respuestaInput: prod,
              expresionSimplificada: p3b,
              tipoPropiedad: 'medio',
            },
            {
              exprActual: p3b,
              operacionCorrecta: opCorch,
              opciones: [opCorch, `División [ ${b} - ${absProd} ] ÷ ${divisorReal}`],
              pistaError: 'Ya no quedan paréntesis; resuelve la operación dentro del corchete.',
              preguntaInput: `Resuelve el corchete: ¿cuánto es ${b} - ${absProd}?`,
              respuestaInput: corcheteVal,
              expresionSimplificada: p4,
              tipoPropiedad: 'medio',
            }
          );
          explicacionPasos += ` = ${p3b}`;
        } else {
          const opCorch = `Corchetes [ ${b} + ${prod} ]`;
          pasosMedio.push({
            exprActual: p3,
            operacionCorrecta: opCorch,
            opciones: [opCorch, `División [ ${b} + ${prod} ] ÷ ${divisorReal}`],
            pistaError: 'Ya no quedan paréntesis; resuelve la suma dentro del corchete.',
            preguntaInput: `Resuelve el corchete: ¿cuánto es ${b} + ${prod}?`,
            respuestaInput: corcheteVal,
            expresionSimplificada: p4,
            tipoPropiedad: 'medio',
          });
        }

        pasosMedio.push(
          {
            exprActual: p4,
            operacionCorrecta: `División ${fmtPar(corcheteVal)} ÷ ${divisorReal}`,
            opciones: [`Resta ${a} - ${fmtPar(corcheteVal)}`, `División ${fmtPar(corcheteVal)} ÷ ${divisorReal}`],
            pistaError: 'La división tiene prioridad sobre la resta.',
            preguntaInput: `¿Cuánto es ${fmtPar(corcheteVal)} ÷ ${divisorReal}?`,
            respuestaInput: coc,
            expresionSimplificada: p5,
            tipoPropiedad: 'medio',
          },
          {
            exprActual: p5,
            operacionCorrecta: 'Resta final',
            opciones: [],
            pistaError: '',
            preguntaInput: `Operación final: ¿cuánto es ${a} - ${fmtPar(coc)}?`,
            preguntaInputDirecto: `Operación final: ¿cuánto es ${a} - ${fmtPar(coc)}?`,
            respuestaInput: res,
            expresionSimplificada: `${res}`,
            tipoPropiedad: 'medio',
          }
        );

        return {
          id: Math.random(),
          operacion: opInicial,
          respuesta: res,
          caso: 'ejemplo2',
          casoNombre: 'Operaciones Combinadas con Paréntesis y Corchetes',
          pista: 'Resuelve primero los paréntesis, luego multiplicación y suma/resta dentro del corchete, divide y por último resta.',
          explicacion: `${explicacionPasos} = ${p4} = ${p5} = ${res}`,
          pasos: construirPasos(pasosMedio, 'medio'),
        };
      }
    }
  };

  const plantillasExperto = [
    'e_video',
    'e_cubo',
    'e_doble_pot',
    'e_pot_inicio',
    'e_pot_final',
    'e_doble_pot_ext',
    'e_llave_en_divisor',
    'e_corchete_en_divisor',
    'e_suma_inicial_llave',
    'e_div_con_llave_y_pot',
    'e_llave_primero_mult_pot',
  ] as const;

  type PlantillaExperto = (typeof plantillasExperto)[number];

  // NIVEL EXPERTO: Diversidad de posiciones de potencias, llaves y corchetes (dividendo o divisor), paréntesis sueltos y combinación variada de operaciones
  const generarExperto = (plantillaForzada?: PlantillaExperto): Ejercicio => {
    const plantilla = plantillaForzada ?? pickFrom([...plantillasExperto]);

    switch (plantilla) {
      // k { m [ p + q (a - b)^2 ] - r (c - d) } ÷ (e - f)   (ejemplo del video: 4 { 2 [ 6 + 3 (6 - 8)^2 ] - 4 (10 - 6) } ÷ (11 - 6))
      case 'e_video': {
        const diff1 = pickFrom([-3, -2, 2, 3]);
        const b = randomInt(4, 8);
        const a = b + diff1; // en 1..11
        const pot = diff1 * diff1;

        const q = randomInt(2, 3);
        const p = randomInt(3, 9);
        const mult1 = q * pot;
        const corcheteVal = p + mult1;

        const m = randomInt(2, 3);
        const r = randomInt(2, 4);
        const diff2 = randomInt(2, 4);
        let d = randomInt(2, 6);
        let c = d + diff2; // máximo 10
        if (c === a && d === b) {
          d += 1;
          c += 1;
        }

        const term1 = m * corcheteVal;
        const term2 = r * diff2;
        const llaveVal = term1 - term2;

        const k = randomInt(2, 5);
        const prodExt = k * llaveVal;
        const divisor = pickDivisorExacto(prodExt, [2, 3, 4, 5], k);
        let f = randomInt(2, 6);
        let e = f + divisor;
        while ((e === a && f === b) || (e === c && f === d)) {
          f += 1;
          e += 1;
        }
        const res = prodExt / divisor;

        const opInicial = `${k} { ${m} [ ${p} + ${q} (${a} - ${b})^2 ] - ${r} (${c} - ${d}) } ÷ (${e} - ${f})`;
        const p1 = `${k} { ${m} [ ${p} + ${q} × ${fmtPar(diff1)}^2 ] - ${r} (${c} - ${d}) } ÷ (${e} - ${f})`;
        const p2 = `${k} { ${m} [ ${p} + ${q} × ${pot} ] - ${r} (${c} - ${d}) } ÷ (${e} - ${f})`;
        const p3 = `${k} { ${m} [ ${p} + ${q} × ${pot} ] - ${r} × ${diff2} } ÷ (${e} - ${f})`;
        const p4 = `${k} { ${m} [ ${p} + ${q} × ${pot} ] - ${r} × ${diff2} } ÷ ${divisor}`;
        const p5 = `${k} { ${m} [ ${p} + ${mult1} ] - ${r} × ${diff2} } ÷ ${divisor}`;
        const p6 = `${k} { ${m} × ${corcheteVal} - ${r} × ${diff2} } ÷ ${divisor}`;
        const p7 = `${k} { ${term1} - ${r} × ${diff2} } ÷ ${divisor}`;
        const p8 = `${k} { ${term1} - ${term2} } ÷ ${divisor}`;
        const p9 = `${k} × ${llaveVal} ÷ ${divisor}`;
        const p10 = `${prodExt} ÷ ${divisor}`;

        const opPar1 = `Paréntesis (${a} - ${b})`;
        const opPot = `Potencia ${fmtPar(diff1)}^2`;
        const opPar2 = `Paréntesis (${c} - ${d})`;
        const opPar3 = `Paréntesis (${e} - ${f})`;
        const opMult1 = `Multiplicación ${q} × ${pot}`;
        const opCorch = `Corchetes [ ${p} + ${mult1} ]`;
        const opMult2 = `Multiplicación ${m} × ${corcheteVal}`;
        const opMult3 = `Multiplicación ${r} × ${diff2}`;
        const opLlaves = `Llaves { ${term1} - ${term2} }`;
        const opMultExt = `Multiplicación ${k} × ${llaveVal}`;

        return {
          id: Math.random(),
          operacion: opInicial,
          respuesta: res,
          caso: 'ejemplo3',
          casoNombre: 'Operaciones Combinadas con Potencias y Llaves',
          pista: 'Ve de adentro hacia afuera: 1) Paréntesis y su potencia, 2) Resto de paréntesis, 3) Corchetes (× antes de +), 4) Llaves (× antes de -), 5) Multiplicación y división.',
          explicacion: `${opInicial} = ${p1} = ${p2} = ${p4} = ${p6} = ${p8} = ${p9} = ${p10} = ${res}`,
          pasos: construirPasos(
            [
              {
                exprActual: opInicial,
                operacionCorrecta: opPar1,
                opciones: [opPar1, opPar2, opPar3],
                pistaError: 'Resolvemos primero el paréntesis más interno dentro de corchetes y llaves.',
                preguntaInput: `¿Cuánto es ${a} - ${b}?`,
                respuestaInput: diff1,
                expresionSimplificada: p1,
                tipoPropiedad: 'experto',
              },
              {
                exprActual: p1,
                operacionCorrecta: opPot,
                opciones: [opPot, `Multiplicación ${q} × ${fmtPar(diff1)}`, opPar2],
                pistaError: 'Calcula primero la potencia del paréntesis más interno antes de multiplicar o sumar.',
                preguntaInput: `Calcula la potencia: ¿cuánto es ${fmtPar(diff1)}^2?`,
                respuestaInput: pot,
                expresionSimplificada: p2,
                tipoPropiedad: 'experto',
              },
              {
                exprActual: p2,
                operacionCorrecta: opPar2,
                opciones: [opMult1, opPar2, opPar3],
                pistaError: 'Resuelve los paréntesis pendientes (empezando por el que está dentro de las llaves) antes de pasar a corchetes.',
                preguntaInput: `¿Cuánto es ${c} - ${d}?`,
                respuestaInput: diff2,
                expresionSimplificada: p3,
                tipoPropiedad: 'experto',
              },
              {
                exprActual: p3,
                operacionCorrecta: opPar3,
                opciones: [opMult1, opMult3, opPar3],
                pistaError: 'Termina de resolver el último paréntesis antes de continuar con corchetes y llaves.',
                preguntaInput: `¿Cuánto es ${e} - ${f}?`,
                respuestaInput: divisor,
                expresionSimplificada: p4,
                tipoPropiedad: 'experto',
              },
              {
                exprActual: p4,
                operacionCorrecta: opMult1,
                opciones: [`Suma ${p} + ${q}`, opMult1, opMult3],
                pistaError: 'Dentro del corchete, la multiplicación tiene mayor jerarquía que la suma.',
                preguntaInput: `¿Cuánto es ${q} × ${pot}?`,
                respuestaInput: mult1,
                expresionSimplificada: p5,
                tipoPropiedad: 'experto',
              },
              {
                exprActual: p5,
                operacionCorrecta: opCorch,
                opciones: [opCorch, opMult3],
                pistaError: 'Ya no quedan paréntesis; resuelve completamente el corchete interno antes de operar en las llaves.',
                preguntaInput: `Resuelve el corchete: ¿cuánto es ${p} + ${mult1}?`,
                respuestaInput: corcheteVal,
                expresionSimplificada: p6,
                tipoPropiedad: 'experto',
              },
              {
                exprActual: p6,
                operacionCorrecta: opMult2,
                opciones: [opMult2, opMult3],
                pistaError: 'Dentro de las llaves, resolvemos las multiplicaciones de izquierda a derecha.',
                preguntaInput: `¿Cuánto es ${m} × ${corcheteVal}?`,
                respuestaInput: term1,
                expresionSimplificada: p7,
                tipoPropiedad: 'experto',
              },
              {
                exprActual: p7,
                operacionCorrecta: opMult3,
                opciones: [`Resta ${term1} - ${r}`, opMult3],
                pistaError: 'Dentro de las llaves queda otra multiplicación antes de restar.',
                preguntaInput: `¿Cuánto es ${r} × ${diff2}?`,
                respuestaInput: term2,
                expresionSimplificada: p8,
                tipoPropiedad: 'experto',
              },
              {
                exprActual: p8,
                operacionCorrecta: opLlaves,
                opciones: [opLlaves, `Multiplicación ${k} × { ${term1} - ${term2} }`],
                pistaError: 'Termina primero de resolver la operación dentro de las llaves.',
                preguntaInput: `Resuelve las llaves: ¿cuánto es ${term1} - ${term2}?`,
                respuestaInput: llaveVal,
                expresionSimplificada: p9,
                tipoPropiedad: 'experto',
              },
              {
                exprActual: p9,
                operacionCorrecta: opMultExt,
                opciones: [opMultExt, `División ${llaveVal} ÷ ${divisor}`],
                pistaError: 'Multiplicación y división tienen igual prioridad: avanzamos de izquierda a derecha.',
                preguntaInput: `¿Cuánto es ${k} × ${llaveVal}?`,
                respuestaInput: prodExt,
                expresionSimplificada: p10,
                tipoPropiedad: 'experto',
              },
              {
                exprActual: p10,
                operacionCorrecta: 'División final',
                opciones: [],
                pistaError: '',
                preguntaInput: `Operación final: ¿cuánto es ${prodExt} ÷ ${divisor}?`,
                preguntaInputDirecto: `Operación final: ¿cuánto es ${prodExt} ÷ ${divisor}?`,
                respuestaInput: res,
                expresionSimplificada: `${res}`,
                tipoPropiedad: 'experto',
              },
            ],
            'experto'
          ),
        };
      }

      // k { m [ (a - b)^3 + c ] - n (d - e) } ÷ (f - g)
      case 'e_cubo': {
        const diff1 = pickFrom([-2, 2]);
        const b = randomInt(3, 8);
        const a = b + diff1; // en 1..10
        const pot = diff1 * diff1 * diff1; // -8 o 8

        let c = randomInt(5, 10);
        if (pot + c === 0) c += 1;

        const m = randomInt(2, 3);
        const n = randomInt(2, 4);
        const diff2 = pickFrom([-3, -2, 2, 3]);
        let e = randomInt(4, 7);
        let d = e + diff2; // en 1..10
        if (d === a && e === b) {
          e += 1;
          d += 1;
        }

        const term2 = n * diff2;
        if (m * (pot + c) - term2 === 0) {
          c += 1;
        }
        const corcheteReal = pot + c;
        const term1Real = m * corcheteReal;
        const llaveReal = term1Real - term2;

        const k = randomInt(2, 4);
        const prodExt = k * llaveReal;
        const divisor = pickDivisorExacto(prodExt, [2, 3, 4, 5], k);
        let g = randomInt(2, 5);
        let f = g + divisor; // en 4..10
        while ((f === a && g === b) || (f === d && g === e)) {
          g += 1;
          f += 1;
        }
        const res = prodExt / divisor;

        const opInicial = `${k} { ${m} [ (${a} - ${b})^3 + ${c} ] - ${n} (${d} - ${e}) } ÷ (${f} - ${g})`;
        const p1 = `${k} { ${m} [ ${fmtPar(diff1)}^3 + ${c} ] - ${n} (${d} - ${e}) } ÷ (${f} - ${g})`;
        const p2 = `${k} { ${m} [ ${pot} + ${c} ] - ${n} (${d} - ${e}) } ÷ (${f} - ${g})`;
        const p3 = `${k} { ${m} [ ${pot} + ${c} ] - ${n} × ${fmtPar(diff2)} } ÷ (${f} - ${g})`;
        const p4 = `${k} { ${m} [ ${pot} + ${c} ] - ${n} × ${fmtPar(diff2)} } ÷ ${divisor}`;
        const p5 = `${k} { ${m} × ${fmtPar(corcheteReal)} - ${n} × ${fmtPar(diff2)} } ÷ ${divisor}`;
        const p6 = `${k} { ${term1Real} - ${n} × ${fmtPar(diff2)} } ÷ ${divisor}`;
        const p7 = `${k} { ${term1Real} - ${fmtPar(term2)} } ÷ ${divisor}`;

        const opPar1 = `Paréntesis (${a} - ${b})`;
        const opPot = `Potencia ${fmtPar(diff1)}^3`;
        const opPar2 = `Paréntesis (${d} - ${e})`;
        const opPar3 = `Paréntesis (${f} - ${g})`;
        const opCorch = `Corchetes [ ${pot} + ${c} ]`;
        const opMult1 = `Multiplicación ${m} × ${fmtPar(corcheteReal)}`;
        const opMult2 = `Multiplicación ${n} × ${fmtPar(diff2)}`;
        const opMultExt = `Multiplicación ${k} × ${fmtPar(llaveReal)}`;

        const pasosCubo: PasoCombinadoSpec[] = [
          {
            exprActual: opInicial,
            operacionCorrecta: opPar1,
            opciones: [opPar1, opPar2, opPar3],
            pistaError: 'Comienza por el paréntesis más interno dentro de los corchetes.',
            preguntaInput: `¿Cuánto es ${a} - ${b}?`,
            respuestaInput: diff1,
            expresionSimplificada: p1,
            tipoPropiedad: 'experto',
          },
          {
            exprActual: p1,
            operacionCorrecta: opPot,
            opciones: [opPot, opPar2, opPar3],
            pistaError: 'Calcula primero la potencia cúbica (base negativa a exponente impar da resultado negativo).',
            preguntaInput: `Calcula la potencia: ¿cuánto es ${fmtPar(diff1)}^3?`,
            respuestaInput: pot,
            expresionSimplificada: p2,
            tipoPropiedad: 'experto',
          },
          {
            exprActual: p2,
            operacionCorrecta: opPar2,
            opciones: [`Suma ${pot} + ${c}`, opPar2, opPar3],
            pistaError: 'Resuelve primero los paréntesis pendientes antes de resolver el corchete.',
            preguntaInput: `¿Cuánto es ${d} - ${e}?`,
            respuestaInput: diff2,
            expresionSimplificada: p3,
            tipoPropiedad: 'experto',
          },
          {
            exprActual: p3,
            operacionCorrecta: opPar3,
            opciones: [`Suma ${pot} + ${c}`, opMult2, opPar3],
            pistaError: 'Termina de resolver el paréntesis exterior antes de pasar a corchetes y llaves.',
            preguntaInput: `¿Cuánto es ${f} - ${g}?`,
            respuestaInput: divisor,
            expresionSimplificada: p4,
            tipoPropiedad: 'experto',
          },
          {
            exprActual: p4,
            operacionCorrecta: opCorch,
            opciones: [opCorch, opMult2],
            pistaError: 'Ya no quedan paréntesis; resuelve completamente el corchete antes de operar en las llaves.',
            preguntaInput: `Resuelve el corchete: ¿cuánto es ${pot} + ${c}?`,
            respuestaInput: corcheteReal,
            expresionSimplificada: p5,
            tipoPropiedad: 'experto',
          },
          {
            exprActual: p5,
            operacionCorrecta: opMult1,
            opciones: [opMult1, opMult2],
            pistaError: 'Dentro de las llaves, resuelve las multiplicaciones de izquierda a derecha.',
            preguntaInput: `¿Cuánto es ${m} × ${fmtPar(corcheteReal)}?`,
            respuestaInput: term1Real,
            expresionSimplificada: p6,
            tipoPropiedad: 'experto',
          },
          {
            exprActual: p6,
            operacionCorrecta: opMult2,
            opciones: [`Resta ${term1Real} - ${n}`, opMult2],
            pistaError: 'Aún queda una multiplicación dentro de las llaves antes de restar.',
            preguntaInput: `¿Cuánto es ${n} × ${fmtPar(diff2)}?`,
            respuestaInput: term2,
            expresionSimplificada: p7,
            tipoPropiedad: 'experto',
          },
        ];

        const p8 = `${k} × ${fmtPar(llaveReal)} ÷ ${divisor}`;
        const p9 = `${prodExt} ÷ ${divisor}`;
        let explicacionPasos = `${opInicial} = ${p1} = ${p2} = ${p4} = ${p5} = ${p7}`;

        if (term2 < 0) {
          const absTerm2 = Math.abs(term2);
          const p7b = `${k} { ${term1Real} + ${absTerm2} } ÷ ${divisor}`;
          const opSignoTerm2 = `Paréntesis -${fmtPar(term2)}`;
          const opLlaves = `Llaves { ${term1Real} + ${absTerm2} }`;

          pasosCubo.push(
            {
              exprActual: p7,
              operacionCorrecta: opSignoTerm2,
              opciones: [opSignoTerm2, `Multiplicación ${k} × { ${term1Real} - ${fmtPar(term2)} }`],
              pistaError: 'Primero elimina el paréntesis dentro de las llaves aplicando ley de signos (- por - = +).',
              preguntaInput: `Elimina el paréntesis aplicando ley de signos: ¿cuánto es -${fmtPar(term2)}?`,
              respuestaInput: absTerm2,
              expresionSimplificada: p7b,
              tipoPropiedad: 'experto',
            },
            {
              exprActual: p7b,
              operacionCorrecta: opLlaves,
              opciones: [opLlaves, `Multiplicación ${k} × { ${term1Real} + ${absTerm2} }`],
              pistaError: 'Ya no quedan paréntesis ni corchetes; simplifica las llaves antes de operar afuera.',
              preguntaInput: `Resuelve las llaves: ¿cuánto es ${term1Real} + ${absTerm2}?`,
              respuestaInput: llaveReal,
              expresionSimplificada: p8,
              tipoPropiedad: 'experto',
            }
          );
          explicacionPasos += ` = ${p7b}`;
        } else {
          const opLlaves = `Llaves { ${term1Real} - ${term2} }`;
          pasosCubo.push({
            exprActual: p7,
            operacionCorrecta: opLlaves,
            opciones: [opLlaves, `Multiplicación ${k} × { ${term1Real} - ${term2} }`],
            pistaError: 'Simplifica las llaves antes de operar afuera.',
            preguntaInput: `Resuelve las llaves: ¿cuánto es ${term1Real} - ${term2}?`,
            respuestaInput: llaveReal,
            expresionSimplificada: p8,
            tipoPropiedad: 'experto',
          });
        }

        pasosCubo.push(
          {
            exprActual: p8,
            operacionCorrecta: opMultExt,
            opciones: [opMultExt, `División ${fmtPar(llaveReal)} ÷ ${divisor}`],
            pistaError: 'De izquierda a derecha, resolvemos primero la multiplicación.',
            preguntaInput: `¿Cuánto es ${k} × ${fmtPar(llaveReal)}?`,
            respuestaInput: prodExt,
            expresionSimplificada: p9,
            tipoPropiedad: 'experto',
          },
          {
            exprActual: p9,
            operacionCorrecta: 'División final',
            opciones: [],
            pistaError: '',
            preguntaInput: `Operación final: ¿cuánto es ${prodExt} ÷ ${divisor}?`,
            preguntaInputDirecto: `Operación final: ¿cuánto es ${prodExt} ÷ ${divisor}?`,
            respuestaInput: res,
            expresionSimplificada: `${res}`,
            tipoPropiedad: 'experto',
          }
        );

        return {
          id: Math.random(),
          operacion: opInicial,
          respuesta: res,
          caso: 'ejemplo3',
          casoNombre: 'Operaciones Combinadas con Potencias y Llaves',
          pista: 'Resuelve paréntesis internos y potencias cúbicas cuidando el signo, luego corchetes, llaves y al final multiplica y divide.',
          explicacion: `${explicacionPasos} = ${p8} = ${p9} = ${res}`,
          pasos: construirPasos(pasosCubo, 'experto'),
        };
      }

      // { a [ b - (c - d)^2 ] + e (f - g)^2 } ÷ (h - i)
      case 'e_doble_pot': {
        const diff1 = pickFrom([-3, -2, 2, 3]);
        const d = randomInt(4, 7);
        const c = d + diff1; // en 1..10
        const pot1 = diff1 * diff1;

        let b = randomInt(6, 10);
        if (b === pot1) b = pot1 === 9 ? 7 : 6;
        const corcheteVal = b - pot1;

        const a = pickFrom([2, 4]);
        const diff2 = pickFrom([-2, 2]);
        let g = randomInt(3, 8);
        let f = g + diff2; // en 1..10
        if (f === c && g === d) {
          g += 1;
          f += 1;
        }
        const pot2 = diff2 * diff2;
        const e = pickFrom([2, 4]);

        const term1 = a * corcheteVal;
        const term2 = e * pot2;
        if (term1 + term2 === 0 || (a === e && corcheteVal === pot2)) {
          b = b === 10 ? 8 : b + 1;
        }
        const corcheteReal = b - pot1;
        const term1Real = a * corcheteReal;
        const llaveReal = term1Real + term2; // siempre par porque a y e son pares

        const divisor = pickDivisorExacto(llaveReal, [2, 3, 4], 2);
        let i = randomInt(2, 6);
        let h = i + divisor; // máximo 10
        while ((h === c && i === d) || (h === f && i === g)) {
          i += 1;
          h += 1;
        }
        const res = llaveReal / divisor;

        const opInicial = `{ ${a} [ ${b} - (${c} - ${d})^2 ] + ${e} (${f} - ${g})^2 } ÷ (${h} - ${i})`;
        const p1 = `{ ${a} [ ${b} - ${fmtPar(diff1)}^2 ] + ${e} (${f} - ${g})^2 } ÷ (${h} - ${i})`;
        const p2 = `{ ${a} [ ${b} - ${pot1} ] + ${e} (${f} - ${g})^2 } ÷ (${h} - ${i})`;
        const p3 = `{ ${a} [ ${b} - ${pot1} ] + ${e} × ${fmtPar(diff2)}^2 } ÷ (${h} - ${i})`;
        const p4 = `{ ${a} [ ${b} - ${pot1} ] + ${e} × ${pot2} } ÷ (${h} - ${i})`;
        const p5 = `{ ${a} [ ${b} - ${pot1} ] + ${e} × ${pot2} } ÷ ${divisor}`;
        const p6 = `{ ${a} × ${fmtPar(corcheteReal)} + ${e} × ${pot2} } ÷ ${divisor}`;
        const p7 = `{ ${term1Real} + ${e} × ${pot2} } ÷ ${divisor}`;
        const p8 = `{ ${term1Real} + ${term2} } ÷ ${divisor}`;
        const p9 = `${llaveReal} ÷ ${divisor}`;

        const opPar1 = `Paréntesis (${c} - ${d})`;
        const opPot1 = `Potencia ${fmtPar(diff1)}^2`;
        const opPar2 = `Paréntesis (${f} - ${g})`;
        const opPot2 = `Potencia ${fmtPar(diff2)}^2`;
        const opPar3 = `Paréntesis (${h} - ${i})`;
        const opCorch = `Corchetes [ ${b} - ${pot1} ]`;
        const opMult1 = `Multiplicación ${a} × ${fmtPar(corcheteReal)}`;
        const opMult2 = `Multiplicación ${e} × ${pot2}`;
        const opLlaves = `Llaves { ${term1Real} + ${term2} }`;

        return {
          id: Math.random(),
          operacion: opInicial,
          respuesta: res,
          caso: 'ejemplo3',
          casoNombre: 'Operaciones Combinadas con Potencias y Llaves',
          pista: 'Resuelve primero paréntesis y potencias de adentro hacia afuera, luego corchetes, llaves y divide al final.',
          explicacion: `${opInicial} = ${p2} = ${p4} = ${p5} = ${p6} = ${p8} = ${p9} = ${res}`,
          pasos: construirPasos(
            [
              {
                exprActual: opInicial,
                operacionCorrecta: opPar1,
                opciones: [opPar1, opPar2, opPar3],
                pistaError: 'Empezamos por el paréntesis más interno dentro de los corchetes.',
                preguntaInput: `¿Cuánto es ${c} - ${d}?`,
                respuestaInput: diff1,
                expresionSimplificada: p1,
                tipoPropiedad: 'experto',
              },
              {
                exprActual: p1,
                operacionCorrecta: opPot1,
                opciones: [opPot1, opPar2, opPar3],
                pistaError: 'Calcula el exponente dentro del corchete antes de continuar.',
                preguntaInput: `Calcula la potencia: ¿cuánto es ${fmtPar(diff1)}^2?`,
                respuestaInput: pot1,
                expresionSimplificada: p2,
                tipoPropiedad: 'experto',
              },
              {
                exprActual: p2,
                operacionCorrecta: opPar2,
                opciones: [`Resta ${b} - ${pot1}`, opPar2, opPar3],
                pistaError: 'Resuelve primero todos los paréntesis pendientes antes de resolver el corchete.',
                preguntaInput: `¿Cuánto es ${f} - ${g}?`,
                respuestaInput: diff2,
                expresionSimplificada: p3,
                tipoPropiedad: 'experto',
              },
              {
                exprActual: p3,
                operacionCorrecta: opPot2,
                opciones: [`Multiplicación ${e} × ${fmtPar(diff2)}`, opPot2, opPar3],
                pistaError: 'Las potencias tienen mayor jerarquía que las multiplicaciones.',
                preguntaInput: `Calcula la potencia: ¿cuánto es ${fmtPar(diff2)}^2?`,
                respuestaInput: pot2,
                expresionSimplificada: p4,
                tipoPropiedad: 'experto',
              },
              {
                exprActual: p4,
                operacionCorrecta: opPar3,
                opciones: [`Resta ${b} - ${pot1}`, opMult2, opPar3],
                pistaError: 'Termina de resolver el paréntesis exterior antes de resolver corchetes y llaves.',
                preguntaInput: `¿Cuánto es ${h} - ${i}?`,
                respuestaInput: divisor,
                expresionSimplificada: p5,
                tipoPropiedad: 'experto',
              },
              {
                exprActual: p5,
                operacionCorrecta: opCorch,
                opciones: [opCorch, opMult2],
                pistaError: 'Ya no quedan paréntesis; resuelve completamente el corchete antes de operar en las llaves.',
                preguntaInput: `Resuelve el corchete: ¿cuánto es ${b} - ${pot1}?`,
                respuestaInput: corcheteReal,
                expresionSimplificada: p6,
                tipoPropiedad: 'experto',
              },
              {
                exprActual: p6,
                operacionCorrecta: opMult1,
                opciones: [opMult1, opMult2],
                pistaError: 'Dentro de las llaves, resolvemos las multiplicaciones de izquierda a derecha.',
                preguntaInput: `¿Cuánto es ${a} × ${fmtPar(corcheteReal)}?`,
                respuestaInput: term1Real,
                expresionSimplificada: p7,
                tipoPropiedad: 'experto',
              },
              {
                exprActual: p7,
                operacionCorrecta: opMult2,
                opciones: [`Suma ${term1Real} + ${e}`, opMult2],
                pistaError: 'Multiplica antes de sumar dentro de las llaves.',
                preguntaInput: `¿Cuánto es ${e} × ${pot2}?`,
                respuestaInput: term2,
                expresionSimplificada: p8,
                tipoPropiedad: 'experto',
              },
              {
                exprActual: p8,
                operacionCorrecta: opLlaves,
                opciones: [opLlaves, `División { ${term1Real} + ${term2} } ÷ ${divisor}`],
                pistaError: 'Termina primero de resolver las llaves.',
                preguntaInput: `Resuelve las llaves: ¿cuánto es ${term1Real} + ${term2}?`,
                respuestaInput: llaveReal,
                expresionSimplificada: p9,
                tipoPropiedad: 'experto',
              },
              {
                exprActual: p9,
                operacionCorrecta: 'División final',
                opciones: [],
                pistaError: '',
                preguntaInput: `Operación final: ¿cuánto es ${llaveReal} ÷ ${divisor}?`,
                preguntaInputDirecto: `Operación final: ¿cuánto es ${llaveReal} ÷ ${divisor}?`,
                respuestaInput: res,
                expresionSimplificada: `${res}`,
                tipoPropiedad: 'experto',
              },
            ],
            'experto'
          ),
        };
      }

      // Potencia al principio: (b0^e0) { m [ p + q (a - b) ] ± r (c - d) } ÷ (e - f)
      case 'e_pot_inicio': {
        const b0 = pickFrom([2, 3]);
        const e0 = b0 === 3 ? 2 : pickFrom([2, 3]);
        const pot0 = Math.pow(b0, e0); // 4, 8 o 9

        const diff1 = pickFrom([-3, -2, 2, 3]);
        const b = randomInt(4, 8);
        const a = b + diff1;

        const q = randomInt(2, 3);
        const mult1 = q * diff1;
        let p = randomInt(4, 10);
        if (p + mult1 === 0) p += 1;

        const m = randomInt(2, 3);
        let r = randomInt(2, 4);
        const diff2 = pickFrom([-3, -2, 2, 3]);
        let d = randomInt(4, 7);
        let c = d + diff2;
        if (c === a && d === b) {
          d += 1;
          c += 1;
        }
        const opSignoL = pickFrom(['+', '-'] as const);

        let corcheteVal = p + mult1;
        if (m === r && corcheteVal === diff2) {
          r = r === 2 ? 3 : 2;
        }
        const term2 = r * diff2;
        let term1 = m * corcheteVal;
        let llaveVal = opSignoL === '+' ? term1 + term2 : term1 - term2;
        if (llaveVal === 0) {
          p += 1;
          corcheteVal = p + mult1;
          if (m === r && corcheteVal === diff2) {
            r = r === 2 ? 3 : 2;
          }
          term1 = m * corcheteVal;
          llaveVal = opSignoL === '+' ? term1 + (r * diff2) : term1 - (r * diff2);
        }

        const prodExt = pot0 * llaveVal;
        const divisor = pickDivisorExacto(prodExt, [2, 3, 4, 5, 6], b0);
        let f = randomInt(2, 6);
        let e = f + divisor;
        while ((e === a && f === b) || (e === c && f === d)) {
          f += 1;
          e += 1;
        }
        const res = prodExt / divisor;

        const opInicial = `(${b0}^${e0}) { ${m} [ ${p} + ${q} (${a} - ${b}) ] ${opSignoL} ${r} (${c} - ${d}) } ÷ (${e} - ${f})`;
        const p1 = `(${b0}^${e0}) { ${m} [ ${p} + ${q} × ${fmtPar(diff1)} ] ${opSignoL} ${r} (${c} - ${d}) } ÷ (${e} - ${f})`;
        const p2 = `(${b0}^${e0}) { ${m} [ ${p} + ${q} × ${fmtPar(diff1)} ] ${opSignoL} ${r} × ${fmtPar(diff2)} } ÷ (${e} - ${f})`;
        const p3 = `(${b0}^${e0}) { ${m} [ ${p} + ${q} × ${fmtPar(diff1)} ] ${opSignoL} ${r} × ${fmtPar(diff2)} } ÷ ${divisor}`;
        const p4 = `${pot0} { ${m} [ ${p} + ${q} × ${fmtPar(diff1)} ] ${opSignoL} ${r} × ${fmtPar(diff2)} } ÷ ${divisor}`;
        const p5 = `${pot0} { ${m} [ ${p} + ${fmtPar(mult1)} ] ${opSignoL} ${r} × ${fmtPar(diff2)} } ÷ ${divisor}`;

        const corchBody = mult1 < 0 ? `${p} - ${Math.abs(mult1)}` : `${p} + ${mult1}`;
        const p5b = `${pot0} { ${m} [ ${corchBody} ] ${opSignoL} ${r} × ${fmtPar(diff2)} } ÷ ${divisor}`;
        const p6 = `${pot0} { ${m} × ${fmtPar(corcheteVal)} ${opSignoL} ${r} × ${fmtPar(diff2)} } ÷ ${divisor}`;
        const p7 = `${pot0} { ${term1} ${opSignoL} ${r} × ${fmtPar(diff2)} } ÷ ${divisor}`;
        const p8 = `${pot0} { ${term1} ${opSignoL} ${fmtPar(term2)} } ÷ ${divisor}`;

        const llaveBody =
          term2 < 0
            ? opSignoL === '+'
              ? `${term1} - ${Math.abs(term2)}`
              : `${term1} + ${Math.abs(term2)}`
            : `${term1} ${opSignoL} ${term2}`;
        const p8b = `${pot0} { ${llaveBody} } ÷ ${divisor}`;
        const p9 = `${pot0} × ${fmtPar(llaveVal)} ÷ ${divisor}`;
        const p10 = `${prodExt} ÷ ${divisor}`;

        const opPar1 = `Paréntesis (${a} - ${b})`;
        const opPar2 = `Paréntesis (${c} - ${d})`;
        const opPar3 = `Paréntesis (${e} - ${f})`;
        const opPot0 = `Potencia (${b0}^${e0})`;
        const opMult1 = `Multiplicación ${q} × ${fmtPar(diff1)}`;
        const opCorch = `Corchetes [ ${corchBody} ]`;
        const opMult2 = `Multiplicación ${m} × ${fmtPar(corcheteVal)}`;
        const opMult3 = `Multiplicación ${r} × ${fmtPar(diff2)}`;
        const opLlaves = `Llaves { ${llaveBody} }`;
        const opMultExt = `Multiplicación ${pot0} × ${fmtPar(llaveVal)}`;
        const opLName = opSignoL === '+' ? 'Suma' : 'Resta';

        const pasosPotIni: PasoCombinadoSpec[] = [
          {
            exprActual: opInicial,
            operacionCorrecta: opPar1,
            opciones: [opPar1, opPar2, opPar3],
            pistaError: 'Resuelve primero el paréntesis más interno dentro de los corchetes.',
            preguntaInput: `¿Cuánto es ${a} - ${b}?`,
            respuestaInput: diff1,
            expresionSimplificada: p1,
            tipoPropiedad: 'experto',
          },
          {
            exprActual: p1,
            operacionCorrecta: opPar2,
            opciones: [opMult1, opPar2, opPar3],
            pistaError: 'Resuelve primero todos los paréntesis antes de multiplicar o pasar a los corchetes.',
            preguntaInput: `¿Cuánto es ${c} - ${d}?`,
            respuestaInput: diff2,
            expresionSimplificada: p2,
            tipoPropiedad: 'experto',
          },
          {
            exprActual: p2,
            operacionCorrecta: opPar3,
            opciones: [opPot0, opMult1, opPar3],
            pistaError: 'Resuelve el paréntesis divisor antes de pasar a las operaciones externas o corchetes.',
            preguntaInput: `¿Cuánto es ${e} - ${f}?`,
            respuestaInput: divisor,
            expresionSimplificada: p3,
            tipoPropiedad: 'experto',
          },
          {
            exprActual: p3,
            operacionCorrecta: opPot0,
            opciones: [opPot0, `Suma ${p} + ${q}`, opMult1],
            pistaError: 'Calcula primero la potencia entre paréntesis del inicio antes de continuar.',
            preguntaInput: `Calcula la potencia: ¿cuánto es (${b0}^${e0})?`,
            respuestaInput: pot0,
            expresionSimplificada: p4,
            tipoPropiedad: 'experto',
          },
          {
            exprActual: p4,
            operacionCorrecta: opMult1,
            opciones: [`Suma ${p} + ${q}`, opMult1, opMult3],
            pistaError: 'Dentro del corchete, la multiplicación va antes que la suma.',
            preguntaInput: `¿Cuánto es ${q} × ${fmtPar(diff1)}?`,
            respuestaInput: mult1,
            expresionSimplificada: p5,
            tipoPropiedad: 'experto',
          },
        ];

        let expl = `${opInicial} = ${p1} = ${p2} = ${p3} = ${p4} = ${p5}`;

        if (mult1 < 0) {
          pasosPotIni.push({
            exprActual: p5,
            operacionCorrecta: `Paréntesis +${fmtPar(mult1)}`,
            opciones: [`Paréntesis +${fmtPar(mult1)}`, opMult3],
            pistaError: 'Elimina el paréntesis dentro del corchete aplicando ley de signos (+ por - = -).',
            preguntaInput: `Elimina el paréntesis aplicando ley de signos: ¿cuánto es +${fmtPar(mult1)}?`,
            respuestaInput: mult1,
            expresionSimplificada: p5b,
            tipoPropiedad: 'experto',
          });
          expl += ` = ${p5b}`;
        }

        pasosPotIni.push(
          {
            exprActual: mult1 < 0 ? p5b : p5,
            operacionCorrecta: opCorch,
            opciones: [opCorch, opMult3],
            pistaError: 'Ya no quedan paréntesis; resuelve completamente el corchete.',
            preguntaInput: `Resuelve el corchete: ¿cuánto es ${corchBody}?`,
            respuestaInput: corcheteVal,
            expresionSimplificada: p6,
            tipoPropiedad: 'experto',
          },
          {
            exprActual: p6,
            operacionCorrecta: opMult2,
            opciones: [opMult2, opMult3],
            pistaError: 'Dentro de las llaves, resuelve las multiplicaciones de izquierda a derecha.',
            preguntaInput: `¿Cuánto es ${m} × ${fmtPar(corcheteVal)}?`,
            respuestaInput: term1,
            expresionSimplificada: p7,
            tipoPropiedad: 'experto',
          },
          {
            exprActual: p7,
            operacionCorrecta: opMult3,
            opciones: [`${opLName} ${term1} ${opSignoL} ${r}`, opMult3],
            pistaError: 'Multiplica antes de sumar o restar dentro de las llaves.',
            preguntaInput: `¿Cuánto es ${r} × ${fmtPar(diff2)}?`,
            respuestaInput: term2,
            expresionSimplificada: p8,
            tipoPropiedad: 'experto',
          }
        );
        expl += ` = ${p6} = ${p7} = ${p8}`;

        if (term2 < 0) {
          const opSignoT2 = `Paréntesis ${opSignoL}${fmtPar(term2)}`;
          const expectedT2 = opSignoL === '+' ? term2 : Math.abs(term2);
          pasosPotIni.push({
            exprActual: p8,
            operacionCorrecta: opSignoT2,
            opciones: [opSignoT2, `Multiplicación ${pot0} × { ${term1} ${opSignoL} ${fmtPar(term2)} }`],
            pistaError:
              opSignoL === '+'
                ? 'Elimina el paréntesis dentro de las llaves (+ por - = -).'
                : 'Elimina el paréntesis dentro de las llaves (- por - = +).',
            preguntaInput: `Elimina el paréntesis aplicando ley de signos: ¿cuánto es ${opSignoL}${fmtPar(term2)}?`,
            respuestaInput: expectedT2,
            expresionSimplificada: p8b,
            tipoPropiedad: 'experto',
          });
          expl += ` = ${p8b}`;
        }

        pasosPotIni.push(
          {
            exprActual: term2 < 0 ? p8b : p8,
            operacionCorrecta: opLlaves,
            opciones: [opLlaves, `Multiplicación ${pot0} × { ${llaveBody} }`],
            pistaError: 'Termina de simplificar la operación dentro de las llaves.',
            preguntaInput: `Resuelve las llaves: ¿cuánto es ${llaveBody}?`,
            respuestaInput: llaveVal,
            expresionSimplificada: p9,
            tipoPropiedad: 'experto',
          },
          {
            exprActual: p9,
            operacionCorrecta: opMultExt,
            opciones: [opMultExt, `División ${fmtPar(llaveVal)} ÷ ${divisor}`],
            pistaError: 'Multiplicación y división tienen la misma jerarquía: se resuelven de izquierda a derecha.',
            preguntaInput: `¿Cuánto es ${pot0} × ${fmtPar(llaveVal)}?`,
            respuestaInput: prodExt,
            expresionSimplificada: p10,
            tipoPropiedad: 'experto',
          },
          {
            exprActual: p10,
            operacionCorrecta: 'División final',
            opciones: [],
            pistaError: '',
            preguntaInput: `Operación final: ¿cuánto es ${prodExt} ÷ ${divisor}?`,
            preguntaInputDirecto: `Operación final: ¿cuánto es ${prodExt} ÷ ${divisor}?`,
            respuestaInput: res,
            expresionSimplificada: `${res}`,
            tipoPropiedad: 'experto',
          }
        );

        return {
          id: Math.random(),
          operacion: opInicial,
          respuesta: res,
          caso: 'ejemplo3',
          casoNombre: 'Operaciones Combinadas con Potencias y Llaves',
          pista: 'Resuelve paréntesis y la potencia inicial antes de pasar a corchetes y llaves; al final multiplica y divide de izquierda a derecha.',
          explicacion: `${expl} = ${p9} = ${p10} = ${res}`,
          pasos: construirPasos(pasosPotIni, 'experto'),
        };
      }

      // Potencia al final (en el divisor): k { m [ p + q (a - b) ] ± r (c - d) } ÷ (e - f)^2
      case 'e_pot_final': {
        const diff1 = pickFrom([-3, -2, 2, 3]);
        const b = randomInt(4, 8);
        const a = b + diff1;

        const q = randomInt(2, 3);
        const mult1 = q * diff1;
        let p = randomInt(3, 9);
        if (p + mult1 === 0) p += 1;

        const m = randomInt(2, 3);
        let r = randomInt(2, 4);
        const diff2 = pickFrom([-3, -2, 2, 3]);
        let d = randomInt(4, 7);
        let c = d + diff2;
        if (c === a && d === b) {
          d += 1;
          c += 1;
        }
        const opSignoL = pickFrom(['+', '-'] as const);

        let corcheteVal = p + mult1;
        if (m === r && corcheteVal === diff2) {
          r = r === 2 ? 3 : 2;
        }
        const term2 = r * diff2;
        let term1 = m * corcheteVal;
        let llaveVal = opSignoL === '+' ? term1 + term2 : term1 - term2;
        if (llaveVal === 0) {
          p += 1;
          corcheteVal = p + mult1;
          if (m === r && corcheteVal === diff2) {
            r = r === 2 ? 3 : 2;
          }
          term1 = m * corcheteVal;
          llaveVal = opSignoL === '+' ? term1 + term2 : term1 - term2;
        }

        let diff3 = pickFrom([-3, -2, 2, 3]);
        let divisor = diff3 * diff3; // 4 o 9
        let k: number;
        if (divisor === 9) {
          if (llaveVal % 3 === 0) {
            k = 3;
          } else {
            diff3 = pickFrom([-2, 2]);
            divisor = 4;
            k = llaveVal % 2 === 0 ? pickFrom([2, 4]) : 4;
          }
        } else {
          k = llaveVal % 2 === 0 ? pickFrom([2, 4]) : 4;
        }

        let f = randomInt(4, 7);
        let e = f + diff3;
        while ((e === a && f === b) || (e === c && f === d)) {
          f += 1;
          e += 1;
        }

        const prodExt = k * llaveVal;
        const res = prodExt / divisor;

        const opInicial = `${k} { ${m} [ ${p} + ${q} (${a} - ${b}) ] ${opSignoL} ${r} (${c} - ${d}) } ÷ (${e} - ${f})^2`;
        const p1 = `${k} { ${m} [ ${p} + ${q} × ${fmtPar(diff1)} ] ${opSignoL} ${r} (${c} - ${d}) } ÷ (${e} - ${f})^2`;
        const p2 = `${k} { ${m} [ ${p} + ${q} × ${fmtPar(diff1)} ] ${opSignoL} ${r} × ${fmtPar(diff2)} } ÷ (${e} - ${f})^2`;
        const p3 = `${k} { ${m} [ ${p} + ${q} × ${fmtPar(diff1)} ] ${opSignoL} ${r} × ${fmtPar(diff2)} } ÷ ${fmtPar(diff3)}^2`;
        const p4 = `${k} { ${m} [ ${p} + ${q} × ${fmtPar(diff1)} ] ${opSignoL} ${r} × ${fmtPar(diff2)} } ÷ ${divisor}`;
        const p5 = `${k} { ${m} [ ${p} + ${fmtPar(mult1)} ] ${opSignoL} ${r} × ${fmtPar(diff2)} } ÷ ${divisor}`;

        const corchBody = mult1 < 0 ? `${p} - ${Math.abs(mult1)}` : `${p} + ${mult1}`;
        const p5b = `${k} { ${m} [ ${corchBody} ] ${opSignoL} ${r} × ${fmtPar(diff2)} } ÷ ${divisor}`;
        const p6 = `${k} { ${m} × ${fmtPar(corcheteVal)} ${opSignoL} ${r} × ${fmtPar(diff2)} } ÷ ${divisor}`;
        const p7 = `${k} { ${term1} ${opSignoL} ${r} × ${fmtPar(diff2)} } ÷ ${divisor}`;
        const p8 = `${k} { ${term1} ${opSignoL} ${fmtPar(term2)} } ÷ ${divisor}`;

        const llaveBody =
          term2 < 0
            ? opSignoL === '+'
              ? `${term1} - ${Math.abs(term2)}`
              : `${term1} + ${Math.abs(term2)}`
            : `${term1} ${opSignoL} ${term2}`;
        const p8b = `${k} { ${llaveBody} } ÷ ${divisor}`;
        const p9 = `${k} × ${fmtPar(llaveVal)} ÷ ${divisor}`;
        const p10 = `${prodExt} ÷ ${divisor}`;

        const opPar1 = `Paréntesis (${a} - ${b})`;
        const opPar2 = `Paréntesis (${c} - ${d})`;
        const opPar3 = `Paréntesis (${e} - ${f})`;
        const opPot3 = `Potencia ${fmtPar(diff3)}^2`;
        const opMult1 = `Multiplicación ${q} × ${fmtPar(diff1)}`;
        const opCorch = `Corchetes [ ${corchBody} ]`;
        const opMult2 = `Multiplicación ${m} × ${fmtPar(corcheteVal)}`;
        const opMult3 = `Multiplicación ${r} × ${fmtPar(diff2)}`;
        const opLlaves = `Llaves { ${llaveBody} }`;
        const opMultExt = `Multiplicación ${k} × ${fmtPar(llaveVal)}`;
        const opLName = opSignoL === '+' ? 'Suma' : 'Resta';

        const pasosPotFin: PasoCombinadoSpec[] = [
          {
            exprActual: opInicial,
            operacionCorrecta: opPar1,
            opciones: [opPar1, opPar2, opPar3],
            pistaError: 'Comienza por el paréntesis más interno dentro de los corchetes.',
            preguntaInput: `¿Cuánto es ${a} - ${b}?`,
            respuestaInput: diff1,
            expresionSimplificada: p1,
            tipoPropiedad: 'experto',
          },
          {
            exprActual: p1,
            operacionCorrecta: opPar2,
            opciones: [opMult1, opPar2, opPar3],
            pistaError: 'Resuelve primero todos los paréntesis antes de operar en corchetes.',
            preguntaInput: `¿Cuánto es ${c} - ${d}?`,
            respuestaInput: diff2,
            expresionSimplificada: p2,
            tipoPropiedad: 'experto',
          },
          {
            exprActual: p2,
            operacionCorrecta: opPar3,
            opciones: [opMult1, opMult3, opPar3],
            pistaError: 'Resuelve el último paréntesis (base de la potencia final) antes de pasar a corchetes.',
            preguntaInput: `¿Cuánto es ${e} - ${f}?`,
            respuestaInput: diff3,
            expresionSimplificada: p3,
            tipoPropiedad: 'experto',
          },
          {
            exprActual: p3,
            operacionCorrecta: opPot3,
            opciones: [opMult1, opMult3, opPot3],
            pistaError: 'Calcula la potencia del divisor antes de continuar con el corchete.',
            preguntaInput: `Calcula la potencia: ¿cuánto es ${fmtPar(diff3)}^2?`,
            respuestaInput: divisor,
            expresionSimplificada: p4,
            tipoPropiedad: 'experto',
          },
          {
            exprActual: p4,
            operacionCorrecta: opMult1,
            opciones: [`Suma ${p} + ${q}`, opMult1, opMult3],
            pistaError: 'Dentro del corchete, la multiplicación tiene mayor jerarquía que la suma.',
            preguntaInput: `¿Cuánto es ${q} × ${fmtPar(diff1)}?`,
            respuestaInput: mult1,
            expresionSimplificada: p5,
            tipoPropiedad: 'experto',
          },
        ];

        let expl = `${opInicial} = ${p1} = ${p2} = ${p3} = ${p4} = ${p5}`;

        if (mult1 < 0) {
          pasosPotFin.push({
            exprActual: p5,
            operacionCorrecta: `Paréntesis +${fmtPar(mult1)}`,
            opciones: [`Paréntesis +${fmtPar(mult1)}`, opMult3],
            pistaError: 'Elimina el paréntesis dentro del corchete aplicando ley de signos (+ por - = -).',
            preguntaInput: `Elimina el paréntesis aplicando ley de signos: ¿cuánto es +${fmtPar(mult1)}?`,
            respuestaInput: mult1,
            expresionSimplificada: p5b,
            tipoPropiedad: 'experto',
          });
          expl += ` = ${p5b}`;
        }

        pasosPotFin.push(
          {
            exprActual: mult1 < 0 ? p5b : p5,
            operacionCorrecta: opCorch,
            opciones: [opCorch, opMult3],
            pistaError: 'Ya no quedan paréntesis; resuelve completamente el corchete.',
            preguntaInput: `Resuelve el corchete: ¿cuánto es ${corchBody}?`,
            respuestaInput: corcheteVal,
            expresionSimplificada: p6,
            tipoPropiedad: 'experto',
          },
          {
            exprActual: p6,
            operacionCorrecta: opMult2,
            opciones: [opMult2, opMult3],
            pistaError: 'Dentro de las llaves, resuelve las multiplicaciones de izquierda a derecha.',
            preguntaInput: `¿Cuánto es ${m} × ${fmtPar(corcheteVal)}?`,
            respuestaInput: term1,
            expresionSimplificada: p7,
            tipoPropiedad: 'experto',
          },
          {
            exprActual: p7,
            operacionCorrecta: opMult3,
            opciones: [`${opLName} ${term1} ${opSignoL} ${r}`, opMult3],
            pistaError: 'Aún queda una multiplicación dentro de las llaves.',
            preguntaInput: `¿Cuánto es ${r} × ${fmtPar(diff2)}?`,
            respuestaInput: term2,
            expresionSimplificada: p8,
            tipoPropiedad: 'experto',
          }
        );
        expl += ` = ${p6} = ${p7} = ${p8}`;

        if (term2 < 0) {
          const opSignoT2 = `Paréntesis ${opSignoL}${fmtPar(term2)}`;
          const expectedT2 = opSignoL === '+' ? term2 : Math.abs(term2);
          pasosPotFin.push({
            exprActual: p8,
            operacionCorrecta: opSignoT2,
            opciones: [opSignoT2, `Multiplicación ${k} × { ${term1} ${opSignoL} ${fmtPar(term2)} }`],
            pistaError:
              opSignoL === '+'
                ? 'Elimina el paréntesis dentro de las llaves (+ por - = -).'
                : 'Elimina el paréntesis dentro de las llaves (- por - = +).',
            preguntaInput: `Elimina el paréntesis aplicando ley de signos: ¿cuánto es ${opSignoL}${fmtPar(term2)}?`,
            respuestaInput: expectedT2,
            expresionSimplificada: p8b,
            tipoPropiedad: 'experto',
          });
          expl += ` = ${p8b}`;
        }

        pasosPotFin.push(
          {
            exprActual: term2 < 0 ? p8b : p8,
            operacionCorrecta: opLlaves,
            opciones: [opLlaves, `Multiplicación ${k} × { ${llaveBody} }`],
            pistaError: 'Resuelve la operación dentro de las llaves antes de multiplicar afuera.',
            preguntaInput: `Resuelve las llaves: ¿cuánto es ${llaveBody}?`,
            respuestaInput: llaveVal,
            expresionSimplificada: p9,
            tipoPropiedad: 'experto',
          },
          {
            exprActual: p9,
            operacionCorrecta: opMultExt,
            opciones: [opMultExt, `División ${fmtPar(llaveVal)} ÷ ${divisor}`],
            pistaError: 'Entre multiplicación y división, avanzamos de izquierda a derecha.',
            preguntaInput: `¿Cuánto es ${k} × ${fmtPar(llaveVal)}?`,
            respuestaInput: prodExt,
            expresionSimplificada: p10,
            tipoPropiedad: 'experto',
          },
          {
            exprActual: p10,
            operacionCorrecta: 'División final',
            opciones: [],
            pistaError: '',
            preguntaInput: `Operación final: ¿cuánto es ${prodExt} ÷ ${divisor}?`,
            preguntaInputDirecto: `Operación final: ¿cuánto es ${prodExt} ÷ ${divisor}?`,
            respuestaInput: res,
            expresionSimplificada: `${res}`,
            tipoPropiedad: 'experto',
          }
        );

        return {
          id: Math.random(),
          operacion: opInicial,
          respuesta: res,
          caso: 'ejemplo3',
          casoNombre: 'Operaciones Combinadas con Potencias y Llaves',
          pista: 'Resuelve todos los paréntesis y la potencia del divisor antes de pasar a corchetes y llaves.',
          explicacion: `${expl} = ${p9} = ${p10} = ${res}`,
          pasos: construirPasos(pasosPotFin, 'experto'),
        };
      }

      // Múltiples potencias (al principio, dentro y al final): (b0^2) { m [ p + q (a - b)^2 ] - r (c - d) } ÷ (e - f)^2
      case 'e_doble_pot_ext': {
        const diff1 = pickFrom([-3, -2, 2, 3]);
        const b = randomInt(4, 8);
        const a = b + diff1;
        const pot1 = diff1 * diff1;

        const q = randomInt(2, 3);
        const p = randomInt(3, 8);
        const mult1 = q * pot1;
        const corcheteVal = p + mult1;

        const m = randomInt(2, 3);
        const r = randomInt(2, 4);
        const diff2 = randomInt(2, 4);
        let d = randomInt(2, 6);
        let c = d + diff2;
        if (c === a && d === b) {
          d += 1;
          c += 1;
        }
        const term1 = m * corcheteVal;
        const term2 = r * diff2;
        const llaveVal = term1 - term2;

        const usaBase3 = llaveVal % 4 === 0 || Math.random() < 0.35;
        let b0 = 2;
        let diff3 = pickFrom([-2, 2]);
        if (usaBase3 && llaveVal % 4 === 0) {
          b0 = 3;
          diff3 = pickFrom([-2, 2]);
        } else if (usaBase3) {
          b0 = 3;
          diff3 = pickFrom([-3, 3]);
        }
        const pot0 = b0 * b0;
        const potDiv = diff3 * diff3;

        let f = randomInt(4, 7);
        let e = f + diff3;
        while ((e === a && f === b) || (e === c && f === d)) {
          f += 1;
          e += 1;
        }

        const prodExt = pot0 * llaveVal;
        const res = prodExt / potDiv;

        const opInicial = `(${b0}^2) { ${m} [ ${p} + ${q} (${a} - ${b})^2 ] - ${r} (${c} - ${d}) } ÷ (${e} - ${f})^2`;
        const p1 = `(${b0}^2) { ${m} [ ${p} + ${q} × ${fmtPar(diff1)}^2 ] - ${r} (${c} - ${d}) } ÷ (${e} - ${f})^2`;
        const p2 = `(${b0}^2) { ${m} [ ${p} + ${q} × ${pot1} ] - ${r} (${c} - ${d}) } ÷ (${e} - ${f})^2`;
        const p3 = `(${b0}^2) { ${m} [ ${p} + ${q} × ${pot1} ] - ${r} × ${diff2} } ÷ (${e} - ${f})^2`;
        const p4 = `(${b0}^2) { ${m} [ ${p} + ${q} × ${pot1} ] - ${r} × ${diff2} } ÷ ${fmtPar(diff3)}^2`;
        const p5 = `(${b0}^2) { ${m} [ ${p} + ${q} × ${pot1} ] - ${r} × ${diff2} } ÷ ${potDiv}`;
        const p6 = `${pot0} { ${m} [ ${p} + ${q} × ${pot1} ] - ${r} × ${diff2} } ÷ ${potDiv}`;
        const p7 = `${pot0} { ${m} [ ${p} + ${mult1} ] - ${r} × ${diff2} } ÷ ${potDiv}`;
        const p8 = `${pot0} { ${m} × ${corcheteVal} - ${r} × ${diff2} } ÷ ${potDiv}`;
        const p9 = `${pot0} { ${term1} - ${r} × ${diff2} } ÷ ${potDiv}`;
        const p10 = `${pot0} { ${term1} - ${term2} } ÷ ${potDiv}`;
        const p11 = `${pot0} × ${llaveVal} ÷ ${potDiv}`;
        const p12 = `${prodExt} ÷ ${potDiv}`;

        const opPar1 = `Paréntesis (${a} - ${b})`;
        const opPot1 = `Potencia ${fmtPar(diff1)}^2`;
        const opPar2 = `Paréntesis (${c} - ${d})`;
        const opPar3 = `Paréntesis (${e} - ${f})`;
        const opPotDiv = `Potencia ${fmtPar(diff3)}^2`;
        const opPot0 = `Potencia (${b0}^2)`;
        const opMult1 = `Multiplicación ${q} × ${pot1}`;
        const opCorch = `Corchetes [ ${p} + ${mult1} ]`;
        const opMult2 = `Multiplicación ${m} × ${corcheteVal}`;
        const opMult3 = `Multiplicación ${r} × ${diff2}`;
        const opLlaves = `Llaves { ${term1} - ${term2} }`;
        const opMultExt = `Multiplicación ${pot0} × ${llaveVal}`;

        return {
          id: Math.random(),
          operacion: opInicial,
          respuesta: res,
          caso: 'ejemplo3',
          casoNombre: 'Operaciones Combinadas con Potencias y Llaves',
          pista: 'Resuelve paréntesis y potencias (internas y externas) antes de pasar a corchetes y llaves.',
          explicacion: `${opInicial} = ${p2} = ${p5} = ${p6} = ${p8} = ${p10} = ${p11} = ${p12} = ${res}`,
          pasos: construirPasos(
            [
              {
                exprActual: opInicial,
                operacionCorrecta: opPar1,
                opciones: [opPar1, opPar2, opPar3],
                pistaError: 'Resolvemos primero el paréntesis más interno dentro del corchete.',
                preguntaInput: `¿Cuánto es ${a} - ${b}?`,
                respuestaInput: diff1,
                expresionSimplificada: p1,
                tipoPropiedad: 'experto',
              },
              {
                exprActual: p1,
                operacionCorrecta: opPot1,
                opciones: [opPot1, `Multiplicación ${q} × ${fmtPar(diff1)}`, opPar2],
                pistaError: 'Calcula primero la potencia del paréntesis más interno.',
                preguntaInput: `Calcula la potencia: ¿cuánto es ${fmtPar(diff1)}^2?`,
                respuestaInput: pot1,
                expresionSimplificada: p2,
                tipoPropiedad: 'experto',
              },
              {
                exprActual: p2,
                operacionCorrecta: opPar2,
                opciones: [opMult1, opPar2, opPar3],
                pistaError: 'Continúa resolviendo los paréntesis pendientes antes de multiplicar.',
                preguntaInput: `¿Cuánto es ${c} - ${d}?`,
                respuestaInput: diff2,
                expresionSimplificada: p3,
                tipoPropiedad: 'experto',
              },
              {
                exprActual: p3,
                operacionCorrecta: opPar3,
                opciones: [opMult1, opMult3, opPar3],
                pistaError: 'Resuelve el paréntesis divisor antes de calcular las multiplicaciones internas.',
                preguntaInput: `¿Cuánto es ${e} - ${f}?`,
                respuestaInput: diff3,
                expresionSimplificada: p4,
                tipoPropiedad: 'experto',
              },
              {
                exprActual: p4,
                operacionCorrecta: opPotDiv,
                opciones: [opPotDiv, opMult1, opPot0],
                pistaError: 'Calcula primero la potencia del divisor antes de salir de los paréntesis.',
                preguntaInput: `Calcula la potencia: ¿cuánto es ${fmtPar(diff3)}^2?`,
                respuestaInput: potDiv,
                expresionSimplificada: p5,
                tipoPropiedad: 'experto',
              },
              {
                exprActual: p5,
                operacionCorrecta: opPot0,
                opciones: [opPot0, `Suma ${p} + ${q}`, opMult1],
                pistaError: 'Resuelve la potencia inicial entre paréntesis antes de continuar con el corchete.',
                preguntaInput: `Calcula la potencia: ¿cuánto es (${b0}^2)?`,
                respuestaInput: pot0,
                expresionSimplificada: p6,
                tipoPropiedad: 'experto',
              },
              {
                exprActual: p6,
                operacionCorrecta: opMult1,
                opciones: [`Suma ${p} + ${q}`, opMult1, opMult3],
                pistaError: 'Dentro del corchete, la multiplicación va antes que la suma.',
                preguntaInput: `¿Cuánto es ${q} × ${pot1}?`,
                respuestaInput: mult1,
                expresionSimplificada: p7,
                tipoPropiedad: 'experto',
              },
              {
                exprActual: p7,
                operacionCorrecta: opCorch,
                opciones: [opCorch, opMult3],
                pistaError: 'Ya no quedan paréntesis; resuelve completamente el corchete.',
                preguntaInput: `Resuelve el corchete: ¿cuánto es ${p} + ${mult1}?`,
                respuestaInput: corcheteVal,
                expresionSimplificada: p8,
                tipoPropiedad: 'experto',
              },
              {
                exprActual: p8,
                operacionCorrecta: opMult2,
                opciones: [opMult2, opMult3],
                pistaError: 'Dentro de las llaves, multiplica de izquierda a derecha.',
                preguntaInput: `¿Cuánto es ${m} × ${corcheteVal}?`,
                respuestaInput: term1,
                expresionSimplificada: p9,
                tipoPropiedad: 'experto',
              },
              {
                exprActual: p9,
                operacionCorrecta: opMult3,
                opciones: [`Resta ${term1} - ${r}`, opMult3],
                pistaError: 'Multiplica antes de restar dentro de las llaves.',
                preguntaInput: `¿Cuánto es ${r} × ${diff2}?`,
                respuestaInput: term2,
                expresionSimplificada: p10,
                tipoPropiedad: 'experto',
              },
              {
                exprActual: p10,
                operacionCorrecta: opLlaves,
                opciones: [opLlaves, `Multiplicación ${pot0} × { ${term1} - ${term2} }`],
                pistaError: 'Resuelve primero la operación dentro de las llaves.',
                preguntaInput: `Resuelve las llaves: ¿cuánto es ${term1} - ${term2}?`,
                respuestaInput: llaveVal,
                expresionSimplificada: p11,
                tipoPropiedad: 'experto',
              },
              {
                exprActual: p11,
                operacionCorrecta: opMultExt,
                opciones: [opMultExt, `División ${llaveVal} ÷ ${potDiv}`],
                pistaError: 'Entre multiplicación y división, avanzamos de izquierda a derecha.',
                preguntaInput: `¿Cuánto es ${pot0} × ${llaveVal}?`,
                respuestaInput: prodExt,
                expresionSimplificada: p12,
                tipoPropiedad: 'experto',
              },
              {
                exprActual: p12,
                operacionCorrecta: 'División final',
                opciones: [],
                pistaError: '',
                preguntaInput: `Operación final: ¿cuánto es ${prodExt} ÷ ${potDiv}?`,
                preguntaInputDirecto: `Operación final: ¿cuánto es ${prodExt} ÷ ${potDiv}?`,
                respuestaInput: res,
                expresionSimplificada: `${res}`,
                tipoPropiedad: 'experto',
              },
            ],
            'experto'
          ),
        };
      }

      // Llave en el divisor + potencia y paréntesis suelto fuera:
      // m × (a - b)^2 ÷ { p [ q - (c - d) ] ± r } ± (e - f)
      case 'e_llave_en_divisor': {
        const diff2 = pickFrom([-3, -2, 2, 3]);
        const q = randomInt(4, 9);
        const corcheteVal = q - diff2; // >= 1 siempre

        const p = 2;
        const prodP = p * corcheteVal;
        const candidatosLlave = [-6, -4, -3, -2, 2, 3, 4, 6].filter((lv) => lv !== prodP);
        const llaveVal = pickFrom(candidatosLlave);
        const r = llaveVal - prodP;

        const absLlave = Math.abs(llaveVal);
        let diff1: number;
        let m: number;
        if (absLlave === 2 || absLlave === 4) {
          diff1 = pickFrom([-2, 2]);
          m = randomInt(2, 5);
        } else if (absLlave === 3) {
          diff1 = pickFrom([-3, 3]);
          m = randomInt(2, 4);
        } else {
          // 6
          diff1 = pickFrom([-3, 3]);
          m = pickFrom([2, 4]);
        }
        const pot1 = diff1 * diff1;
        if (m === p && pot1 === corcheteVal) {
          m = m === 2 ? 4 : 2;
        }
        const prodM = m * pot1;
        const coc = prodM / llaveVal;

        const b = randomInt(4, 7);
        const a = b + diff1;
        let d = randomInt(4, 7);
        let c = d + diff2;
        if (c === a && d === b) {
          d += 1;
          c += 1;
        }

        const diff3 = pickFrom([-4, -3, -2, 2, 3, 4]);
        let f = randomInt(5, 8);
        let e = f + diff3;
        while ((e === a && f === b) || (e === c && f === d)) {
          f += 1;
          e += 1;
        }
        const opExt = pickFrom(['+', '-'] as const);
        const res = opExt === '+' ? coc + diff3 : coc - diff3;

        const termRStr = fmtTerm(r);
        const opInicial = `${m} × (${a} - ${b})^2 ÷ { ${p} [ ${q} - (${c} - ${d}) ] ${termRStr} } ${opExt} (${e} - ${f})`;
        const p1 = `${m} × (${a} - ${b})^2 ÷ { ${p} [ ${q} - ${fmtPar(diff2)} ] ${termRStr} } ${opExt} (${e} - ${f})`;

        const corchBody = diff2 < 0 ? `${q} + ${Math.abs(diff2)}` : `${q} - ${diff2}`;
        const p1b = `${m} × (${a} - ${b})^2 ÷ { ${p} [ ${corchBody} ] ${termRStr} } ${opExt} (${e} - ${f})`;
        const basePostC = diff2 < 0 ? p1b : p1;

        const p2 = basePostC.replace(`(${a} - ${b})^2`, `${fmtPar(diff1)}^2`);
        const p3 = p2.replace(`${fmtPar(diff1)}^2`, `${pot1}`);
        const p4 = p3.replace(`(${e} - ${f})`, `${fmtPar(diff3)}`);

        const finalTermStr =
          diff3 < 0
            ? opExt === '+'
              ? `- ${Math.abs(diff3)}`
              : `+ ${Math.abs(diff3)}`
            : `${opExt} ${diff3}`;
        const p4b = `${m} × ${pot1} ÷ { ${p} [ ${corchBody} ] ${termRStr} } ${finalTermStr}`;
        const basePostE = diff3 < 0 ? p4b : p4;

        const p5 = `${m} × ${pot1} ÷ { ${p} × ${corcheteVal} ${termRStr} } ${finalTermStr}`;
        const p6 = `${m} × ${pot1} ÷ { ${prodP} ${termRStr} } ${finalTermStr}`;
        const p7 = `${m} × ${pot1} ÷ ${fmtPar(llaveVal)} ${finalTermStr}`;
        const p8 = `${prodM} ÷ ${fmtPar(llaveVal)} ${finalTermStr}`;
        const p9 = `${coc} ${finalTermStr}`;

        const opParC = `Paréntesis (${c} - ${d})`;
        const opParA = `Paréntesis (${a} - ${b})`;
        const opPot1 = `Potencia ${fmtPar(diff1)}^2`;
        const opParE = `Paréntesis (${e} - ${f})`;
        const opCorch = `Corchetes [ ${corchBody} ]`;
        const opMultP = `Multiplicación ${p} × ${corcheteVal}`;
        const opLlaves = `Llaves { ${prodP} ${termRStr} }`;
        const opMultM = `Multiplicación ${m} × ${pot1}`;
        const opDiv = `División ${prodM} ÷ ${fmtPar(llaveVal)}`;

        const pasosLlaveDiv: PasoCombinadoSpec[] = [
          {
            exprActual: opInicial,
            operacionCorrecta: opParC,
            opciones: [opParC, opParA, opParE],
            pistaError: 'Empezamos por el paréntesis más interno dentro de los corchetes y llaves.',
            preguntaInput: `¿Cuánto es ${c} - ${d}?`,
            respuestaInput: diff2,
            expresionSimplificada: p1,
            tipoPropiedad: 'experto',
          },
        ];

        let expl = `${opInicial} = ${p1}`;
        if (diff2 < 0) {
          pasosLlaveDiv.push({
            exprActual: p1,
            operacionCorrecta: `Paréntesis -${fmtPar(diff2)}`,
            opciones: [`Paréntesis -${fmtPar(diff2)}`, opParA, opParE],
            pistaError: 'Elimina primero el paréntesis dentro del corchete aplicando ley de signos (- por - = +).',
            preguntaInput: `Elimina el paréntesis aplicando ley de signos: ¿cuánto es -${fmtPar(diff2)}?`,
            respuestaInput: Math.abs(diff2),
            expresionSimplificada: p1b,
            tipoPropiedad: 'experto',
          });
          expl += ` = ${p1b}`;
        }

        pasosLlaveDiv.push(
          {
            exprActual: basePostC,
            operacionCorrecta: opParA,
            opciones: [opParA, opParE],
            pistaError: 'Resuelve el paréntesis de la potencia antes de operar con los corchetes.',
            preguntaInput: `¿Cuánto es ${a} - ${b}?`,
            respuestaInput: diff1,
            expresionSimplificada: p2,
            tipoPropiedad: 'experto',
          },
          {
            exprActual: p2,
            operacionCorrecta: opPot1,
            opciones: [`Multiplicación ${m} × ${fmtPar(diff1)}`, opPot1, opParE],
            pistaError: 'Las potencias tienen mayor jerarquía que las multiplicaciones.',
            preguntaInput: `Calcula la potencia: ¿cuánto es ${fmtPar(diff1)}^2?`,
            respuestaInput: pot1,
            expresionSimplificada: p3,
            tipoPropiedad: 'experto',
          },
          {
            exprActual: p3,
            operacionCorrecta: opParE,
            opciones: [opMultM, opParE],
            pistaError: 'Termina de resolver el paréntesis suelto antes de resolver corchetes y llaves.',
            preguntaInput: `¿Cuánto es ${e} - ${f}?`,
            respuestaInput: diff3,
            expresionSimplificada: p4,
            tipoPropiedad: 'experto',
          }
        );
        expl += ` = ${p2} = ${p3} = ${p4}`;

        if (diff3 < 0) {
          const opSignoE = `Paréntesis ${opExt}${fmtPar(diff3)}`;
          const valE = opExt === '+' ? diff3 : Math.abs(diff3);
          pasosLlaveDiv.push({
            exprActual: p4,
            operacionCorrecta: opSignoE,
            opciones: [opSignoE, opMultM],
            pistaError: 'Elimina el paréntesis exterior aplicando ley de signos antes de seguir.',
            preguntaInput: `Elimina el paréntesis aplicando ley de signos: ¿cuánto es ${opExt}${fmtPar(diff3)}?`,
            respuestaInput: valE,
            expresionSimplificada: p4b,
            tipoPropiedad: 'experto',
          });
          expl += ` = ${p4b}`;
        }

        pasosLlaveDiv.push(
          {
            exprActual: basePostE,
            operacionCorrecta: opCorch,
            opciones: [opMultM, opCorch],
            pistaError: 'Ya no quedan paréntesis; resuelve primero el corchete dentro del divisor.',
            preguntaInput: `Resuelve el corchete: ¿cuánto es ${corchBody}?`,
            respuestaInput: corcheteVal,
            expresionSimplificada: p5,
            tipoPropiedad: 'experto',
          },
          {
            exprActual: p5,
            operacionCorrecta: opMultP,
            opciones: [opMultM, opMultP],
            pistaError: 'Dentro de las llaves del divisor, multiplica antes de sumar o restar.',
            preguntaInput: `¿Cuánto es ${p} × ${corcheteVal}?`,
            respuestaInput: prodP,
            expresionSimplificada: p6,
            tipoPropiedad: 'experto',
          },
          {
            exprActual: p6,
            operacionCorrecta: opLlaves,
            opciones: [opMultM, opLlaves],
            pistaError: 'Termina de resolver las llaves del divisor antes de multiplicar o dividir afuera.',
            preguntaInput: `Resuelve las llaves: ¿cuánto es ${prodP} ${termRStr}?`,
            respuestaInput: llaveVal,
            expresionSimplificada: p7,
            tipoPropiedad: 'experto',
          },
          {
            exprActual: p7,
            operacionCorrecta: opMultM,
            opciones: [opMultM, `División ${pot1} ÷ ${fmtPar(llaveVal)}`],
            pistaError: 'Multiplicación y división tienen la misma jerarquía: se resuelven de izquierda a derecha.',
            preguntaInput: `¿Cuánto es ${m} × ${pot1}?`,
            respuestaInput: prodM,
            expresionSimplificada: p8,
            tipoPropiedad: 'experto',
          },
          {
            exprActual: p8,
            operacionCorrecta: opDiv,
            opciones: [opDiv, `${diff3 < 0 ? (opExt === '+' ? 'Resta' : 'Suma') : opExt === '+' ? 'Suma' : 'Resta'} ${fmtPar(llaveVal)} ${finalTermStr}`],
            pistaError: 'La división tiene prioridad sobre la suma o resta.',
            preguntaInput: `¿Cuánto es ${prodM} ÷ ${fmtPar(llaveVal)}?`,
            respuestaInput: coc,
            expresionSimplificada: p9,
            tipoPropiedad: 'experto',
          },
          {
            exprActual: p9,
            operacionCorrecta: 'Operación final',
            opciones: [],
            pistaError: '',
            preguntaInput: `Operación final: ¿cuánto es ${coc} ${finalTermStr}?`,
            preguntaInputDirecto: `Operación final: ¿cuánto es ${coc} ${finalTermStr}?`,
            respuestaInput: res,
            expresionSimplificada: `${res}`,
            tipoPropiedad: 'experto',
          }
        );

        return {
          id: Math.random(),
          operacion: opInicial,
          respuesta: res,
          caso: 'ejemplo3',
          casoNombre: 'Operaciones Combinadas con Potencias y Llaves',
          pista: 'Resuelve paréntesis y potencias, luego simplifica el corchete y la llave del divisor, y al final multiplica, divide y suma/resta.',
          explicacion: `${expl} = ${p5} = ${p7} = ${p8} = ${p9} = ${res}`,
          pasos: construirPasos(pasosLlaveDiv, 'experto'),
        };
      }

      // Corchete en el divisor + llave en el dividendo + paréntesis suelto:
      // { m (a - b) + (d - e) } ÷ [ f - (h - i)^2 ] ± (j - k)
      case 'e_corchete_en_divisor': {
        const diffH = pickFrom([-3, -2, 2, 3]);
        const potH = diffH * diffH; // 4 o 9
        const corcheteVal =
          potH === 9 ? pickFrom([-3, -2, 2, 3]) : pickFrom([-2, 2, 3, 4]);
        const f = potH + corcheteVal; // >= 2 siempre

        const coc = pickFrom([-4, -3, -2, 2, 3, 4]);
        const llaveVal = coc * corcheteVal;

        const paresMAlt: Array<{ m: number; diffA: number }> = [];
        for (const mCand of [2, 3]) {
          for (const dCand of [-3, -2, 2, 3]) {
            const rem = llaveVal - mCand * dCand;
            if (rem !== 0 && Math.abs(rem) <= 9) {
              paresMAlt.push({ m: mCand, diffA: dCand });
            }
          }
        }
        const elegidoMD = pickFrom(paresMAlt);
        const m = elegidoMD.m;
        const diffAReal = elegidoMD.diffA;
        const term1Real = m * diffAReal;
        const diffDReal = llaveVal - term1Real;

        const b = randomInt(4, 7);
        const a = b + diffAReal;
        const e = Math.max(2, Math.abs(diffDReal) + 1) + randomInt(0, 2);
        const d = e + diffDReal;

        let i = randomInt(4, 7);
        let h = i + diffH;
        while ((h === a && i === b) || (h === d && i === e)) {
          i += 1;
          h += 1;
        }

        const diffJ = pickFrom([-4, -3, -2, 2, 3, 4]);
        let k = randomInt(5, 8);
        let j = k + diffJ;
        while ((j === a && k === b) || (j === d && k === e) || (j === h && k === i)) {
          k += 1;
          j += 1;
        }
        const opExt = pickFrom(['+', '-'] as const);
        const res = opExt === '+' ? coc + diffJ : coc - diffJ;

        const opInicial = `{ ${m} (${a} - ${b}) + (${d} - ${e}) } ÷ [ ${f} - (${h} - ${i})^2 ] ${opExt} (${j} - ${k})`;
        const p1 = `{ ${m} (${a} - ${b}) + (${d} - ${e}) } ÷ [ ${f} - ${fmtPar(diffH)}^2 ] ${opExt} (${j} - ${k})`;
        const p2 = `{ ${m} (${a} - ${b}) + (${d} - ${e}) } ÷ [ ${f} - ${potH} ] ${opExt} (${j} - ${k})`;
        const p3 = `{ ${m} × ${fmtPar(diffAReal)} + (${d} - ${e}) } ÷ [ ${f} - ${potH} ] ${opExt} (${j} - ${k})`;
        const p4 = `{ ${m} × ${fmtPar(diffAReal)} + ${fmtPar(diffDReal)} } ÷ [ ${f} - ${potH} ] ${opExt} (${j} - ${k})`;

        const termDStr = diffDReal < 0 ? `- ${Math.abs(diffDReal)}` : `+ ${diffDReal}`;
        const p4b = `{ ${m} × ${fmtPar(diffAReal)} ${termDStr} } ÷ [ ${f} - ${potH} ] ${opExt} (${j} - ${k})`;
        const basePostD = diffDReal < 0 ? p4b : p4;

        const p5 = `{ ${m} × ${fmtPar(diffAReal)} ${termDStr} } ÷ [ ${f} - ${potH} ] ${opExt} ${fmtPar(diffJ)}`;
        const finalTermStr =
          diffJ < 0
            ? opExt === '+'
              ? `- ${Math.abs(diffJ)}`
              : `+ ${Math.abs(diffJ)}`
            : `${opExt} ${diffJ}`;
        const p5b = `{ ${m} × ${fmtPar(diffAReal)} ${termDStr} } ÷ [ ${f} - ${potH} ] ${finalTermStr}`;
        const basePostJ = diffJ < 0 ? p5b : p5;

        const p6 = `{ ${m} × ${fmtPar(diffAReal)} ${termDStr} } ÷ ${fmtPar(corcheteVal)} ${finalTermStr}`;
        const p7 = `{ ${term1Real} ${termDStr} } ÷ ${fmtPar(corcheteVal)} ${finalTermStr}`;
        const p8 = `${fmtPar(llaveVal)} ÷ ${fmtPar(corcheteVal)} ${finalTermStr}`;
        const p9 = `${coc} ${finalTermStr}`;

        const opParH = `Paréntesis (${h} - ${i})`;
        const opPotH = `Potencia ${fmtPar(diffH)}^2`;
        const opParA = `Paréntesis (${a} - ${b})`;
        const opParD = `Paréntesis (${d} - ${e})`;
        const opParJ = `Paréntesis (${j} - ${k})`;
        const opCorch = `Corchetes [ ${f} - ${potH} ]`;
        const opMultA = `Multiplicación ${m} × ${fmtPar(diffAReal)}`;
        const opLlaves = `Llaves { ${term1Real} ${termDStr} }`;
        const opDiv = `División ${fmtPar(llaveVal)} ÷ ${fmtPar(corcheteVal)}`;

        const pasosCorchDiv: PasoCombinadoSpec[] = [
          {
            exprActual: opInicial,
            operacionCorrecta: opParH,
            opciones: [opParH, opParA, opParD],
            pistaError: 'Resuelve primero el paréntesis dentro del corchete divisor.',
            preguntaInput: `¿Cuánto es ${h} - ${i}?`,
            respuestaInput: diffH,
            expresionSimplificada: p1,
            tipoPropiedad: 'experto',
          },
          {
            exprActual: p1,
            operacionCorrecta: opPotH,
            opciones: [opPotH, opParA, opParJ],
            pistaError: 'Calcula primero la potencia dentro del corchete.',
            preguntaInput: `Calcula la potencia: ¿cuánto es ${fmtPar(diffH)}^2?`,
            respuestaInput: potH,
            expresionSimplificada: p2,
            tipoPropiedad: 'experto',
          },
          {
            exprActual: p2,
            operacionCorrecta: opParA,
            opciones: [opParA, opParD, opParJ],
            pistaError: 'Continúa resolviendo los paréntesis dentro de las llaves antes de operar con corchetes.',
            preguntaInput: `¿Cuánto es ${a} - ${b}?`,
            respuestaInput: diffAReal,
            expresionSimplificada: p3,
            tipoPropiedad: 'experto',
          },
          {
            exprActual: p3,
            operacionCorrecta: opParD,
            opciones: [opMultA, opParD, opParJ],
            pistaError: 'Resuelve los paréntesis pendientes antes de multiplicar.',
            preguntaInput: `¿Cuánto es ${d} - ${e}?`,
            respuestaInput: diffDReal,
            expresionSimplificada: p4,
            tipoPropiedad: 'experto',
          },
        ];

        let expl = `${opInicial} = ${p1} = ${p2} = ${p3} = ${p4}`;
        if (diffDReal < 0) {
          pasosCorchDiv.push({
            exprActual: p4,
            operacionCorrecta: `Paréntesis +${fmtPar(diffDReal)}`,
            opciones: [`Paréntesis +${fmtPar(diffDReal)}`, opParJ],
            pistaError: 'Elimina el paréntesis dentro de las llaves aplicando ley de signos (+ por - = -).',
            preguntaInput: `Elimina el paréntesis aplicando ley de signos: ¿cuánto es +${fmtPar(diffDReal)}?`,
            respuestaInput: diffDReal,
            expresionSimplificada: p4b,
            tipoPropiedad: 'experto',
          });
          expl += ` = ${p4b}`;
        }

        pasosCorchDiv.push({
          exprActual: basePostD,
          operacionCorrecta: opParJ,
          opciones: [opMultA, opParJ],
          pistaError: 'Termina de resolver el paréntesis suelto antes de resolver el corchete y las llaves.',
          preguntaInput: `¿Cuánto es ${j} - ${k}?`,
          respuestaInput: diffJ,
          expresionSimplificada: p5,
          tipoPropiedad: 'experto',
        });
        expl += ` = ${p5}`;

        if (diffJ < 0) {
          const opSignoJ = `Paréntesis ${opExt}${fmtPar(diffJ)}`;
          const valJ = opExt === '+' ? diffJ : Math.abs(diffJ);
          pasosCorchDiv.push({
            exprActual: p5,
            operacionCorrecta: opSignoJ,
            opciones: [opSignoJ, opMultA],
            pistaError: 'Elimina el paréntesis exterior aplicando ley de signos antes de seguir.',
            preguntaInput: `Elimina el paréntesis aplicando ley de signos: ¿cuánto es ${opExt}${fmtPar(diffJ)}?`,
            respuestaInput: valJ,
            expresionSimplificada: p5b,
            tipoPropiedad: 'experto',
          });
          expl += ` = ${p5b}`;
        }

        pasosCorchDiv.push(
          {
            exprActual: basePostJ,
            operacionCorrecta: opCorch,
            opciones: [opCorch, opMultA],
            pistaError: 'Ya no quedan paréntesis; por jerarquía de agrupación, resuelve el corchete antes que las llaves.',
            preguntaInput: `Resuelve el corchete: ¿cuánto es ${f} - ${potH}?`,
            respuestaInput: corcheteVal,
            expresionSimplificada: p6,
            tipoPropiedad: 'experto',
          },
          {
            exprActual: p6,
            operacionCorrecta: opMultA,
            opciones: [opMultA, `División { ${m} × ${fmtPar(diffAReal)} ${termDStr} } ÷ ${fmtPar(corcheteVal)}`],
            pistaError: 'Dentro de las llaves, la multiplicación va antes que la suma o resta.',
            preguntaInput: `¿Cuánto es ${m} × ${fmtPar(diffAReal)}?`,
            respuestaInput: term1Real,
            expresionSimplificada: p7,
            tipoPropiedad: 'experto',
          },
          {
            exprActual: p7,
            operacionCorrecta: opLlaves,
            opciones: [opLlaves, `División { ${term1Real} ${termDStr} } ÷ ${fmtPar(corcheteVal)}`],
            pistaError: 'Termina primero de resolver las llaves del dividendo antes de dividir.',
            preguntaInput: `Resuelve las llaves: ¿cuánto es ${term1Real} ${termDStr}?`,
            respuestaInput: llaveVal,
            expresionSimplificada: p8,
            tipoPropiedad: 'experto',
          },
          {
            exprActual: p8,
            operacionCorrecta: opDiv,
            opciones: [opDiv, `${diffJ < 0 ? (opExt === '+' ? 'Resta' : 'Suma') : opExt === '+' ? 'Suma' : 'Resta'} ${fmtPar(corcheteVal)} ${finalTermStr}`],
            pistaError: 'La división tiene prioridad sobre la suma o resta.',
            preguntaInput: `¿Cuánto es ${fmtPar(llaveVal)} ÷ ${fmtPar(corcheteVal)}?`,
            respuestaInput: coc,
            expresionSimplificada: p9,
            tipoPropiedad: 'experto',
          },
          {
            exprActual: p9,
            operacionCorrecta: 'Operación final',
            opciones: [],
            pistaError: '',
            preguntaInput: `Operación final: ¿cuánto es ${coc} ${finalTermStr}?`,
            preguntaInputDirecto: `Operación final: ¿cuánto es ${coc} ${finalTermStr}?`,
            respuestaInput: res,
            expresionSimplificada: `${res}`,
            tipoPropiedad: 'experto',
          }
        );

        return {
          id: Math.random(),
          operacion: opInicial,
          respuesta: res,
          caso: 'ejemplo3',
          casoNombre: 'Operaciones Combinadas con Potencias y Llaves',
          pista: 'Resuelve paréntesis y potencias, luego el corchete divisor, después la llave dividendo y finalmente divide y suma o resta.',
          explicacion: `${expl} = ${p6} = ${p7} = ${p8} = ${p9} = ${res}`,
          pasos: construirPasos(pasosCorchDiv, 'experto'),
        };
      }

      // Potencia inicial con resta + división DENTRO de la llave + paréntesis:
      // (a - b)^2 - k { [ (c - d) × e ± |f| ] ÷ g + (h - i) }
      case 'e_suma_inicial_llave': {
        const diff1 = pickFrom([-3, -2, 2, 3]);
        const pot1 = diff1 * diff1;
        const b = randomInt(4, 7);
        const a = b + diff1;

        const diff2 = pickFrom([-3, -2, 2, 3]);
        const e = randomInt(2, 4);
        const prod2 = diff2 * e;

        const g = randomInt(2, 4);
        let coc = pickFrom([-4, -3, -2, 2, 3, 4]);
        let corcheteVal = coc * g;
        let f = corcheteVal - prod2;
        if (f === 0) {
          coc = -coc;
          corcheteVal = coc * g;
          f = corcheteVal - prod2;
        }

        let diff3 = pickFrom([-4, -3, -2, 2, 3, 4]);
        if (coc + diff3 === 0) diff3 = diff3 > 0 ? diff3 + 1 : diff3 - 1;
        const llaveVal = coc + diff3;

        const k = randomInt(2, 4);
        const prodK = k * llaveVal;
        const res = pot1 - prodK;

        let d = randomInt(4, 7);
        let c = d + diff2;
        if (c === a && d === b) {
          d += 1;
          c += 1;
        }
        let i = randomInt(4, 7);
        let h = i + diff3;
        while ((h === a && i === b) || (h === c && i === d)) {
          i += 1;
          h += 1;
        }

        const termFStr = fmtTerm(f);
        const opInicial = `(${a} - ${b})^2 - ${k} { [ (${c} - ${d}) × ${e} ${termFStr} ] ÷ ${g} + (${h} - ${i}) }`;
        const p1 = `(${a} - ${b})^2 - ${k} { [ ${fmtPar(diff2)} × ${e} ${termFStr} ] ÷ ${g} + (${h} - ${i}) }`;
        const p2 = `(${a} - ${b})^2 - ${k} { [ ${fmtPar(diff2)} × ${e} ${termFStr} ] ÷ ${g} + ${fmtPar(diff3)} }`;

        const termHStr = diff3 < 0 ? `- ${Math.abs(diff3)}` : `+ ${diff3}`;
        const p2b = `(${a} - ${b})^2 - ${k} { [ ${fmtPar(diff2)} × ${e} ${termFStr} ] ÷ ${g} ${termHStr} }`;
        const basePostH = diff3 < 0 ? p2b : p2;

        const p3 = basePostH.replace(`(${a} - ${b})^2`, `${fmtPar(diff1)}^2`);
        const p4 = p3.replace(`${fmtPar(diff1)}^2`, `${pot1}`);
        const p5 = `${pot1} - ${k} { [ ${prod2} ${termFStr} ] ÷ ${g} ${termHStr} }`;
        const p6 = `${pot1} - ${k} { ${fmtPar(corcheteVal)} ÷ ${g} ${termHStr} }`;
        const p7 = `${pot1} - ${k} { ${coc} ${termHStr} }`;
        const p8 = `${pot1} - ${k} × ${fmtPar(llaveVal)}`;
        const p9 = `${pot1} - ${fmtPar(prodK)}`;

        const opParC = `Paréntesis (${c} - ${d})`;
        const opParH = `Paréntesis (${h} - ${i})`;
        const opParA = `Paréntesis (${a} - ${b})`;
        const opPot1 = `Potencia ${fmtPar(diff1)}^2`;
        const opMult2 = `Multiplicación ${fmtPar(diff2)} × ${e}`;
        const opCorch = `Corchetes [ ${prod2} ${termFStr} ]`;
        const opDivG = `División ${fmtPar(corcheteVal)} ÷ ${g}`;
        const opLlaves = `Llaves { ${coc} ${termHStr} }`;
        const opMultK = `Multiplicación ${k} × ${fmtPar(llaveVal)}`;

        const pasosSumaIni: PasoCombinadoSpec[] = [
          {
            exprActual: opInicial,
            operacionCorrecta: opParC,
            opciones: [opParC, opParH, opParA],
            pistaError: 'Resuelve primero el paréntesis más interno dentro del corchete.',
            preguntaInput: `¿Cuánto es ${c} - ${d}?`,
            respuestaInput: diff2,
            expresionSimplificada: p1,
            tipoPropiedad: 'experto',
          },
          {
            exprActual: p1,
            operacionCorrecta: opParH,
            opciones: [opMult2, opParH, opParA],
            pistaError: 'Continúa resolviendo los paréntesis pendientes antes de multiplicar.',
            preguntaInput: `¿Cuánto es ${h} - ${i}?`,
            respuestaInput: diff3,
            expresionSimplificada: p2,
            tipoPropiedad: 'experto',
          },
        ];

        let expl = `${opInicial} = ${p1} = ${p2}`;
        if (diff3 < 0) {
          pasosSumaIni.push({
            exprActual: p2,
            operacionCorrecta: `Paréntesis +${fmtPar(diff3)}`,
            opciones: [`Paréntesis +${fmtPar(diff3)}`, opParA],
            pistaError: 'Elimina el paréntesis dentro de las llaves aplicando ley de signos (+ por - = -).',
            preguntaInput: `Elimina el paréntesis aplicando ley de signos: ¿cuánto es +${fmtPar(diff3)}?`,
            respuestaInput: diff3,
            expresionSimplificada: p2b,
            tipoPropiedad: 'experto',
          });
          expl += ` = ${p2b}`;
        }

        pasosSumaIni.push(
          {
            exprActual: basePostH,
            operacionCorrecta: opParA,
            opciones: [opMult2, opParA],
            pistaError: 'Resuelve el paréntesis exterior antes de avanzar con los corchetes.',
            preguntaInput: `¿Cuánto es ${a} - ${b}?`,
            respuestaInput: diff1,
            expresionSimplificada: p3,
            tipoPropiedad: 'experto',
          },
          {
            exprActual: p3,
            operacionCorrecta: opPot1,
            opciones: [opPot1, `Resta ${fmtPar(diff1)}^2 - ${k}`],
            pistaError: 'Calcula la potencia antes de restar o entrar a los corchetes.',
            preguntaInput: `Calcula la potencia: ¿cuánto es ${fmtPar(diff1)}^2?`,
            respuestaInput: pot1,
            expresionSimplificada: p4,
            tipoPropiedad: 'experto',
          },
          {
            exprActual: p4,
            operacionCorrecta: opMult2,
            opciones: [opMult2, `Resta ${pot1} - ${k}`],
            pistaError: 'Dentro del corchete, la multiplicación va antes que la suma o resta.',
            preguntaInput: `¿Cuánto es ${fmtPar(diff2)} × ${e}?`,
            respuestaInput: prod2,
            expresionSimplificada: p5,
            tipoPropiedad: 'experto',
          },
          {
            exprActual: p5,
            operacionCorrecta: opCorch,
            opciones: [opCorch, `División [ ${prod2} ${termFStr} ] ÷ ${g}`],
            pistaError: 'Termina primero de resolver el corchete antes de dividir.',
            preguntaInput: `Resuelve el corchete: ¿cuánto es ${prod2} ${termFStr}?`,
            respuestaInput: corcheteVal,
            expresionSimplificada: p6,
            tipoPropiedad: 'experto',
          },
          {
            exprActual: p6,
            operacionCorrecta: opDivG,
            opciones: [`Resta ${pot1} - ${k}`, opDivG],
            pistaError: 'Dentro de las llaves, la división va antes que la suma o resta.',
            preguntaInput: `¿Cuánto es ${fmtPar(corcheteVal)} ÷ ${g}?`,
            respuestaInput: coc,
            expresionSimplificada: p7,
            tipoPropiedad: 'experto',
          },
          {
            exprActual: p7,
            operacionCorrecta: opLlaves,
            opciones: [opLlaves, `Multiplicación ${k} × { ${coc} ${termHStr} }`],
            pistaError: 'Simplifica primero la operación dentro de las llaves.',
            preguntaInput: `Resuelve las llaves: ¿cuánto es ${coc} ${termHStr}?`,
            respuestaInput: llaveVal,
            expresionSimplificada: p8,
            tipoPropiedad: 'experto',
          },
          {
            exprActual: p8,
            operacionCorrecta: opMultK,
            opciones: [`Resta ${pot1} - ${k}`, opMultK],
            pistaError: 'La multiplicación tiene mayor jerarquía que la resta.',
            preguntaInput: `¿Cuánto es ${k} × ${fmtPar(llaveVal)}?`,
            respuestaInput: prodK,
            expresionSimplificada: p9,
            tipoPropiedad: 'experto',
          },
          {
            exprActual: p9,
            operacionCorrecta: 'Resta final',
            opciones: [],
            pistaError: '',
            preguntaInput: `Operación final: ¿cuánto es ${pot1} - ${fmtPar(prodK)}?`,
            preguntaInputDirecto: `Operación final: ¿cuánto es ${pot1} - ${fmtPar(prodK)}?`,
            respuestaInput: res,
            expresionSimplificada: `${res}`,
            tipoPropiedad: 'experto',
          }
        );

        return {
          id: Math.random(),
          operacion: opInicial,
          respuesta: res,
          caso: 'ejemplo3',
          casoNombre: 'Operaciones Combinadas con Potencias y Llaves',
          pista: 'Resuelve paréntesis y la potencia inicial, luego simplifica el corchete y la división dentro de las llaves, multiplica y resta al final.',
          explicacion: `${expl} = ${p3} = ${p4} = ${p5} = ${p6} = ${p7} = ${p8} = ${p9} = ${res}`,
          pasos: construirPasos(pasosSumaIni, 'experto'),
        };
      }

      // Potencia cúbica dividida entre llave con resta de corchete + paréntesis suelto:
      // (d - e)^3 ÷ { f - [ g + h (i - j) ] } - k (a - b)
      case 'e_div_con_llave_y_pot': {
        const diff3 = pickFrom([-3, -2, 2, 3]);
        const h = randomInt(2, 3);
        const prodH = h * diff3;
        let g = randomInt(4, 9);
        if (g + prodH === 0) g += 1;
        let corcheteVal = g + prodH;

        let llaveVal = pickFrom([-4, -2, 2, 4]);
        let f = llaveVal + corcheteVal;
        if (f <= 1) {
          llaveVal = pickFrom([2, 4]);
          f = llaveVal + corcheteVal;
          if (f <= 1) {
            g += Math.abs(f) + 3;
            corcheteVal = g + prodH;
            f = llaveVal + corcheteVal;
          }
        }

        const diff2 = pickFrom([-2, 2]);
        const pot2 = diff2 * diff2 * diff2; // -8 o 8
        const coc = pot2 / llaveVal; // ±2 o ±4

        let k = randomInt(2, 4);
        const diff1 = pickFrom([-3, -2, 2, 3]);
        if (k === h && diff1 === diff3) {
          k = k === 2 ? 3 : 2;
        }
        const term2 = k * diff1;
        const res = coc - term2;

        const e = randomInt(4, 7);
        const d = e + diff2;
        let j = randomInt(4, 7);
        let i = j + diff3;
        if (i === d && j === e) {
          j += 1;
          i += 1;
        }
        let b = randomInt(4, 7);
        let a = b + diff1;
        while ((a === d && b === e) || (a === i && b === j)) {
          b += 1;
          a += 1;
        }

        const opInicial = `(${d} - ${e})^3 ÷ { ${f} - [ ${g} + ${h} (${i} - ${j}) ] } - ${k} (${a} - ${b})`;
        const p1 = `(${d} - ${e})^3 ÷ { ${f} - [ ${g} + ${h} × ${fmtPar(diff3)} ] } - ${k} (${a} - ${b})`;
        const p2 = `(${d} - ${e})^3 ÷ { ${f} - [ ${g} + ${h} × ${fmtPar(diff3)} ] } - ${k} × ${fmtPar(diff1)}`;
        const p3 = `${fmtPar(diff2)}^3 ÷ { ${f} - [ ${g} + ${h} × ${fmtPar(diff3)} ] } - ${k} × ${fmtPar(diff1)}`;
        const p4 = `${pot2} ÷ { ${f} - [ ${g} + ${h} × ${fmtPar(diff3)} ] } - ${k} × ${fmtPar(diff1)}`;
        const p5 = `${pot2} ÷ { ${f} - [ ${g} + ${fmtPar(prodH)} ] } - ${k} × ${fmtPar(diff1)}`;

        const corchBody = prodH < 0 ? `${g} - ${Math.abs(prodH)}` : `${g} + ${prodH}`;
        const p5b = `${pot2} ÷ { ${f} - [ ${corchBody} ] } - ${k} × ${fmtPar(diff1)}`;
        const basePostH = prodH < 0 ? p5b : p5;

        const p6 = `${pot2} ÷ { ${f} - ${fmtPar(corcheteVal)} } - ${k} × ${fmtPar(diff1)}`;
        const llaveBody = corcheteVal < 0 ? `${f} + ${Math.abs(corcheteVal)}` : `${f} - ${corcheteVal}`;
        const p6b = `${pot2} ÷ { ${llaveBody} } - ${k} × ${fmtPar(diff1)}`;
        const basePostCorch = corcheteVal < 0 ? p6b : p6;

        const p7 = `${pot2} ÷ ${fmtPar(llaveVal)} - ${k} × ${fmtPar(diff1)}`;
        const p8 = `${coc} - ${k} × ${fmtPar(diff1)}`;
        const p9 = `${coc} - ${fmtPar(term2)}`;

        const opParI = `Paréntesis (${i} - ${j})`;
        const opParA = `Paréntesis (${a} - ${b})`;
        const opParD = `Paréntesis (${d} - ${e})`;
        const opPot2 = `Potencia ${fmtPar(diff2)}^3`;
        const opMultH = `Multiplicación ${h} × ${fmtPar(diff3)}`;
        const opCorch = `Corchetes [ ${corchBody} ]`;
        const opLlaves = `Llaves { ${llaveBody} }`;
        const opDivExt = `División ${pot2} ÷ ${fmtPar(llaveVal)}`;

        const pasosDivPot: PasoCombinadoSpec[] = [
          {
            exprActual: opInicial,
            operacionCorrecta: opParI,
            opciones: [opParI, opParD, opParA],
            pistaError: 'Resuelve primero el paréntesis más interno dentro del corchete.',
            preguntaInput: `¿Cuánto es ${i} - ${j}?`,
            respuestaInput: diff3,
            expresionSimplificada: p1,
            tipoPropiedad: 'experto',
          },
          {
            exprActual: p1,
            operacionCorrecta: opParA,
            opciones: [opMultH, opParA, opParD],
            pistaError: 'Resuelve los paréntesis pendientes antes de multiplicar.',
            preguntaInput: `¿Cuánto es ${a} - ${b}?`,
            respuestaInput: diff1,
            expresionSimplificada: p2,
            tipoPropiedad: 'experto',
          },
          {
            exprActual: p2,
            operacionCorrecta: opParD,
            opciones: [opParD, opMultH],
            pistaError: 'Resuelve el último paréntesis (base de la potencia cúbica) antes de pasar al corchete.',
            preguntaInput: `¿Cuánto es ${d} - ${e}?`,
            respuestaInput: diff2,
            expresionSimplificada: p3,
            tipoPropiedad: 'experto',
          },
          {
            exprActual: p3,
            operacionCorrecta: opPot2,
            opciones: [opPot2, opMultH],
            pistaError: 'Calcula primero la potencia cúbica antes de continuar con corchetes y llaves.',
            preguntaInput: `Calcula la potencia: ¿cuánto es ${fmtPar(diff2)}^3?`,
            respuestaInput: pot2,
            expresionSimplificada: p4,
            tipoPropiedad: 'experto',
          },
          {
            exprActual: p4,
            operacionCorrecta: opMultH,
            opciones: [opMultH, `Multiplicación ${k} × ${fmtPar(diff1)}`],
            pistaError: 'Resuelve la multiplicación dentro del corchete antes de salir de él.',
            preguntaInput: `¿Cuánto es ${h} × ${fmtPar(diff3)}?`,
            respuestaInput: prodH,
            expresionSimplificada: p5,
            tipoPropiedad: 'experto',
          },
        ];

        let expl = `${opInicial} = ${p1} = ${p2} = ${p3} = ${p4} = ${p5}`;
        if (prodH < 0) {
          pasosDivPot.push({
            exprActual: p5,
            operacionCorrecta: `Paréntesis +${fmtPar(prodH)}`,
            opciones: [`Paréntesis +${fmtPar(prodH)}`, `Multiplicación ${k} × ${fmtPar(diff1)}`],
            pistaError: 'Elimina el paréntesis dentro del corchete aplicando ley de signos (+ por - = -).',
            preguntaInput: `Elimina el paréntesis aplicando ley de signos: ¿cuánto es +${fmtPar(prodH)}?`,
            respuestaInput: prodH,
            expresionSimplificada: p5b,
            tipoPropiedad: 'experto',
          });
          expl += ` = ${p5b}`;
        }

        pasosDivPot.push({
          exprActual: basePostH,
          operacionCorrecta: opCorch,
          opciones: [opCorch, `Multiplicación ${k} × ${fmtPar(diff1)}`],
          pistaError: 'Ya no quedan paréntesis; resuelve primero el corchete dentro de las llaves.',
          preguntaInput: `Resuelve el corchete: ¿cuánto es ${corchBody}?`,
          respuestaInput: corcheteVal,
          expresionSimplificada: p6,
          tipoPropiedad: 'experto',
        });
        expl += ` = ${p6}`;

        if (corcheteVal < 0) {
          pasosDivPot.push({
            exprActual: p6,
            operacionCorrecta: `Paréntesis -${fmtPar(corcheteVal)}`,
            opciones: [`Paréntesis -${fmtPar(corcheteVal)}`, `Multiplicación ${k} × ${fmtPar(diff1)}`],
            pistaError: 'Elimina el paréntesis dentro de las llaves aplicando ley de signos (- por - = +).',
            preguntaInput: `Elimina el paréntesis aplicando ley de signos: ¿cuánto es -${fmtPar(corcheteVal)}?`,
            respuestaInput: Math.abs(corcheteVal),
            expresionSimplificada: p6b,
            tipoPropiedad: 'experto',
          });
          expl += ` = ${p6b}`;
        }

        pasosDivPot.push(
          {
            exprActual: basePostCorch,
            operacionCorrecta: opLlaves,
            opciones: [opLlaves, `Multiplicación ${k} × ${fmtPar(diff1)}`],
            pistaError: 'Resuelve las llaves del divisor antes de dividir o multiplicar afuera.',
            preguntaInput: `Resuelve las llaves: ¿cuánto es ${llaveBody}?`,
            respuestaInput: llaveVal,
            expresionSimplificada: p7,
            tipoPropiedad: 'experto',
          },
          {
            exprActual: p7,
            operacionCorrecta: opDivExt,
            opciones: [opDivExt, `Multiplicación ${k} × ${fmtPar(diff1)}`],
            pistaError: 'Entre división y multiplicación en términos distintos, avanzamos de izquierda a derecha.',
            preguntaInput: `¿Cuánto es ${pot2} ÷ ${fmtPar(llaveVal)}?`,
            respuestaInput: coc,
            expresionSimplificada: p8,
            tipoPropiedad: 'experto',
          },
          {
            exprActual: p8,
            operacionCorrecta: `Multiplicación ${k} × ${fmtPar(diff1)}`,
            opciones: [`Resta ${coc} - ${k}`, `Multiplicación ${k} × ${fmtPar(diff1)}`],
            pistaError: 'La multiplicación tiene mayor jerarquía que la resta.',
            preguntaInput: `¿Cuánto es ${k} × ${fmtPar(diff1)}?`,
            respuestaInput: term2,
            expresionSimplificada: p9,
            tipoPropiedad: 'experto',
          },
          {
            exprActual: p9,
            operacionCorrecta: 'Resta final',
            opciones: [],
            pistaError: '',
            preguntaInput: `Operación final: ¿cuánto es ${coc} - ${fmtPar(term2)}?`,
            preguntaInputDirecto: `Operación final: ¿cuánto es ${coc} - ${fmtPar(term2)}?`,
            respuestaInput: res,
            expresionSimplificada: `${res}`,
            tipoPropiedad: 'experto',
          }
        );

        return {
          id: Math.random(),
          operacion: opInicial,
          respuesta: res,
          caso: 'ejemplo3',
          casoNombre: 'Operaciones Combinadas con Potencias y Llaves',
          pista: 'Resuelve paréntesis internos y potencia cúbica, luego corchetes y llaves en el divisor, y al final divide, multiplica y resta.',
          explicacion: `${expl} = ${p7} = ${p8} = ${p9} = ${res}`,
          pasos: construirPasos(pasosDivPot, 'experto'),
        };
      }

      // Llave al inicio sin coeficiente + multiplicación al final + segunda potencia afuera:
      // { [ (a - b)^2 + c ] - d (e - f) } × g - (h - i)^2
      case 'e_llave_primero_mult_pot':
      default: {
        const diff1 = pickFrom([-3, -2, 2, 3]);
        const pot1 = diff1 * diff1;
        const b = randomInt(4, 7);
        const a = b + diff1;

        let c = randomInt(2, 8);
        let corcheteVal = pot1 + c;

        const d = randomInt(2, 4);
        const diff2 = pickFrom([-3, -2, 2, 3]);
        const term2 = d * diff2;
        if (corcheteVal - term2 === 0) {
          c += 1;
          corcheteVal += 1;
        }
        const llaveVal = corcheteVal - term2;

        let f = randomInt(4, 7);
        let e = f + diff2;
        if (e === a && f === b) {
          f += 1;
          e += 1;
        }

        const g = randomInt(2, 4);
        const prodG = llaveVal * g;

        const diff3 = pickFrom([-3, -2, 2, 3]);
        const pot3 = diff3 * diff3;
        let i = randomInt(4, 7);
        let h = i + diff3;
        while ((h === a && i === b) || (h === e && i === f)) {
          i += 1;
          h += 1;
        }
        const res = prodG - pot3;

        const opInicial = `{ [ (${a} - ${b})^2 + ${c} ] - ${d} (${e} - ${f}) } × ${g} - (${h} - ${i})^2`;
        const p1 = `{ [ ${fmtPar(diff1)}^2 + ${c} ] - ${d} (${e} - ${f}) } × ${g} - (${h} - ${i})^2`;
        const p2 = `{ [ ${pot1} + ${c} ] - ${d} (${e} - ${f}) } × ${g} - (${h} - ${i})^2`;
        const p3 = `{ [ ${pot1} + ${c} ] - ${d} × ${fmtPar(diff2)} } × ${g} - (${h} - ${i})^2`;
        const p4 = `{ [ ${pot1} + ${c} ] - ${d} × ${fmtPar(diff2)} } × ${g} - ${fmtPar(diff3)}^2`;
        const p5 = `{ [ ${pot1} + ${c} ] - ${d} × ${fmtPar(diff2)} } × ${g} - ${pot3}`;
        const p6 = `{ ${corcheteVal} - ${d} × ${fmtPar(diff2)} } × ${g} - ${pot3}`;
        const p7 = `{ ${corcheteVal} - ${fmtPar(term2)} } × ${g} - ${pot3}`;

        const llaveBody = term2 < 0 ? `${corcheteVal} + ${Math.abs(term2)}` : `${corcheteVal} - ${term2}`;
        const p7b = `{ ${llaveBody} } × ${g} - ${pot3}`;
        const basePostT2 = term2 < 0 ? p7b : p7;

        const p8 = `${fmtPar(llaveVal)} × ${g} - ${pot3}`;
        const p9 = `${prodG} - ${pot3}`;

        const opPar1 = `Paréntesis (${a} - ${b})`;
        const opPot1 = `Potencia ${fmtPar(diff1)}^2`;
        const opPar2 = `Paréntesis (${e} - ${f})`;
        const opPar3 = `Paréntesis (${h} - ${i})`;
        const opPot3 = `Potencia ${fmtPar(diff3)}^2`;
        const opCorch = `Corchetes [ ${pot1} + ${c} ]`;
        const opMult2 = `Multiplicación ${d} × ${fmtPar(diff2)}`;
        const opLlaves = `Llaves { ${llaveBody} }`;
        const opMultG = `Multiplicación ${fmtPar(llaveVal)} × ${g}`;

        const pasosLlavePrimero: PasoCombinadoSpec[] = [
          {
            exprActual: opInicial,
            operacionCorrecta: opPar1,
            opciones: [opPar1, opPar2, opPar3],
            pistaError: 'Resuelve primero el paréntesis más interno dentro del corchete.',
            preguntaInput: `¿Cuánto es ${a} - ${b}?`,
            respuestaInput: diff1,
            expresionSimplificada: p1,
            tipoPropiedad: 'experto',
          },
          {
            exprActual: p1,
            operacionCorrecta: opPot1,
            opciones: [opPot1, opPar2, opPar3],
            pistaError: 'Calcula primero la potencia dentro del corchete.',
            preguntaInput: `Calcula la potencia: ¿cuánto es ${fmtPar(diff1)}^2?`,
            respuestaInput: pot1,
            expresionSimplificada: p2,
            tipoPropiedad: 'experto',
          },
          {
            exprActual: p2,
            operacionCorrecta: opPar2,
            opciones: [`Suma ${pot1} + ${c}`, opPar2, opPar3],
            pistaError: 'Resuelve los paréntesis pendientes antes de continuar con el corchete.',
            preguntaInput: `¿Cuánto es ${e} - ${f}?`,
            respuestaInput: diff2,
            expresionSimplificada: p3,
            tipoPropiedad: 'experto',
          },
          {
            exprActual: p3,
            operacionCorrecta: opPar3,
            opciones: [`Suma ${pot1} + ${c}`, opMult2, opPar3],
            pistaError: 'Resuelve el último paréntesis (base de la potencia exterior) antes de pasar al corchete.',
            preguntaInput: `¿Cuánto es ${h} - ${i}?`,
            respuestaInput: diff3,
            expresionSimplificada: p4,
            tipoPropiedad: 'experto',
          },
          {
            exprActual: p4,
            operacionCorrecta: opPot3,
            opciones: [`Suma ${pot1} + ${c}`, opMult2, opPot3],
            pistaError: 'Calcula la potencia exterior antes de resolver corchetes y llaves.',
            preguntaInput: `Calcula la potencia: ¿cuánto es ${fmtPar(diff3)}^2?`,
            respuestaInput: pot3,
            expresionSimplificada: p5,
            tipoPropiedad: 'experto',
          },
          {
            exprActual: p5,
            operacionCorrecta: opCorch,
            opciones: [opCorch, opMult2],
            pistaError: 'Ya no quedan paréntesis; resuelve completamente el corchete antes de operar en las llaves.',
            preguntaInput: `Resuelve el corchete: ¿cuánto es ${pot1} + ${c}?`,
            respuestaInput: corcheteVal,
            expresionSimplificada: p6,
            tipoPropiedad: 'experto',
          },
          {
            exprActual: p6,
            operacionCorrecta: opMult2,
            opciones: [`Resta ${corcheteVal} - ${d}`, opMult2],
            pistaError: 'Dentro de las llaves, la multiplicación va antes que la resta.',
            preguntaInput: `¿Cuánto es ${d} × ${fmtPar(diff2)}?`,
            respuestaInput: term2,
            expresionSimplificada: p7,
            tipoPropiedad: 'experto',
          },
        ];

        let expl = `${opInicial} = ${p1} = ${p2} = ${p3} = ${p4} = ${p5} = ${p6} = ${p7}`;
        if (term2 < 0) {
          pasosLlavePrimero.push({
            exprActual: p7,
            operacionCorrecta: `Paréntesis -${fmtPar(term2)}`,
            opciones: [`Paréntesis -${fmtPar(term2)}`, `Resta ${g} - ${pot3}`],
            pistaError: 'Elimina el paréntesis dentro de las llaves aplicando ley de signos (- por - = +).',
            preguntaInput: `Elimina el paréntesis aplicando ley de signos: ¿cuánto es -${fmtPar(term2)}?`,
            respuestaInput: Math.abs(term2),
            expresionSimplificada: p7b,
            tipoPropiedad: 'experto',
          });
          expl += ` = ${p7b}`;
        }

        pasosLlavePrimero.push(
          {
            exprActual: basePostT2,
            operacionCorrecta: opLlaves,
            opciones: [opLlaves, `Resta ${g} - ${pot3}`],
            pistaError: 'Resuelve primero la operación dentro de las llaves.',
            preguntaInput: `Resuelve las llaves: ¿cuánto es ${llaveBody}?`,
            respuestaInput: llaveVal,
            expresionSimplificada: p8,
            tipoPropiedad: 'experto',
          },
          {
            exprActual: p8,
            operacionCorrecta: opMultG,
            opciones: [opMultG, `Resta ${g} - ${pot3}`],
            pistaError: 'La multiplicación tiene mayor jerarquía que la resta.',
            preguntaInput: `¿Cuánto es ${fmtPar(llaveVal)} × ${g}?`,
            respuestaInput: prodG,
            expresionSimplificada: p9,
            tipoPropiedad: 'experto',
          },
          {
            exprActual: p9,
            operacionCorrecta: 'Resta final',
            opciones: [],
            pistaError: '',
            preguntaInput: `Operación final: ¿cuánto es ${prodG} - ${pot3}?`,
            preguntaInputDirecto: `Operación final: ¿cuánto es ${prodG} - ${pot3}?`,
            respuestaInput: res,
            expresionSimplificada: `${res}`,
            tipoPropiedad: 'experto',
          }
        );

        return {
          id: Math.random(),
          operacion: opInicial,
          respuesta: res,
          caso: 'ejemplo3',
          casoNombre: 'Operaciones Combinadas con Potencias y Llaves',
          pista: 'Resuelve paréntesis y potencias de adentro hacia afuera, luego corchetes, llaves, multiplica por el factor derecho y resta al final.',
          explicacion: `${expl} = ${p8} = ${p9} = ${res}`,
          pasos: construirPasos(pasosLlavePrimero, 'experto'),
        };
      }
    }
  };

  // Mezclar plantillas de nivel Experto por lote para garantizar máxima variedad estructural en cada sesión de 8 ejercicios
  const colaPlantillasExperto: PlantillaExperto[] = [...plantillasExperto];
  for (let i = colaPlantillasExperto.length - 1; i > 0; i--) {
    const j = randomInt(0, i);
    [colaPlantillasExperto[i], colaPlantillasExperto[j]] = [
      colaPlantillasExperto[j],
      colaPlantillasExperto[i],
    ];
  }
  let indiceExperto = 0;

  const generarPorDificultad = (): Ejercicio => {
    if (dificultad === 'basico') return generarBasico();
    if (dificultad === 'medio') return generarMedio();
    const plantilla =
      indiceExperto < colaPlantillasExperto.length
        ? colaPlantillasExperto[indiceExperto++]
        : undefined;
    return generarExperto(plantilla);
  };

  const ejercicios: Ejercicio[] = [];
  const operacionesUsadas = new Set<string>();
  let intentos = 0;
  const maxIntentos = 300;

  while (ejercicios.length < 8 && intentos < maxIntentos) {
    intentos++;
    const nuevo = generarPorDificultad();
    if (!operacionesUsadas.has(nuevo.operacion)) {
      operacionesUsadas.add(nuevo.operacion);
      ejercicios.push(nuevo);
    }
  }

  return ejercicios;
}
