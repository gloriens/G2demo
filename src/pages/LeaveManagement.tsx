import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import LeaveRequestForm from "@/components/leave/LeaveRequestForm";
import LeaveRequestCard from "@/components/leave/LeaveRequestCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, FileText, CheckCircle, XCircle, Clock } from "lucide-react";

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

const LeaveManagement = () => {
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([
    {
      id: 1,
      employeeName: "Ahmet Yılmaz",
      startDate: "2024-01-15",
      endDate: "2024-01-20",
      leaveType: "annual",
      reason: "Aile ziyareti için yıllık izin kullanmak istiyorum.",
      emergencyContact: "0532 123 45 67",
      requestDate: "2024-01-01",
      status: "pending"
    },
    {
      id: 2,
      employeeName: "Mehmet Kaya",
      startDate: "2024-01-10",
      endDate: "2024-01-12",
      leaveType: "sick",
      reason: "Grip nedeniyle hasta raporlu izin.",
      emergencyContact: "0543 987 65 43",
      requestDate: "2024-01-08",
      status: "approved"
    },
    {
      id: 3,
      employeeName: "Ayşe Demir",
      startDate: "2024-01-22",
      endDate: "2024-01-25",
      leaveType: "personal",
      reason: "Kişisel işlerim için izin talep ediyorum.",
      emergencyContact: "0555 111 22 33",
      requestDate: "2024-01-05",
      status: "rejected",
      rejectionReason: "Bu tarihler arasında proje teslimi var. Farklı bir tarih önerebilirsiniz."
    }
  ]);

  const handleNewRequest = (requestData: LeaveRequest) => {
    setLeaveRequests([...leaveRequests, requestData]);
    setShowRequestForm(false);
  };

  const handleApprove = (id: number) => {
    setLeaveRequests(leaveRequests.map(req => 
      req.id === id ? { ...req, status: "approved" as const, rejectionReason: undefined } : req
    ));
  };

  const handleReject = (id: number, reason: string) => {
    setLeaveRequests(leaveRequests.map(req => 
      req.id === id ? { ...req, status: "rejected" as const, rejectionReason: reason } : req
    ));
  };

  const getRequestsByStatus = (status: string) => {
    return leaveRequests.filter(req => req.status === status);
  };

  const getRequestStats = () => {
    return {
      total: leaveRequests.length,
      pending: getRequestsByStatus("pending").length,
      approved: getRequestsByStatus("approved").length,
      rejected: getRequestsByStatus("rejected").length
    };
  };

  const stats = getRequestStats();

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">İzin Yönetimi</h2>
                  <p className="text-gray-600">İzin talepleri ve onay süreçleri</p>
                </div>
                <Button 
                  onClick={() => setShowRequestForm(!showRequestForm)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Yeni İzin Talebi
                </Button>
              </div>

              {/* İstatistik Kartları */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
                  <div className="flex items-center">
                    <FileText className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Toplam Talep</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
                  <div className="flex items-center">
                    <Clock className="h-8 w-8 text-yellow-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Beklemede</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
                  <div className="flex items-center">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Onaylanan</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
                  <div className="flex items-center">
                    <XCircle className="h-8 w-8 text-red-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Reddedilen</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* İzin Talep Formu */}
            {showRequestForm && (
              <div className="mb-8">
                <LeaveRequestForm onSubmit={handleNewRequest} />
              </div>
            )}

            {/* İzin Talepleri Tabs */}
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">Tümü ({stats.total})</TabsTrigger>
                <TabsTrigger value="pending">Beklemede ({stats.pending})</TabsTrigger>
                <TabsTrigger value="approved">Onaylanan ({stats.approved})</TabsTrigger>
                <TabsTrigger value="rejected">Reddedilen ({stats.rejected})</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-6">
                <div className="grid gap-6">
                  {leaveRequests.map((request) => (
                    <LeaveRequestCard
                      key={request.id}
                      request={request}
                      onApprove={handleApprove}
                      onReject={handleReject}
                      isManager={true}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="pending" className="mt-6">
                <div className="grid gap-6">
                  {getRequestsByStatus("pending").map((request) => (
                    <LeaveRequestCard
                      key={request.id}
                      request={request}
                      onApprove={handleApprove}
                      onReject={handleReject}
                      isManager={true}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="approved" className="mt-6">
                <div className="grid gap-6">
                  {getRequestsByStatus("approved").map((request) => (
                    <LeaveRequestCard
                      key={request.id}
                      request={request}
                      onApprove={handleApprove}
                      onReject={handleReject}
                      isManager={true}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="rejected" className="mt-6">
                <div className="grid gap-6">
                  {getRequestsByStatus("rejected").map((request) => (
                    <LeaveRequestCard
                      key={request.id}
                      request={request}
                      onApprove={handleApprove}
                      onReject={handleReject}
                      isManager={true}
                    />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LeaveManagement;
