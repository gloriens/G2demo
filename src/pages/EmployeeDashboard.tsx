
import { Link } from "react-router-dom";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import StatsCard from "@/components/dashboard/StatsCard";
import BirthdayCard from "@/components/dashboard/BirthdayCard";
import AnnouncementCard from "@/components/dashboard/AnnouncementCard";
import { Calendar, Clock, Coffee, Heart, FileText } from "lucide-react";

const EmployeeDashboard = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Çalışan Paneli</h2>
              <p className="text-gray-600">Kişisel bilgileriniz ve güncel duyurular</p>
            </div>

            {/* Employee Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatsCard
                title="Kalan İzin Günü"
                value={15}
                icon={<Calendar className="h-6 w-6 text-white" />}
                color="bg-blue-500"
                trend="Bu yıl"
              />
              <StatsCard
                title="Çalışma Saati"
                value="8.5h"
                icon={<Clock className="h-6 w-6 text-white" />}
                color="bg-green-500"
                trend="Bugün"
              />
              <StatsCard
                title="Projelerim"
                value={3}
                icon={<Coffee className="h-6 w-6 text-white" />}
                color="bg-purple-500"
                trend="Aktif"
              />
              <StatsCard
                title="Takım Arkadaşları"
                value={12}
                icon={<Heart className="h-6 w-6 text-white" />}
                color="bg-pink-500"
                trend="IT Ekibi"
              />
            </div>

            {/* Dashboard Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <BirthdayCard />
              <AnnouncementCard />
            </div>

            {/* Personal Quick Actions */}
            <div className="mt-8 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Hızlı İşlemler</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link 
                  to="/my-leave-requests"
                  className="p-4 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors text-center"
                >
                  <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <span className="text-sm font-medium text-blue-800">İzin Talebi</span>
                </Link>
                <button className="p-4 bg-green-100 hover:bg-green-200 rounded-lg transition-colors text-center">
                  <Clock className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <span className="text-sm font-medium text-green-800">Mesai Saatleri</span>
                </button>
                <button className="p-4 bg-purple-100 hover:bg-purple-200 rounded-lg transition-colors text-center">
                  <Coffee className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <span className="text-sm font-medium text-purple-800">Etkinlik Katılımı</span>
                </button>
                <button className="p-4 bg-pink-100 hover:bg-pink-200 rounded-lg transition-colors text-center">
                  <Heart className="h-8 w-8 text-pink-600 mx-auto mb-2" />
                  <span className="text-sm font-medium text-pink-800">Profil Güncelle</span>
                </button>
              </div>
            </div>

            {/* Today's Schedule */}
            <div className="mt-8 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Bugünkü Programım</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-2 h-8 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="font-semibold text-gray-800">Haftalık Ekip Toplantısı</p>
                    <p className="text-sm text-gray-600">09:00 - 10:00 | Toplantı Odası A</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-2 h-8 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-semibold text-gray-800">Proje Gözden Geçirme</p>
                    <p className="text-sm text-gray-600">14:00 - 15:30 | Online</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                  <div className="w-2 h-8 bg-purple-500 rounded-full"></div>
                  <div>
                    <p className="font-semibold text-gray-800">Şirket Etkinliği</p>
                    <p className="text-sm text-gray-600">17:00 - 18:00 | Sosyal Alan</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
