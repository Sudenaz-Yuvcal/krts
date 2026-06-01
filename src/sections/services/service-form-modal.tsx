import React from "react";
import { X, AlertCircle, Upload } from "lucide-react";
import { DURATION_PILLS } from "../../constants/service";
import {
  filterServiceNameInput,
  type ServiceFormErrors,
} from "../../utils/validations";

interface ServiceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  mode: "add" | "edit";
  activeTab: "Kadın" | "Erkek";
  name: string;
  setName: (val: string) => void;
  price: string;
  setPrice: (val: string) => void;
  duration: number;
  setDuration: (val: number) => void;
  imageFile: string;
  setImageFile: (val: string) => void;
  isActiveStatus: boolean;
  setIsActiveStatus: (val: boolean) => void;
  errors: ServiceFormErrors;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ServiceFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  mode,
  activeTab,
  name,
  setName,
  price,
  setPrice,
  duration,
  setDuration,
  imageFile,
  setImageFile,
  isActiveStatus,
  setIsActiveStatus,
  errors,
  fileInputRef,
  handleImageChange,
}: ServiceFormModalProps) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50">
      <div className="bg-white rounded-[32px] p-6 w-full max-w-2xl border border-slate-100 shadow-2xl mx-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-50">
          <div>
            <h3 className="text-lg font-black text-slate-800">
              {mode === "add"
                ? `${activeTab} Kataloğuna Ekle`
                : "Hizmet Detaylarını Düzenle"}
            </h3>
            <p className="text-slate-400 text-[11px] font-medium mt-0.5">
              Rakamlar ve ardışık boşluklar güvenlik protokolünce
              engellenmiştir.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="mt-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Hizmet Spesifikasyon Adı
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(filterServiceNameInput(e.target.value, name))
                  }
                  className={`w-full bg-slate-50 border rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:outline-hidden focus:bg-white transition-all ${errors.name ? "border-red-300 focus:border-red-400 bg-red-50/10" : "border-slate-100 focus:border-purple-200"}`}
                  placeholder="Örn: Katlı Saç Kesimi"
                />
                {errors.name && (
                  <div className="text-red-500 text-[10px] font-bold flex items-center gap-1 mt-0.5">
                    <AlertCircle className="w-3 h-3" /> {errors.name}
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Fiyatlandırma Bedeli (₺)
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={price}
                  onChange={(e) => setPrice(e.target.value.replace(/\D/g, ""))}
                  className={`w-full bg-slate-50 border rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:outline-hidden focus:bg-white transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${errors.price ? "border-red-300 focus:border-red-400 bg-red-50/10" : "border-slate-100 focus:border-purple-200"}`}
                  placeholder="Örn: 450"
                />
                {errors.price && (
                  <div className="text-red-500 text-[10px] font-bold flex items-center gap-1 mt-0.5">
                    <AlertCircle className="w-3 h-3" /> {errors.price}
                  </div>
                )}
              </div>

              {mode === "edit" && (
                <div className="flex items-center justify-between bg-slate-50 border border-slate-100 p-3 rounded-xl">
                  <div>
                    <span className="text-xs font-bold text-slate-700 block">
                      Katalog Satış Durumu
                    </span>
                    <span className="text-[10px] font-medium text-slate-400 block">
                      Kapatılırsa randevu alınamaz.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsActiveStatus(!isActiveStatus)}
                    className={`w-10 h-5.5 rounded-full p-0.5 transition-colors duration-200 focus:outline-hidden cursor-pointer ${isActiveStatus ? "bg-emerald-500 flex justify-end" : "bg-slate-300 flex justify-start"}`}
                  >
                    <div className="bg-white w-4.5 h-4.5 rounded-full shadow-xs" />
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  İşlem Süresi
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {DURATION_PILLS.map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setDuration(mins)}
                      className={`py-2 text-[10px] font-bold rounded-lg border transition-all cursor-pointer text-center ${duration === mins ? "bg-brand-purple text-white border-brand-purple" : "bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100/70"}`}
                    >
                      {mins >= 60 ? `${mins / 60} Sa` : `${mins} Dk`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Hizmet Görseli
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />

                {imageFile ? (
                  <div className="relative w-full h-22 rounded-xl overflow-hidden border border-slate-100 group">
                    <img
                      src={imageFile}
                      alt="Önizleme"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setImageFile("")}
                      className="absolute top-1.5 right-1.5 p-1 bg-slate-900/70 text-white rounded-md backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className={`w-full h-22 border border-dashed rounded-xl flex flex-col items-center justify-center gap-1 bg-slate-50/50 hover:bg-slate-50 hover:border-purple-200 transition-all cursor-pointer ${errors.image ? "border-red-300" : "border-slate-200"}`}
                  >
                    <Upload className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-[11px] font-bold text-slate-600">
                      Görsel Yükle
                    </span>
                    <span className="text-[9px] font-medium text-slate-400">
                      PNG, JPG veya JPEG
                    </span>
                  </button>
                )}
                {errors.image && (
                  <div className="text-red-500 text-[10px] font-bold flex items-center gap-1 mt-0.5">
                    <AlertCircle className="w-3 h-3" /> {errors.image}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-3 border-t border-slate-50 pt-4 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-500 text-xs font-bold py-3 px-4 rounded-xl transition-all cursor-pointer"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              className="flex-1 bg-brand-purple hover:bg-purple-700 text-white text-xs font-bold py-3 px-4 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              {mode === "add" ? "Kataloğa Kaydet" : "Değişiklikleri Kaydet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
