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
  images: string[];
  removeUploadedImage: (index: number) => void;
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
  isUploading?: boolean;
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
  images = [],
  removeUploadedImage,
  isActiveStatus,
  setIsActiveStatus,
  errors,
  fileInputRef,
  handleNameChange,
  handleImageChange,
  isUploading = false,
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
              Rakamlar ve ardışık boşluklar güvenlik protokolünce engellenmiştir.
            </p>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={onSubmit}
          className="flex-1 overflow-y-auto py-4 space-y-4 pr-1 flex flex-col justify-between"
        >
          <div className="space-y-4">
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
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Ürün Fotoğrafları <span className="text-red-500">*</span>
                    </label>
                    <span className="text-[10px] font-black text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">
                      {images.length} / 3 Fotoğraf
                    </span>
                  </div>
                  
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    multiple
                    className="hidden"
                    disabled={images.length >= 3 || isUploading}
                  />

                  <div className="grid grid-cols-3 gap-2">
                    {[0, 1, 2].map((index) => {
                      const currentImg = images[index];

                      return (
                        <div
                          key={index}
                          className={`relative h-28 border rounded-xl overflow-hidden flex flex-col items-center justify-center transition-all bg-slate-50/50 ${
                            currentImg
                              ? "border-slate-100 group"
                              : index === 0
                              ? "border-dashed border-purple-200 bg-purple-50/10"
                              : "border-dashed border-slate-200"
                          }`}
                        >
                          {currentImg ? (
                            <>
                              <img
                                src={currentImg}
                                alt={`Ürün Resmi ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                              
                              <div className={`absolute bottom-0 inset-x-0 py-0.5 text-center font-black text-[8px] uppercase tracking-wider select-none text-white ${index === 0 ? "bg-purple-600" : "bg-slate-700/80"}`}>
                                {index === 0 ? "Kapak" : `Yan Resim ${index}`}
                              </div>

                              <button
                                type="button"
                                onClick={() => removeUploadedImage(index)}
                                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-md shadow-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10 hover:bg-red-600"
                              >
                                <X className="w-2.5 h-2.5" />
                              </button>
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              disabled={isUploading}
                              className={`w-full h-full flex flex-col items-center justify-center p-2 gap-1 text-center transition-colors cursor-pointer disabled:cursor-not-allowed ${
                                index === 0 ? "hover:bg-purple-50/30" : "hover:bg-slate-50"
                              }`}
                            >
                              {isUploading && index === images.length ? (
                                <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Upload className={`w-3.5 h-3.5 ${index === 0 ? "text-purple-400" : "text-slate-400"}`} />
                              )}
                              <span className={`text-[9px] font-bold block leading-tight ${index === 0 ? "text-purple-600" : "text-slate-500"}`}>
                                {index === 0 ? "Kapak Fotoğrafı" : `Yan Foto ${index}`}
                              </span>
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <p className="text-[10px] font-medium text-slate-400 pt-1">
                    İlk sıradaki görsel vitrin (kapak) resmi olarak atanır. En fazla 3 görsel yükleyebilirsiniz.
                  </p>

                  {errors.image && (
                    <div className="text-red-500 text-[10px] font-bold flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3" /> {errors.image}
                    </div>
                  )}
                </div>
              </div>

            </div>

            {mode === "edit" && (
              <div className="flex items-center justify-between bg-slate-50 border border-slate-100 p-3 rounded-xl">
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
          </div>

          <div className="flex gap-3 border-t border-slate-50 pt-4 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-500 text-xs font-bold py-2.5 px-4 rounded-xl transition-all cursor-pointer"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="flex-1 bg-brand-purple hover:bg-purple-700 disabled:bg-purple-300 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {mode === "add" ? "Envantere Kaydet" : "Değişiklikleri Kaydet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};