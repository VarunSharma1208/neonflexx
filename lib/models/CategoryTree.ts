import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICategoryTree extends Document {
  tree: Record<string, Record<string, string[]>>;
}

const CategoryTreeSchema = new Schema<ICategoryTree>({
  tree: { type: Schema.Types.Mixed, required: true },
});

const CategoryTreeModel: Model<ICategoryTree> =
  mongoose.models.CategoryTree ??
  mongoose.model<ICategoryTree>("CategoryTree", CategoryTreeSchema);

export default CategoryTreeModel;
