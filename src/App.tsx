import { useState, useEffect } from "react";
import { supabase } from "./lib/supabaseClient";

import { Sidebar } from "./components/layout/Sidebar";
import { AdminHeader } from "./components/layout/AdminHeader";
import { HairdresserHeader } from "./components/layout/HairdresserHeader";
import { BrandHeader } from "./components/layout/BrandHeader";

import { Dashboard } from "./pages/HairdresserPanel/Dashboard";
import { SalonDetails } from "./pages/HairdresserPanel/SalonDetails";
import { Services } from "./pages/HairdresserPanel/Services";
import { Appointments } from "./pages/HairdresserPanel/Appointments";
import { EmployeesDetail } from "./pages/HairdresserPanel/Employees";
import { Reviews } from "./pages/HairdresserPanel/Reviews";

import { AdminDashboardView } from "./pages/AdminPanel/AdminDashboard";
import { SalonsManagementView } from "./pages/AdminPanel/SalonsManagement";
import { PackagesView } from "./pages/AdminPanel/Packages";
import { UsersManagementView } from "./pages/AdminPanel/UsersManagement";
import { BrandPartnershipsView } from "./pages/AdminPanel/BrandPartnerships";

import { BrandInfo } from "./pages/BrandPanel/BrandInfo";
import BrandProducts from "./pages/BrandPanel/BrandProducts";
import BrandOrders from "./pages/BrandPanel/BrandOrders";
import BrandDashboard from "./pages/BrandPanel/BrandDashboard";

interface ServiceItem {
  id: string;
  name: string;
  category: string;
}
interface DbShift {
  id?: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  is_active: boolean;
}
interface SelectedStaff {
  id: string | number;
  name: string;
  role: string;
  phone: string;
  status: string;
  img?: string;
  rating: number;
  activeAppointments: number;
  revenue: string | number;
  services?: string[];
  dbShifts?: DbShift[];
}

export default function App() {
  const [userRole, setUserRole] = useState<
    "hairdresser" | "admin" | "brand" | null
  >(null);
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [loading, setLoading] = useState<boolean>(true);

  const [selectedStaffData, setSelectedStaffData] =
    useState<SelectedStaff | null>(null);
  const [servicesList] = useState<ServiceItem[]>([]);

  useEffect(() => {
    const handleAuthAndRole = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const accessToken = urlParams.get("access_token");
        const refreshToken = urlParams.get("refresh_token");

        if (accessToken && refreshToken) {
          const { data: _sessionData, error: sessionError } =
            await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });

          if (sessionError) throw sessionError;

          window.history.replaceState(
            {},
            document.title,
            window.location.pathname,
          );
        }

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          window.location.href = "http://localhost:3000/login"; 
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();

        if (profileError || !profile) {
          throw new Error("Profil rolü okunamadı.");
        }

        const role = profile.role as
          | "admin"
          | "brand"
          | "salon"
          | "hairdresser";

        if (role === "admin") {
          setUserRole("admin");
          setActiveTab("admin-dashboard");
        } else if (role === "brand") {
          setUserRole("brand");
          setActiveTab("brand-dashboard");
        } else {
          setUserRole("hairdresser");
          setActiveTab("dashboard");
        }
      } catch (err) {
        console.error("Auth hatası:", err);
      } finally {
        setLoading(false);
      }
    };

    handleAuthAndRole();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-base">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-slate-800"></div>
      </div>
    );
  }

  const renderContent = () => {
    if (userRole === "admin") {
      switch (activeTab) {
        case "admin-dashboard":
          return <AdminDashboardView />;
        case "admin-salons":
          return <SalonsManagementView />;
        case "admin-packages":
          return <PackagesView />;
        case "admin-users":
          return <UsersManagementView />;
        case "admin-brand":
          return <BrandPartnershipsView />;
        default:
          return <AdminDashboardView />;
      }
    }

    if (userRole === "brand") {
      switch (activeTab) {
        case "brand-dashboard":
          return <BrandDashboard />;
        case "brand-info":
          return <BrandInfo />;
        case "brand-products":
          return <BrandProducts />;
        case "brand-orders":
          return <BrandOrders />;
        default:
          return <BrandDashboard />;
      }
    }

    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "salon":
        return <SalonDetails />;
      case "services":
        return <Services />;
      case "appointments":
        return <Appointments />;
      case "staff":
        if (selectedStaffData) {
          return (
            <EmployeesDetail
              selectedStaff={selectedStaffData}
              allServices={servicesList}
              onBackClick={() => setSelectedStaffData(null)}
            />
          );
        }
        return <Dashboard />;
      case "reviews":
        return <Reviews />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-brand-base text-slate-800 flex w-full overflow-x-hidden font-sans antialiased">
      {userRole && (
        <Sidebar
          userRole={userRole}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      )}

      <div className="flex-1 pl-72 flex flex-col min-h-screen w-full">
        {userRole === "admin" && <AdminHeader />}
        {userRole === "brand" && <BrandHeader />}
        {userRole === "hairdresser" && <HairdresserHeader />}

        <main className="flex-1 px-12 pb-12 w-full pt-12">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
