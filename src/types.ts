export interface Review {
  id: string;
  user: string;
  avatar: string;
  rating: number;
  content: string;
  date: string;
  images?: string[];
}

export interface Dish {
  name: string;
  price: number;
  image: string;
  recommendationRate: number; // Percentage of people who recommend it
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  detail: string;
  isDefault: boolean;
}

export interface Restaurant {
  id: string;
  name: string;
  category: string;
  location: string;
  distanceValue: number; // In meters
  avgPrice: number;
  rating: number;
  tags: string[];
  scenes: string[];
  hours: string;
  signatureDishes: Dish[];
  image: string;
  reviews: Review[];
  coordinates: { x: number; y: number }; // For SVG map
  phone: string;
  address: string;
}

export type Category = '川湘菜' | '粤菜' | '日韩料理' | '西式快餐' | '奶茶甜品' | '面馆' | '烧烤';
export type Scene = '一个人吃' | '朋友约饭' | '情侣约会' | '深夜夜宵' | '生日聚餐' | '快速解决';
export type PriceRange = '¥10以内' | '¥10~20' | '¥20~40';
export type Distance = '500m内' | '1km内' | '不限';
