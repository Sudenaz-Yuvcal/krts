import { useState } from "react";
import { Bell, HeadphonesIcon } from "lucide-react";
import { NotificationDropdown } from "./NotificationDropdown";
import { AssistantPortal } from "./AssistantPortal";

interface HeaderProps {
  userRole: "hairdresser" | "admin";
}

export function Header({ userRole }: HeaderProps) {
  const isAdminPanel = userRole === "admin";
  const [period, setPeriod] = useState<"haftalik" | "aylik">("haftalik");
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  const unreadCount = 3; 

  return (
    <header className="h-24 bg-slate-50 border-b border-slate-200 backdrop-blur-md flex items-center justify-between px-12 z-20 relative">
      <div>
        {isAdminPanel ? (
          <>
            <h1 className="text-xl font-black text-slate-800 tracking-tight uppercase leading-none">
              Süper Admin Konsolu
            </h1>
            <p className="text-xs text-slate-400 font-bold tracking-widest mt-1 uppercase">
              Yüksek Segment Ekosistem Cirosu ve Pazar Yeri Takibi
            </p>
          </>
        ) : (
          <>
            <h1 className="text-xl font-black text-slate-800 tracking-tight uppercase leading-none">
              Fiem Kuaför & Güzellik Salonu
            </h1>
            <p className="text-xs text-slate-400 font-bold tracking-widest mt-1 uppercase">
              Sistem Yönetim & Envanter Paneli
            </p>
          </>
        )}
      </div>

      <div className="flex items-center gap-4">
        {isAdminPanel && (
          <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-xs h-11 items-center shrink-0">
            <button
              onClick={() => setPeriod("haftalik")}
              className={`px-4 py-1.5 text-xs font-black rounded-lg transition-all cursor-pointer ${
                period === "haftalik"
                  ? "bg-purple-50 text-purple-600 shadow-xs"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              Haftalık
            </button>
            <button
              onClick={() => setPeriod("aylik")}
              className={`px-4 py-1.5 text-xs font-black rounded-lg transition-all cursor-pointer ${
                period === "aylik"
                  ? "bg-purple-50 text-purple-600 shadow-xs"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              Aylık
            </button>
          </div>
        )}

        {!isAdminPanel && (
          <button
            onClick={() => {
              setIsAssistantOpen(true);
              setIsNotificationOpen(false);
            }}
            className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-xs hover:border-purple-200 hover:text-purple-600 transition-all group cursor-pointer h-11 shrink-0"
          >
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <HeadphonesIcon className="w-4 h-4" />
            </div>
            <span className="text-xs font-black text-slate-600 group-hover:text-purple-600 transition-colors">
              Canlı Destek & Asistan
            </span>
          </button>
        )}

        <div className="relative z-50">
          <button
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-xs text-slate-400 hover:text-slate-700 transition-all relative cursor-pointer h-11 w-11 flex items-center justify-center shrink-0"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="w-2 h-2 bg-rose-500 rounded-full absolute top-3 right-3 ring-2 ring-white animate-pulse" />
            )}
          </button>

          {isNotificationOpen && (
            <NotificationDropdown 
              unreadCount={unreadCount} 
              onClose={() => setIsNotificationOpen(false)} 
            />
          )}
        </div>
      </div>

      {isAssistantOpen && (
        <AssistantPortal onClose={() => setIsAssistantOpen(false)} />
      )}
    </header>
  );
}