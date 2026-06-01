import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { SalonPreview } from "../../sections/salon/salon-preview";
import { SalonEdit } from "../../sections/salon/salon-edit";
import { validateSalonForm } from "../../utils/validations";

export const SalonDetails = () => {
  const [viewMode, setViewMode] = useState<"preview" | "edit">("preview");

  const [phone, setPhone] = useState("0532 123 45 67");
  const [selectedCity, setSelectedCity] = useState("İstanbul");
  const [selectedDistrict, setSelectedDistrict] = useState("Beşiktaş");
  const [address, setAddress] = useState(
    "Nispetiye Mahallesi, Aytar Caddesi No:12 Kat:2",
  );
  const [about, setAbout] = useState(
    "Salonumuz, saç renklendirme, mikro kaynak ve kreatif kesim alanlarında uzman kadrosuyla modern, yenilikçi ve konforlu bir hizmet sunmaktadır.",
  );
  const [images, setImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=400",
    "https://images.unsplash.com/photo-1521590832167-7bcbfea5733d?q=80&w=400",
    "https://images.unsplash.com/photo-1633681926035-ec1ac984418a?q=80&w=400",
  ]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleSave = () => {
    setIsSubmitted(true);

    const validationErrors = validateSalonForm({
      phone,
      city: selectedCity,
      district: selectedDistrict,
      address: address.trim(),
      about: about.trim(),
      imagesCount: images.length,
    });

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setShowToast(true);
      setViewMode("preview");
      setTimeout(() => setShowToast(false), 4000);
    }
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {showToast && (
        <div
          className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-800 px-5 py-4 rounded-2xl shadow-xl"
          style={{ animation: "slideIn 0.4s ease-out forwards" }}
        >
          <style>{`@keyframes slideIn { from { transform: translateX(120%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>
          <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
          <div>
            <h4 className="text-sm font-bold">Değişiklikler Kaydedildi</h4>
            <p className="text-xs text-emerald-600/90 mt-0.5">
              Salon profiliniz başarıyla güncellendi.
            </p>
          </div>
        </div>
      )}

      {viewMode === "preview" ? (
        <SalonPreview
          phone={phone}
          city={selectedCity}
          district={selectedDistrict}
          address={address}
          about={about}
          images={images}
          onEditClick={() => {
            setViewMode("edit");
            setIsSubmitted(false);
          }}
        />
      ) : (
        <SalonEdit
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
          errors={errors}
          setErrors={setErrors}
          isSubmitted={isSubmitted}
          onSave={handleSave}
          onCancel={() => setViewMode("preview")}
        />
      )}
    </div>
  );
};
