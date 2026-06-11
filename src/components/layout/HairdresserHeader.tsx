import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Bell,
  HeadphonesIcon,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";
import { NotificationPopover } from "../../pages/HairdresserPanel/NotificationPopover";
import { supabase } from "../../lib/supabaseClient";

interface NotificationItem {
  id: string;
  dbId: number;
  type:
    | "appointment"
    | "cancel"
    | "review"
    | "sale"
    | "stock"
    | "revenue"
    | "leave";
  text: string;
  time: string;
  isRead: boolean;
  day: "today" | "yesterday";
  date: string;
  employee_name?: string;
}

export function HairdresserHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [timeFilter, setTimeFilter] = useState<"all" | "today" | "yesterday">(
    "all",
  );
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const fetchAllData = async () => {
    try {
      const todayStr = new Date().toLocaleDateString("tr-TR");

      const readNotificationsRaw = localStorage.getItem(
        "fiem_read_notifications",
      );
      const readNotificationIds: number[] = readNotificationsRaw
        ? JSON.parse(readNotificationsRaw)
        : [];

      const { data: employeesData } = await supabase
        .from("employees")
        .select("*");

      const employeeMap: Record<string, string> = {};
      if (employeesData) {
        employeesData.forEach((emp: any) => {
          const empId = String(emp.id || emp.employee_id || "");
          const firstName = emp.name || emp.first_name || "";
          const lastName = emp.surname || emp.last_name || "";
          const fullName = `${firstName} ${lastName}`.trim();

          if (empId && fullName) {
            employeeMap[empId] = fullName;
          }
        });
      }

      const { data: appData, error: appError } = await supabase
        .from("appointments")
        .select("*")
        .order("created_at", { ascending: false });

      if (appError) {
        console.error("Randevular yüklenirken hata:", appError);
        return;
      }

      let formattedApps: NotificationItem[] = [];
      let calculatedTodayRevenue = 0;

      if (appData) {
        formattedApps = appData.map((app: any) => {
          const createdAtDate = new Date(app.created_at);
          const isToday =
            createdAtDate.toDateString() === new Date().toDateString();

          const appPrice = Number(
            app.total_price || app.price || app.amount || 0,
          );
          if (isToday) {
            calculatedTodayRevenue += appPrice;
          }

          const mAdi =
            app.customer_name ||
            app.client_name ||
            app.musteri_adi ||
            "Değerli Müşterimiz";
          const hAdi =
            app.service_name ||
            app.service ||
            app.hizmet_adi ||
            "Salon Hizmeti";

          let cAdiSoyadi = "Uzman Atanmamış";
          const targetId =
            app.employee_id !== undefined && app.employee_id !== null
              ? String(app.employee_id)
              : "";

          if (targetId && employeeMap[targetId]) {
            cAdiSoyadi = employeeMap[targetId];
          } else if (targetId) {
            cAdiSoyadi = `Uzman (ID: ${targetId})`;
          }

          const rTarih = app.appointment_date || todayStr;
          const rSaat = app.appointment_time || "00:00";

          const isNotificationRead =
            readNotificationIds.includes(app.id) || app.is_read === true;

          return {
            id: `app-${app.id}`,
            dbId: app.id,
            type: "appointment",
            text: `📅 Yaklaşan Randevu: ${mAdi}, '${hAdi}' işlemi için randevu oluşturdu.`,
            time: rSaat,
            isRead: isNotificationRead,
            day: isToday ? "today" : "yesterday",
            date: `${rTarih} - ${rSaat}`,
            employee_name: cAdiSoyadi,
          };
        });
      }

      const revenueNotification: NotificationItem = {
        id: "live-revenue-status",
        dbId: 0,
        type: "revenue",
        text: `💰 Günlük Ciro Raporu: Bugün salonunuzda toplam ${calculatedTodayRevenue.toLocaleString("tr-TR")} TL değerinde işlem ve kasa girişi sağlandı.`,
        time: getCurrentTime(),
        isRead: false,
        day: "today",
        date: `${todayStr} - Canlı Kasa`,
        employee_name: "Kasa Modülü",
      };

      setNotifications([revenueNotification, ...formattedApps]);
    } catch (err) {
      console.error("Genel akış hatası:", err);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    fetchAllData();

    const realtimeChannel = supabase
      .channel("header-realtime-bridge")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "appointments" },
        () => {
          fetchAllData();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(realtimeChannel);
    };
  }, []);

  const handleNotificationClick = async (id: string) => {
    const targetNotif = notifications.find((n) => n.id === id);

    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );

    if (targetNotif && targetNotif.dbId !== 0) {
      const readNotificationsRaw = localStorage.getItem(
        "fiem_read_notifications",
      );
      const currentIds: number[] = readNotificationsRaw
        ? JSON.parse(readNotificationsRaw)
        : [];

      if (!currentIds.includes(targetNotif.dbId)) {
        currentIds.push(targetNotif.dbId);
        localStorage.setItem(
          "fiem_read_notifications",
          JSON.stringify(currentIds),
        );
      }
    }
  };

  const handleMarkAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));

    const allDbIds = notifications
      .filter((n) => n.dbId !== 0)
      .map((n) => n.dbId);
    localStorage.setItem("fiem_read_notifications", JSON.stringify(allDbIds));
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const filteredNotifications = notifications.filter(
    (n) => timeFilter === "all" || n.day === timeFilter,
  );

  return (
    <header className="h-24 bg-slate-50 border-b border-slate-200 backdrop-blur-md flex items-center justify-between px-12 z-20 relative w-full">
      <div>
        <h1 className="text-xl font-black text-slate-800 tracking-tight uppercase leading-none">
          Fiem Kuaför & Güzellik Salonu
        </h1>
        <p className="text-xs text-slate-400 font-bold tracking-widest mt-1 uppercase">
          Sistem Yönetim & Envanter Paneli
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsAssistantOpen(true)}
          className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-xs hover:border-purple-200 hover:text-purple-600 transition-all group cursor-pointer h-11 shrink-0"
        >
          <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
            <HeadphonesIcon className="w-4 h-4" />
          </div>
          <span className="text-xs font-black text-slate-600 group-hover:text-purple-600 transition-colors">
            Canlı Destek & Asistan
          </span>
        </button>

        <div className="relative z-40">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-xs text-slate-400 hover:text-slate-700 transition-all relative cursor-pointer h-11 w-11 flex items-center justify-center shrink-0"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="w-2 h-2 bg-rose-500 rounded-full absolute top-3 right-3 ring-2 ring-white animate-pulse" />
            )}
          </button>

          <NotificationPopover
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            unreadCount={unreadCount}
            timeFilter={timeFilter}
            setTimeFilter={setTimeFilter}
            filteredNotifications={filteredNotifications}
            handleNotificationClick={handleNotificationClick}
            handleMarkAllAsRead={handleMarkAllAsRead}
          />
        </div>
      </div>

      {isAssistantOpen &&
        isMounted &&
        createPortal(
          <div className="fixed inset-0 w-screen h-screen bg-slate-100 z-50 flex flex-col md:flex-row overflow-hidden left-0 top-0">
            <div className="w-full md:w-80 bg-purple-900 text-white p-6 flex flex-col justify-between shrink-0">
              <button
                onClick={() => setIsAssistantOpen(false)}
                className="flex items-center gap-2 text-xs font-black bg-white/10 hover:bg-white/20 transition-all px-4 py-2.5 rounded-xl cursor-pointer w-max"
              >
                <ArrowLeft className="w-4 h-4" /> Geri Dön
              </button>
              <div className="hidden md:flex items-center gap-2 text-[11px] text-purple-200/60 font-bold">
                <ShieldCheck className="w-4 h-4" /> KRTS Altyapısı
              </div>
            </div>
            <div className="flex-1 flex flex-col h-full bg-[#f4f2f7] overflow-hidden p-12">
              <p className="text-xs font-bold text-slate-500">
                Asistan Modülü Açık.
              </p>
              <button
                onClick={() => setIsAssistantOpen(false)}
                className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-xl text-xs font-bold w-max cursor-pointer"
              >
                Kapat
              </button>
            </div>
          </div>,
          document.body,
        )}
    </header>
  );
}