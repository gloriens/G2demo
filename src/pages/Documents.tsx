import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FolderOpen, 
  FileText, 
  Download, 
  Upload, 
  Search, 
  Filter,
  Calendar,
  User,
  Trash  // <-- Buraya trash ikonunu ekledim
} from "lucide-react";

interface Document {
  id: number;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  uploadedBy: string;
  category: "hakediş" | "sözleşme" | "policy" | "form" | "diğer";
  downloadCount: number;
}

const Documents = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const mockDocuments: Document[] = [
    {
      id: 1,
      name: "Aralık 2024 Hakediş Listesi.pdf",
      type: "PDF",
      size: "2.3 MB",
      uploadDate: "2024-12-25",
      uploadedBy: "İK Departmanı",
      category: "hakediş",
      downloadCount: 156
    },
    {
      id: 2,
      name: "Çalışan El Kitabı 2024.pdf",
      type: "PDF",
      size: "5.1 MB",
      uploadDate: "2024-01-15",
      uploadedBy: "İK Departmanı",
      category: "policy",
      downloadCount: 89
    },
    {
      id: 3,
      name: "Yıllık İzin Formu.docx",
      type: "DOCX",
      size: "45 KB",
      uploadDate: "2024-03-10",
      uploadedBy: "İK Departmanı",
      category: "form",
      downloadCount: 234
    },
    {
      id: 4,
      name: "Kasım 2024 Hakediş.xlsx",
      type: "XLSX",
      size: "1.8 MB",
      uploadDate: "2024-11-30",
      uploadedBy: "Muhasebe",
      category: "hakediş",
      downloadCount: 67
    },
    {
      id: 5,
      name: "İş Sağlığı Güvenliği Politikası.pdf",
      type: "PDF",
      size: "1.2 MB",
      uploadDate: "2024-02-20",
      uploadedBy: "İSG Uzmanı",
      category: "policy",
      downloadCount: 145
    }
  ];

  const filteredDocuments = mockDocuments.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case "hakediş": return "bg-green-100 text-green-800";
      case "sözleşme": return "bg-blue-100 text-blue-800";
      case "policy": return "bg-purple-100 text-purple-800";
      case "form": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "hakediş": return "Hakediş";
      case "sözleşme": return "Sözleşme";
      case "policy": return "Politika";
      case "form": return "Form";
      default: return "Diğer";
    }
  };

  const handleDownload = (doc: Document) => {
    console.log(`Downloading: ${doc.name}`);
    // Burada dosya indirme işlemi yapılacak
  };

  const handleUpload = () => {
    console.log("Opening file upload dialog");
    // Burada dosya yükleme işlemi yapılacak
  };

  const handleDelete = (doc: Document) => {
    console.log(`Deleting: ${doc.name}`);
    // Burada dosya silme işlemi yapılacak
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Dosya Yönetimi</h2>
              <p className="text-gray-600">Şirket dosyalarını görüntüleyin ve indirin</p>
            </div>

            {/* Upload and Search Section */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex-1 flex gap-4 items-center">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Dosya ara..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">Tüm Kategoriler</option>
                    <option value="hakediş">Hakediş</option>
                    <option value="sözleşme">Sözleşme</option>
                    <option value="policy">Politika</option>
                    <option value="form">Form</option>
                    <option value="diğer">Diğer</option>
                  </select>
                </div>
                <Button onClick={handleUpload} className="bg-blue-600 hover:bg-blue-700">
                  <Upload className="w-4 h-4 mr-2" />
                  Dosya Yükle
                </Button>
              </div>
            </div>

            {/* Documents List */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Dosyalar ({filteredDocuments.length})
                </h3>
                
                <div className="space-y-4">
                  {filteredDocuments.map((doc) => (
                    <Card key={doc.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                              <FileText className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-800">{doc.name}</h4>
                              <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                                <span className="flex items-center">
                                  <Calendar className="w-4 h-4 mr-1" />
                                  {new Date(doc.uploadDate).toLocaleDateString('tr-TR')}
                                </span>
                                <span className="flex items-center">
                                  <User className="w-4 h-4 mr-1" />
                                  {doc.uploadedBy}
                                </span>
                                <span>{doc.size}</span>
                                <span>{doc.downloadCount} indirme</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Badge className={getCategoryBadgeColor(doc.category)}>
                              {getCategoryLabel(doc.category)}
                            </Badge>
                            <Badge variant="outline">{doc.type}</Badge>
                            <Button
                              onClick={() => handleDownload(doc)}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Download className="w-4 h-4 mr-1" />
                              İndir
                            </Button>
                            <Button
                              onClick={() => handleDelete(doc)}
                              size="sm"
                              variant="destructive"
                              className="flex items-center bg-red-600 hover:bg-red-700"
                            >
                              <Trash className="w-4 h-4 mr-1" />
                              Sil
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {filteredDocuments.length === 0 && (
                  <div className="text-center py-12">
                    <FolderOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">Dosya bulunamadı</h3>
                    <p className="text-gray-500">Arama kriterlerinizi değiştirmeyi deneyin</p>
                  </div>
                )}
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <FileText className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-800">{mockDocuments.length}</p>
                      <p className="text-sm text-gray-600">Toplam Dosya</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                      <Download className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-800">
                        {mockDocuments.reduce((sum, doc) => sum + doc.downloadCount, 0)}
                      </p>
                      <p className="text-sm text-gray-600">Toplam İndirme</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                      <FolderOpen className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-800">5</p>
                      <p className="text-sm text-gray-600">Kategori</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                      <Upload className="w-4 h-4 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-800">12</p>
                      <p className="text-sm text-gray-600">Bu Ay Eklenen</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Documents;
