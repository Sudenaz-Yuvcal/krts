import React, { useState, useMemo, useRef, useEffect } from "react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import type { Service } from "../../types/services";
import { validateServiceForm } from "../../utils/validations";
import { ServiceTable } from "../../sections/services/service-table";
import { ServiceFormModal, type FormErrors } from "../../sections/services/service-form-modal";
import { salonsService, type EmployeeItem } from "../../services/salonService";

import { Plus, Search, SlidersHorizontal, Trash2, Loader2 } from "lucide-react";

const SALON_ID = "c719841b-0da9-4545-b510-c1d8f97a4890";

type SortOption = "default" | "price-asc" | "price-desc";

export const Services = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [showFilterMenu, setShowFilterMenu] = useState<boolean>(false);

  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [duration, setDuration] = useState<number>(45);
  const [imageFile, setImageFile] = useState<string>("");
  const [rawFile, setRawFile] = useState<File | null>(null);
  const [isActiveStatus, setIsActiveStatus] = useState<boolean>(true);

  const [allEmployees, setAllEmployees] = useState<EmployeeItem[]>([]);
  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);

  const [errors, setErrors] = useState<FormErrors>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    fetchServices();
    fetchEmployees();

    return () => {
      if (imageFile && imageFile.startsWith("blob:")) {
        URL.revokeObjectURL(imageFile);
      }
    };
  }, [imageFile]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const data = await salonsService.getServices();

      const formattedServices: Service[] = data.map((item) => ({
        id: item.id!.toString(),
        name: item.service_name,
        price: item.price,
        duration: item.duration_minutes,
        image_url: item.image_url || "",
        is_active: item.is_active ?? true,
      }));

      setServices(formattedServices);
    } catch (err) {
      console.error("Hizmetler ekrana yüklenirken hata:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    const emps = await salonsService.getEmployees();
    setAllEmployees(emps);
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const formatDuration = (minutes: number): string => {
    if (minutes < 60) return `${minutes} Dakika`;
    const hours = Math.floor(minutes / 60);
    const remMinutes = minutes % 60;
    return remMinutes > 0 ? `${hours} Sa ${remMinutes} Dk` : `${hours} Sa`;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (imageFile && imageFile.startsWith("blob:")) {
        URL.revokeObjectURL(imageFile);
      }

      setRawFile(file);
      const localUrl = URL.createObjectURL(file);
      setImageFile(localUrl);
      if (errors.image) setErrors({ ...errors, image: undefined });
    }
  };

  const handleOpenAddModal = () => {
    setName("");
    setPrice("");
    setDuration(45);
    setImageFile("");
    setRawFile(null);
    setSelectedEmployees([]);
    setErrors({});
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = async (service: Service) => {
    setEditingService(service);
    setName(service.name);
    setPrice(service.price.toString());
    setDuration(service.duration);
    setImageFile(service.image_url || "");
    setRawFile(null);
    setIsActiveStatus(service.is_active);
    setErrors({});

    const employeeIds = await salonsService.getServiceEmployees(Number(service.id));
    setSelectedEmployees(employeeIds);

    setIsEditModalOpen(true);
  };

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const validationErrors = validateServiceForm({ name, price, imageFile }) as FormErrors;

    if (selectedEmployees.length === 0) {
      validationErrors.employees = "Lütfen bu hizmeti verebilecek en az bir çalışan seçin.";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      let finalImageUrl = "";

      if (rawFile) {
        const uploadedUrl = await salonsService.uploadImage(rawFile, "services");
        if (uploadedUrl) finalImageUrl = uploadedUrl;
      }

      const newServiceData = {
        salon_id: SALON_ID,
        service_name: name.trim(),
        price: Number(price),
        duration_minutes: duration,
        image_url: finalImageUrl,
        is_active: true,
      };

      const savedRecord = await salonsService.addService(newServiceData);

      if (savedRecord) {
        await salonsService.linkServiceToEmployees(
          Number(savedRecord.id),
          selectedEmployees,
        );

        const formatted: Service = {
          id: savedRecord.id!.toString(),
          name: savedRecord.service_name,
          price: savedRecord.price,
          duration: savedRecord.duration_minutes,
          image_url: savedRecord.image_url || "",
          is_active: savedRecord.is_active,
        };
        setServices([formatted, ...services]);
        setIsAddModalOpen(false);
        showToast("Hizmet kataloğa eklendi ve çalışanlara bağlandı.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService || isSubmitting) return;

    const validationErrors = validateServiceForm({ name, price, imageFile }) as FormErrors;

    if (selectedEmployees.length === 0) {
      validationErrors.employees = "Hizmetin havada kalmaması için en az bir çalışan seçmelisiniz.";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      let finalImageUrl = editingService.image_url || "";

      if (rawFile) {
        const uploadedUrl = await salonsService.uploadImage(rawFile, "services");
        if (uploadedUrl) finalImageUrl = uploadedUrl;
      }

      const isSuccess = await salonsService.updateService(
        Number(editingService.id),
        {
          service_name: name.trim(),
          price: Number(price),
          duration_minutes: duration,
          image_url: finalImageUrl,
          is_active: isActiveStatus,
        },
      );

      if (isSuccess) {
        await salonsService.updateServiceEmployees(
          Number(editingService.id),
          selectedEmployees,
        );

        setServices(
          services.map((s) =>
            s.id === editingService.id
              ? {
                  ...s,
                  name: name.trim(),
                  price: Number(price),
                  duration,
                  image_url: finalImageUrl,
                  is_active: isActiveStatus,
                }
              : s,
          ),
        );
        setIsEditModalOpen(false);
        setEditingService(null);
        showToast("Hizmet ve yetkili çalışan listesi güncellendi.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDeleteService = async () => {
    if (!serviceToDelete) return;

    await salonsService.unlinkAllEmployeesFromService(Number(serviceToDelete));

    const isSuccess = await salonsService.deleteService(Number(serviceToDelete));
    if (isSuccess) {
      setServices(services.filter((s) => s.id !== serviceToDelete));
      setServiceToDelete(null);
      showToast("Hizmet katalogdan silindi.");
    }
  };

  const toggleStatusDirectly = async (id: string) => {
    const currentService = services.find((s) => s.id === id);
    if (!currentService) return;

    const nextStatus = !currentService.is_active;
    const isSuccess = await salonsService.updateService(Number(id), {
      is_active: nextStatus,
    });

    if (isSuccess) {
      setServices(
        services.map((s) =>
          s.id === id ? { ...s, is_active: nextStatus } : s,
        ),
      );
      showToast("Hizmet durumu değiştirildi.");
    }
  };

  const filteredServices = useMemo(() => {
    let result = services.filter((s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    if (sortBy === "price-asc")
      result = [...result].sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc")
      result = [...result].sort((a, b) => b.price - a.price);
    return result;
  }, [services, searchQuery, sortBy]);

  return (
    <div className="space-y-8 relative">
      {toastMessage && (
        <div className="fixed top-6 right-6 bg-slate-900 text-white text-xs font-bold px-5 py-3.5 rounded-2xl shadow-xl z-50 animate-in slide-in-from-top-4 duration-300 flex items-center gap-2 border border-slate-800">
          <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
          {toastMessage}
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-800">
            Hizmet Menüsü
          </h2>
          <p className="text-slate-400 text-xs font-semibold mt-1">
            Salon operasyonel hizmetlerinin liste düzeninde fiyatlandırılması ve statü yönetimi.
          </p>
        </div>
        <Button
          onClick={handleOpenAddModal}
          variant="primary"
          className="cursor-pointer shadow-lg shadow-purple-100 h-11 px-5"
        >
          <Plus className="w-4 h-4" /> Yeni Hizmet Ekle
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-100/80 p-3 rounded-3xl shadow-xs">
        <div className="flex items-center gap-2 flex-1 w-full justify-start sm:max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Hizmet listesinde ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-10 pr-4 py-2 text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-purple-200 focus:bg-white transition-all placeholder:text-slate-400"
            />
          </div>
          <div className="relative">
            <button
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className={`p-2 border rounded-xl bg-slate-50 transition-colors cursor-pointer ${showFilterMenu ? "border-purple-200 text-brand-purple bg-purple-50/30" : "border-slate-100 text-slate-400 hover:text-slate-600"}`}
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
            {showFilterMenu && (
              <div className="absolute right-0 top-11 bg-white border border-slate-100 p-2 rounded-2xl shadow-xl z-10 w-48 animate-in fade-in slide-in-from-top-2 duration-150">
                <span className="text-[10px] font-black text-slate-400 px-3 py-1.5 block uppercase tracking-wider">
                  Sıralama
                </span>
                <button
                  onClick={() => {
                    setSortBy("default");
                    setShowFilterMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs font-bold rounded-xl transition-colors ${sortBy === "default" ? "bg-purple-50 text-brand-purple" : "text-slate-600 hover:bg-slate-50"}`}
                >
                  Varsayılan
                </button>
                <button
                  onClick={() => {
                    setSortBy("price-asc");
                    setShowFilterMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs font-bold rounded-xl transition-colors ${sortBy === "price-asc" ? "bg-purple-50 text-brand-purple" : "text-slate-600 hover:bg-slate-50"}`}
                >
                  Fiyat (Artan)
                </button>
                <button
                  onClick={() => {
                    setSortBy("price-desc");
                    setShowFilterMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs font-bold rounded-xl transition-colors ${sortBy === "price-desc" ? "bg-purple-50 text-brand-purple" : "text-slate-600 hover:bg-slate-50"}`}
                >
                  Fiyat (Azalan)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="w-full h-64 flex flex-col justify-center items-center gap-2 text-slate-400 font-semibold text-xs tracking-widest">
          <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
          <span>HİZMET KATALOĞU YÜKLENİYOR...</span>
        </div>
      ) : (
        <Card className="p-0 border border-slate-100/80 bg-white rounded-[28px] overflow-hidden shadow-xs">
          <ServiceTable
            services={filteredServices}
            formatDuration={formatDuration}
            toggleStatusDirectly={toggleStatusDirectly}
            handleOpenEditModal={handleOpenEditModal}
            setServiceToDelete={setServiceToDelete}
          />
        </Card>
      )}

      <ServiceFormModal
        isOpen={isAddModalOpen || isEditModalOpen}
        mode={isAddModalOpen ? "add" : "edit"}
        onClose={() => {
          setIsAddModalOpen(false);
          setIsEditModalOpen(false);
          setErrors({});
        }}
        onSubmit={isAddModalOpen ? handleCreateService : handleUpdateService}
        name={name}
        setName={setName}
        price={price}
        setPrice={setPrice}
        duration={duration}
        setDuration={setDuration}
        imageFile={imageFile}
        isActiveStatus={isActiveStatus}
        setIsActiveStatus={setIsActiveStatus}
        errors={errors}
        fileInputRef={fileInputRef}
        handleImageChange={handleImageChange}
        isSubmitting={isSubmitting}
        allEmployees={allEmployees}
        selectedEmployees={selectedEmployees}
        setSelectedEmployees={setSelectedEmployees}
      />

      {serviceToDelete && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50">
          <div className="bg-white rounded-[32px] p-8 w-full max-w-sm border border-slate-100 shadow-xl mx-4 animate-in fade-in zoom-in-95 duration-200 text-center">
            <div className="w-12 h-12 bg-red-50 border border-red-100 text-red-500 flex items-center justify-center rounded-2xl mx-auto mb-4">
              <Trash2 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-black text-slate-800">Hizmet Silinsin mi?</h3>
            <p className="text-slate-400 text-xs font-semibold mt-1 px-2">
              Bu işlemi gerçekleştirmek istediğinize emin misiniz? Katalog verisi silinecektir.
            </p>
            <div className="flex gap-3 mt-6 border-t border-slate-50 pt-4">
              <button
                type="button"
                onClick={() => setServiceToDelete(null)}
                className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-500 text-xs font-bold py-3 px-4 rounded-xl transition-all cursor-pointer"
              >
                İptal
              </button>
              <button
                type="button"
                onClick={confirmDeleteService}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white text-xs font-bold py-3 px-4 rounded-xl shadow-md shadow-red-100 transition-all cursor-pointer"
              >
                Evet, Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};