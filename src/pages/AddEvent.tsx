import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { ArrowLeft, Calendar, Plus } from "lucide-react";
import { toast } from "../hooks/use-toast";
import { useAppDispatch, useAppSelector } from "../store/hooks"
import { createEvent } from "../store/slices/eventsSlice";

const AddEvent = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const userType = useAppSelector((state) => state.auth.userType);
  
  // ✅ Route guard - redirect if not HR
  useEffect(() => {
    if (userType && userType !== 'hr') {
      console.warn('⚠️ Access denied: Only HR can create events');
      toast({
        title: "Erişim Reddedildi",
        description: "Sadece İK personeli etkinlik oluşturabilir",
        variant: "destructive"
      });
      navigate('/events');
    }
  }, [userType, navigate]);
  
  // Show loading if user type is not yet determined
  if (!userType) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-gray-600">Yetki kontrolü yapılıyor...</div>
          </main>
        </div>
      </div>
    );
  }
  
  // Deny access for non-HR users
  if (userType !== 'hr') {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Erişim Reddedildi</h2>
              <p className="text-gray-600 mb-4">Sadece İK personeli etkinlik oluşturabilir</p>
              <Link to="/events" className="text-blue-600 hover:text-blue-800">
                Etkinlikler sayfasına dön
              </Link>
            </div>
          </main>
        </div>
      </div>
    );
  }
  
const [formData, setFormData] = useState({
  title: "",
  description: "",
  event_type: "",        // Değişti
  max_participants: 0,   // Değişti
  status: "Bekliyor",

  start_time: "",        // Değişti
  end_time: "",          // Değişti
  location: "",
  is_approved: false,    // Değişti
  createdById: 1         // Varsayılan değer
});

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
        throw new Error('Lütfen tüm zorunlu alanları doldurun');
      }

      const eventData = {
        title: formData.title,
        description: formData.description || "",
        eventType: formData.event_type,
        maxParticipants: Number(formData.max_participants),
        status: formData.status,
        startTime: formData.start_time,
        endTime: formData.end_time,
        location: formData.location || "Bornova, İzmir",
        isApproved: false,
        createdById : 1, // Şimdilik sabit değer
      };

      console.log('🔄 Gönderilecek veri:', eventData);
      console.log('🔑 Current user info:', {
        token: sessionStorage.getItem('token')?.substring(0, 30) + '...',
        user: JSON.parse(sessionStorage.getItem('user') || '{}'),
        userType: sessionStorage.getItem('userType')
      });
      
      // ✅ Debug: Let's see what headers are being sent
      console.log('🔍 Debugging request details:');
      console.log('- Token exists:', !!sessionStorage.getItem('token'));
      console.log('- User role from storage:', JSON.parse(sessionStorage.getItem('user') || '{}').role);
      console.log('- UserType from storage:', sessionStorage.getItem('userType'));
      
      const result = await dispatch(createEvent(eventData)).unwrap();
      console.log('✅ Sonuç:', result);
      
      toast({
        title: "Başarılı",
        description: "Etkinlik başarıyla oluşturuldu!",
        variant: "default"
      });
      
      navigate("/events");
      
    } catch (error: any) {
      console.error('❌ Hata:', error);
      toast({
        title: "Hata",
        description: error.response?.data?.message || "Etkinlik oluşturulamadı",
        variant: "destructive"
      });
    }
  };

  // ✅ Test function to debug backend expectations
  const testBackendPermissions = async () => {
    try {
      console.log('🧪 Testing backend permissions...');
      
      // Test with snake_case (what backend might expect)
      const testDataSnakeCase = {
        title: "Test Event",
        description: "Test Description", 
        event_type: "Meeting",
        max_participants: 10,
        status: "Bekliyor",
        start_time: "2024-01-01T10:00",
        end_time: "2024-01-01T11:00",
        location: "Test Location",
        is_approved: false,
        created_by: 1
      };
      
      console.log('🔍 Test data (snake_case):', testDataSnakeCase);
      
      // Make direct API call to test
      const token = sessionStorage.getItem('token');
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(testDataSnakeCase)
      });
      
      const responseData = await response.text();
      console.log('🔍 Raw response:', {
        status: response.status,
        statusText: response.statusText,
        data: responseData
      });
      
      if (response.ok) {
        toast({
          title: "Test Başarılı",
          description: "Backend ile bağlantı çalışıyor!",
          variant: "default"
        });
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
    } catch (error: any) {
      console.error('❌ Test failed:', error);
      toast({
        title: "Test Başarısız",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            {/* Geri dön linki */}
            <Link 
              to="/events"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Etkinliklere Geri Dön
            </Link>

            {/* Ana form kartı */}
            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-6 h-6 text-blue-600" />
                  <div>
                    <CardTitle className="text-2xl text-gray-800 dark:text-white">
                      Yeni Etkinlik Oluştur
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-300">
                      Yeni bir etkinlik oluşturun ve detaylarını girin
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Temel Bilgiler Bölümü */}
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

                  {/* Tarih ve Saat Bölümü */}
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
                          type="datetime-local" // datetime-local kullan
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
                          type="datetime-local" // datetime-local kullan
                          value={formData.end_time}
                          onChange={handleInputChange}
                          required
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Konum Bölümü */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white border-b pb-2">
                      Konum Bilgisi
                    </h3>
                    
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
                    <div>
                      <Label htmlFor="max_participants" className="text-sm font-medium">
                        Katılımcı Kapasitesi <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="max_participants"
                        name="max_participants"
                        type="number"
                        value={formData.max_participants}
                        onChange={handleInputChange}
                        onKeyDown={(e) => {
                          if (e.key === 'e' || e.key === 'E') {
                            e.preventDefault();
                          }
                        }}
                        onPaste={(e) => {
                          e.preventDefault(); 
                        }}
                        onDrop={(e) => {
                          e.preventDefault(); 
                        }}
                        placeholder="Örn: 100"
                        min="0"
                        required
                        className="w-full"
                      />
                    </div>
      
                  </div>

                  {/* Durum ve Açıklama Bölümü */}
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
                        <option value="Onay Bekliyor">Onay Bekliyor</option>
                        <option value="Taslak">Taslak</option>
                        <option value="Aktif">Aktif</option>
                        <option value="İptal Edildi">İptal Edildi</option>
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
                  <div className="flex justify-between items-center pt-6 border-t border-gray-200 dark:border-gray-700">
                    {/* Test Button */}
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={testBackendPermissions}
                      className="bg-yellow-50 border-yellow-300 text-yellow-800 hover:bg-yellow-100"
                    >
                      🧪 Test Backend
                    </Button>
                    
                    <div className="flex space-x-4">
                      <Link to="/events">
                        <Button variant="outline" type="button">
                          İptal
                        </Button>
                      </Link>
                      <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        Etkinlik Oluştur
                      </Button>
                    </div>
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

export default AddEvent;