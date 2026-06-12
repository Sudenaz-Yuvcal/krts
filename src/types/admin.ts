export interface TimelineStat {
  label: string;
  dateString: string;
  commissionAmount: number;
  packageAmount: number;
}

export interface FormattedOrder {
  id: string | number;
  total_price: number;
  order_date: string;
  product_name: string;
  brand_name: string;
  purchase_price: number;
  quantity?: number;
}

export interface FormattedPackage {
  salon_name: string;
  package_price: number;
  order_date: string;
}

export interface TopBrandStat {
  name: string;
  salesVolume: number;
  earnedCommission: number;
  percentage: number;
}

export interface TopPackageStat {
  name: string;
  count: number;
  totalRevenue: number;
  percentage: number;
}

export interface SupabaseOrder {
  id: string | number;
  total_price: number | string | null;
  order_date: string | null;
  quantity: number | null;
  products: {
    product_name: string | null;
    brand_name: string | null;
    purchase_price: number | string | null;
  } | null;
}

export interface SupabasePackage {
  package_price: number | string | null;
  order_date: string | null;
  salons: {
    salon_name: string | null;
  } | null;
}

export interface TooltipPayloadItem {
  value: number;
  name: string;
}

export interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}

export interface BrandRow {
  id: string;
  brand_name: string;
  sector: string;
  logo_url: string | null;
  phone: string;
  email: string;
  website: string;
  created_at: string;
  package_plan_id: string;
}

export interface TimelineStat {
  dateString: string;
  label: string;
  commissionAmount: number;
  packageAmount: number;
}

export interface FormattedOrder {
  id: string | number;
  total_price: number;
  order_date: string;
  product_name: string;
  brand_name: string;
  purchase_price: number;
  quantity?: number;
}

export interface TopBrandStat {
  name: string;
  salesVolume: number;
  earnedCommission: number;
  percentage: number;
}
export interface Application {
  id: string; 
  name: string;
  category: string;
  requestedProducts: number;
  date: string;
  taxNumber: string;
  authorizedPerson: string;
  phone: string;
  email: string;
  description: string;
}

export interface PackagePlan {
  id: string;
  name: string;
  months: number;
  monthly_price: number;
  discount_badge?: string;
  is_popular?: boolean;
  admin_note?: string;
  target_audience: "brand" | "salon";
  slug?: string;
  created_at?: string;
}


export interface Applications {
  id: string;
  name: string;
  city: string;
  owner: string;
  phone: string;
  email: string;
  taxNumber: string;
  date: string;
  package_name: string;
  package_id: string;
}


export interface Salon {
  id: string;
  name: string;
  city: string;
  owner: string;
  phone: string;
  package_name: string;
  status: "Aktif" | "Donduruldu";
  income: string;
}

export interface DbUser {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  role: string;
  city: string | null;
  district: string | null;
  full_address: string | null;
  created_at: string;
  is_approved: boolean;
}

export interface TableUser {
  id: string;
  originalId: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  appointments: number; 
  status: "Aktif" | "Askıda";
}