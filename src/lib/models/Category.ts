import mongoose, { Schema } from "mongoose";

const subCategorySchema = new Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    parentGroup: { type: String, default: "" },
    image: { type: String, default: "" },
  },
  { _id: false }
);

const categorySchema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  image: {
    type: String,
    default: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&h=1000&fit=crop&auto=format",
  },
  description: { type: String, default: "" },
  subcategories: { type: [subCategorySchema], default: [] },
  isCustom: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true },
  showOnHome: { type: Boolean, default: true },
  priority: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Category = mongoose.models.Category || mongoose.model("Category", categorySchema);
export default Category;
