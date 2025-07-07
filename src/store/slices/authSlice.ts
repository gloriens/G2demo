import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  userType: 'employee' | 'hr' | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  department?: string;
}

// ✅ Güvenli storage helper'ları
const secureStorage = {
  setItem: (key: string, value: string) => {
    try {
      // ✅ SessionStorage kullan (tab kapandığında kaybolur)
      sessionStorage.setItem(key, value);
      
      // ✅ Alternatif: Encrypted localStorage
      // const encrypted = btoa(value); // Basit encryption
      // localStorage.setItem(key, encrypted);
    } catch (error) {
      console.error('Storage error:', error);
    }
  },
  
  getItem: (key: string): string | null => {
    try {
      return sessionStorage.getItem(key);
      
      // ✅ Alternatif: Encrypted localStorage
      // const encrypted = localStorage.getItem(key);
      // return encrypted ? atob(encrypted) : null;
    } catch (error) {
      console.error('Storage error:', error);
      return null;
    }
  },
  
  removeItem: (key: string) => {
    try {
      sessionStorage.removeItem(key);
      // localStorage.removeItem(key);
    } catch (error) {
      console.error('Storage error:', error);
    }
  }
};

// ✅ Initial state - storage'dan oku
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  userType: null,
  token: secureStorage.getItem('token'),
  loading: false,
  error: null,
};

// ✅ Login thunk
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      console.log('🔄 Logging in user:', credentials.email);
      
      const response = await axios.post('http://localhost:8080/auth/login', credentials);
      
      const { token, user, userType } = response.data;
      
      // ✅ Güvenli storage'a kaydet
      secureStorage.setItem('token', token);
      secureStorage.setItem('user', JSON.stringify(user));
      secureStorage.setItem('userType', userType);
      
      // ✅ Axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      console.log('✅ Login successful:', { user, userType });
      
      return { token, user, userType };
    } catch (error: any) {
      console.error('❌ Login error:', error);
      
      let errorMessage = 'Giriş başarısız';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      return rejectWithValue(errorMessage);
    }
  }
);

// ✅ Logout thunk
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      // ✅ Backend'e logout request
      await axios.post('http://localhost:8080/auth/logout');
      
      // ✅ Storage'ı temizle
      secureStorage.removeItem('token');
      secureStorage.removeItem('user');
      secureStorage.removeItem('userType');
      
      // ✅ Axios header'ını temizle
      delete axios.defaults.headers.common['Authorization'];
      
      return true;
    } catch (error) {
      // ✅ Hata olsa bile frontend'i temizle
      secureStorage.removeItem('token');
      secureStorage.removeItem('user');
      secureStorage.removeItem('userType');
      delete axios.defaults.headers.common['Authorization'];
      
      return true;
    }
  }
);

// ✅ Token verify thunk
export const verifyToken = createAsyncThunk(
  'auth/verifyToken',
  async (_, { rejectWithValue }) => {
    try {
      const token = secureStorage.getItem('token');
      const userString = secureStorage.getItem('user');
      const userType = secureStorage.getItem('userType') as 'employee' | 'hr' | null;
      
      if (!token || !userString) {
        return rejectWithValue('Token bulunamadı');
      }
      
      // ✅ Backend'te token verify
      const response = await axios.get('http://localhost:8080/auth/verify', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const user = JSON.parse(userString);
      
      // ✅ Axios header'ını ayarla
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      return { token, user, userType };
    } catch (error) {
      // ✅ Invalid token ise temizle
      secureStorage.removeItem('token');
      secureStorage.removeItem('user');
      secureStorage.removeItem('userType');
      delete axios.defaults.headers.common['Authorization'];
      
      return rejectWithValue('Token geçersiz');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    forceLogout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.userType = null;
      state.token = null;
      secureStorage.removeItem('token');
      secureStorage.removeItem('user');
      secureStorage.removeItem('userType');
      delete axios.defaults.headers.common['Authorization'];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.userType = action.payload.userType;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.userType = null;
        state.token = null;
        state.error = action.payload as string;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.userType = null;
        state.token = null;
        state.loading = false;
        state.error = null;
      })
      .addCase(verifyToken.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.userType = action.payload.userType;
        state.token = action.payload.token;
        state.loading = false;
        state.error = null;
      });
  }
});

export const { clearError, forceLogout } = authSlice.actions;
export default authSlice.reducer;