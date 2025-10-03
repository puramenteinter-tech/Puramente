import mongoose from 'mongoose';
import slugify from 'slugify';
import Blog from '../model/Blog.js';
import dotenv from 'dotenv';

// 1. Load environment variables
dotenv.config();

// 2. Proper MongoDB connection string
const DB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/your-database-name';

// 3. Enhanced connection with error handling
const connectDB = async () => {
  try {
    await mongoose.connect(DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Connected');
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
  }
};

// 4. Main migration function
const migrateSlugs = async () => {
  try {
    await connectDB();
    
    const blogs = await Blog.find({ $or: [
      { slug: { $exists: false } },
      { slug: null },
      { slug: '' }
    ]});
    
    console.log(`Found ${blogs.length} blogs needing slug updates`);
    
    for (const [index, blog] of blogs.entries()) {
      try {
        const newSlug = slugify(blog.title, { 
          lower: true,
          strict: true,
          trim: true
        }) || `blog-${Date.now()}-${index}`;
        
        blog.slug = newSlug;
        await blog.save();
        console.log(`Updated blog ${index + 1}/${blogs.length}: ${blog.title} => ${newSlug}`);
      } catch (err) {
        console.error(`Error updating blog ${blog._id}:`, err.message);
      }
    }
    
    console.log('✅ Slug migration completed successfully');
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  }
};

// Run the migration
migrateSlugs();