import React from "react";
import { X, AlertCircle, Upload } from "lucide-react";

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  mode: "add" | "edit";
  name: string;
  setName: (val: string) => void;
  stock: string;
  setStock: (val: string) => void;
  purchasePrice: string;
  setPurchasePrice: (val: string) => void;
  salePrice: string;
  setSalePrice: (val: string) => void;
  imageFile: string;
  setImageFile: (val: string) => void;
  isActiveStatus: boolean;
  setIsActiveStatus: (val: boolean) => void;
  errors: {
    name?: string;
    stock?: string;
    purchasePrice?: string;
    salePrice?: string;
    image?: string;
  };
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleNameChange: (val: string) => void;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ProductFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  mode,
  name,
  stock,
  setStock,
  purchasePrice,
  setPurchasePrice,
  salePrice,
  setSalePrice,
  imageFile,
  setImageFile,
  isActiveStatus,
  setIsActiveStatus,
  errors,
  fileInputRef,
  handleNameChange,
  handleImageChange,
}: ProductFormModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[32px] p-6 w-full max-w-2xl border border-slate-100 shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between pb-3 border-b border-slate-50 shrink-0">
          <div>
            <h3 className="text-lg font-black text-slate-800">
              {mode === "add"
                ? "Envantere Yeni Ürün Ekle"
                : "Ürün Detaylarını Düzenle"}
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

        <form
          onSubmit={onSubmit}
          className="flex-1 overflow-y-auto py-4 space-y-3 pr-1"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Ürün Spesifikasyon Adı
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className={`w-full bg-slate-50 border rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-800 focus:outline-hidden focus:bg-white transition-all ${errors.name ? "border-red-300 focus:border-red-400 bg-red-50/10" : "border-slate-100 focus:border-purple-200"}`}
                  placeholder="Örn: Profesyonel Şampuan"
                />
                {errors.name && (
                  <div className="text-red-500 text-[10px] font-bold flex items-center gap-1 mt-0.5">
                    <AlertCircle className="w-3 h-3" /> {errors.name}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Alış Fiyatı (₺)
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={purchasePrice}
                    onChange={(e) =>
                      setPurchasePrice(e.target.value.replace(/\D/g, ""))
                    }
                    className={`w-full bg-slate-50 border rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-800 focus:outline-hidden focus:bg-white transition-all ${errors.purchasePrice ? "border-red-300 focus:border-red-400 bg-red-50/10" : "border-slate-100 focus:border-purple-200"}`}
                    placeholder="Örn: 80"
                  />
                  {errors.purchasePrice && (
                    <div className="text-red-500 text-[10px] font-bold flex items-center gap-1 mt-0.5">
                      <AlertCircle className="w-3 h-3" /> {errors.purchasePrice}
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Satış Fiyatı (₺)
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={salePrice}
                    onChange={(e) =>
                      setSalePrice(e.target.value.replace(/\D/g, ""))
                    }
                    className={`w-full bg-slate-50 border rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-800 focus:outline-hidden focus:bg-white transition-all ${errors.salePrice ? "border-red-300 focus:border-red-400 bg-red-50/10" : "border-slate-100 focus:border-purple-200"}`}
                    placeholder="Örn: 125"
                  />
                  {errors.salePrice && (
                    <div className="text-red-500 text-[10px] font-bold flex items-center gap-1 mt-0.5">
                      <AlertCircle className="w-3 h-3" /> {errors.salePrice}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Mevcut Stok Adedi
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={stock}
                  onChange={(e) => setStock(e.target.value.replace(/\D/g, ""))}
                  className={`w-full bg-slate-50 border rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-800 focus:outline-hidden focus:bg-white transition-all ${errors.stock ? "border-red-300 focus:border-red-400 bg-red-50/10" : "border-slate-100 focus:border-purple-200"}`}
                  placeholder="Örn: 20"
                />
                {errors.stock && (
                  <div className="text-red-500 text-[10px] font-bold flex items-center gap-1 mt-0.5">
                    <AlertCircle className="w-3 h-3" /> {errors.stock}
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Ürün Görseli <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
                {imageFile ? (
                  <div className="relative w-full h-9.5 rounded-xl overflow-hidden border border-slate-100 group">
                    <img
                      src={imageFile}
                      alt="Önizleme"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setImageFile("")}
                      className="absolute top-1 right-1 p-1 bg-slate-900/70 text-white rounded-md backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className={`w-full h-9.5 border border-dashed rounded-xl flex items-center justify-center gap-2 bg-slate-50/50 hover:bg-slate-50 transition-all cursor-pointer ${errors.image ? "border-red-300 bg-red-50/10" : "border-slate-200 hover:border-purple-200"}`}
                  >
                    <Upload className="w-3 h-3 text-slate-400" />
                    <span className="text-[10px] font-bold text-slate-600">
                      Görsel Yüklemek Zorunludur
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

          {mode === "edit" && (
            <div className="flex items-center justify-between bg-slate-50 border border-slate-100 p-3 rounded-xl mt-4! shrink-0">
              <div>
                <span className="text-xs font-bold text-slate-700 block">
                  Katalog Satış Durumu
                </span>
                <span className="text-[10px] font-medium text-slate-400 block">
                  Kapatılırsa kasada satışı gerçekleştirilemez.
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

          <div className="flex gap-3 border-t border-slate-50 pt-4 mt-4! shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-500 text-xs font-bold py-2.5 px-4 rounded-xl transition-all cursor-pointer"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              className="flex-1 bg-brand-purple hover:bg-purple-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              {mode === "add" ? "Envantere Kaydet" : "Değişiklikleri Kaydet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
