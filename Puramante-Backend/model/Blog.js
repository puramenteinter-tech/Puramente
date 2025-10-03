import mongoose from "mongoose";
import slugify from 'slugify';

const blogSchema = new mongoose.Schema({
   title: {
    type: String,
    required: [true, 'Blog title is required'],
    unique: true,
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    required: [true, 'Slug is required'],
    index: true
  },
  content: {
    type: String,
    required: [true, 'Blog content is required']
  },
  excerpt: {
    type: String,
    maxlength: [160, 'Excerpt cannot be longer than 160 characters'],
    trim: true
  },
  metaTitle: {
    type: String,
    maxlength: [60, 'Meta title cannot be longer than 60 characters'],
    trim: true
  },
  metaDescription: {
    type: String,
    maxlength: [160, 'Meta description cannot be longer than 160 characters'],
    trim: true
  },
  image: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

// Enhanced slug generation with duplicate handling
blogSchema.pre('validate', function(next) { // Changed from 'save' to 'validate'
  if (this.slug) return next(); // Skip if slug already exists
  
  try {
    // Generate base slug
    let slug = slugify(this.title, {
      lower: true,
      strict: true,
      trim: true
    });
    
    // Fallback if slug is empty
    if (!slug) {
      slug = `blog-${Date.now()}`;
    }
    
    this.slug = slug;
    next();
  } catch (err) {
    // Fallback slug generation
    this.slug = `blog-${Date.now()}`;
    next();
  }
});


export default mongoose.model("Blog", blogSchema);