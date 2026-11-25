import { useParams, useNavigate } from 'react-router-dom';

export default function CategoryPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <button onClick={() => navigate('/temas')} className="mb-4 text-blue-400 hover:underline">
        ← Volver a Temas
      </button>
      <h1 className="text-3xl font-bold capitalize">Categoría: {id}</h1>
      <p className="mt-4 text-slate-600">Aquí irán los temas de {id} próximamente.</p>
    </div>
  );
}
