export interface Service {
  id: string;
  name: string;
  price: number;
  category: "Kadın" | "Erkek";
  duration: number;
  image_url: string;
  is_active: boolean;
}
