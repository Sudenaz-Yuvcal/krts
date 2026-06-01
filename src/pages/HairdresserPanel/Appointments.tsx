import { useState } from "react";
import { Card } from "../../components/ui/Card";
import { CalendarDays } from "lucide-react";
import type { Appointment } from "../../types/dashboard";
import { INITIAL_APPOINTMENTS } from "../../constants/appointments";

import { AppointmentCancelModal } from "../../sections/appointments/appointment-cancel-modal";
import { AppointmentCard } from "../../sections/appointments/appointment-card";
import { AppointmentFilters } from "../../sections/appointments/appointments-filter";

export function Appointments() {
  const [appointments, setAppointments] =
    useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [subTab, setSubTab] = useState<"tumu" | "tamamlandi" | "iptal">("tumu");
  const [genderFilter, setGenderFilter] = useState<"Hepsi" | "Kadın" | "Erkek">(
    "Hepsi",
  );
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [cancelModalId, setCancelModalId] = useState<string | null>(null);

  const handleCompleteAppointment = (id: string) => {
    setAppointments((prev) =>
      prev.map((app) =>
        app.id === id
          ? { ...app, status: "Tamamlandı", paymentStatus: "Hesaba Aktarıldı" }
          : app,
      ),
    );
  };

  const handleConfirmCancel = (finalReason: string) => {
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

      <AppointmentFilters
        subTab={subTab}
        setSubTab={setSubTab}
        genderFilter={genderFilter}
        setGenderFilter={setGenderFilter}
        setExpandedCardId={setExpandedCardId}
      />

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
          filteredArr.map((item) => (
            <AppointmentCard
              key={item.id}
              item={item}
              isExpanded={expandedCardId === item.id}
              onToggleExpand={() => toggleExpandCard(item.id)}
              onOpenCancel={() => setCancelModalId(item.id)}
              onComplete={() => handleCompleteAppointment(item.id)}
            />
          ))
        )}
      </div>

      {cancelModalId && (
        <AppointmentCancelModal
          onClose={() => setCancelModalId(null)}
          onConfirm={handleConfirmCancel}
        />
      )}
    </div>
  );
}
