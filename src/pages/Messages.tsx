
import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { MessageSquare, Send, Search, User, Circle } from "lucide-react";

const Messages = () => {
  const [selectedChat, setSelectedChat] = useState(1);
  const [newMessage, setNewMessage] = useState("");

  const contacts = [
    {
      id: 1,
      name: "Ahmet Yılmaz",
      department: "IT",
      status: "online",
      lastMessage: "Proje hakkında konuşalım mı?",
      lastTime: "10:30",
      unread: 2
    },
    {
      id: 2,
      name: "Ayşe Demir",
      department: "İK",
      status: "online",
      lastMessage: "Toplantı saati değişti",
      lastTime: "09:45",
      unread: 0
    },
    {
      id: 3,
      name: "Mehmet Kaya",
      department: "Muhasebe",
      status: "offline",
      lastMessage: "Raporu yarın gönderiyorum",
      lastTime: "Dün",
      unread: 1
    },
    {
      id: 4,
      name: "Fatma Öztürk",
      department: "Pazarlama",
      status: "online",
      lastMessage: "Harika çalışma!",
      lastTime: "14:20",
      unread: 0
    }
  ];

  const messages = [
    {
      id: 1,
      senderId: 1,
      senderName: "Ahmet Yılmaz",
      content: "Merhaba! Yeni proje hakkında konuşabilir miyiz?",
      time: "10:25",
      isOwn: false
    },
    {
      id: 2,
      senderId: 0,
      senderName: "Ben",
      content: "Tabii ki! Hangi proje hakkında konuşmak istiyorsun?",
      time: "10:26",
      isOwn: true
    },
    {
      id: 3,
      senderId: 1,
      senderName: "Ahmet Yılmaz", 
      content: "Mobil uygulama projesi. Teknik detayları gözden geçirelim.",
      time: "10:27",
      isOwn: false
    },
    {
      id: 4,
      senderId: 0,
      senderName: "Ben",
      content: "Elbette. Toplantı odası A'da buluşalım mı?",
      time: "10:28",
      isOwn: true
    },
    {
      id: 5,
      senderId: 1,
      senderName: "Ahmet Yılmaz",
      content: "Proje hakkında konuşalım mı?",
      time: "10:30",
      isOwn: false
    }
  ];

  const selectedContact = contacts.find(c => c.id === selectedChat);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Here you would normally send the message
      console.log("Sending message:", newMessage);
      setNewMessage("");
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-hidden p-6">
          <div className="max-w-7xl mx-auto h-full">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Mesajlar</h2>
              <p className="text-gray-600">Çalışanlarla anlık mesajlaşma</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-100 h-[calc(100vh-200px)] flex overflow-hidden">
              {/* Contacts Sidebar */}
              <div className="w-1/3 border-r border-gray-200 flex flex-col">
                {/* Search */}
                <div className="p-4 border-b border-gray-200">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Kişi ara..."
                      className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Contacts List */}
                <div className="flex-1 overflow-y-auto">
                  {contacts.map((contact) => (
                    <div
                      key={contact.id}
                      onClick={() => setSelectedChat(contact.id)}
                      className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedChat === contact.id ? 'bg-blue-50 border-r-2 border-r-blue-500' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium">
                              {contact.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                            contact.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                          }`}></div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-gray-800 truncate">{contact.name}</h3>
                            <span className="text-xs text-gray-500">{contact.lastTime}</span>
                          </div>
                          <p className="text-sm text-gray-600 truncate">{contact.department}</p>
                          <p className="text-sm text-gray-500 truncate">{contact.lastMessage}</p>
                        </div>
                        
                        {contact.unread > 0 && (
                          <div className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {contact.unread}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chat Area */}
              <div className="flex-1 flex flex-col">
                {selectedContact ? (
                  <>
                    {/* Chat Header */}
                    <div className="p-4 border-b border-gray-200 bg-gray-50">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium">
                              {selectedContact.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                            selectedContact.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                          }`}></div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">{selectedContact.name}</h3>
                          <p className="text-sm text-gray-600">
                            {selectedContact.department} • {selectedContact.status === 'online' ? 'Çevrimiçi' : 'Çevrimdışı'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-4">
                      {messages.map((message) => (
                        <div key={message.id} className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.isOwn 
                              ? 'bg-blue-500 text-white' 
                              : 'bg-gray-200 text-gray-800'
                          }`}>
                            <p className="text-sm">{message.content}</p>
                            <p className={`text-xs mt-1 ${
                              message.isOwn ? 'text-blue-100' : 'text-gray-500'
                            }`}>
                              {message.time}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Message Input */}
                    <div className="p-4 border-t border-gray-200">
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                          placeholder="Mesajınızı yazın..."
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                          onClick={handleSendMessage}
                          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-colors"
                        >
                          <Send className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-800 mb-2">Mesajlaşmaya Başlayın</h3>
                      <p className="text-gray-600">Bir kişi seçin ve mesajlaşmaya başlayın</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Messages;
