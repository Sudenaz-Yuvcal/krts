import React, { useRef } from "react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { ArrowLeft, Upload, X, Phone, MapPin } from "lucide-react";
import { TURKEY_LOCATIONS } from "../../constants/locations";

interface SalonEditProps {
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
  errors: Record<string, string>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  isSubmitted: boolean;
  onSave: () => void;
  onCancel: () => void;
}

export const SalonEdit: React.FC<SalonEditProps> = ({
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
  errors,
  setErrors,
  isSubmitted,
  onSave,
  onCancel,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filterInput = (value: string): string => {
    let filtered = value.replace(/[0-9]/g, "");
    if (filtered.startsWith(" ")) filtered = filtered.trimStart();
    return filtered.replace(/ {2,}/g, " ");
  };

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      if (images.length + filesArray.length > 10) {
        setErrors((prev) => ({
          ...prev,
          images: "En fazla 10 fotoğraf yükleyebilirsiniz.",
        }));
        return;
      }
      const newImageUrls = filesArray.map((file) => URL.createObjectURL(file));
      setImages((prev) => {
        const updated = [...prev, ...newImageUrls];
        if (updated.length >= 3) setErrors((err) => ({ ...err, images: "" }));
        return updated;
      });
    }
  };

  const removeImage = (indexToRemove: number) => {
    setImages((prev) => {
      const updated = prev.filter((_, index) => index !== indexToRemove);
      if (updated.length < 3) {
        setErrors((err) => ({
          ...err,
          images: "Vitrin için en az 3 görsel yüklemelisiniz.",
        }));
      }
      return updated;
    });
  };

  return (
    <div className="animate-fadeIn">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onCancel}
          className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
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
          <div>
            <label className="text-sm font-semibold text-slate-700 block mb-2">
              Salon Görselleri{" "}
              <span className="text-xs text-slate-400 font-normal">
                (En az 3, en fazla 10 adet)
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
                    onClick={() => removeImage(index)}
                    className="absolute top-1.5 right-1.5 bg-rose-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-md hover:bg-rose-600 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {images.length < 10 && (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`h-24 border-2 border-dashed rounded-xl flex flex-col items-center justify-center bg-slate-50/50 cursor-pointer hover:bg-slate-50 transition-all ${isSubmitted && errors.images ? "border-rose-400 bg-rose-50/20" : "border-slate-200"}`}
                >
                  <Upload className="w-5 h-5 text-slate-400 mb-0.5" />
                  <span className="text-[11px] font-bold text-slate-600">
                    Resim Ekle
                  </span>
                  <span className="text-[9px] text-slate-400">
                    {images.length}/10
                  </span>
                </div>
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

          <div>
            <label className="text-sm font-semibold text-slate-700 block mb-1.5">
              Salon Telefon Numarası
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="text"
                placeholder="05XX XXX XX XX"
                value={phone}
                onChange={handlePhoneChange}
                className={`w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:border-purple-300 transition-all shadow-sm ${isSubmitted && errors.phone ? "border-rose-400 bg-rose-50/30" : "border-slate-100"}`}
              />
            </div>
            {isSubmitted && errors.phone && (
              <span className="text-xs font-semibold text-rose-500 mt-1 block">
                {errors.phone}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-1.5">
                Şehir
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3.5 z-10" />
                <select
                  value={selectedCity}
                  onChange={(e) => {
                    setSelectedCity(e.target.value);
                    setSelectedDistrict("");
                  }}
                  className={`w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border bg-white focus:outline-none focus:border-purple-300 shadow-sm ${isSubmitted && errors.city ? "border-rose-400 bg-rose-50/30" : "border-slate-100"}`}
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
                  disabled={!selectedCity}
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
              placeholder="Mahalle, cadde, sokak..."
              value={address}
              onChange={(e) => setAddress(filterInput(e.target.value))}
              className={`w-full border p-4 rounded-xl text-sm focus:outline-none focus:border-purple-300 shadow-sm resize-none ${isSubmitted && errors.address ? "border-rose-400 bg-rose-50/30" : "border-slate-100"}`}
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
              placeholder="Salonunuzun hizmet kalitesini, vizyonunu..."
              value={about}
              onChange={(e) => setAbout(filterInput(e.target.value))}
              className={`w-full border p-4 rounded-xl text-sm focus:outline-none focus:border-purple-300 shadow-sm resize-none ${isSubmitted && errors.about ? "border-rose-400 bg-rose-50/30" : "border-slate-100"}`}
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
              onClick={onCancel}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer transition-colors"
            >
              İptal Et
            </button>
            <Button type="button" variant="primary" onClick={onSave}>
              Değişiklikleri Kaydet
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
