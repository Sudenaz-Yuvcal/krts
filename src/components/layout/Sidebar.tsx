import { useState } from "react"; 
import {
  LayoutDashboard,
  Store,
  Scissors,
  CalendarDays,
  MessageSquare,
  ShoppingBag,
  Users,
  LogOut,
  AlertTriangle,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar = ({ activeTab, setActiveTab }: SidebarProps) => {
  const navigate = useNavigate();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const menuItems = [
    { id: "dashboard", label: "Kontrol Paneli", icon: LayoutDashboard },
    { id: "salon", label: "Salon Detayı", icon: Store },
    { id: "services", label: "Hizmetler", icon: Scissors },
    { id: "appointments", label: "Randevular", icon: CalendarDays },
    { id: "staff", label: "Çalışanlar", icon: Users },
    { id: "reviews", label: "Yorumlar", icon: MessageSquare },
    { id: "products", label: "Ürünler", icon: ShoppingBag },
  ];

  const handleLogout = () => {
    setIsConfirmOpen(false);
    navigate("/");
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
              <span className="text-[10px] font-black tracking-widest text-brand-purple uppercase block mt-1">
                KUAFÖR PANELİ
              </span>
            </div>
          </div>

          <nav className="space-y-1 px-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-bold tracking-tight transition-all duration-200 relative cursor-pointer ${
                    isActive
                      ? "bg-purple-50/70 text-brand-purple"
                      : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <Icon
                      className={`w-5 h-5 ${isActive ? "text-brand-purple" : "text-slate-400"}`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {isActive && (
                    <div className="w-1 h-5 bg-brand-purple rounded-full absolute right-0 top-1/2 -translate-y-1/2" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="px-4 border-t border-slate-100 pt-6">
          <button
            onClick={() => setIsConfirmOpen(true)} 
            className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-sm font-bold tracking-tight text-red-500 hover:bg-red-50 transition-all duration-200 cursor-pointer"
          >
            <LogOut className="w-5 h-5 text-red-500" />
            <span>Çıkış Yap</span>
          </button>
        </div>
      </aside>

      {isConfirmOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-slate-100 relative mx-4 transform transition-all scale-100">
            <button
              onClick={() => setIsConfirmOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 rounded-full p-1 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="flex flex-col items-center text-center mt-2">
              <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-500 mb-4">
                <AlertTriangle size={24} />
              </div>

              <h3 className="text-lg font-black text-slate-800 tracking-tight">
                Oturumu Kapat
              </h3>
              <p className="text-slate-500 text-sm mt-2 px-2 font-medium leading-relaxed">
                Hesabınızdan çıkış yapmak istediğinize emin misiniz? Mevcut
                oturumunuz sonlandırılacaktır.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6">
              <button
                onClick={() => setIsConfirmOpen(false)}
                className="w-full py-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold text-sm tracking-tight transition-all cursor-pointer"
              >
                Vazgeç
              </button>
              <button
                onClick={handleLogout}
                className="w-full py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm tracking-tight shadow-md shadow-red-500/20 transition-all cursor-pointer"
              >
                Çıkış Yap
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
