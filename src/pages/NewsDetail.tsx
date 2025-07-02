
import { useParams, Link } from "react-router-dom";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { ArrowLeft, Clock, User, Eye } from "lucide-react";

const NewsDetail = () => {
  const { id } = useParams();

  // Mock data - gerçek uygulamada API'den gelecek
  const newsItem = {
    id: parseInt(id || "1"),
    title: "Yeni Çalışan Oryantasyon Programı Başlıyor",
    content: `15 Ocak 2024 tarihinde başlayacak olan yeni çalışan oryantasyon programı için kayıtlar açıldı. 

Program kapsamında şirket kültürü, iş süreçleri ve departman tanıtımları yer alacak. Yeni çalışanlarımızın şirkete uyum sürecini hızlandırmak ve etkin bir başlangıç yapmalarını sağlamak amacıyla hazırlanan bu program toplam 3 gün sürecek.

Program içeriği:
- 1. Gün: Şirket kültürü ve değerleri
- 2. Gün: İş süreçleri ve sistemler eğitimi  
- 3. Gün: Departman tanıtımları ve mentorluk ataması

Programa katılım zorunludur ve katılımcılara sertifika verilecektir.`,
    author: "İK Departmanı",
    date: "10.01.2024",
    category: "Duyuru",
    views: 145,
    featured: true,
    coverImage: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=800&h=400&fit=crop" // Kapak fotoğrafı
  };

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
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <Link 
              to="/news"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Haberlere Geri Dön
            </Link>

            {/* News Content */}
            <article className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              {/* Cover Image */}
              {newsItem.coverImage && (
                <div className="w-full h-64 md:h-80 overflow-hidden">
                  <img 
                    src={newsItem.coverImage} 
                    alt={newsItem.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="p-8">
                {/* Header */}
                <div className="flex items-center space-x-3 mb-6">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(newsItem.category)}`}>
                    {newsItem.category}
                  </span>
                  {newsItem.featured && (
                    <span className="bg-yellow-100 text-yellow-800 text-sm px-3 py-1 rounded-full font-medium">
                      Öne Çıkan
                    </span>
                  )}
                </div>

                {/* Title */}
                <h1 className="text-3xl font-bold text-gray-800 mb-6">{newsItem.title}</h1>

                {/* Meta Info */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-8 pb-6 border-b border-gray-200">
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      <span className="font-medium">{newsItem.author}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>{newsItem.date}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Eye className="w-4 h-4 mr-1" />
                    <span>{newsItem.views}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="prose max-w-none">
                  {newsItem.content.split('\n').map((paragraph, index) => (
                    <p key={index} className="text-gray-700 leading-relaxed mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </article>
          </div>
        </main>
      </div>
    </div>
  );
};

export default NewsDetail;