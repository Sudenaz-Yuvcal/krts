import { useState, useEffect } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { SalonPreview } from "../../sections/salon/salon-preview";
import { SalonEdit } from "../../sections/salon/salon-edit";
import { validateSalonForm } from "../../utils/validations";
import { supabase } from "../../lib/supabaseClient";

export const SalonDetails = () => {
  const [viewMode, setViewMode] = useState<"preview" | "edit">("preview");
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const [salonName, setSalonName] = useState("");
  const [phone, setPhone] = useState("");
  const [mail, setMail] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [address, setAddress] = useState("");
  const [about, setAbout] = useState("");
  
  const [openingTime, setOpeningTime] = useState("");
  const [closingTime, setClosingTime] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const initializeSalon = async () => {
      try {
        setLoading(true);

        const testUserId = "c719841b-0da9-4545-b510-c1d8f97a4890";
        setUserId(testUserId);

        const { data, error: fetchError } = await supabase
          .from("salons")
          .select("*")
          .eq("salon_id", testUserId);

        if (fetchError) throw fetchError;

        if (data && data.length > 0) {
          const salon = data[0];
          
          setSalonName(salon.salon_name || "");
          setPhone(salon.phone || "");
          setMail(salon.mail || ""); 
          setSelectedCity(salon.city || "");
          setSelectedDistrict(salon.district || "");
          setAddress(salon.address || "");
          setAbout(salon.about || "");
          
          setOpeningTime(salon.opening_time || "");
          setClosingTime(salon.closing_time || "");

          let rawImages = salon.cover_images;
          let parsedImages: string[] = [];

          if (Array.isArray(rawImages)) {
            parsedImages = rawImages;
          } else if (typeof rawImages === "string" && rawImages.trim() !== "") {
            const cleanStr = rawImages.trim();
            if (cleanStr.startsWith("[") && cleanStr.endsWith("]")) {
              try {
                parsedImages = JSON.parse(cleanStr);
              } catch {
                parsedImages = [cleanStr];
              }
            } else {
              parsedImages = cleanStr.includes(",") ? cleanStr.split(",") : [cleanStr];
            }
          }

          const cleanImages = parsedImages
            .map((img) => {
              if (typeof img !== "string") return "";
              const trimmed = img.trim();
              if (trimmed.startsWith("http")) {
                return encodeURI(trimmed);
              }
              return trimmed;
            })
            .filter(Boolean);

          setImages(cleanImages);
        }
      } catch (err) {
        console.error("Salon senkronizasyon hatası:", err);
      } finally {
        setLoading(false);
      }
    };

    initializeSalon();
  }, []);

  const handleSave = async () => {
    if (!userId) return;
    setIsSubmitted(true);

    const validationErrors = validateSalonForm({
      phone,
      city: selectedCity,
      district: selectedDistrict,
      address: address.trim(),
      about: about.trim(),
      imagesCount: images.length,
    });

    if (!openingTime) {
      validationErrors.openingTime = "Lütfen salonun açılış saatini seçiniz.";
    }
    if (!closingTime) {
      validationErrors.closingTime = "Lütfen salonun kapanış saatini seçiniz.";
    }

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      if (isSaving) return;
      setIsSaving(true);

      try {
        const cleanImages = Array.isArray(images)
          ? images.filter((img) => typeof img === "string" && img.startsWith("http"))
          : [];

        const { error } = await supabase
          .from("salons")
          .update({
            salon_name: salonName,
            phone: phone,
            mail: mail,
            city: selectedCity,
            district: selectedDistrict,
            address: address.trim(),
            about: about.trim(),
            cover_images: cleanImages,
            opening_time: openingTime, 
            closing_time: closingTime  
          })
          .eq("salon_id", userId);

        if (error) throw error;

        setShowToast(true);
        setViewMode("preview");
        setTimeout(() => setShowToast(false), 4000);
      } catch (err) {
        console.error("Veritabanı kayıt hatası:", err);
        alert("Profil güncellenirken veritabanı hatası oluştu.");
      } finally {
        setIsSaving(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-2 text-sm font-bold text-slate-500">
        <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
        Salon verileri veritabanından güvenli şekilde çekiliyor...
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {showToast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-800 px-5 py-4 rounded-2xl shadow-xl">
          <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
          <div>
            <h4 className="text-sm font-bold">Değişiklikler Kaydedildi</h4>
            <p className="text-xs text-emerald-600/90 mt-0.5">
              Salon profiliniz başarıyla veritabanına işlendi.
            </p>
          </div>
        </div>
      )}

      {viewMode === "preview" ? (
        <SalonPreview
          salonName={salonName}
          mail={mail}
          phone={phone}
          city={selectedCity}
          district={selectedDistrict}
          address={address}
          about={about}
          images={images}
          openingTime={openingTime} 
          closingTime={closingTime} 
          onEditClick={() => {
            setViewMode("edit");
            setIsSubmitted(false);
          }}
        />
      ) : (
        <SalonEdit
          salonName={salonName}         
          setSalonName={setSalonName}   
          mail={mail}                   
          setMail={setMail}             
          phone={phone}
          setPhone={setPhone}
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
          selectedDistrict={selectedDistrict}
          setSelectedDistrict={setSelectedDistrict}
          address={address}
          setAddress={setAddress}
          about={about}
          setAbout={setAbout}
          images={images}
          setImages={setImages}
          openingTime={openingTime}       
          setOpeningTime={setOpeningTime} 
          closingTime={closingTime}       
          setClosingTime={setClosingTime} 
          errors={errors}
          setErrors={setErrors}
          isSubmitted={isSubmitted}
          onSave={handleSave} 
          onCancel={() => setViewMode("preview")}
          isSavingExternal={isSaving}
        />
      )}
    </div>
  );
};

export default SalonDetails;