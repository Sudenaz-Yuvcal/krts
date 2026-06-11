import React, { useState, useRef, useEffect } from "react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { STAFF_ROLES } from "../../constants/roles";
import { ArrowLeft, Upload, Phone, User, CheckSquare, Square, X, ChevronDown } from "lucide-react";
import type { StaffMember } from "../../types/emloyees";

const noScrollbarClass = "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]";

interface SaveStaffPayload {
  id: number;
  name: string;
  role: string;
  status: "Aktif" | "Meşgul" | "İzinde";
  img: string;
  phone: string;
  selectedServiceIds: string[];
}

interface ServiceItem {
  id: string;
  name: string;
}

interface AddSectionProps {
  employeeToEdit?: (StaffMember & { phone?: string }) | null;
  availableServices: ServiceItem[];
  onSave: (newStaff: SaveStaffPayload, rawFile?: File | null) => void;
  onCancel: () => void;
  isSavingExternal?: boolean;
}

export const EmployeesAdd = ({ 
  employeeToEdit, 
  availableServices, 
  onSave, 
  onCancel, 
  isSavingExternal = false 
}: AddSectionProps) => {
  const isEditMode = !!employeeToEdit;

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    role: "",
    image: "",
  });
  
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isEditMode && employeeToEdit) {
      const currentName = employeeToEdit.name ? employeeToEdit.name : "";
      const nameParts = currentName.trim().split(" ");
      const lastName = nameParts.length > 1 ? nameParts.pop() || "" : "";
      const firstName = nameParts.join(" ");

      setFormData({
        firstName,
        lastName,
        phone: employeeToEdit.phone || "",
        role: employeeToEdit.role || "",
        image: employeeToEdit.img || "",
      });

      if (employeeToEdit.services) {
        setSelectedServices(employeeToEdit.services.map(String));
      }
    }
  }, [employeeToEdit, isEditMode]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsRoleDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const handleServiceToggle = (id: string) => {
    if (selectedServices.includes(id)) {
      setSelectedServices(selectedServices.filter((srvId) => srvId !== id));
    } else {
      setSelectedServices([...selectedServices, id]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setFormData({ ...formData, image: URL.createObjectURL(file) });
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    autoFocusServicesError();
    e.preventDefault();
    if (isSavingExternal) return;

    setIsSubmitted(true);
    const validationErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) validationErrors.firstName = "İsim alanı boş bırakılamaz.";
    if (!formData.lastName.trim()) validationErrors.lastName = "Soyisim alanı boş bırakılamaz.";
    if (!formData.role) validationErrors.role = "Lütfen bir unvan seçin.";
    if (formData.phone.replace(/\D/g, "").length !== 11) validationErrors.phone = "Geçerli bir telefon numarası girin.";
    if (!formData.image) validationErrors.image = "Lütfen bir çalışan fotoğrafı yükleyin.";
    if (selectedServices.length === 0) validationErrors.services = "Lütfen personele en az bir hizmet bağlayın.";

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      const resolvedStatus: "Aktif" | "Meşgul" | "İzinde" = 
        isEditMode && employeeToEdit ? employeeToEdit.status : "Aktif";

      onSave({
        id: isEditMode && employeeToEdit ? Number(employeeToEdit.id) : Date.now(),
        name: `${formData.firstName} ${formData.lastName}`,
        role: formData.role,
        status: resolvedStatus,
        img: formData.image,
        phone: formData.phone,
        selectedServiceIds: selectedServices
      }, selectedFile);
    }
  };

  const autoFocusServicesError = () => {
    if (selectedServices.length === 0) {
      setErrors((prev) => ({ ...prev, services: "Lütfen personele en az bir hizmet bağlayın." }));
    }
  };

  return (
    <div className="max-w-2xl space-y-6 animate-fadeIn">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSavingExternal}
          className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer disabled:opacity-50 border-none"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div>
          <h2 className="text-2xl font-black text-slate-800">
            {isEditMode ? "Personel Bilgilerini Düzenle" : "Yeni Personel Ekle"}
          </h2>
          <p className="text-xs text-slate-400">Personel profilini ve verebildiği hizmetleri yönetin.</p>
        </div>
      </div>

      <Card className="p-8 space-y-6 overflow-visible">
        <form onSubmit={handleFormSubmit} className="space-y-6">
          <div>
            <label className="text-sm font-semibold text-slate-700 block mb-2">Personel Fotoğrafı</label>
            <div className="flex items-center gap-4">
              <div
                onClick={() => !isSavingExternal && fileInputRef.current?.click()}
                className={`w-24 h-24 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center bg-slate-50/50 cursor-pointer overflow-hidden ${isSubmitted && errors.image ? "border-rose-400 bg-rose-50/20" : "border-slate-200"}`}
              >
                {formData.image ? (
                  <img src={formData.image} alt="Önizleme" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <Upload className="w-5 h-5 text-slate-400 mb-0.5" />
                    <span className="text-[10px] font-bold text-slate-600">Yükle</span>
                  </>
                )}
              </div>
              <div className="text-xs text-slate-400">
                <p className="font-bold text-slate-600">Profil resmi seçin</p>
                <p>Randevu ekranında görünecektir.</p>
              </div>
            </div>
            {isSubmitted && errors.image && <span className="text-xs font-semibold text-rose-500 mt-1 block">{errors.image}</span>}
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-1.5">İsim</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  disabled={isSavingExternal}
                  placeholder="Ahmet"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className={`w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:border-indigo-300 ${isSubmitted && errors.firstName ? "border-rose-400 bg-rose-50/30" : "border-slate-100"}`}
                />
              </div>
              {isSubmitted && errors.firstName && <span className="text-xs font-semibold text-rose-500 mt-1 block">{errors.firstName}</span>}
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-1.5">Soyisim</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  disabled={isSavingExternal}
                  placeholder="Yılmaz"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className={`w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:border-indigo-300 ${isSubmitted && errors.lastName ? "border-rose-400 bg-rose-50/30" : "border-slate-100"}`}
                />
              </div>
              {isSubmitted && errors.lastName && <span className="text-xs font-semibold text-rose-500 mt-1 block">{errors.lastName}</span>}
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700 block mb-1.5">Telefon Numarası</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="text"
                disabled={isSavingExternal}
                placeholder="05XX XXX XX XX"
                value={formData.phone}
                onChange={handlePhoneChange}
                className={`w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:border-indigo-300 ${isSubmitted && errors.phone ? "border-rose-400 bg-rose-50/30" : "border-slate-100"}`}
              />
            </div>
            {isSubmitted && errors.phone && <span className="text-xs font-semibold text-rose-500 mt-1 block">{errors.phone}</span>}
          </div>

          <div className="relative" ref={dropdownRef}>
            <label className="text-sm font-semibold text-slate-700 block mb-1.5">Kategori / Unvan</label>
            <button
              type="button"
              disabled={isSavingExternal}
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className={`w-full px-4 py-2.5 rounded-xl text-sm border bg-white flex items-center justify-between transition-all focus:outline-none text-left cursor-pointer ${isSubmitted && errors.role ? "border-rose-400 bg-rose-50/30" : "border-slate-100 focus:border-indigo-300"}`}
            >
              <span className={formData.role ? "text-slate-800" : "text-slate-400"}>
                {formData.role || "Unvan Seçin"}
              </span>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isRoleDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {isRoleDropdownOpen && (
              <div className={`absolute left-0 right-0 mt-1.5 bg-white border border-slate-100 shadow-xl rounded-xl max-h-52 overflow-y-auto z-50 py-1 divide-y divide-slate-50 animate-in fade-in slide-in-from-top-1 duration-150 ${noScrollbarClass}`}>
                {STAFF_ROLES.map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, role: role.label });
                      setIsRoleDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-xs font-semibold transition-colors hover:bg-slate-50 border-none bg-transparent cursor-pointer ${formData.role === role.label ? "text-indigo-600 bg-indigo-50/30" : "text-slate-600"}`}
                  >
                    {role.label}
                  </button>
                ))}
              </div>
            )}
            {isSubmitted && errors.role && <span className="text-xs font-semibold text-rose-500 mt-1 block">{errors.role}</span>}
          </div>

          <div className="border-t border-slate-100 pt-5 space-y-3">
            <div>
              <label className="text-sm font-bold text-slate-800 block">
                Bu Personelin Verebildiği Hizmetler
              </label>
              <p className="text-[11px] text-slate-400 mt-0.5">Personele bağlamak istediğiniz hizmetleri listeden seçin.</p>
            </div>

            {selectedServices.length > 0 && (
              <div className={`flex flex-wrap gap-1.5 p-2 bg-slate-50/60 rounded-xl border border-slate-100 max-h-20 overflow-y-auto ${noScrollbarClass}`}>
                {selectedServices.map((id) => {
                  const srv = availableServices.find((s) => s.id === id);
                  if (!srv) return null;
                  return (
                    <div 
                      key={id} 
                      className="flex items-center gap-1 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs"
                    >
                      <span className="truncate max-w-37.5">{srv.name}</span>
                      <button
                        type="button"
                        onClick={() => !isSavingExternal && handleServiceToggle(id)}
                        className="p-0.5 hover:bg-indigo-700 rounded transition-colors cursor-pointer border-none text-white flex items-center justify-center shrink-0"
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1 border border-slate-100 p-2 rounded-xl bg-slate-50/30 ${noScrollbarClass}`}>
              {availableServices.length > 0 ? (
                availableServices.map((service) => {
                  const isChecked = selectedServices.includes(service.id);
                  return (
                    <div
                      key={service.id}
                      onClick={() => !isSavingExternal && handleServiceToggle(service.id)}
                      className={`flex items-center gap-2.5 p-2 rounded-lg border text-xs font-semibold cursor-pointer transition-all bg-white ${isChecked ? "border-indigo-500 bg-indigo-50/20 text-indigo-900" : "border-slate-100 text-slate-600 hover:bg-slate-50"}`}
                    >
                      {isChecked ? (
                        <CheckSquare className="w-4 h-4 text-indigo-600 shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-300 shrink-0" />
                      )}
                      <span className="truncate">{service.name}</span>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-2 text-center py-4 text-xs font-medium text-slate-400">
                  Henüz tanımlı bir hizmet bulunmuyor.
                </div>
              )}
            </div>

            {isSubmitted && errors.services && (
              <span className="text-xs font-semibold text-rose-500 mt-2 block">{errors.services}</span>
            )}
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
            <button
              type="button"
              disabled={isSavingExternal}
              onClick={onCancel}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-600 cursor-pointer disabled:opacity-50 border-none"
            >
              İptal Et
            </button>
            <Button type="submit" variant="primary" disabled={isSavingExternal}>
              {isSavingExternal ? "Kaydediliyor..." : isEditMode ? "Değişiklikleri Kaydet" : "Personeli Kaydet"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};