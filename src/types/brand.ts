export interface Product {
  id: number;
  ürün_adı: string;
  marka_adı: string;
  kategori: string;
  stok_sayısı: number;
  fiyat: number;
  resim_url: string; 
  is_active: boolean;
}

export interface BrandProfile {
  id: string; 
  marka_adi: string;
  sektor: string;
  logo_url: string;
  telefon: string;
  e_posta: string;
  web_sitesi: string;
  adres: string;
  vergi_dairesi: string;
  vergi_numarasi: string;
  instagram_url?: string;
}
export interface Brand {
  id: string; 
  name: string;
  category: string;
  activeProducts: number;
  totalSales: number;
}

