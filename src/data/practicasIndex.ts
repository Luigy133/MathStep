import { generarEjerciciosRectaNumerica, infoSubtemaRecta } from './temas/aritmetica/suma-resta-enteros/recta-numerica';
import { generarEjerciciosMultiplicacion, infoSubtemaMultiplicacion } from './temas/aritmetica/multiplicacion-enteros/ley-signos';
import { generarEjerciciosDivision, infoSubtemaDivision } from './temas/aritmetica/division-enteros/ley-signos';
import { generarEjerciciosPotenciacion, infoSubtemaPotenciacion, TipoPotenciacion } from './temas/aritmetica/potenciacion-enteros/ley-signos';
import { generarEjerciciosPropiedadesCombinadas, infoSubtemaPropiedadesCombinadas, TipoCombinadas } from './temas/aritmetica/propiedades-combinadas/ley-signos';
import { generarEjerciciosOperacionesCombinadas, infoSubtemaOperacionesCombinadas, TipoOperacionesCombinadas } from './temas/aritmetica/operaciones-combinadas/ley-signos';
export type TipoPractica = TipoPotenciacion | TipoCombinadas | TipoOperacionesCombinadas;
export type { TipoPotenciacion, TipoCombinadas, TipoOperacionesCombinadas };
import { Nivel as NivelRecta } from './temas/aritmetica/suma-resta-enteros/recta-numerica';
import { Nivel as NivelMulti } from './temas/aritmetica/multiplicacion-enteros/ley-signos';
import { Nivel as NivelDiv } from './temas/aritmetica/division-enteros/ley-signos';
import { Nivel as NivelPot } from './temas/aritmetica/potenciacion-enteros/ley-signos';
import { Nivel as NivelCombinadas } from './temas/aritmetica/propiedades-combinadas/ley-signos';
import { Nivel as NivelOperacionesCombinadas } from './temas/aritmetica/operaciones-combinadas/ley-signos';

export interface PracticaInfo {
  titulo: string;
  videoUrl: string;
  timestamps: Record<string, { inicio: number; fin: number }>;
  generarEjercicios: (nivel: NivelRecta | NivelMulti | NivelDiv | NivelPot | NivelCombinadas | NivelOperacionesCombinadas, tipo?: any) => any;
  tipos?: TipoPractica[];
  disponible?: boolean;
}

export const practicasDisponibles: Record<string, PracticaInfo> = {
  'aritmetica/suma-resta-enteros': {
    titulo: infoSubtemaRecta.titulo,
    videoUrl: infoSubtemaRecta.videoUrl,
    timestamps: infoSubtemaRecta.timestamps,
    generarEjercicios: generarEjerciciosRectaNumerica,
  },
  'aritmetica/multiplicacion-enteros': {
    titulo: infoSubtemaMultiplicacion.titulo,
    videoUrl: infoSubtemaMultiplicacion.videoUrl,
    timestamps: infoSubtemaMultiplicacion.timestamps,
    generarEjercicios: generarEjerciciosMultiplicacion,
  },
  'aritmetica/division-enteros': {
    titulo: infoSubtemaDivision.titulo,
    videoUrl: infoSubtemaDivision.videoUrl,
    timestamps: infoSubtemaDivision.timestamps,
    generarEjercicios: generarEjerciciosDivision,
  },
  'aritmetica/potenciacion-enteros': {
    titulo: infoSubtemaPotenciacion.titulo,
    videoUrl: infoSubtemaPotenciacion.videoUrl,
    timestamps: infoSubtemaPotenciacion.timestamps,
    generarEjercicios: generarEjerciciosPotenciacion,
    tipos: ['signos', 'propiedades'],
  },
  'aritmetica/propiedades-combinadas': {
    titulo: infoSubtemaPropiedadesCombinadas.titulo,
    videoUrl: infoSubtemaPropiedadesCombinadas.videoUrl,
    timestamps: infoSubtemaPropiedadesCombinadas.timestamps,
    generarEjercicios: generarEjerciciosPropiedadesCombinadas,
    tipos: ['combinadas'],
    disponible: true,
  },
  'aritmetica/operaciones-combinadas': {
    titulo: infoSubtemaOperacionesCombinadas.titulo,
    videoUrl: infoSubtemaOperacionesCombinadas.videoUrl,
    timestamps: infoSubtemaOperacionesCombinadas.timestamps,
    generarEjercicios: generarEjerciciosOperacionesCombinadas,
    disponible: true,
  },
};
