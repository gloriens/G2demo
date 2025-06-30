
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

const MyLeaveRequests = () => {
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [myLeaveRequests, setMyLeaveRequests] = useState<LeaveRequest[]>([
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
      employeeName: "Ahmet Yılmaz",
      startDate: "2023-12-25",
      endDate: "2023-12-29",
      leaveType: "annual",
      reason: "Yılbaşı tatili.",
      emergencyContact: "0532 123 45 67",
      requestDate: "2023-12-01",
      status: "approved"
    },
    {
      id: 3,
      employeeName: "Ahmet Yılmaz",
      startDate: "2024-02-10",
      endDate: "2024-02-12",
      leaveType: "personal",
      reason: "Kişisel işlerim için izin talep ediyorum.",
      emergencyContact: "0532 123 45 67",
      requestDate: "2024-01-20",
      status: "rejected",
      rejectionReason: "Bu tarihler arasında önemli bir proje teslimi var. Lütfen farklı bir tarih seçin."
    }
  ]);

  const handleNewRequest = (requestData: LeaveRequest) => {
    setMyLeaveRequests([...myLeaveRequests, requestData]);
    setShowRequestForm(false);
  };

  const getRequestsByStatus = (status: string) => {
    return myLeaveRequests.filter(req => req.status === status);
  };

  const getRequestStats = () => {
    return {
      total: myLeaveRequests.length,
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
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">İzin Taleplerim</h2>
                  <p className="text-gray-600">Kendi izin taleplerinizi görüntüleyin ve yeni talep oluşturun</p>
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
                  {myLeaveRequests.map((request) => (
                    <LeaveRequestCard
                      key={request.id}
                      request={request}
                      onApprove={() => {}}
                      onReject={() => {}}
                      isManager={false}
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
                      onApprove={() => {}}
                      onReject={() => {}}
                      isManager={false}
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
                      onApprove={() => {}}
                      onReject={() => {}}
                      isManager={false}
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
                      onApprove={() => {}}
                      onReject={() => {}}
                      isManager={false}
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

export default MyLeaveRequests;
