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

              {/* Company News Slider - Top */}
              <div className="mb-6 lg:mb-8">
                <CompanyNewsCard />
              </div>

              {/* Dashboard Content - Top Row */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8 mb-6 lg:mb-8">
                <AnnouncementCard />
                <BirthdayCard />
                {/* İstersen CompanyNewsCard buradan kaldır */}
              </div>

              {/* Birthday Card and Placeholder */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8 mb-6 lg:mb-8">

                <div></div>
              </div>

            </div>
          </main>

        </div>
      </div>
  );
};

export default Home;
