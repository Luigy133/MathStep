import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronLeft, BookOpen } from 'lucide-react';

const ARITMETICA_DATA = {
  "Números Enteros (Z)": ["Suma y resta", "Multiplicación", "División", "Potenciación", "Ejercicios Combinados"],
  "Números Racionales (Q)": ["Suma y resta", "Multiplicación", "División", "Potenciación", "Ejercicios Combinados"],
  "Números Irracionales (I)": ["Expresiones Decimales", "Fracción generatriz"]
};

export default function SubjectMenu({ title, onBack }: { title: string, onBack: () => void }) {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const filteredData = Object.entries(ARITMETICA_DATA).reduce((acc, [category, subtopics]) => {
    const filteredSubs = subtopics.filter(sub => 
      sub.toLowerCase().includes(searchTerm.toLowerCase()) || 
      category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filteredSubs.length > 0) acc[category] = filteredSubs;
    return acc;
  }, {} as Record<string, string[]>);

  const handleNavigate = (subtema: string) => {
    let formattedSubtema = subtema.toLowerCase().replace(/ /g, '-');
    if (formattedSubtema === 'multiplicación') {
      formattedSubtema = 'multiplicacion-enteros';
    } else if (formattedSubtema === 'suma-y-resta') {
      formattedSubtema = 'suma-resta-enteros';
    } else if (formattedSubtema === 'división') {
      formattedSubtema = 'division-enteros';
    } else if (formattedSubtema === 'potenciación') {
      formattedSubtema = 'potenciacion-enteros';
    } else if (formattedSubtema === 'ejercicios-combinados') {
      navigate('/temas/aritmetica/ejercicios-combinados');
      return;
    } else if (formattedSubtema === 'propiedades-combinadas') {
      formattedSubtema = 'propiedades-combinadas';
    }
    navigate(`/temas/aritmetica/${formattedSubtema}`);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <button onClick={onBack} className="flex items-center text-slate-400 hover:text-blue-400 mb-6 transition-colors">
        <ChevronLeft size={20} /> Volver a Juniors
      </button>

      <h2 className="text-3xl font-bold text-blue-400 mb-6">{title}</h2>

      <div className="relative mb-8">
        <Search className="absolute left-4 top-3.5 text-slate-500" />
        <input 
          type="text"
          placeholder="Buscar tema..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-800 border-2 border-slate-700 focus:border-blue-500 outline-none text-lg text-slate-100 placeholder-slate-500"
        />
      </div>

      <div className="space-y-8">
        {Object.entries(filteredData).map(([category, subtopics]) => (
          <div key={category} className="bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-700">
            <h3 className="text-xl font-bold text-slate-200 mb-4">{category}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {subtopics.map(sub => (
                <button key={sub} onClick={() => handleNavigate(sub)} className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-700 transition-colors border border-slate-700">
                  <div className="p-2 bg-slate-900 rounded-lg text-blue-400"><BookOpen size={20} /></div>
                  <span className="font-medium text-slate-300">{sub}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
