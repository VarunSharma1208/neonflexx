import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProduct extends Document {
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: string;
  subcategory?: string;
  targetArea?: string;
  rating: number;
  reviews: number;
  description: string;
  stock: number;
  badge?: string;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    image: { type: String, required: true },
    images: { type: [String], default: [] },
    category: { type: String, required: true },
    subcategory: { type: String },
    targetArea: { type: String },
    rating: { type: Number, required: true, min: 0, max: 5 },
    reviews: { type: Number, required: true, default: 0 },
    description: { type: String, required: true },
    stock: { type: Number, required: true, default: 0 },
    badge: { type: String },
  },
  { timestamps: true }
);

const ProductModel: Model<IProduct> =
  mongoose.models.Product ?? mongoose.model<IProduct>("Product", ProductSchema);

export default ProductModel;
