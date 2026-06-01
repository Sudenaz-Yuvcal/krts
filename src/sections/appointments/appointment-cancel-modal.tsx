import React, { useState } from "react";
import { Ban } from "lucide-react";
import { CANCEL_OPTIONS } from "../../constants/appointments";

interface AppointmentCancelModalProps {
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

export const AppointmentCancelModal = ({
  onClose,
  onConfirm,
}: AppointmentCancelModalProps) => {
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [customReason, setCustomReason] = useState<string>("");
  const [cancelError, setCancelError] = useState<string>("");
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedReason) {
      setCancelError("Lütfen bir iptal sebebi seçin.");
      return;
    }

    if (selectedReason === "Diğer (Gerekçe Belirtiniz)") {
      if (!customReason.trim()) {
        setCancelError("Lütfen iptal gerekçenizi buraya yazın.");
        return;
      }
      onConfirm(customReason.trim());
    } else {
      onConfirm(selectedReason);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[32px] p-6 w-full max-w-md border border-slate-100 shadow-2xl">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-50">
          <div className="w-10 h-10 bg-red-50 text-red-500 flex items-center justify-center rounded-xl border border-red-100/50">
            <Ban className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-800">
              Randevuyu İptal Et
            </h3>
            <p className="text-slate-400 text-[11px] font-semibold mt-0.5">
              İptal nedenini seçerek randevuyu sonlandırın.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Lütfen Bir Sebep Seçin
            </label>
            <div className="space-y-2">
              {CANCEL_OPTIONS.map((option) => (
                <label
                  key={option}
                  className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${selectedReason === option ? "border-purple-300 bg-purple-50/20 text-slate-800" : "border-slate-100 bg-slate-50/50 text-slate-600 hover:bg-slate-50"}`}
                >
                  <input
                    type="radio"
                    name="cancelReason"
                    value={option}
                    checked={selectedReason === option}
                    onChange={(e) => {
                      setSelectedReason(e.target.value);
                      setCancelError("");
                    }}
                    className="accent-brand-purple"
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>

          {selectedReason === "Diğer (Gerekçe Belirtiniz)" && (
            <div className="space-y-1.5 animate-fadeIn">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                İptal Açıklaması
              </label>
              <textarea
                rows={2}
                value={customReason}
                onChange={(e) => {
                  setCustomReason(e.target.value);
                  setCancelError("");
                }}
                placeholder="Lütfen diğer iptal gerekçesini detaylandırın..."
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-800 focus:outline-hidden focus:bg-white focus:border-purple-200 transition-all resize-none placeholder:text-slate-400"
              />
            </div>
          )}

          {cancelError && (
            <p className="text-red-500 text-[10px] font-bold flex items-center gap-1">
              {cancelError}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-500 text-xs font-bold py-2.5 px-4 rounded-xl transition-all cursor-pointer"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              className="flex-1 bg-red-500 hover:bg-red-600 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              Randevuyu Sonlandır
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
