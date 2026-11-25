// src/components/Header.tsx
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Settings, BarChart3, User } from 'lucide-react';
import Menu from "./Menu";

function Header() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <header className="flex items-center justify-between p-4 bg-slate-800 border-b border-slate-700">
        <div className="flex items-center gap-4">
          <button 
            className="menu-btn text-slate-100" 
            onClick={() => setMenuAbierto(!menuAbierto)}
            aria-label="Abrir menú"
          >
            ☰
          </button>
          
          <button className="logo" onClick={() => navigate('/')}>
            <img 
              src="/images/logo.png" 
              alt="MathStep - Matemáticas Paso a Paso Interactivas" 
              className="h-10 w-auto" 
            />
          </button>
        </div>

        <div className="flex gap-4 text-slate-100">
          <button onClick={() => navigate('/configuracion')}><Settings /></button>
          <button onClick={() => navigate('/progreso')}><BarChart3 /></button>
          <button onClick={() => navigate('/perfil')}><User /></button>
        </div>
      </header>

      {menuAbierto && (
        <Menu onClose={() => setMenuAbierto(false)} />
      )}
    </>
  );
}

export default Header;