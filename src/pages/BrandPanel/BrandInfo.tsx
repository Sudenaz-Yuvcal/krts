import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../../lib/supabaseClient"; 
import { Building2, Phone, Award, Loader2, Edit3, Save, X, Upload } from "lucide-react";

const GECICI_TEST_ID = "00000000-0000-0000-0000-000000000000";

export interface BrandProfile {
  id: string;
  brand_name: string;
  sector: string; 
  logo_url: string;
  phone: string;      
  email: string;     
  website: string; 
}

interface DBBrandRow {
  id: string;
  brand_name?: string | null;
  marka_adı?: string | null;
  sector?: string | null;
  sektör?: string | null;
  logo_url?: string | null;
  phone?: string | null;
  telefon?: string | null;
  email?: string | null;
  e_posta?: string | null;
  website?: string | null;
  web_sitesi?: string | null;
}

interface BrandUpsertPayload {
  id: string;
  brand_name: string;
  sector: string;
  logo_url: string;
  phone: string;
  email: string;
  website: string;
}

export const BrandInfo: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [brandId] = useState<string>(GECICI_TEST_ID);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState<Omit<BrandProfile, "id">>({
    brand_name: "",
    sector: "",
    logo_url: "",
    phone: "",
    email: "",
    website: ""
  });

  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, "");
    if (digits.length === 0) return "";
    if (digits.length <= 1) return digits;
    if (digits.length <= 4) return `${digits[0]} (${digits.slice(1)}`;
    if (digits.length <= 7) return `${digits[0]} (${digits.slice(1, 4)}) ${digits.slice(4)}`;
    if (digits.length <= 9) return `${digits[0]} (${digits.slice(1, 4)}) ${digits.slice(4, 7)} ${digits.slice(7)}`;
    return `${digits[0]} (${digits.slice(1, 4)}) ${digits.slice(4, 7)} ${digits.slice(7, 9)} ${digits.slice(9, 11)}`;
  };

  useEffect(() => {
    const loadBrandInfo = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("brands") 
          .select("*")
          .eq("id", brandId)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          const safeData = data as DBBrandRow;
          setFormData({
            brand_name: safeData.brand_name || safeData.marka_adı || "",
            sector: safeData.sector || safeData.sektör || "",
            logo_url: safeData.logo_url || "",
            phone: safeData.phone ? formatPhoneNumber(safeData.phone) : (safeData.telefon ? formatPhoneNumber(safeData.telefon) : ""),
            email: safeData.email || safeData.e_posta || "",
            website: safeData.website || safeData.web_sitesi || ""
          });
        }
      } catch (error) {
        console.error("Marka bilgileri yüklenirken hata:", error);
      } finally {
        setLoading(false);
      }
    };

    loadBrandInfo();
  }, [brandId]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith("image/")) {
      alert("Lütfen sadece resim dosyası yükleyiniz.");
      return;
    }

    try {
      setIsUploading(true);
      const fileExt = file.name.split(".").pop();
      const fileName = `${brandId}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("brand-logos")
        .upload(filePath, file, { cacheControl: "3600", upsert: true });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from("brand-logos")
        .getPublicUrl(filePath);

      if (publicUrlData) {
        setFormData(prev => ({ ...prev, logo_url: publicUrlData.publicUrl }));
        setToastMessage("Logo dosyası seçildi! Değişiklikleri kaydedin.");
        setTimeout(() => setToastMessage(null), 3000);
      }
    } catch (error) {
      console.error("Logo yükleme hatası:", error);
      alert("Logo yüklenirken hata oluştu.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "phone") {
      setFormData(prev => ({ ...prev, [name]: formatPhoneNumber(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const rawPhoneDigits = formData.phone.replace(/\D/g, "");
    
    let finalWebsite = formData.website.trim();
    if (finalWebsite && !/^https?:\/\//i.test(finalWebsite)) {
      finalWebsite = "https://" + finalWebsite;
    }

    try {
      setIsSaving(true);
      
      const payload: BrandUpsertPayload = {
        id: brandId,
        brand_name: formData.brand_name,
        sector: formData.sector,
        logo_url: formData.logo_url,
        phone: rawPhoneDigits,
        email: formData.email,
        website: finalWebsite
      };

      const { error } = await supabase
        .from("brands") 
        .upsert(payload, { onConflict: "id" });

      if (error) throw error;

      setFormData(prev => ({ ...prev, phone: formatPhoneNumber(rawPhoneDigits), website: finalWebsite }));
      setToastMessage("Marka profil bilgileri başarıyla kaydedildi!");
      setIsEditMode(false);
      setTimeout(() => setToastMessage(null), 3000);
    } catch (error) {
      console.error("Kaydetme hatası:", error);
      alert("Kaydedilirken hata oluştu. Supabase bağlantısını kontrol edin.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-2 text-sm font-bold text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        Marka profili yükleniyor...
      </div>
    );
  }

  return (
    <div className="space-y-8 relative max-w-4xl mx-auto">
      {toastMessage && (
        <div className="fixed top-6 right-6 bg-slate-900 text-white text-xs font-bold px-5 py-3.5 rounded-2xl shadow-xl z-50 flex items-center gap-2 border border-slate-800">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          {toastMessage}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-800">Marka Profili (Test Modu)</h2>
          <p className="text-slate-400 text-xs font-semibold mt-1">
            Giriş yapmadan, doğrudan veritabanı üzerinden çalışma ve test alanı.
          </p>
        </div>
        {!isEditMode ? (
          <button
            type="button"
            onClick={() => setIsEditMode(true)}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold h-11 px-5 rounded-xl shadow-lg shadow-purple-100 transition-all cursor-pointer"
          >
            <Edit3 className="w-4 h-4" /> Profili Düzenle
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setIsEditMode(false)}
              className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold h-11 px-4 rounded-xl transition-all cursor-pointer"
            >
              <X className="w-4 h-4" /> İptal
            </button>
            <button
              type="submit"
              form="brand-info-form"
              disabled={isSaving || isUploading}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white text-xs font-bold h-11 px-5 rounded-xl shadow-lg shadow-emerald-100 transition-all cursor-pointer"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} 
              Değişiklikleri Kaydet
            </button>
          </div>
        )}
      </div>

      <form id="brand-info-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="md:col-span-1 bg-white border border-slate-100 p-6 rounded-[28px] shadow-sm flex flex-col items-center text-center justify-between min-h-85">
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

          <div className="w-full flex flex-col items-center">
            <div 
              onClick={() => isEditMode && !isUploading && fileInputRef.current?.click()}
              className={`w-28 h-28 bg-slate-50 border rounded-3xl overflow-hidden flex flex-col items-center justify-center relative group mb-4 shadow-inner transition-all ${
                isEditMode ? "border-dashed border-purple-300 cursor-pointer hover:border-purple-500 hover:bg-purple-50/30" : "border-slate-100"
              }`}
            >
              {isUploading ? (
                <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center gap-1">
                  <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
                </div>
              ) : formData.logo_url ? (
                <>
                  <img src={formData.logo_url} alt="Marka Logo" className="w-full h-full object-cover" />
                  {isEditMode && <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-[10px] font-bold"><Upload className="w-3.5 h-3.5 mr-1" /> Değiştir</div>}
                </>
              ) : (
                <div className="text-slate-300 flex flex-col items-center gap-1">
                  <Building2 className="w-10 h-10" />
                  {isEditMode && <span className="text-[9px] text-purple-500 font-bold">Logo Seç</span>}
                </div>
              )}
            </div>

            {!isEditMode ? (
              <>
                <h3 className="text-lg font-black text-slate-800">{formData.brand_name || "Marka Adı Girilmemiş"}</h3>
                <span className="inline-block bg-purple-50 text-purple-600 text-[10px] font-black uppercase tracking-wide px-2.5 py-1 rounded-lg mt-1">
                  {formData.sector || "Sektör Belirtilmemiş"}
                </span>
              </>
            ) : (
              <p className="text-slate-400 text-[10px] font-bold max-w-45">Logo yüklemek için tıklayın (Maks 2MB).</p>
            )}
          </div>

          <div className="w-full border-t border-slate-50 mt-6 pt-4 text-left">
            <div className="flex items-center gap-2.5 text-slate-500">
              <Award className="w-4 h-4 text-purple-500" />
              <div className="text-xs font-semibold">
                <span className="text-slate-400 block text-[10px]">Aktif Test UID</span>
                <span className="font-mono text-[9px] bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">{brandId}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 bg-white border border-slate-100 p-6 rounded-[28px] shadow-sm space-y-4">
          <h4 className="text-sm font-black text-slate-800 flex items-center gap-2 border-b border-slate-50 pb-3">
            <Phone className="w-4 h-4 text-purple-500" /> Kurumsal İletişim Bilgileri
          </h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Marka Adı *</label>
              <input type="text" name="brand_name" required disabled={!isEditMode} value={formData.brand_name} onChange={handleInputChange} className="w-full disabled:bg-slate-50/50 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs text-slate-800" />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Hizmet Sektörü</label>
              <input type="text" name="sector" disabled={!isEditMode} value={formData.sector} onChange={handleInputChange} className="w-full disabled:bg-slate-50/50 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs text-slate-800" />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Telefon Numarası</label>
              <input type="text" name="phone" disabled={!isEditMode} value={formData.phone} onChange={handleInputChange} className="w-full disabled:bg-slate-50/50 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs text-slate-800 font-mono" />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">E-Posta Adresi</label>
              <input type="email" name="email" disabled={!isEditMode} value={formData.email} onChange={handleInputChange} className="w-full disabled:bg-slate-50/50 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs text-slate-800" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Web Sitesi</label>
              <input type="text" name="website" disabled={!isEditMode} value={formData.website} onChange={handleInputChange} className="w-full disabled:bg-slate-50/50 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs text-slate-800" />
            </div>
          </div>
        </div>

      </form>
    </div>
  );
};

export default BrandInfo;