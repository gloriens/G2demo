import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import BirthdayCard from "@/components/dashboard/BirthdayCard";
import AnnouncementCard from "@/components/dashboard/AnnouncementCard";
import CompanyNewsCard from "@/components/dashboard/CompanyNewsCard";
import { Users, Calendar, TrendingUp, UserCheck, Coffee, Target } from "lucide-react";

const Home = () => {
  return (
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        <Sidebar />

        <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
          <Header />

          <main className="flex-1 overflow-y-auto p-4 lg:p-6">
            <div className="max-w-7xl mx-auto">
              <div className="mb-6 lg:mb-8">
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">Anasayfa</h2>
                <p className="text-gray-600 text-sm lg:text-base">PiA İntranet</p>
              </div>
              {/* Highligth flashvards */}
              <div className="mb-6 lg:mb-8">
                <h3 className="text-lg lg:text-xl font-bold text-gray-800 mb-4 lg:mb-6">Bu Ay Öne Çıkanlar</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Flashcard 1 */}
                  <div className="bg-green-50 rounded-2xl shadow-md hover:shadow-xl transition-shadow transform hover:-translate-y-1 border border-green-100 p-6 text-center cursor-pointer">
                    <div className="flex justify-center items-center mb-4">
                      <Target className="h-8 w-8 text-green-600" />
                    </div>
                    <h4 className="text-green-800 font-semibold text-base lg:text-lg mb-2">Proje Tamamlama</h4>
                    <p className="text-sm lg:text-base text-green-700">3 büyük proje başarıyla tamamlandı</p>
                  </div>


                  <div className="bg-blue-50 rounded-2xl shadow-md hover:shadow-xl transition-shadow transform hover:-translate-y-1 border border-blue-100 p-6 text-center cursor-pointer">
                    <div className="flex justify-center items-center mb-4">
                      <Users className="h-8 w-8 text-blue-600" />
                    </div>
                    <h4 className="text-blue-800 font-semibold text-base lg:text-lg mb-2">Yeni Ekip Üyeleri</h4>
                    <p className="text-sm lg:text-base text-blue-700">12 yeni çalışan ekibimize katıldı</p>
                  </div>
                  
                  <div className="bg-purple-50 rounded-2xl shadow-md hover:shadow-xl transition-shadow transform hover:-translate-y-1 border border-purple-100 p-6 text-center cursor-pointer">
                    <div className="flex justify-center items-center mb-4">
                      <Coffee className="h-8 w-8 text-purple-600" />
                    </div>
                    <h4 className="text-purple-800 font-semibold text-base lg:text-lg mb-2">Etkinlik Katılımı</h4>
                    <p className="text-sm lg:text-base text-purple-700">%85 katılım oranı ile rekor kırdık</p>
                  </div>
                </div>
              </div>



              {/* Dashboard Content - Top Row */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8 mb-6 lg:mb-8">
                <AnnouncementCard />
                <CompanyNewsCard />
              </div>

              {/* Birthday Card and Placeholder */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8 mb-6 lg:mb-8">
                <BirthdayCard />
                <div></div>
              </div>


              {/* Highlights - moved to end */}

            </div>
          </main>
        </div>
      </div>
  );
};

export default Home;
