import React, { useState, useEffect } from "react";
import { X, Save } from "lucide-react";

interface InitialPackageData {
  name: string;
  price: string;
  period: string;
  description: string;
  features?: string[];
  popular: boolean;
}

interface FinalPackageData {
  name: string;
  price: string;
  period: string;
  description: string;
  featuresString: string;
  popular: boolean;
  features: string[];
}

interface PackageFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: FinalPackageData) => void;
  initialData?: InitialPackageData;
}

export const PackageFormModal: React.FC<PackageFormModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    period: "aylık",
    description: "",
    featuresString: "",
    popular: false
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        price: initialData.price || "",
        period: initialData.period || "aylık",
        description: initialData.description || "",
        featuresString: initialData.features ? initialData.features.join(", ") : "",
        popular: initialData.popular || false
      });
    } else {
      setFormData({
        name: "", 
        price: "", 
        period: "aylık", 
        description: "", 
        featuresString: "", 
        popular: false
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalData: FinalPackageData = {
      ...formData,
      features: formData.featuresString.split(",").map(f => f.trim()).filter(f => f !== "")
    };
    onSave(finalData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
        
        <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-lg font-black text-slate-800 tracking-tight">
            {initialData ? "Paketi Düzenle" : "Yeni Paket Oluştur"}
          </h3>
          <button type="button" onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5 col-span-2">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">Paket Adı</label>
              <input 
                required
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-hidden focus:border-purple-500 transition text-slate-700"
                placeholder="Örn: Standart Pro"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">Fiyat (₺)</label>
              <input 
                required
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-hidden focus:border-purple-500 transition text-slate-700"
                placeholder="599"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">Periyot</label>
              <select 
                value={formData.period}
                onChange={(e) => setFormData({...formData, period: e.target.value})}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-hidden text-slate-700"
              >
                <option value="aylık">Aylık</option>
                <option value="yıllık">Yıllık</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">Kısa Açıklama</label>
            <textarea 
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-hidden text-slate-700 h-20 resize-none"
              placeholder="Bu paketin hedef kitlesi kimler?"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider flex justify-between">
              Özellikler <span className="normal-case text-[10px] text-slate-400 font-bold">(Virgülle ayırarak yazın)</span>
            </label>
            <input 
              required
              type="text"
              value={formData.featuresString}
              onChange={(e) => setFormData({...formData, featuresString: e.target.value})}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-hidden text-slate-700"
              placeholder="Örn: 5 Personel, Sınırsız Randevu, Raporlama"
            />
          </div>

          <label className="flex items-center gap-3 p-3 bg-purple-50 border border-purple-100 rounded-xl cursor-pointer select-none">
            <input 
              type="checkbox"
              checked={formData.popular}
              onChange={(e) => setFormData({...formData, popular: e.target.checked})}
              className="w-4 h-4 accent-purple-600"
            />
            <span className="text-xs font-black text-purple-700">Bu paketi "En Popüler" olarak öne çıkar</span>
          </label>

          <div className="flex gap-3 pt-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-black transition"
            >
              Vazgeç
            </button>
            <button 
              type="submit"
              className="flex-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-black transition flex items-center justify-center gap-2 shadow-xs"
            >
              <Save className="w-4 h-4" /> {initialData ? "Değişiklikleri Kaydet" : "Paketi Ekle"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};