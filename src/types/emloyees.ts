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