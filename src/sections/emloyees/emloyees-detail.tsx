import React, { useState } from "react";
import { ArrowLeft, Star, Calendar, TrendingUp, Scissors, Phone, Clock, ShieldCheck, Plus, Trash2 } from "lucide-react";
import { Card } from "../../components/ui/Card";
import { supabase } from "../../lib/supabaseClient";

interface ServiceItem {
  id: string;
  name: string;
  category: string;
}

interface DbShift {
  id?: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  is_active: boolean;
}

interface SelectedStaff {
  id: string | number;
  name: string;
  role: string;
  phone: string;
  status: string;
  img?: string;
  rating: number;
  activeAppointments: number;
  revenue: string | number;
  services?: string[];
  dbShifts?: DbShift[];
}

interface DetailSectionProps {
  selectedStaff: SelectedStaff;
  allServices: ServiceItem[];
  onBackClick: () => void;
}

interface ShiftInterval {
  id?: string;
  start: string;
  end: string;
}

interface DayShiftState {
  active: boolean;
  intervals: ShiftInterval[];
}

const DAYS_OF_WEEK = [
  { key: "monday", label: "Pazartesi" },
  { key: "tuesday", label: "Salı" },
  { key: "wednesday", label: "Çarşamba" },
  { key: "thursday", label: "Perşembe" },
  { key: "friday", label: "Cuma" },
  { key: "saturday", label: "Cumartesi" },
  { key: "sunday", label: "Pazar" },
];

