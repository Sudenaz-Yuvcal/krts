import React, { useRef, useState } from "react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { ArrowLeft, Upload, X, Phone, MapPin, Loader2, Store, Mail, Clock } from "lucide-react";
import { TURKEY_LOCATIONS } from "../../constants/locations";
import { supabase } from "../../lib/supabaseClient";

interface SalonEditProps {
  salonName: string;
  setSalonName: (val: string) => void;
  mail: string;
  setMail: (val: string) => void;
  phone: string;
  setPhone: (val: string) => void;
  selectedCity: string;
  setSelectedCity: (val: string) => void;
  selectedDistrict: string;
  setSelectedDistrict: (val: string) => void;
  address: string;
  setAddress: (val: string) => void;
  about: string;
  setAbout: (val: string) => void;
  images: string[];
  setImages: React.Dispatch<React.SetStateAction<string[]>>;
  openingTime: string;                                         
  setOpeningTime: (val: string) => void;                   
  closingTime: string;                                          
  setClosingTime: (val: string) => void;                    
  errors: Record<string, string>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  isSubmitted: boolean;
  onSave: () => void;
  onCancel: () => void;
  isSavingExternal?: boolean;
}

export const SalonEdit = ({
  salonName,
  setSalonName,
  mail,
  setMail,
  phone,
  setPhone,
  selectedCity,
  setSelectedCity,
  selectedDistrict,
  setSelectedDistrict,
  address,
  setAddress,
  about,
  setAbout,
  images,
  setImages,
  openingTime,                                              
  setOpeningTime,                                             
  closingTime,                                                
  setClosingTime,                                               
  errors,
  setErrors,
  isSubmitted,
  onSave,
  onCancel,
  isSavingExternal = false,
}: SalonEditProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value.replace(/\D/g, "");
    if (input.length > 0 && input[0] !== "0") input = "0" + input;
    if (input.length > 11) input = input.substring(0, 11);

    let formattedOutput = "";
    if (input.length > 0) formattedOutput += input.substring(0, 4);
    if (input.length > 4) formattedOutput += " " + input.substring(4, 7);
    if (input.length > 7) formattedOutput += " " + input.substring(7, 9);
    if (input.length > 9) formattedOutput += " " + input.substring(9, 11);

    setPhone(formattedOutput);
    if (input.length === 11) setErrors((prev) => ({ ...prev, phone: "" }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      
      if (images.length + filesArray.length > 10) {
        setErrors((prev) => ({
          ...prev,
          images: "En fazla 10 fotoğraf yükleyebilirsiniz.",
        }));
        return;
      }

      try {
        setIsUploading(true);
        const uploadedUrls: string[] = [];

        for (const file of filesArray) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
          const filePath = `${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from("salons")
            .upload(filePath, file, {
              cacheControl: '3600',
              upsert: false
            });

          if (uploadError) {
            console.error("Resim yükleme hatası detay:", uploadError.message);
            throw uploadError;
          }

          const { data: publicUrlData } = supabase.storage
            .from("salons")
            .getPublicUrl(filePath);

          if (publicUrlData?.publicUrl) {
            uploadedUrls.push(publicUrlData.publicUrl);
          }
        }

        if (uploadedUrls.length > 0) {
          setImages((prev) => {
            const updated = [...prev, ...uploadedUrls];
            if (updated.length >= 1) setErrors((err) => ({ ...err, images: "" }));
            return updated;
          });
        }

      } catch (err) {
        console.error("Supabase Storage yükleme başarısız:", err);
        alert("Görseller yüklenemedi. Lütfen Supabase panelinizde Storage sekmesinde 'salons' adında public bir Bucket oluşturduğunuzdan emin olun.");
      } finally {
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    }
  };

  const removeImage = (indexToRemove: number) => {
    setImages((prev) => {
      const updated = prev.filter((_, index) => index !== indexToRemove);
      if (updated.length < 1) {
        setErrors((err) => ({
          ...err,
          images: "Vitrin için en az 1 görsel yüklemelisiniz.",
        }));
      }
      return updated;
    });
  };

  const isFormDisabled = isSavingExternal;
  const isActionDisabled = isSavingExternal || isUploading;

  return (
    <div className="animate-fadeIn">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onCancel}
          disabled={isActionDisabled}
          className="p-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 rounded-xl transition-all cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div>
          <h2 className="text-2xl font-black text-slate-800">
            Salon Profilini Düzenle
          </h2>
          <p className="text-xs text-slate-400">
            Değişiklikleri yaptıktan sonra kaydetmeyi unutmayın.
          </p>
        </div>
      </div>

      <Card className="p-8">
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-1.5">
                Salon Adı
              </label>
              <div className="relative">
                <Store className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  disabled={isFormDisabled}
                  placeholder="Salonunuzun Ticari Adı"
                  value={salonName}
                  onChange={(e) => setSalonName(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border border-slate-100 focus:outline-none focus:border-purple-300 transition-all shadow-sm disabled:bg-slate-50 disabled:text-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-1.5">
                E-Posta Adresi
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="email"
                  disabled={isFormDisabled}
                  placeholder="iletisim@salonadi.com"
                  value={mail}
                  onChange={(e) => setMail(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border border-slate-100 focus:outline-none focus:border-purple-300 transition-all shadow-sm disabled:bg-slate-50 disabled:text-slate-400"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700 block mb-2">
              Salon Görselleri{" "}
              <span className="text-xs text-slate-400 font-normal">
                (En az 1, en fazla 10 adet)
              </span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4 mb-2">
              {images.map((url, index) => (
                <div
                  key={index}
                  className="relative w-full h-24 rounded-xl overflow-hidden border border-slate-100 group shadow-sm"
                >
                  <img
                    src={url}
                    alt={`Salon-${index}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    disabled={isActionDisabled}
                    onClick={() => removeImage(index)}
                    className="absolute top-1.5 right-1.5 bg-rose-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-md hover:bg-rose-600 cursor-pointer disabled:opacity-50"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {images.length < 10 && (
                <button
                  type="button"
                  disabled={isActionDisabled}
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-full h-24 border-2 border-dashed rounded-xl flex flex-col items-center justify-center bg-slate-50/50 cursor-pointer hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${isSubmitted && errors.images ? "border-rose-400 bg-rose-50/20" : "border-slate-200"}`}
                >
                  {isUploading ? (
                    <Loader2 className="w-5 h-5 text-purple-500 animate-spin mb-0.5" />
                  ) : (
                    <Upload className="w-5 h-5 text-slate-400 mb-0.5" />
                  )}
                  <span className="text-[11px] font-bold text-slate-600">
                    {isUploading ? "Yükleniyor..." : "Resim Ekle"}
                  </span>
                  <span className="text-[9px] text-slate-400">
                    {images.length}/10
                  </span>
                </button>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                multiple
                accept="image/*"
                className="hidden"
              />
            </div>
            {isSubmitted && errors.images && (
              <span className="text-xs font-semibold text-rose-500 mt-1 block">
                {errors.images}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-1.5">
                Salon Telefon Numarası
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  disabled={isFormDisabled}
                  placeholder="05XX XXX XX XX"
                  value={phone}
                  onChange={handlePhoneChange}
                  className={`w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:border-purple-300 transition-all shadow-sm disabled:bg-slate-50 disabled:text-slate-400 ${isSubmitted && errors.phone ? "border-rose-400 bg-rose-50/30" : "border-slate-100"}`}
                />
              </div>
              {isSubmitted && errors.phone && (
                <span className="text-xs font-semibold text-rose-500 mt-1 block">
                  {errors.phone}
                </span>
              )}
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-1.5">
                Çalışma Saatleri Ayarı
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <Clock className="w-4 h-4 text-indigo-500 absolute left-3 top-3.5 z-10 pointer-events-none" />
                  <input
                    type="time"
                    disabled={isFormDisabled}
                    value={openingTime}
                    onChange={(e) => setOpeningTime(e.target.value)}
                    className="w-full pl-9 pr-2 py-2.5 rounded-xl text-sm font-bold border border-slate-100 bg-indigo-50/20 text-indigo-700 focus:outline-none focus:border-purple-300 transition-all shadow-sm disabled:bg-slate-50 disabled:text-slate-400"
                  />
                </div>
                <div className="relative">
                  <Clock className="w-4 h-4 text-indigo-500 absolute left-3 top-3.5 z-10 pointer-events-none" />
                  <input
                    type="time"
                    disabled={isFormDisabled}
                    value={closingTime}
                    onChange={(e) => setClosingTime(e.target.value)}
                    className="w-full pl-9 pr-2 py-2.5 rounded-xl text-sm font-bold border border-slate-100 bg-indigo-50/20 text-indigo-700 focus:outline-none focus:border-purple-300 transition-all shadow-sm disabled:bg-slate-50 disabled:text-slate-400"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-1.5">
                Şehir
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3.5 z-10" />
                <select
                  disabled={isFormDisabled}
                  value={selectedCity}
                  onChange={(e) => {
                    setSelectedCity(e.target.value);
                    setSelectedDistrict("");
                  }}
                  className={`w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border bg-white focus:outline-none focus:border-purple-300 shadow-sm disabled:bg-slate-50 disabled:text-slate-400 ${isSubmitted && errors.city ? "border-rose-400 bg-rose-50/30" : "border-slate-100"}`}
                >
                  <option value="">Şehir Seçin</option>
                  {Object.keys(TURKEY_LOCATIONS).map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
              {isSubmitted && errors.city && (
                <span className="text-xs font-semibold text-rose-500 mt-1 block">
                  {errors.city}
                </span>
              )}
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-1.5">
                İlçe
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3.5 z-10" />
                <select
                  value={selectedDistrict}
                  disabled={!selectedCity || isFormDisabled}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className={`w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border bg-white focus:outline-none focus:border-purple-300 shadow-sm ${!selectedCity ? "bg-slate-50 cursor-not-allowed text-slate-400" : ""} ${isSubmitted && errors.district ? "border-rose-400 bg-rose-50/30" : "border-slate-100"}`}
                >
                  <option value="">İlçe Seçin</option>
                  {selectedCity &&
                    TURKEY_LOCATIONS[selectedCity].map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                </select>
              </div>
              {isSubmitted && errors.district && (
                <span className="text-xs font-semibold text-rose-500 mt-1 block">
                  {errors.district}
                </span>
              )}
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700 block mb-1.5">
              Açık Adres
            </label>
            <textarea
              rows={2}
              disabled={isFormDisabled}
              placeholder="Mahalle, cadde, sokak, kapı numarası..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className={`w-full border p-4 rounded-xl text-sm focus:outline-none focus:border-purple-300 shadow-sm resize-none disabled:bg-slate-50 disabled:text-slate-400 ${isSubmitted && errors.address ? "border-rose-400 bg-rose-50/30" : "border-slate-100"}`}
            />
            {isSubmitted && errors.address && (
              <span className="text-xs font-semibold text-rose-500 mt-1 block">
                {errors.address}
              </span>
            )}
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700 block mb-1.5">
              Salon Hakkında Açıklama
            </label>
            <textarea
              rows={4}
              disabled={isFormDisabled}
              placeholder="Salonunuzun hizmet kalitesini, vizyonunu..."
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              className={`w-full border p-4 rounded-xl text-sm focus:outline-none focus:border-purple-300 shadow-sm resize-none disabled:bg-slate-50 disabled:text-slate-400 ${isSubmitted && errors.about ? "border-rose-400 bg-rose-50/30" : "border-slate-100"}`}
            />
            {isSubmitted && errors.about && (
              <span className="text-xs font-semibold text-rose-500 mt-1 block">
                {errors.about}
              </span>
            )}
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-50 pt-4">
            <button
              type="button"
              disabled={isActionDisabled}
              onClick={onCancel}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer transition-colors disabled:opacity-50"
            >
              İptal Et
            </button>
            <Button 
              type="button" 
              variant="primary" 
              onClick={onSave}
              disabled={isActionDisabled}
            >
              {isSavingExternal ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Kaydediliyor...
                </span>
              ) : (
                "Değişiklikleri Kaydet"
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};