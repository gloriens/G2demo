import { Calendar, Gift, Cake, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { fetchEmployees } from "@/store/slices/employeeSlice";

const BirthdayCard = () => {
  const dispatch = useAppDispatch();
  const { employees, loading, error } = useAppSelector(state => state.employees);
  const [currentMonthBirthdays, setCurrentMonthBirthdays] = useState<any[]>([]);

  // ✅ Component mount olduğunda çalışanları çek
  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  // ✅ Çalışanlar değiştiğinde bu ayın doğum günlerini hesapla
  useEffect(() => {
    if (employees.length > 0) {
      const birthdays = calculateCurrentMonthBirthdays(employees);
      setCurrentMonthBirthdays(birthdays);
    }
  }, [employees]);

  // ✅ Bu ayın doğum günlerini hesapla
  const calculateCurrentMonthBirthdays = (employeeList: any[]) => {
    const currentMonth = new Date().getMonth(); // 0-11
    const currentYear = new Date().getFullYear();
    
    const birthdays = employeeList
      .filter(employee => {
        // Doğum tarihi alanlarını kontrol et
        const birthDate = employee.dateOfBirth || employee.birthDate || employee.startDate;
        if (!birthDate) return false;

        try {
          const birth = new Date(birthDate);
          return birth.getMonth() === currentMonth;
        } catch (error) {
          console.warn('Invalid date format for employee:', employee.firstName, birthDate);
          return false;
        }
      })
      .map(employee => {
        const birthDate = employee.dateOfBirth || employee.birthDate || employee.startDate;
        const birth = new Date(birthDate);
        
        return {
          id: employee.id,
          name: `${employee.firstName} ${employee.lastName}`,
          date: birth.getDate(),
          fullDate: birth,
          department: employee.department || employee.departmentName || 'Bilinmiyor',
          email: employee.email,
          age: currentYear - birth.getFullYear()
        };
      })
      .sort((a, b) => a.date - b.date); // Tarihe göre sırala

    console.log('🎂 Current month birthdays:', birthdays);
    return birthdays;
  };

  // ✅ Tarih formatlayıcı
  const formatBirthDate = (date: number) => {
    const currentMonth = new Date().toLocaleDateString('tr-TR', { month: 'long' });
    return `${date} ${currentMonth}`;
  };

  // ✅ Doğum gününe kaç gün kaldı
  const getDaysUntilBirthday = (date: number) => {
    const today = new Date();
    const currentDay = today.getDate();
    
    if (date === currentDay) {
      return 'Bugün!';
    } else if (date > currentDay) {
      return `${date - currentDay} gün sonra`;
    } else {
      // Geçen doğum günleri için
      return 'Geçti';
    }
  };

  // ✅ Doğum günü renk kodu
  const getBirthdayColor = (date: number) => {
    const today = new Date().getDate();
    
    if (date === today) {
      return 'bg-green-50 border-l-4 border-green-500'; // Bugün
    } else if (date > today && date <= today + 7) {
      return 'bg-yellow-50 border-l-4 border-yellow-500'; // Bu hafta
    } else {
      return 'bg-pink-50 border-l-4 border-pink-500'; // Normal
    }
  };

  // ✅ Loading durumu
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center space-x-2 mb-4">
          <Gift className="h-6 w-6 text-pink-500" />
          <h3 className="text-xl font-bold text-gray-800">Yaklaşan Doğum Günleri</h3>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-3 bg-gray-100 rounded-lg animate-pulse">
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-3 bg-gray-300 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ✅ Error durumu
  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center space-x-2 mb-4">
          <Gift className="h-6 w-6 text-pink-500" />
          <h3 className="text-xl font-bold text-gray-800">Yaklaşan Doğum Günleri</h3>
        </div>
        <div className="text-center py-8">
          <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 text-sm">Doğum günü verileri yüklenemedi</p>
          <p className="text-gray-400 text-xs mt-1">{error}</p>
          <button 
            onClick={() => dispatch(fetchEmployees())}
            className="mt-3 text-blue-600 hover:text-blue-700 text-sm"
          >
            Tekrar dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Gift className="h-6 w-6 text-pink-500" />
          <h3 className="text-xl font-bold text-gray-800">
            {new Date().toLocaleDateString('tr-TR', { month: 'long' })} Doğum Günleri
          </h3>
        </div>
        <span className="text-sm text-gray-500">
          {currentMonthBirthdays.length} kişi
        </span>
      </div>

      {/* ✅ Scrollable List Container */}
      <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
        {currentMonthBirthdays.length === 0 ? (
          // ✅ Boş durum
          <div className="text-center py-8">
            <Cake className="h-12 w-12 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm">Bu ay doğum günü olan kimse yok</p>
            <p className="text-gray-400 text-xs mt-1">
              {employees.length > 0 
                ? `${employees.length} çalışan kaydı kontrol edildi`
                : 'Çalışan verisi bulunamadı'
              }
            </p>
          </div>
        ) : (
          currentMonthBirthdays.map((birthday, index) => {
            const daysUntil = getDaysUntilBirthday(birthday.date);
            const isToday = daysUntil === 'Bugün!';
            
            return (
              <div 
                key={birthday.id || index} 
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors hover:shadow-md ${getBirthdayColor(birthday.date)}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isToday ? 'bg-green-500' : 'bg-pink-500'
                }`}>
                  {isToday ? (
                    <Cake className="h-5 w-5 text-white" />
                  ) : (
                    <Calendar className="h-5 w-5 text-white" />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-gray-800">
                      {birthday.name}
                      {isToday && <span className="ml-2 text-sm">🎉</span>}
                    </p>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      isToday ? 'bg-green-100 text-green-700' : 'bg-pink-100 text-pink-700'
                    }`}>
                      {daysUntil}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm text-gray-600">
                      {formatBirthDate(birthday.date)} - {birthday.department}
                    </p>
                    <p className="text-xs text-gray-500">
                      {birthday.age} yaşında
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ✅ İstatistik */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center text-xs text-gray-500">
          <Users className="h-3 w-3 mr-1" />
          Toplam {employees.length} çalışan
        </div>
        
        {currentMonthBirthdays.length > 0 && (
          <div className="text-xs text-gray-400">
            Son güncelleme: {new Date().toLocaleTimeString('tr-TR')}
          </div>
        )}
      </div>
    </div>
  );
};

export default BirthdayCard;