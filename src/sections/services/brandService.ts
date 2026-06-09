import { supabase } from "../../lib/supabaseClient"; 

export interface Product {
  id: number;
  ürün_adı: string;
  marka_adı: string;
  marka_kimliği: string;
  fiyat: number;
  stok_sayısı: number;
  kategori: string;
  resim_url: string;
  sku?: string;   
  maliyet?: number;  
  is_active?: boolean;
  "oluşturulma tarihi"?: string;
}

export interface ModalFormData {
  ürün_adı: string;
  marka_adı: string;
  fiyat: string;
  stok_sayısı: string;
  kategori: string;
  resim_url: string;
  sku?: string;
  maliyet?: string;
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
      .from("ürünler")
      .select("*")
      .eq("marka_kimliği", salonId)
      .order("oluşturulma tarihi", { ascending: false });

    if (error) throw error;
    return (data || []) as Product[];
  },

  async addProduct(product: Omit<Product, "id" | "oluşturulma tarihi">): Promise<void> {
    const { error } = await supabase.from("ürünler").insert([product]);
    if (error) throw error;
  },

  async updateProduct(id: number, product: Partial<Product>): Promise<void> {
    const { error } = await supabase.from("ürünler").update(product).eq("id", id);
    if (error) throw error;
  },

  async deleteProduct(id: number): Promise<void> {
    const { error } = await supabase.from("ürünler").delete().eq("id", id);
    if (error) throw error;
  },

  async getBrandProfile(salonId: string): Promise<BrandProfile | null> {
    const { data, error } = await supabase
      .from("salonlar")
      .select("*")
      .eq("id", salonId)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data as BrandProfile | null;
  },
  async updateBrandProfile(salonId: string, profile: Omit<BrandProfile, "id">): Promise<void> {
    const { error } = await supabase
      .from("salonlar")
      .upsert({ id: salonId, ...profile });

    if (error) throw error;
  }
};