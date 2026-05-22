import React, { useState, useRef } from "react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { STAFF_ROLES } from "../../constants/roles";
import { ArrowLeft, Upload, Phone, User } from "lucide-react";
import type { StaffMember } from "../../types/emloyees";

interface AddSectionProps {
  onSave: (newStaff: StaffMember) => void;
  onCancel: () => void;
}

export const EmployeesAdd: React.FC<AddSectionProps> = ({
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    role: "",
    image: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value.replace(/\D/g, "");
    if (input.length > 0 && input[0] !== "0") input = "0" + input;
    if (input.length > 11) input = input.substring(0, 11);

    let formattedOutput = "";
    if (input.length > 0) formattedOutput += input.substring(0, 4);
    if (input.length > 4) formattedOutput += " " + input.substring(4, 7);
    if (input.length > 7) formattedOutput += " " + input.substring(7, 9);
    if (input.length > 9) formattedOutput += " " + input.substring(9, 11);

    setFormData({ ...formData, phone: formattedOutput });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        image: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleFormSubmit = () => {
    setIsSubmitted(true);
    const validationErrors: Record<string, string> = {};

    if (!formData.firstName.trim())
      validationErrors.firstName = "İsim alanı boş bırakılamaz.";
    if (!formData.lastName.trim())
      validationErrors.lastName = "Soyisim alanı boş bırakılamaz.";
    if (!formData.role)
      validationErrors.role = "Lütfen bir uzmanlık alanı seçin.";
    if (formData.phone.replace(/\D/g, "").length !== 11)
      validationErrors.phone = "Geçerli bir telefon numarası girin.";
    if (!formData.image)
      validationErrors.image = "Lütfen bir çalışan fotoğrafı yükleyin.";

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      onSave({
        id: Date.now(),
        name: `${formData.firstName} ${formData.lastName}`,
        role: formData.role,
        status: "Aktif",
        rating: 0,
        activeAppointments: 0,
        revenue: "₺0",
        img: formData.image,
        services: [formData.role],
      });
    }
  };

  return (
    <div className="max-w-2xl space-y-6 animate-fadeIn">
      <div className="flex items-center gap-4">
        <button
          onClick={onCancel}
          className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div>
          <h2 className="text-2xl font-black text-slate-800">
            Yeni Personel Ekle
          </h2>
          <p className="text-xs text-slate-400">
            Salon kadrosuna yeni bir uzman dahil edin.
          </p>
        </div>
      </div>

      <Card className="p-8 space-y-6">
        <div>
          <label className="text-sm font-semibold text-slate-700 block mb-2">
            Personel Fotoğrafı
          </label>
          <div className="flex items-center gap-4">
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`w-24 h-24 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center bg-slate-50/50 cursor-pointer overflow-hidden ${isSubmitted && errors.image ? "border-rose-400 bg-rose-50/20" : "border-slate-200"}`}
            >
              {formData.image ? (
                <img
                  src={formData.image}
                  alt="Önizleme"
                  className="w-full h-full object-cover"
                />
              ) : (
                <>
                  <Upload className="w-5 h-5 text-slate-400 mb-0.5" />
                  <span className="text-[10px] font-bold text-slate-600">
                    Yükle
                  </span>
                </>
              )}
            </div>
            <div className="text-xs text-slate-400">
              <p className="font-bold text-slate-600">Profil resmi seçin</p>
              <p>Randevu ekranında görünecektir.</p>
            </div>
          </div>
          {isSubmitted && errors.image && (
            <span className="text-xs font-semibold text-rose-500 mt-1 block">
              {errors.image}
            </span>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-slate-700 block mb-1.5">
              İsim
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="text"
                placeholder="Ahmet"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                className={`w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:border-indigo-300 ${isSubmitted && errors.firstName ? "border-rose-400 bg-rose-50/30" : "border-slate-100"}`}
              />
            </div>
            {isSubmitted && errors.firstName && (
              <span className="text-xs font-semibold text-rose-500 mt-1 block">
                {errors.firstName}
              </span>
            )}
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700 block mb-1.5">
              Soyisim
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="text"
                placeholder="Yılmaz"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                className={`w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:border-indigo-300 ${isSubmitted && errors.lastName ? "border-rose-400 bg-rose-50/30" : "border-slate-100"}`}
              />
            </div>
            {isSubmitted && errors.lastName && (
              <span className="text-xs font-semibold text-rose-500 mt-1 block">
                {errors.lastName}
              </span>
            )}
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700 block mb-1.5">
            Telefon Numarası
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            <input
              type="text"
              placeholder="05XX XXX XX XX"
              value={formData.phone}
              onChange={handlePhoneChange}
              className={`w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:border-indigo-300 ${isSubmitted && errors.phone ? "border-rose-400 bg-rose-50/30" : "border-slate-100"}`}
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
            Uzmanlık Alanı
          </label>
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className={`w-full px-4 py-2.5 rounded-xl text-sm border bg-white focus:outline-none focus:border-indigo-300 ${isSubmitted && errors.role ? "border-rose-400 bg-rose-50/30" : "border-slate-100"}`}
          >
            <option value="">Alan Seçin</option>
            {STAFF_ROLES.map((role) => (
              <option key={role.id} value={role.label}>
                {role.label}
              </option>
            ))}
          </select>
          {isSubmitted && errors.role && (
            <span className="text-xs font-semibold text-rose-500 mt-1 block">
              {errors.role}
            </span>
          )}
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-50 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-600 cursor-pointer"
          >
            İptal Et
          </button>
          <Button type="button" variant="primary" onClick={handleFormSubmit}>
            Personeli Kaydet
          </Button>
        </div>
      </Card>
    </div>
  );
};
