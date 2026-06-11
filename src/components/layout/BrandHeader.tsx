import { useState } from "react";
import {
  Bell,
  Check,
  Building2,
  TrendingUp,
  Package,
  Activity,
} from "lucide-react";

interface BrandNotificationItem {
  id: string;
  type: "branch" | "finance" | "stock" | "system";
  text: string;
  time: string;
  isRead: boolean;
  day: "today" | "yesterday";
}

type TimeFilterType = "all" | "today" | "yesterday";

export function BrandHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [timeFilter, setTimeFilter] = useState<TimeFilterType>("all");

  const [notifications, setNotifications] = useState<BrandNotificationItem[]>([
    {
      id: "brn-2",
      type: "finance",
      text: "Ciro Eşiği Aşıldı: Marka genelindeki toplam ciro bugün 1 Milyon ₺ barajını geçti.",
      time: "2 saat önce",
      day: "today",
      isRead: false,
    },
    {
      id: "brn-3",
      type: "stock",
      text: "Kritik Stok Uyarısı: 'Premium Keratin Şampuanı' Nişantaşı şubesinde tükendi!",
      time: "4 saat önce",
      day: "today",
      isRead: true,
    },
    {
      id: "brn-4",
      type: "system",
      text: "Sistem Raporu: Mayıs ayı marka performans analizi otomatik oluşturuldu.",
      time: "Dün",
      day: "yesterday",
      isRead: true,
    },
  ]);

  const unreadCount = notifications.filter((notif) => !notif.isRead).length;

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
      case "branch":
        return (
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
            <Building2 className="w-4 h-4" />
          </div>
        );
      case "finance":
        return (
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
            <TrendingUp className="w-4 h-4" />
          </div>
        );
      case "stock":
        return (
          <div className="p-2.5 bg-amber-50 text-amber-500 rounded-xl">
            <Package className="w-4 h-4" />
          </div>
        );
      default:
        return (
          <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl">
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
          Marka Yönetim Konsolu
        </h1>
        <p className="text-xs text-slate-400 font-bold tracking-widest mt-1 uppercase">
          Fiem Global Marka Performansı ve Franchise Takip Paneli
        </p>
      </div>

      <div className="flex items-center gap-4">
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
                  Marka Bildirimleri ({unreadCount})
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
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all cursor-pointer capitalize ${
                      timeFilter === filter
                        ? "bg-purple-50 text-purple-600"
                        : "text-slate-400 hover:bg-slate-50"
                    }`}
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
                    className={`p-3.5 flex items-start gap-3 transition-all cursor-pointer hover:bg-slate-50 ${
                      notif.isRead ? "opacity-45 bg-white" : "bg-purple-50/10"
                    }`}
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
                      "Tüm marka bildirimleri sayfasına yönlendiriliyorsunuz...",
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