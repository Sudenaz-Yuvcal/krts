import React, { useState, useMemo, useRef } from "react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import {
  Plus,
  Clock,
  Trash2,
  Search,
  SlidersHorizontal,
  X,
  AlertCircle,
  Edit3,
  Power,
  Upload,
} from "lucide-react";

interface Service {
  id: string;
  name: string;
  price: number;
  category: "Kadın" | "Erkek";
  duration: number;
  image_url: string;
  is_active: boolean;
}

const INITIAL_SERVICES: Service[] = [
  {
    id: "k-1",
    name: "Detaylı Saç Kesimi, Yıkama & Stil Fönü",
    price: 450,
    category: "Kadın",
    duration: 45,
    image_url:
      "https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=200",
    is_active: true,
  },
  {
    id: "k-2",
    name: "Profesyonel Ombre / Balayaj Uygulaması",
    price: 2200,
    category: "Kadın",
    duration: 180,
    image_url:
      "https://images.unsplash.com/photo-1605497746444-ac9da58d440f?q=80&w=200",
    is_active: true,
  },
  {
    id: "e-1",
    name: "Modern Saç Kesimi, Yıkama & Şekillendirme",
    price: 300,
    category: "Erkek",
    duration: 30,
    image_url:
      "https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=200",
    is_active: true,
  },
];

const DURATION_PILLS = [15, 30, 45, 60, 90, 120, 150, 180];

