import React, { useState } from "react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import {
  Calendar,
  Clock,
  User,
  CheckCircle2,
  CalendarDays,
  XCircle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Phone,
  UserCheck,
  Timer,
  Ban,
  AlertTriangle,
  Layers,
} from "lucide-react";

interface Appointment {
  id: string;
  customerName: string;
  customerPhone: string;
  serviceName: string;
  category: "Kadın" | "Erkek";
  date: string;
  time: string;
  duration: string;
  staffName: string;
  price: number;
  status: "Bekliyor" | "Tamamlandı" | "İptal";
  paymentStatus: "Ödeme Alındı" | "İptal Edildi" | "Hesaba Aktarıldı";
  cancelReason?: string;
}

const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: "1",
    customerName: "Melisa Yılmaz",
    customerPhone: "+90 532 765 43 21",
    serviceName: "Saç Kesimi & Fön",
    category: "Kadın",
    date: "21 Mayıs 2026",
    time: "14:30",
    duration: "45 dk",
    staffName: "Elif Şimşek",
    price: 350,
    status: "Bekliyor",
    paymentStatus: "Ödeme Alındı",
  },
  {
    id: "2",
    customerName: "Can Tekin",
    customerPhone: "+90 505 123 45 67",
    serviceName: "Damat Tıraşı",
    category: "Erkek",
    date: "22 Mayıs 2026",
    time: "11:00",
    duration: "90 dk",
    staffName: "Ahmet Yılmaz",
    price: 1200,
    status: "Bekliyor",
    paymentStatus: "Ödeme Alındı",
  },
  {
    id: "3",
    customerName: "Ayşe Demir",
    customerPhone: "+90 544 987 65 43",
    serviceName: "Ombre",
    category: "Kadın",
    date: "18 Mayıs 2026",
    time: "10:00",
    duration: "180 dk",
    staffName: "Selin Kaya",
    price: 1800,
    status: "İptal",
    paymentStatus: "İptal Edildi",
    cancelReason: "Müşteri talebi doğrultusunda iptal edildi.",
  },
  {
    id: "4",
    customerName: "Merve Kaya",
    customerPhone: "+90 533 444 55 66",
    serviceName: "Saç Boyama",
    category: "Kadın",
    date: "19 Mayıs 2026",
    time: "16:00",
    duration: "120 dk",
    staffName: "Elif Şimşek",
    price: 950,
    status: "Tamamlandı",
    paymentStatus: "Hesaba Aktarıldı",
  },
];

const CANCEL_OPTIONS = [
  "Müşteri randevuya gelmedi / ulaşılamıyor",
  "Müşteri talebi doğrultusunda iptal edildi",
  "Salondan kaynaklı zorunlu program değişikliği",
  "Diğer (Gerekçe Belirtiniz)",
];

