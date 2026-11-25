export type Nivel = 'basico' | 'medio' | 'experto';

export interface Ejercicio {
  id: number;
  operacion: string;
  respuesta: number;
  caso: number;
  casoNombre: string;
  pista: string;
  explicacion: string;
}

export const infoSubtemaRecta = {
  id: "recta-numerica",
  titulo: "La Recta Numérica",
  subtitulo: "Suma y Resta de Números Enteros",
  videoUrl: "/assets/Vd1_LaRectaNum.mp4",
  youtubeId: "",
  poster: "/images/poster-math-step.png",
  timestamps: {
    caso1: { inicio: 19, fin: 42 },
    caso2: { inicio: 43, fin: 72 },
    caso3: { inicio: 73, fin: 99 },
    caso4: { inicio: 100, fin: 128 },
  },
};

export function generarEjerciciosRectaNumerica(nivel: Nivel): Ejercicio[] {
  const ejercicios: Ejercicio[] = [];
  
  const rangos = {
    basico: { min: 1, max: 10, negMin: -10, negMax: -1 },
    medio: { min: 10, max: 25, negMin: -25, negMax: -10 },
    experto: { min: 20, max: 50, negMin: -50, negMax: -20 },
  };
  
  const r = rangos[nivel];
  
  const casos = [
    {
      id: 1,
      nombre: "Sumar dos positivos",
      generar: () => {
        const a = Math.floor(Math.random() * (r.max - r.min + 1)) + r.min;
        const b = Math.floor(Math.random() * (r.max - r.min + 1)) + r.min;
        return { 
          operacion: `${a} + ${b}`, 
          respuesta: a + b,
          pista: `Empieza en el ${a} y muévete ${b} pasos a la derecha.`,
          explicacion: `Sumar dos positivos mueve a la derecha. ${a} + ${b} = ${a + b}.`
        };
      }
    },
    {
      id: 2,
      nombre: "Restar dos negativos",
      generar: () => {
        const a = Math.floor(Math.random() * (r.negMax - r.negMin + 1)) + r.negMin;
        const b = Math.floor(Math.random() * (Math.abs(a) - Math.abs(r.negMin) + 1)) + r.negMin; // b más cercano a 0
        return { 
          operacion: `${a} - (${b})`, 
          respuesta: a - b,
          pista: `Restar un negativo es como sumar. Muévete ${Math.abs(b)} pasos a la derecha desde el ${a}.`,
          explicacion: `Restar dos negativos mueve a la derecha. ${a} - (${b}) = ${a - b}.`
        };
      }
    },
    {
      id: 3,
      nombre: "Sumar un positivo a un negativo",
      generar: () => {
        const a = Math.floor(Math.random() * (r.max - r.min + 1)) + r.min;
        const b = Math.floor(Math.random() * (r.negMax - r.negMin + 1)) + r.negMin;
        return { 
          operacion: `${a} + (${b})`, 
          respuesta: a + b,
          pista: `Sumar un negativo mueve a la izquierda. Empieza en el ${a} y muévete ${Math.abs(b)} pasos a la izquierda.`,
          explicacion: `Sumar un negativo mueve a la izquierda. ${a} + (${b}) = ${a + b}.`
        };
      }
    },
    {
      id: 4,
      nombre: "Sumar dos negativos",
      generar: () => {
        const a = Math.floor(Math.random() * (r.negMax - r.negMin + 1)) + r.negMin;
        const b = Math.floor(Math.random() * (r.negMax - r.negMin + 1)) + r.negMin;
        return { 
          operacion: `${a} + (${b})`, 
          respuesta: a + b,
          pista: `Sumar dos negativos mueve a la izquierda. Empieza en el ${a} y muévete ${Math.abs(b)} pasos a la izquierda.`,
          explicacion: `Sumar dos negativos mueve a la izquierda. ${a} + (${b}) = ${a + b}.`
        };
      }
    }
  ];

  // Generar 2 de cada caso (8 en total)
  casos.forEach(caso => {
    for (let i = 0; i < 2; i++) {
      const { operacion, respuesta, pista, explicacion } = caso.generar();
      ejercicios.push({
        id: Math.random(),
        operacion,
        respuesta,
        caso: caso.id,
        casoNombre: caso.nombre,
        pista,
        explicacion,
      });
    }
  });

  // Mezclar
  return ejercicios.sort(() => Math.random() - 0.5);
}
