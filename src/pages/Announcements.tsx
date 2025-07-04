import { useState } from "react";
import { Clock, Plus, X, Pencil, Trash2, Calendar, Megaphone } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const announcementsInitial = [
  {
    title: "Yeni Çalışan Oryantasyon Programı",
    content:
      "15 Ocak'ta başlayacak olan yeni çalışan oryantasyon programı için kayıtlar başladı.",
    date: "Geçerlilik: 2025-07-04 - 2025-07-10",
    validFrom: "2025-07-04",
    validTo: "2025-07-10",
  },
  {
    title: "Şirket Pikniği Duyurusu",
    content:
      "Bu yılki şirket pikniği 25 Haziran'da Belgrad Ormanı'nda yapılacaktır.",
    date: "Geçerlilik: 2025-06-20 - 2025-06-25",
    validFrom: "2025-06-20",
    validTo: "2025-06-25",
  },
  {
    title: "IT Sistemi Bakım Çalışması",
    content: "Bu hafta sonu IT sistemlerinde bakım çalışması yapılacaktır.",
    date: "Geçerlilik: 2025-06-28 - 2025-06-30",
    validFrom: "2025-06-28",
    validTo: "2025-06-30",
  },
];

const Announcements = () => {
  const [announcements, setAnnouncements] = useState(announcementsInitial);
  const [showForm, setShowForm] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [form, setForm] = useState({
    title: "",
    content: "",
    validFrom: new Date().toISOString().slice(0, 10),
    validTo: new Date().toISOString().slice(0, 10),
  });

  const { toast } = useToast();

  // Yeni: tarih formatlayıcı fonksiyon
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
        title: "Başlık ve içerik alanları zorunludur.",
        variant: "destructive",
        duration: 5000,
      });
      return;
    }

    if (form.validTo < form.validFrom) {
      toast({
        title: "Geçerlilik tarihi, başlangıç tarihinden küçük olamaz.",
        variant: "destructive",
        duration: 5000,
      });
      return;
    }

    const updatedAnnouncement = {
      title: form.title,
      content: form.content,
      date: `Geçerlilik: ${form.validFrom} - ${form.validTo}`,
      validFrom: form.validFrom,
      validTo: form.validTo,
    };

    if (editIndex !== null) {
      setAnnouncements((prev) =>
        prev.map((item, i) => (i === editIndex ? updatedAnnouncement : item))
      );
      toast({
        title: `"${form.title}" duyurusu güncellendi!`,
        variant: "default",
        duration: 5000,
      });
    } else {
      setAnnouncements((prev) => [updatedAnnouncement, ...prev]);
      toast({
        title: "Duyuru başarıyla eklendi!",
        variant: "destructive",
        duration: 5000,
      });
    }

    setForm({
      title: "",
      content: "",
      validFrom: new Date().toISOString().slice(0, 10),
      validTo: new Date().toISOString().slice(0, 10),
    });
    setEditIndex(null);
    setShowForm(false);
  };

  const handleEdit = (index: number) => {
    const selected = announcements[index];
    setForm({
      title: selected.title,
      content: selected.content,
      validFrom: selected.validFrom,
      validTo: selected.validTo,
    });
    setEditIndex(index);
    setShowForm(true);

    toast({
      title: `"${selected.title}" düzenlenmek üzere açıldı.`,
      variant: "default",
      duration: 4000,
    });
  };

  const handleDelete = (index: number) => {
    if (confirm(`"${announcements[index].title}" silinsin mi?`)) {
      const deletedTitle = announcements[index].title;
      setAnnouncements((prev) => prev.filter((_, i) => i !== index));

      toast({
        title: `"${deletedTitle}" duyurusu silindi.`,
        variant: "destructive",
        duration: 4000,
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
                  Son duyurular ve önemli bilgiler
                </p>
              </div>

              <Button
                onClick={() => {
                  setShowForm(true);
                  setEditIndex(null);
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

            <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
              {announcements.map((announcement, index) => (
                <div
                  key={index}
                  className="p-5 rounded-lg border-l-4 border-blue-500 bg-blue-50 hover:shadow-lg transition-shadow bg-white dark:bg-gray-800 flex justify-between items-start"
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
                  </div>
                  <div className="flex flex-col space-y-2 ml-4 min-w-[90px]">
                    <Button
                      onClick={() => handleEdit(index)}
                      className="flex items-center bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded-md"
                    >
                      <Pencil className="w-4 h-4 mr-1" />
                      Düzenle
                    </Button>
                    <Button
                      onClick={() => handleDelete(index)}
                      className="flex items-center bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded-md"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Sil
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* Modal Form */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-auto p-8 relative">
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditIndex(null);
                }}
                aria-label="Close"
                className="absolute top-5 right-5 text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition"
              >
                <X className="w-7 h-7" />
              </button>

              <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
                {editIndex !== null ? "Duyuruyu Düzenle" : "Yeni Duyuru Ekle"}
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
                      setEditIndex(null);
                    }}
                    className="px-5 py-3 rounded-lg border border-gray-300 hover:bg-red-100 hover:border-red-600 hover:text-red-600 dark:border-gray-600 dark:hover:bg-red-900 dark:hover:border-red-400 dark:hover:text-red-400 shadow-md transition"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-md transition"
                  >
                    {editIndex !== null ? "Duyuruyu Güncelle" : "Duyuru Yayınla"}
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
