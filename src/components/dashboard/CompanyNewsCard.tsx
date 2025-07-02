import { Newspaper, Clock } from "lucide-react";
import {useNavigate} from "react-router-dom";

const CompanyNewsCard = () => {
  const companyNews = [
    {
      title: "Yeni Ofis Açılışı",
      content: "İstanbul Maslak'ta yeni şubemiz 1 Şubat'ta hizmete girecek.",
      date: "1 saat önce",
      category: "Şirket Haberleri"
    },
    {
      title: "Q4 Sonuçları Açıklandı",
      content: "2023 yılı son çeyrek finansal sonuçlarımız başarılı geçti.",
      date: "3 saat önce",
      category: "Finansal"
    },
    {
      title: "Yeni İK Politikaları",
      content: "Çalışan hakları ve sosyal imkanlar genişletildi.",
      date: "1 gün önce",
      category: "İK"
    },
    {
      title: "Teknoloji Yatırımları",
      content: "Yapay zeka ve otomasyon projelerimiz başladı.",
      date: "2 gün önce",
      category: "Teknoloji"
    },
    {
      title: "Yeni Ofis Açılışı",
      content: "İstanbul Maslak'ta yeni şubemiz 1 Şubat'ta hizmete girecek.",
      date: "1 saat önce",
      category: "Şirket Haberleri"
    },
    {
      title: "Q4 Sonuçları Açıklandı",
      content: "2023 yılı son çeyrek finansal sonuçlarımız başarılı geçti.",
      date: "3 saat önce",
      category: "Finansal"
    },
    {
      title: "Yeni İK Politikaları",
      content: "Çalışan hakları ve sosyal imkanlar genişletildi.",
      date: "1 gün önce",
      category: "İK"
    },
    {
      title: "Teknoloji Yatırımları",
      content: "Yapay zeka ve otomasyon projelerimiz başladı.",
      date: "2 gün önce",
      category: "Teknoloji"
    }
  ];

  const navigate = useNavigate();

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Şirket Haberleri': return 'bg-blue-100 text-blue-800';
      case 'Finansal': return 'bg-green-100 text-green-800';
      case 'İK': return 'bg-purple-100 text-purple-800';
      case 'Teknoloji': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center space-x-2 mb-4">
          <Newspaper className="h-6 w-6 text-green-500" />
          <h3 className="text-xl font-bold text-gray-800">Şirket İçi Haberler</h3>
        </div>

        {/* Yana kaydırmalı container */}
        <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-thin">
          {companyNews.map((news, index) => (
              <div
                  key={index}
                  className="w-[250px] h-[250px] flex-shrink-0 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-800 text-sm">{news.title}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(news.category)}`}>
                  {news.category}
                </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-4">{news.content}</p>
                </div>
                <div className="flex items-center text-xs text-gray-500 mt-auto">
                  <Clock className="h-3 w-3 mr-1" />
                  {news.date}
                </div>
              </div>
          ))}
        </div>

        <button
            onClick={() => navigate("/news")}
            className="w-full mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          Tüm Haberleri Görüntüle
        </button>

      </div>
  );
};

export default CompanyNewsCard;
