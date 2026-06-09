import { supabase } from "../lib/supabaseClient";

export interface EmployeeItem {
  id: number;
  full_name: string | null;
  phone: string | null;
}

export interface ServiceInsertData {
  salon_id: string;
  service_name: string;
  price: number;
  duration_minutes: number;
  image_url?: string;
  is_active?: boolean;
}

export interface ServiceUpdateData {
  service_name?: string;
  price?: number;
  duration_minutes?: number;
  image_url?: string;
  is_active?: boolean;
}

export const salonsService = {
  /**
   * Tüm hizmet listesini çeker
   */
  async getServices() {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error("Hizmetler çekilirken hata oluştu:", error.message);
      return [];
    }
    return data || [];
  },

  /**
   * Tüm çalışan listesini çeker
   */
  async getEmployees(): Promise<EmployeeItem[]> {
    const { data, error } = await supabase
      .from("employees")
      .select("id, full_name, phone")
      .order("full_name", { ascending: true });

    if (error) {
      console.error("Çalışanlar çekilirken hata oluştu:", error.message);
      return [];
    }
    return data || [];
  },

  /**
   * Belirli bir hizmete atanmış çalışanların ID listesini döner (Hatanızı çözen metot)
   */
  async getServiceEmployees(serviceId: number): Promise<number[]> {
    const { data, error } = await supabase
      .from("employee_services")
      .select("employee_id")
      .eq("service_id", serviceId);

    if (error || !data) {
      console.error("Hizmete bağlı çalışanlar çekilirken hata:", error?.message);
      return [];
    }
    return data.map((d) => d.employee_id);
  },

  /**
   * Yeni bir hizmet oluşturur
   */
  async addService(serviceData: ServiceInsertData) {
    const { data, error } = await supabase
      .from("services")
      .insert([serviceData])
      .select()
      .single();

    if (error) {
      console.error("Hizmet eklenirken hata oluştu:", error.message);
      return null;
    }
    return data;
  },

  /**
   * Mevcut bir hizmeti günceller
   */
  async updateService(serviceId: number, updateData: ServiceUpdateData): Promise<boolean> {
    const { error } = await supabase
      .from("services")
      .update(updateData)
      .eq("id", serviceId);

    if (error) {
      console.error("Hizmet güncellenirken hata oluştu:", error.message);
      return false;
    }
    return true;
  },

  /**
   * Bir hizmeti katalogdan siler
   */
  async deleteService(serviceId: number): Promise<boolean> {
    const { error } = await supabase
      .from("services")
      .delete()
      .eq("id", serviceId);

    if (error) {
      console.error("Hizmet silinirken hata oluştu:", error.message);
      return false;
    }
    return true;
  },

  /**
   * Yeni eklenen hizmeti seçilen çalışanlara bağlar (Many-to-Many)
   */
  async linkServiceToEmployees(serviceId: number, employeeIds: number[]): Promise<void> {
    if (employeeIds.length === 0) return;

    const insertRows = employeeIds.map((empId) => ({
      service_id: serviceId,
      employee_id: empId,
    }));

    const { error } = await supabase.from("employee_services").insert(insertRows);
    if (error) {
      console.error("Çalışan bağlantıları kurulurken hata:", error.message);
    }
  },

  /**
   * Hizmet güncellenirken çalışan listesini senkronize eder (Öncekileri silip yenileri ekler)
   */
  async updateServiceEmployees(serviceId: number, employeeIds: number[]): Promise<void> {
    await this.unlinkAllEmployeesFromService(serviceId);
    await this.linkServiceToEmployees(serviceId, employeeIds);
  },

  /**
   * Bir hizmete bağlı tüm çalışan ilişkilerini koparır
   */
  async unlinkAllEmployeesFromService(serviceId: number): Promise<void> {
    const { error } = await supabase
      .from("employee_services")
      .delete()
      .eq("service_id", serviceId);

    if (error) {
      console.error("Çalışan bağları koparılırken hata:", error.message);
    }
  },

  /**
   * Supabase Storage (salon-media) kovasına resim yükler
   */
  async uploadImage(file: File, folderName: "services" | "employees"): Promise<string | null> {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${folderName}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("salon-media")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from("salon-media")
        .getPublicUrl(filePath);

      return publicUrlData?.publicUrl || null;
    } catch (err) {
      console.error("Görsel yükleme hatası:", err);
      return null;
    }
  },
};