import { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { Sidebar } from "./components/layout/Sidebar";

// Header Bileşenleri
import { AdminHeader } from "./components/layout/AdminHeader";
import { HairdresserHeader } from "./components/layout/HairdresserHeader";
import { BrandHeader } from "./components/layout/BrandHeader";

// Sayfalar
import { AdminDashboardView } from "./pages/AdminPanel/AdminDashboard";
import { SalonsManagementView } from "./pages/AdminPanel/SalonsManagement";
import { PackagesView } from "./pages/AdminPanel/Packages";
import { UsersManagementView } from "./pages/AdminPanel/UsersManagement";
import { BrandPartnershipsView } from "./pages/AdminPanel/BrandPartnerships";

import { Dashboard } from "./pages/HairdresserPanel/Dashboard";
import { SalonDetails } from "./pages/HairdresserPanel/SalonDetails";
import { Services } from "./pages/HairdresserPanel/Services";
import { Appointments } from "./pages/HairdresserPanel/Appointments";
import { Reviews } from "./pages/HairdresserPanel/Reviews";
import { EmployeesDetail } from "./pages/HairdresserPanel/Employees";

import { BrandInfo } from "./pages/BrandPanel/BrandInfo";
import BrandProducts from "./pages/BrandPanel/BrandProducts";
import BrandOrders from "./pages/BrandPanel/BrandOrders";
import BrandDashboard from "./pages/BrandPanel/BrandDashboard";
import { supabase } from "./lib/supabaseClient";
import { Loader2, AlertCircle } from "lucide-react";

type DynamicRole = "hairdresser" | "admin" | "brand";

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [userRole, setUserRole] = useState<DynamicRole | null>(null);
  const [appLoading, setAppLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleTabChange = (tabName: string) => {
    if (!userRole) return;
    if (userRole === "admin")
      navigate(`/admin/${tabName.replace("admin-", "")}`);
    else if (userRole === "brand")
      navigate(`/brand/${tabName.replace("brand-", "")}`);
    else if (userRole === "hairdresser") navigate(`/${tabName}`);
  };

  const getActiveTabFromUrl = () => {
    const path = location.pathname;
    if (path.startsWith("/admin/"))
      return `admin-${path.replace("/admin/", "")}`;
    if (path.startsWith("/brand/"))
      return `brand-${path.replace("/brand/", "")}`;
    if (path === "/" || path === "/dashboard") return "dashboard";
    return path.replace("/", "");
  };

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        console.log(
          "🔄 Supabase oturumu kontrol ediliyor... Mevcut URL:",
          location.pathname,
        );

        // 🚀 URL'den Next.js'in gönderdiği token'ları ayıkla
        const urlParams = new URLSearchParams(window.location.search);
        const accessToken = urlParams.get("access_token");
        const refreshToken = urlParams.get("refresh_token");

        let currentSession = null;

        // Eğer URL'de token varsa, önce zorunlu oturum eşlemesini BEKLE (await)
        if (accessToken && refreshToken) {
          console.log(
            "✈️ Next.js'ten gelen token'lar yakalandı! Supabase hafızasına zorla yazılıyor...",
          );

          const { data: setSessionData, error: setSessionError } =
            await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });

          if (setSessionError) throw setSessionError;

          // Oturum başarıyla kurulduysa güncel session nesnesini al
          currentSession = setSessionData.session;

          // URL'deki çirkin parametreleri hemen temizle
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname,
          );
        } else {
          // Eğer URL'de hazır token yoksa standart akışta mevcut aktif oturumu çek
          const {
            data: { session },
            error: sessionError,
          } = await supabase.auth.getSession();
          if (sessionError) throw sessionError;
          currentSession = session;
        }

        // Oturum kontrolü
        if (!currentSession?.user) {
          console.error(
            "🚨 KRİTİK: Supabase üzerinde aktif bir user session bulunamadı!",
          );
          setErrorMessage(
            "Supabase Oturumu Yok! Tarayıcıda token bulunamadı veya oturum süresi dolmuş.",
          );
          return;
        }

        console.log("✅ Kullanıcı bulundu, ID:", currentSession.user.id);

        // Kullanıcı rolünü veritabanından çekiyoruz
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", currentSession.user.id)
          .maybeSingle();

        if (profileError) throw profileError;

        if (!profile) {
          console.error(
            `🚨 KRİTİK: Auth tablosunda kullanıcı var (${currentSession.user.id}) ama 'profiles' tablosunda karşılığı yok!`,
          );
          setErrorMessage(
            `Kullanıcı auth sisteminde var fakat 'profiles' tablosunda kaydı bulunamadı.`,
          );
          return;
        }

        console.log("✅ Veritabanından gelen saf rol:", profile.role);

        let dynamicRole: DynamicRole | null = null;
        if (profile.role === "salon" || profile.role === "hairdresser") {
          dynamicRole = "hairdresser";
        } else if (profile.role === "admin") {
          dynamicRole = "admin";
        } else if (profile.role === "brand") {
          dynamicRole = "brand";
        }

        if (dynamicRole) {
          console.log("🎯 Eşleşen dinamik rol:", dynamicRole);
          setUserRole(dynamicRole);

          // Eğer ana dizindeysek, rolüne göre doğru alt panele fırlat
          if (location.pathname === "/" || location.pathname === "") {
            if (dynamicRole === "admin")
              navigate("/admin/dashboard", { replace: true });
            else if (dynamicRole === "brand")
              navigate("/brand/dashboard", { replace: true });
            else navigate("/dashboard", { replace: true });
          }
        } else {
          setErrorMessage(
            `Veritabanından gelen '${profile.role}' rolü sistemle uyuşmuyor.`,
          );
        }
      } catch (error: any) {
        console.error("🚨 YAKALANAN HATA:", error);
        setErrorMessage(
          error.message || "Yetkilendirme aşamasında bir sorun oluştu.",
        );
      } finally {
        setAppLoading(false);
      }
    };

    checkUserSession();
  }, []);

  if (errorMessage) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-900 p-6 text-center text-white">
        <div className="bg-slate-800 p-8 rounded-3xl shadow-2xl max-w-xl border border-red-500/30 flex flex-col items-center gap-4">
          <AlertCircle className="w-16 h-16 text-red-500 animate-bounce" />
          <h2 className="text-xl font-black uppercase tracking-wider text-red-400">
            Yönlendirme Kilitlendi / Hata Yakalandı
          </h2>
          <div className="text-left w-full bg-slate-950 p-4 rounded-xl border border-slate-700 font-mono text-xs text-emerald-400 overflow-x-auto max-h-60 whitespace-pre-wrap">
            {errorMessage}
          </div>
          <p className="text-xs text-slate-400">
            Şu an Next.js'e kaçış engellendi. Lütfen tarayıcıda sağ tıklayıp{" "}
            <b>İncele Console (Konsol)</b> sekmesini aç ve yukarıdaki logları
            oku!
          </p>
        </div>
      </div>
    );
  }

  if (appLoading || !userRole) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 gap-3">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
        <span className="text-xs font-black text-slate-400 tracking-widest uppercase">
          Giriş Bilgileri Doğrulanıyor...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-base text-slate-800 flex w-full overflow-x-hidden font-sans antialiased">
      <Sidebar
        userRole={userRole}
        activeTab={getActiveTabFromUrl()}
        setActiveTab={handleTabChange}
      />

      <div className="flex-1 pl-72 flex flex-col min-h-screen w-full">
        {userRole === "admin" && (
          <AdminHeader setUserRole={(role) => setUserRole(role as any)} />
        )}
        {userRole === "brand" && (
          <BrandHeader setUserRole={(role) => setUserRole(role as any)} />
        )}
        {userRole === "hairdresser" && (
          <HairdresserHeader setUserRole={(role) => setUserRole(role as any)} />
        )}

        <main className="flex-1 px-12 pb-12 w-full pt-12">
          <Routes>
            <Route
              path="/"
              element={
                userRole === "admin" ? (
                  <Navigate to="/admin/dashboard" replace />
                ) : userRole === "brand" ? (
                  <Navigate to="/brand/dashboard" replace />
                ) : (
                  <Navigate to="/dashboard" replace />
                )
              }
            />

            {/* ADMİN PANELİ ROTASI */}
            {userRole === "admin" && (
              <>
                <Route
                  path="/admin/dashboard"
                  element={<AdminDashboardView />}
                />
                <Route
                  path="/admin/salons"
                  element={<SalonsManagementView />}
                />
                <Route path="/admin/packages" element={<PackagesView />} />
                <Route path="/admin/users" element={<UsersManagementView />} />
                <Route
                  path="/admin/brand"
                  element={<BrandPartnershipsView />}
                />
              </>
            )}

            {/* KUAFÖR PANELİ ROTASI */}
            {userRole === "hairdresser" && (
              <>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/salon" element={<SalonDetails />} />
                <Route path="/services" element={<Services />} />
                <Route path="/appointments" element={<Appointments />} />
                <Route path="/reviews" element={<Reviews />} />
                <Route
                  path="/employees"
                  element={
                    <EmployeesDetail
                      selectedStaff={
                        location.state?.selectedStaff || {
                          id: "",
                          name: "Yükleniyor...",
                          role: "",
                          status: "",
                          rating: 0,
                          activeAppointments: 0,
                          revenue: 0,
                        }
                      }
                      allServices={location.state?.allServices || []}
                      onBackClick={() => navigate(-1)}
                    />
                  }
                />
              </>
            )}

            {/* MARKA PANELİ ROTASI */}
            {userRole === "brand" && (
              <>
                <Route path="/brand/dashboard" element={<BrandDashboard />} />
                <Route path="/brand/info" element={<BrandInfo />} />
                <Route path="/brand/products" element={<BrandProducts />} />
                <Route path="/brand/orders" element={<BrandOrders />} />
              </>
            )}

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
