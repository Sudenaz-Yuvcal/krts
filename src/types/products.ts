
export interface Product {
  id: string;
  name: string;
  stock: number;
  purchasePrice: number;
  salePrice: number;
  image_url: string;
  is_active: boolean;
  totalIncome: number;
  date: string;
}