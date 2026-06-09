export interface StaffMember {
  id: number;
  name: string;
  role: string;
  status: "Aktif" | "Meşgul" | "İzinde";
  rating: number;
  activeAppointments: number;
  revenue: string;
  img: string;
  services: string[];
}

export interface SaveStaffPayload {
  id: number;
  name: string;
  role: string;
  status: "Aktif" | "Meşgul" | "İzinde";
  img: string;
  phone: string;
  selectedServiceIds: string[];
}

export interface ServiceItem {
  id: string;
  name: string;
  category: string;
}

export interface DaySchedule {
  day_index: number;
  day_name: string;
  is_working: boolean;
  start_time: string;
  end_time: string;
}

export interface DetailedStaffMember extends StaffMember {
  dbShifts: DaySchedule[];
  phone?: string;
}

export interface SupabaseService {
  id: number;
  service_name: string;
  category: string | null;
}

export interface SupabaseEmployee {
  id: number;
  salon_id: string;
  full_name: string | null;
  is_available: boolean | null;
  avatar_url: string | null;
  phone: string | null;
  role: string | null;
  employee_services: { service_id: number }[] | null;
}

export interface SupabaseAppointmentPrice {
  total_price: number | null;
}

export interface SupabaseReviewRating {
  rating: number;
}