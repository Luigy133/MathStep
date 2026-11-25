import React from 'react';

interface Props {
  valorActual: number;
  rango?: [number, number];
}

export default function RectaNumericaVisual({ valorActual, rango = [-10, 10] }: Props) {
  const [min, max] = rango;
  const total = max - min;
  
  return (
    <div className="relative h-20 w-full flex items-center justify-center bg-slate-900 rounded-xl border border-slate-700 p-4">
      <div className="relative w-full h-1 bg-slate-500">
        {/* Marcadores de números */}
        {Array.from({ length: total + 1 }).map((_, i) => {
          const valor = min + i;
          return (
            <div key={valor} className="absolute h-4 w-px bg-slate-500" style={{ left: `${(i / total) * 100}%` }}>
              <span className="absolute top-4 -translate-x-1/2 text-xs text-slate-400">{valor}</span>
            </div>
          );
        })}
        {/* Marcador del valor actual */}
        <div 
          className="absolute h-8 w-4 -top-3.5 bg-blue-500 rounded-sm transition-all duration-300 ease-in-out"
          style={{ left: `${((valorActual - min) / total) * 100}%`, transform: 'translateX(-50%)' }}
        />
      </div>
    </div>
  );
}
