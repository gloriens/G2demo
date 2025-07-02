import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { ArrowLeft, Calendar, Plus } from "lucide-react";

const AddEvent = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    date: "",
    time: "",
    location: "",
    status: "Onay Bekliyor",
    description: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validasyonu
    if (!formData.title || !formData.category || !formData.date || !formData.time || !formData.location) {
      alert("Lütfen zorunlu alanları doldurun!");
      return;
    }
    
    console.log("Yeni etkinlik verisi:", formData);
    alert("Etkinlik başarıyla oluşturuldu!");
    navigate("/events");
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
                        <Label htmlFor="category" className="text-sm font-medium">
                          Kategori <span className="text-red-500">*</span>
                        </Label>
                        <select
                          id="category"
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          required
                        >
                          <option value="">Kategori Seçin</option>
                          <option value="meeting">Toplantı</option>
                          <option value="training">Eğitim</option>
                          <option value="social">Sosyal Etkinlik</option>
                          <option value="company">Şirket Etkinliği</option>
                          <option value="celebration">Kutlama</option>
                          <option value="other">Diğer</option>
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
                      {/* Tarih */}
                      <div className="space-y-2">
                        <Label htmlFor="date" className="text-sm font-medium">
                          Tarih <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="date"
                          name="date"
                          type="date"
                          value={formData.date}
                          onChange={handleInputChange}
                          required
                          className="w-full"
                          placeholder="gg.aa.yyyy"
                        />
                      </div>

                      {/* Saat */}
                      <div className="space-y-2">
                        <Label htmlFor="time" className="text-sm font-medium">
                          Saat <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="time"
                          name="time"
                          type="time"
                          value={formData.time}
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
                      Konum
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
                  </div>

                  {/* Durum ve Açıklama Bölümü */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white border-b pb-2">
                      Durum ve Açıklama
                    </h3>
                    
                    {/* Durum */}
                    <div className="space-y-2">
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
                    </div>

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
                      <Plus className="w-4 h-4 mr-2" />
                      Etkinlik Oluştur
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

export default AddEvent;