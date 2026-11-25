import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Layers, Calculator } from 'lucide-react';
import Header from '../components/Header';

interface OpcionCombinados {
  id: string;
  titulo: string;
  descripcion: string;
  ruta: string;
  disponible: boolean;
  icono: 'potencias' | 'operaciones';
}

const OPCIONES_COMBINADOS: OpcionCombinados[] = [
  {
    id: 'propiedades-combinadas',
    titulo: 'Propiedades Combinadas de la Potenciación',
    descripcion:
      'Aplica paso a paso multiplicación, división y potencia de potencia con igual base.',
    ruta: '/temas/aritmetica/propiedades-combinadas',
    disponible: true,
    icono: 'potencias',
  },
  {
    id: 'operaciones-combinadas',
    titulo: 'Operaciones Combinadas de Números Enteros',
    descripcion:
      'Resuelve expresiones respetando la jerarquía de operaciones, signos de agrupación y ley de signos.',
    ruta: '/temas/aritmetica/operaciones-combinadas',
    disponible: true,
    icono: 'operaciones',
  },
];

export default function SubIndiceCombinados() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <Header />

      <main className="p-6 max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/temas/aritmetica')}
          className="flex items-center gap-1 text-slate-400 hover:text-blue-400 mb-6 transition-colors"
        >
          <ChevronLeft size={20} /> Volver a Aritmética
        </button>

        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-400 mb-2">
            Números Enteros (Z)
          </p>
          <h1 className="text-3xl font-bold text-slate-100 mb-2">
            Ejercicios Combinados
          </h1>
          <p className="text-slate-400 text-base md:text-lg">
            Elige el tema que quieres estudiar y practicar paso a paso.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {OPCIONES_COMBINADOS.map((opcion) => (
            <button
              key={opcion.id}
              onClick={() => navigate(opcion.ruta)}
              className="group text-left bg-slate-800 hover:bg-slate-800/90 border border-slate-700 hover:border-blue-500 rounded-2xl p-6 shadow-lg transition-all flex flex-col justify-between gap-6"
            >
              <div>
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-xl bg-blue-500/15 text-blue-400">
                    {opcion.icono === 'potencias' ? (
                      <Layers size={24} />
                    ) : (
                      <Calculator size={24} />
                    )}
                  </div>
                </div>

                <h2 className="text-xl font-bold text-slate-100 group-hover:text-blue-400 transition-colors mb-2">
                  {opcion.titulo}
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {opcion.descripcion}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-700/70 text-sm font-semibold">
                <span className={opcion.disponible ? 'text-blue-400' : 'text-slate-400'}>
                  {opcion.disponible ? 'Ir al tema y práctica' : 'Ver detalle del tema'}
                </span>
                <ChevronRight
                  size={18}
                  className="text-slate-400 group-hover:text-blue-400 group-hover:translate-x-1 transition-all"
                />
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
