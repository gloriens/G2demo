import { useState, useRef, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FolderOpen, 
  FileText, 
  Download, 
  Upload, 
  Search, 
  Calendar,
  User,
  X,
  Trash
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { 
  fetchDocuments, 
  uploadDocuments, 
  downloadDocument, 
  deleteDocument,
  clearError 
} from "@/store/slices/documentsSlice";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Documents = () => {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [selectedCategoryForUpload, setSelectedCategoryForUpload] = useState("");
  const [documentToDelete, setDocumentToDelete] = useState<any>(null); // ✅ Silinecek doküman
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Redux state
  const { documents, loading, error, uploadProgress } = useAppSelector(state => state.documents);

  // Component mount olduğunda dosyaları çek
  useEffect(() => {
    dispatch(fetchDocuments());
  }, [dispatch]);

  // Error handling
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

  // Filtreleme - backend veri yapısına uygun
  const filteredDocuments = documents.filter(doc => {
    // ✅ Backend'den "title" geliyor, "name" değil
    const matchesSearch = doc.title?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    // ✅ Backend'den "documentType" geliyor, "category" değil  
    const matchesCategory = selectedCategory === "all" || doc.documentType === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryBadgeColor = (documentType: string) => {
    switch (documentType) {
      case "Policy": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Plan": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "Contract": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "Form": return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case "Report": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  const getCategoryLabel = (documentType: string) => {
    switch (documentType) {
      case "Policy": return "Politika";
      case "Plan": return "Plan";
      case "Contract": return "Sözleşme";
      case "Form": return "Form";
      case "Report": return "Rapor";
      default: return "Diğer";
    }
  };

  // Dosya indirme
  const handleDownload = async (doc: any) => {
    try {
      if (doc.fileData) {
        // Base64 veriyi blob'a çevir
        const byteCharacters = atob(doc.fileData);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray]);
        
        // İndir
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = doc.title;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        toast({
          title: "Başarılı",
          description: `${doc.title} dosyası indirildi`,
        });
      } else {
        // API'den indir
        const result = await dispatch(downloadDocument(doc.id));
        if (downloadDocument.fulfilled.match(result)) {
          const blob = result.payload;
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = doc.title;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          
          toast({
            title: "Başarılı",
            description: `${doc.title} dosyası indirildi`,
          });
        }
      }
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Hata",
        description: "Dosya indirilemedi",
        variant: "destructive"
      });
    }
  };

  // ✅ Dosya silme - confirmation dialog ile
  const confirmDeleteDocument = async () => {
    if (!documentToDelete) return;
    
    try {
      const result = await dispatch(deleteDocument(documentToDelete.id));
      if (deleteDocument.fulfilled.match(result)) {
        toast({
          title: "Başarılı",
          description: `${documentToDelete.title} dosyası silindi`,
        });
        setDocumentToDelete(null);
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Dosya yükleme
  // Dosya yükleme - Detaylı debug ile
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (uploadedFiles.length === 0 || !selectedCategoryForUpload) {
      toast({
        title: "Hata",
        description: "Lütfen dosya seçin ve kategori belirtin",
        variant: "destructive"
      });
      return;
    }

    console.log('🚀 Starting upload process...');
    console.log('📁 Files to upload:', uploadedFiles.length);
    console.log('🏷️ Category:', selectedCategoryForUpload);

    // ✅ Her dosya için ayrı FormData oluştur ve gönder
    for (let i = 0; i < uploadedFiles.length; i++) {
      const file = uploadedFiles[i];
      console.log(`\n📤 Uploading file ${i + 1}/${uploadedFiles.length}: ${file.name}`);
      console.log(`📊 File details:`, {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified
      });
      
      const formData = new FormData();
      
      // ✅ Backend'in beklediği alan adları
      formData.append('file', file);
      formData.append('title', file.name);
      formData.append('description', `${file.name} dosyası yüklendi`);
      formData.append('documentType', selectedCategoryForUpload);
      formData.append('uploadedById', '1');
      formData.append('departmentIds',"1");
      
      // ✅ Debug: FormData'yı kontrol et
      console.log('📋 FormData contents:');
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`  ${key}: File(${value.name}, ${value.size} bytes, ${value.type})`);
        } else {
          console.log(`  ${key}: ${value}`);
        }
      }

      try {
        console.log('🌐 Dispatching uploadDocuments...');
        const result = await dispatch(uploadDocuments(formData));
        
        console.log('📥 Upload result:', result);
        
        if (uploadDocuments.fulfilled.match(result)) {
          console.log(`✅ File ${i + 1} uploaded successfully:`, result.payload);
        } else if (uploadDocuments.rejected.match(result)) {
          console.log(`❌ File ${i + 1} upload failed:`, result.payload);
          console.log(`❌ Error type:`, typeof result.payload);
          
          // ✅ Error mesajını string'e çevir
          let errorMessage = 'Dosya yüklenemedi';
          if (typeof result.payload === 'string') {
            errorMessage = result.payload;
          } else if (result.payload && typeof result.payload === 'object') {
            errorMessage = JSON.stringify(result.payload);
          }
          
          toast({
            title: "Hata",
            description: `${file.name} yüklenemedi: ${errorMessage}`,
            variant: "destructive"
          });
          return; // Bir dosya başarısız olursa dur
        }
      } catch (error) {
        console.error('❌ Catch block error for file:', file.name, error);
        toast({
          title: "Hata",
          description: `${file.name} yüklenirken beklenmeyen hata oluştu`,
          variant: "destructive"
        });
        return;
      }
    }

    // ✅ Tüm dosyalar başarıyla yüklendiyse
    console.log('🎉 All files uploaded successfully!');
    toast({
      title: "Başarılı",
      description: `${uploadedFiles.length} dosya başarıyla yüklendi`,
    });
    setUploadedFiles([]);
    setSelectedCategoryForUpload("");
    setShowUploadForm(false);
    // Dosyaları yeniden çek
    dispatch(fetchDocuments());
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Loading durumu
  if (loading && documents.length === 0) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-7xl mx-auto">
              <div className="bg-card rounded-xl shadow-lg p-8 text-center">
                <div className="text-muted-foreground">Dosyalar yükleniyor...</div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-2">Dosya Yönetimi</h2>
              <p className="text-muted-foreground">Şirket dosyalarını görüntüleyin ve indirin</p>
            </div>

            {/* Upload and Search Section */}
            <div className="bg-card rounded-xl shadow-lg p-6 mb-6 border border-border">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex-1 flex gap-4 items-center">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
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
                    className="px-3 py-2 border border-input rounded-md focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
                  >
                    <option value="all">Tüm Kategoriler</option>
                    <option value="Policy">Politika</option>
                    <option value="Plan">Plan</option>
                    <option value="Contract">Sözleşme</option>
                    <option value="Form">Form</option>
                    <option value="Report">Rapor</option>
                  </select>
                </div>
                <Button 
                  onClick={() => setShowUploadForm(true)} 
                  className="bg-primary hover:bg-primary/90"
                  disabled={loading}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Dosya Yükle
                </Button>
              </div>
            </div>

            {/* Upload Form Modal */}
            {showUploadForm && (
              <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center">
                          <Upload className="w-5 h-5 mr-2 text-primary" />
                          Dosya Yükle
                        </CardTitle>
                        <CardDescription>
                          Sisteme yüklemek istediğiniz dosyaları seçin
                        </CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowUploadForm(false)}
                        disabled={loading}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <form onSubmit={handleUploadSubmit} className="space-y-4">
                      {/* Drag & Drop Area */}
                      <div
                        className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors"
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                      >
                        <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground mb-2">
                          Dosyaları buraya sürükleyin veya
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={loading}
                        >
                          Dosya Seç
                        </Button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          multiple
                          onChange={handleFileSelect}
                          className="hidden"
                          accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.jpeg,.png"
                        />
                      </div>

                      {/* Category Selection */}
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Kategori *
                        </label>
                        <select
                          required
                          value={selectedCategoryForUpload}
                          onChange={(e) => setSelectedCategoryForUpload(e.target.value)}
                          className="w-full px-3 py-2 border border-input rounded-md focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
                        >
                          <option value="">Kategori Seçin</option>
                          <option value="Policy">Politika</option>
                          <option value="Plan">Plan</option>
                          <option value="Contract">Sözleşme</option>
                          <option value="Form">Form</option>
                          <option value="Report">Rapor</option>
                        </select>
                      </div>

                      {/* Upload Progress */}
                      {loading && uploadProgress > 0 && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Yükleniyor...</span>
                            <span>{uploadProgress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full transition-all duration-300" 
                              style={{ width: `${uploadProgress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}

                      {/* File List */}
                      {uploadedFiles.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="font-medium text-foreground">Seçilen Dosyalar:</h4>
                          <div className="max-h-40 overflow-y-auto space-y-2">
                            {uploadedFiles.map((file, index) => (
                              <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                                <div className="flex items-center space-x-2">
                                  <FileText className="w-4 h-4 text-muted-foreground" />
                                  <span className="text-sm text-foreground">{file.name}</span>
                                  <span className="text-xs text-muted-foreground">
                                    ({formatFileSize(file.size)})
                                  </span>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeFile(index)}
                                  disabled={loading}
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Submit Buttons */}
                      <div className="flex justify-end space-x-2 pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowUploadForm(false)}
                          disabled={loading}
                        >
                          İptal
                        </Button>
                        <Button
                          type="submit"
                          disabled={uploadedFiles.length === 0 || !selectedCategoryForUpload || loading}
                          className="bg-primary hover:bg-primary/90"
                        >
                          {loading ? 'Yükleniyor...' : 'Dosyaları Yükle'}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Documents List */}
            <div className="bg-card rounded-xl shadow-lg border border-border">
              <div className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-4">
                  Dosyalar ({filteredDocuments.length})
                </h3>
                
                <div className="space-y-4">
                  {filteredDocuments.map((doc) => (
                    <Card key={doc.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                              <FileText className="w-6 h-6 text-primary" />
                            </div>
                            <div className="flex-1">
                              {/* ✅ Backend'den "title" kullan */}
                              <h4 className="font-semibold text-foreground">{doc.title}</h4>
                              {/* ✅ Description varsa göster */}
                              {doc.description && (
                                <p className="text-sm text-muted-foreground mt-1">{doc.description}</p>
                              )}
                              <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                                <span className="flex items-center">
                                  <Calendar className="w-4 h-4 mr-1" />
                                  {/* ✅ Backend'den "uploadedAt" kullan */}
                                  {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString('tr-TR') : 'Bilinmiyor'}
                                </span>
                                <span className="flex items-center">
                                  <User className="w-4 h-4 mr-1" />
                                  {/* ✅ uploadedById varsa göster, yoksa 'Sistem' */}
                                  {doc.uploadedById ? `User ${doc.uploadedById}` : 'Sistem'}
                                </span>
                                {/* ✅ fileData varsa boyut hesapla */}
                                {doc.fileData && (
                                  <span>{formatFileSize(atob(doc.fileData).length)}</span>
                                )}
                                <span>0 indirme</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            {/* ✅ Backend'den "documentType" kullan */}
                            <Badge className={getCategoryBadgeColor(doc.documentType)}>
                              {getCategoryLabel(doc.documentType)}
                            </Badge>
                            {/* ✅ Dosya tipini title'dan çıkar */}
                            <Badge variant="outline">
                              {doc.title?.split('.').pop()?.toUpperCase() || 'DOC'}
                            </Badge>
                            <Button
                              onClick={() => handleDownload(doc)}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white"
                              disabled={loading}
                            >
                              <Download className="w-4 h-4 mr-1" />
                              İndir
                            </Button>
                            
                            {/* ✅ Confirmation Dialog ile Silme Butonu */}
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  className="flex items-center bg-red-600 hover:bg-red-700"
                                  disabled={loading}
                                >
                                  <Trash className="w-4 h-4 mr-1" />
                                  Sil
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Dosyayı Sil</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    <strong>{doc.title}</strong> dosyasını silmek istediğinizden emin misiniz? 
                                    Bu işlem geri alınamaz.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>İptal</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => {
                                      setDocumentToDelete(doc);
                                      confirmDeleteDocument();
                                    }}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Sil
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {filteredDocuments.length === 0 && (
                  <div className="text-center py-12">
                    <FolderOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-muted-foreground mb-2">Dosya bulunamadı</h3>
                    <p className="text-muted-foreground">Arama kriterlerinizi değiştirmeyi deneyin</p>
                  </div>
                )}
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                      <FileText className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{documents.length}</p>
                      <p className="text-sm text-muted-foreground">Toplam Dosya</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mr-3">
                      <FolderOpen className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">5</p>
                      <p className="text-sm text-muted-foreground">Kategori</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mr-3">
                      <Upload className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">
                        {documents.filter(doc => {
                          const uploadDate = new Date(doc.uploadedAt || '');
                          const currentMonth = new Date().getMonth();
                          const currentYear = new Date().getFullYear();
                          return uploadDate.getMonth() === currentMonth && uploadDate.getFullYear() === currentYear;
                        }).length}
                      </p>
                      <p className="text-sm text-muted-foreground">Bu Ay Eklenen</p>
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
