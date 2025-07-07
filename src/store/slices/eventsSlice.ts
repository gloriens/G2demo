import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Event type - Fixed to match frontend usage
export interface Event {
  id?: number;
  title: string;
  description: string;
  eventType: string;       // Used in frontend
  maxParticipants: number; // Used in frontend  
  status: string;
  coverImage?: string;     // Used in frontend
  startTime: string;       // Used in frontend
  endTime: string;         // Used in frontend
  location: string;
  isApproved: boolean;     // Used in frontend
  createdBy?: number;       
  createdAt?: string;      
}

// State type
interface EventsState {
  events: Event[];
  currentEvent: Event | null;
  loading: boolean;
  error: string | null;
}

const initialState: EventsState = {
  events: [], // Ensure it's always an array
  currentEvent: null,
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
      console.log('🔑 Adding token to events request:', {
        url: config.url,
        hasToken: !!token,
        tokenPreview: token.substring(0, 20) + '...'
      });
    } else {
      console.warn('⚠️ No token found in sessionStorage for events');
    }
    return config;
  },
  (error) => {
    console.error('❌ Events request interceptor error:', error);
    return Promise.reject(error);
  }
);

// ✅ Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => {
    console.log('✅ Events API Response successful:', {
      url: response.config.url,
      status: response.status,
      dataLength: response.data?.length || 'N/A'
    });
    return response;
  },
  (error) => {
    console.error('❌ Events API Response error:', {
      url: error.config?.url,
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.response?.data?.message || error.message,
      data: error.response?.data
    });
    
    // If 401 Unauthorized, token might be expired
    if (error.response?.status === 401) {
      console.warn('🚨 Events authentication failed - token might be expired');
    }
    
    return Promise.reject(error);
  }
);

// Async thunks
export const fetchEvents = createAsyncThunk(
  'events/fetchEvents',
  async (_, { rejectWithValue }) => {
    try {
      console.log('🔄 Fetching events...');
      console.log('🔗 Full URL will be: /api/events (proxied to http://localhost:8080/events)');
      
      const response = await api.get<Event[]>('/events');
      
      // 204 (No Content) durumunu handle et
      if (response.status === 204 || !response.data) {
        console.log('📭 No events found (204 or empty response)');
        return []; // Boş array döndür
      }
      
      console.log('✅ Events fetched:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Fetch events error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url,
        headers: error.config?.headers
      });
      
      // 404 veya başka hatalar için
      if (error.response?.status === 404) {
        console.log('📭 No events endpoint found, returning empty array');
        return [];
      }
      
      let errorMessage = 'Etkinlikler yüklenemedi';
      if (error.response?.status === 401) {
        errorMessage = 'Yetkilendirme hatası - tekrar giriş yapın';
      } else if (error.response?.status === 403) {
        errorMessage = 'Bu işlem için yetkiniz yok';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      return rejectWithValue(errorMessage);
    }
  }
);

