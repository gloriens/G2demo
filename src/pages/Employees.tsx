import { useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { Search, Mail, Network, List } from "lucide-react";

const Employees = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(""); 
  const [employeeList, setEmployeeList] = useState([
    {
      id: 1,
      name: "Ahmet Yılmaz",
      position: "Senior Developer",
      department: "IT",
      email: "ahmet.yilmaz@sirket.com",
      phone: "+90 555 123 4567",
      startDate: "15.03.2022",
    },
    {
      id: 2,
      name: "Ayşe Demir",
      position: "İK Uzmanı",
      department: "İnsan Kaynakları",
      email: "ayse.demir@sirket.com",
      phone: "+90 555 234 5678",
      startDate: "01.06.2021",
    },
    {
      id: 3,
      name: "Mehmet Kaya",
      position: "Muhasebe Uzmanı",
      department: "Muhasebe",
      email: "mehmet.kaya@sirket.com",
      phone: "+90 555 345 6789",
      startDate: "10.09.2020",
    }
  ]);

  const filteredEmployees = employeeList.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.position.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = selectedDepartment === "" || 
                             selectedDepartment === "Tüm Departmanlar" || 
                             employee.department === selectedDepartment;
    
    return matchesSearch && matchesDepartment;
  });

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto flex justify-center items-start p-6">
          <div className="w-full max-w-7xl">

            {/* Sayfa Başlığı ve Butonlar */}
            <div className="mb-8 flex items-center justify-between">
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

                {/*
                <button
                  onClick={() => setIsFormOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors"
                >
                  <Plus className="h-5 w-5" />
                  <span>Yeni Çalışan</span>
                </button>
                */}
              </div>
            </div>

            {/* Yeni Çalışan Formu */}
            {/*
            {isFormOpen && (
              <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-blue-200">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Yeni Çalışan Ekle</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input className="border p-3 rounded" type="text" placeholder="Ad Soyad" />
                  <input className="border p-3 rounded" type="text" placeholder="Pozisyon" />
                  <input className="border p-3 rounded" type="text" placeholder="Departman" />
                  <input className="border p-3 rounded" type="email" placeholder="Email" />
                  <input className="border p-3 rounded" type="tel" placeholder="Telefon" />
                  <input className="border p-3 rounded" type="date" placeholder="gg.aa.yyyy" />
                </div>
                <div className="mt-4 flex space-x-3">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">Kaydet</button>
                  <button className="bg-gray-300 px-4 py-2 rounded">İptal</button>
                </div>
              </div>
            )}
            */}

            {/* Arama Kutusu */}
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
                <select 
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Tüm Departmanlar</option>
                  <option value="IT">IT</option>
                  <option value="İnsan Kaynakları">İnsan Kaynakları</option>
                  <option value="Muhasebe">Muhasebe</option>
                  <option value="Pazarlama">Pazarlama</option>
                  <option value="Satış">Satış</option>
                </select>
              </div>
            </div>

            {/* Çalışan Listesi */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center space-x-2">
                <List className="h-5 w-5 text-gray-600" />
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
