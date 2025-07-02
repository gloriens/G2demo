import { useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { Users, Search, Plus, Mail, Calendar, User, Network } from "lucide-react";

const Employees = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [employeeList, setEmployeeList] = useState([
    {
      id: 1,
      name: "Ahmet Yılmaz",
      position: "Senior Developer",
      department: "IT",
      email: "ahmet.yilmaz@sirket.com",
      phone: "+90 555 123 4567",
      startDate: "15.03.2022",
      status: "Aktif"
    },
    {
      id: 2,
      name: "Ayşe Demir",
      position: "İK Uzmanı",
      department: "İnsan Kaynakları",
      email: "ayse.demir@sirket.com",
      phone: "+90 555 234 5678",
      startDate: "01.06.2021",
      status: "Aktif"
    },
    {
      id: 3,
      name: "Mehmet Kaya",
      position: "Muhasebe Uzmanı",
      department: "Muhasebe",
      email: "mehmet.kaya@sirket.com",
      phone: "+90 555 345 6789",
      startDate: "10.09.2020",
      status: "İzinli"
    },
    {
      id: 4,
      name: "Fatma Öztürk",
      position: "Pazarlama Müdürü",
      department: "Pazarlama",
      email: "fatma.ozturk@sirket.com",
      phone: "+90 555 456 7890",
      startDate: "20.01.2019",
      status: "Aktif"
    },
    {
      id: 5,
      name: "Ali Şen",
      position: "Satış Temsilcisi",
      department: "Satış",
      email: "ali.sen@sirket.com",
      phone: "+90 555 567 8901",
      startDate: "05.11.2022",
      status: "Aktif"
    }
  ]);

  const [newEmployee, setNewEmployee] = useState({
    name: "",
    position: "",
    department: "",
    email: "",
    phone: "",
    startDate: "",
  });

  const filteredEmployees = employeeList.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">Çalışanlar</h2>
                  <p className="text-gray-600">Tüm çalışan bilgilerini görüntüleyin ve yönetin</p>
                </div>
                <div className="flex space-x-4">
                  <Link
                    to="/organization-chart"
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors"
                  >
                    <Network className="h-5 w-5" />
                    <span>Organizasyon Şeması</span>
                  </Link>
                  <button
                    onClick={() => setIsFormOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors"
                  >
                    <Plus className="h-5 w-5" />
                    <span>Yeni Çalışan</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Yeni Çalışan Formu */}
            {isFormOpen && (
              <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-blue-200">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Yeni Çalışan Ekle</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    className="border p-3 rounded"
                    type="text"
                    placeholder="Ad Soyad"
                    value={newEmployee.name}
                    onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                  />
                  <input
                    className="border p-3 rounded"
                    type="text"
                    placeholder="Pozisyon"
                    value={newEmployee.position}
                    onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
                  />
                  <input
                    className="border p-3 rounded"
                    type="text"
                    placeholder="Departman"
                    value={newEmployee.department}
                    onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })}
                  />
                  <input
                    className="border p-3 rounded"
                    type="email"
                    placeholder="Email"
                    value={newEmployee.email}
                    onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                  />
                  <input
                    className="border p-3 rounded"
                    type="tel"
                    placeholder="Telefon"
                    value={newEmployee.phone}
                    onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                  />
                  <input
                    className="border p-3 rounded"
                    type="date"
                    value={newEmployee.startDate}
                    onChange={(e) => setNewEmployee({ ...newEmployee, startDate: e.target.value })}
                  />
                </div>
                <div className="mt-4 flex space-x-3">
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                    onClick={() => {
                      if (
                        newEmployee.name &&
                        newEmployee.position &&
                        newEmployee.department &&
                        newEmployee.email &&
                        newEmployee.phone &&
                        newEmployee.startDate
                      ) {
                        const newEmp = {
                          ...newEmployee,
                          id: Date.now(),
                          status: "Aktif"
                        };
                        setEmployeeList([...employeeList, newEmp]);
                        setNewEmployee({
                          name: "",
                          position: "",
                          department: "",
                          email: "",
                          phone: "",
                          startDate: "",
                        });
                        setIsFormOpen(false);
                      } else {
                        alert("Lütfen tüm alanları doldurun.");
                      }
                    }}
                  >
                    Kaydet
                  </button>
                  <button
                    className="bg-gray-300 px-4 py-2 rounded"
                    onClick={() => setIsFormOpen(false)}
                  >
                    İptal
                  </button>
                </div>
              </div>
            )}

            {/* Search and Filter */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
              <div className="flex items-center space-x-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Çalışan adı, departman veya pozisyon ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <select className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>Tüm Departmanlar</option>
                  <option>IT</option>
                  <option>İnsan Kaynakları</option>
                  <option>Muhasebe</option>
                  <option>Pazarlama</option>
                  <option>Satış</option>
                </select>
              </div>
            </div>

            {/* Employee Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{employeeList.length}</p>
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
                    <p className="text-2xl font-bold text-gray-800">{employeeList.filter(e => e.status === 'Aktif').length}</p>
                    <p className="text-gray-600 text-sm">Aktif Çalışan</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-orange-100 rounded-full">
                    <Calendar className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{employeeList.filter(e => e.status === 'İzinli').length}</p>
                    <p className="text-gray-600 text-sm">İzinli Çalışan</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Plus className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{employeeList.length}</p>
                    <p className="text-gray-600 text-sm">Bu Ay Eklenen</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Employee List */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">Çalışan Listesi</h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Çalışan</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pozisyon</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Departman</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İletişim</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Başlangıç</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredEmployees.map((employee) => (
                      <tr key={employee.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-medium">
                                {employee.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.position}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.department}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="space-y-1">
                            <div className="flex items-center">
                              <Mail className="h-3 w-3 text-gray-400 mr-1" />
                              <span className="text-xs">{employee.email}</span>
                            </div>
                            <div className="text-xs text-gray-500">{employee.phone}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.startDate}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900 mr-3">Düzenle</button>
                          <button className="text-red-600 hover:text-red-900">Sil</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Employees;
