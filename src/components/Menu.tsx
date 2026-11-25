// src/components/Menu.tsx
import { useNavigate } from "react-router-dom";

interface MenuProps {
  onClose: () => void;
}

function Menu({ onClose }: MenuProps) {
  const navigate = useNavigate();

  const opciones = [
    { icono: "📚", texto: "Temas", ruta: "/temas" },
    { icono: "⚙️", texto: "Configuración", ruta: "/configuracion" },
    { icono: "📊", texto: "Mi progreso", ruta: "/progreso" },
    { icono: "👤", texto: "Mi perfil", ruta: "/perfil" },
  ];

  const handleClick = (ruta: string) => {
    navigate(ruta);
    onClose();
  };

  return (
    <div className="menu-overlay" onClick={onClose}>
      <nav className="menu-panel" onClick={(e) => e.stopPropagation()}>
        <button 
          className="menu-cerrar" 
          onClick={onClose}
          aria-label="Cerrar menú"
        >
          ✕
        </button>

        <ul className="menu-lista">
          {opciones.map((opcion) => (
            <li key={opcion.ruta}>
              <button 
                className="menu-item" 
                onClick={() => handleClick(opcion.ruta)}
              >
                <span className="menu-icono">{opcion.icono}</span>
                <span className="menu-texto">{opcion.texto}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default Menu;
