export interface Business {
  id: number;
  name: string;
  description: string;
  logo: string;
}

export interface Restaurant {
  id: number;
  name: string;
  address: string;
  phone_number: string;
  photo: string;
  business_id: number;
}

export interface Table {
  id: string | number;
  table_number: number;
  qr_code: string;
  active: boolean;
  status: "open" | "occupied" | "in-maintaince";
  restaurant_id: number;
  currentOrder?: Order;
}

export interface Menu {
  id: number;
  name: string;
  description: string;
  photo: string;
  active: boolean;
  business_id: number;
}

export interface Category {
  id: number;
  name: string;
  order: number;
  menu_id: number;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  photo: string;
  default_price: number;
  business_id: number;
}

export interface ProductCategory {
  product_category_id: number;
  category_id: number;
  product_id: number;
}

export interface ProductPrice {
  id: number;
  price: number;
  product_id: number;
  menu_id: number;
}

export interface Order {
  id: number;
  total: number;
  table_id: number;
  restaurant_id: number;
  requests: Request[];
  status: "initial" | "in-progress" | "canceled" | "payed" | "to-payed";
  price: number; // soma de todos os requests
}

export interface Request {
  id: number;
  status: "pending" | "confirmed";
  order_id: number;
  productRequests: ProductRequests[];
  status: "initial" | "finished";
}

export interface ProductRequest {
  id: number;
  product_id: number;
  request_id: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "owner" | "staff";
}

export interface Staff {
  id: number;
  name: string;
  user_id: number;
  business_id: number;
  restaurant_id: number;
}

export interface Ingredient {
  id: number;
  name: string;
  description: string;
  photo: string;
  business_id: number;
}

export interface ProductIngredient {
  id: number;
  product_id: number;
  ingredient_id: number;
}

export interface ProductCustomization {
  id: number;
  price: number;
  product_id: number;
  ingredient_id: number;
}
