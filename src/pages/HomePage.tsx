// src/pages/HomePage.tsx
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

function HomePage() {
  const navigate = useNavigate();
  const categorias = [
    { id: "aritmetica", nombre: "Aritmética", icono: "∑" },
    { id: "algebra", nombre: "Álgebra", icono: "𝑥" },
    { id: "geometria", nombre: "Geometría", icono: "△" },
    { id: "trigonometria", nombre: "Trigonometría", icono: "📐" },
    { id: "estadistica", nombre: "Estadística", icono: "📊" },
  ];

  return (
    <div className="pagina">
      <Header />

      <main className="contenido">
        <h1 className="titulo-bienvenida">
          Bienvenido a <span className="resaltado">MathStep</span>
        </h1>
        <p className="subtitulo">Matemáticas Paso a Paso</p>

        <div className="grid-categorias">
          {categorias.map((cat) => (
            <button 
              key={cat.id} 
              className="tarjeta-categoria"
              onClick={() => navigate(`/temas/${cat.id}`)}
            >
              <span className="categoria-icono">{cat.icono}</span>
              <span className="categoria-nombre">{cat.nombre}</span>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}

export default HomePage;
