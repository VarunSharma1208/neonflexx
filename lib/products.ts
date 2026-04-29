import { Product } from "@/types";

export const products: Product[] = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    price: 2999,
    originalPrice: 4999,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    category: "Electronics",
    rating: 4.5,
    reviews: 128,
    description: "Crystal clear sound with active noise cancellation. 30-hour battery life, foldable design, and premium comfort ear cushions. Perfect for music lovers and professionals.",
    stock: 15,
    badge: "Sale",
  },
  {
    id: 2,
    name: "Men's Casual Sneakers",
    price: 1499,
    originalPrice: 2199,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
    category: "Fashion",
    rating: 4.3,
    reviews: 89,
    description: "Lightweight and comfortable sneakers for everyday wear. Breathable mesh upper, cushioned insole, and durable rubber outsole for all-day comfort.",
    stock: 30,
    badge: "Sale",
  },
  {
    id: 3,
    name: "Stainless Steel Water Bottle",
    price: 599,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop",
    category: "Sports",
    rating: 4.7,
    reviews: 215,
    description: "Double-wall vacuum insulated bottle keeps drinks cold for 24 hours and hot for 12 hours. BPA-free, leak-proof lid, and wide mouth for easy cleaning.",
    stock: 50,
    badge: "Bestseller",
  },
  {
    id: 4,
    name: "Smart Watch Pro",
    price: 7999,
    originalPrice: 9999,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    category: "Electronics",
    rating: 4.6,
    reviews: 342,
    description: "Feature-packed smartwatch with health monitoring, GPS, 7-day battery, sleep tracking, and 50+ workout modes. Compatible with Android and iOS.",
    stock: 8,
    badge: "Hot",
  },
  {
    id: 5,
    name: "Leather Crossbody Bag",
    price: 1899,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop",
    category: "Fashion",
    rating: 4.4,
    reviews: 67,
    description: "Genuine leather crossbody bag with adjustable strap, multiple compartments, and gold-tone hardware. Perfect for daily use or weekend outings.",
    stock: 20,
  },
  {
    id: 6,
    name: "Yoga Mat Premium",
    price: 899,
    originalPrice: 1299,
    image: "https://images.unsplash.com/photo-1601925228154-86c838abf962?w=400&h=400&fit=crop",
    category: "Sports",
    rating: 4.8,
    reviews: 178,
    description: "Extra thick 6mm eco-friendly TPE yoga mat with alignment lines, non-slip surface, and carrying strap. Suitable for all yoga styles and fitness levels.",
    stock: 25,
    badge: "New",
  },
  {
    id: 7,
    name: "Bluetooth Speaker",
    price: 1599,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop",
    category: "Electronics",
    rating: 4.2,
    reviews: 95,
    description: "360-degree surround sound with deep bass. Waterproof (IPX7), 12-hour playtime, built-in mic for calls. Perfect for outdoor adventures.",
    stock: 18,
  },
  {
    id: 8,
    name: "Sunglasses UV400",
    price: 799,
    originalPrice: 1199,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop",
    category: "Fashion",
    rating: 4.1,
    reviews: 53,
    description: "Polarized UV400 protection sunglasses with lightweight frame and scratch-resistant lenses. Stylish design suitable for driving, beach, and daily use.",
    stock: 40,
    badge: "Sale",
  },
];

export const categories = ["All", "Electronics", "Fashion", "Sports"];

export function getProductById(id: number): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductsByCategory(category: string): Product[] {
  if (category === "All") return products;
  return products.filter((p) => p.category === category);
}
