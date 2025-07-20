import React from 'react';
import { MessageCircle, Mic, Database, FileText, Settings, BarChart3, ChevronLeft, ChevronRight } from 'lucide-react';
import { ActiveModule } from '../App';

interface SidebarProps {
  activeModule: ActiveModule;
  setActiveModule: (module: ActiveModule) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeModule, setActiveModule }) => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const menuItems = [
    { 
      id: 'chat' as ActiveModule, 
      icon: MessageCircle, 
      label: 'Conversation', 
      description: 'Conversation avec l\'IA',
      color: 'from-blue-500 to-indigo-600'
    },
    { 
      id: 'transcription' as ActiveModule, 
      icon: Mic, 
      label: 'Transcription', 
      description: 'Audio vers texte',
      color: 'from-purple-500 to-indigo-600'
    },
    { 
      id: 'rag' as ActiveModule, 
      icon: Database, 
      label: 'Base de connaissances', 
      description: 'Recherche & gestion',
      color: 'from-blue-500 to-cyan-600'
    },
    { 
      id: 'documentation' as ActiveModule, 
      icon: FileText, 
      label: 'Documentation', 
      description: 'Génération automatique',
      color: 'from-orange-500 to-red-600'
    },
    { 
      id: 'statistics' as ActiveModule, 
      icon: BarChart3, 
      label: 'Statistiques', 
      description: 'Analytics & métriques',
      color: 'from-pink-500 to-rose-600'
    },
  ];

  return (
    <div className={`${isCollapsed ? 'w-24' : 'w-72'} bg-white shadow-xl border-r border-gray-100 flex flex-col transition-all duration-300`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10  flex items-center justify-center ">
               <img src="/logo-color.png" alt="Logo" className="w-10 h-6" />
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="text-md font-bold text-gray-900">Carolina</h1>
                <p className="text-sm text-gray-500">Intelligence Artificielle</p>
              </div>
            )}
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            title={isCollapsed ? 'Étendre le menu' : 'Réduire le menu'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeModule === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveModule(item.id)}
              className={`w-full group relative overflow-hidden rounded-xl transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-r ' + item.color + ' text-white shadow-lg border border-white/20'
                  : 'text-gray-700 hover:bg-white hover:shadow-md border border-gray-100 hover:border-gray-200 bg-gray-50/50'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <div className={`flex items-center ${isCollapsed ? 'justify-center p-3' : 'gap-3 p-4'}`}>
                <div className={`${isCollapsed ? 'w-8 h-8' : 'w-10 h-10'} rounded-lg flex items-center justify-center transition-all duration-300 ${
                  isActive 
                    ? 'bg-white/20 backdrop-blur-sm' 
                    : 'bg-white shadow-sm group-hover:shadow-md'
                }`}>
                  <Icon className={`${isCollapsed ? 'w-4 h-4' : 'w-5 h-5'} transition-all duration-300 ${
                    isActive ? 'text-white' : 'text-gray-600 group-hover:text-gray-700'
                  }`} />
                </div>
                {!isCollapsed && (
                  <>
                    <div className="text-left flex-1">
                      <div className={`font-semibold text-sm transition-all duration-300 ${
                        isActive ? 'text-white' : 'text-gray-900'
                      }`}>
                        {item.label}
                      </div>
                      <div className={`text-xs mt-0.5 transition-all duration-300 ${
                        isActive ? 'text-white/80' : 'text-gray-500'
                      }`}>
                        {item.description}
                      </div>
                    </div>
                    
                    {/* Chevron indicator */}
                    <div className={`transition-all duration-300 ${
                      isActive ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2 group-hover:opacity-60 group-hover:translate-x-0'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        isActive ? 'bg-white' : 'bg-gray-400'
                      }`} />
                    </div>
                  </>
                )}
              </div>
              
              {/* Subtle glow effect for active state */}
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-50 rounded-xl" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100">
        <button 
          className={`w-full flex items-center ${isCollapsed ? 'justify-center p-3' : 'gap-3 p-3'} text-gray-700 hover:bg-white hover:text-gray-900 rounded-xl transition-all duration-300 hover:shadow-md group border border-gray-100 hover:border-gray-200 bg-gray-50/50`}
          title={isCollapsed ? 'Paramètres' : undefined}
        >
          <div className={`${isCollapsed ? 'w-6 h-6' : 'w-8 h-8'} bg-white shadow-sm group-hover:shadow-md rounded-lg flex items-center justify-center transition-all duration-300`}>
            <Settings className={`${isCollapsed ? 'w-3 h-3' : 'w-4 h-4'} text-gray-600 group-hover:text-gray-700 transition-colors duration-300`} />
          </div>
          {!isCollapsed && (
            <span className="font-semibold text-xs">Paramètres</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;