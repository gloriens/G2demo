
import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { Bell, Plus, Eye, MessageCircle, Clock } from "lucide-react";

const News = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  
  const news = [
    {
      id: 1,
      title: "Yeni Çalışan Oryantasyon Programı Başlıyor",
      content: "15 Ocak 2024 tarihinde başlayacak olan yeni çalışan oryantasyon programı için kayıtlar açıldı. Program kapsamında şirket kültürü, iş süreçleri ve departman tanıtımları yer alacak.",
      author: "İK Departmanı",
      date: "10.01.2024",
      category: "Duyuru",
      views: 145,
      comments: 8,
      featured: true
    },
    {
      id: 2,
      title: "2024 Yılı Şirket Pikniği Duyurusu",
      content: "Bu yılki geleneksel şirket pikniği 25 Haziran 2024 tarihinde Belgrad Ormanı'nda gerçekleştirilecektir. Tüm çalışanlarımız ve aileleri davetlidir.",
      author: "Etkinlik Komitesi",
      date: "08.01.2024",
      category: "Etkinlik",
      views: 89,
      comments: 12,
      featured: false
    },
    {
      id: 3,
      title: "IT Sistemi Bakım Çalışması",
      content: "Bu hafta sonu (13-14 Ocak 2024) IT sistemlerinde rutin bakım çalışması yapılacaktır. Bu süre zarfında bazı sistemlerde geçici kesintiler yaşanabilir.",
      author: "IT Departmanı",
      date: "05.01.2024",
      category: "Teknik",
      views: 67,
      comments: 3,
      featured: false
    },
    {
      id: 4,
      title: "Başarı Hikayesi: Mobil Uygulama Projesi",
      content: "Geliştirme ekibimizin 6 aylık yoğun çalışması sonucunda şirketimizin yeni mobil uygulaması başarıyla tamamlandı ve app store'larda yerini aldı.",
      author: "Proje Yöneticisi",
      date: "03.01.2024",
      category: "Başarı",
      views: 234,
      comments: 15,
      featured: true
    }
  ];

  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'Duyuru': return 'bg-blue-100 text-blue-800';
      case 'Etkinlik': return 'bg-green-100 text-green-800';
      case 'Teknik': return 'bg-orange-100 text-orange-800';
      case 'Başarı': return 'bg-purple-100 text-purple-800';
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
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">Şirket Haberleri</h2>
                  <p className="text-gray-600">Şirket içi haberleri ve duyuruları yönetin</p>
                </div>
                <button 
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors"
                >
                  <Plus className="h-5 w-5" />
                  <span>Yeni Haber</span>
                </button>
              </div>
            </div>

            {/* Add News Form */}
            {showAddForm && (
              <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Yeni Haber Ekle</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Başlık</label>
                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option>Duyuru</option>
                        <option>Etkinlik</option>
                        <option>Teknik</option>
                        <option>Başarı</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Yazar</label>
                      <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">İçerik</label>
                    <textarea rows={5} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"></textarea>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="featured" className="mr-2" />
                    <label htmlFor="featured" className="text-sm text-gray-700">Öne çıkarılsın</label>
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
                    Haber Yayınla
                  </button>
                </div>
              </div>
            )}

            {/* News Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Bell className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{news.length}</p>
                    <p className="text-gray-600 text-sm">Toplam Haber</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-green-100 rounded-full">
                    <Eye className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{news.reduce((sum, item) => sum + item.views, 0)}</p>
                    <p className="text-gray-600 text-sm">Toplam Görüntüleme</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <MessageCircle className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{news.reduce((sum, item) => sum + item.comments, 0)}</p>
                    <p className="text-gray-600 text-sm">Toplam Yorum</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-orange-100 rounded-full">
                    <Clock className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">5</p>
                    <p className="text-gray-600 text-sm">Bu Hafta</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Featured News */}
            {news.filter(item => item.featured).length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Öne Çıkan Haberler</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {news.filter(item => item.featured).map((item) => (
                    <div key={item.id} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
                            {item.category}
                          </span>
                          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">
                            Öne Çıkan
                          </span>
                        </div>
                        
                        <h3 className="text-xl font-bold text-gray-800 mb-3">{item.title}</h3>
                        <p className="text-gray-600 mb-4 line-clamp-3">{item.content}</p>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center space-x-4">
                            <span>{item.author}</span>
                            <span>{item.date}</span>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                              <Eye className="h-4 w-4 mr-1" />
                              <span>{item.views}</span>
                            </div>
                            <div className="flex items-center">
                              <MessageCircle className="h-4 w-4 mr-1" />
                              <span>{item.comments}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* All News */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Tüm Haberler</h3>
              <div className="space-y-6">
                {news.map((item) => (
                  <div key={item.id} className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
                            {item.category}
                          </span>
                          {item.featured && (
                            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">
                              Öne Çıkan
                            </span>
                          )}
                        </div>
                        
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
                        <p className="text-gray-600 mb-4">{item.content}</p>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center space-x-4">
                            <span className="font-medium">{item.author}</span>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              <span>{item.date}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                              <Eye className="h-4 w-4 mr-1" />
                              <span>{item.views}</span>
                            </div>
                            <div className="flex items-center">
                              <MessageCircle className="h-4 w-4 mr-1" />
                              <span>{item.comments}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="ml-4 flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800 font-medium">Düzenle</button>
                        <button className="text-red-600 hover:text-red-800 font-medium">Sil</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default News;
