import { useState, useEffect } from "react";
import { Clock, Plus, X, Pencil, Trash2, Calendar, Megaphone } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

// ✅ Default duyurular - sadece localStorage boşsa kullanılacak
const defaultAnnouncements = [
  {
    id: 1,
    title: "Yeni Çalışan Oryantasyon Programı",
    content: "15 Ocak'ta başlayacak olan yeni çalışan oryantasyon programı için kayıtlar başladı.",
    validFrom: "2025-07-04",
    validTo: "2025-07-10",
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Şirket Pikniği Duyurusu",
    content: "Bu yılki şirket pikniği 25 Haziran'da Belgrad Ormanı'nda yapılacaktır.",
    validFrom: "2025-06-20",
    validTo: "2025-06-25",
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    title: "IT Sistemi Bakım Çalışması",
    content: "Bu hafta sonu IT sistemlerinde bakım çalışması yapılacaktır.",
    validFrom: "2025-06-28",
    validTo: "2025-06-30",
    createdAt: new Date().toISOString(),
  },
];

// ✅ LocalStorage helper functions
const STORAGE_KEY = 'company_announcements';

const loadAnnouncementsFromStorage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      console.log('📋 Loaded announcements from localStorage:', parsed.length);
      return parsed;
    }
  } catch (error) {
    console.error('❌ Error loading announcements from localStorage:', error);
  }
  
  // ✅ İlk kez açılıyorsa default verileri kaydet
  console.log('📋 Using default announcements');
  saveAnnouncementsToStorage(defaultAnnouncements);
  return defaultAnnouncements;
};

const saveAnnouncementsToStorage = (announcements: any[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(announcements));
    console.log('💾 Saved announcements to localStorage:', announcements.length);
  } catch (error) {
    console.error('❌ Error saving announcements to localStorage:', error);
  }
};

// ✅ ID generator
const generateId = () => {
  return Date.now() + Math.random();
};

