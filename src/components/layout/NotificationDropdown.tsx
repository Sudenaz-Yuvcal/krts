import { useState } from "react";
import { Check, Calendar, X, MessageSquare, ShoppingBag, AlertTriangle, TrendingDown, Bell, ShieldAlert } from "lucide-react";

interface NotificationItem {
  id: string;
  type: "appointment" | "cancel" | "review" | "sale" | "stock" | "finance" | "report";
  text: string;
  time: string;
  isRead: boolean;
  day: "today" | "yesterday";
  date: string;
}

interface NotificationDropdownProps {
  unreadCount: number;
  onClose: () => void;
}

export function NotificationDropdown({ unreadCount, onClose }: NotificationDropdownProps) {
  const [isFullPageOpen, setIsFullPageOpen] = useState(false);
  const [timeFilter, setTimeFilter] = useState<"all" | "today" | "yesterday">("all");
  const [fullPanelFilter, setFullPanelFilter] = useState<"all" | "unread" | "read">("all");

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    { id: "n-1", type: "appointment", text: "Yeni randevu alındı: Melisa Y. (Fön & Kesim)", time: "10 dk önce", date: "22 Mayıs 2026", isRead: false, day: "today" },
    { id: "n-2", type: "cancel", text: "Randevu iptal edildi: Buse K. saat 15:30 randevusunu iptal etti.", time: "1 saat önce", date: "22 Mayıs 2026", isRead: false, day: "today" },
    { id: "n-3", type: "review", text: "Yeni yorum yapıldı: Ceren T. salonunuza 5 yıldız verdi.", time: "3 saat önce", date: "22 Mayıs 2026", isRead: false, day: "today" },
    { id: "n-4", type: "sale", text: "Ürün satıldı: 1 adet Keratin Şampuan satışı yapıldı.", time: "4 saat önce", date: "22 Mayıs 2026", isRead: true, day: "today" },
    { id: "n-5", type: "stock", text: "Kritik Stok Uyarı: Saç Açıcı Pudra stokta 2 adet kaldı!", time: "Dün", date: "21 Mayıs 2026", isRead: true, day: "yesterday" },
  ]);

  const handleNotificationClick = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const getIcon = (type: string) => {
    const iconClasses = "p-2.5 rounded-xl";
    switch (type) {
      case "appointment": return <div className={`${iconClasses} bg-emerald-50 text-emerald-600`}><Calendar className="w-4 h-4" /></div>;
      case "cancel": return <div className={`${iconClasses} bg-rose-50 text-rose-500`}><X className="w-4 h-4" /></div>;
      case "review": return <div className={`${iconClasses} bg-amber-50 text-amber-500`}><MessageSquare className="w-4 h-4" /></div>;
      case "sale": return <div className={`${iconClasses} bg-blue-50 text-blue-500`}><ShoppingBag className="w-4 h-4" /></div>;
      case "stock": return <div className={`${iconClasses} bg-orange-50 text-orange-500`}><AlertTriangle className="w-4 h-4" /></div>;
      case "finance": return <div className={`${iconClasses} bg-red-50 text-red-500`}><TrendingDown className="w-4 h-4" /></div>;
      default: return <div className={`${iconClasses} bg-purple-50 text-purple-600`}><Calendar className="w-4 h-4" /></div>;
    }
  };

  const filteredNotifications = notifications.filter(n => timeFilter === "all" || n.day === timeFilter);
  const fullPanelNotifications = notifications.filter(n => {
    if (fullPanelFilter === "unread") return !n.isRead;
    if (fullPanelFilter === "read") return n.isRead;
    return true;
  });

  return (
    <>
      <div className="absolute right-0 mt-3 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <span className="text-xs font-black text-slate-800">Bildirimler ({unreadCount})</span>
          {unreadCount > 0 && (
            <button onClick={handleMarkAllAsRead} className="text-[10px] font-bold text-purple-600 hover:underline cursor-pointer flex items-center gap-0.5">
              <Check className="w-3 h-3" /> Tümünü Okundu Say
            </button>
          )}
        </div>
        
        <div className="p-2 border-b border-slate-100 flex gap-1 bg-white">
          {(["all", "today", "yesterday"] as const).map(filter => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all cursor-pointer capitalize ${timeFilter === filter ? "bg-purple-50 text-purple-600" : "text-slate-400 hover:bg-slate-50"}`}
            >
              {filter === "all" ? "Tümü" : filter === "today" ? "Bugün" : "Dün"}
            </button>
          ))}
        </div>

        <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
          {filteredNotifications.slice(0, 4).map(notif => (
            <div
              key={notif.id}
              onClick={() => handleNotificationClick(notif.id)}
              className={`p-3.5 flex items-start gap-3 transition-all cursor-pointer hover:bg-slate-50 ${notif.isRead ? "opacity-45 bg-white" : "bg-purple-50/10"}`}
            >
              {getIcon(notif.type)}
              <div className="flex-1 space-y-0.5">
                <p className="text-[11px] font-semibold text-slate-700 leading-snug">{notif.text}</p>
                <span className="text-[9px] text-slate-400 block font-medium">{notif.time}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="p-2.5 border-t border-slate-100 text-center bg-slate-50/30">
          <button
            onClick={() => { setIsFullPageOpen(true); onClose(); }}
            className="w-full text-[11px] font-black text-slate-500 hover:text-purple-600 transition-all py-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            Tümünü Gör
          </button>
        </div>
      </div>

      {isFullPageOpen && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-md flex justify-end z-99999 p-6">
          <div className="w-full max-w-4xl bg-white h-full rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-100">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl"><Bell className="w-5 h-5" /></div>
                <div>
                  <h3 className="text-lg font-black text-slate-800 tracking-tight">Tüm Bildirim Geçmişi</h3>
                  <p className="text-xs text-slate-400 font-medium">Salonunuzdaki hareketlerin filtreli ve detaylı tam listesi</p>
                </div>
              </div>
              <button onClick={() => setIsFullPageOpen(false)} className="p-2 hover:bg-slate-200/60 rounded-xl text-slate-400 hover:text-slate-700 transition-all cursor-pointer border border-slate-200/40 bg-white shadow-xs">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 border-b border-slate-100 bg-white flex flex-col sm:flex-row gap-4 items-center justify-between text-xs font-bold">
              <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200/40 w-full sm:w-auto">
                <button onClick={() => setFullPanelFilter("all")} className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${fullPanelFilter === "all" ? "bg-white text-purple-600 shadow-xs" : "text-slate-500"}`}>
                  Tümü ({notifications.length})
                </button>
                <button onClick={() => setFullPanelFilter("unread")} className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${fullPanelFilter === "unread" ? "bg-white text-rose-500 shadow-xs" : "text-slate-500"}`}>
                  Okunmamış ({notifications.filter(n => !n.isRead).length})
                </button>
                <button onClick={() => setFullPanelFilter("read")} className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${fullPanelFilter === "read" ? "bg-white text-emerald-600 shadow-xs" : "text-slate-500"}`}>
                  Okunanlar
                </button>
              </div>
              {unreadCount > 0 && (
                <button onClick={handleMarkAllAsRead} className="text-xs bg-purple-50 hover:bg-purple-600 hover:text-white text-purple-600 px-4 py-2 rounded-xl transition-all border border-purple-100 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs">
                  <Check className="w-4 h-4" /> Tümünü Okundu İşaretle
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-slate-50/30">
              {fullPanelNotifications.length === 0 ? (
                <div className="text-center py-24 text-sm font-medium text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
                  <ShieldAlert className="w-8 h-8 text-slate-300 mx-auto mb-2" /> Bildirim kaydı bulunamadı.
                </div>
              ) : (
                fullPanelNotifications.map(notif => (
                  <div
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif.id)}
                    className={`p-4 rounded-2xl border border-slate-100/70 shadow-xs flex items-center justify-between gap-4 transition-all cursor-pointer bg-white hover:border-purple-200 ${notif.isRead ? "opacity-50" : "border-l-2 border-l-purple-600"}`}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      {getIcon(notif.type)}
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-slate-700">{notif.text}</p>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                          <span>{notif.date}</span><span>•</span><span>{notif.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}