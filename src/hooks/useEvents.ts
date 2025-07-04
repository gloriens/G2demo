import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

// Event tipini JSON Server yapısına göre güncelle
interface Event {
  id?: number;
  title: string;
  description: string;
  event_type: string;
  max_participants: number;
  status: string;
  cover_image?: string;
  start_time: string;
  end_time: string;
  location: string;
  isApproved: boolean;
  created_by: number;
  created_at?: string;
}

// Axios instance oluştur
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URLx  || "http://localhost:8080",
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Custom hook
export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // 📖 Tüm etkinlikleri getir
  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get<Event[]>('/events');
      console.log('Fetched events:', typeof response.data, response.data);
      setEvents(response.data);
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message || 'Ağ hatası'
        : 'Beklenmeyen bir hata oluştu';
      
      setError(errorMessage);
      toast({
        title: "Hata",
        description: `Etkinlik verileri alınırken bir hata oluştu: ${errorMessage}`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // ➕ Yeni etkinlik ekle
  const createEvent = useCallback(async (eventData: Omit<Event, 'id' | 'created_at'>) => {
    try {
      const response = await api.post<Event>('/events', {
        ...eventData,
        created_at: new Date().toISOString()
      });

      setEvents(prev => [...prev, response.data]);
      
      toast({
        title: "Başarılı",
        description: "Etkinlik başarıyla oluşturuldu",
        variant: "default"
      });

      return response.data;
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message || 'Etkinlik oluşturulamadı'
        : 'Beklenmeyen bir hata oluştu';

      toast({
        title: "Hata",
        description: errorMessage,
        variant: "destructive"
      });

      throw error;
    }
  }, [toast]);

  // ✏️ Etkinlik güncelle
  const updateEvent = useCallback(async (id: number, eventData: Partial<Event>) => {
    try {
      const response = await api.patch<Event>(`/events/${id}`, eventData);
      
      setEvents(prev => prev.map(event => 
        event.id === id ? response.data : event
      ));

      toast({
        title: "Başarılı",
        description: "Etkinlik başarıyla güncellendi",
        variant: "default"
      });

      return response.data;
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message || 'Etkinlik güncellenemedi'
        : 'Beklenmeyen bir hata oluştu';

      toast({
        title: "Hata",
        description: errorMessage,
        variant: "destructive"
      });

      throw error;
    }
  }, [toast]);

  // 🗑️ Etkinlik sil
  const deleteEvent = useCallback(async (id: number) => {
    try {
      await api.delete(`/events/${id}`);
      
      setEvents(prev => prev.filter(event => event.id !== id));

      toast({
        title: "Başarılı",
        description: "Etkinlik başarıyla silindi",
        variant: "destructive"
      });
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message || 'Etkinlik silinemedi'
        : 'Beklenmeyen bir hata oluştu';

      toast({
        title: "Hata",
        description: errorMessage,
        variant: "destructive"
      });

      throw error;
    }
  }, [toast]);

  // ✅ Etkinlik onayla - PUT ile güncelle
const approveEvent = useCallback(async (id: number) => {
  try {
    // Önce mevcut etkinlik verilerini al
    const currentEvent = events.find(event => event.id === id);
    
    if (!currentEvent) {
      throw new Error('Etkinlik bulunamadı');
    }

    // Tüm veriyi PUT ile gönder
    const response = await api.put<Event>(`/events/${id}`, {
      ...currentEvent,
      isApproved: true,
      status: 'active'
    });

    setEvents(prev => prev.map(event => 
      event.id === id ? response.data : event
    ));

    toast({
      title: "Başarılı",
      description: "Etkinlik başarıyla onaylandı",
      variant: "default"
    });

    return response.data;
  } catch (error) {
    const errorMessage = axios.isAxiosError(error)
      ? error.response?.data?.message || 'Etkinlik onaylanamadı'
      : 'Beklenmeyen bir hata oluştu';

    toast({
      title: "Hata",
      description: errorMessage,
      variant: "destructive"
    });

    throw error;
  }
}, [events, toast]);

  // 🔍 Belirli etkinlik getir
  const getEventById = useCallback(async (id: number) => {
    try {
      const response = await api.get<Event>(`/events/${id}`);
      return response.data;
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message || 'Etkinlik bulunamadı'
        : 'Beklenmeyen bir hata oluştu';

      toast({
        title: "Hata",
        description: errorMessage,
        variant: "destructive"
      });

      throw error;
    }
  }, [toast]);

  // 🔄 Verileri yenile
  const refetchEvents = useCallback(() => {
    fetchEvents();
  }, [fetchEvents]);

  // 📊 Computed değerler
  const eventStats = {
    total: events.length,
    active: events.filter(e => e.status === 'active').length,
    pending: events.filter(e => !e.is_approved).length,
    approved: events.filter(e => e.is_approved).length,
  };

  // Component mount olduğunda fetch et
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return {
    // Data
    events,
    loading,
    error,
    eventStats,
    
    // Actions
    createEvent,
    updateEvent,
    deleteEvent,
    approveEvent,
    getEventById,
    refetchEvents,
    
    // Utils
    setEvents,
  };
};

// Export event tipini de
export type { Event };