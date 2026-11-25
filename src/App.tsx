import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainView from './components/MainView';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import TemaPage from './pages/TemaPage';
import ArithmeticPage from './pages/ArithmeticPage';
import PracticaTemplate from './pages/PracticaTemplate';
import SubIndiceCombinados from './pages/SubIndiceCombinados';
import ConfiguracionPage from './pages/ConfiguracionPage';
import ProgresoPage from './pages/ProgresoPage';
import PerfilPage from './pages/PerfilPage';
import BrandIntro from './components/BrandIntro';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainView />} />
        <Route path="/temas" element={<HomePage />} />
        <Route path="/temas/:categoria" element={<CategoryPage />} />
        <Route path="/temas/:categoria/:subtema" element={<TemaPage />} />
        <Route path="/temas/:categoria/:subtema/practica" element={<PracticaTemplate />} />
        <Route path="/temas/aritmetica" element={<ArithmeticPage />} />
        <Route path="/temas/aritmetica/ejercicios-combinados" element={<SubIndiceCombinados />} />
        <Route path="/configuracion" element={<ConfiguracionPage />} />
        <Route path="/progreso" element={<ProgresoPage />} />
        <Route path="/perfil" element={<PerfilPage />} />
        <Route path="/test-intro" element={<BrandIntro />} />
      </Routes>
    </BrowserRouter>
  );
}
