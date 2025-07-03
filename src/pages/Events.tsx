import { useEffect, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { PartyPopper, Plus, Calendar, MapPin, Clock, Users, Check, X, Edit, Trash2, Axis3DIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Link } from "react-router-dom";

import { useEvents } from "../hooks/useEvents"; 

const Events = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [deleteDialog, setDeleteDialog] = useState({ open: false, eventId: 0, eventTitle: "" });
  const { toast } = useToast();

  const { 
    events, 
    loading, 
    error, 
    eventStats, 
    deleteEvent, 
    approveEvent 
  } = useEvents();


  const handleApproveEvent = async (id: number, title: string) => {
    try {
      await approveEvent(id);
    } catch (error) {
    }
  };

  const handleRejectEvent = async (id: number, title: string) => {
    try {
      await deleteEvent(id);
    } catch (error) {
 
    }
  };

  const handleDeleteEvent = (id: number, title: string) => {
    setDeleteDialog({ open: true, eventId: id, eventTitle: title });
  };

  const confirmDeleteEvent = async () => {
    try {
      await deleteEvent(deleteDialog.eventId);
    } catch (error) {
      // Error zaten hook içinde handle ediliyor
    } finally {
      setDeleteDialog({ open: false, eventId: 0, eventTitle: "" });
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Aktif': return 'bg-green-100 text-green-800 border-green-200';
      case 'Yaklaşan': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Tamamlandı': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Onay Bekliyor': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'Sosyal': return 'bg-pink-100 text-pink-800';
      case 'Eğitim': return 'bg-purple-100 text-purple-800';
      case 'Kutlama': return 'bg-yellow-100 text-yellow-800';
      case 'Toplantı': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredEvents = events.filter(event => {
    if (activeTab === "pending") return !event.is_approved;
    if (activeTab === "approved") return event.is_approved;
    return true;
  });

  const pendingEvents = events.filter(event => !event.is_approved);

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
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">Etkinlikler</h2>
                  <p className="text-gray-600">Şirket etkinliklerini yönetin ve takip edin</p>
                </div>
                <Link 
                  to="/add-event"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors"
                >
                  <Plus className="h-5 w-5" />
                  <span>Yeni Etkinlik</span>
                </Link>
              </div>
            </div>

            {/* Tabs */}
            <div className="mb-8">
              <div className="flex space-x-4 border-b border-gray-200">
                <button 
                  onClick={() => setActiveTab("all")}
                  className={`pb-2 px-4 font-medium ${activeTab === "all" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"}`}
                >
                  Tüm Etkinlikler
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
                  Onaylanmış
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
                    <p className="text-2xl font-bold text-gray-800">{events.filter(e => e.status === 'Yaklaşan').length}</p>
                    <p className="text-gray-600 text-sm">Yaklaşan</p>
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

            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <div key={event.id} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(event.category)}`}>
                        {event.eventType}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(event.status)}`}>
                        {event.status}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{event.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{event.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{event.startTime}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>{event.endTime}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="h-4 w-4 mr-2" />
                        <span>{event.attendees} katılımcı</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                    {!event.isApproved ? (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Onay Bekliyor {event.is_approved}</span>
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleApproveEvent(event.id, event.title)}
                            className="flex items-center px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Onayla
                          </button>
                          <button 
                            onClick={() => handleRejectEvent(event.id, event.title)}
                            className="flex items-center px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Reddet
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between">
                        <button className="text-blue-600 hover:text-blue-800 font-medium">Detaylar</button>
                        <div className="flex items-center space-x-2">
                          <Link 
                            to={`/edit-event/${event.id}`}
                            className="flex items-center text-gray-600 hover:text-gray-800"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Düzenle
                          </Link>
                          <button 
                            onClick={() => handleDeleteEvent(event.id, event.title)}
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