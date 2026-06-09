import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  Check,
  Calendar,
  X,
  Activity,
  User,
  Clock,
  Wallet,
  TrendingUp,
} from "lucide-react";

interface NotificationItem {
  id: string;
  type:
    | "appointment"
    | "cancel"
    | "review"
    | "sale"
    | "stock"
    | "revenue"
    | "leave";
  text: string;
  time: string;
  isRead: boolean;
  day: "today" | "yesterday";
  date: string;
  employee_name?: string;
}

interface NotificationPopoverProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  unreadCount: number;
  timeFilter: "all" | "today" | "yesterday";
  setTimeFilter: (filter: "all" | "today" | "yesterday") => void;
  filteredNotifications: NotificationItem[];
  handleNotificationClick: (id: string) => void;
  handleMarkAllAsRead: () => void;
}

export function NotificationPopover({
  isOpen,
  setIsOpen,
  unreadCount,
  timeFilter,
  setTimeFilter,
  filteredNotifications,
  handleNotificationClick,
  handleMarkAllAsRead,
}: NotificationPopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const [selectedNotif, setSelectedNotif] = useState<NotificationItem | null>(
    null,
  );
  const [isViewAllMode, setIsViewAllMode] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setIsViewAllMode(false);
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        const target = event.target as HTMLElement;
        if (
          !target.closest("button")?.querySelector(".lucide-bell") &&
          !document.getElementById("notif-modal")
        ) {
          setIsOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, setIsOpen]);

  if (!isOpen) return null;

  const getIcon = (type: string) => {
    const baseClass = "p-2.5 rounded-xl shrink-0";
    switch (type) {
      case "revenue":
        return (
          <div className={`${baseClass} bg-emerald-50 text-emerald-600`}>
            <Wallet className="w-4 h-4" />
          </div>
        );
      case "appointment":
        return (
          <div className={`${baseClass} bg-purple-50 text-purple-600`}>
            <Calendar className="w-4 h-4" />
          </div>
        );
      case "cancel":
        return (
          <div className={`${baseClass} bg-rose-50 text-rose-500`}>
            <X className="w-4 h-4" />
          </div>
        );
      default:
        return (
          <div className={`${baseClass} bg-slate-50 text-slate-600`}>
            <Activity className="w-4 h-4" />
          </div>
        );
    }
  };

  return (
    <>
      <div
        ref={popoverRef}
        className={`absolute right-0 mt-3 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden flex flex-col transition-all duration-300 ${
          isViewAllMode ? "w-112.5 max-h-125" : "w-80 max-h-96"
        }`}
      >
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <span className="text-xs font-black text-slate-800">
            {isViewAllMode ? "Tüm Bildirimler Arşivi" : "Bildirimler"} (
            {unreadCount})
          </span>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-[10px] font-bold text-purple-600 hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <Check className="w-3 h-3" /> Tümünü Okundu Say
              </button>
            )}
            {isViewAllMode && (
              <button
                onClick={() => setIsViewAllMode(false)}
                className="text-[10px] bg-slate-200 hover:bg-slate-300 text-slate-700 px-2 py-0.5 rounded font-bold"
              >
                Küçült
              </button>
            )}
          </div>
        </div>

        <div className="p-2 border-b border-slate-100 flex gap-1 bg-white">
          {(["all", "today", "yesterday"] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all cursor-pointer capitalize ${timeFilter === filter ? "bg-purple-50 text-purple-600" : "text-slate-400 hover:bg-slate-50"}`}
            >
              {filter === "all" ? "Tümü" : filter === "today" ? "Bugün" : "Dün"}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 scrollbar-none min-h-40">
          {filteredNotifications.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 font-medium">
              Bildirim bulunmuyor.
            </div>
          ) : (
            filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => {
                  handleNotificationClick(notif.id);
                  setSelectedNotif(notif);
                }}
                className={`p-3.5 flex items-start gap-3 transition-all cursor-pointer hover:bg-slate-50 ${
                  notif.type === "revenue"
                    ? "bg-emerald-50/30 border-l-4 border-l-emerald-500"
                    : notif.isRead
                      ? "opacity-50 bg-white"
                      : "bg-purple-50/20"
                }`}
              >
                {getIcon(notif.type)}
                <div className="flex-1 space-y-0.5">
                  <p className="text-[11px] font-semibold text-slate-700 leading-snug line-clamp-2">
                    {notif.text}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[9px] text-slate-400 font-medium">
                      {notif.time}
                    </span>
                    {notif.employee_name && (
                      <span
                        className={`text-[8px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 ${
                          notif.type === "revenue"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-purple-50 text-purple-600"
                        }`}
                      >
                        <User className="w-2 h-2" /> {notif.employee_name}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {!isViewAllMode && (
          <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
            <button
              onClick={() => setIsViewAllMode(true)}
              className="w-full text-[11px] font-black text-purple-600 hover:text-purple-700 bg-white border border-slate-200 py-2 rounded-xl transition-all cursor-pointer shadow-2xs"
            >
              Tüm Bildirimleri Gör
            </button>
          </div>
        )}
      </div>

      {selectedNotif &&
        createPortal(
          <div
            id="notif-modal"
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-999999 animate-fadeIn"
          >
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 w-full max-w-md space-y-5">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2.5">
                  {getIcon(selectedNotif.type)}
                  <div>
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wide">
                      {selectedNotif.type === "revenue"
                        ? "Finansal Durum Raporu"
                        : "Randevu Detayı"}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-bold">
                      {selectedNotif.date}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedNotif(null)}
                  className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                <p className="text-xs font-bold text-slate-700 leading-relaxed">
                  {selectedNotif.text}
                </p>
              </div>

              {selectedNotif.type === "appointment" && (
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="p-3 bg-purple-50/50 border border-purple-100 rounded-xl flex items-center gap-2.5">
                    <User className="w-4 h-4 text-purple-600" />
                    <div className="overflow-hidden">
                      <span className="text-[9px] text-slate-400 block font-bold uppercase">
                        Sorumlu Uzman
                      </span>
                      <span className="text-xs font-black text-purple-950 block truncate max-w-35">
                        {selectedNotif.employee_name}
                      </span>
                    </div>
                  </div>
                  <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-emerald-600" />
                    <div>
                      <span className="text-[9px] text-slate-400 block font-bold uppercase">
                        Randevu Saati
                      </span>
                      <span className="text-xs font-black text-emerald-950">
                        {selectedNotif.time}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {selectedNotif.type === "revenue" && (
                <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                  <div>
                    <span className="text-[9px] text-slate-400 block font-bold uppercase">
                      Kasa Durumu
                    </span>
                    <span className="text-xs font-black text-emerald-950">
                      Veriler anlık senkronizedir.
                    </span>
                  </div>
                </div>
              )}

              <button
                onClick={() => setSelectedNotif(null)}
                className="w-full bg-slate-800 hover:bg-slate-900 text-white text-xs font-black py-2.5 rounded-xl shadow-sm transition-all cursor-pointer"
              >
                Anladım, Kapat
              </button>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
