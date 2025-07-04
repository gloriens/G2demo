import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { ArrowLeft, Calendar, Save } from "lucide-react";
import { toast } from "../hooks/use-toast";
import { useAppDispatch } from "../store/hooks";
import { fetchEventById, updateEvent } from "../store/slices/eventsSlice";

const EditEvent = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useAppDispatch();
  
  // Form state'ini veritabanı yapısına uygun hale getir
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    event_type: "", // category yerine event_type
    max_participants: 0,
    status: "Bekliyor",
    start_time: "", // date ve time ayrı yerine tek alan
    end_time: "",
    location: "",
    is_approved: null as boolean | null,
    created_by: 1,
    cover_image: ""
  });

  const [loading, setLoading] = useState(true);

  // API'den veri çekme
  useEffect(() => {
    const loadEventData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        console.log('🔄 Etkinlik yükleniyor, ID:', id);
        
        const result = await dispatch(fetchEventById(Number(id))).unwrap();
        console.log('✅ Etkinlik yüklendi:', result);
        
        // API'den gelen veriyi form state'ine uygun formata çevir
        setFormData({
          title: result.title || "",
          description: result.description || "",
          event_type: result.eventType || "",
          max_participants: result.maxParticipants || 0,
          status: result.status || "Bekliyor",
          start_time: result.startTime?.slice(0, 16) || "", 
          end_time: result.endTime?.slice(0, 16) || "",     
          location: result.location || "",
          is_approved: result.isApproved,
          created_by: result.createdById || 1,
          cover_image: result.coverImage || ""
        });
        
      } catch (error: any) {
        console.error('❌ Etkinlik yükleme hatası:', error);
        toast({
          title: "Hata",
          description: "Etkinlik yüklenirken bir hata oluştu",
          variant: "destructive"
        });
        navigate("/events");
      } finally {
        setLoading(false);
      }
    };

    loadEventData();
  }, [id, dispatch, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!formData.title || !formData.event_type || !formData.start_time || !formData.end_time) {
        toast({
          title: "Hata",
          description: "Lütfen tüm zorunlu alanları doldurun!",
          variant: "destructive"
        });
        return;
      }

      // Güncellenecek veriyi hazırla
      const updateData = {
        title: formData.title,
        description: formData.description,
        eventType: formData.event_type,
        maxParticipants: Number(formData.max_participants),
        status: "Bekliyor",
        startTime: formData.start_time,
        endTime: formData.end_time,
        location: formData.location,
         isApproved: false, 
        createdById: formData.created_by,
        coverImage: formData.cover_image || ""
      };

      console.log('🔄 Güncellenecek veri:', updateData);
      
      // updateEvent'i çağır
      await dispatch(updateEvent({ id: Number(id), data: updateData })).unwrap();
      
      toast({
        title: "Başarılı",
        description: "Etkinlik başarıyla güncellendi!",
        variant: "default"
      });
      
      navigate("/events");
      
    } catch (error: any) {
      console.error('❌ Güncelleme hatası:', error);
      toast({
        title: "Hata",
        description: error.message || "Etkinlik güncellenirken bir hata oluştu",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-gray-600 dark:text-gray-300">Etkinlik yükleniyor...</div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            <Link 
              to="/events"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Etkinliklere Geri Dön
            </Link>

            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-6 h-6 text-blue-600" />
                  <div>
                    <CardTitle className="text-2xl text-gray-800 dark:text-white">
                      Etkinliği Düzenle
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-300">
                      Etkinlik detaylarını düzenleyin
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Temel Bilgiler */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white border-b pb-2">
                      Temel Bilgiler
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Etkinlik Adı */}
                      <div className="space-y-2">
                        <Label htmlFor="title" className="text-sm font-medium">
                          Etkinlik Adı <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="title"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          placeholder="Etkinlik adını girin"
                          required
                          className="w-full"
                        />
                      </div>

                      {/* Kategori */}
                      <div className="space-y-2">
                        <Label htmlFor="event_type" className="text-sm font-medium">
                          Kategori <span className="text-red-500">*</span>
                        </Label>
                        <select
                          id="event_type"
                          name="event_type"
                          value={formData.event_type}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          required
                        >
                          <option value="">Kategori Seçin</option>
                          <option value="Seminar">Seminer</option>       
                          <option value="Workshop">Workshop</option>   
                          <option value="Meeting">Toplantı</option>       
                          <option value="Training">Eğitim</option>      
                          <option value="Social">Sosyal Etkinlik</option> 
                          <option value="Company">Şirket Etkinliği</option> 
                          <option value="Celebration">Kutlama</option>    
                          <option value="Other">Diğer</option>  
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Tarih ve Saat */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white border-b pb-2">
                      Tarih ve Saat
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Başlangıç Zamanı */}
                      <div className="space-y-2">
                        <Label htmlFor="start_time" className="text-sm font-medium">
                          Başlangıç Zamanı <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="start_time"
                          name="start_time"
                          type="datetime-local"
                          value={formData.start_time}
                          onChange={handleInputChange}
                          required
                          className="w-full"
                        />
                      </div>

                      {/* Bitiş Zamanı */}
                      <div className="space-y-2">
                        <Label htmlFor="end_time" className="text-sm font-medium">
                          Bitiş Zamanı <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="end_time"
                          name="end_time"
                          type="datetime-local"
                          value={formData.end_time}
                          onChange={handleInputChange}
                          required
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Konum ve Katılımcı */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white border-b pb-2">
                      Konum ve Kapasite
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Konum */}
                      <div className="space-y-2">
                        <Label htmlFor="location" className="text-sm font-medium">
                          Konum <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="location"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          placeholder="Etkinlik konumunu girin"
                          required
                          className="w-full"
                        />
                      </div>

                      {/* Katılımcı Kapasitesi */}
                      <div className="space-y-2">
                        <Label htmlFor="max_participants" className="text-sm font-medium">
                          Maksimum Katılımcı
                        </Label>
                        <Input
                          id="max_participants"
                          name="max_participants"
                          type="number"
                          value={formData.max_participants}
                          onChange={handleInputChange}
                          min="0"
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Durum ve Açıklama */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white border-b pb-2">
                     Açıklama Bilgisi
                    </h3>
                    
                    {/* Durum */}
                    {/* <div className="space-y-2">
                      <Label htmlFor="status" className="text-sm font-medium">
                        Durum
                      </Label>
                      <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      >
                        <option value="Pending">Onay Bekliyor</option>
                        <option value="Approved">Onaylandı</option>
                        <option value="Rejected">Reddedildi</option>
                        <option value="Cancelled">İptal Edildi</option>
                      </select>
                    </div> */}

                    {/* Açıklama */}
                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-sm font-medium">
                        Açıklama
                      </Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Etkinlik açıklaması..."
                        rows={4}
                        className="w-full resize-none"
                      />
                    </div>
                  </div>

                  {/* Form Butonları */}
                  <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <Link to="/events">
                      <Button variant="outline" type="button">
                        İptal
                      </Button>
                    </Link>
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                      <Save className="w-4 h-4 mr-2" />
                      Değişiklikleri Kaydet
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EditEvent;