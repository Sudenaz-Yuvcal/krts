export interface Salon {
  id: string;
  name: string;
  rating: number;
  image: string;
  address: string;
  isPremium: boolean;
}

export interface Post {
  id: string;
  salonId: string;
  salonName: string;
  salonAvatar: string;
  videoUrl: string;
  caption: string;
  likes: number;
  views: string;
  servicePrice: string; 
}