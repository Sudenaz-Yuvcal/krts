import type { Appointment } from "../types/dashboard";

export const INITIAL_APPOINTMENTS: Appointment[] = [];

export const CANCEL_OPTIONS = [
  "Müşteri randevuya gelmedi / ulaşılamıyor",
  "Müşteri talebi doğrultusunda iptal edildi",
  "Salondan kaynaklı zorunlu program değişikliği",
  "Diğer (Gerekçe Belirtiniz)",
];