export const Services: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<"Kadın" | "Erkek">("Kadın");
  const [services, setServices] = useState<Service[]>(INITIAL_SERVICES);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc">(
    "default",
  );
  const [showFilterMenu, setShowFilterMenu] = useState<boolean>(false);

  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [duration, setDuration] = useState<number>(45);
  const [imageFile, setImageFile] = useState<string>("");
  const [isActiveStatus, setIsActiveStatus] = useState<boolean>(true);

  const [errors, setErrors] = useState<{
    name?: string;
    price?: string;
    image?: string;
  }>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);

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

  const handleNameChange = (val: string, currentVal: string): string => {
    const cleanVal = val.replace(/[0-9]/g, "");
    if (cleanVal.includes("  ")) {
      return currentVal;
    }
    return cleanVal;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
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
    setErrors({});
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (service: Service) => {
    setEditingService(service);
    setName(service.name);
    setPrice(service.price.toString());
    setDuration(service.duration);
    setImageFile(service.image_url);
    setIsActiveStatus(service.is_active);
    setErrors({});
    setIsEditModalOpen(true);
  };

  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { name?: string; price?: string; image?: string } = {};

    if (!name.trim()) newErrors.name = "Hizmet adı alanı boş bırakılamaz.";
    const priceNum = Number(price);
    if (!price) newErrors.price = "Fiyat alanı boş bırakılamaz.";
    if (isNaN(priceNum) || priceNum <= 0)
      newErrors.price = "Geçerli bir fiyat giriniz.";
    if (!imageFile) newErrors.image = "Görsel yüklemek zorunludur.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const newService: Service = {
      id: Math.random().toString(),
      name: name.trim(),
      price: priceNum,
      category: activeTab,
      duration: duration,
      image_url: imageFile,
      is_active: true,
    };

    setServices([newService, ...services]);
    setIsAddModalOpen(false);
    showToast("Hizmet kataloğa eklendi.");
  };

  const handleUpdateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    const newErrors: { name?: string; price?: string; image?: string } = {};

    if (!name.trim()) newErrors.name = "Hizmet adı alanı boş bırakılamaz.";
    const priceNum = Number(price);
    if (!price) newErrors.price = "Fiyat alanı boş bırakılamaz.";
    if (isNaN(priceNum) || priceNum <= 0)
      newErrors.price = "Geçerli bir fiyat giriniz.";
    if (!imageFile) newErrors.image = "Görsel yüklemek zorunludur.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setServices(
      services.map((s) =>
        s.id === editingService.id
          ? {
              ...s,
              name: name.trim(),
              price: priceNum,
              duration: duration,
              image_url: imageFile,
              is_active: isActiveStatus,
            }
          : s,
      ),
    );

    setIsEditModalOpen(false);
    setEditingService(null);
    showToast("Hizmet başarıyla güncellendi.");
  };

  const confirmDeleteService = () => {
    if (!serviceToDelete) return;
    setServices(services.filter((s) => s.id !== serviceToDelete));
    setServiceToDelete(null);
    showToast("Hizmet katalogdan silindi.");
  };

  const toggleStatusDirectly = (id: string) => {
    setServices(
      services.map((s) =>
        s.id === id ? { ...s, is_active: !s.is_active } : s,
      ),
    );
    showToast("Hizmet durumu değiştirildi.");
  };

  const filteredServices = useMemo(() => {
    let result = services.filter(
      (s) =>
        s.category === activeTab &&
        s.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    if (sortBy === "price-asc")
      result = [...result].sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc")
      result = [...result].sort((a, b) => b.price - a.price);
    return result;
  }, [services, activeTab, searchQuery, sortBy]);

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
            Salon operasyonel hizmetlerinin liste düzeninde fiyatlandırılması ve
            statü yönetimi.
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

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-100/80 p-3 rounded-3x1 shadow-xs">
        <div className="flex bg-slate-50 p-1 rounded-xl w-fit">
          <button
            onClick={() => {
              setActiveTab("Kadın");
              setSearchQuery("");
              setSortBy("default");
            }}
            className={`px-5 py-2 rounded-lg text-xs font-black tracking-wide transition-all cursor-pointer ${activeTab === "Kadın" ? "bg-white text-brand-purple shadow-xs" : "text-slate-400 hover:text-slate-600"}`}
          >
            KADIN HİZMETLERİ
          </button>
          <button
            onClick={() => {
              setActiveTab("Erkek");
              setSearchQuery("");
              setSortBy("default");
            }}
            className={`px-5 py-2 rounded-lg text-xs font-black tracking-wide transition-all cursor-pointer ${activeTab === "Erkek" ? "bg-white text-brand-purple shadow-xs" : "text-slate-400 hover:text-slate-600"}`}
          >
            ERKEK HİZMETLERİ
          </button>
        </div>

        <div className="flex items-center gap-2 flex-1 sm:max-w-md w-full justify-end">
          <div className="relative w-full max-w-xs">
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

      <Card className="p-0 border border-slate-100/80 bg-white rounded-[28px] overflow-hidden shadow-xs">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-[11px] font-black uppercase tracking-wider bg-slate-50/70">
                <th className="py-4 pl-8 w-24">Görsel</th>
                <th className="py-4 px-4">Hizmet Spesifikasyon Adı</th>
                <th className="py-4 px-4 w-40">İşlem Süresi</th>
                <th className="py-4 px-4 w-36">Hizmet Bedeli</th>
                <th className="py-4 px-4 w-36">Operasyon Statüsü</th>
                <th className="py-4 pr-8 w-32 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredServices.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-16 text-center text-slate-400 font-bold text-xs"
                  >
                    Katalog kaydı bulunmamaktadır.
                  </td>
                </tr>
              ) : (
                filteredServices.map((service) => (
                  <tr
                    key={service.id}
                    className={`group transition-all duration-200 ${!service.is_active ? "bg-slate-50/60 opacity-65" : "hover:bg-purple-50/10"}`}
                  >
                    <td className="py-4 pl-8">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden border border-slate-100">
                        <img
                          src={service.image_url}
                          alt={service.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-800 tracking-tight">
                          {service.name}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">
                          {service.category} Bölümü
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                        <Clock className="w-3.5 h-3.5 text-slate-300" />
                        <span>{formatDuration(service.duration)}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm font-black text-slate-800">
                        ₺{service.price}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`text-[10px] font-black px-2.5 py-1 rounded-lg inline-flex items-center gap-1 ${service.is_active ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${service.is_active ? "bg-emerald-500" : "bg-red-400"}`}
                        />
                        {service.is_active ? "Aktif" : "Hizmet Dışı"}
                      </span>
                    </td>
                    <td className="py-4 pr-8 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                        <button
                          onClick={() => toggleStatusDirectly(service.id)}
                          title={
                            service.is_active ? "Hizmet Dışı Bırak" : "Aktif Et"
                          }
                          className={`p-2 rounded-lg transition-all cursor-pointer ${service.is_active ? "text-slate-400 hover:text-red-500 hover:bg-red-50" : "text-emerald-600 bg-emerald-50/50 hover:bg-emerald-50"}`}
                        >
                          <Power className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenEditModal(service)}
                          className="p-2 text-slate-400 hover:text-brand-purple rounded-lg hover:bg-purple-50 transition-all cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setServiceToDelete(service.id)}
                          className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50">
          <div className="bg-white rounded-[32px] p-6 w-full max-w-2xl border border-slate-100 shadow-2xl mx-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-50">
              <div>
                <h3 className="text-lg font-black text-slate-800">
                  {isAddModalOpen
                    ? `${activeTab} Kataloğuna Ekle`
                    : "Hizmet Detaylarını Düzenle"}
                </h3>
                <p className="text-slate-400 text-[11px] font-medium mt-0.5">
                  Rakamlar ve ardışık boşluklar güvenlik protokolünce
                  engellenmiştir.
                </p>
              </div>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setIsEditModalOpen(false);
                  setErrors({});
                }}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={
                isAddModalOpen ? handleCreateService : handleUpdateService
              }
              className="mt-5 space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Hizmet Spesifikasyon Adı
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) =>
                        setName(handleNameChange(e.target.value, name))
                      }
                      className={`w-full bg-slate-50 border rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:outline-hidden focus:bg-white transition-all ${errors.name ? "border-red-300 focus:border-red-400 bg-red-50/10" : "border-slate-100 focus:border-purple-200"}`}
                      placeholder="Örn: Katlı Saç Kesimi"
                    />
                    {errors.name && (
                      <div className="text-red-500 text-[10px] font-bold flex items-center gap-1 mt-0.5">
                        <AlertCircle className="w-3 h-3" /> {errors.name}
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Fiyatlandırma Bedeli (₺)
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={price}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        setPrice(val);
                      }}
                      className={`w-full bg-slate-50 border rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:outline-hidden focus:bg-white transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${errors.price ? "border-red-300 focus:border-red-400 bg-red-50/10" : "border-slate-100 focus:border-purple-200"}`}
                      placeholder="Örn: 450"
                    />
                    {errors.price && (
                      <div className="text-red-500 text-[10px] font-bold flex items-center gap-1 mt-0.5">
                        <AlertCircle className="w-3 h-3" /> {errors.price}
                      </div>
                    )}
                  </div>

                  {isEditModalOpen && (
                    <div className="flex items-center justify-between bg-slate-50 border border-slate-100 p-3 rounded-xl">
                      <div>
                        <span className="text-xs font-bold text-slate-700 block">
                          Katalog Satış Durumu
                        </span>
                        <span className="text-[10px] font-medium text-slate-400 block">
                          Kapatılırsa randevu alınamaz.
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

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      İşlem Süresi
                    </label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {DURATION_PILLS.map((mins) => (
                        <button
                          key={mins}
                          type="button"
                          onClick={() => setDuration(mins)}
                          className={`py-2 text-[10px] font-bold rounded-lg border transition-all cursor-pointer text-center ${duration === mins ? "bg-brand-purple text-white border-brand-purple" : "bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100/70"}`}
                        >
                          {mins >= 60 ? `${mins / 60} Sa` : `${mins} Dk`}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Hizmet Görseli
                    </label>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      accept="image/*"
                      className="hidden"
                    />

                    {imageFile ? (
                      <div className="relative w-full h-22 rounded-xl overflow-hidden border border-slate-100 group">
                        <img
                          src={imageFile}
                          alt="Önizleme"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setImageFile("")}
                          className="absolute top-1.5 right-1.5 p-1 bg-slate-900/70 text-white rounded-md backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className={`w-full h-22 border border-dashed rounded-xl flex flex-col items-center justify-center gap-1 bg-slate-50/50 hover:bg-slate-50 hover:border-purple-200 transition-all cursor-pointer ${errors.image ? "border-red-300" : "border-slate-200"}`}
                      >
                        <Upload className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-[11px] font-bold text-slate-600">
                          Görsel Yükle
                        </span>
                        <span className="text-[9px] font-medium text-slate-400">
                          PNG, JPG veya JPEG
                        </span>
                      </button>
                    )}
                    {errors.image && (
                      <div className="text-red-500 text-[10px] font-bold flex items-center gap-1 mt-0.5">
                        <AlertCircle className="w-3 h-3" /> {errors.image}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 border-t border-slate-50 pt-4 mt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setIsEditModalOpen(false);
                    setErrors({});
                  }}
                  className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-500 text-xs font-bold py-3 px-4 rounded-xl transition-all cursor-pointer"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-brand-purple hover:bg-purple-700 text-white text-xs font-bold py-3 px-4 rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  {isAddModalOpen ? "Kataloğa Kaydet" : "Değişiklikleri Kaydet"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {serviceToDelete && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50">
          <div className="bg-white rounded-[32px] p-8 w-full max-w-sm border border-slate-100 shadow-xl mx-4 animate-in fade-in zoom-in-95 duration-200 text-center">
            <div className="w-12 h-12 bg-red-50 border border-red-100 text-red-500 flex items-center justify-center rounded-2xl mx-auto mb-4">
              <Trash2 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-black text-slate-800">
              Hizmet Silinsin mi?
            </h3>
            <p className="text-slate-400 text-xs font-semibold mt-1 px-2">
              Bu işlemi gerçekleştirmek istediğinize emin misiniz? Katalog
              verisi silinecektir.
            </p>
            <div className="flex gap-3 mt-6 border-t border-slate-50 pt-4">
              <button
                onClick={() => setServiceToDelete(null)}
                className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-500 text-xs font-bold py-3 px-4 rounded-xl transition-all cursor-pointer"
              >
                İptal
              </button>
              <button
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
