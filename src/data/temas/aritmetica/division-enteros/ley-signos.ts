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

export const infoSubtemaDivision = {
  id: "ley-signos",
  titulo: "La Ley de los Signos en la División",
  subtitulo: "División de Números Enteros",
  videoUrl: "/assets/division_enteros.mp4",
  youtubeId: "",
  poster: "/images/poster-math-step.png",
  timestamps: {
    caso1: { inicio: 216, fin: 292 }, // Signos Iguales
    caso2: { inicio: 293, fin: 363 }, // Signos Diferentes
    caso3: { inicio: 364, fin: 441 }, // 3 o más números
  },
};

export function generarEjerciciosDivision(nivel: Nivel): Ejercicio[] {
  const ejercicios: Ejercicio[] = [];
  
  const rangos = {
    basico: { min: 1, max: 5 },
    medio: { min: 5, max: 10 },
    experto: { min: 10, max: 20 },
  };
  
  const r = rangos[nivel];

  const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

  const casos = [
    {
      id: 1,
      nombre: "Signos Iguales",
      generar: () => {
        const divisor = randomInt(1, r.max);
        const cociente = randomInt(1, r.max);
        const dividendo = divisor * cociente;
        const esPositivo = Math.random() > 0.5;
        
        if (esPositivo) {
          return { 
            operacion: `(+${dividendo}) ÷ (+${divisor})`, 
            respuesta: cociente,
            pista: `Positivo entre positivo da positivo.`,
            explicacion: `Signos iguales dan positivo. (+${dividendo}) ÷ (+${divisor}) = ${cociente}.`
          };
        } else {
          return { 
            operacion: `(-${dividendo}) ÷ (-${divisor})`, 
            respuesta: cociente,
            pista: `Negativo entre negativo da positivo.`,
            explicacion: `Signos iguales dan positivo. (-${dividendo}) ÷ (-${divisor}) = ${cociente}.`
          };
        }
      }
    },
    {
      id: 2,
      nombre: "Signos Diferentes",
      generar: () => {
        const divisor = randomInt(1, r.max);
        const cociente = randomInt(1, r.max);
        const dividendo = divisor * cociente;
        const esPositivoPrimero = Math.random() > 0.5;
        
        if (esPositivoPrimero) {
          return { 
            operacion: `(+${dividendo}) ÷ (-${divisor})`, 
            respuesta: -cociente,
            pista: `Positivo entre negativo da negativo.`,
            explicacion: `Signos diferentes dan negativo. (+${dividendo}) ÷ (-${divisor}) = ${-cociente}.`
          };
        } else {
          return { 
            operacion: `(-${dividendo}) ÷ (+${divisor})`, 
            respuesta: -cociente,
            pista: `Negativo entre positivo da negativo.`,
            explicacion: `Signos diferentes dan negativo. (-${dividendo}) ÷ (+${divisor}) = ${-cociente}.`
          };
        }
      }
    },
    {
      id: 3,
      nombre: "Tres o más números",
      generar: () => {
        const d1 = randomInt(1, r.max);
        const d2 = randomInt(1, r.max);
        const cociente = randomInt(1, r.max);
        const divisorTotal = d1 * d2;
        const dividendo = divisorTotal * cociente;
        
        const signoA = Math.random() > 0.5 ? 1 : -1;
        const signoB = Math.random() > 0.5 ? 1 : -1;
        const signoC = Math.random() > 0.5 ? 1 : -1;
        
        const numA = dividendo * signoA;
        const numB = d1 * signoB;
        const numC = d2 * signoC;
        
        const respuesta = Math.floor(numA / numB / numC);
        const formatear = (n: number) => n > 0 ? `(+${n})` : `(${n})`;

        return { 
          operacion: `${formatear(numA)} ÷ ${formatear(numB)} ÷ ${formatear(numC)}`, 
          respuesta: respuesta,
          pista: `Divide paso a paso de izquierda a derecha.`,
          explicacion: `Dividiendo de izquierda a derecha: (${numA} ÷ ${numB}) ÷ ${numC} = ${respuesta}.`
        };
      }
    }
  ];

  for (let i = 0; i < 2; i++) {
    casos.forEach(caso => {
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
    });
  }
  
  return ejercicios.sort(() => Math.random() - 0.5);
}
