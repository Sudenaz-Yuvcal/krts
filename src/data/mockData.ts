import type { Salon, Post } from "../types/beauty";

export const mockSalons: Salon[] = [
  {
    id: "salon-1",
    name: "KRTS Studio Nişantaşı",
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=600&auto=format&fit=crop",
    address: "Vali Konağı Cad. No:45, Şişli/İstanbul",
    isPremium: true,
  },
  {
    id: "salon-2",
    name: "Atelier Elif & Sude",
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?q=80&w=600&auto=format&fit=crop",
    address: "Bağdat Caddesi No:120, Kadıköy/İstanbul",
    isPremium: true,
  },
];

export const mockPosts: Post[] = [
  {
    id: "post-1",
    salonId: "salon-1",
    salonName: "KRTS Studio Nişantaşı",
    salonAvatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop",
    videoUrl:
      "https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-sign-lighting-39832-large.mp4",
    caption:
      "Yaza damgasını vuracak Platin Renklendirme ve Lüks Kesim dönüşümümüz ✨ #glowup #haircut",
    likes: 1420,
    views: "45K",
    servicePrice: "4.500 TL",
  },
  {
    id: "post-2",
    salonId: "salon-2",
    salonName: "Atelier Elif & Sude",
    salonAvatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
    videoUrl:
      "https://assets.mixkit.co/videos/preview/mixkit-woman-with-makeup-posing-in-studio-39958-large.mp4",
    caption:
      "Minimalist Nail Art severler toplansın! Haftanın en çok tercih edilen modeli 💅 #nailart",
    likes: 890,
    views: "23K",
    servicePrice: "750 TL",
  },
];