export const Appointments: React.FC = () => {
  const [appointments, setAppointments] =
    useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [subTab, setSubTab] = useState<"tumu" | "tamamlandi" | "iptal">("tumu");
  const [genderFilter, setGenderFilter] = useState<"Hepsi" | "Kadın" | "Erkek">(
    "Hepsi",
  );
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  const [cancelModalId, setCancelModalId] = useState<string | null>(null);
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [customReason, setCustomReason] = useState<string>("");
  const [cancelError, setCancelError] = useState<string>("");

  const maskLastName = (fullName: string) => {
    const parts = fullName.trim().split(" ");
    if (parts.length <= 1) return fullName;
    const lastName = parts[parts.length - 1];
    const firstName = parts.slice(0, parts.length - 1).join(" ");
    return `${firstName} ${lastName.charAt(0).toUpperCase()}.`;
  };

  const handleCompleteAppointment = (id: string) => {
    setAppointments((prev) =>
      prev.map((app) =>
        app.id === id
          ? { ...app, status: "Tamamlandı", paymentStatus: "Hesaba Aktarıldı" }
          : app,
      ),
    );
  };

  const openCancelModal = (id: string) => {
    setCancelModalId(id);
    setSelectedReason("");
    setCustomReason("");
    setCancelError("");
  };

  const handleConfirmCancel = (e: React.FormEvent) => {
    e.preventDefault();
    let finalReason = selectedReason;

    if (!selectedReason) {
      setCancelError("Lütfen bir iptal sebebi seçin.");
      return;
    }

    if (selectedReason === "Diğer (Gerekçe Belirtiniz)") {
      if (!customReason.trim()) {
        setCancelError("Lütfen iptal gerekçenizi buraya yazın.");
        return;
      }
      finalReason = customReason.trim();
    }

    setAppointments((prev) =>
      prev.map((app) =>
        app.id === cancelModalId
          ? {
              ...app,
              status: "İptal",
              paymentStatus: "İptal Edildi",
              cancelReason: finalReason,
            }
          : app,
      ),
    );
    setCancelModalId(null);
  };

  const toggleExpandCard = (id: string) => {
    setExpandedCardId(expandedCardId === id ? null : id);
  };

  const filteredArr = appointments.filter((a) => {
    const tabMatch =
      subTab === "tumu"
        ? true
        : subTab === "tamamlandi"
          ? a.status === "Tamamlandı"
          : a.status === "İptal";

    const genderMatch = genderFilter === "Hepsi" || a.category === genderFilter;
    return tabMatch && genderMatch;
  });

  const getPaymentBadge = (status: Appointment["paymentStatus"]) => {
    switch (status) {
      case "Hesaba Aktarıldı":
        return (
          <span className="text-[10px] font-black bg-emerald-50 text-emerald-600 px-2 py-1 rounded-md border border-emerald-100/50">
            Hesaba Aktarıldı
          </span>
        );
      case "İptal Edildi":
        return (
          <span className="text-[10px] font-black bg-red-50 text-red-500 px-2 py-1 rounded-md border border-red-100/50">
            İptal Edildi
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-black tracking-tight text-slate-800">
          Randevu Yönetimi
        </h2>
        <p className="text-slate-400 text-xs font-semibold mt-1">
          Açık müşteri numaraları, genişletilebilir döküm paneli ve kategorize
          edilmiş randevu durumları.
        </p>
      </div>

      <div className="flex border-b border-slate-100 gap-6 shrink-0 overflow-x-auto scrollbar-none">
        <button
          onClick={() => {
            setSubTab("tumu");
            setExpandedCardId(null);
          }}
          className={`pb-3 text-xs font-bold transition-all relative cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${subTab === "tumu" ? "text-brand-purple" : "text-slate-400 hover:text-slate-600"}`}
        >
          <Layers className="w-4 h-4" /> Tüm Randevular
          {subTab === "tumu" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-purple rounded-full"></span>
          )}
        </button>
        <button
          onClick={() => {
            setSubTab("tamamlandi");
            setExpandedCardId(null);
          }}
          className={`pb-3 text-xs font-bold transition-all relative cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${subTab === "tamamlandi" ? "text-brand-purple" : "text-slate-400 hover:text-slate-600"}`}
        >
          <CheckCircle className="w-4 h-4" /> Tamamlanan Hizmetler
          {subTab === "tamamlandi" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-purple rounded-full"></span>
          )}
        </button>
        <button
          onClick={() => {
            setSubTab("iptal");
            setExpandedCardId(null);
          }}
          className={`pb-3 text-xs font-bold transition-all relative cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${subTab === "iptal" ? "text-brand-purple" : "text-slate-400 hover:text-slate-600"}`}
        >
          <XCircle className="w-4 h-4" /> İptal Edilenler
          {subTab === "iptal" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-purple rounded-full"></span>
          )}
        </button>
      </div>

      <div className="flex items-center gap-2 bg-slate-50 border border-slate-100/60 p-1 rounded-xl w-fit shrink-0">
        {(["Hepsi", "Kadın", "Erkek"] as const).map((gender) => (
          <button
            key={gender}
            onClick={() => setGenderFilter(gender)}
            className={`px-4 py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${genderFilter === gender ? "bg-white text-slate-800 shadow-xs border border-slate-100" : "text-slate-400 hover:text-slate-600"}`}
          >
            {gender === "Hepsi" ? "Tüm Kategoriler" : `${gender} Salonu`}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredArr.length === 0 ? (
          <Card className="flex flex-col items-center justify-center text-center py-16 px-4 border border-dashed border-slate-200 bg-slate-50/30 rounded-[32px]">
            <div className="w-12 h-12 bg-slate-100 text-slate-400 flex items-center justify-center rounded-2xl mb-3">
              <CalendarDays className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-700">
              Randevu Bulunmuyor
            </h4>
            <p className="text-xs text-slate-400 font-medium mt-1 max-w-xs">
              Filtre kriterlerinize uygun herhangi bir randevu kaydı eşleşmedi.
            </p>
          </Card>
        ) : (
          filteredArr.map((item) => {
            const isExpanded = expandedCardId === item.id;
            return (
              <Card
                key={item.id}
                className="flex flex-col border border-slate-100 bg-white rounded-[28px] shadow-xs group hover:border-purple-100 transition-all duration-200 p-0 overflow-hidden"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 py-4 px-6">
                  <div className="flex items-center gap-4 min-w-55">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-brand-purple border border-purple-100/30">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">
                        {maskLastName(item.customerName)}
                      </h4>
                      <p className="text-xs font-semibold text-slate-400 mt-0.5">
                        {item.serviceName}{" "}
                        <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-md ml-1 font-bold">
                          {item.category}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-xs font-bold text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span>{item.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span>{item.time}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-sm font-black text-slate-800">
                      ₺{item.price}
                    </span>
                    {getPaymentBadge(item.paymentStatus)}
                  </div>

                  <div className="flex items-center justify-end gap-2 border-t border-slate-50 lg:border-t-0 pt-3 lg:pt-0 shrink-0">
                    <button
                      onClick={() => toggleExpandCard(item.id)}
                      className="px-3 py-1.5 text-[11px] font-bold text-slate-500 hover:text-brand-purple bg-slate-50 hover:bg-purple-50 rounded-xl transition-all cursor-pointer flex items-center gap-1"
                    >
                      {isExpanded ? (
                        <>
                          Detayları Kapat <ChevronUp className="w-3.5 h-3.5" />
                        </>
                      ) : (
                        <>
                          Detayları Gör <ChevronDown className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>

                    {item.status === "Bekliyor" && (
                      <>
                        <button
                          onClick={() => openCancelModal(item.id)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                          title="Randevuyu İptal Et"
                        >
                          <Ban className="w-4 h-4" />
                        </button>
                        <Button
                          onClick={() => handleCompleteAppointment(item.id)}
                          variant="success"
                          className="py-1.5 px-3.5 rounded-xl text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5 h-8.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Hizmeti
                          Tamamladım
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {isExpanded && (
                  <div className="bg-slate-50/50 border-t border-slate-50 p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 animate-fadeIn">
                    <div className="flex items-start gap-2.5">
                      <Timer className="w-4 h-4 text-slate-400 mt-0.5" />
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">
                          Hizmet Süresi
                        </span>
                        <span className="text-xs font-bold text-slate-700">
                          {item.duration}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <UserCheck className="w-4 h-4 text-slate-400 mt-0.5" />
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">
                          Hizmet Edecek Personel
                        </span>
                        <span className="text-xs font-bold text-slate-700">
                          {item.staffName}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Phone className="w-4 h-4 text-slate-400 mt-0.5" />
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">
                          Müşteri Telefon Numarası
                        </span>
                        <span className="text-xs font-bold text-slate-700 tracking-wide">
                          {item.customerPhone}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <div className="w-4 h-4 border border-slate-400 rounded-sm flex items-center justify-center text-[9px] font-black text-slate-400 mt-0.5">
                        ₺
                      </div>
                    </div>

                    {item.status === "İptal" && item.cancelReason && (
                      <div className="col-span-full bg-red-50/60 border border-red-100 p-3 rounded-xl flex gap-2 mt-1">
                        <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-[10px] font-black text-red-600 block uppercase tracking-wider">
                            İptal Gerekçesi
                          </span>
                          <span className="text-xs font-semibold text-slate-600">
                            {item.cancelReason}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })
        )}
      </div>

      {cancelModalId && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[32px] p-6 w-full max-w-md border border-slate-100 shadow-2xl">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-50">
              <div className="w-10 h-10 bg-red-50 text-red-500 flex items-center justify-center rounded-xl border border-red-100/50">
                <Ban className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-800">
                  Randevuyu İptal Et
                </h3>
                <p className="text-slate-400 text-[11px] font-semibold mt-0.5">
                  İptal nedenini seçerek randevuyu sonlandırın.
                </p>
              </div>
            </div>

            <form onSubmit={handleConfirmCancel} className="mt-4 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Lütfen Bir Sebep Seçin
                </label>
                <div className="space-y-2">
                  {CANCEL_OPTIONS.map((option) => (
                    <label
                      key={option}
                      className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${selectedReason === option ? "border-purple-300 bg-purple-50/20 text-slate-800" : "border-slate-100 bg-slate-50/50 text-slate-600 hover:bg-slate-50"}`}
                    >
                      <input
                        type="radio"
                        name="cancelReason"
                        value={option}
                        checked={selectedReason === option}
                        onChange={(e) => {
                          setSelectedReason(e.target.value);
                          setCancelError("");
                        }}
                        className="accent-brand-purple"
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>

              {selectedReason === "Diğer (Gerekçe Belirtiniz)" && (
                <div className="space-y-1.5 animate-fadeIn">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    İptal Açıklaması
                  </label>
                  <textarea
                    rows={2}
                    value={customReason}
                    onChange={(e) => {
                      setCustomReason(e.target.value);
                      setCancelError("");
                    }}
                    placeholder="Lütfen diğer iptal gerekçesini detaylandırın..."
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-800 focus:outline-hidden focus:bg-white focus:border-purple-200 transition-all resize-none placeholder:text-slate-400"
                  />
                </div>
              )}

              {cancelError && (
                <p className="text-red-500 text-[10px] font-bold flex items-center gap-1">
                  {cancelError}
                </p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCancelModalId(null)}
                  className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-500 text-xs font-bold py-2.5 px-4 rounded-xl transition-all cursor-pointer"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  Randevuyu Sonlandır
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
