import { useEffect, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { PartyPopper, Plus, Calendar, MapPin, Clock, Users, Check, X, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Link } from "react-router-dom";

// Redux imports
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchEvents,
  updateEvent,
  clearError,
  deleteEvent,
  type Event
} from "../store/slices/eventsSlice";

const Events = () => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  
  // Redux state selectors
  const events = useAppSelector((state) => state.events.events) || []; // Ensure it's always an array
  const loading = useAppSelector((state) => state.events.loading);
  const error = useAppSelector((state) => state.events.error);
  const userType = useAppSelector((state) => state.auth.userType); // Get user type for permissions

  console.log('🔍 Events component render:', { 
    eventsLength: events.length, 
    loading, 
    error,
    userType,
    eventsType: typeof events,
    isArray: Array.isArray(events)
  });

  // Local state
  const [activeTab, setActiveTab] = useState("all");
  const [deleteDialog, setDeleteDialog] = useState({ open: false, eventId: 0, eventTitle: "" });

  // Component mount - veri çek
  useEffect(() => {
    console.log('🔄 Events component mounted, fetching data...');
    console.log('🔍 Current events state:', { events, loading, error });
    dispatch(fetchEvents());
  }, [dispatch]);

  // Debug state changes
  useEffect(() => {
    console.log('🔍 Events state changed:', { 
      eventsLength: events?.length || 0, 
      loading, 
      error,
      eventsArray: events 
    });
  }, [events, loading, error]);

  // Error handling
  useEffect(() => {
    if (error) {
      console.error('❌ Events component error:', error);
      toast({
        title: "Hata",
        description: error,
        variant: "destructive"
      });
      dispatch(clearError());
    }
  }, [error, toast, dispatch]);

  // Event handlers
  const handleApproveEvent = async (id: number, title: string) => {
    try {
      console.log('🔄 Approving event:', id);
      
      // Redux action ile event'i onayla
      const result = await dispatch(updateEvent({ 
        id, 
        data: { 
          isApproved: true, 
          status: 'Aktif' 
        } 
      })).unwrap();

      console.log('✅ Event approved:', result);
      
      toast({
        title: "Başarılı",
        description: `${title} etkinliği onaylandı`,
        variant: "default"
      });
    } catch (error: any) {
      console.error('❌ Approve error:', error);
      toast({
        title: "Hata",
        description: error.message || "Etkinlik onaylanırken bir hata oluştu",
        variant: "destructive"
      });
    }
  };

  const handleRejectEvent = async (id: number, title: string) => {
    try {
      // TODO: deleteEvent action'ını da ekleyeceğiz
      console.log('🔄 Rejecting event:', id);

      await dispatch(updateEvent({
        id,
        data:{
          isApproved: null,
          status: 'Red'
        }
      })).unwrap();
      
      toast({
        title: "Başarılı",
        description: `${title} etkinliği reddedildi`,
        variant: "default"
      });
    } catch (error: any) {
      toast({
        title: "Hata",
        description: "Etkinlik reddedilirken bir hata oluştu",
        variant: "destructive"
      });
    }
  };

  const handleDeleteEvent = (id: number, title: string) => {
    setDeleteDialog({ open: true, eventId: id, eventTitle: title });
  };

  const confirmDeleteEvent = async () => {
    try {
      // TODO: deleteEvent action'ını ekleyeceğiz
      console.log('🔄 Deleting event:', deleteDialog.eventId);
      
      await dispatch(deleteEvent(deleteDialog.eventId)).unwrap();
      
      toast({
        title: "Başarılı",
        description: `${deleteDialog.eventTitle} silindi`,
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Hata",
        description: "Etkinlik silinirken bir hata oluştu",
        variant: "destructive"
      });
    } finally {
      setDeleteDialog({ open: false, eventId: 0, eventTitle: "" });
    }
  };

  // Helper functions
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Aktif': return 'bg-green-100 text-green-800 border-green-200';
      case 'Yaklaşan': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Tamamlanan': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Bekliyor': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Red' : return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryColor = (eventType: string) => {
    switch(eventType) {
      case 'Seminar': return 'bg-blue-100 text-blue-800';
      case 'Workshop': return 'bg-purple-100 text-purple-800';
      case 'Meeting': return 'bg-green-100 text-green-800';
      case 'Training': return 'bg-orange-100 text-orange-800';
      case 'Social': return 'bg-pink-100 text-pink-800';
      case 'Company': return 'bg-indigo-100 text-indigo-800';
      case 'Celebration': return 'bg-yellow-100 text-yellow-800';
      case 'Other': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString('tr-TR', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  // Filtered events
  const filteredEvents = events.filter(event => {
    if (activeTab === "pending") return !event.isApproved;
    if (activeTab === "approved") return event.isApproved;
    if (activeTab === "rejected") return event.status === 'Red';
    return true;
  });

  const pendingEvents = events.filter(event => !event.isApproved);

  console.log('🎯 About to render Events component main UI');

  // Loading state
  if (loading && events.length === 0) {
    console.log('🔄 Showing loading state');
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <div className="text-gray-600">Etkinlikler yükleniyor...</div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Critical error state
  if (error && !loading) {
    console.log('❌ Showing error state:', error);
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="text-red-600 text-center">
                <h3 className="text-xl font-semibold mb-2">Hata</h3>
                <p>{error}</p>
                <button 
                  onClick={() => {
                    dispatch(clearError());
                    dispatch(fetchEvents());
                  }}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  Tekrar Dene
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    Etkinlikler
                    {loading && (
                      <span className="ml-2 text-sm text-gray-500">(Yükleniyor...)</span>
                    )}
                  </h2>
                  <p className="text-gray-600">Şirket etkinliklerini yönetin ve takip edin</p>
                </div>
                {/* Only show Add Event button for HR users */}
                {userType === 'hr' && (
                  <Link 
                    to="/add-event"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors"
                  >
                    <Plus className="h-5 w-5" />
                    <span>Yeni Etkinlik</span>
                  </Link>
                )}
                {/* Show info message for employees */}
                {userType === 'employee' && (
                  <div className="text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-lg">
                    💡 Sadece İK personeli etkinlik oluşturabilir
                  </div>
                )}
              </div>
            </div>

            {/* Tabs */}
            <div className="mb-8">
              <div className="flex space-x-4 border-b border-gray-200">
                <button 
                  onClick={() => setActiveTab("all")}
                  className={`pb-2 px-4 font-medium ${activeTab === "all" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"}`}
                >
                  Tüm Etkinlikler ({events.length})
                </button>
                <button 
                  onClick={() => setActiveTab("pending")}
                  className={`pb-2 px-4 font-medium ${activeTab === "pending" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"}`}
                >
                  Onay Bekleyen ({pendingEvents.length})
                </button>
                <button 
                  onClick={() => setActiveTab("approved")}
                  className={`pb-2 px-4 font-medium ${activeTab === "approved" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"}`}
                >
                  Onaylanmış ({events.filter(e => e.isApproved).length})
                </button>
                <button 
                  onClick={() => setActiveTab("rejected")}
                  className={`pb-2 px-4 font-medium ${activeTab === "rejected" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"}`}
                >
                  Red Edilmiş ({events.filter(e => e.status=='Red').length})
                </button>
              </div>
            </div>

            {/* Event Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <PartyPopper className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{events.length}</p>
                    <p className="text-gray-600 text-sm">Toplam Etkinlik</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-green-100 rounded-full">
                    <Calendar className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{events.filter(e => e.status === 'Aktif').length}</p>
                    <p className="text-gray-600 text-sm">Aktif Etkinlik</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-orange-100 rounded-full">
                    <Clock className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{events.filter(e => e.status === 'Red').length}</p>
                    <p className="text-gray-600 text-sm">Red Edilen</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-yellow-100 rounded-full">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{pendingEvents.length}</p>
                    <p className="text-gray-600 text-sm">Onay Bekleyen</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Empty State */}
            {events.length === 0 && !loading && (
              <div className="text-center py-12">
                <PartyPopper className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">Henüz etkinlik yok</h3>
                <p className="text-gray-500 mb-6">İlk etkinliğinizi oluşturmak için başlayın</p>
                {userType === 'hr' ? (
                  <Link 
                    to="/add-event"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold inline-flex items-center space-x-2"
                  >
                    <Plus className="h-5 w-5" />
                    <span>İlk Etkinliği Oluştur</span>
                  </Link>
                ) : (
                  <div className="text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-lg inline-block">
                    💡 Sadece İK personeli etkinlik oluşturabilir
                  </div>
                )}
              </div>
            )}

            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Filtered Empty State */}
              {filteredEvents.length === 0 && events.length > 0 && (
                <div className="col-span-3 text-center py-12">
                  <Clock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">
                    {activeTab === "pending" && "Onay Bekleyen Etkinlik Yok"}
                    {activeTab === "approved" && "Onaylanmış Etkinlik Yok"}
                    {activeTab === "rejected" && "Reddedilmiş Etkinlik Yok"}
                    {activeTab === "all" && "Hiç Etkinlik Yok"}
                  </h3>
                  <p className="text-gray-500 mb-6">
                    {activeTab === "pending" && "Şu anda onay bekleyen etkinlik bulunmuyor"}
                    {activeTab === "approved" && "Şu anda onaylanmış etkinlik bulunmuyor"}
                    {activeTab === "rejected" && "Şu anda reddedilmiş etkinlik bulunmuyor"}
                    {activeTab === "all" && "Filtreye uygun etkinlik bulunamadı"}
                  </p>
                  {userType === 'hr' ? (
                    <Link 
                      to="/add-event"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold inline-flex items-center space-x-2"
                    >
                      <Plus className="h-5 w-5" />
                      <span>Yeni Etkinlik Oluştur</span>
                    </Link>
                  ) : (
                    <div className="text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-lg">
                      💡 Sadece İK personeli etkinlik oluşturabilir
                    </div>
                  )}
                </div>
              )}

              {/* Events List */}
              {filteredEvents.map((event) => (
                <div key={event.id} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(event.eventType)}`}>
                        {event.eventType}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(event.status)}`}>
                        {event.status}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{event.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{formatDate(event.startTime)} • {formatTime(event.startTime)}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>{formatDate(event.endTime)} • {formatTime(event.endTime)}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="h-4 w-4 mr-2" />
                        <span>Max {event.maxParticipants} katılımcı</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                    {!event.isApproved ? (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Onay Bekliyor</span>
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleApproveEvent(event.id!, event.title)}
                            disabled={loading}
                            className="flex items-center px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm disabled:opacity-50"
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Onayla
                          </button>
                          
                          {/* Reddet veya Sil butonu */}
                          {event.status === 'Red' ? (
                            <button 
                              onClick={() => handleDeleteEvent(event.id!, event.title)}
                              disabled={loading}
                              className="flex items-center px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm disabled:opacity-50"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Sil
                            </button>
                          ) : (
                            <button 
                              onClick={() => handleRejectEvent(event.id!, event.title)}
                              disabled={loading}
                              className="flex items-center px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm disabled:opacity-50"
                            >
                              <X className="h-4 w-4 mr-1" />
                              Reddet
                            </button>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-end">
                        {/* <button className="text-blue-600 hover:text-blue-800 font-medium">Detaylar</button> */}
                        <div className="flex items-center space-x-2">
                          <Link 
                            to={`/edit-event/${event.id}`}
                            className="flex items-center text-gray-600 hover:text-gray-800"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Düzenle
                          </Link>
                          <button 
                            onClick={() => handleDeleteEvent(event.id!, event.title)}
                            className="flex items-center text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Sil
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}
        title="Etkinliği Sil"
        description={`${deleteDialog.eventTitle} etkinliğini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`}
        onConfirm={confirmDeleteEvent}
        confirmText="Sil"
        cancelText="İptal"
        variant="destructive"
      />
    </div>
  );
};

export default Events;