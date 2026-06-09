import { supabase } from "../lib/supabaseClient";

export interface ServiceItem {
  id?: number;
  salon_id: string;
  name: string;     
  price: number;  
  duration: number;
  created_at?: string;
}

export const servicesService = {
  async getServicesBySalon(salonId: string): Promise<ServiceItem[]> {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("salon_id", salonId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Hizmetler çekilirken hata oluştu:", error.message);
      return [];
    }
    return data || [];
  },

  async addService(service: ServiceItem): Promise<ServiceItem | null> {
    const { data, error } = await supabase
      .from("services")
      .insert([service])
      .select()
      .single();

    if (error) {
      console.error("Hizmet eklenirken hata oluştu:", error.message);
      return null;
    }
    return data;
  },

  async updateService(id: number, updates: Partial<ServiceItem>): Promise<boolean> {
    const { error } = await supabase
      .from("services")
      .update(updates)
      .eq("id", id);

    if (error) {
      console.error("Hizmet güncellenirken hata oluştu:", error.message);
      return false;
    }
    return true;
  },

  async deleteService(id: number): Promise<boolean> {
    const { error } = await supabase
      .from("services")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Hizmet silinirlerken hata oluştu:", error.message);
      return false;
    }
    return true;
  }
};