import express from "express";
import multer from "multer";
import xlsx from "xlsx";
import Product from "../model/Product.js";
import { requireAdmin } from "../middleware/auth.js";
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

const router = express.Router();

// Multer setup
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// Upload helper
const uploadToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    if (!file || !file.buffer) {
      return reject(new Error('No file data received'));
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "products", resource_type: "auto" },
      (error, result) => {
        if (error) return reject(new Error('Cloudinary upload failed'));
        resolve({
          url: result.secure_url,
          public_id: result.public_id
        });
      }
    );

    streamifier.createReadStream(file.buffer).pipe(uploadStream);
  });
};


// 🧾 Upload Excel
router.post("/admin/uploadexcel", requireAdmin, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const jsonData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const products = jsonData.map(row => ({
      name: row.name,
      code: row.code,
      description: row.description,
      category: row.category,
      subcategory: row.subcategory,
      imageUrl: row.image?.startsWith("http") ? row.image : undefined
    }));

    await Product.insertMany(products);
    res.status(200).json({ message: "Products uploaded", count: products.length });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// 📥 Add product with image
router.post("/admin/add", requireAdmin, upload.single("image"), async (req, res) => {
  try {
    const { name, category, description, code, subcategory } = req.body;

    if (!req.file || !req.file.mimetype.startsWith('image/')) {
      return res.status(400).json({ error: "Valid image file required" });
    }

    const { url, public_id } = await uploadToCloudinary(req.file);

    const newProduct = new Product({
      name,
      category,
      subcategory,
      description,
      code,
      imageUrl: url,
      cloudinaryId: public_id // Store the Cloudinary public_id
    });

    await newProduct.save();
    res.status(201).json({ 
      message: "Product added", 
      product: newProduct 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✏️ Update product
router.put("/admin/:id", requireAdmin, upload.single("image"), async (req, res) => {
  try {
    const { name, category, subcategory, description, code } = req.body;
    const { id } = req.params;

    const updateData = { name, category, subcategory, description, code };

    if (req.file) {
      const { url, public_id } = await uploadToCloudinary(req.file);
      updateData.imageUrl = url;
      updateData.cloudinaryId = public_id;
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { 
      new: true 
    });
    
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ 
      message: "Product updated", 
      product: updatedProduct 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📦 Get all
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🌐 Public paginated products
router.get("/paginated", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 16;
    const total = await Product.countDocuments();
    const products = await Product.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      products,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔍 Search
router.get("/product", async (req, res) => {
  try {
    const query = req.query.search || "";
    const products = await Product.find({
      $or: [
        { name: new RegExp(query, "i") },
        { code: new RegExp(query, "i") }
      ]
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📁 Category filter
router.get("/category/:category", async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.category });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📁 Category paginated (with optional with/without gemstone filter)
router.get("/category/:category/paginated", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 16;
    const filter = (req.query.filter || "all").toLowerCase();

    const query = { category: req.params.category };
    if (filter === "with") {
      query.subcategory = new RegExp("withgemstone", "i");
    } else if (filter === "without") {
      query.subcategory = new RegExp("withoutgemstone", "i");
    }

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      products,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📁 Subcategory filter
router.get("/categorys/:category/subcategory/:subcategory", async (req, res) => {
  try {
    const { category, subcategory } = req.params;
    const products = await Product.find({ category, subcategory });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📁 Subcategory paginated
router.get("/categorys/:category/subcategory/:subcategory/paginated", async (req, res) => {
  try {
    const { category, subcategory } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 16;

    const query = { category, subcategory };
    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      products,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🆔 Single product
router.get("/single/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📄 Paginated admin view
router.get("/admin/paginated", requireAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";

    const query = {
      $or: [
        { name: new RegExp(search, "i") },
        { code: new RegExp(search, "i") },
        { category: new RegExp(search, "i") },
        { subcategory: new RegExp(search, "i") }
      ]
    };

    const total = await Product.countDocuments(query);
const products = await Product.find(query)
  .sort({ createdAt: -1 }) // ✅ Newest first
  .skip((page - 1) * limit)
  .limit(limit);


    res.json({
      products,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// ❌ Delete product
router.delete("/admin/:id", requireAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Optional: delete image from Cloudinary
    if (product.cloudinaryId) {
      await cloudinary.uploader.destroy(product.cloudinaryId);
    }

    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


export default router;