const Announcements = () => {
  // ✅ State'i localStorage'dan başlat
  const [announcements, setAnnouncements] = useState(() => loadAnnouncementsFromStorage());
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({
    title: "",
    content: "",
    validFrom: new Date().toISOString().slice(0, 10),
    validTo: new Date().toISOString().slice(0, 10),
  });

  const { toast } = useToast();

  // ✅ Announcements değiştiğinde localStorage'a kaydet
  useEffect(() => {
    saveAnnouncementsToStorage(announcements);
  }, [announcements]);

  // ✅ Component mount olduğunda localStorage'dan yükle
  useEffect(() => {
    const storedAnnouncements = loadAnnouncementsFromStorage();
    setAnnouncements(storedAnnouncements);
  }, []);

  // ✅ Tarih formatlayıcı fonksiyon
  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split("-");
    return `${day}.${month}.${year}`;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title.trim() || !form.content.trim()) {
      toast({
        title: "Hata",
        description: "Başlık ve içerik alanları zorunludur.",
        variant: "destructive",
        duration: 5000,
      });
      return;
    }

    if (form.validTo < form.validFrom) {
      toast({
        title: "Hata",
        description: "Geçerlilik tarihi, başlangıç tarihinden küçük olamaz.",
        variant: "destructive",
        duration: 5000,
      });
      return;
    }

    const announcementData = {
      title: form.title.trim(),
      content: form.content.trim(),
      validFrom: form.validFrom,
      validTo: form.validTo,
      updatedAt: new Date().toISOString(),
    };

    if (editId !== null) {
      // ✅ Güncelleme
      setAnnouncements((prev) =>
        prev.map((item) => 
          item.id === editId 
            ? { ...item, ...announcementData }
            : item
        )
      );
      
      toast({
        title: "Başarılı",
        description: `"${form.title}" duyurusu güncellendi!`,
        variant: "default",
        duration: 5000,
      });
      
      console.log('✅ Announcement updated:', editId);
    } else {
      // ✅ Yeni ekleme
      const newAnnouncement = {
        id: generateId(),
        ...announcementData,
        createdAt: new Date().toISOString(),
      };
      
      setAnnouncements((prev) => [newAnnouncement, ...prev]);
      
      toast({
        title: "Başarılı",
        description: "Duyuru başarıyla eklendi!",
        variant: "default",
        duration: 5000,
      });
      
      console.log('✅ New announcement added:', newAnnouncement);
    }

    // ✅ Form reset
    setForm({
      title: "",
      content: "",
      validFrom: new Date().toISOString().slice(0, 10),
      validTo: new Date().toISOString().slice(0, 10),
    });
    setEditId(null);
    setShowForm(false);
  };

  const handleEdit = (announcement: any) => {
    setForm({
      title: announcement.title,
      content: announcement.content,
      validFrom: announcement.validFrom,
      validTo: announcement.validTo,
    });
    setEditId(announcement.id);
    setShowForm(true);

    toast({
      title: "Düzenleme",
      description: `"${announcement.title}" düzenlenmek üzere açıldı.`,
      variant: "default",
      duration: 4000,
    });
    
    console.log('📝 Editing announcement:', announcement.id);
  };

  const handleDelete = (announcement: any) => {
    const confirmed = window.confirm(`"${announcement.title}" silinsin mi?`);
    
    if (confirmed) {
      setAnnouncements((prev) => prev.filter((item) => item.id !== announcement.id));

      toast({
        title: "Silindi",
        description: `"${announcement.title}" duyurusu silindi.`,
        variant: "destructive",
        duration: 4000,
      });
      
      console.log('🗑️ Announcement deleted:', announcement.id);
    }
  };

  // ✅ Tüm duyuruları sil (Debug için)
  const clearAllAnnouncements = () => {
    const confirmed = window.confirm('Tüm duyuruları silmek istediğinizden emin misiniz?');
    if (confirmed) {
      setAnnouncements([]);
      localStorage.removeItem(STORAGE_KEY);
      toast({
        title: "Temizlendi",
        description: "Tüm duyurular silindi.",
        variant: "destructive",
      });
    }
  };

  // ✅ Default duyuruları geri yükle
  const resetToDefaults = () => {
    const confirmed = window.confirm('Varsayılan duyuruları geri yüklemek istiyor musunuz?');
    if (confirmed) {
      setAnnouncements(defaultAnnouncements);
      toast({
        title: "Geri Yüklendi",
        description: "Varsayılan duyurular geri yüklendi.",
        variant: "default",
      });
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-1 flex items-center">
                  <Megaphone className="w-7 h-7 mr-3 text-blue-600 dark:text-blue-400" />
                  Duyurular
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Son duyurular ve önemli bilgiler ({announcements.length} duyuru)
                </p>
              </div>

              <div className="flex gap-2">
                {/* ✅ Debug butonları - geliştirme için */}
                {/* <Button
                  onClick={resetToDefaults}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  Varsayılanları Yükle
                </Button> */}
                
                <Button
                  onClick={clearAllAnnouncements}
                  variant="outline"
                  size="sm"
                  className="text-xs text-red-600 hover:text-red-700"
                >
                  Tümünü Sil
                </Button>

                <Button
                  onClick={() => {
                    setShowForm(true);
                    setEditId(null);
                    setForm({
                      title: "",
                      content: "",
                      validFrom: new Date().toISOString().slice(0, 10),
                      validTo: new Date().toISOString().slice(0, 10),
                    });
                  }}
                  className="flex items-center bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Yeni Duyuru
                </Button>
              </div>
            </div>

            {/* ✅ Duyuru listesi */}
            <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
              {announcements.length === 0 ? (
                <div className="text-center py-12">
                  <Megaphone className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-500 mb-2">Henüz duyuru yok</h3>
                  <p className="text-gray-400 mb-4">İlk duyurunuzu eklemek için yukarıdaki butonu kullanın.</p>
                  <Button onClick={resetToDefaults} variant="outline">
                    Örnek Duyuruları Yükle
                  </Button>
                </div>
              ) : (
                announcements.map((announcement) => (
                  <div
                    key={announcement.id}
                    className="p-5 rounded-lg border-l-4 border-blue-500 bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow flex justify-between items-start"
                  >
                    <div className="max-w-[80%]">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
                        {announcement.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-2">
                        {announcement.content}
                      </p>
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <Clock className="h-4 w-4 mr-1" />
                        {`Geçerlilik: ${formatDate(announcement.validFrom)} - ${formatDate(
                          announcement.validTo
                        )}`}
                      </div>
                      {/* ✅ Debug info */}
                      <div className="text-xs text-gray-400 mt-1">
                        ID: {announcement.id} | 
                        {announcement.createdAt && ` Oluşturulma: ${new Date(announcement.createdAt).toLocaleString('tr-TR')}`}
                        {announcement.updatedAt && ` | Güncelleme: ${new Date(announcement.updatedAt).toLocaleString('tr-TR')}`}
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2 ml-4 min-w-[90px]">
                      <Button
                        onClick={() => handleEdit(announcement)}
                        className="flex items-center bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded-md"
                      >
                        <Pencil className="w-4 h-4 mr-1" />
                        Düzenle
                      </Button>
                      <Button
                        onClick={() => handleDelete(announcement)}
                        className="flex items-center bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded-md"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Sil
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>

        {/* ✅ Modal Form - değişiklik yok */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-auto p-8 relative">
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditId(null);
                }}
                aria-label="Close"
                className="absolute top-5 right-5 text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition"
              >
                <X className="w-7 h-7" />
              </button>

              <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
                {editId !== null ? "Duyuruyu Düzenle" : "Yeni Duyuru Ekle"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="title"
                    className="block mb-1 font-semibold text-gray-700 dark:text-gray-200"
                  >
                    Başlık <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    required
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Duyuru başlığını girin"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div>
                  <label
                    htmlFor="content"
                    className="block mb-1 font-semibold text-gray-700 dark:text-gray-200"
                  >
                    İçerik <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="content"
                    name="content"
                    required
                    rows={5}
                    value={form.content}
                    onChange={handleChange}
                    placeholder="Duyuru içeriğini girin"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="relative">
                    <label
                      htmlFor="validFrom"
                      className="block mb-1 font-semibold text-gray-700 dark:text-gray-200"
                    >
                      Başlangıç Tarihi
                    </label>
                    <input
                      type="date"
                      id="validFrom"
                      name="validFrom"
                      min={new Date().toISOString().slice(0, 10)}
                      value={form.validFrom}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                    <Calendar className="absolute top-9 right-3 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>

                  <div className="relative">
                    <label
                      htmlFor="validTo"
                      className="block mb-1 font-semibold text-gray-700 dark:text-gray-200"
                    >
                      Geçerlilik Tarihi
                    </label>
                    <input
                      type="date"
                      id="validTo"
                      name="validTo"
                      min={form.validFrom}
                      value={form.validTo}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                    <Calendar className="absolute top-9 right-3 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div className="flex justify-end space-x-5 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditId(null);
                    }}
                    className="px-5 py-3 rounded-lg border border-gray-300 hover:bg-red-100 hover:border-red-600 hover:text-red-600 dark:border-gray-600 dark:hover:bg-red-900 dark:hover:border-red-400 dark:hover:text-red-400 shadow-md transition"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-md transition"
                  >
                    {editId !== null ? "Duyuruyu Güncelle" : "Duyuru Yayınla"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Announcements;
