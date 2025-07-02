import { Newspaper, Clock, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const CompanyNewsCard = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-play özelliği ekleyelim
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % companyNews.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const companyNews = [
    {
      id: 1,
      title: "Yeni Ofis Açılışı",
      content: "İstanbul Maslak'ta yeni şubemiz 1 Şubat'ta hizmete girecek. Modern teknoloji altyapısı ile donatılmış yeni ofisimiz 500 kişilik kapasiteye sahip.",
      date: "1 saat önce",
      category: "Şirket Haberleri",
      readTime: "2 dk",
      author: "İK Departmanı",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=500&fit=crop"
    },
    {
      id: 2,
      title: "Q4 Sonuçları Açıklandı",
      content: "2023 yılı son çeyrek finansal sonuçlarımız başarılı geçti. Hedeflenen büyüme oranını %15 üzerinde gerçekleştirdik.",
      date: "3 saat önce",
      category: "Finansal",
      readTime: "3 dk",
      author: "Finans Departmanı",
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=500&fit=crop"
    },
    {
      id: 3,
      title: "Yeni İK Politikaları",
      content: "Çalışan hakları ve sosyal imkanlar genişletildi. Esnek çalışma saatleri ve uzaktan çalışma seçenekleri artırıldı.",
      date: "1 gün önce",
      category: "İK",
      readTime: "4 dk",
      author: "İnsan Kaynakları",
      image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=500&fit=crop"
    }
  ];

  const getCategoryColor = (category: string) => {
    const colors = {
      'Şirket Haberleri': 'from-blue-500 to-blue-600',
      'Finansal': 'from-emerald-500 to-emerald-600',
      'İK': 'from-purple-500 to-purple-600',
      'Teknoloji': 'from-orange-500 to-orange-600',
      'Sürdürülebilirlik': 'from-teal-500 to-teal-600'
    };
    return colors[category] || 'from-gray-500 to-gray-600';
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % companyNews.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + companyNews.length) % companyNews.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const handleNewsClick = (newsId: number) => {
    navigate(`/news/${newsId}`);
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
            <Newspaper className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Şirket İçi Haberler
            </h3>
            <p className="text-sm text-gray-500">En son gelişmeler</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Canlı</span>
        </div>
      </div>

      {/* Premium Slider Container */}
      <div className="relative group">
        {/* Ana Slider */}
        <div className="relative h-96 overflow-hidden rounded-2xl shadow-xl">
          {companyNews.map((news, index) => (
            <div
              key={news.id}
              className={`absolute inset-0 transition-all duration-700 ease-out ${
                index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
              }`}
            >
              {/* Haber Kartı */}
              <div 
                className="relative h-full rounded-2xl overflow-hidden cursor-pointer"
                onClick={() => handleNewsClick(news.id)}
              >
                {/* Kapak Fotoğrafı */}
                <img 
                  src={news.image} 
                  alt={news.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                
                {/* Gelişmiş Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
                
                {/* İçerik */}
                <div className="absolute inset-0 flex flex-col justify-between p-8">
                  {/* Üst Kısım - Kategori */}
                  <div className="flex justify-between items-start">
                    <div className={`px-4 py-2 bg-gradient-to-r ${getCategoryColor(news.category)} rounded-full backdrop-blur-sm`}>
                      <span className="text-white text-sm font-semibold">{news.category}</span>
                    </div>
                    
                    <div className="bg-black/30 backdrop-blur-sm rounded-full p-2">
                      <ExternalLink className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  
                  {/* Alt Kısım - İçerik */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-3xl font-bold text-white mb-3 leading-tight">
                        {news.title}
                      </h4>
                      
                      <p className="text-gray-200 text-base leading-relaxed line-clamp-2">
                        {news.content}
                      </p>
                    </div>
                    
                    {/* Meta Bilgiler */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-300">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{news.date}</span>
                        </div>
                        <span>•</span>
                        <span>{news.readTime} okuma</span>
                        <span>•</span>
                        <span>{news.author}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-blue-600/0 hover:bg-blue-600/10 transition-all duration-500" />
              </div>
            </div>
          ))}
        </div>

        {/* Modern Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white rounded-full shadow-2xl transition-all duration-300 hover:scale-110 opacity-0 group-hover:opacity-100 flex items-center justify-center"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        
        <button
          onClick={nextSlide}
          className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white rounded-full shadow-2xl transition-all duration-300 hover:scale-110 opacity-0 group-hover:opacity-100 flex items-center justify-center"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Gelişmiş Progress Bar */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
          {companyNews.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className="relative group/dot"
            >
              <div className={`w-12 h-1 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-white shadow-lg' 
                  : 'bg-white/40 hover:bg-white/60'
              }`} />
              
              {/* Progress Animation */}
              {index === currentSlide && (
                <div className="absolute top-0 left-0 h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-pulse"
                     style={{ width: '100%' }} />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Premium Alt Buton */}
      <button
        onClick={() => navigate("/news")}
        className="w-full mt-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] flex items-center justify-center space-x-2"
      >
        <span>Tüm Haberleri Keşfet</span>
        <ExternalLink className="h-4 w-4" />
      </button>
    </div>
  );
};

export default CompanyNewsCard;