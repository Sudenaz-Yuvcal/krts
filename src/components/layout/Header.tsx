import React, { useState } from "react";
import {
  Bell,
  Wallet,
  ChevronDown,
  Check,
  Calendar,
  MessageSquare,
  AlertTriangle,
  TrendingDown,
  ShoppingBag,
  X,
  ShieldAlert,
} from "lucide-react";

interface NotificationItem {
  id: string;
  type:
    | "appointment"
    | "cancel"
    | "review"
    | "sale"
    | "stock"
    | "finance"
    | "report";
  text: string;
  time: string;
  isRead: boolean;
  day: "today" | "yesterday";
  date: string;
}

export const Header: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "n-1",
      type: "appointment",
      text: "Yeni randevu alındı: Melisa Y. (Fön & Kesim)",
      time: "10 dk önce",
      date: "22 Mayıs 2026",
      isRead: false,
      day: "today",
    },
    {
      id: "n-2",
      type: "cancel",
      text: "Randevu iptal edildi: Buse K. saat 15:30 randevusunu iptal etti.",
      time: "1 saat önce",
      date: "22 Mayıs 2026",
      isRead: false,
      day: "today",
    },
    {
      id: "n-3",
      type: "review",
      text: "Yeni yorum yapıldı: Ceren T. salonunuza 5 yıldız verdi.",
      time: "3 saat önce",
      date: "22 Mayıs 2026",
      isRead: false,
      day: "today",
    },
    {
      id: "n-4",
      type: "sale",
      text: "Ürün satıldı: 1 adet Keratin Şampuan satışı yapıldı.",
      time: "4 saat önce",
      date: "22 Mayıs 2026",
      isRead: true,
      day: "today",
    },
    {
      id: "n-5",
      type: "stock",
      text: "Stok azaldı! Saç açıcı pudra kritik seviyenin altında.",
      time: "Dün",
      date: "21 Mayıs 2026",
      isRead: false,
      day: "yesterday",
    },
    {
      id: "n-6",
      type: "finance",
      text: "Maliyet uyarısı: Karınız bu ay %4 düşüş eğiliminde.",
      time: "Dün",
      date: "21 Mayıs 2026",
      isRead: true,
      day: "yesterday",
    },
    {
      id: "n-7",
      type: "report",
      text: "Bu hafta olan raporunuz hazır, incelemek ister misiniz?",
      time: "2 gün önce",
      date: "20 Mayıs 2026",
      isRead: false,
      day: "yesterday",
    },
  ]);

  const [isOpen, setIsOpen] = useState(false); 
  const [isFullPageOpen, setIsFullPageOpen] = useState(false); 
  const [timeFilter, setTimeFilter] = useState<"all" | "today" | "yesterday">(
    "all",
  );
  const [fullPanelFilter, setFullPanelFilter] = useState<
    "all" | "unread" | "read"
  >("all");

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

  const fullPanelNotifications = notifications.filter((n) => {
    if (fullPanelFilter === "unread") return !n.isRead;
    if (fullPanelFilter === "read") return n.isRead;
    return true;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case "appointment":
        return (
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
            <Calendar className="w-4 h-4" />
          </div>
        );
      case "cancel":
        return (
          <div className="p-2.5 bg-rose-50 text-rose-500 rounded-xl">
            <X className="w-4 h-4" />
          </div>
        );
      case "review":
        return (
          <div className="p-2.5 bg-amber-50 text-amber-500 rounded-xl">
            <MessageSquare className="w-4 h-4" />
          </div>
        );
      case "sale":
        return (
          <div className="p-2.5 bg-blue-50 text-blue-500 rounded-xl">
            <ShoppingBag className="w-4 h-4" />
          </div>
        );
      case "stock":
        return (
          <div className="p-2.5 bg-orange-50 text-orange-500 rounded-xl">
            <AlertTriangle className="w-4 h-4" />
          </div>
        );
      case "finance":
        return (
          <div className="p-2.5 bg-red-50 text-red-500 rounded-xl">
            <TrendingDown className="w-4 h-4" />
          </div>
        );
      default:
        return (
          <div className="p-2.5 bg-purple-50 text-brand-purple rounded-xl">
            <Calendar className="w-4 h-4" />
          </div>
        );
    }
  };

  return (
    <header className="h-24 bg-transparent flex items-center justify-end px-12 z-20 relative">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3 bg-white border border-slate-100 px-4 py-2 rounded-xl shadow-2xs">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
            <Wallet className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[9px] text-slate-400 font-black uppercase tracking-wider">
              Kasa Durumu
            </div>
            <div className="text-xs font-bold text-slate-800">₺24,500.00</div>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2.5 bg-white rounded-xl border border-slate-100 shadow-2xs text-slate-400 hover:text-slate-700 transition-all relative cursor-pointer"
          >
            <Bell className="w-4.5 h-4.5" />
            {unreadCount > 0 && (
              <span className="w-2 h-2 bg-rose-500 rounded-full absolute top-2.5 right-2.5 ring-2 ring-white animate-pulse"></span>
            )}
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-3 w-80 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 overflow-hidden animate-fadeIn">
              <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                <span className="text-xs font-black text-slate-800">
                  Bildirimler ({unreadCount})
                </span>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-[10px] font-bold text-brand-purple hover:underline cursor-pointer flex items-center gap-0.5"
                  >
                    <Check className="w-3 h-3" /> Tümünü Okundu Say
                  </button>
                )}
              </div>

              <div className="p-2 border-b border-slate-50 flex gap-1 bg-white">
                <button
                  onClick={() => setTimeFilter("all")}
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all cursor-pointer ${timeFilter === "all" ? "bg-purple-50 text-brand-purple" : "text-slate-400 hover:bg-slate-50"}`}
                >
                  Tümü
                </button>
                <button
                  onClick={() => setTimeFilter("today")}
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all cursor-pointer ${timeFilter === "today" ? "bg-purple-50 text-brand-purple" : "text-slate-400 hover:bg-slate-50"}`}
                >
                  Bugün
                </button>
                <button
                  onClick={() => setTimeFilter("yesterday")}
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all cursor-pointer ${timeFilter === "yesterday" ? "bg-purple-50 text-brand-purple" : "text-slate-400 hover:bg-slate-50"}`}
                >
                  Dün
                </button>
              </div>

              <div className="max-h-64 overflow-y-auto divide-y divide-slate-50/60">
                {filteredNotifications.slice(0, 4).map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif.id)}
                    className={`p-3.5 flex items-start gap-3 transition-all cursor-pointer hover:bg-slate-50/60 ${notif.isRead ? "opacity-45 bg-white" : "bg-purple-50/10"}`}
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

              <div className="p-2.5 border-t border-slate-50 text-center bg-slate-50/30">
                <button
                  onClick={() => {
                    setIsFullPageOpen(true);
                    setIsOpen(false);
                  }}
                  className="w-full text-[11px] font-black text-slate-500 hover:text-brand-purple transition-all py-1.5 rounded-lg hover:bg-slate-100/60 cursor-pointer"
                >
                  Tümünü Gör
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 cursor-pointer group border-l border-slate-100 pl-4 py-1">
          <span className="text-xs font-black text-slate-700 group-hover:text-slate-900">
            krts
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </div>
      </div>

      {isFullPageOpen && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-md flex justify-end z-50 p-4 sm:p-6 animate-fadeIn">
          <div className="w-full max-w-4xl bg-white h-full rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-100 animate-slideLeft">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-purple-50 text-brand-purple rounded-xl">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-800 tracking-tight">
                    Tüm Bildirim Bildirimleri
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">
                    Salonunuzda gerçekleşen tüm hareketlerin detaylı listesi
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsFullPageOpen(false)}
                className="p-2 hover:bg-slate-200/60 rounded-xl text-slate-400 hover:text-slate-700 transition-all cursor-pointer border border-slate-200/40 bg-white shadow-2xs"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 border-b border-slate-100 bg-white flex flex-col sm:flex-row gap-4 items-center justify-between text-xs font-bold">
              <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200/40 w-full sm:w-auto">
                <button
                  onClick={() => setFullPanelFilter("all")}
                  className={`flex-1 sm:flex-none px-4 py-2 rounded-lg transition-all cursor-pointer ${fullPanelFilter === "all" ? "bg-white text-brand-purple shadow-xs" : "text-slate-500"}`}
                >
                  Tümü ({notifications.length})
                </button>
                <button
                  onClick={() => setFullPanelFilter("unread")}
                  className={`flex-1 sm:flex-none px-4 py-2 rounded-lg transition-all cursor-pointer ${fullPanelFilter === "unread" ? "bg-white text-rose-500 shadow-xs" : "text-slate-500"}`}
                >
                  Okunmamış ({notifications.filter((n) => !n.isRead).length})
                </button>
                <button
                  onClick={() => setFullPanelFilter("read")}
                  className={`flex-1 sm:flex-none px-4 py-2 rounded-lg transition-all cursor-pointer ${fullPanelFilter === "read" ? "bg-white text-emerald-600 shadow-xs" : "text-slate-500"}`}
                >
                  Okunanlar
                </button>
              </div>

              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="w-full sm:w-auto text-xs bg-purple-50 hover:bg-brand-purple hover:text-white text-brand-purple px-4 py-2 rounded-xl transition-all border border-purple-100 flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Check className="w-4 h-4" /> Tümünü Okundu Olarak İşaretle
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-slate-50/30 divide-y divide-transparent">
              {fullPanelNotifications.length === 0 ? (
                <div className="text-center py-24 text-sm font-medium text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
                  <ShieldAlert className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  Kriterlerinize uygun hiçbir bildirim kaydı bulunamadı.
                </div>
              ) : (
                fullPanelNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif.id)}
                    className={`p-4 rounded-2xl border border-slate-100/70 shadow-2xs flex items-center justify-between gap-4 transition-all cursor-pointer bg-white hover:border-purple-200 hover:shadow-xs group ${notif.isRead ? "opacity-45" : "bg-linear-to-r from-purple-50/15 to-transparent border-l-2 border-l-brand-purple"}`}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      {getIcon(notif.type)}
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-slate-700 leading-normal group-hover:text-slate-900">
                          {notif.text}
                        </p>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                          <span>{notif.date}</span>
                          <span>•</span>
                          <span>{notif.time}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      {!notif.isRead ? (
                        <span className="w-2 h-2 bg-brand-purple rounded-full block ring-4 ring-purple-100"></span>
                      ) : (
                        <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">
                          Okundu
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 mountaineer z-40 cursor-default"
          onClick={() => setIsOpen(false)}
        />
      )}
    </header>
  );
};
