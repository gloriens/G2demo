
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import StatsCard from "@/components/dashboard/StatsCard";
import { Users, Calendar, TrendingUp, UserCheck, Building, Coffee, Target } from "lucide-react";

const Dashboard = () => {
  const departmentData = [
    { name: "IT", count: 25, color: "bg-blue-500" },
    { name: "İK", count: 12, color: "bg-green-500" },
    { name: "Muhasebe", count: 18, color: "bg-purple-500" },
    { name: "Satış", count: 35, color: "bg-orange-500" },
    { name: "Pazarlama", count: 22, color: "bg-pink-500" },
    { name: "Operasyon", count: 33, color: "bg-teal-500" }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h2>
              <p className="text-gray-600">Detaylı istatistikler ve raporlar</p>
            </div>

            {/* Detailed Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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

            {/* Department Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Departman Dağılımı</h3>
                <div className="space-y-4">
                  {departmentData.map((dept, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full ${dept.color}`}></div>
                        <span className="font-medium text-gray-700">{dept.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-gray-800">{dept.count}</span>
                        <span className="text-sm text-gray-500">kişi</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Bu Ay Öne Çıkanlar</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                    <div className="flex items-center space-x-2 mb-2">
                      <Target className="h-5 w-5 text-green-600" />
                      <h4 className="font-semibold text-green-800">Proje Tamamlama</h4>
                    </div>
                    <p className="text-sm text-green-700">3 büyük proje başarıyla tamamlandı</p>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                    <div className="flex items-center space-x-2 mb-2">
                      <Users className="h-5 w-5 text-blue-600" />
                      <h4 className="font-semibold text-blue-800">Yeni Ekip Üyeleri</h4>
                    </div>
                    <p className="text-sm text-blue-700">12 yeni çalışan ekibimize katıldı</p>
                  </div>
                  
                  <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                    <div className="flex items-center space-x-2 mb-2">
                      <Coffee className="h-5 w-5 text-purple-600" />
                      <h4 className="font-semibold text-purple-800">Etkinlik Katılımı</h4>
                    </div>
                    <p className="text-sm text-purple-700">%85 katılım oranı ile rekor kırdık</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Son Aktiviteler</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-gray-800">Yeni çalışan <strong>Ahmet Yılmaz</strong> IT departmanına eklendi</p>
                    <p className="text-xs text-gray-500">2 saat önce</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-gray-800"><strong>Mobil Uygulama Projesi</strong> %75 tamamlandı</p>
                    <p className="text-xs text-gray-500">4 saat önce</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-gray-800">Şirket pikniği etkinliği oluşturuldu</p>
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

export default Dashboard;