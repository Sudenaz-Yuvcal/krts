export interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  image_url: string;
  quantity: number;
  price: number;
  preparation_note?: string; 
}

export interface Order {
  id: string;
  order_number: string; 
  customer_name: string;
  customer_phone?: string;
  total_amount: number;
  status: "new" | "preparing" | "shipped" | "completed" | "cancelled";
  created_at: string;
  order_items: OrderItem[];
  shipping_address?: string;
}