// src/components/Navbar.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login'); // Redireciona para a página de login
  };

  const user = localStorage.getItem('user');
  const userName = user ? JSON.parse(user).name : 'Usuário';

  return (
    <nav className="bg-orange-600 text-white shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/dashboard" className="text-2xl font-bold hover:text-blue-200 transition">
            JobLink
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <span className="text-white font-medium">Olá, {userName}</span>
            <Link to="/dashboard" className="hover:text-blue-200 transition">Dashboard</Link>
            <Link to="/job/create" className="hover:text-blue-200 transition">Criar Vaga</Link>
            <Link to="/profile" className="hover:text-blue-200 transition">Perfil</Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded transition"
            >
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-blue-600 px-4 pt-2 pb-4 space-y-2">
          <span className="block text-white font-medium">Olá, {userName}</span>
          <Link to="/dashboard" className="block hover:text-blue-200 transition" onClick={() => setIsOpen(false)}>Dashboard</Link>
          <Link to="/job/create" className="block hover:text-blue-200 transition" onClick={() => setIsOpen(false)}>Criar Vaga</Link>
          <Link to="/profile" className="block hover:text-blue-200 transition" onClick={() => setIsOpen(false)}>Perfil</Link>
          <button
            onClick={handleLogout}
            className="w-full text-left bg-red-500 hover:bg-red-600 px-4 py-2 rounded transition"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;