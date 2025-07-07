import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// ✅ Backend formatına uygun interface
export interface Employee {
  id?: number;
  firstName: string;      // Backend'den firstName geliyor
  lastName: string;       // Backend'den lastName geliyor
  email: string;
  phoneNumber: string;    // Backend'den phoneNumber geliyor
  position?: string;      // Backend'de bu field var mı kontrol edin
  department?: string;    // Backend'de bu field var mı kontrol edin
  departmentName?: string; // Component'te kullanılıyor
  startDate?: string;     // Backend'de bu field var mı kontrol edin
  dateOfJoining?: string; // Component'te kullanılıyor
  jobTitle?: string;
}

// State type
interface EmployeeState {
  employees: Employee[];
  loading: boolean;
  error: string | null;
}

const initialState: EmployeeState = {
  employees: [],
  loading: false,
  error: null,
};

// API instance
const api = axios.create({
  baseURL: '/api', // Use proxy instead of direct backend URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// ✅ Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    // Get token from sessionStorage (same as in authSlice)
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔑 Adding token to request:', {
        url: config.url,
        hasToken: !!token,
        tokenPreview: token.substring(0, 20) + '...'
      });
    } else {
      console.warn('⚠️ No token found in sessionStorage');
    }
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// ✅ Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response successful:', {
      url: response.config.url,
      status: response.status,
      dataLength: response.data?.length || 'N/A'
    });
    return response;
  },
  (error) => {
    console.error('❌ API Response error:', {
      url: error.config?.url,
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.response?.data?.message || error.message,
      data: error.response?.data
    });
    
    // If 401 Unauthorized, token might be expired
    if (error.response?.status === 401) {
      console.warn('🚨 Authentication failed - token might be expired');
      // Optional: Clear invalid token
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('userType');
    }
    
    return Promise.reject(error);
  }
);

// ✅ Test function to check backend connection
export const testBackendConnection = createAsyncThunk(
  'employees/testConnection',
  async (_, { rejectWithValue }) => {
    try {
      console.log('🔄 Testing backend connection...');
      
      // Test if token exists
      const token = sessionStorage.getItem('token');
      console.log('🔑 Token exists:', !!token);
      if (token) {
        console.log('🔑 Token preview:', token.substring(0, 30) + '...');
      }
      
      // Try a simple request first
      const response = await api.get('/test');
      console.log('✅ Backend connection test successful:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Backend connection test failed:', error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Çalışanları çek
export const fetchEmployees = createAsyncThunk(
  'employees/fetchEmployees',
  async (_, { rejectWithValue }) => {
    try {
      console.log('🔄 Fetching employees...');
      console.log('🔗 Full URL will be: /api/employee (proxied to http://localhost:8080/employee)');
      
      const response = await api.get<Employee[]>('/employee');
      console.log('✅ Employees fetched:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Fetch employees error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url,
        headers: error.config?.headers
      });
      
      let errorMessage = 'Çalışanlar yüklenemedi';
      if (error.response?.status === 401) {
        errorMessage = 'Yetkilendirme hatası - tekrar giriş yapın';
      } else if (error.response?.status === 403) {
        errorMessage = 'Bu işlem için yetkiniz yok';
      } else if (error.response?.status === 404) {
        errorMessage = 'Endpoint bulunamadı';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      return rejectWithValue(errorMessage);
    }
  }
);

// Slice
const employeeSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Employees
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = employeeSlice.actions;
export default employeeSlice.reducer;