export const EmployeesDetail: React.FC<DetailSectionProps> = ({ 
  selectedStaff, 
  allServices, 
  onBackClick 
}) => {
  
  const [shifts, setShifts] = useState<Record<string, DayShiftState>>(() => {
    const initialShifts: Record<string, DayShiftState> = {};

    DAYS_OF_WEEK.forEach((day) => {
      const foundDbShifts = selectedStaff.dbShifts?.filter((s) => s.day_of_week === day.key) || [];
      
      if (foundDbShifts.length > 0) {
        initialShifts[day.key] = {
          active: foundDbShifts.some((s) => s.is_active),
          intervals: foundDbShifts.map((s) => ({
            id: s.id,
            start: s.start_time?.substring(0, 5) || "09:00",
            end: s.end_time?.substring(0, 5) || "12:00"
          }))
        };
      } else {
        initialShifts[day.key] = {
          active: day.key !== "sunday",
          intervals: day.key !== "sunday" ? [
            { start: "09:00", end: "12:30" },
            { start: "13:30", end: "19:00" }
          ] : []
        };
      }
    });

    return initialShifts;
  });

  const [allowedServiceIds, setAllowedServiceIds] = useState<string[]>(selectedStaff.services || []);

  const saveShiftsToDb = async (dayKey: string, updatedDayObj: DayShiftState) => {
    try {
      await supabase
        .from("employee_shifts")
        .delete()
        .eq("employee_id", selectedStaff.id)
        .eq("day_of_week", dayKey);

      if (updatedDayObj.active && updatedDayObj.intervals.length > 0) {
        const payload = updatedDayObj.intervals.map((interval) => ({
          employee_id: selectedStaff.id,
          day_of_week: dayKey,
          start_time: interval.start,
          end_time: interval.end,
          is_active: true
        }));

        await supabase.from("employee_shifts").insert(payload);
      } else if (!updatedDayObj.active) {
        await supabase.from("employee_shifts").insert({
          employee_id: selectedStaff.id,
          day_of_week: dayKey,
          start_time: "00:00",
          end_time: "00:00",
          is_active: false
        });
      }
    } catch (err) {
      console.error("Vardiya kaydı güncellenemedi:", err);
    }
  };

  const addInterval = (dayKey: string) => {
    const current = shifts[dayKey];
    const lastInterval = current.intervals[current.intervals.length - 1];
    
    const newStart = lastInterval ? lastInterval.end : "09:00";
    const newEnd = "19:00";

    const updated = {
      ...current,
      intervals: [...current.intervals, { start: newStart, end: newEnd }]
    };

    setShifts({ ...shifts, [dayKey]: updated });
    saveShiftsToDb(dayKey, updated);
  };

  const removeInterval = (dayKey: string, index: number) => {
    const current = shifts[dayKey];
    const updatedIntervals = current.intervals.filter((_, i) => i !== index);
    
    const updated = {
      ...current,
      intervals: updatedIntervals
    };

    setShifts({ ...shifts, [dayKey]: updated });
    saveShiftsToDb(dayKey, updated);
  };

  const handleTimeChange = (dayKey: string, index: number, field: "start" | "end", value: string) => {
    const current = shifts[dayKey];
    const updatedIntervals = current.intervals.map((interval, i) => 
      i === index ? { ...interval, [field]: value } : interval
    );

    const updated = {
      ...current,
      intervals: updatedIntervals
    };

    setShifts({ ...shifts, [dayKey]: updated });
    saveShiftsToDb(dayKey, updated);
  };

  const toggleDayActive = (dayKey: string) => {
    const current = shifts[dayKey];
    const updated = {
      ...current,
      active: !current.active,
      intervals: !current.active && current.intervals.length === 0 
        ? [{ start: "09:00", end: "19:00" }] 
        : current.intervals
    };

    setShifts({ ...shifts, [dayKey]: updated });
    saveShiftsToDb(dayKey, updated);
  };

  const toggleServicePermissionInDb = async (serviceId: string) => {
    const isAllowed = allowedServiceIds.includes(serviceId);
    try {
      if (isAllowed) {
        await supabase
          .from("employee_services")
          .delete()
          .eq("employee_id", selectedStaff.id)
          .eq("service_id", Number(serviceId));
        setAllowedServiceIds(allowedServiceIds.filter(id => id !== serviceId));
      } else {
        await supabase
          .from("employee_services")
          .insert({ employee_id: selectedStaff.id, service_id: Number(serviceId) });
        setAllowedServiceIds([...allowedServiceIds, serviceId]);
      }
    } catch (err) {
      console.error("Hizmet izni güncellenirken hata oluştu:", err);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <div className="flex items-center gap-4">
        <button onClick={onBackClick} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer border-none">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div>
          <h2 className="text-2xl font-black text-slate-800">Personel Profili & MHRS Vardiya Yönetimi</h2>
          <p className="text-xs text-slate-400">{selectedStaff.name} isimli personelin çalışma oturumları ve mola kırılımları.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 flex flex-col items-center text-center justify-center border border-slate-100 bg-white rounded-3xl">
          <img src={selectedStaff.img || "https://via.placeholder.com/150"} alt={selectedStaff.name} className="w-24 h-24 rounded-2xl object-cover ring-4 ring-slate-100 mb-4 shadow-sm" />
          <h3 className="text-lg font-black text-slate-800">{selectedStaff.name}</h3>
          <p className="text-xs font-bold text-slate-400 mt-0.5">{selectedStaff.role}</p>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-slate-500">
            <Phone className="w-3.5 h-3.5 text-indigo-500" />
            <span>{selectedStaff.phone}</span>
          </div>
          <span className="mt-3 text-[10px] font-black px-3 py-1 rounded-lg bg-emerald-50 text-emerald-600">{selectedStaff.status}</span>
        </Card>

        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-5 flex items-center gap-4 border border-slate-100 bg-white rounded-2xl">
            <div className="p-3 bg-amber-50 rounded-xl text-amber-500"><Star className="w-5 h-5 fill-amber-500" /></div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Müşteri Puanı</p>
              <h4 className="text-lg font-black text-slate-800 mt-0.5">
                {selectedStaff.rating > 0 ? Number(selectedStaff.rating).toFixed(1) : "Puan Yok"}
              </h4>
            </div>
          </Card>
          <Card className="p-5 flex items-center gap-4 border border-slate-100 bg-white rounded-2xl">
            <div className="p-3 bg-indigo-50 rounded-xl text-indigo-500"><Calendar className="w-5 h-5" /></div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Aktif Randevu</p>
              <h4 className="text-lg font-black text-slate-800 mt-0.5">{selectedStaff.activeAppointments}</h4>
            </div>
          </Card>
          <Card className="p-5 flex items-center gap-4 border border-slate-100 bg-white rounded-2xl">
            <div className="p-3 bg-emerald-50 rounded-xl text-emerald-500"><TrendingUp className="w-5 h-5" /></div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Toplam Ciro</p>
              <h4 className="text-lg font-black text-slate-800 mt-0.5">{selectedStaff.revenue}</h4>
            </div>
          </Card>
        </div>
      </div>

      <Card className="p-6 border border-slate-100 bg-white rounded-3xl">
        <h4 className="text-sm font-black text-slate-800 flex items-center gap-2 mb-2">
          <Clock className="w-4 h-4 text-indigo-500" />
          Mesai ve Mola Saatleri Konfigürasyonu
        </h4>
        <p className="text-xs text-slate-400 mb-6">
          Günün mesai oturumlarını bölün. Oturumlar arasında kalan süreler sistem tarafından otomatik olarak <strong>mola saati</strong> olarak işaretlenir.
        </p>

        <div className="space-y-4">
          {DAYS_OF_WEEK.map((day) => {
            const currentDay = shifts[day.key];
            return (
              <div key={day.key} className="flex flex-col lg:flex-row lg:items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl gap-4 transition-all">
                <div className="flex items-center gap-3 min-w-40">
                  <button
                    type="button"
                    onClick={() => toggleDayActive(day.key)}
                    className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-all duration-200 cursor-pointer border-none ${currentDay.active ? "bg-indigo-500 justify-end" : "bg-slate-200 justify-start"}`}
                  >
                    <div className="bg-white w-4 h-4 rounded-full shadow-xs" />
                  </button>
                  <span className="text-xs font-black text-slate-700">{day.label}</span>
                </div>

                {currentDay.active ? (
                  <div className="flex-1 flex flex-wrap items-center gap-3">
                    {currentDay.intervals.map((interval, index) => (
                      <div key={index} className="flex items-center gap-2 bg-white px-3 py-1.5 border border-slate-200 shadow-2xs rounded-xl group/item">
                        <span className="text-[10px] font-black text-indigo-500 uppercase tracking-wider bg-indigo-50/70 px-1.5 py-0.5 rounded-md">{index + 1}. Oturum</span>
                        <input
                          type="time"
                          value={interval.start}
                          onChange={(e) => handleTimeChange(day.key, index, "start", e.target.value)}
                          className="bg-transparent text-xs font-bold text-slate-700 outline-hidden"
                        />
                        <span className="text-slate-400 text-[10px] font-bold">-</span>
                        <input
                          type="time"
                          value={interval.end}
                          onChange={(e) => handleTimeChange(day.key, index, "end", e.target.value)}
                          className="bg-transparent text-xs font-bold text-slate-700 outline-hidden"
                        />
                        {currentDay.intervals.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeInterval(day.key, index)}
                            className="p-1 text-slate-400 hover:text-red-500 rounded-md transition-all cursor-pointer border-none bg-transparent"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => addInterval(day.key)}
                      className="text-[11px] font-black text-indigo-600 bg-white hover:bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Oturum / Mola Ekle
                    </button>
                  </div>
                ) : (
                  <div className="flex-1 text-right">
                    <span className="text-xs font-black text-red-400 bg-red-50/50 px-3 py-1.5 rounded-xl border border-red-100/50">Haftalık İzin Günü</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>


      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 md:col-span-2 border border-slate-100 bg-white rounded-3xl">
          <h4 className="text-sm font-black text-slate-800 flex items-center gap-2 mb-4">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            Hizmet Atamaları & İzin Yönetimi
          </h4>
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {allServices.map((service) => {
              const isAllowed = allowedServiceIds.includes(service.id);
              return (
                <div key={service.id} className="flex items-center justify-between p-3 bg-white border border-slate-100/80 shadow-2xs rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-slate-700">{service.name}</span>
                    <span className="text-[9px] font-black text-slate-400 mt-0.5 uppercase">{service.category} Kategorisi</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleServicePermissionInDb(service.id)}
                    className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-all duration-200 cursor-pointer border-none ${isAllowed ? "bg-indigo-500 justify-end" : "bg-slate-200 justify-start"}`}
                  >
                    <div className="bg-white w-4 h-4 rounded-full shadow-xs" />
                  </button>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-6 border border-slate-100 bg-white rounded-3xl h-fit">
          <h4 className="text-sm font-black text-slate-800 flex items-center gap-2 mb-4">
            <Scissors className="w-4 h-4 text-indigo-500" />
            Uzmanlık Sınıfı
          </h4>
          <span className="text-xs font-bold px-3 py-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-xl w-full text-center block">{selectedStaff.role}</span>
        </Card>
      </div>
    </div>
  );
};