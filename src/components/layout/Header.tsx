import { Bell, Search, User, Menu } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-4 lg:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-lg lg:text-2xl font-bold text-gray-800 truncate">İntranet Yönetim Paneli</h1>
        </div>
        
        <div className="flex items-center space-x-2 lg:space-x-4">
          {/* 
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Ara..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-32 lg:w-auto"
            />
          </div>
          */}
          
          {/*
          <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Bell className="h-5 w-5 lg:h-6 lg:w-6" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 lg:h-5 lg:w-5 flex items-center justify-center text-xs">
              3
            </span>
          </button>
          */}
          
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 lg:w-8 lg:h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 lg:h-5 lg:w-5 text-white" />
            </div>
            <span className="text-gray-700 font-medium text-sm lg:text-base hidden sm:block truncate">İK Yöneticisi</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
