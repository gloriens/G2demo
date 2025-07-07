import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { Bell, Plus, Clock, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchNews, createNews, updateNews, deleteNews, clearError, base64ToImageUrl } from "@/store/slices/newsSlice";

const News = () => {
  const { toast } = useToast();
  const dispatch = useAppDispatch();

  const { news, loading, error } = useAppSelector((state) => state.news);

  const [showAddForm, setShowAddForm] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [newsToDelete, setNewsToDelete] = useState<number | null>(null);
  const [editingNews, setEditingNews] = useState<number | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "Duyuru",
    author: "",
    duration: "1 hafta",
    content: ""
  });

  useEffect(() => {
    dispatch(fetchNews());
  }, [dispatch]);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingNews) {
        await dispatch(updateNews({
          id: editingNews,
          data: formData,
          coverImage: selectedFile || undefined
        })).unwrap();
        toast({
          title: "Haber Güncellendi",
          description: "Haber başarıyla güncellendi.",
        });
        setEditingNews(null);
      } else {
        // Debug için - formData bir obje, FormData değil
        console.log('📎 Form Data:', formData);
        console.log('📎 Selected File:', selectedFile);
        
        await dispatch(createNews({
          data: formData,
          imageFile: selectedFile || undefined
        })).unwrap();
        toast({
          title: "Haber Yayınlandı",
          description: "Yeni haber başarıyla yayınlandı.",
        });
      }
      setFormData({
        title: "",
        category: "Duyuru",
        author: "",
        duration: "1 hafta",
        content: ""
      });
      setSelectedFile(null);
      setImagePreview(null);
      setShowAddForm(false);
    } catch (error: any) {
      toast({
        title: "Hata",
        description: error.message || "İşlem başarısız oldu.",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (newsItem: any) => {
    setFormData({
      title: newsItem.title,
      category: newsItem.category || newsItem.newsType,
      author: newsItem.author || newsItem.createdBy,
      duration: newsItem.duration || "1 hafta",
      content: newsItem.content
    });
    if (newsItem.image || newsItem.coverImage) {
      const base64Image = newsItem.image || newsItem.coverImage;
      setImagePreview(base64ToImageUrl(base64Image));
    } else {
      setImagePreview(null);
    }
    setEditingNews(newsItem.id);
    setShowAddForm(true);
  };

  const handleDeleteClick = (id: number) => {
    setNewsToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (newsToDelete) {
      try {
        await dispatch(deleteNews(newsToDelete)).unwrap();
        toast({
          title: "Haber Silindi",
          description: "Haber başarıyla silindi.",
          variant: "destructive"
        });
      } catch (error: any) {
        toast({
          title: "Hata",
          description: error.message || "Silme işlemi başarısız oldu.",
          variant: "destructive"
        });
      }
    }
    setDeleteDialogOpen(false);
    setNewsToDelete(null);
  };

  const handleCancel = () => {
    setFormData({
      title: "",
      category: "Duyuru",
      author: "",
      duration: "1 hafta",
      content: ""
    });
    setSelectedFile(null);
    setImagePreview(null);
    setEditingNews(null);
    setShowAddForm(false);
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

  // Son 7 günde eklenen haberleri say
  const last7Days = new Date();
  last7Days.setDate(last7Days.getDate() - 7);

  const newsThisWeek = news.filter(item => {
    if (!item.createdAt) return false;
    return new Date(item.createdAt) >= last7Days;
  }).length;

  // Bu ayın başlangıcını bul
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  // Bu ay eklenen haber sayısı
  const newsThisMonth = news.filter(item => {
    if (!item.createdAt) return false;
    return new Date(item.createdAt) >= startOfMonth;
  }).length;

  // Tarih formatlama fonksiyonu
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
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors disabled:opacity-50"
                >
                  <Plus className="h-5 w-5" />
                  <span>Yeni Haber</span>
                </button>
              </div>
            </div>

            {/* Add/Edit News Form */}
            {showAddForm && (
              <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  {editingNews ? 'Haber Düzenle' : 'Yeni Haber Ekle'}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Başlık *</label>
                    <input 
                      type="text" 
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Kategori *</label>
                      <select 
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="Duyuru">Duyuru</option>
                        <option value="Etkinlik">Etkinlik</option>
                        <option value="Teknik">Teknik</option>
                        <option value="Başarı">Başarı</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Yazar *</label>
                      <input 
                        type="text" 
                        name="author"
                        value={formData.author}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Haberin Kalma Süresi</label>
                    <select 
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="3 gün">3 gün</option>
                      <option value="1 hafta">1 hafta</option>
                      <option value="2 hafta">2 hafta</option>
                      <option value="1 ay">1 ay</option>
                      <option value="3 ay">3 ay</option>
                      <option value="Süresiz">Süresiz</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Kapak Resmi</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <p className="text-sm text-gray-500 mt-1">PNG, JPG veya JPEG formatında resim yükleyebilirsiniz.</p>
                    {imagePreview && (
                      <div className="mt-3">
                        <img 
                          src={imagePreview} 
                          alt="Önizleme" 
                          className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                        />
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">İçerik *</label>
                    <textarea 
                      rows={5} 
                      name="content"
                      value={formData.content}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    ></textarea>
                  </div>
                  <div className="flex justify-end space-x-4 mt-4">
                    <button 
                      type="button"
                      onClick={handleCancel}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      İptal
                    </button>
                    <button 
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
                    >
                      {loading ? 'İşleniyor...' : (editingNews ? 'Güncelle' : 'Haber Yayınla')}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* News Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
                    <Clock className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{newsThisWeek}</p>
                    <p className="text-gray-600 text-sm">Bu Hafta</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-orange-100 rounded-full">
                    <Clock className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{newsThisMonth}</p>
                    <p className="text-gray-600 text-sm">Bu Ay</p>
                  </div>
                </div>
              </div>
            </div>

            {/* All News */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Tüm Haberler</h3>
              <div className="space-y-6">
                {news.map((item) => (
                  <div key={item.id} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="flex">
                      {/* Base64 veya URL'den resim gösterimi */}
                      {(item.image || item.coverImage) && (
                        <div className="w-48 h-32 flex-shrink-0">
                          <img 
                            src={item.image ? item.image : base64ToImageUrl(item.coverImage)} 
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-3">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
                                {item.newsType}
                              </span>
                              <span className="text-xs text-gray-500">
                                Süre: {item.duration}
                              </span>
                            </div>
                            <Link to={`/news/${item.id}`}>
                              <h3 className="text-xl font-bold text-gray-800 mb-2 hover:text-blue-600 transition-colors cursor-pointer">
                                {item.title}
                              </h3>
                            </Link>
                            <p className="text-gray-600 mb-4">{item.content}</p>
                            <div className="flex items-center justify-between text-sm text-gray-500">
                              <div className="flex items-center space-x-4">
                                <span className="font-medium">{item.author || item.createdBy}</span>
                                <div className="flex items-center">
                                  <Clock className="h-4 w-4 mr-1" />
                                  <span>{formatTurkishDate(item.createdAt)}</span>
                                </div>
                              </div>
                              <Link 
                                to={`/news/${item.id}`}
                                className="text-blue-600 hover:text-blue-800 font-medium"
                              >
                                Detayını Oku
                              </Link>
                            </div>
                          </div>
                          <div className="ml-4 flex space-x-2">
                            <button 
                              onClick={() => handleEdit(item)}
                              disabled={loading}
                              className="text-blue-600 hover:text-blue-800 font-medium flex items-center space-x-1 disabled:opacity-50"
                            >
                              <Edit className="h-4 w-4" />
                              <span>Düzenle</span>
                            </button>
                            <button 
                              onClick={() => handleDeleteClick(item.id!)}
                              disabled={loading}
                              className="text-red-600 hover:text-red-800 font-medium flex items-center space-x-1 disabled:opacity-50"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span>Sil</span>
                            </button>
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
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Haberi Sil"
        description="Bu haberi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
        onConfirm={handleDeleteConfirm}
        confirmText="Sil"
        cancelText="İptal"
        variant="destructive"
      />
    </div>
  );
};

export default News;