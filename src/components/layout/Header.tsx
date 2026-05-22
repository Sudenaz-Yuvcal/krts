import React from "react";
import { Search, Bell, Wallet, ChevronDown } from "lucide-react";

export const Header: React.FC = () => {
  return (
    <header className="h-24 bg-transparent flex items-center justify-between px-12 z-20">
      <div className="relative w-96">
        <Search className="w-4.5 h-4.5 text-slate-400 absolute left-5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Müşteri, randevu veya hizmet ara..."
          className="w-full bg-white pl-13 pr-5 py-3.5 rounded-2xl border border-slate-100/70 focus:outline-none focus:border-purple-300 focus:bg-white text-sm shadow-[0_4px_20px_rgba(0,0,0,0.01)] transition-all placeholder:text-slate-400 font-medium"
        />
      </div>

      <div className="flex items-center gap-7">
        <div className="flex items-center gap-3.5 bg-white border border-slate-100/60 px-5 py-2.5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <Wallet className="w-4.5 h-4.5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">
              -----
            </div>
          </div>
        </div>

        <button className="p-3 bg-white rounded-2xl border border-slate-100/60 shadow-[0_8px_30px_rgb(0,0,0,0.02)] text-slate-400 hover:text-slate-700 transition-all relative group">
          <Bell className="w-5 h-5 group-hover:scale-105 transition-transform" />
          <span className="w-2 h-2 bg-brand-purple rounded-full absolute top-3.5 right-3.5 ring-2 ring-white"></span>
        </button>

        <div className="flex items-center gap-3.5 cursor-pointer group pl-2">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-bold text-slate-800 group-hover:text-slate-900">
              krts{" "}
            </span>
            <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-transform" />
          </div>
        </div>
      </div>
    </header>
  );
};
