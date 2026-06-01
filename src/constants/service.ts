import type { Service } from "../types/services";
export const INITIAL_SERVICES: Service[] = [
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

export const DURATION_PILLS = [15, 30, 45, 60, 90, 120, 150, 180];