import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// News type
export interface News {
  id?: number;
  title: string;
  content: string;
  category: string;
  author: string;
  duration: string;
  image?: string; // ✅ Base64 string olarak
  date?: string;
  created_at?: string;
  updated_at?: string;
}

// State type
interface NewsState {
  news: News[];
  currentNews: News | null;
  loading: boolean;
  error: string | null;
}

const initialState: NewsState = {
  news: [],
  currentNews: null,
  loading: false,
  error: null,
};

// API instance
const api = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// ✅ File'ı Base64 string'e çeviren fonksiyon
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      // "data:image/jpeg;base64," kısmını kaldır, sadece base64 string'i al
      const base64Data = base64.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// ✅ Base64 string'i görüntülenebilir URL'ye çeviren fonksiyon
export const base64ToImageUrl = (base64String: string): string => {
  try {
    if (!base64String) return '';
    // Base64 string'e data URL prefix'i ekle
    return `data:image/jpeg;base64,${base64String}`;
  } catch (error) {
    console.error('Base64 to image conversion error:', error);
    return '';
  }
};

// Async thunks
export const fetchNews = createAsyncThunk(
  'news/fetchNews',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<News[]>('/news');
      console.log('✅ News fetched:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Fetch news error:', error);
      return rejectWithValue(error.response?.data?.message || error.message || 'Haberler yüklenemedi');
    }
  }
);

// FormData ile gönderim
export const createNews = createAsyncThunk(
  'news/createNews',
  async (newsData: { data: Omit<News, 'id' | 'date' | 'created_at'>; imageFile?: File }, { rejectWithValue }) => {
    try {
      console.log('🔄 Creating news:', newsData);
      
      // ✅ FormData oluştur
      const formData = new FormData();
      
      // Backend'in beklediği field isimleri
      formData.append('title', newsData.data.title);
      formData.append('content', newsData.data.content);
      formData.append('createdBy', newsData.data.author);
      formData.append('newsType', newsData.data.category);
      
      // Resim dosyasını ekle
      if (newsData.imageFile) {
        formData.append('file', newsData.imageFile); // Backend'de @RequestParam("file") varsa
        console.log('📎 Image file added:', newsData.imageFile.name);
      }
      
      // ✅ FormData için özel axios request
      const response = await axios.post<News>('http://localhost:8080/news', formData, {
        timeout: 30000,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log('✅ News created:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Create news error:', error);
      console.error('❌ Error response:', error.response?.data);
      return rejectWithValue(error.response?.data?.message || error.message || 'Haber oluşturulamadı');
    }
  }
);

// ✅ Haber güncelleme
export const updateNews = createAsyncThunk(
  'news/updateNews',
  async ({ id, data, imageFile }: { id: number; data: Partial<News>; imageFile?: File }, { rejectWithValue }) => {
    try {
      console.log('🔄 Updating news:', { id, data });
      
      let payload = {
        title: data.title,
        content: data.content,
        createdBy: data.author,
        newsType: data.category,
      };
      
      // Yeni resim varsa Base64'e çevir
      if (imageFile) {
        const base64Image = await fileToBase64(imageFile);
        payload.coverImage = base64Image;
        console.log('📎 New image converted to base64, length:', base64Image.length);
      }
      
      const response = await api.put<News>(`/news/${id}`, payload);
      console.log('✅ News updated:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Update news error:', error);
      console.error('❌ Error response:', error.response?.data);
      return rejectWithValue(error.response?.data?.message || error.message || 'Haber güncellenemedi');
    }
  }
);

export const deleteNews = createAsyncThunk(
  'news/deleteNews',
  async (id: number, { rejectWithValue }) => {
    try {
      console.log('🔄 Deleting news:', id);
      await api.delete(`/news/${id}`);
      console.log('✅ News deleted:', id);
      return id;
    } catch (error: any) {
      console.error('❌ Delete news error:', error);
      return rejectWithValue(error.response?.data?.message || error.message || 'Haber silinemedi');
    }
  }
);

// Slice
const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentNews: (state) => {
      state.currentNews = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch News
      .addCase(fetchNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNews.fulfilled, (state, action) => {
        state.loading = false;
        state.news = action.payload;
      })
      .addCase(fetchNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Create News
      .addCase(createNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNews.fulfilled, (state, action) => {
        state.loading = false;
        state.news.unshift(action.payload);
        state.currentNews = action.payload;
      })
      .addCase(createNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update News
      .addCase(updateNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateNews.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.news.findIndex(news => news.id === action.payload.id);
        if (index !== -1) {
          state.news[index] = action.payload;
        }
        state.currentNews = action.payload;
      })
      .addCase(updateNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Delete News
      .addCase(deleteNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteNews.fulfilled, (state, action) => {
        state.loading = false;
        state.news = state.news.filter(news => news.id !== action.payload);
        if (state.currentNews?.id === action.payload) {
          state.currentNews = null;
        }
      })
      .addCase(deleteNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearCurrentNews } = newsSlice.actions;
export default newsSlice.reducer;