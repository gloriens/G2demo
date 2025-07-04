import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { Search, Mail, Network, List } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchEmployees, clearError } from "@/store/slices/employeeSlice";

const Employees = () => {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  
  // ✅ Redux state'den veri çek
  const { employees, loading, error } = useAppSelector((state) => state.employees);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState("");

  // ✅ Component mount olduğunda verileri çek
  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  // ✅ Error handling
  useEffect(() => {
    if (error) {
      toast({
        title: "Hata",
        description: error,
        variant: "destructive"
      });
      dispatch(clearError());
    }
  }, [error, toast, dispatch]);

  // Filtreleme fonksiyonu - backend formatına uygun
  const filteredEmployees = employees.filter(employee => {
    const fullName = `${employee.firstName} ${employee.lastName}`.toLowerCase();
    const department = (employee.department || '').toLowerCase();
    const position = (employee.position || '').toLowerCase();
    const jobTitle = (employee.jobTitle || '').toLowerCase();

    const matchesSearch =
      fullName.includes(searchTerm.toLowerCase()) ||
      department.includes(searchTerm.toLowerCase()) ||
      position.includes(searchTerm.toLowerCase()) ||
      jobTitle.includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment =
      selectedDepartment === "" ||
      selectedDepartment === "Tüm Departmanlar" ||
      employee.departmentName === selectedDepartment;

    return matchesSearch && matchesDepartment;
  });

  // Unique departmanlar
  const uniqueDepartments = [
    ...new Set(employees.map(emp => emp.departmentName).filter(Boolean))
  ];

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
              </div>
            </div>

            {/* ✅ Loading State */}
            {loading && (
              <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
                <div className="text-center">
                  <div className="text-gray-600">Çalışanlar yükleniyor...</div>
                </div>
              </div>
            )}

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
                  {/* ✅ Backend'den gelen departmanları listele */}
                  {uniqueDepartments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Çalışan Listesi */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <List className="h-5 w-5 text-gray-600" />
                  <h3 className="text-lg font-semibold text-gray-800">Çalışan Listesi</h3>
                </div>
                {/* ✅ Toplam sayısını göster */}
                <div className="text-sm text-gray-500">
                  Toplam: {filteredEmployees.length} çalışan
                </div>
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
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {/* ✅ Redux'dan gelen verilerle render et */}
                    {filteredEmployees.map((employee) => {
                      const fullName = `${employee.firstName} ${employee.lastName}`;
                      const initials = `${employee.firstName[0] ?? ''}${employee.lastName[0] ?? ''}`;
                      return (
                        <tr key={employee.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-medium">{initials}</span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{fullName}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.jobTitle || 'Belirtilmemiş'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.departmentName || 'Belirtilmemiş'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="space-y-1">
                              <div className="flex items-center">
                                <Mail className="h-3 w-3 text-gray-400 mr-1" />
                                <span className="text-xs">{employee.email}</span>
                              </div>
                              <div className="text-xs text-gray-500">{employee.phoneNumber}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.dateOfJoining || 'Belirtilmemiş'}</td>
                        </tr>
                      );
                    })}
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
