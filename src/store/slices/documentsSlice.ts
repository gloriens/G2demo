import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

export interface Document {
  id: number;
  title: string; // ✅ Backend'den "title" geliyor
  description?: string; // ✅ Backend'den "description" geliyor
  documentType: string; // ✅ Backend'den "documentType" geliyor
  uploadedAt: string; // ✅ Backend'den "uploadedAt" geliyor
  uploadedById?: number; // ✅ Backend'den "uploadedById" geliyor
  departmentIds?: number[]; // ✅ Backend'den "departmentIds" geliyor
  fileData?: string; // ✅ Backend'den "fileData" geliyor (Base64)
  downloadCount?: number;
  fileSize?: number;
  isActive?: boolean;
}

export interface DocumentsState {
  documents: Document[];
  loading: boolean;
  error: string | null;
  uploadProgress: number;
}

const initialState: DocumentsState = {
  documents: [],
  loading: false,
  error: null,
  uploadProgress: 0,
};

// Fetch documents
export const fetchDocuments = createAsyncThunk(
  'documents/fetchDocuments',
  async (_, { rejectWithValue }) => {
    try {
      console.log('🔄 Fetching documents...');
      const response = await axios.get(`${API_BASE_URL}/documents`);
      console.log('✅ Documents fetched:', response.data);
      return response.data;
    } catch (error: any) {
      console.log('❌ Fetch documents error:', error);
      return rejectWithValue(error.response?.data?.message || 'Dosyalar alınamadı');
    }
  }
);

// Upload documents
export const uploadDocuments = createAsyncThunk(
  'documents/uploadDocuments',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      console.log('🔄 Uploading documents...');
      
      // ✅ FormData içeriğini debug et
      console.log('📋 FormData contents:');
      for (let [key, value] of formData.entries()) {
        console.log(`  ${key}:`, value);
      }
      
      const response = await axios.post(`${API_BASE_URL}/documents/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          console.log(`📤 Upload progress: ${progress}%`);
        },
      });
      console.log('✅ Documents uploaded:', response.data);
      return response.data;
    } catch (error: any) {
      console.log('❌ Upload documents error:', error);
      console.log('❌ Error response:', error.response?.data);
      console.log('❌ Error status:', error.response?.status);
      return rejectWithValue(error.response?.data?.message || error.response?.data || 'Dosya yüklenemedi');
    }
  }
);

// Download document
export const downloadDocument = createAsyncThunk(
  'documents/downloadDocument',
  async (documentId: number, { rejectWithValue }) => {
    try {
      console.log('🔄 Downloading document:', documentId);
      const response = await axios.get(`${API_BASE_URL}/documents/${documentId}/download`, {
        responseType: 'blob',
      });
      console.log('✅ Document downloaded');
      return response.data;
    } catch (error: any) {
      console.log('❌ Download document error:', error);
      return rejectWithValue(error.response?.data?.message || 'Dosya indirilemedi');
    }
  }
);

// Delete document
export const deleteDocument = createAsyncThunk(
  'documents/deleteDocument',
  async (documentId: number, { rejectWithValue }) => {
    try {
      console.log('🔄 Deleting document:', documentId);
      await axios.delete(`${API_BASE_URL}/documents/${documentId}`);
      console.log('✅ Document deleted');
      return documentId;
    } catch (error: any) {
      console.log('❌ Delete document error:', error);
      return rejectWithValue(error.response?.data?.message || 'Dosya silinemedi');
    }
  }
);

const documentsSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUploadProgress: (state, action) => {
      state.uploadProgress = action.payload;
    },
    resetUploadProgress: (state) => {
      state.uploadProgress = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch documents
      .addCase(fetchDocuments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDocuments.fulfilled, (state, action) => {
        state.loading = false;
        state.documents = action.payload;
      })
      .addCase(fetchDocuments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Upload documents
      .addCase(uploadDocuments.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.uploadProgress = 0;
      })
      .addCase(uploadDocuments.fulfilled, (state, action) => {
        state.loading = false;
        state.uploadProgress = 100;
        // Yeni yüklenen dosyaları mevcut listeye ekle
        if (Array.isArray(action.payload)) {
          state.documents.push(...action.payload);
        } else {
          state.documents.push(action.payload);
        }
      })
      .addCase(uploadDocuments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.uploadProgress = 0;
      })
      
      // Download document
      .addCase(downloadDocument.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(downloadDocument.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(downloadDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Delete document
      .addCase(deleteDocument.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDocument.fulfilled, (state, action) => {
        state.loading = false;
        state.documents = state.documents.filter(doc => doc.id !== action.payload);
      })
      .addCase(deleteDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setUploadProgress, resetUploadProgress } = documentsSlice.actions;
export default documentsSlice.reducer;

// Dosya indirme - backend Base64 verisi ile
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