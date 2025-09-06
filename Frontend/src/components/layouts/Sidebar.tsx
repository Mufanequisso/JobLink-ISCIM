import React from 'react';
import { 
  User, X, ChevronRight, LogOut, Home, Briefcase, Send
} from 'lucide-react';

interface SidebarProps {
  user: any;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  activeMenuItem: string;
  setActiveMenuItem: (item: string) => void;
  onLogout: () => void;
  onMenuItemClick: (itemId: string) => void; // Nova prop
}

const Sidebar: React.FC<SidebarProps> = ({
  user,
  sidebarOpen,
  setSidebarOpen,
  sidebarCollapsed,
  setSidebarCollapsed,
  activeMenuItem,
  setActiveMenuItem,
  onLogout,
  onMenuItemClick // Nova prop
}) => {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      description: 'Visão geral das suas atividades'
    },
    {
      id: 'jobs',
      label: 'Lista de vagas',
      icon: Briefcase,
      description: 'Explore oportunidades disponíveis'
    },
    {
      id: 'profile',
      label: 'Perfil do usuário',
      icon: User,
      description: 'Gerencie suas informações pessoais'
    },
    {
      id: 'applications',
      label: 'Candidaturas',
      icon: Send,
      description: 'Acompanhe suas candidaturas'
    }
  ];

  const handleMenuItemClick = (itemId: string) => {
    setActiveMenuItem(itemId);
    onMenuItemClick(itemId); // Chama a função passada via props
    
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const toggleSidebarCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <>
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 bg-white/95 backdrop-blur-lg shadow-2xl border-r border-gray-200 transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } ${
        sidebarCollapsed ? 'lg:w-20' : 'lg:w-80'
      } w-80`}>
        <div className="flex flex-col h-full">
          {/* Logo e Header da Sidebar */}
          <div className={`flex items-center justify-between p-6 border-b border-gray-200 ${sidebarCollapsed ? 'lg:justify-center' : ''}`}>
            <div className={`flex items-center space-x-3 ${sidebarCollapsed ? 'lg:hidden' : ''}`}>
              <div className="relative">
                <img
                  src="/img/logo.png"
                  alt="Logo JobLink ISCIM"
                  className="h-10 w-auto filter drop-shadow-lg"
                />
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-rose-600 rounded-full opacity-20 blur"></div>
              </div>
              <div>
                <h2 className="text-lg font-bold bg-gradient-to-r from-orange-600 via-rose-600 to-purple-600 bg-clip-text text-transparent">
                  JobLink ISCIM
                </h2>
                <p className="text-xs text-gray-600">Portal de Oportunidades</p>
              </div>
            </div>

            {/* Logo compacto quando colapsado */}
            {sidebarCollapsed && (
              <div className="hidden lg:block relative">
                <img
                  src="/img/logo.png"
                  alt="Logo JobLink ISCIM"
                  className="h-8 w-auto filter drop-shadow-lg"
                />
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-rose-600 rounded-full opacity-20 blur"></div>
              </div>
            )}

            <div className="flex items-center space-x-2">
              {/* Botão de colapsar/expandir (desktop) */}
              <button
                onClick={toggleSidebarCollapse}
                className="hidden lg:flex p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300 group"
                title={sidebarCollapsed ? 'Expandir menu' : 'Recolher menu'}
              >
                <div className="flex flex-col space-y-1">
                  <div className="w-4 h-0.5 bg-gray-600 group-hover:bg-orange-600 transition-colors duration-300"></div>
                  <div className="w-4 h-0.5 bg-gray-600 group-hover:bg-orange-600 transition-colors duration-300"></div>
                  <div className="w-4 h-0.5 bg-gray-600 group-hover:bg-orange-600 transition-colors duration-300"></div>
                </div>
              </button>

              {/* Botão de fechar (mobile) */}
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Perfil do Usuário na Sidebar */}
          <div className={`p-6 border-b border-gray-200 ${sidebarCollapsed ? 'lg:px-3' : ''}`}>
            <div className={`flex items-center space-x-3 ${sidebarCollapsed ? 'lg:justify-center' : ''}`}>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-rose-100 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-6 h-6 text-orange-600" />
              </div>
              <div className={`flex-1 min-w-0 ${sidebarCollapsed ? 'lg:hidden' : ''}`}>
                <p className="text-sm font-semibold text-gray-900 truncate">{user?.name || 'Usuário'}</p>
                <p className="text-xs text-gray-600 truncate">{user?.email || 'usuario@exemplo.com'}</p>
              </div>
            </div>
          </div>

          {/* Menu de Navegação */}
          <nav className={`flex-1 p-6 ${sidebarCollapsed ? 'lg:px-3' : ''}`}>
            <div className="space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleMenuItemClick(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-300 group ${
                    activeMenuItem === item.id
                      ? 'bg-gradient-to-r from-orange-100 to-rose-100 text-orange-800 shadow-lg transform scale-105'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  } ${
                    sidebarCollapsed ? 'lg:justify-center lg:px-3' : ''
                  }`}
                  title={sidebarCollapsed ? item.label : ''}
                >
                  <div className={`p-2 rounded-lg flex-shrink-0 ${
                    activeMenuItem === item.id
                      ? 'bg-white/80 shadow-md'
                      : 'bg-gray-100 group-hover:bg-gray-200'
                  }`}>
                    <item.icon className={`w-5 h-5 ${
                      activeMenuItem === item.id ? 'text-orange-600' : 'text-gray-600'
                    }`} />
                  </div>
                  <div className={`flex-1 min-w-0 ${sidebarCollapsed ? 'lg:hidden' : ''}`}>
                    <p className="font-medium">{item.label}</p>
                    <p className={`text-xs ${
                      activeMenuItem === item.id ? 'text-orange-700' : 'text-gray-500'
                    }`}>
                      {item.description}
                    </p>
                  </div>
                  {activeMenuItem === item.id && !sidebarCollapsed && (
                    <ChevronRight className="w-4 h-4 text-orange-600 lg:block hidden" />
                  )}
                </button>
              ))}
            </div>
          </nav>

          {/* Botão de Logout na Sidebar */}
          <div className={`p-6 border-t border-gray-200 ${sidebarCollapsed ? 'lg:px-3' : ''}`}>
            <button
              onClick={onLogout}
              className={`w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-300 group ${
                sidebarCollapsed ? 'lg:justify-center lg:px-3' : ''
              }`}
              title={sidebarCollapsed ? 'Sair da conta' : ''}
            >
              <div className="p-2 bg-gray-100 group-hover:bg-red-100 rounded-lg transition-colors duration-300 flex-shrink-0">
                <LogOut className="w-5 h-5" />
              </div>
              <span className={`font-medium ${sidebarCollapsed ? 'lg:hidden' : ''}`}>Sair da conta</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overlay para mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;