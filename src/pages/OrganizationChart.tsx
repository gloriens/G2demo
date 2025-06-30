
import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { Users, ChevronDown, ChevronRight, Mail, Phone, User } from "lucide-react";

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

  // CEO Card Component
  const CEOCard = ({ employee }: { employee: Employee }) => {
    const isExpanded = expandedNodes.includes(employee.id);
    
    return (
      <div className="flex flex-col items-center">
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-xl p-6 text-white min-w-[300px] relative">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-xl font-bold">
              {employee.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold">{employee.name}</h3>
              <p className="text-blue-100 font-medium">{employee.position}</p>
              <p className="text-blue-200 text-sm">{employee.department}</p>
            </div>
          </div>
          
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center text-blue-100 text-sm">
              <Users className="h-4 w-4 mr-2" />
              <span>{employee.subordinates?.length} doğrudan rapor</span>
            </div>
            <button
              onClick={() => toggleNode(employee.id)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <ChevronDown className={`h-5 w-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
        
        {/* Vertical connector line */}
        {isExpanded && employee.subordinates && employee.subordinates.length > 0 && (
          <div className="w-0.5 h-12 bg-gray-300 mt-4"></div>
        )}
      </div>
    );
  };

  // Manager Card Component
  const ManagerCard = ({ employee }: { employee: Employee }) => {
    const isExpanded = expandedNodes.includes(employee.id);
    const hasSubordinates = employee.subordinates && employee.subordinates.length > 0;
    
    return (
      <div className="flex flex-col items-center">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 min-w-[280px] hover:shadow-xl transition-shadow">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-medium">
              {employee.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-800">{employee.name}</h4>
              <p className="text-green-600 font-medium text-sm">{employee.position}</p>
              <p className="text-gray-500 text-xs">{employee.department}</p>
            </div>
          </div>
          
          <div className="mt-3 space-y-1">
            <div className="flex items-center text-xs text-gray-600">
              <Mail className="h-3 w-3 mr-2" />
              <span className="truncate">{employee.email}</span>
            </div>
            <div className="flex items-center text-xs text-gray-600">
              <Phone className="h-3 w-3 mr-2" />
              <span>{employee.phone}</span>
            </div>
          </div>
          
          {hasSubordinates && (
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center text-xs text-gray-500">
                <Users className="h-3 w-3 mr-1" />
                <span>{employee.subordinates?.length} kişi</span>
              </div>
              <button
                onClick={() => toggleNode(employee.id)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ChevronDown className={`h-4 w-4 text-gray-600 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              </button>
            </div>
          )}
        </div>
        
        {/* Vertical connector line */}
        {isExpanded && hasSubordinates && (
          <div className="w-0.5 h-8 bg-gray-300 mt-2"></div>
        )}
      </div>
    );
  };

  // Employee Card Component
  const EmployeeCard = ({ employee }: { employee: Employee }) => {
    const getAvatarColor = (index: number) => {
      const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500', 'bg-yellow-500', 'bg-indigo-500'];
      return colors[index % colors.length];
    };

    return (
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 min-w-[250px] hover:shadow-lg transition-shadow">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 ${getAvatarColor(employee.id)} rounded-full flex items-center justify-center text-white font-medium text-sm`}>
            {employee.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex-1 min-w-0">
            <h5 className="font-medium text-gray-800 truncate">{employee.name}</h5>
            <p className="text-blue-600 text-sm truncate">{employee.position}</p>
            <p className="text-gray-500 text-xs truncate">{employee.department}</p>
          </div>
        </div>
        
        <div className="mt-3 space-y-1">
          <div className="flex items-center text-xs text-gray-600">
            <Mail className="h-3 w-3 mr-2 flex-shrink-0" />
            <span className="truncate">{employee.email}</span>
          </div>
          <div className="flex items-center text-xs text-gray-600">
            <Phone className="h-3 w-3 mr-2 flex-shrink-0" />
            <span>{employee.phone}</span>
          </div>
        </div>
      </div>
    );
  };

  const renderHierarchy = () => {
    const isExpanded = expandedNodes.includes(1);
    
    return (
      <div className="flex flex-col items-center space-y-8">
        {/* CEO Level */}
        <CEOCard employee={organizationData} />
        
        {/* Department Managers Level */}
        {isExpanded && organizationData.subordinates && (
          <>
            <div className="flex justify-center space-x-16">
              {organizationData.subordinates.map((manager, index) => (
                <div key={manager.id} className="flex flex-col items-center">
                  <ManagerCard employee={manager} />
                  
                  {/* Department Employees */}
                  {expandedNodes.includes(manager.id) && manager.subordinates && manager.subordinates.length > 0 && (
                    <div className="mt-8 flex flex-col items-center space-y-4">
                      {manager.subordinates.map((employee) => (
                        <EmployeeCard key={employee.id} employee={employee} />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6 lg:mb-8">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">Organizasyon Şeması</h2>
              <p className="text-gray-600">Şirket hiyerarşisi ve raporlama yapısı</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">10</p>
                    <p className="text-gray-600 text-sm">Toplam Çalışan</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-green-100 rounded-full">
                    <User className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">4</p>
                    <p className="text-gray-600 text-sm">Departman</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">4</p>
                    <p className="text-gray-600 text-sm">Yönetici</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Organization Chart */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Hiyerarşi Yapısı</h3>
                <p className="text-gray-600 text-sm">Çalışanları genişletmek için ok butonlarına tıklayın</p>
              </div>
              
              <div className="w-full overflow-x-auto">
                {renderHierarchy()}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default OrganizationChart;
