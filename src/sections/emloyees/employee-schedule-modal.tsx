import React, { useState, useEffect } from "react";
import { X, Save, Clock, CalendarDays } from "lucide-react";

interface DaySchedule {
  day_index: number;
  day_name: string;
  is_working: boolean;
  start_time: string;
  end_time: string;
}

interface EmployeeScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  employeeId: number;
  employeeName: string;
  onSave: (schedule: DaySchedule[]) => Promise<void>;
  initialSchedule?: DaySchedule[]; 
}

const WEEK_DAYS = [
  { index: 1, name: "Pazartesi" },
  { index: 2, name: "Salı" },
  { index: 3, name: "Çarşamba" },
  { index: 4, name: "Perşembe" },
  { index: 5, name: "Cuma" },
  { index: 6, name: "Cumartesi" },
  { index: 7, name: "Pazar" },
];

export const EmployeeScheduleModal = ({
  isOpen,
  onClose,
  employeeName,
  onSave,
  initialSchedule,
}: EmployeeScheduleModalProps) => {
  const [schedule, setSchedule] = useState<DaySchedule[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialSchedule && initialSchedule.length === 7) {
        const formattedSchedule = initialSchedule.map(item => ({
          ...item,
          start_time: item.start_time ? item.start_time.substring(0, 5) : "09:00",
          end_time: item.end_time ? item.end_time.substring(0, 5) : "19:00"
        }));
        setSchedule(formattedSchedule);
      } else {
        const defaultSchedule = WEEK_DAYS.map((day) => ({
          day_index: day.index,
          day_name: day.name,
          is_working: true, 
          start_time: "09:00",
          end_time: "19:00",
        }));
        setSchedule(defaultSchedule);
      }
    }
  }, [isOpen, initialSchedule]);

  if (!isOpen) return null;

  const handleToggleDay = (index: number) => {
    setSchedule((prev) =>
      prev.map((item) =>
        item.day_index === index
          ? { ...item, is_working: !item.is_working }
          : item
      )
    );
  };

  const handleTimeChange = (index: number, field: "start_time" | "end_time", value: string) => {
    setSchedule((prev) =>
      prev.map((item) =>
        item.day_index === index ? { ...item, [field]: value } : item
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave(schedule);
      onClose();
    } catch (error) {
      console.error("Çalışma programı kaydedilirken hata:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[32px] p-6 w-full max-w-xl border border-slate-100 shadow-2xl flex flex-col h-auto">
        
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-2xl">
              <CalendarDays className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-800">Haftalık Rutin Çalışma Saatleri</h3>
              <p className="text-slate-400 text-xs font-medium">
                Personel: <span className="text-purple-600 font-bold">{employeeName}</span>
              </p>
            </div>
          </div>
          <button onClick={onClose} type="button" className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="py-4 space-y-2.5">
          {schedule.map((item) => (
            <div key={item.day_index} className={`flex items-center justify-between p-2.5 rounded-2xl border transition-all ${item.is_working ? "bg-white border-slate-100 shadow-xs" : "bg-slate-50/60 border-slate-100 opacity-75"}`}>
              
              <div className="w-32">
                <span className="text-xs font-bold text-slate-700 block">{item.day_name}</span>
                <span className={`text-[9px] font-black uppercase tracking-wider ${item.is_working ? "text-emerald-500" : "text-amber-500"}`}>
                  {item.is_working ? "Mesai Yapıyor" : "İzin Günü"}
                </span>
              </div>

              <div className="flex-1 flex items-center justify-center gap-2">
                {item.is_working ? (
                  <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-100">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <input 
                      type="time" 
                      value={item.start_time} 
                      onChange={(e) => handleTimeChange(item.day_index, "start_time", e.target.value)} 
                      className="bg-transparent text-xs font-bold text-slate-700 focus:outline-hidden" 
                      required 
                    />
                    <span className="text-slate-400 font-medium text-xs mx-0.5">-</span>
                    <input 
                      type="time" 
                      value={item.end_time} 
                      onChange={(e) => handleTimeChange(item.day_index, "end_time", e.target.value)} 
                      className="bg-transparent text-xs font-bold text-slate-700 focus:outline-hidden" 
                      required 
                    />
                  </div>
                ) : (
                  <span className="text-[11px] font-semibold text-slate-400 italic">Bu gün randevu alımına kapatıldı.</span>
                )}
              </div>

              <div className="pl-4">
                <button type="button" onClick={() => handleToggleDay(item.day_index)} className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-hidden cursor-pointer ${item.is_working ? "bg-purple-600 flex justify-end" : "bg-slate-300 flex justify-start"}`}>
                  <div className="bg-white w-4 h-4 rounded-full shadow-xs" />
                </button>
              </div>
            </div>
          ))}

          <div className="flex gap-3 border-t border-slate-100 pt-4 mt-2 shrink-0">
            <button type="button" onClick={onClose} className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-500 text-xs font-bold py-2.5 px-4 rounded-xl transition-all cursor-pointer">Kapat</button>
            <button type="submit" disabled={isSubmitting} className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2">
              <Save className="w-3.5 h-3.5" />
              {isSubmitting ? "Kaydediliyor..." : "Haftalık Programı Kaydet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};