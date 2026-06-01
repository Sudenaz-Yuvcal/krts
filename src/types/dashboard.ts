
export interface HairdresserProfile {
  id: string;
  salonName: string;
  aboutText: string;
  imageUrl: string;
  city: string;
  district: string;
}

export interface Appointment {
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
export interface ServiceItem {
  id: string;
  name: string;
  price: number;
  category: 'Kadın' | 'Erkek';
  duration: number; 
}

export interface Review {
  id: string;
  customerName: string;
  rating: number; 
  comment: string;
  date: string;
}

export interface ProductSale {
  id: string;
  productName: string;
  quantity: number;
  totalIncome: number;
  date: string;
}