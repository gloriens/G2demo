
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import StatsCard from "@/components/dashboard/StatsCard";
import BirthdayCard from "@/components/dashboard/BirthdayCard";
import AnnouncementCard from "@/components/dashboard/AnnouncementCard";
import CompanyNewsCard from "@/components/dashboard/CompanyNewsCard";
import { Users, Calendar, TrendingUp, UserCheck, Building, Coffee, Target } from "lucide-react";

const Index = () => {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6 lg:mb-8">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">Yönetici Paneli</h2>
              <p className="text-gray-600 text-sm lg:text-base">Şirket intranet yönetim sistemi - Detaylı istatistikler ve raporlar</p>
            </div>

            {/* Comprehensive Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
              <StatsCard
                title="Toplam Çalışan"
                value={145}
                icon={<Users className="h-6 w-6 text-white" />}
                color="bg-blue-500"
                trend="+5 bu ay"
              />
              <StatsCard
                title="Devam Eden Projeler"
                value={23}
                icon={<TrendingUp className="h-6 w-6 text-white" />}
                color="bg-green-500"
                trend="+3 yeni"
              />
              <StatsCard
                title="İzindeki Personel"
                value={8}
                icon={<Calendar className="h-6 w-6 text-white" />}
                color="bg-orange-500"
              />
              <StatsCard
                title="Bu Ay Başlayanlar"
                value={12}
                icon={<UserCheck className="h-6 w-6 text-white" />}
                color="bg-purple-500"
              />
              <StatsCard
                title="Departman Sayısı"
                value={6}
                icon={<Building className="h-6 w-6 text-white" />}
                color="bg-teal-500"
              />
              <StatsCard
                title="Aktif Etkinlikler"
                value={15}
                icon={<Coffee className="h-6 w-6 text-white" />}
                color="bg-pink-500"
              />
            </div>

            {/* Dashboard Content - Top Row */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8 mb-6 lg:mb-8">
              <AnnouncementCard />
              <CompanyNewsCard />
            </div>

            {/* Birthday Card and Highlights - Side by Side */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8 mb-6 lg:mb-8">
              <BirthdayCard />
              
              {/* Highlights */}
              <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6 border border-gray-100">
                <h3 className="text-lg lg:text-xl font-bold text-gray-800 mb-4 lg:mb-6">Bu Ay Öne Çıkanlar</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                    <div className="flex items-center space-x-2 mb-2">
                      <Target className="h-5 w-5 text-green-600" />
                      <h4 className="font-semibold text-green-800 text-sm lg:text-base">Proje Tamamlama</h4>
                    </div>
                    <p className="text-xs lg:text-sm text-green-700">3 büyük proje başarıyla tamamlandı</p>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                    <div className="flex items-center space-x-2 mb-2">
                      <Users className="h-5 w-5 text-blue-600" />
                      <h4 className="font-semibold text-blue-800 text-sm lg:text-base">Yeni Ekip Üyeleri</h4>
                    </div>
                    <p className="text-xs lg:text-sm text-blue-700">12 yeni çalışan ekibimize katıldı</p>
                  </div>
                  
                  <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                    <div className="flex items-center space-x-2 mb-2">
                      <Coffee className="h-5 w-5 text-purple-600" />
                      <h4 className="font-semibold text-purple-800 text-sm lg:text-base">Etkinlik Katılımı</h4>
                    </div>
                    <p className="text-xs lg:text-sm text-purple-700">%85 katılım oranı ile rekor kırdık</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-6 lg:mb-8 bg-white rounded-xl shadow-lg p-4 lg:p-6 border border-gray-100">
              <h3 className="text-lg lg:text-xl font-bold text-gray-800 mb-4">Hızlı İşlemler</h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                <button className="p-3 lg:p-4 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors text-center">
                  <Users className="h-6 lg:h-8 w-6 lg:w-8 text-blue-600 mx-auto mb-2" />
                  <span className="text-xs lg:text-sm font-medium text-blue-800">Çalışan Ekle</span>
                </button>
                <button className="p-3 lg:p-4 bg-green-100 hover:bg-green-200 rounded-lg transition-colors text-center">
                  <Calendar className="h-6 lg:h-8 w-6 lg:w-8 text-green-600 mx-auto mb-2" />
                  <span className="text-xs lg:text-sm font-medium text-green-800">Etkinlik Ekle</span>
                </button>
                <button className="p-3 lg:p-4 bg-purple-100 hover:bg-purple-200 rounded-lg transition-colors text-center">
                  <TrendingUp className="h-6 lg:h-8 w-6 lg:w-8 text-purple-600 mx-auto mb-2" />
                  <span className="text-xs lg:text-sm font-medium text-purple-800">Rapor Oluştur</span>
                </button>
                <button className="p-3 lg:p-4 bg-orange-100 hover:bg-orange-200 rounded-lg transition-colors text-center">
                  <UserCheck className="h-6 lg:h-8 w-6 lg:w-8 text-orange-600 mx-auto mb-2" />
                  <span className="text-xs lg:text-sm font-medium text-orange-800">İzin Onay</span>
                </button>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6 border border-gray-100">
              <h3 className="text-lg lg:text-xl font-bold text-gray-800 mb-4 lg:mb-6">Son Aktiviteler</h3>
              <div className="space-y-3 lg:space-y-4">
                <div className="flex items-center space-x-3 lg:space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-800 text-sm lg:text-base">Yeni çalışan <strong>Ahmet Yılmaz</strong> IT departmanına eklendi</p>
                    <p className="text-xs text-gray-500">2 saat önce</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 lg:space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-800 text-sm lg:text-base"><strong>Mobil Uygulama Projesi</strong> %75 tamamlandı</p>
                    <p className="text-xs text-gray-500">4 saat önce</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 lg:space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-800 text-sm lg:text-base">Şirket pikniği etkinliği oluşturuldu</p>
                    <p className="text-xs text-gray-500">1 gün önce</p>
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

export default Index;
