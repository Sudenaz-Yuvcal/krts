import { useState } from "react";
import {
  Bell,
  Check,
  Server,
  UserPlus,
  TrendingDown,
  AlertTriangle,
  Activity,
} from "lucide-react";

interface NotificationItem {
  id: string;
  type: "system" | "user_reg" | "finance" | "stock";
  text: string;
  time: string;
  isRead: boolean;
  day: "today" | "yesterday";
  date: string;
}

interface AdminHeaderProps {
  setUserRole: React.Dispatch<
    React.SetStateAction<"hairdresser" | "admin" | "brand">
  >;
}

type TimeFilterType = "all" | "today" | "yesterday";

export function AdminHeader({ setUserRole }: AdminHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [timeFilter, setTimeFilter] = useState<TimeFilterType>("all");

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "adm-1",
      type: "user_reg",
      text: "Yeni Salon Kaydı: 'Lansman Güzellik Salonu' sisteme entegre oldu.",
      time: "5 dk önce",
      date: "22 Mayıs 2026",
      isRead: false,
      day: "today",
    },
    {
      id: "adm-2",
      type: "finance",
      text: "Yüksek Ciro Limiti: Günlük ekosistem işlem hacmi %20 arttı.",
      time: "2 saat önce",
      date: "22 Mayıs 2026",
      isRead: false,
      day: "today",
    },
    {
      id: "adm-3",
      type: "system",
      text: "Sistem Modül Güncellemesi: Veritabanı optimizasyonu başarıyla tamamlandı.",
      time: "4 saat önce",
      date: "22 Mayıs 2026",
      isRead: true,
      day: "today",
    },
    {
      id: "adm-4",
      type: "stock",
      text: "SMS Paketi Uyarısı: Sistem genelindeki SMS havuzu %15'in altına düştü.",
      time: "Dün",
      date: "21 Mayıs 2026",
      isRead: true,
      day: "yesterday",
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleNotificationClick = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const filteredNotifications = notifications.filter(
    (n) => timeFilter === "all" || n.day === timeFilter,
  );

  const getIcon = (type: string) => {
    switch (type) {
      case "system":
        return (
          <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl">
            <Server className="w-4 h-4" />
          </div>
        );
      case "user_reg":
        return (
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
            <UserPlus className="w-4 h-4" />
          </div>
        );
      case "finance":
        return (
          <div className="p-2.5 bg-red-50 text-red-500 rounded-xl">
            <TrendingDown className="w-4 h-4" />
          </div>
        );
      case "stock":
        return (
          <div className="p-2.5 bg-orange-50 text-orange-500 rounded-xl">
            <AlertTriangle className="w-4 h-4" />
          </div>
        );
      default:
        return (
          <div className="p-2.5 bg-slate-50 text-slate-600 rounded-xl">
            <Activity className="w-4 h-4" />
          </div>
        );
    }
  };

  const filterOptions: TimeFilterType[] = ["all", "today", "yesterday"];

  return (
    <header className="h-24 bg-slate-50 border-b border-slate-200 backdrop-blur-md flex items-center justify-between px-12 z-20 relative w-full">
      <div>
        <h1 className="text-xl font-black text-slate-800 tracking-tight uppercase leading-none">
          Admin Konsolu
        </h1>
        <p className="text-xs text-slate-400 font-bold tracking-widest mt-1 uppercase">
          Yüksek Segment Ekosistem Cirosu ve Pazar Yeri Takibi
        </p>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => setUserRole("brand")}
          className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-xs hover:border-purple-200 hover:text-purple-600 transition-all group cursor-pointer h-11 shrink-0"
        >
          <span className="text-xs font-black text-slate-600 group-hover:text-purple-600 transition-colors">
            Marka Paneline Geç →
          </span>
        </button>

        <div className="relative z-50">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-xs text-slate-400 hover:text-slate-700 transition-all relative cursor-pointer h-11 w-11 flex items-center justify-center shrink-0"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="w-2 h-2 bg-rose-500 rounded-full absolute top-3 right-3 ring-2 ring-white animate-pulse"></span>
            )}
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-3 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden flex flex-col">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <span className="text-xs font-black text-slate-800">
                  Sistem Bildirimleri ({unreadCount})
                </span>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-[10px] font-bold text-purple-600 hover:underline cursor-pointer flex items-center gap-0.5"
                  >
                    <Check className="w-3 h-3" /> Tümünü Okundu Say
                  </button>
                )}
              </div>
              <div className="p-2 border-b border-slate-100 flex gap-1 bg-white">
                {filterOptions.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setTimeFilter(filter)}
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all cursor-pointer capitalize ${timeFilter === filter ? "bg-purple-50 text-purple-600" : "text-slate-400 hover:bg-slate-50"}`}
                  >
                    {filter === "all"
                      ? "Tümü"
                      : filter === "today"
                        ? "Bugün"
                        : "Dün"}
                  </button>
                ))}
              </div>

              <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
                {filteredNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif.id)}
                    className={`p-3.5 flex items-start gap-3 transition-all cursor-pointer hover:bg-slate-50 ${notif.isRead ? "opacity-45 bg-white" : "bg-purple-50/10"}`}
                  >
                    {getIcon(notif.type)}
                    <div className="flex-1 space-y-0.5">
                      <p className="text-[11px] font-semibold text-slate-700 leading-snug">
                        {notif.text}
                      </p>
                      <span className="text-[9px] text-slate-400 block font-medium">
                        {notif.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
                <button
                  onClick={() => {
                    alert(
                      "Tüm sistem bildirimleri sayfasına yönlendiriliyorsunuz...",
                    );
                    setIsOpen(false);
                  }}
                  className="w-full text-[11px] font-black text-purple-600 hover:text-purple-700 bg-white border border-slate-200 py-2 rounded-xl transition-all cursor-pointer shadow-2xs hover:border-purple-200"
                >
                  Tüm Bildirimleri Gör
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
