import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";

interface LeaveRequest {
  id: number;
  employeeName: string;
  startDate: string;
  endDate: string;
  leaveType: string;
  reason: string;
  emergencyContact: string;
  requestDate: string;
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string;
}

interface LeaveRequestFormProps {
  onSubmit: (request: LeaveRequest) => void;
}

const LeaveRequestForm = ({ onSubmit }: LeaveRequestFormProps) => {
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    leaveType: "annual",
    reason: "",
    emergencyContact: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      id: Date.now(),
      employeeName: "Ahmet Yılmaz", // Bu normalde login olan kullanıcıdan gelecek
      requestDate: new Date().toISOString().split('T')[0],
      status: "pending"
    });
    setFormData({
      startDate: "",
      endDate: "",
      leaveType: "annual",
      reason: "",
      emergencyContact: ""
    });
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-blue-600" />
          <span>İzin Talebi Oluştur</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Başlangıç Tarihi</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="endDate">Bitiş Tarihi</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="leaveType">İzin Türü</Label>
            <select
              id="leaveType"
              className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.leaveType}
              onChange={(e) => setFormData({...formData, leaveType: e.target.value})}
            >
              <option value="annual">Yıllık İzin</option>
              <option value="sick">Hastalık İzni</option>
              <option value="personal">Kişisel İzin</option>
              <option value="maternity">Doğum İzni</option>
              <option value="emergency">Acil Durum İzni</option>
            </select>
          </div>

          <div>
            <Label htmlFor="reason">İzin Sebebi</Label>
            <Textarea
              id="reason"
              placeholder="İzin talebinizin sebebini açıklayın..."
              value={formData.reason}
              onChange={(e) => setFormData({...formData, reason: e.target.value})}
              required
            />
          </div>

          <div>
            <Label htmlFor="emergencyContact">Acil Durum İletişim</Label>
            <Input
              id="emergencyContact"
              placeholder="İzin süresince ulaşılabilecek numara"
              value={formData.emergencyContact}
              onChange={(e) => setFormData({...formData, emergencyContact: e.target.value})}
            />
          </div>

          <Button type="submit" className="w-full">
            <Clock className="h-4 w-4 mr-2" />
            İzin Talebini Gönder
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default LeaveRequestForm;
