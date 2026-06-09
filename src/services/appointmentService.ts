import { supabase } from "../lib/supabaseClient";

export type AppointmentStatus = 'beklemede' | 'onaylandi' | 'iptal' | 'tamamlandi';
export type PaymentStatus = 'odendi' | 'odenmedi';

export interface Appointment {
  id: number;
  customer_id: string;
  salon_id: number;
  employee_id: number;
  service_id: number;
  appointment_date: string;
  appointment_time: string;
  total_price: number;
  status: AppointmentStatus;
  payment_status: PaymentStatus;
  cancel_reason?: string;
  created_at?: string;
  
  profiles: { 
    id: string; 
    full_name: string | null; 
    phone: string | null; 
  } | null;
  
  services: { 
    id: number; 
    service_name: string | null; 
    category: string | null; 
  } | null;
  
  employees: { 
    id: number; 
    full_name: string | null; 
    phone: string | null; 
  } | null;
}

interface AppointmentUpdatePayload {
  status: AppointmentStatus;
  payment_status: PaymentStatus;
  cancel_reason?: string;
}

export const appointmentService = {
  getAllAppointments: async (): Promise<Appointment[]> => {
    try {
      const { data, error } = await supabase
        .from("appointments")
        .select(`
          id,
          customer_id,
          salon_id,
          employee_id,
          service_id,
          appointment_date,
          appointment_time,
          total_price,
          status,
          payment_status,
          cancel_reason,
          created_at,
          profiles (id, full_name, phone),
          services (id, service_name, category),
          employees (id, full_name, phone)
        `)
        .order("appointment_date", { ascending: true });

      if (error) {
        if (error.message.includes("cancel_reason")) {
          console.warn("cancel_reason sütunu bulunamadı, yedek sorgu çalıştırılıyor...");
          const fallback = await supabase
            .from("appointments")
            .select(`
              id, customer_id, salon_id, employee_id, service_id,
              appointment_date, appointment_time, total_price, status, payment_status, created_at,
              profiles (id, full_name, phone),
              services (id, service_name, category),
              employees (id, full_name, phone)
            `)
            .order("appointment_date", { ascending: true });
            
          if (!fallback.data) return [];

          return (fallback.data as any[]).map((item) => ({
            ...item,
            profiles: Array.isArray(item.profiles) ? (item.profiles[0] || null) : (item.profiles || null),
            services: Array.isArray(item.services) ? (item.services[0] || null) : (item.services || null),
            employees: Array.isArray(item.employees) ? (item.employees[0] || null) : (item.employees || null),
          })) as Appointment[];
        }
        
        console.error("Randevular çekilirken hata:", error.message);
        return [];
      }

      if (!data) return [];

      return (data as any[]).map((item) => ({
        ...item,
        profiles: Array.isArray(item.profiles) ? (item.profiles[0] || null) : (item.profiles || null),
        services: Array.isArray(item.services) ? (item.services[0] || null) : (item.services || null),
        employees: Array.isArray(item.employees) ? (item.employees[0] || null) : (item.employees || null),
      })) as Appointment[];

    } catch (err) {
      const error = err as Error;
      console.error("Randevular çekilirken beklenmedik hata:", error.message);
      return [];
    }
  },

  updateAppointmentStatus: async (
    appointmentId: number,
    status: AppointmentStatus,
    paymentStatus: PaymentStatus,
    cancelReason?: string
  ): Promise<boolean> => {
    try {
      const updateData: AppointmentUpdatePayload = {
        status,
        payment_status: paymentStatus
      };

      if (cancelReason !== undefined && cancelReason.trim() !== "") {
        updateData.cancel_reason = cancelReason;
      }

      const { error } = await supabase
        .from("appointments")
        .update(updateData)
        .eq("id", appointmentId);

      if (error) {
        if (error.message.includes("cancel_reason")) {
          console.warn("Veritabanında cancel_reason sütunu eksik! Nedensiz güncelleme deneniyor...");
          
          const fallbackData: AppointmentUpdatePayload = {
            status,
            payment_status: paymentStatus
          };

          const { error: fallbackError } = await supabase
            .from("appointments")
            .update(fallbackData)
            .eq("id", appointmentId);

          if (fallbackError) {
            console.error("Yedek güncelleme de başarısız oldu:", fallbackError.message);
            return false;
          }

          return true; 
        }

        console.error("Randevu güncellenirken hata oluştu:", error.message);
        return false;
      }

      return true;
    } catch (err) {
      const error = err as Error;
      console.error("Randevu güncellenirken beklenmedik hata:", error.message);
      return false;
    }
  }
};