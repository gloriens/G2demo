import { useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { Bell, Plus, Clock } from "lucide-react";

const News = () => {
  const [showAddForm, setShowAddForm] = useState(false);

  const news = [
    {
      id: 1,
      title: "Yeni Çalışan Oryantasyon Programı Başlıyor",
      content:
        "15 Ocak 2024 tarihinde başlayacak olan yeni çalışan oryantasyon programı için kayıtlar açıldı. Program kapsamında şirket kültürü, iş süreçleri ve departman tanıtımları yer alacak.",
      author: "İK Departmanı",
      date: "10.01.2024",
      category: "Duyuru",
      duration: "1 hafta",
      image:
        "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=800&h=400&fit=crop",
    },
    {
      id: 2,
      title: "2024 Yılı Şirket Pikniği Duyurusu",
      content:
        "Bu yılki geleneksel şirket pikniği 25 Haziran 2024 tarihinde Belgrad Ormanı'nda gerçekleştirilecektir. Tüm çalışanlarımız ve aileleri davetlidir.",
      author: "Etkinlik Komitesi",
      date: "08.01.2024",
      category: "Etkinlik",
      duration: "2 hafta",
      image:
        "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&h=400&fit=crop",
    },
    {
      id: 3,
      title: "IT Sistemi Bakım Çalışması",
      content:
        "Bu hafta sonu (13-14 Ocak 2024) IT sistemlerinde rutin bakım çalışması yapılacaktır. Bu süre zarfında bazı sistemlerde geçici kesintiler yaşanabilir.",
      author: "IT Departmanı",
      date: "05.01.2024",
      category: "Teknik",
      duration: "3 gün",
      image:
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop",
    },
    {
      id: 4,
      title: "Başarı Hikayesi: Mobil Uygulama Projesi",
      content:
        "Geliştirme ekibimizin 6 aylık yoğun çalışması sonucunda şirketimizin yeni mobil uygulaması başarıyla tamamlandı ve app store'larda yerini aldı.",
      author: "Proje Yöneticisi",
      date: "03.01.2024",
      category: "Başarı",
      duration: "1 ay",
      image:
        "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=400&fit=crop",
    },
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Duyuru":
        return "bg-blue-100 text-blue-800";
      case "Etkinlik":
        return "bg-green-100 text-green-800";
      case "Teknik":
        return "bg-orange-100 text-orange-800";
      case "Başarı":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    Şirket Haberleri
                  </h2>
                  <p className="text-gray-600">Şirket içi haberleri ve duyuruları yönetin</p>
                </div>
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors"
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Başlık
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Kategori
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option>Duyuru</option>
                        <option>Etkinlik</option>
                        <option>Teknik</option>
                        <option>Başarı</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Yazar
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Haberin Kalma Süresi
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option>3 gün</option>
                      <option>1 hafta</option>
                      <option>2 hafta</option>
                      <option>1 ay</option>
                      <option>3 ay</option>
                      <option>Süresiz</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kapak Resmi
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      PNG, JPG veya JPEG formatında resim yükleyebilirsiniz.
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      İçerik
                    </label>
                    <textarea
                      rows={5}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    ></textarea>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Bell className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-extrabold text-gray-900">24</p>
                    <p className="text-gray-600">Aktif Haber</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-green-100 rounded-full">
                    <Clock className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-extrabold text-gray-900">5</p>
                    <p className="text-gray-600">Yakında Süresi Dolacak</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-orange-100 rounded-full">
                    <Bell className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-extrabold text-gray-900">3</p>
                    <p className="text-gray-600">Süresi Dolmuş</p>
                  </div>
                </div>
              </div>
            </div>

            {/* All News */}
            <div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 mb-4 border-b-4 border-blue-600 inline-block pb-2">
                Tüm Haberler
              </h3>
              <div className="space-y-6">
                {news.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row">
                      {/* Image */}
                      <div className="w-full sm:w-24 md:w-48 h-32 flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-4 sm:p-6">
                        <div
                          className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-2 ${getCategoryColor(
                            item.category
                          )}`}
                        >
                          {item.category}
                        </div>
                        <h4 className="text-lg font-bold text-gray-800 mb-1">
                          {item.title}
                        </h4>
                        <p className="text-gray-600 mb-3 line-clamp-3">
                          {item.content}
                        </p>
                        <div className="flex flex-wrap items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center space-x-2">
                            <span>{item.author}</span>
                            <span>·</span>
                            <span>{item.date}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{item.duration}</span>
                          </div>
                        </div>
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
