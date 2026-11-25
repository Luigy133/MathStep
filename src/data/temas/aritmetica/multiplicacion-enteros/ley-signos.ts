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

export const infoSubtemaMultiplicacion = {
  id: "ley-signos",
  titulo: "La Ley de los Signos",
  subtitulo: "Multiplicación de Números Enteros",
  videoUrl: "/assets/Vd2multiplicacionEnteros.mp4",
  youtubeId: "",
  poster: "/images/poster-math-step.png",
  timestamps: {
    caso1: { inicio: 98, fin: 173 },   // Signos Iguales
    caso2: { inicio: 174, fin: 254 },  // Signos Diferentes
    caso3: { inicio: 255, fin: 321 },  // 3 o más factores
  },
};

export function generarEjerciciosMultiplicacion(nivel: Nivel): Ejercicio[] {
  const ejercicios: Ejercicio[] = [];
  
  const rangos = {
    basico: { min: 1, max: 5 },
    medio: { min: 5, max: 12 },
    experto: { min: 10, max: 25 },
  };
  
  const r = rangos[nivel];
  const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

  const casos = [
    {
      id: 1,
      nombre: "Signos Iguales",
      generar: () => {
        const a = randomInt(r.min, r.max);
        const b = randomInt(r.min, r.max);
        const esPositivo = Math.random() > 0.5;
        if (esPositivo) {
          return { operacion: `(+${a}) × (+${b})`, respuesta: a * b, pista: `Positivo por positivo da positivo.`, explicacion: `Signos iguales dan positivo. ${a} × ${b} = ${a * b}.` };
        } else {
          return { operacion: `(-${a}) × (-${b})`, respuesta: a * b, pista: `Negativo por negativo da positivo.`, explicacion: `Signos iguales dan positivo. (-${a}) × (-${b}) = ${a * b}.` };
        }
      }
    },
    {
      id: 2,
      nombre: "Signos Diferentes",
      generar: () => {
        const a = randomInt(r.min, r.max);
        const b = randomInt(r.min, r.max);
        const esPositivoPrimero = Math.random() > 0.5;
        if (esPositivoPrimero) {
          return { operacion: `(+${a}) × (-${b})`, respuesta: -(a * b), pista: `Positivo por negativo da negativo.`, explicacion: `Signos diferentes dan negativo. ${a} × (-${b}) = ${-(a * b)}.` };
        } else {
          return { operacion: `(-${a}) × (+${b})`, respuesta: -(a * b), pista: `Negativo por positivo da negativo.`, explicacion: `Signos diferentes dan negativo. (-${a}) × ${b} = ${-(a * b)}.` };
        }
      }
    },
    {
      id: 3,
      nombre: "Tres Factores",
      generar: () => {
        const a = randomInt(1, 5);
        const b = randomInt(1, 5);
        const c = randomInt(1, 5);
        const numA = a * (Math.random() > 0.5 ? 1 : -1);
        const numB = b * (Math.random() > 0.5 ? 1 : -1);
        const numC = c * (Math.random() > 0.5 ? 1 : -1);
        const respuesta = numA * numB * numC;
        const f = (n: number) => n > 0 ? `(+${n})` : `(${n})`;
        return { operacion: `${f(numA)} × ${f(numB)} × ${f(numC)}`, respuesta, pista: `Multiplica de izquierda a derecha.`, explicacion: `Multiplicando de izquierda a derecha: (${numA} × ${numB}) × ${numC} = ${respuesta}.` };
      }
    }
  ];

  for (let i = 0; i < 2; i++) {
    casos.forEach(caso => {
      const data = caso.generar();
      ejercicios.push({ ...data, id: Math.random(), caso: caso.id, casoNombre: caso.nombre });
    });
  }
  for (let i = 0; i < 2; i++) {
    const data = casos[2].generar();
    ejercicios.push({ ...data, id: Math.random(), caso: 3, casoNombre: "Tres Factores" });
  }

  return ejercicios.sort(() => Math.random() - 0.5);
}
