import { useParams, Link } from "react-router-dom";
import { useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { ArrowLeft, Clock, User, Eye } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchNews, clearError, base64ToImageUrl } from "@/store/slices/newsSlice";
import { useToast } from "@/hooks/use-toast";

const NewsDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const dispatch = useAppDispatch();

  const { news, loading, error } = useAppSelector((state) => state.news);

  useEffect(() => {
    // Eğer news listesi boşsa, önce haberleri çek
    if (news.length === 0) {
      dispatch(fetchNews());
    }
  }, [dispatch, news.length]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Hata",
        description: error,
        variant: "destructive"
      });
      dispatch(clearError());
    }
  }, [error, toast, dispatch]);

  // ID'ye göre haberi bul
  const newsItem = news.find(item => item.id === parseInt(id || "0"));

  // Tarih formatlama
  const formatTurkishDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <div className="text-gray-600">Haber yükleniyor...</div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!newsItem) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto">
              <Link 
                to="/news"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 font-medium"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Haberlere Geri Dön
              </Link>
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <div className="text-gray-600">Haber bulunamadı.</div>
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
              {(newsItem.image || newsItem.coverImage) && (
                <div className="w-full h-64 md:h-80 overflow-hidden">
                  <img 
                    src={newsItem.image ? newsItem.image : base64ToImageUrl(newsItem.coverImage)} 
                    alt={newsItem.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="p-8">
                {/* Header */}
                <div className="flex items-center space-x-3 mb-6">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(newsItem.category || newsItem.newsType)}`}>
                    {newsItem.category || newsItem.newsType}
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
                      <span className="font-medium">{newsItem.author || newsItem.createdBy || 'Bilinmeyen Yazar'}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>{formatTurkishDate(newsItem.created_at || newsItem.date)}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Eye className="w-4 h-4 mr-1" />
                    <span>{newsItem.views || 0}</span>
                  </div>
                </div>

                {/* Duration */}
                {newsItem.duration && (
                  <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center text-blue-800">
                      <Clock className="w-4 h-4 mr-2" />
                      <span className="font-medium">Haber Süresi: {newsItem.duration}</span>
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="prose max-w-none">
                  {newsItem.content.split('\n').map((paragraph, index) => (
                    <p key={index} className="text-gray-700 leading-relaxed mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Additional Info */}
                {(newsItem.updated_at && newsItem.updated_at !== newsItem.created_at) && (
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-500">
                      Son güncelleme: {formatTurkishDate(newsItem.updated_at)}
                    </p>
                  </div>
                )}
              </div>
            </article>
          </div>
        </main>
      </div>
    </div>
  );
};

export default NewsDetail;