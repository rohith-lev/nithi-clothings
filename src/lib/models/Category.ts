import mongoose, { Schema } from "mongoose";

const subCategorySchema = new Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    parentGroup: { type: String, default: "" },
  },
  { _id: false }
);

const categorySchema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  image: {
    type: String,
    default: "https://images.unsplash.com/photo-1594938298603-c8148c4b4e75?w=800&h=1000&fit=crop&auto=format",
  },
  description: { type: String, default: "" },
  subcategories: { type: [subCategorySchema], default: [] },
  isCustom: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Category = mongoose.models.Category || mongoose.model("Category", categorySchema);
export default Category;
