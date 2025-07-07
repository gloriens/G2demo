import { useState, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { Calendar as CalendarIcon, Clock, MapPin, Users, Plus, Gift } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchEvents, clearError as clearEventsError } from "@/store/slices/eventsSlice";
import { fetchEmployees, clearError as clearEmployeesError } from "@/store/slices/employeeSlice"; // ✅ employees kullan
import { fetchAnnouncements, clearError as clearAnnouncementsError } from "@/store/slices/announcementSlice";
import { useToast } from "@/hooks/use-toast";

const Calendar = () => {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');

  // Redux state'lerini al - employees kullan
  const { events, loading: eventsLoading, error: eventsError } = useAppSelector(state => state.events);
  const { employees, loading: employeesLoading, error: employeesError } = useAppSelector(state => state.employees); // ✅ employees
  const { announcements, loading: announcementsLoading, error: announcementsError } = useAppSelector(state => state.announcements);

  // Component mount olduğunda tüm verileri çek
  useEffect(() => {
    dispatch(fetchEvents());
    dispatch(fetchEmployees()); // ✅ fetchEmployees kullan
    dispatch(fetchAnnouncements());
  }, [dispatch]);

  // Error handling - employees için
  useEffect(() => {
    if (eventsError) {
      toast({
        title: "Hata",
        description: eventsError,
        variant: "destructive"
      });
      dispatch(clearEventsError());
    }
  }, [eventsError, toast, dispatch]);

  useEffect(() => {
    if (employeesError) { // ✅ employeesError
      toast({
        title: "Hata", 
        description: employeesError,
        variant: "destructive"
      });
      dispatch(clearEmployeesError()); // ✅ clearEmployeesError
    }
  }, [employeesError, toast, dispatch]);

  useEffect(() => {
    if (announcementsError) {
      toast({
        title: "Hata",
        description: announcementsError,
        variant: "destructive"
      });
      dispatch(clearAnnouncementsError());
    }
  }, [announcementsError, toast, dispatch]);

  // Bu ay doğum günü olanları filtrele - employees kullan
  const getBirthdaysThisMonth = () => {
    console.log('🎂 Checking birthdays for employees:', employees);
    console.log('🎂 Current month:', currentDate.getMonth()+1, 'Current year:', currentDate.getFullYear());
    
    return employees.filter(employee => {
      // Backend'den "birthday" alanı geliyor
      const birthDate = employee.birthday;
      
      if (!birthDate) {
        console.log(`❌ No birthday for employee ${employee.id}`);
        return false;
      }
      
      const date = new Date(birthDate);
      // ✅ Hem ay hem de yıl kontrolü yap (doğum günü her yıl tekrarlanır)
      const isThisMonth = date.getMonth() === currentDate.getMonth();
      
      if (isThisMonth) {
        console.log(`🎂 Birthday found: ${employee.firstName} ${employee.lastName} - ${birthDate}`);
      }
      
      return isThisMonth;
    }).map(employee => ({
      id: `birthday-${employee.id}`,
      title: `🎂 ${employee.firstName} ${employee.lastName}`,
      // ✅ Doğum gününü bu yıla uyarla
      date: `${currentDate.getFullYear()}-${employee.birthday.substring(5)}`, // YYYY-MM-DD formatında bu yılın doğum günü
      time: "Tüm Gün",
      duration: "Doğum Günü",
      location: "Ofis",
      type: "celebration",
      color: "bg-pink-500",
      attendees: ["Tüm Çalışanlar"]
    }));
  };

  // Bu ay etkinlikleri filtrele - DOĞRU backend alan adlarını kullan
  const getEventsThisMonth = () => {
    console.log('📅 Looking for events in month:', currentDate.getMonth() + 1, 'year:', currentDate.getFullYear());
    console.log('📅 All events:', events);
    
    return events.filter(event => {
      // ✅ Backend'den "createdAt" geliyor (created_at değil!)
      if (!event.createdAt) return false;
      const eventDate = new Date(event.createdAt);
      
      // ✅ Ay numaralarını 1-12 formatında karşılaştır
      const eventMonth = eventDate.getMonth() + 1;
      const currentMonth = currentDate.getMonth() + 1;
      const eventYear = eventDate.getFullYear();
      const currentYear = currentDate.getFullYear();
      
      console.log(`📅 Event: ${event.title}, Event month: ${eventMonth}, Current month: ${currentMonth}`);
      
      return eventMonth === currentMonth && eventYear === currentYear;
    }).map(event => ({
      id: event.id,
      title: event.title,
      date: event.createdAt, // ✅ "createdAt" kullan
      time: event.startTime || "Tüm Gün", // ✅ "startTime" kullan
      duration: event.eventType || "Etkinlik", // ✅ "eventType" kullan
      location: event.location || "Ofis",
      type: event.eventType?.toLowerCase() || "event", // ✅ "eventType" kullan
      color: event.eventType === 'Training' ? 'bg-blue-500' : 
             event.eventType === 'Meeting' ? 'bg-purple-500' : 
             event.eventType === 'Seminar' ? 'bg-green-500' : 
             event.eventType === 'Company' ? 'bg-orange-500' : 'bg-gray-500',
      attendees: [`Max ${event.maxParticipants} kişi`] // ✅ "maxParticipants" kullan
    }));
  };

  // Bu ay duyuruları filtrele - currentDate'e göre dinamik
  const getAnnouncementsThisMonth = () => {
    return announcements.filter(announcement => {
      if (!announcement.createdAt) return false;
      const announcementDate = new Date(announcement.createdAt);
      // ✅ currentDate state'indeki ay ve yıla göre filtrele
      return announcementDate.getMonth() === currentDate.getMonth() && announcementDate.getFullYear() === currentDate.getFullYear();
    }).map(announcement => ({
      id: `announcement-${announcement.id}`,
      title: `📢 ${announcement.title}`,
      date: announcement.createdAt, 
      time: "Tüm Gün",
      duration: "Duyuru",
      location: "Genel",
      type: "announcement",
      color: "bg-orange-500",
      attendees: ["Tüm Çalışanlar"]
    }));
  };

  // ✅ currentDate değiştiğinde filtreleme fonksiyonları otomatik güncellenir
  const allEvents = [
    ...getBirthdaysThisMonth(),
    ...getEventsThisMonth(),
    ...getAnnouncementsThisMonth()
  ];

  // Loading durumu - employees loading'i dahil et
  const isLoading = eventsLoading || employeesLoading || announcementsLoading;

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
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    
    return allEvents.filter(event => {
      if (!event.date) return false;
      const eventDate = new Date(event.date);
      const eventDateStr = `${eventDate.getFullYear()}-${(eventDate.getMonth() + 1).toString().padStart(2, '0')}-${eventDate.getDate().toString().padStart(2, '0')}`;
      return eventDateStr === dateStr;
    });
  };

  const days = getDaysInMonth(currentDate);
  const monthNames = [
    "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
    "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
  ];
  const dayNames = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-7xl mx-auto">
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <div className="text-gray-600">Takvim verileri yükleniyor...</div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

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
                        onClick={() => {
                          const newDate = new Date(currentDate);
                          newDate.setMonth(currentDate.getMonth() - 1);
                          setCurrentDate(newDate);
                        }}
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
                        onClick={() => {
                          const newDate = new Date(currentDate);
                          newDate.setMonth(currentDate.getMonth() + 1);
                          setCurrentDate(newDate);
                        }}
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
                    {allEvents.slice(0, 4).map((event) => (
                      <div key={event.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                        <div className={`w-3 h-3 rounded-full ${event.color} mt-2`}></div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-800 text-sm">{event.title}</h4>
                          <div className="space-y-1 mt-1">
                            <div className="flex items-center text-xs text-gray-600">
                              <CalendarIcon className="h-3 w-3 mr-1" />
                              <span>{new Date(event.date).toLocaleDateString('tr-TR')}</span>
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
                      <span className="font-bold text-gray-800">{allEvents.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Toplantılar</span>
                      <span className="font-bold text-gray-800">{allEvents.filter(e => e.type === 'meeting').length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Etkinlikler</span>
                      <span className="font-bold text-gray-800">{allEvents.filter(e => e.type === 'event').length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Kutlamalar</span>
                      <span className="font-bold text-gray-800">{allEvents.filter(e => e.type === 'celebration').length}</span>
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
