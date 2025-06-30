
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Check, X, Clock, User, Calendar, MessageSquare } from "lucide-react";

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

interface LeaveRequestCardProps {
  request: LeaveRequest;
  onApprove: (id: number) => void;
  onReject: (id: number, reason: string) => void;
  isManager?: boolean;
}

const LeaveRequestCard = ({ request, onApprove, onReject, isManager = false }: LeaveRequestCardProps) => {
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Onaylandı</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Reddedildi</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Beklemede</Badge>;
    }
  };

  const getLeaveTypeText = (type: string) => {
    const types: { [key: string]: string } = {
      annual: "Yıllık İzin",
      sick: "Hastalık İzni",
      personal: "Kişisel İzin",
      maternity: "Doğum İzni",
      emergency: "Acil Durum İzni"
    };
    return types[type] || type;
  };

  const handleReject = () => {
    if (rejectionReason.trim()) {
      onReject(request.id, rejectionReason);
      setRejectionReason("");
      setShowRejectForm(false);
    }
  };

  const calculateDays = () => {
    const start = new Date(request.startDate);
    const end = new Date(request.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5 text-blue-600" />
            <span>{request.employeeName}</span>
          </CardTitle>
          {getStatusBadge(request.status)}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span><strong>Başlangıç:</strong> {request.startDate}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span><strong>Bitiş:</strong> {request.endDate}</span>
          </div>
        </div>

        <div className="text-sm">
          <p><strong>İzin Türü:</strong> {getLeaveTypeText(request.leaveType)}</p>
          <p><strong>Süre:</strong> {calculateDays()} gün</p>
          <p><strong>Talep Tarihi:</strong> {request.requestDate}</p>
        </div>

        <div>
          <p className="text-sm font-semibold mb-1">İzin Sebebi:</p>
          <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">{request.reason}</p>
        </div>

        {request.emergencyContact && (
          <div>
            <p className="text-sm font-semibold">Acil Durum İletişim:</p>
            <p className="text-sm text-gray-600">{request.emergencyContact}</p>
          </div>
        )}

        {request.status === "rejected" && request.rejectionReason && (
          <div className="bg-red-50 p-3 rounded border-l-4 border-red-400">
            <div className="flex items-start space-x-2">
              <MessageSquare className="h-4 w-4 text-red-600 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-800">Red Sebebi:</p>
                <p className="text-sm text-red-700">{request.rejectionReason}</p>
              </div>
            </div>
          </div>
        )}

        {isManager && request.status === "pending" && (
          <div className="border-t pt-4">
            {!showRejectForm ? (
              <div className="flex space-x-2">
                <Button
                  onClick={() => onApprove(request.id)}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Onayla
                </Button>
                <Button
                  onClick={() => setShowRejectForm(true)}
                  variant="destructive"
                  className="flex-1"
                >
                  <X className="h-4 w-4 mr-2" />
                  Reddet
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <Textarea
                  placeholder="Red etme sebebinizi açıklayın..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                />
                <div className="flex space-x-2">
                  <Button
                    onClick={handleReject}
                    variant="destructive"
                    className="flex-1"
                    disabled={!rejectionReason.trim()}
                  >
                    Red Et
                  </Button>
                  <Button
                    onClick={() => {
                      setShowRejectForm(false);
                      setRejectionReason("");
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    İptal
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LeaveRequestCard;
