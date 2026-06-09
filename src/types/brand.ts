import { supabase } from "../lib/supabaseClient";

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

export const brandService = {
  async getProducts(salonId: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("salon_id", salonId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data || []) as Product[];
  },

  async getBrandProfile(salonId: string): Promise<BrandProfile | null> {
    const { data, error } = await supabase
      .from("brand_profiles") 
      .select("*")
      .eq("id", salonId)
      .single();

    if (error && error.code !== "PGRST116") throw error; 
    return data as BrandProfile | null;
  },

  async updateBrandProfile(salonId: string, profile: Omit<BrandProfile, "id">): Promise<void> {
    const { error } = await supabase
      .from("brand_profiles")
      .upsert({ id: salonId, ...profile });

    if (error) throw error;
  }
};