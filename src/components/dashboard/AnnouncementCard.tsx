
import { Bell, Clock } from "lucide-react";

const AnnouncementCard = () => {
  const announcements = [
    {
      title: "Yeni Çalışan Oryantasyon Programı",
      content: "15 Ocak'ta başlayacak olan yeni çalışan oryantasyon programı için kayıtlar başladı.",
      date: "2 saat önce",
      priority: "high"
    },
    {
      title: "Şirket Pikniği Duyurusu",
      content: "Bu yılki şirket pikniği 25 Haziran'da Belgrad Ormanı'nda yapılacaktır.",
      date: "1 gün önce",
      priority: "medium"
    },
    {
      title: "IT Sistemi Bakım Çalışması",
      content: "Bu hafta sonu IT sistemlerinde bakım çalışması yapılacaktır.",
      date: "3 gün önce",
      priority: "low"
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      default: return 'border-l-blue-500 bg-blue-50';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center space-x-2 mb-4">
        <Bell className="h-6 w-6 text-blue-500" />
        <h3 className="text-xl font-bold text-gray-800">Son Duyurular</h3>
      </div>
      
      <div className="space-y-4">
        {announcements.map((announcement, index) => (
          <div key={index} className={`p-4 rounded-lg border-l-4 ${getPriorityColor(announcement.priority)} hover:shadow-md transition-shadow`}>
            <h4 className="font-semibold text-gray-800 mb-2">{announcement.title}</h4>
            <p className="text-gray-600 text-sm mb-2">{announcement.content}</p>
            <div className="flex items-center text-xs text-gray-500">
              <Clock className="h-3 w-3 mr-1" />
              {announcement.date}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnnouncementCard;
