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
} from "lucide-react";

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
  const hairdresserItems = [
    { id: "dashboard", label: "Kontrol Paneli", icon: LayoutDashboard },
    { id: "salon", label: "Salon Detayı", icon: Store },
    { id: "services", label: "Hizmetler", icon: Scissors },
    { id: "appointments", label: "Randevular", icon: CalendarDays },
    { id: "staff", label: "Çalışanlar", icon: Users },
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

  return (
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

      <div className="px-6">
        <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-3">
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
  );
};
