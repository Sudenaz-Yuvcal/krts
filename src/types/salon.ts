
export interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
  image_url: string;
  is_active: boolean;
}

export type SortOption = "default" | "price-asc" | "price-desc";

export interface EmployeeItem {
  id: number;
  full_name: string | null;
  phone: string; 
}

export interface ReviewItem {
  id: string;
  rating: number;
  full_name: string;
  created_at: string;
  comment: string;
  review_image: string | null;
  reply_comment: string | null;
}

export type ReviewStatusFilter = "all" | "unreplied" | "replied";
export type ReviewRatingFilter = "all" | "high" | "low";
export type ReviewSortOrder = "newest" | "oldest";