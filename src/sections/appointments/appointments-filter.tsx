import { Layers, CheckCircle, XCircle } from "lucide-react";

interface AppointmentFiltersProps {
  subTab: "tumu" | "tamamlandi" | "iptal";
  setSubTab: (tab: "tumu" | "tamamlandi" | "iptal") => void;
  genderFilter: "Hepsi" | "Kadın" | "Erkek";
  setGenderFilter: (gender: "Hepsi" | "Kadın" | "Erkek") => void;
  setExpandedCardId: (id: string | null) => void;
}

export const AppointmentFilters = ({
  subTab,
  setSubTab,
  genderFilter,
  setGenderFilter,
  setExpandedCardId,
}: AppointmentFiltersProps) => {
  return (
    <>
      <div className="flex border-b border-slate-100 gap-6 shrink-0 overflow-x-auto scrollbar-none">
        <button
          onClick={() => {
            setSubTab("tumu");
            setExpandedCardId(null);
          }}
          className={`pb-3 text-xs font-bold transition-all relative cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${subTab === "tumu" ? "text-brand-purple" : "text-slate-400 hover:text-slate-600"}`}
        >
          <Layers className="w-4 h-4" /> Tüm Randevular
          {subTab === "tumu" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-purple rounded-full"></span>
          )}
        </button>
        <button
          onClick={() => {
            setSubTab("tamamlandi");
            setExpandedCardId(null);
          }}
          className={`pb-3 text-xs font-bold transition-all relative cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${subTab === "tamamlandi" ? "text-brand-purple" : "text-slate-400 hover:text-slate-600"}`}
        >
          <CheckCircle className="w-4 h-4" /> Tamamlanan Hizmetler
          {subTab === "tamamlandi" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-purple rounded-full"></span>
          )}
        </button>
        <button
          onClick={() => {
            setSubTab("iptal");
            setExpandedCardId(null);
          }}
          className={`pb-3 text-xs font-bold transition-all relative cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${subTab === "iptal" ? "text-brand-purple" : "text-slate-400 hover:text-slate-600"}`}
        >
          <XCircle className="w-4 h-4" /> İptal Edilenler
          {subTab === "iptal" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-purple rounded-full"></span>
          )}
        </button>
      </div>

      <div className="flex items-center gap-2 bg-slate-50 border border-slate-100/60 p-1 rounded-xl w-fit shrink-0">
        {(["Hepsi", "Kadın", "Erkek"] as const).map((gender) => (
          <button
            key={gender}
            onClick={() => setGenderFilter(gender)}
            className={`px-4 py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${genderFilter === gender ? "bg-white text-slate-800 shadow-xs border border-slate-100" : "text-slate-400 hover:text-slate-600"}`}
          >
            {gender === "Hepsi" ? "Tüm Kategoriler" : `${gender} Salonu`}
          </button>
        ))}
      </div>
    </>
  );
};
