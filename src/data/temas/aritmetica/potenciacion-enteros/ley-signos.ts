export type Nivel = 'basico' | 'medio' | 'experto';
export type TipoPotenciacion = 'signos' | 'propiedades' | 'mixto';

export interface PasoEjercicio {
  pregunta: string;
  respuesta: number | string;
  tipo: 'input' | 'selector';
  opciones?: string[];
  rol?: 'base' | 'operacion' | 'exponente' | 'resultado';
}

export interface Ejercicio {
  id: number;
  operacion: string;
  respuesta: number;
  caso: string;
  pista: string;
  explicacion: string;
  exp1?: number;
  exp2?: number;
  pasos?: PasoEjercicio[];
}

export const infoSubtemaPotenciacion = {
  id: "potenciacion-enteros",
  titulo: "Potenciación de Números Enteros",
  subtitulo: "Signos y Propiedades",
  videoUrl: "/assets/potenciacion_enteros.mp4",
  youtubeId: "",
  poster: "/images/poster-math-step.png",
  timestamps: {
    signos: { inicio: 126, fin: 213 },
    propiedades: { inicio: 215, fin: 344 },
  },
};

export function generarEjerciciosPotenciacion(nivel: Nivel, tipo: TipoPotenciacion = 'mixto'): Ejercicio[] {
  const ejercicios: Ejercicio[] = [];
  const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

  const generarSigno = (lvl: Nivel): Ejercicio => {
    let baseRaw: number, exponente: number;
    if (lvl === 'basico') {
      if (Math.random() > 0.5) { baseRaw = randomInt(1, 5); exponente = 2; }
      else { baseRaw = randomInt(1, 4); exponente = 3; }
    } else if (lvl === 'medio') {
      if (Math.random() > 0.5) { baseRaw = randomInt(2, 7); exponente = 2; }
      else { baseRaw = randomInt(2, 5); exponente = 3; }
    } else {
      const choice = Math.random();
      if (choice < 0.4) { baseRaw = randomInt(3, 10); exponente = 2; }
      else if (choice < 0.7) { baseRaw = randomInt(2, 5); exponente = 3; }
      else { baseRaw = randomInt(2, 5); exponente = 4; }
    }

    const esBaseNegativa = Math.random() > 0.5;
    const base = esBaseNegativa ? -baseRaw : baseRaw;
    const respuesta = Math.pow(base, exponente);

    const esBasePositiva = base > 0;
    const esExponentePar = exponente % 2 === 0;

    const pista = esBasePositiva
      ? `Base (+) con exponente ${esExponentePar ? 'par' : 'impar'} = Positivo. Calcula la potencia.`
      : `Base (-) con exponente ${esExponentePar ? 'par' : 'impar'} = ${esExponentePar ? 'Positivo' : 'Negativo'}. Calcula la potencia.`;

    return {
      id: Math.random(),
      operacion: `(${base})^${exponente}`,
      respuesta,
      caso: 'signos',
      pista,
      explicacion: `(${base})^${exponente} = ${respuesta}`
    };
  };

  const generarPropiedad = (lvl: Nivel): Ejercicio => {
    const propertyCases = ['n0', 'n1', 'mult', 'div', 'pow'];
    const property = propertyCases[randomInt(0, propertyCases.length - 1)];

    let base: number;
    if (lvl === 'basico') {
      base = randomInt(1, 4);
    } else if (lvl === 'medio') {
      base = randomInt(2, 5);
    } else {
      base = Math.random() > 0.5 ? randomInt(-4, -2) : randomInt(2, 5);
    }

    const baseStr = base < 0 ? `(${base})` : `${base}`;

    switch (property) {
      case 'n0':
        return {
          id: Math.random(),
          operacion: `${baseStr}^0`,
          respuesta: 1,
          caso: 'propiedades',
          pista: 'Todo número elevado a 0 es 1.',
          explicacion: `${baseStr}^0 = 1`
        };
      case 'n1':
        return {
          id: Math.random(),
          operacion: `${baseStr}^1`,
          respuesta: base,
          caso: 'propiedades',
          pista: 'Todo número elevado a 1 es el mismo número.',
          explicacion: `${baseStr}^1 = ${base}`
        };
      case 'mult': {
        let n = 2;
        let m = 2;
        if (lvl === 'basico') {
          n = Math.abs(base) <= 2 ? randomInt(2, 3) : 2;
          m = 2;
        } else if (lvl === 'medio') {
          n = Math.abs(base) <= 3 ? randomInt(2, 3) : 2;
          m = 2;
        } else {
          n = Math.abs(base) <= 3 ? randomInt(2, 3) : 2;
          m = Math.abs(base) <= 2 ? randomInt(2, 3) : 2;
        }
        const expRes = n + m;
        const resultado = Math.pow(base, expRes);
        return {
          id: Math.random(),
          operacion: `${baseStr}^${n} × ${baseStr}^${m}`,
          respuesta: resultado,
          caso: 'propiedades',
          pista: 'Multiplicación de potencias de igual base: se suman los exponentes.',
          explicacion: `${baseStr}^${n} × ${baseStr}^${m} = ${baseStr}^${expRes} = ${resultado}`,
          exp1: n,
          exp2: m,
          pasos: [
            { pregunta: '¿Cuál es la base?', respuesta: base, tipo: 'input', rol: 'base' },
            { pregunta: '¿Qué hacemos con los exponentes?', respuesta: 'Sumar', tipo: 'selector', opciones: ['Sumar', 'Restar'], rol: 'operacion' },
            { pregunta: '¿Cuál es el exponente resultante?', respuesta: expRes, tipo: 'input', rol: 'exponente' },
            { pregunta: '¿Cuál es el resultado final?', respuesta: resultado, tipo: 'input', rol: 'resultado' }
          ]
        };
      }
      case 'div': {
        const n = lvl === 'basico' ? 2 : randomInt(2, 3);
        const maxM = Math.abs(base) >= 4 ? Math.min(5, n + 2) : 5;
        const m = randomInt(n + 1, Math.max(n + 1, maxM));
        const expRes = m - n;
        const resultado = Math.pow(base, expRes);
        return {
          id: Math.random(),
          operacion: `${baseStr}^${m} ÷ ${baseStr}^${n}`,
          respuesta: resultado,
          caso: 'propiedades',
          pista: 'División de potencias de igual base: se restan los exponentes.',
          explicacion: `${baseStr}^${m} ÷ ${baseStr}^${n} = ${baseStr}^${expRes} = ${resultado}`,
          exp1: m,
          exp2: n,
          pasos: [
            { pregunta: '¿Cuál es la base?', respuesta: base, tipo: 'input', rol: 'base' },
            { pregunta: '¿Qué hacemos con los exponentes?', respuesta: 'Restar', tipo: 'selector', opciones: ['Sumar', 'Restar'], rol: 'operacion' },
            { pregunta: '¿Cuál es el exponente resultante?', respuesta: expRes, tipo: 'input', rol: 'exponente' },
            { pregunta: '¿Cuál es el resultado final?', respuesta: resultado, tipo: 'input', rol: 'resultado' }
          ]
        };
      }
      case 'pow': {
        const n = 2;
        const m = Math.abs(base) <= 2 ? randomInt(2, 3) : 2;
        const expRes = n * m;
        const resultado = Math.pow(base, expRes);
        return {
          id: Math.random(),
          operacion: `(${baseStr}^${n})^${m}`,
          respuesta: resultado,
          caso: 'propiedades',
          pista: 'Potencia de una potencia: se multiplican los exponentes.',
          explicacion: `(${baseStr}^${n})^${m} = ${baseStr}^${expRes} = ${resultado}`,
          exp1: n,
          exp2: m,
          pasos: [
            { pregunta: '¿Cuál es la base?', respuesta: base, tipo: 'input', rol: 'base' },
            { pregunta: '¿Cuál es el exponente resultante?', respuesta: expRes, tipo: 'input', rol: 'exponente' },
            { pregunta: '¿Cuál es el resultado final?', respuesta: resultado, tipo: 'input', rol: 'resultado' }
          ]
        };
      }
      default:
        return generarSigno(lvl);
    }
  };

  const operacionesUsadas = new Set<string>();
  let intentos = 0;
  const maxIntentos = 200;

  if (tipo === 'mixto') {
    const mitad = 4;
    let signosCount = 0;
    let propsCount = 0;

    while (ejercicios.length < 8 && intentos < maxIntentos) {
      intentos++;
      const usarProp =
        propsCount <= signosCount && propsCount < mitad
          ? true
          : signosCount >= mitad;
      const nuevoEjercicio = usarProp ? generarPropiedad(nivel) : generarSigno(nivel);
      if (!operacionesUsadas.has(nuevoEjercicio.operacion)) {
        operacionesUsadas.add(nuevoEjercicio.operacion);
        ejercicios.push(nuevoEjercicio);
        if (usarProp) propsCount++;
        else signosCount++;
      }
    }

    return ejercicios;
  }

  while (ejercicios.length < 8 && intentos < maxIntentos) {
    intentos++;
    const nuevoEjercicio = tipo === 'signos' ? generarSigno(nivel) : generarPropiedad(nivel);
    if (!operacionesUsadas.has(nuevoEjercicio.operacion)) {
      operacionesUsadas.add(nuevoEjercicio.operacion);
      ejercicios.push(nuevoEjercicio);
    }
  }

  return ejercicios;
}
