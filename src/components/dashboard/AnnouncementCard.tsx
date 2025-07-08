import { useState, useEffect } from "react";
import { Bell, Clock, AlertCircle } from "lucide-react";

const AnnouncementCard = () => {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ LocalStorage'dan duyuruları yükle
  useEffect(() => {
    const loadAnnouncements = () => {
      try {
        setLoading(true);
        const storedAnnouncements = localStorage.getItem('company_announcements');
        
        if (storedAnnouncements) {
          const parsed = JSON.parse(storedAnnouncements);
          console.log('📋 Dashboard: Loaded announcements from localStorage:', parsed.length);
          
          // ✅ Sadece geçerli duyuruları göster (tarihi geçmemiş)
          const today = new Date().toISOString().slice(0, 10);
          const validAnnouncements = parsed.filter((announcement: any) => 
            announcement.validTo >= today
          );
          
          // ✅ En son eklenen 5 duyuru (dashboard için limit)
          const recentAnnouncements = validAnnouncements
            .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5);
          
          setAnnouncements(recentAnnouncements);
        } else {
          console.log('📋 Dashboard: No announcements found in localStorage');
          setAnnouncements([]);
        }
      } catch (error) {
        console.error('❌ Dashboard: Error loading announcements:', error);
        setAnnouncements([]);
      } finally {
        setLoading(false);
      }
    };

    loadAnnouncements();

    // ✅ LocalStorage değişikliklerini dinle (başka tab'da ekleme/silme olursa)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'company_announcements') {
        console.log('📋 Dashboard: Storage changed, reloading announcements');
        loadAnnouncements();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // ✅ Tarih farkını hesapla (kaç gün/saat önce)
  const getTimeAgo = (dateStr: string) => {
    const now = new Date();
    const date = new Date(dateStr);
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) {
      return `${diffInDays} gün önce`;
    } else if (diffInHours > 0) {
      return `${diffInHours} saat önce`;
    } else {
      return 'Az önce';
    }
  };

  // ✅ Öncelik belirleme (geçerlilik tarihine göre)
  const getPriority = (announcement: any) => {
    const today = new Date();
    const validTo = new Date(announcement.validTo);
    const diffInDays = Math.ceil((validTo.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays <= 1) return 'high'; // 1 gün kala
    if (diffInDays <= 3) return 'medium'; // 3 gün kala
    return 'low'; // Normal
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      default: return 'border-l-blue-500 bg-blue-50';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch(priority) {
      case 'high': return <AlertCircle className="h-3 w-3 text-red-500" />;
      case 'medium': return <AlertCircle className="h-3 w-3 text-yellow-500" />;
      default: return <Clock className="h-3 w-3 text-blue-500" />;
    }
  };

  // ✅ Loading durumu
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center space-x-2 mb-4">
          <Bell className="h-6 w-6 text-blue-500" />
          <h3 className="text-xl font-bold text-gray-800">Son Duyurular</h3>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 rounded-lg bg-gray-100 animate-pulse">
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-3 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-2 bg-gray-300 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Bell className="h-6 w-6 text-blue-500" />
          <h3 className="text-xl font-bold text-gray-800">Son Duyurular</h3>
        </div>
        <span className="text-sm text-gray-500">
          {announcements.length} aktif duyuru
        </span>
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
        {announcements.length === 0 ? (
          // ✅ Boş durum
          <div className="text-center py-8">
            <Bell className="h-12 w-12 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm">Henüz aktif duyuru bulunmuyor</p>
            <p className="text-gray-400 text-xs mt-1">
              Duyurular sayfasından yeni duyuru ekleyebilirsiniz
            </p>
          </div>
        ) : (
          announcements.map((announcement, index) => {
            const priority = getPriority(announcement);
            const timeAgo = getTimeAgo(announcement.createdAt);
            
            return (
              <div 
                key={announcement.id || index} 
                className={`p-4 rounded-lg border-l-4 ${getPriorityColor(priority)} hover:shadow-md transition-shadow cursor-pointer`}
                title={`Geçerlilik: ${announcement.validFrom} - ${announcement.validTo}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-800 text-sm leading-tight">
                    {announcement.title}
                  </h4>
                  {getPriorityIcon(priority)}
                </div>
                
                <p className="text-gray-600 text-xs mb-3 line-clamp-2">
                  {announcement.content}
                </p>
                
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center text-gray-500">
                    <Clock className="h-3 w-3 mr-1" />
                    {timeAgo}
                  </div>
                  
                  <div className="text-gray-400">
                    Son gün: {new Date(announcement.validTo).toLocaleDateString('tr-TR', {
                      day: '2-digit',
                      month: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ✅ Daha fazla duyuru varsa link */}
      {announcements.length >= 5 && (
        <div className="mt-4 pt-3 border-t border-gray-100">
          <button 
            onClick={() => window.location.href = '/announcements'}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium w-full text-center"
          >
            Tüm duyuruları görüntüle →
          </button>
        </div>
      )}

      {/* ✅ Debug info (geliştirme için) */}
      <div className="mt-2 text-xs text-gray-400 border-t pt-2">
        Toplam: {announcements.length} | 
        Son güncelleme: {new Date().toLocaleTimeString('tr-TR')}
      </div>
    </div>
  );
};

export default AnnouncementCard;
