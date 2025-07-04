
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.tsx";
import Login from "./pages/Login";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import Employees from "./pages/Employees";
import OrganizationChart from "./pages/OrganizationChart";
import Events from "./pages/Events";
import News from "./pages/News";
import Calendar from "./pages/Calendar";
import Messages from "./pages/Messages";
import NotFound from "./pages/NotFound";
import LeaveManagement from "./pages/LeaveManagement";
import MyLeaveRequests from "./pages/MyLeaveRequests";
import Documents from "./pages/Documents";
import NewsDetail from "./pages/NewsDetail";
import AddEvent from "./pages/AddEvent";
import EditEvent from "./pages/EditEvent.tsx";
import Announcements from "./pages/Announcements"; // bu satırı en üste ekle





const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/organization-chart" element={<OrganizationChart />} />
          <Route path="/events" element={<Events />} />
          <Route path="/add-event" element={<AddEvent />} />
          <Route path="/edit-event/:id" element={<EditEvent />} />
          <Route path="/news" element={<News />} />
          <Route path="/news/:id" element={<NewsDetail />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/leave-management" element={<LeaveManagement />} />
          <Route path="/my-leave-requests" element={<MyLeaveRequests />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/announcements" element={<Announcements />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>

import { Provider } from 'react-redux';
import { store } from './store';
const queryClient = new QueryClient();

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/organization-chart" element={<OrganizationChart />} />
            <Route path="/events" element={<Events />} />
            <Route path="/add-event" element={<AddEvent />} />
            <Route path="/edit-event/:id" element={<EditEvent />} />
            <Route path="/news" element={<News />} />
            <Route path="/news/:id" element={<NewsDetail />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/leave-management" element={<LeaveManagement />} />
            <Route path="/my-leave-requests" element={<MyLeaveRequests />} />
            <Route path="/documents" element={<Documents />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;
