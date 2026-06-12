"use client";
import { useState } from "react";
import {
  LayoutDashboard,
  Store,
  Scissors,
  CalendarDays,
  MessageSquare,
  Users,
  ShieldCheck,
  PackageCheck,
  Handshake,
  Award,
  BoxIcon,
  ContactRound,
  LogOut,
  Loader2,
  X,
} from "lucide-react";
import { supabase } from "../../lib/supabaseClient"; 

interface SidebarProps {
  userRole: "hairdresser" | "admin" | "brand";
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar = ({
  userRole,
  activeTab,
  setActiveTab,
}: SidebarProps) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const hairdresserItems = [
    { id: "dashboard", label: "Kontrol Paneli", icon: LayoutDashboard },
    { id: "salon", label: "Salon Detayı", icon: Store },
    { id: "services", label: "Hizmetler", icon: Scissors },
    { id: "appointments", label: "Randevular", icon: CalendarDays },
    { id: "employees", label: "Çalışanlar", icon: Users },
    { id: "reviews", label: "Yorumlar", icon: MessageSquare },
  ];

  const adminItems = [
    { id: "admin-dashboard", label: "Genel Bakış", icon: LayoutDashboard },
    { id: "admin-salons", label: "Kuaför Salonları", icon: Store },
    { id: "admin-users", label: "Müşteriler / Üyeler", icon: Users },
    { id: "admin-packages", label: "Platform Aboneliği", icon: PackageCheck },
    { id: "admin-brand", label: "Marka İşbirlikleri", icon: Handshake },
  ];

  const brandItems = [
    { id: "brand-dashboard", label: "Kontrol Paneli", icon: LayoutDashboard },
    { id: "brand-info", label: "Marka Özeti", icon: ContactRound },
    { id: "brand-products", label: "Ürünler", icon: Store },
    { id: "brand-orders", label: "Siparişler", icon: BoxIcon },
  ];

  const getCurrentMenuItems = () => {
    if (userRole === "admin") return adminItems;
    if (userRole === "brand") return brandItems;
    return hairdresserItems;
  };

  const currentMenuItems = getCurrentMenuItems();

  const getRoleIndicatorData = () => {
    switch (userRole) {
      case "admin":
        return {
          bgClass: "bg-amber-50 text-amber-600",
          icon: <ShieldCheck className="w-4 h-4" />,
          title: "Admin",
        };
      case "brand":
        return {
          bgClass: "bg-purple-50 text-purple-600",
          icon: <Award className="w-4 h-4" />,
          title: "Marka Sahibi",
        };
      default:
        return {
          bgClass: "bg-emerald-50 text-emerald-600",
          icon: <Users className="w-4 h-4" />,
          title: "Kuaför Yetkilisi",
        };
    }
  };

  const roleData = getRoleIndicatorData();

  const handleLogout = async () => {
    if (logoutLoading) return;
    setLogoutLoading(true);

    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      const nextJsMainSiteUrl = "http://localhost:3000/"; 

      window.location.replace(nextJsMainSiteUrl);
    } catch (error: any) {
      console.error("Çıkış işlemi başarısız:", error.message);
      setLogoutLoading(false);
    }
  };

  return (
    <>
      <aside className="w-72 h-screen bg-white border-r border-slate-100/80 fixed left-0 top-0 flex flex-col justify-between py-8 z-40">
        <div className="space-y-10">
          <div className="flex items-center gap-3 px-8">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 flex items-center justify-center overflow-hidden">
              <img
                src="src/assets/krtsLogo.png"
                alt="Krts"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-slate-800 leading-none">
                KRTS
              </h1>
              <span className="text-[10px] font-black tracking-widest text-purple-600 uppercase block mt-1">
                {userRole === "admin"
                  ? "YÖNETİCİ PANELİ"
                  : userRole === "brand"
                    ? "MARKA PANELİ"
                    : "KUAFÖR PANELİ"}
              </span>
            </div>
          </div>

          <nav className="space-y-1 px-4">
            {currentMenuItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-black tracking-wide transition-all duration-200 cursor-pointer group ${
                    isActive
                      ? "bg-purple-50 text-purple-600 shadow-2xs"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                  }`}
                >
                  <IconComponent
                    className={`w-4.5 h-4.5 transition-transform group-hover:scale-105 ${
                      isActive
                        ? "text-purple-600"
                        : "text-slate-400 group-hover:text-slate-600"
                    }`}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="px-4 space-y-2">
          <button
            onClick={() => setShowConfirmModal(true)}
            className="w-full flex items-center gap-3.5 px-6 py-3 rounded-xl text-xs font-black tracking-wide text-red-500 hover:bg-red-50 transition-all duration-200 cursor-pointer group"
          >
            <LogOut className="w-4.5 h-4.5 text-red-400 group-hover:text-red-500 transition-transform group-hover:translate-x-0.5" />
            <span>Sistemden Çıkış Yap</span>
          </button>

          <div className="mx-2 p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-3">
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-2xs ${roleData.bgClass}`}
            >
              {roleData.icon}
            </div>
            <div>
              <span className="text-[10px] font-black text-slate-400 tracking-wider block uppercase leading-none">
                Aktif Rol
              </span>
              <span className="text-xs font-black text-slate-700 block mt-1 capitalize">
                {roleData.title}
              </span>
            </div>
          </div>
        </div>
      </aside>

      {showConfirmModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-100 relative space-y-5 animate-in zoom-in-95 duration-200">
        
            <button 
              onClick={() => !logoutLoading && setShowConfirmModal(false)}
              disabled={logoutLoading}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer disabled:opacity-50"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-500 shrink-0">
                <LogOut className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-800">Çıkış Yapılsın mı?</h3>
                <p className="text-xs font-medium text-slate-500 mt-0.5">Mevcut oturumunuz sonlandırılacaktır.</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 pt-1">
              <button
                onClick={() => setShowConfirmModal(false)}
                disabled={logoutLoading}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-black text-slate-600 hover:bg-slate-50 transition-all cursor-pointer disabled:opacity-50"
              >
                Vazgeç
              </button>
              <button
                onClick={handleLogout}
                disabled={logoutLoading}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-xs font-black text-white hover:bg-red-600 shadow-sm shadow-red-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {logoutLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Çıkılıyor...</span>
                  </>
                ) : (
                  <span>Evet, Çık</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};