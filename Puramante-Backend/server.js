import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";

// Route imports
import userRegister from "./routes/userRoute.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import contactRoutes from "./routes/contactus.js";
import wishListRoutes from "./routes/wishListRoutes.js";
import blogRoutes from "./routes/blog.js";
import cloudinaryRoutes from "./routes/cloudinary.js";
import mongoose from "mongoose";
import Blog from "./model/Blog.js";

// Cloudinary config
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();
connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cloudinary configuration
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

console.log('Cloudinary Config Verified:', {
  cloud_name: cloudinary.config().cloud_name,
  api_key: cloudinary.config().api_key,
  has_secret: !!cloudinary.config().api_secret
});

cloudinary.api.ping()
  .then(() => console.log('✅ Cloudinary connection successful'))
  .catch(err => {
    console.error('❌ Cloudinary connection failed:', {
      message: err.message,
      http_code: err.http_code,
      suggestion: 'Verify your API secret in Dashboard > Account Details'
    });
    process.exit(1);
  });

const FRONTEND_URL = process.env.FRONTEND_URL;

const app = express();

// CORS with sensible fallbacks for local dev
const allowedOrigins = [
  FRONTEND_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // allow non-browser requests
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(null, false);
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());
app.use(bodyParser.json());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ✅ Serve uploads folder statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ SEO-friendly 301 redirects for outdated URLs
app.use((req, res, next) => {
  const redirects = {
    '/category/Pendant': '/category/Pendants',
    '/category/Ring': '/category/Rings',
    '/category/Bracelet': '/category/Bracelets',
     '/category/Earring': '/category/Earrings',
   
    // aur bhi add kar sakte ho
  };

  if (redirects[req.path]) {
    return res.redirect(301, redirects[req.path]); // 301 = permanent redirect
  }

  next();
});

// Routes
app.use('/api', cloudinaryRoutes);
app.use("/api/users", userRegister);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/wishlist", wishListRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/blogs", blogRoutes);

// Robots.txt
app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  const robots = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /dashboard',
    'Disallow: /product-list',
    'Disallow: /blog-list',
    'Disallow: /admin/',
    '',
    `Sitemap: ${process.env.SITE_URL || 'https://puramentejewel.com'}/sitemap.xml`
  ].join('\n');
  res.send(robots);
});

// Dynamic sitemap.xml including blogs
app.get('/sitemap.xml', async (req, res) => {
  try {
    const siteUrl = process.env.SITE_URL || 'https://puramentejewel.com';
    const urls = [
      '',
      '/blogs',
      '/shopall',
      '/aboutus',
      '/contactus',
      '/category/Rings',
      '/category/Necklaces',
      '/category/Bracelets'
    ];

    const blogDocs = await Blog.find({}, { slug: 1, updatedAt: 1, createdAt: 1 }).sort({ createdAt: -1 }).lean();

    res.type('application/xml');
    const xmlParts = [];
    xmlParts.push('<?xml version="1.0" encoding="UTF-8"?>');
    xmlParts.push('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
    urls.forEach((p) => {
      xmlParts.push('  <url>');
      xmlParts.push(`    <loc>${siteUrl}${p}</loc>`);
      xmlParts.push('    <changefreq>weekly</changefreq>');
      xmlParts.push('    <priority>0.8</priority>');
      xmlParts.push('  </url>');
    });

    blogDocs.forEach((b) => {
      xmlParts.push('  <url>');
      xmlParts.push(`    <loc>${siteUrl}/blogs/${b.slug}</loc>`);
      if (b.updatedAt) {
        xmlParts.push(`    <lastmod>${new Date(b.updatedAt).toISOString()}</lastmod>`);
      }
      xmlParts.push('    <changefreq>weekly</changefreq>');
      xmlParts.push('    <priority>0.7</priority>');
      xmlParts.push('  </url>');
    });

    xmlParts.push('</urlset>');
    res.send(xmlParts.join('\n'));
  } catch (err) {
    console.error('sitemap generation failed', err);
    res.status(500).send('Internal Server Error');
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);
