
import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { Calendar as CalendarIcon, Clock, MapPin, Users, Plus } from "lucide-react";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');

  const events = [
    {
      id: 1,
      title: "Ekip Toplantısı",
      date: "2024-01-15",
      time: "09:00",
      duration: "2 saat",
      location: "Toplantı Odası A",
      attendees: ["Ahmet Y.", "Ayşe D.", "Mehmet K."],
      type: "meeting",
      color: "bg-blue-500"
    },
    {
      id: 2,
      title: "Proje Değerlendirme",
      date: "2024-01-16",
      time: "14:00",
      duration: "1.5 saat",
      location: "Konferans Salonu",
      attendees: ["Fatma Ö.", "Ali Ş."],
      type: "meeting",
      color: "bg-green-500"
    },
    {
      id: 3,
      title: "Teknoloji Semineri",
      date: "2024-01-18",
      time: "10:00",
      duration: "3 saat",
      location: "Eğitim Salonu",
      attendees: ["Tüm IT Ekibi"],
      type: "event",
      color: "bg-purple-500"
    },
    {
      id: 4,
      title: "Doğum Günü Kutlaması",
      date: "2024-01-20",
      time: "15:30",
      duration: "30 dakika",
      location: "Mutfak Alanı",
      attendees: ["Tüm Çalışanlar"],
      type: "celebration",
      color: "bg-pink-500"
    }
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const getEventsForDate = (day: number) => {
    const dateStr = `2024-01-${day.toString().padStart(2, '0')}`;
    return events.filter(event => event.date === dateStr);
  };

  const days = getDaysInMonth(currentDate);
  const monthNames = [
    "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
    "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
  ];
  const dayNames = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">Takvim</h2>
                  <p className="text-gray-600">Toplantılar ve etkinlikler</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 bg-white rounded-lg p-1 shadow-sm border">
                    <button 
                      onClick={() => setViewMode('month')}
                      className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                        viewMode === 'month' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      Ay
                    </button>
                    <button 
                      onClick={() => setViewMode('week')}
                      className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                        viewMode === 'week' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      Hafta
                    </button>
                    <button 
                      onClick={() => setViewMode('day')}
                      className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                        viewMode === 'day' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      Gün
                    </button>
                  </div>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors">
                    <Plus className="h-5 w-5" />
                    <span>Yeni Etkinlik</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Calendar */}
              <div className="lg:col-span-3">
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                  {/* Calendar Header */}
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-800">
                      {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        ←
                      </button>
                      <button 
                        onClick={() => setCurrentDate(new Date())}
                        className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        Bugün
                      </button>
                      <button 
                        onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        →
                      </button>
                    </div>
                  </div>

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-1">
                    {/* Day Headers */}
                    {dayNames.map((day) => (
                      <div key={day} className="p-3 text-center text-sm font-medium text-gray-500 bg-gray-50">
                        {day}
                      </div>
                    ))}

                    {/* Calendar Days */}
                    {days.map((day, index) => (
                      <div
                        key={index}
                        className={`min-h-[100px] p-2 border border-gray-100 ${
                          day === null ? 'bg-gray-50' : 'bg-white hover:bg-gray-50'
                        } transition-colors`}
                      >
                        {day && (
                          <>
                            <div className="text-sm font-medium text-gray-800 mb-1">{day}</div>
                            <div className="space-y-1">
                              {getEventsForDate(day).map((event) => (
                                <div
                                  key={event.id}
                                  className={`text-xs p-1 rounded text-white ${event.color} truncate`}
                                  title={event.title}
                                >
                                  {event.title}
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar with upcoming events */}
              <div className="space-y-6">
                {/* Upcoming Events */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Yaklaşan Etkinlikler</h3>
                  <div className="space-y-4">
                    {events.slice(0, 4).map((event) => (
                      <div key={event.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                        <div className={`w-3 h-3 rounded-full ${event.color} mt-2`}></div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-800 text-sm">{event.title}</h4>
                          <div className="space-y-1 mt-1">
                            <div className="flex items-center text-xs text-gray-600">
                              <CalendarIcon className="h-3 w-3 mr-1" />
                              <span>{event.date}</span>
                            </div>
                            <div className="flex items-center text-xs text-gray-600">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>{event.time} ({event.duration})</span>
                            </div>
                            <div className="flex items-center text-xs text-gray-600">
                              <MapPin className="h-3 w-3 mr-1" />
                              <span>{event.location}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Bu Ay</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Toplam Etkinlik</span>
                      <span className="font-bold text-gray-800">{events.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Toplantılar</span>
                      <span className="font-bold text-gray-800">{events.filter(e => e.type === 'meeting').length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Etkinlikler</span>
                      <span className="font-bold text-gray-800">{events.filter(e => e.type === 'event').length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Kutlamalar</span>
                      <span className="font-bold text-gray-800">{events.filter(e => e.type === 'celebration').length}</span>
                    </div>
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

export default Calendar;
