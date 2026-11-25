import SubjectMenu from '../components/SubjectMenu';
import { useNavigate } from 'react-router-dom';

export default function ArithmeticPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6">
      <SubjectMenu title="Aritmética" onBack={() => navigate('/temas')} />
      <div className="mt-8">
      </div>
    </div>
  );
}
