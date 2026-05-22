import React, { useState } from "react";
import { Card } from "../../components/ui/Card";
import type { StaffMember } from "../../types/emloyees";
import {
  Clock,
  Star,
  TrendingUp,
  Check,
  Scissors,
  ArrowLeft,
  DollarSign,
  Calendar,
  MessageSquare,
  ArrowUpRight,
} from "lucide-react";

interface DetailSectionProps {
  selectedStaff: StaffMember;
  onBackClick: () => void;
}

export const EmployeesDetail: React.FC<DetailSectionProps> = ({
  selectedStaff,
  onBackClick,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<
    "rating" | "revenue" | "appointments"
  >("rating");

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex items-center gap-4">
        <button
          onClick={onBackClick}
          className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div>
          <h2 className="text-2xl font-black text-slate-800">
            {selectedStaff.name} Kontrol Paneli
          </h2>
          <p className="text-xs text-slate-400">
            Kartlara tıklayarak detaylı rapor kırılımlarını inceleyebilirsiniz.
          </p>
        </div>
      </div>

      <Card className="p-7 flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <img
            src={selectedStaff.img}
            alt={selectedStaff.name}
            className="w-24 h-24 rounded-2xl object-cover ring-4 ring-indigo-50"
          />
          <div className="text-center md:text-left space-y-1">
            <span className="text-[10px] font-black bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-md uppercase">
              {selectedStaff.status}
            </span>
            <h3 className="text-xl font-black text-slate-800 mt-1">
              {selectedStaff.name}
            </h3>
            <p className="text-xs font-bold text-slate-500">
              {selectedStaff.role}
            </p>
          </div>
        </div>
        <div>
          <span className="text-xs font-bold bg-slate-50 border border-slate-100 text-slate-600 px-4 py-2 rounded-xl">
            🔒 Sistem Yöneticisi
          </span>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          onClick={() => setActiveSubTab("rating")}
          className={`p-6 rounded-2xl border text-center space-y-2 cursor-pointer transition-all ${activeSubTab === "rating" ? "bg-white border-amber-400 shadow-lg ring-2 ring-amber-400/20" : "bg-white border-slate-100 hover:border-slate-300"}`}
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center mx-auto">
            <Star className="w-5 h-5 fill-amber-500" />
          </div>
          <span className="text-xs font-bold text-slate-400 block">
            Müşteri Memnuniyeti
          </span>
          <h4 className="text-2xl font-black text-slate-800">
            %{selectedStaff.rating * 20} Skor
          </h4>
          <p className="text-[10px] text-amber-600 font-bold underline">
            Son 30 yorumu gör
          </p>
        </div>

        <div
          onClick={() => setActiveSubTab("revenue")}
          className={`p-6 rounded-2xl border text-center space-y-2 cursor-pointer transition-all ${activeSubTab === "revenue" ? "bg-white border-indigo-500 shadow-lg ring-2 ring-indigo-500/20" : "bg-white border-slate-100 hover:border-slate-300"}`}
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center mx-auto">
            <TrendingUp className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-slate-400 block">
            Aylık Toplam Ciro
          </span>
          <h4 className="text-2xl font-black text-slate-800">
            {selectedStaff.revenue}
          </h4>
          <p className="text-[10px] text-indigo-600 font-bold underline">
            Haftalık kazanç kırılımı
          </p>
        </div>

        <div
          onClick={() => setTimeout(() => setActiveSubTab("appointments"), 0)}
          className={`p-6 rounded-2xl border text-center space-y-2 cursor-pointer transition-all ${activeSubTab === "appointments" ? "bg-white border-purple-500 shadow-lg ring-2 ring-purple-500/20" : "bg-white border-slate-100 hover:border-slate-300"}`}
        >
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center mx-auto">
            <Clock className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-slate-400 block">
            Aktif Randevular
          </span>
          <h4 className="text-2xl font-black text-slate-800">
            {selectedStaff.activeAppointments} Randevu
          </h4>
          <p className="text-[10px] text-purple-600 font-bold underline">
            Bugünkü çalışma takvimi
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2">
          <Card className="p-7">
            {activeSubTab === "rating" && (
              <div className="space-y-5">
                <h4 className="text-sm font-black text-slate-800 flex items-center gap-2 border-b border-slate-50 pb-4">
                  <MessageSquare className="w-4 h-4 text-amber-500" /> Müşteri
                  Geri Bildirimleri
                </h4>
                <div className="space-y-3">
                  {[
                    {
                      user: "Melis A.",
                      date: "Bugün",
                      comment:
                        "Sudenaz hanım harika bir ombre çıkardı! Saçım hiç yıpranmadı.",
                    },
                    {
                      user: "Zeynep K.",
                      date: "Dün",
                      comment: "Kreatif kesim konusunda şehirdeki tek adres.",
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1"
                    >
                      <div className="flex justify-between font-black text-slate-700">
                        <span>{item.user}</span>
                        <span>{item.date}</span>
                      </div>
                      <p className="text-slate-600 font-medium">
                        {item.comment}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSubTab === "revenue" && (
              <div className="space-y-6">
                <h4 className="text-sm font-black text-slate-800 flex items-center gap-2 border-b border-slate-50 pb-4">
                  <DollarSign className="w-4 h-4 text-indigo-500" /> Haftalık
                  Kazanç Dağılımı
                </h4>
                <div className="space-y-4">
                  {[
                    {
                      week: "1. Hafta (Mikro Kaynak Yoğunluğu)",
                      amount: "₺14,200",
                      percent: 85,
                    },
                    {
                      week: "2. Hafta (Renklendirme & Boya)",
                      amount: "₺12,800",
                      percent: 75,
                    },
                  ].map((item, index) => (
                    <div key={index} className="space-y-1.5 text-xs font-bold">
                      <div className="flex justify-between text-slate-600">
                        <span>{item.week}</span>
                        <span>{item.amount}</span>
                      </div>
                      <div className="w-full h-2 bg-slate-50 rounded-full">
                        <div
                          className="h-full bg-indigo-600 rounded-full"
                          style={{ width: `${item.percent}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSubTab === "appointments" && (
              <div className="space-y-5">
                <h4 className="text-sm font-black text-slate-800 flex items-center gap-2 border-b border-slate-50 pb-4">
                  <Calendar className="w-4 h-4 text-purple-500" /> Bugünkü
                  Çalışma Akışı
                </h4>
                <div className="border-l-2 border-slate-100 pl-4 ml-2 space-y-4 text-xs">
                  {[
                    {
                      time: "11:30 - 13:00",
                      customer: "Aslıhan Yılmaz",
                      service: "Ombre + Saç Bakımı",
                    },
                    {
                      time: "14:00 - 16:30",
                      customer: "Gizem Çetin",
                      service: "Full Set Mikro Kaynak",
                    },
                  ].map((item, index) => (
                    <div key={index}>
                      <span className="font-black text-purple-600 block">
                        {item.time}
                      </span>
                      <h5 className="font-black text-slate-800">
                        {item.customer} -{" "}
                        <span className="text-slate-500 font-medium">
                          {item.service}
                        </span>
                      </h5>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6 space-y-4">
            <h4 className="text-sm font-black text-slate-800 flex items-center gap-2">
              <Scissors className="w-4 h-4 text-indigo-500" /> Hizmet Alanları
            </h4>
            <div className="flex flex-wrap gap-2">
              {selectedStaff.services.map((service, i) => (
                <span
                  key={i}
                  className="text-[11px] font-bold bg-slate-50 text-slate-600 border border-slate-100 px-3 py-1.5 rounded-xl flex items-center gap-1.5"
                >
                  <Check className="w-3 h-3 text-emerald-500 stroke-3" />{" "}
                  {service}
                </span>
              ))}
            </div>
          </Card>

          <Card className="p-6 bg-linear-to-br from-slate-800 to-slate-900 text-white space-y-2">
            <div className="flex justify-between text-xs font-black uppercase text-slate-400">
              <span>Hızlı İstatistik</span>
              <ArrowUpRight className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-xs text-slate-300 font-medium leading-relaxed">
              Sudenaz sadık müşteri oranında bu ay zirvede!
            </p>
            <div className="pt-2 border-t border-slate-700 flex justify-between text-[11px] font-bold text-slate-400">
              <span>Tekrar Gelme</span>
              <span className="text-emerald-400">%98.7</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
