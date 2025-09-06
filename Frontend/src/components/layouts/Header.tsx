import React from 'react';
import { Menu, User, Briefcase } from 'lucide-react';

interface HeaderProps {
  user: any;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  sidebarCollapsed: boolean;
  activeMenuItem: string;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({
  user,
  sidebarOpen,
  setSidebarOpen,
  sidebarCollapsed,
  activeMenuItem,
  onLogout
}) => {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      description: 'Visão geral das suas atividades'
    },
    {
      id: 'jobs',
      label: 'Lista de vagas',
      description: 'Explore oportunidades disponíveis'
    },
    {
      id: 'profile',
      label: 'Perfil do usuário',
      description: 'Gerencie suas informações pessoais'
    },
    {
      id: 'applications',
      label: 'Candidaturas',
      description: 'Acompanhe suas candidaturas'
    }
  ];

  return (
    <header className="bg-white/80 backdrop-blur-lg shadow-xl border-b border-orange-100 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            {/* Botão do Menu Mobile */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-gradient-to-r from-orange-100 to-rose-100 hover:from-orange-200 hover:to-rose-200 transition-all duration-300"
            >
              <Menu className="w-6 h-6 text-orange-600" />
            </button>

            <div className="flex items-center space-x-3">
              <div className={`relative ${sidebarCollapsed ? 'block' : 'hidden lg:block'}`}>
                <img
                  src="/img/logo.png"
                  alt="Logo JobLink ISCIM"
                  className="h-12 w-auto filter drop-shadow-lg"
                />
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-rose-600 rounded-full opacity-20 blur"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 via-rose-600 to-purple-600 bg-clip-text text-transparent">
                  {menuItems.find(item => item.id === activeMenuItem)?.label || 'JobLink ISCIM'}
                </h1>
                <p className="text-sm text-gray-600">
                  {menuItems.find(item => item.id === activeMenuItem)?.description || 'Portal de Oportunidades'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-orange-100 to-rose-100 rounded-full">
                <User className="w-4 h-4 text-orange-600" />
                <span className="font-medium text-gray-700">Olá, {user?.name || 'Usuário'}</span>
              </div>
              <div className="flex items-center space-x-2 px-3 py-2 bg-blue-100 rounded-full">
                <Briefcase className="w-4 h-4 text-blue-600" />
                <span className="text-blue-800 font-medium">Candidato</span>
              </div>
            </div>
            
            <button
              onClick={onLogout}
              className="group relative px-6 py-2 bg-gradient-to-r from-orange-600 to-rose-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <span className="relative z-10">Sair</span>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-700 to-rose-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;