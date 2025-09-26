import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import Blog from "../model/Blog.js";
import { requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// Resolve absolute uploads directory relative to backend root
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer setup with file size limit (2MB)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  
  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only images are allowed (jpeg, jpg, png, gif, webp)'));
  }
};

const upload = multer({ 
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter
});

// Error handling middleware for Multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: "Image must be less than 2MB" });
    }
  } else if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
};

// POST - Create blog
router.post("/create", requireAdmin, upload.single("image"), handleMulterError, async (req, res) => {
  try {
    const { title, content, excerpt, metaTitle, metaDescription } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }

    const blog = new Blog({ 
      title, 
      content, 
      excerpt: excerpt || content.substring(0, 160),
      metaTitle: metaTitle || title,
      metaDescription: metaDescription || content.substring(0, 160),
      image 
    });
    
    await blog.save();

    res.status(201).json({ 
      message: "Blog uploaded successfully", 
      blog,
      slug: blog.slug
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "Blog title must be unique" });
    }
    console.error("❌ Upload error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// GET - Fetch all blogs
router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.status(200).json({ blogs });
  } catch (error) {
    console.error("❌ Fetch error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// GET - Fetch single blog by slug
// In your blog routes (backend)
// In your backend routes (blog.js)
router.get("/:slug", async (req, res) => {
  try {
    console.log(`Fetching blog with slug: ${req.params.slug}`);
    
    const blog = await Blog.findOne({ slug: req.params.slug });
    
    if (!blog) {
      console.log('Blog not found in database');
      return res.status(404).json({ 
        error: "Blog not found",
        requestedSlug: req.params.slug
      });
    }

    // Provide simple related blogs (most recent 3 excluding current)
    const relatedBlogs = await Blog.find({ _id: { $ne: blog._id } })
      .sort({ createdAt: -1 })
      .limit(3)
      .lean();

    res.status(200).json({ blog, relatedBlogs });
  } catch (error) {
    console.error("Error fetching blog:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});
// PUT - Update blog
router.put("/:id", requireAdmin, upload.single("image"), handleMulterError, async (req, res) => {
  try {
    const { title, content, excerpt, metaTitle, metaDescription } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : undefined;

    const updateData = {
      ...(title && { title }),
      ...(content && { content }),
      ...(excerpt && { excerpt }),
      ...(metaTitle && { metaTitle }),
      ...(metaDescription && { metaDescription }),
      ...(image && { image }),
      updatedAt: Date.now()
    };

    const blog = await Blog.findByIdAndUpdate(req.params.id, updateData, { 
      new: true,
      runValidators: true
    });

    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    res.status(200).json({ message: "Blog updated successfully", blog });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "Blog title must be unique" });
    }
    console.error("❌ Update error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// DELETE - Remove blog
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);

    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error("❌ Delete error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;