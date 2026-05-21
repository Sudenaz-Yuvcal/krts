import React from "react";
import { Card } from "../../components/ui/Card";
import { ArrowUpRight } from "lucide-react";

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-9 w-full">
      <div>
        <h2 className="text-3xl font-black tracking-tight text-slate-800">
          Dashboard
        </h2>
        <p className="text-xs font-semibold text-slate-400 mt-1">
          Salonunuzun anlık finansal ve randevu analitiği
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="flex items-center justify-between relative overflow-hidden">
          <div>
            <span className="text-[13px] font-bold text-slate-400 tracking-tight">
              Total Sale
            </span>
            <h3 className="text-3xl font-black text-slate-800 mt-1.5">
              $34,580
            </h3>
            <span className="text-[11px] font-semibold text-slate-400 block mt-1">
              All Items
            </span>
          </div>
          <div className="w-1.5 h-12 rounded-full bg-emerald-500"></div>
        </Card>

        <Card className="flex items-center justify-between relative overflow-hidden">
          <div>
            <span className="text-[13px] font-bold text-slate-400 tracking-tight">
              Net Income
            </span>
            <h3 className="text-3xl font-black text-slate-800 mt-1.5">
              $28,740
            </h3>
            <span className="text-[11px] font-semibold text-slate-400 block mt-1">
              All Items
            </span>
          </div>
          <div className="w-1.5 h-12 rounded-full bg-purple-600"></div>
        </Card>

        <Card className="flex items-center justify-between relative overflow-hidden">
          <div>
            <span className="text-[13px] font-bold text-slate-400 tracking-tight">
              Revenue
            </span>
            <h3 className="text-3xl font-black text-slate-800 mt-1.5">
              $24,286
            </h3>
            <span className="text-[11px] font-semibold text-slate-400 block mt-1">
              All Items
            </span>
          </div>
          <div className="w-1.5 h-12 rounded-full bg-indigo-500"></div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h4 className="text-lg font-black text-slate-800 tracking-tight">
                Analytics Report
              </h4>
              <div className="flex gap-3 text-[11px] font-bold mt-1">
                <span className="text-purple-600">Sale</span>
                <span className="text-red-500">Refund</span>
              </div>
            </div>
            <select className="bg-slate-50 border border-slate-100 text-xs font-bold py-1.5 px-3 rounded-xl focus:outline-none text-slate-500">
              <option>Weekly</option>
              <option>Monthly</option>
            </select>
          </div>

          <div className="h-60 w-full bg-slate-50/40 rounded-2xl flex items-end justify-between p-6 relative border border-dashed border-slate-200/60">
            {["Sun", "mon", "Tue", "Wed", "Thu", "Fri", "sat"].map(
              (day, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center gap-3 z-10 w-full group cursor-pointer"
                >
                  <div
                    className={`w-9 rounded-t-xl transition-all duration-300 relative ${
                      day === "Wed"
                        ? "bg-linear-to-t from-brand-purple to-purple-400 shadow-md shadow-purple-100"
                        : "bg-slate-200/80 group-hover:bg-purple-300"
                    }`}
                    style={{
                      height: `${[110, 140, 125, 180, 150, 165, 90][idx]}px`,
                    }}
                  >
                    {day === "Wed" && (
                      <div className="absolute -top-10 left-1/2 -translate-y-1 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded-lg font-bold shadow-md whitespace-nowrap">
                        $576
                      </div>
                    )}
                  </div>
                  <span
                    className={`text-[11px] font-bold ${day === "Wed" ? "text-brand-purple" : "text-slate-400"}`}
                  >
                    {day}
                  </span>
                </div>
              ),
            )}
          </div>
        </Card>

        <div className="flex flex-col gap-8">
          <div className="bg-linear-to-br from-brand-purple via-purple-600 to-indigo-700 rounded-[32px] p-7 text-white shadow-xl shadow-purple-100 flex flex-col justify-between h-48 relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[11px] font-bold opacity-70 tracking-wider uppercase">
                  Debit Card
                </span>
                <h5 className="text-sm font-black mt-0.5 tracking-tight">
                  Janice Dean
                </h5>
              </div>
              <span className="text-xl font-black italic tracking-tighter opacity-90">
                VISA
              </span>
            </div>

            <div className="my-2">
              <span className="text-lg font-bold tracking-widest text-white/90">
                •••• •••• •••• 5294
              </span>
            </div>

            <div className="flex justify-between items-end text-[11px] font-bold opacity-80">
              <span>JANICE DEAN</span>
              <span>07/25</span>
            </div>
          </div>

          <Card className="p-6.5 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Current Balance
              </span>
              <h4 className="text-2xl font-black text-slate-800 mt-1">
                $3,678.36
              </h4>
              <span className="text-[10px] font-semibold text-emerald-500 block mt-1">
                Available to withdraw
              </span>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-purple-50 flex items-center justify-center text-brand-purple">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
