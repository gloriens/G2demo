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
  startDate?: string;     // Backend'de bu field var mı kontrol edin
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
  baseURL: 'http://localhost:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Çalışanları çek
export const fetchEmployees = createAsyncThunk(
  'employees/fetchEmployees',
  async (_, { rejectWithValue }) => {
    try {
      console.log('🔄 Fetching employees...');
      const response = await api.get<Employee[]>('/employees');
      console.log('✅ Employees fetched:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Fetch employees error:', error);
      return rejectWithValue(error.response?.data?.message || error.message || 'Çalışanlar yüklenemedi');
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