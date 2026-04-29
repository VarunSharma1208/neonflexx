export interface Product {
  _id: string;
  id?: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  description: string;
  stock: number;
  badge?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
