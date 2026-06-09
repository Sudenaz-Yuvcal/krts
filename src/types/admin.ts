// src/types/adminDashboard.types.ts

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