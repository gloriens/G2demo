
interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  trend?: string;
}

const StatsCard = ({ title, value, icon, color, trend }: StatsCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className={`p-3 rounded-full ${color}`}>
            {icon}
          </div>
          <div>
            <p className="text-gray-600 text-sm font-medium">{title}</p>
            <p className="text-3xl font-bold text-gray-800">{value}</p>
            {trend && (
              <p className="text-green-600 text-sm font-medium mt-1">{trend}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
