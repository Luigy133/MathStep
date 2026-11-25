import React from 'react';

// Función para formatear el texto de la operación matemática
export const formatMath = (operacion: string) => {
  if (!operacion) return null;

  // Reemplazar ^n con <sup>n</sup>
  // Usamos una expresión regular para encontrar ^ seguido de dígitos
  const formatted = operacion
    .replace(/\^(\d+)/g, '<sup>$1</sup>')
    .replace(/(\(-\d+\))/g, '$1'); // Asegura que los paréntesis estén presentes

  return <span dangerouslySetInnerHTML={{ __html: formatted }} />;
};
