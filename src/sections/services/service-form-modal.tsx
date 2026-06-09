import React from "react";
import { Loader2, Upload, X, Users } from "lucide-react";
import { type EmployeeItem } from "../../services/salonService";

export interface FormErrors {
  name?: string;
  price?: string;
  employees?: string;
  [key: string]: string | undefined;
}

export interface ServiceFormModalProps {
  isOpen: boolean;
  mode: "add" | "edit";
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  name: string;
  setName: (val: string) => void;
  price: string;
  setPrice: (val: string) => void;
  duration: number;
  setDuration: (val: number) => void;
  imageFile: string;
  isActiveStatus: boolean;
  setIsActiveStatus: (val: boolean) => void;
  errors: FormErrors;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isSubmitting?: boolean;
  allEmployees: EmployeeItem[];
  selectedEmployees: number[];
  setSelectedEmployees: (ids: number[]) => void;
}

export const ServiceFormModal = ({
  isOpen,
  mode,
  onClose,
  onSubmit,
  name,
  setName,
  price,
  setPrice,
  duration,
  setDuration,
  imageFile,
  isActiveStatus,
  setIsActiveStatus,
  errors,
  fileInputRef,
  handleImageChange,
  isSubmitting = false,
  allEmployees,
  selectedEmployees,
  setSelectedEmployees,
}: ServiceFormModalProps) => {
  if (!isOpen) return null;

  const toggleEmployee = (id: number) => {
    if (selectedEmployees.includes(id)) {
      setSelectedEmployees(selectedEmployees.filter((empId) => empId !== id));
    } else {
      setSelectedEmployees([...selectedEmployees, id]);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-50">
          <div>
            <h3 className="text-lg font-black text-slate-800">
              {mode === "add" ? "Yeni Hizmet Ekle" : "Hizmeti Düzenle"}
            </h3>
            <p className="text-[11px] font-semibold text-slate-400 uppercase mt-0.5 tracking-wider">
              Hizmet Kataloğu
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form 
          onSubmit={onSubmit} 
          className="p-8 space-y-5 max-h-[80vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none"
        >
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl p-6 bg-slate-50/50 relative group">
            <div className="w-20 h-20 rounded-xl bg-white overflow-hidden border border-slate-200 shadow-inner mb-3 flex items-center justify-center text-slate-300">
              {imageFile ? (
                <img src={imageFile} alt="Hizmet Görseli" className="w-full h-full object-cover" />
              ) : (
                <Upload className="w-8 h-8 text-slate-300 stroke-[1.5]" />
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs font-black text-brand-purple bg-white border border-slate-100 shadow-xs px-3 py-1.5 rounded-lg hover:bg-purple-50 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" /> 
              {imageFile ? "Görseli Değiştir" : "Görsel Seç"}
            </button>
            {!imageFile && (
              <p className="text-[10px] font-semibold text-slate-400 mt-2">Henüz bir katalog görseli belirlenmedi.</p>
            )}
            <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-black uppercase text-slate-400 tracking-wider">Hizmet Adı</label>
            <input
              type="text"
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              placeholder="Örn: Saç Kesimi & Fön"
              className={`w-full bg-slate-50 border ${errors.name ? "border-red-200 focus:border-red-300" : "border-slate-100 focus:border-purple-200"} rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:outline-hidden focus:bg-white transition-all`}
            />
            {errors.name && <span className="text-[10px] font-bold text-red-500 block">{errors.name}</span>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-black uppercase text-slate-400 tracking-wider">Hizmet Bedeli (₺)</label>
              <input
                type="number"
                value={price}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPrice(e.target.value)}
                placeholder="0.00"
                className={`w-full bg-slate-50 border ${errors.price ? "border-red-200 focus:border-red-300" : "border-slate-100 focus:border-purple-200"} rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:outline-hidden focus:bg-white transition-all`}
              />
              {errors.price && <span className="text-[10px] font-bold text-red-500 block">{errors.price}</span>}
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-black uppercase text-slate-400 tracking-wider">Süre (Dakika)</label>
              <select
                value={duration}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setDuration(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-100 focus:border-purple-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 focus:outline-hidden focus:bg-white transition-all cursor-pointer"
              >
                <option value={15}>15 Dakika</option>
                <option value={30}>30 Dakika</option>
                <option value={45}>45 Dakika</option>
                <option value={60}>1 Saat</option>
                <option value={90}>1.5 Saat</option>
                <option value={120}>2 Saat</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
              <Users className="w-3.5 h-3.5" /> Bu Hizmeti Verebilecek Çalışanlar
            </label>
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 space-y-2 max-h-36 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
              {allEmployees.length === 0 ? (
                <p className="text-[11px] font-bold text-slate-400 p-1">Sistemde henüz aktif çalışan bulunamadı.</p>
              ) : (
                allEmployees.map((emp) => {
                  if (emp.id === undefined || emp.id === null) return null;
                  return (
                    <label key={emp.id} className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-slate-100/60 shadow-2xs cursor-pointer select-none hover:bg-purple-50/20 transition-all">
                      <input
                        type="checkbox"
                        checked={selectedEmployees.includes(emp.id)}
                        onChange={() => toggleEmployee(emp.id!)}
                        className="w-4 h-4 rounded-md border-slate-300 text-brand-purple focus:ring-brand-purple cursor-pointer accent-purple-600"
                      />
                      <span className="text-xs font-black text-slate-700">
                        {emp.full_name}
                      </span>
                    </label>
                  );
                })
              )}
            </div>
            {errors.employees && <span className="text-[10px] font-bold text-red-500 block">{errors.employees}</span>}
          </div>

          {mode === "edit" && (
            <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100/50">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-700">Operasyon Statüsü</span>
                <span className="text-[10px] font-medium text-slate-400 mt-0.5">Hizmetin müşteriler tarafından seçilebilirliğini ayarlar.</span>
              </div>
              <button
                type="button"
                onClick={() => setIsActiveStatus(!isActiveStatus)}
                className={`w-10 h-6 flex items-center rounded-full p-1 transition-all duration-200 cursor-pointer ${isActiveStatus ? "bg-emerald-500 justify-end" : "bg-slate-200 justify-start"}`}
              >
                <div className="bg-white w-4 h-4 rounded-full shadow-xs" />
              </button>
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t border-slate-50">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-500 text-xs font-bold py-3 px-4 rounded-xl transition-all cursor-pointer disabled:opacity-50"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-brand-purple hover:bg-purple-700 text-white text-xs font-bold py-3 px-4 rounded-xl shadow-lg shadow-purple-100 transition-all cursor-pointer disabled:opacity-70 flex items-center justify-center gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Yükleniyor...
                </>
              ) : mode === "add" ? (
                "Kataloğa Ekle"
              ) : (
                "Değişiklikleri Kaydet"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};