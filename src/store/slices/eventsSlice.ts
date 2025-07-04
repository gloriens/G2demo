import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Event type
export interface Event {
  id?: number;
  title: string;
  description: string;
  event_type: string;      // eventType yerine event_type
  max_participants: number; // maxParticipants yerine max_participants
  status: string;
  cover_image?: string;    // coverImage yerine cover_image
  start_time: string;      // startTime yerine start_time
  end_time: string;        // endTime yerine end_time
  location: string;
  is_approved: boolean;    // isApproved yerine is_approved
  created_by: number;      // Yeni eklendi
  created_at?: string;     // createdAt yerine created_at
}

// State type
interface EventsState {
  events: Event[];
  currentEvent: Event | null;
  loading: boolean;
  error: string | null;
}

const initialState: EventsState = {
  events: [],
  currentEvent: null,
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

// Async thunks
export const fetchEvents = createAsyncThunk(
  'events/fetchEvents',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<Event[]>('/events');
      
      // 204 (No Content) durumunu handle et
      if (response.status === 204 || !response.data) {
        console.log('📭 No events found (204 or empty response)');
        return []; // Boş array döndür
      }
      
      console.log('✅ Events fetched:', response.data);
      return response.data;
    } catch (error: any) {
      // 404 veya başka hatalar için
      if (error.response?.status === 404) {
        console.log('📭 No events endpoint found, returning empty array');
        return [];
      }
      
      console.error('❌ Fetch events error:', error);
      return rejectWithValue(error.message || 'Etkinlikler yüklenemedi');
    }
  }
);

// Tek bir event'i getiren thunk
export const fetchEventById = createAsyncThunk(
  'events/fetchEventById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await api.get<Event>(`/events/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Etkinlik yüklenemedi');
    }
  }
);

export const updateEvent = createAsyncThunk(
  'events/updateEvent',
  async ({ id, data }: { id: number; data: Partial<Event> }, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { events: EventsState };
      const currentEvent = state.events.events.find(event => event.id === id);
      
      console.log('🔄 Current event data:', currentEvent);
      console.log('🔄 Updating event:', id, 'with data:', data);
      if (!currentEvent) {
        return rejectWithValue('Etkinlik verisi bulunamadı');
      }

      const updatedData = { ...currentEvent, ...data };
      const response = await api.put<Event>(`/events/${id}`, updatedData);
      return response.data;
    } catch (error: any) {  
      return rejectWithValue(error.message || 'Etkinlik güncellenemedi');
    }
  }
);

export const deleteEvent = createAsyncThunk(
  'events/deleteEvent',
  async (id: number, { rejectWithValue }) => {
    try {
      console.log('🔄 Deleting event from API:', id);
      
      await api.delete(`/events/${id}`);
      console.log('✅ Event deleted from API:', id);
      
      return id; // Silinen event'in ID'sini döndür
    } catch (error: any) {
      console.error('❌ Delete error:', error);
      return rejectWithValue(error.message || 'Etkinlik silinemedi');
    }
  }
);

export const createEvent = createAsyncThunk(
  'events/createEvent',
  async (eventData: Omit<Event, 'id' | 'createdAt'>, { rejectWithValue }) => {
    try {
      console.log('🔄 Creating new event:', eventData);
      
      const response = await api.post<Event>('/events', eventData);
      console.log('✅ Event created:', response.data);
      
      return response.data;
    } catch (error: any) {
      console.error('❌ Create event error:', error);
      return rejectWithValue(error.message || 'Etkinlik oluşturulamadı');
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
        state.events = action.payload;
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

export const { clearError, clearCurrentEvent } = eventsSlice.actions;
export default eventsSlice.reducer;