// Tek bir event'i getiren thunk
export const fetchEventById = createAsyncThunk(
  'events/fetchEventById',
  async (id: number, { rejectWithValue }) => {
    try {
      console.log('🔄 Fetching event by ID:', id);
      console.log('🔗 Full URL will be: /api/events/' + id);
      
      const response = await api.get<Event>(`/events/${id}`);
      console.log('✅ Event fetched by ID:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Fetch event by ID error details:', {
        id,
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url
      });
      
      let errorMessage = 'Etkinlik yüklenemedi';
      if (error.response?.status === 401) {
        errorMessage = 'Yetkilendirme hatası - tekrar giriş yapın';
      } else if (error.response?.status === 403) {
        errorMessage = 'Bu işlem için yetkiniz yok';
      } else if (error.response?.status === 404) {
        errorMessage = 'Etkinlik bulunamadı';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateEvent = createAsyncThunk(
  'events/updateEvent',
  async ({ id, data }: { id: number; data: Partial<Event> }, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { events: EventsState };
      const currentEvent = state.events.events.find(event => event.id === id);
      
      console.log('🔄 Updating event:', id, 'with data:', data);
      console.log('🔍 Current event data:', currentEvent);
      console.log('� Full URL will be: /api/events/' + id);
      
      if (!currentEvent) {
        console.warn('⚠️ Event not found in state:', id);
        return rejectWithValue('Etkinlik verisi bulunamadı');
      }

      const updatedData = { ...currentEvent, ...data };
      console.log('📤 Sending updated data:', updatedData);
      
      const response = await api.put<Event>(`/events/${id}`, updatedData);
      console.log('✅ Event updated successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Update event error details:', {
        id,
        data,
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        responseData: error.response?.data,
        url: error.config?.url
      });
      
      let errorMessage = 'Etkinlik güncellenemedi';
      if (error.response?.status === 401) {
        errorMessage = 'Yetkilendirme hatası - tekrar giriş yapın';
      } else if (error.response?.status === 403) {
        errorMessage = 'Bu işlem için yetkiniz yok';
      } else if (error.response?.status === 404) {
        errorMessage = 'Etkinlik bulunamadı';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteEvent = createAsyncThunk(
  'events/deleteEvent',
  async (id: number, { rejectWithValue }) => {
    try {
      console.log('🔄 Deleting event:', id);
      console.log('🔗 Full URL will be: /api/events/' + id);
      
      await api.delete(`/events/${id}`);
      console.log('✅ Event deleted successfully from API:', id);
      
      return id; // Silinen event'in ID'sini döndür
    } catch (error: any) {
      console.error('❌ Delete event error details:', {
        id,
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url
      });
      
      let errorMessage = 'Etkinlik silinemedi';
      if (error.response?.status === 401) {
        errorMessage = 'Yetkilendirme hatası - tekrar giriş yapın';
      } else if (error.response?.status === 403) {
        errorMessage = 'Bu işlem için yetkiniz yok';
      } else if (error.response?.status === 404) {
        errorMessage = 'Etkinlik bulunamadı';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      return rejectWithValue(errorMessage);
    }
  }
);

export const createEvent = createAsyncThunk(
  'events/createEvent',
  async (eventData: Omit<Event, 'id' | 'createdAt'>, { rejectWithValue }) => {
    try {
      console.log('🔄 Creating new event:', eventData);
      console.log('🔗 Full URL will be: /api/events');
      
      const response = await api.post<Event>('/events', eventData);
      console.log('✅ Event created successfully:', response.data);
      
      return response.data;
    } catch (error: any) {
      console.error('❌ Create event error details:', {
        eventData,
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url
      });
      
      let errorMessage = 'Etkinlik oluşturulamadı';
      if (error.response?.status === 401) {
        errorMessage = 'Yetkilendirme hatası - tekrar giriş yapın';
      } else if (error.response?.status === 403) {
        const currentUserType = sessionStorage.getItem('userType');
        const currentUser = JSON.parse(sessionStorage.getItem('user') || '{}');
        console.log('🔍 Permission denied details:', {
          userType: currentUserType,
          userRole: currentUser.role,
          requiredPermission: 'CREATE_EVENT'
        });
        errorMessage = 'Bu işlem için yetkiniz yok. Etkinlik oluşturmak için HR yetkisi gereklidir.';
      } else if (error.response?.status === 400) {
        errorMessage = 'Geçersiz etkinlik verisi';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      return rejectWithValue(errorMessage);
    }
  }
);

// Slice
const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentEvent: (state) => {
      state.currentEvent = null;
    },
    resetEvents: (state) => {
      state.events = [];
      state.currentEvent = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Events
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = Array.isArray(action.payload) ? action.payload : [];
        state.error = null;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch Event By ID
      .addCase(fetchEventById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEventById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentEvent = action.payload;
      })
      .addCase(fetchEventById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update Event
      .addCase(updateEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.currentEvent = action.payload;
        // Update in events list
        const index = state.events.findIndex(event => event.id === action.payload.id);
        if (index !== -1) {
          state.events[index] = action.payload;
        }
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Delete Event
      .addCase(deleteEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.loading = false;
        // Event'i listeden çıkar
        state.events = state.events.filter(event => event.id !== action.payload);
        // Eğer currentEvent silinmişse temizle
        if (state.currentEvent?.id === action.payload) {
          state.currentEvent = null;
        }
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Create Event
      .addCase(createEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.events.push(action.payload);
        state.currentEvent = action.payload;
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearCurrentEvent, resetEvents } = eventsSlice.actions;
export default eventsSlice.reducer;