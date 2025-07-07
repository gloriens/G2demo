import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// User type
export interface User {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  birthDate?: string;
  department?: string;
  position?: string;
  phoneNumber?: string;
  created_at?: string;
}

// State type
interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
};

// API instance
const api = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 30000,
});

// Async thunks
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      console.log('🔄 Fetching users...');
      const response = await api.get<User[]>('/users');
      console.log('✅ Users fetched:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Fetch users error:', error);
      return rejectWithValue(error.response?.data?.message || error.message || 'Kullanıcılar yüklenemedi');
    }
  }
);

// Slice
const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer;