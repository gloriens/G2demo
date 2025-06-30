
import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { PartyPopper, Plus, Calendar, MapPin, Clock, Users } from "lucide-react";

const Events = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  
  const events = [
    {
      id: 1,
      title: "Şirket Pikniği",
      description: "Yıllık şirket pikniği etkinliği",
      date: "25.06.2024",
      time: "10:00 - 18:00",
      location: "Belgrad Ormanı",
      attendees: 85,
      status: "Yaklaşan",
      category: "Sosyal"
    },
    {
      id: 2,
      title: "Teknoloji Semineri",
      description: "Yapay Zeka ve Gelecek konulu seminer",
      date: "15.02.2024",
      time: "14:00 - 16:00",
      location: "Konferans Salonu",
      attendees: 45,
      status: "Aktif",
      category: "Eğitim"
    },
    {
      id: 3,
      title: "Yeni Yıl Partisi",
      description: "2024 Yeni Yıl kutlama etkinliği",
      date: "31.12.2023",
      time: "19:00 - 24:00",
      location: "Otel Ballroom",
      attendees: 120,
      status: "Tamamlandı",
      category: "Kutlama"
    },
    {
      id: 4,
      title: "Ekip Toplantısı",
      description: "Aylık genel değerlendirme toplantısı",
      date: "30.01.2024",
      time: "09:00 - 11:00",
      location: "Toplantı Odası A",
      attendees: 25,
      status: "Yaklaşan",
      category: "Toplantı"
    }
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Aktif': return 'bg-green-100 text-green-800 border-green-200';
      case 'Yaklaşan': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Tamamlandı': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'Sosyal': return 'bg-pink-100 text-pink-800';
      case 'Eğitim': return 'bg-purple-100 text-purple-800';
      case 'Kutlama': return 'bg-yellow-100 text-yellow-800';
      case 'Toplantı': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">Etkinlikler</h2>
                  <p className="text-gray-600">Şirket etkinliklerini yönetin ve takip edin</p>
                </div>
                <button 
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors"
                >
                  <Plus className="h-5 w-5" />
                  <span>Yeni Etkinlik</span>
                </button>
              </div>
            </div>

            {/* Add Event Form */}
            {showAddForm && (
              <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Yeni Etkinlik Ekle</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Etkinlik Adı</label>
                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>Sosyal</option>
                      <option>Eğitim</option>
                      <option>Kutlama</option>
                      <option>Toplantı</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tarih</label>
                    <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Saat</label>
                    <input type="time" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Konum</label>
                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Kapasite</label>
                    <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
                    <textarea rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"></textarea>
                  </div>
                </div>
                <div className="flex justify-end space-x-4 mt-4">
                  <button 
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    İptal
                  </button>
                  <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                    Etkinlik Ekle
                  </button>
                </div>
              </div>
            )}

            {/* Event Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <PartyPopper className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{events.length}</p>
                    <p className="text-gray-600 text-sm">Toplam Etkinlik</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-green-100 rounded-full">
                    <Calendar className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{events.filter(e => e.status === 'Aktif').length}</p>
                    <p className="text-gray-600 text-sm">Aktif Etkinlik</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-orange-100 rounded-full">
                    <Clock className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{events.filter(e => e.status === 'Yaklaşan').length}</p>
                    <p className="text-gray-600 text-sm">Yaklaşan</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">275</p>
                    <p className="text-gray-600 text-sm">Toplam Katılım</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <div key={event.id} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(event.category)}`}>
                        {event.category}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(event.status)}`}>
                        {event.status}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{event.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{event.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="h-4 w-4 mr-2" />
                        <span>{event.attendees} katılımcı</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                    <div className="flex justify-between">
                      <button className="text-blue-600 hover:text-blue-800 font-medium">Detaylar</button>
                      <div className="space-x-2">
                        <button className="text-gray-600 hover:text-gray-800">Düzenle</button>
                        <button className="text-red-600 hover:text-red-800">Sil</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Events;
