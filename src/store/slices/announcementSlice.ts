import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Announcement type
export interface Announcement {
  id?: number;
  title: string;
  content: string;
  type: string;
  createdBy?: number;
  created_at?: string;
  updated_at?: string;
}

// State type
interface AnnouncementState {
  announcements: Announcement[];
  loading: boolean;
  error: string | null;
}

const initialState: AnnouncementState = {
  announcements: [],
  loading: false,
  error: null,
};

// API instance
const api = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 30000,
});

// Async thunks
export const fetchAnnouncements = createAsyncThunk(
  'announcements/fetchAnnouncements',
  async (_, { rejectWithValue }) => {
    try {
      console.log('🔄 Fetching announcements...');
      const response = await api.get<Announcement[]>('/announcements');
      console.log('✅ Announcements fetched:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Fetch announcements error:', error);
      return rejectWithValue(error.response?.data?.message || error.message || 'Duyurular yüklenemedi');
    }
  }
);

// Slice
const announcementSlice = createSlice({
  name: 'announcements',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnnouncements.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnnouncements.fulfilled, (state, action) => {
        state.loading = false;
        state.announcements = action.payload;
      })
      .addCase(fetchAnnouncements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = announcementSlice.actions;
export default announcementSlice.reducer;