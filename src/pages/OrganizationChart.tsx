
import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { Users, ChevronDown, ChevronRight, Mail, Phone, User, Building, Search, Filter, Grid, List } from "lucide-react";

interface Employee {
  id: number;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  manager?: number;
  subordinates?: Employee[];
}

const OrganizationChart = () => {
  const [expandedNodes, setExpandedNodes] = useState<number[]>([1, 2, 3, 4]);
  const [viewMode, setViewMode] = useState<'tree' | 'grid'>('tree');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  const organizationData: Employee = {
    id: 1,
    name: "Ali Veli",
    position: "Genel Müdür",
    department: "Yönetim",
    email: "ali.veli@sirket.com",
    phone: "+90 555 000 0001",
    subordinates: [
      {
        id: 2,
        name: "Ayşe Demir",
        position: "İK Müdürü",
        department: "İnsan Kaynakları",
        email: "ayse.demir@sirket.com",
        phone: "+90 555 234 5678",
        manager: 1,
        subordinates: [
          {
            id: 5,
            name: "Mehmet Kaya",
            position: "İK Uzmanı",
            department: "İnsan Kaynakları",
            email: "mehmet.kaya@sirket.com",
            phone: "+90 555 345 6789",
            manager: 2
          },
          {
            id: 6,
            name: "Fatma Öztürk",
            position: "İK Asistanı",
            department: "İnsan Kaynakları",
            email: "fatma.ozturk@sirket.com",
            phone: "+90 555 456 7890",
            manager: 2
          }
        ]
      },
      {
        id: 3,
        name: "Ahmet Yılmaz",
        position: "IT Müdürü",
        department: "Bilgi İşlem",
        email: "ahmet.yilmaz@sirket.com",
        phone: "+90 555 123 4567",
        manager: 1,
        subordinates: [
          {
            id: 7,
            name: "Can Özkan",
            position: "Senior Developer",
            department: "Bilgi İşlem",
            email: "can.ozkan@sirket.com",
            phone: "+90 555 567 8901",
            manager: 3
          },
          {
            id: 8,
            name: "Elif Şahin",
            position: "Frontend Developer",
            department: "Bilgi İşlem",
            email: "elif.sahin@sirket.com",
            phone: "+90 555 678 9012",
            manager: 3
          },
          {
            id: 9,
            name: "Murat Acar",
            position: "System Admin",
            department: "Bilgi İşlem",
            email: "murat.acar@sirket.com",
            phone: "+90 555 789 0123",
            manager: 3
          }
        ]
      },
      {
        id: 4,
        name: "Zeynep Kılıç",
        position: "Pazarlama Müdürü",
        department: "Pazarlama",
        email: "zeynep.kilic@sirket.com",
        phone: "+90 555 890 1234",
        manager: 1,
        subordinates: [
          {
            id: 10,
            name: "Burak Yıldız",
            position: "Pazarlama Uzmanı",
            department: "Pazarlama",
            email: "burak.yildiz@sirket.com",
            phone: "+90 555 901 2345",
            manager: 4
          }
        ]
      }
    ]
  };

  const toggleNode = (nodeId: number) => {
    setExpandedNodes(prev => 
      prev.includes(nodeId) 
        ? prev.filter(id => id !== nodeId)
        : [...prev, nodeId]
    );
  };

  const renderEmployee = (employee: Employee, level: number = 0) => {
    const hasSubordinates = employee.subordinates && employee.subordinates.length > 0;
    const isExpanded = expandedNodes.includes(employee.id);
    
    // CEO için özel tasarım
    if (level === 0) {
      return (
        <div key={employee.id} className="flex flex-col items-center mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl border border-blue-200 p-6 text-white max-w-sm w-full">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-lg">
                  {employee.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              
              <div className="flex-1">
                <h3 className="font-bold text-2xl">{employee.name}</h3>
                <p className="text-blue-100 font-medium text-lg">{employee.position}</p>
                <p className="text-blue-100 text-sm">{employee.department}</p>
              </div>
            </div>
            
            {hasSubordinates && (
              <div className="mt-4 pt-4 border-t border-white/20">
                <div className="flex items-center justify-between">
                  <span className="text-blue-100 text-sm">
                    <Users className="h-4 w-4 inline mr-1" />
                    {employee.subordinates?.length} doğrudan rapor
                  </span>
                  <button
                    onClick={() => toggleNode(employee.id)}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-5 w-5 text-white" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-white" />
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {hasSubordinates && isExpanded && (
            <div className="mt-12 w-full">
              <div className="flex justify-center mb-6">
                <div className="w-px h-12 bg-gray-300"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {employee.subordinates?.map(subordinate => 
                  renderEmployee(subordinate, level + 1)
                )}
              </div>
            </div>
          )}
        </div>
      );
    }
    
    // Departman müdürleri için tasarım
    if (level === 1) {
      return (
        <div key={employee.id} className="flex flex-col items-center">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-5 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 max-w-xs w-full">
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-3">
                <span className="text-white font-semibold text-sm">
                  {employee.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              
              <h3 className="font-semibold text-gray-800 text-lg mb-1">{employee.name}</h3>
              <p className="text-green-600 font-medium text-sm mb-1">{employee.position}</p>
              <p className="text-gray-500 text-xs mb-3">{employee.department}</p>
              
              <div className="w-full text-xs text-gray-600 space-y-1">
                <div className="flex items-center justify-center">
                  <Mail className="h-3 w-3 mr-1" />
                  <span className="truncate">{employee.email.split('@')[0]}</span>
                </div>
                <div className="flex items-center justify-center">
                  <Phone className="h-3 w-3 mr-1" />
                  <span>{employee.phone}</span>
                </div>
              </div>
              
              {hasSubordinates && (
                <div className="mt-4 pt-3 border-t border-gray-100 w-full">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-xs">
                      <Users className="h-3 w-3 inline mr-1" />
                      {employee.subordinates?.length} kişi
                    </span>
                    <button
                      onClick={() => toggleNode(employee.id)}
                      className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 text-gray-600" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {hasSubordinates && isExpanded && (
            <div className="mt-10 w-full">
              <div className="flex justify-center mb-6">
                <div className="w-px h-10 bg-gray-300"></div>
              </div>
              <div className="flex flex-col items-center space-y-4 max-w-md mx-auto">
                {employee.subordinates?.map(subordinate => 
                  renderEmployee(subordinate, level + 1)
                )}
              </div>
            </div>
          )}
        </div>
      );
    }
    
    // Alt seviye çalışanlar için kompakt yatay tasarım - Görüntüde olduğu gibi
    return (
      <div key={employee.id} className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all duration-300 w-full">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white font-medium text-xs">
              {employee.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          
          <div className="ml-3 flex-1">
            <h4 className="font-medium text-gray-800 text-sm">{employee.name}</h4>
            <p className="text-blue-600 text-xs font-medium">{employee.position}</p>
            <p className="text-gray-500 text-xs">{employee.department}</p>
          </div>
          
          <div className="flex flex-col text-xs text-gray-500 items-end space-y-1">
            <div className="flex items-center">
              <Mail className="h-3 w-3 mr-1" />
              <span className="truncate">{employee.email.split('@')[0]}</span>
            </div>
            <div className="flex items-center">
              <Phone className="h-3 w-3 mr-1" />
              <span>{employee.phone}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-full mx-auto">
            {/* Header Section */}
            <div className="bg-white shadow-sm border-b border-gray-200 p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">Organizasyon Şeması</h1>
                  <p className="text-gray-600 mt-2">Şirket hiyerarşisi ve departman yapısı</p>
                </div>
                
                {/* Controls */}
                <div className="flex items-center space-x-4 mt-4 lg:mt-0">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Çalışan ara..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">Tüm Departmanlar</option>
                    <option value="Yönetim">Yönetim</option>
                    <option value="İnsan Kaynakları">İnsan Kaynakları</option>
                    <option value="Bilgi İşlem">Bilgi İşlem</option>
                    <option value="Pazarlama">Pazarlama</option>
                  </select>
                  
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('tree')}
                      className={`px-3 py-1 rounded-md text-sm transition-colors ${
                        viewMode === 'tree' ? 'bg-white shadow text-blue-600' : 'text-gray-600'
                      }`}
                    >
                      <Grid className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`px-3 py-1 rounded-md text-sm transition-colors ${
                        viewMode === 'grid' ? 'bg-white shadow text-blue-600' : 'text-gray-600'
                      }`}
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Dashboard */}
            <div className="p-6 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-100 rounded-xl">
                      <Users className="h-8 w-8 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-gray-800">10</p>
                      <p className="text-gray-600 text-sm">Toplam Çalışan</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-green-100 rounded-xl">
                      <Building className="h-8 w-8 text-green-600" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-gray-800">4</p>
                      <p className="text-gray-600 text-sm">Departman</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-purple-100 rounded-xl">
                      <User className="h-8 w-8 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-gray-800">4</p>
                      <p className="text-gray-600 text-sm">Yönetici</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-orange-100 rounded-xl">
                      <Users className="h-8 w-8 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-gray-800">2.5</p>
                      <p className="text-gray-600 text-sm">Ort. Takım Büyüklüğü</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Organization Chart */}
            <div className="p-6 bg-gray-50 min-h-screen">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <div className="mb-8 text-center">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Şirket Hiyerarşisi</h2>
                  <p className="text-gray-600">Organizasyon yapısını keşfetmek için departmanları genişletin</p>
                </div>
                
                <div className="overflow-x-auto">
                  <div className="min-w-full px-8">
                    {renderEmployee(organizationData)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default OrganizationChart;
