import { Layers, CheckCircle, XCircle, Clock, CalendarCheck } from "lucide-react";

interface AppointmentFiltersProps {
  subTab: "tumu" | "beklemede" | "onaylandi" | "tamamlandi" | "iptal";
  setSubTab: (tab: "tumu" | "beklemede" | "onaylandi" | "tamamlandi" | "iptal") => void;
  setExpandedCardId: (id: string | null) => void;
}

export const AppointmentFilters = ({
  subTab,
  setSubTab,
  setExpandedCardId,
}: AppointmentFiltersProps) => {
  return (
    <div className="space-y-4">
      <div className="flex border-b border-slate-100 gap-6 shrink-0 overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => {
            setSubTab("tumu");
            setExpandedCardId(null);
          }}
          className={`pb-3 text-xs font-bold transition-all relative cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${subTab === "tumu" ? "text-purple-600" : "text-slate-400 hover:text-slate-600"}`}
        >
          <Layers className="w-4 h-4" /> Tüm Randevular
          {subTab === "tumu" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 rounded-full"></span>
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            setSubTab("beklemede");
            setExpandedCardId(null);
          }}
          className={`pb-3 text-xs font-bold transition-all relative cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${subTab === "beklemede" ? "text-purple-600" : "text-slate-400 hover:text-slate-600"}`}
        >
          <Clock className="w-4 h-4 text-amber-500" /> Onay Bekleyenler
          {subTab === "beklemede" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 rounded-full"></span>
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            setSubTab("onaylandi");
            setExpandedCardId(null);
          }}
          className={`pb-3 text-xs font-bold transition-all relative cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${subTab === "onaylandi" ? "text-purple-600" : "text-slate-400 hover:text-slate-600"}`}
        >
          <CalendarCheck className="w-4 h-4 text-blue-500" /> Onaylananlar
          {subTab === "onaylandi" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 rounded-full"></span>
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            setSubTab("tamamlandi");
            setExpandedCardId(null);
          }}
          className={`pb-3 text-xs font-bold transition-all relative cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${subTab === "tamamlandi" ? "text-purple-600" : "text-slate-400 hover:text-slate-600"}`}
        >
          <CheckCircle className="w-4 h-4 text-emerald-500" /> Tamamlananlar
          {subTab === "tamamlandi" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 rounded-full"></span>
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            setSubTab("iptal");
            setExpandedCardId(null);
          }}
          className={`pb-3 text-xs font-bold transition-all relative cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${subTab === "iptal" ? "text-purple-600" : "text-slate-400 hover:text-slate-600"}`}
        >
          <XCircle className="w-4 h-4 text-red-500" /> İptal Edilenler
          {subTab === "iptal" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 rounded-full"></span>
          )}
        </button>
      </div>
    </div>
  );
};