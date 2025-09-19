import mongoose from "mongoose";
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  image: {
    data: Buffer,
    contentType: String,
  },
  imageurl: { type: String },
  cloudinaryId: { type: String },
  category: { type: String, required: true },
  subcategory: { type: String },
  code: { type: String, required: true }
}, {
  timestamps: true  // ✅ Automatically adds createdAt and updatedAt
});



const Product = mongoose.model("Product", ProductSchema);

export default Product;
