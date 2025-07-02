
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  Users, 
  Calendar, 
  MessageSquare, 
  Settings, 
  User,
  CalendarDays,
  Newspaper,
  PartyPopper,
  FileText,
  Clock,
  LogIn,
  FolderOpen,
  ChevronLeft,
  ChevronRight,
  Network
} from "lucide-react";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const menuItems = [
    { icon: Home, label: "Ana Sayfa", path: "/" },
    { icon: LogIn, label: "Giriş", path: "/login" },
    //{ icon: User, label: "Çalışan Paneli", path: "/employee-dashboard" },
    { icon: Users, label: "Çalışanlar", path: "/employees" },
    { icon: Network, label: "Organizasyon Şeması", path: "/organization-chart" },
    { icon: PartyPopper, label: "Etkinlikler", path: "/events" },
    { icon: Newspaper, label: "Haberler", path: "/news" },
    { icon: CalendarDays, label: "Takvim", path: "/calendar" },
    //{ icon: MessageSquare, label: "Mesajlar", path: "/messages" },
    //{ icon: FileText, label: "İzin Yönetimi", path: "/leave-management" },
    //{ icon: Clock, label: "İzin Taleplerim", path: "/my-leave-requests" },
    { icon: FolderOpen, label: "Dosya Yönetimi", path: "/documents" },
  ];

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile backdrop */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}
      
      <aside className={`
        fixed lg:relative z-30 bg-white shadow-lg transition-all duration-300 
        ${isCollapsed ? '-translate-x-full lg:translate-x-0 lg:w-16' : 'translate-x-0 w-64 lg:w-64'} 
        flex flex-col h-screen inset-y-0 left-0
      `}>
        {/* Collapse/Expand Button - positioned properly */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-20 bg-white border border-gray-200 rounded-full p-1.5 shadow-md hover:shadow-lg transition-shadow z-10 hidden lg:flex items-center justify-center"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-gray-600" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          )}
        </button>

        {/* Mobile toggle button */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="lg:hidden absolute right-4 top-4 p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors z-10"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">İK</span>
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <h1 className="text-xl font-bold text-gray-800 truncate">İK Sistemi</h1>
                <p className="text-xs text-gray-500 truncate">Yönetim Paneli</p>
              </div>
            )}
          </div>
        </div>
        
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActiveRoute(item.path);
              
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-700' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    onClick={() => {
                      // Close sidebar on mobile when clicking a link
                      if (window.innerWidth < 1024) {
                        setIsCollapsed(true);
                      }
                    }}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {!isCollapsed && <span className="font-medium truncate">{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        
        <div className={`p-4 border-t border-gray-200 ${isCollapsed ? 'text-center' : ''}`}>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-gray-600" />
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">Ahmet Yılmaz</p>
                <p className="text-xs text-gray-500 truncate">İK Uzmanı</p>
              </div>
            )}
          </div>
          
          {!isCollapsed && (
            <button className="mt-3 w-full flex items-center space-x-2 p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Settings className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm truncate">Ayarlar</span>
            </button>
          )}
        </div>
      </aside>

      {/* Mobile menu button */}
      <button 
        onClick={() => setIsCollapsed(false)}
        className={`fixed top-4 left-4 z-40 lg:hidden p-2 bg-white rounded-lg shadow-md border ${
          isCollapsed ? 'block' : 'hidden'
        }`}
      >
        <ChevronRight className="w-5 h-5 text-gray-600" />
      </button>
    </>
  );
};

export default Sidebar;
