
import { Calendar, Gift } from "lucide-react";

const BirthdayCard = () => {
  const upcomingBirthdays = [
    { name: "Ahmet Yılmaz", date: "15 Ocak", department: "IT" },
    { name: "Ayşe Demir", date: "18 Ocak", department: "İK" },
    { name: "Mehmet Kaya", date: "22 Ocak", department: "Muhasebe" },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center space-x-2 mb-4">
        <Gift className="h-6 w-6 text-pink-500" />
        <h3 className="text-xl font-bold text-gray-800">Yaklaşan Doğum Günleri</h3>
      </div>
      
      <div className="space-y-3">
        {upcomingBirthdays.map((birthday, index) => (
          <div key={index} className="flex items-center space-x-3 p-3 bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors">
            <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-gray-800">{birthday.name}</p>
              <p className="text-sm text-gray-600">{birthday.date} - {birthday.department}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BirthdayCard;
