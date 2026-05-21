
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
  serviceName: string;
  category: 'Kadın' | 'Erkek';
  date: string;
  time: string;
  price: number;
  status: 'Yaklaşan' | 'Tamamlandı' | 'İptal';
  paymentStatus: 'Blocked' | 'Released' | 'Refunded'; 
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