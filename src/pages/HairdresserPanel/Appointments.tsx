import { useState, useEffect } from "react";
import { Card } from "../../components/ui/Card";
import { CalendarDays, Loader2 } from "lucide-react";
import { AppointmentCancelModal } from "../../sections/appointments/appointment-cancel-modal";
import { AppointmentCard } from "../../sections/appointments/appointment-card";
import { AppointmentFilters } from "../../sections/appointments/appointments-filter";
import { supabase } from "../../lib/supabaseClient";

type TabStatus = "tumu" | "beklemede" | "onaylandi" | "tamamlandi" | "iptal";

interface SupabaseAppointmentRow {
  id: number;
  appointment_date: string | null;
  appointment_time: string | null;
  total_price: number | null;
  status: string;
  payment_status: string;
  cancel_reason: string | null;
  profiles: { full_name: string | null; phone: string | null } | null;
  services: { service_name: string | null; category: string | null } | null;
  employees: { full_name: string | null } | null;
}

export interface FormattedAppointment {
  id: string;
  customerName: string;
  customerPhone: string;
  serviceName: string;
  category: string;
  date: string;
  time: string;
  duration: string;
  staffName: string;
  price: number;
  status: string;
  paymentStatus: string;
  cancelReason: string;
  rawStatus: string;
}

export function Appointments() {
  const [subTab, setSubTab] = useState<TabStatus>("tumu");
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [cancelModalId, setCancelModalId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [appointments, setAppointments] = useState<FormattedAppointment[]>([]);

  const fetchRealAppointments = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("appointments")
        .select(`
          id,
          appointment_date,
          appointment_time,
          total_price,
          status,
          payment_status,
          cancel_reason,
          profiles:customer_id (full_name, phone),
          services:service_id (service_name, category),
          employees:employee_id (full_name)
        `);

      if (error) throw error;

      if (!data) {
        setAppointments([]);
        return;
      }

      const typedData = data as unknown as SupabaseAppointmentRow[];

      const formatted: FormattedAppointment[] = typedData.map((dbApp) => {
        const currentStatus = dbApp.status;
        const currentPayment = dbApp.payment_status;

        let displayStatus = "Bekliyor";
        if (currentStatus === "onaylandi" || currentStatus === "beklemede") displayStatus = "Bekliyor";
        if (currentStatus === "iptal") displayStatus = "İptal";
        if (currentStatus === "tamamlandi") displayStatus = "Tamamlandı";

        let displayPayment = "Beklemede";
        if (currentPayment === "odendi") displayPayment = "Hesaba Aktarıldı";
        if (currentPayment === "odenmedi") displayPayment = "İptal Edildi";

        let formattedDate = dbApp.appointment_date || "Belirtilmedi";
        if (dbApp.appointment_date && dbApp.appointment_date !== "Belirtilmedi") {
          const [year, month, day] = dbApp.appointment_date.split("-");
          if (year && month && day) {
            formattedDate = `${day}.${month}.${year}`;
          }
        }

        return {
          id: String(dbApp.id),
          customerName: dbApp.profiles?.full_name || "Müşteri Bilgisi Yok",
          customerPhone: dbApp.profiles?.phone || "Telefon Belirtilmedi",
          serviceName: dbApp.services?.service_name || "Bilinmeyen Hizmet",
          category: dbApp.services?.category || "Genel", 
          date: formattedDate,
          time: dbApp.appointment_time ? dbApp.appointment_time.substring(0, 5) : "00:00",
          duration: "45 dk", 
          staffName: dbApp.employees?.full_name || "Personel Bilgisi Yok",
          price: dbApp.total_price || 0,
          status: displayStatus,
          paymentStatus: displayPayment,
          cancelReason: dbApp.cancel_reason || "",
          rawStatus: currentStatus 
        };
      });

      setAppointments(formatted);
    } catch (err) {
      console.error("Randevular yüklenirken hata:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRealAppointments();
  }, []);

  const handleConfirmAppointment = async (id: string) => {
    try {
      const { error } = await supabase
        .from("appointments")
        .update({ status: "onaylandi" })
        .eq("id", Number(id));

      if (error) throw error;

      setAppointments((prev) =>
        prev.map((app) =>
          String(app.id) === id
            ? { ...app, rawStatus: "onaylandi", status: "Bekliyor" }
            : app
        )
      );
    } catch (err) {
      console.error("Randevu onaylama hatası:", err);
    }
  };

  const handleCompleteAppointment = async (id: string) => {
    try {
      const { error } = await supabase
        .from("appointments")
        .update({ status: "tamamlandi", payment_status: "odendi" })
        .eq("id", Number(id));

      if (error) throw error;

      setAppointments((prev) =>
        prev.map((app) =>
          String(app.id) === id
            ? { ...app, status: "Tamamlandı", rawStatus: "tamamlandi", paymentStatus: "Hesaba Aktarıldı" }
            : app
        )
      );
    } catch (err) {
      console.error("Randevu tamamlama hatası:", err);
    }
  };

  const handleConfirmCancel = async (finalReason: string) => {
    if (!cancelModalId) return;

    try {
      const { error } = await supabase
        .from("appointments")
        .update({ 
          status: "iptal", 
          payment_status: "odenmedi",
          cancel_reason: finalReason 
        })
        .eq("id", Number(cancelModalId));

      if (error) throw error;

      setAppointments((prev) =>
        prev.map((app) =>
          String(app.id) === cancelModalId
            ? {
                ...app,
                status: "İptal",
                rawStatus: "iptal",
                paymentStatus: "İptal Edildi",
                cancelReason: finalReason,
              }
            : app
        )
      );
      setCancelModalId(null);
    } catch (err) {
      console.error("Randevu iptal hatası:", err);
    }
  };

  const toggleExpandCard = (id: string) => {
    setExpandedCardId(expandedCardId === id ? null : id);
  };

  const filteredArr = appointments.filter((a) => {
    if (subTab !== "tumu") {
      return a.rawStatus === subTab;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-black tracking-tight text-slate-800">
          Randevu Yönetimi
        </h2>
        <p className="text-slate-400 text-xs font-semibold mt-1">
          Supabase canlı veritabanı bağlantılı, gerçek zamanlı randevu döküm ve aksiyon paneli.
        </p>
      </div>

      <AppointmentFilters
        subTab={subTab}
        setSubTab={setSubTab}
        setExpandedCardId={setExpandedCardId}
      />

      <div className="space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-2 text-slate-400 text-xs font-bold">
            <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
            Canlı Randevu Verileri Yükleniyor...
          </div>
        ) : filteredArr.length === 0 ? (
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
              onConfirmApp={() => handleConfirmAppointment(item.id)}
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