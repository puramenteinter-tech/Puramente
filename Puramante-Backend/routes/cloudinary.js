import express from 'express';
import crypto from 'crypto';
import { v2 as cloudinary } from 'cloudinary';

const router = express.Router();

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
  api_proxy: process.env.HTTP_PROXY // Add if behind corporate proxy
});
cloudinary.api.ping()
  .then(() => console.log('Cloudinary connection successful'))
  .catch(err => {
    console.error('Cloudinary configuration error:', err);
    process.exit(1);
  });
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

// 🔐 Generate Cloudinary signature
function generateCloudinarySignature(params) {
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&');
  
  const signature = crypto
    .createHash('sha1')
    .update(sortedParams + process.env.CLOUDINARY_API_SECRET)
    .digest('hex');

  console.log('Generated signature:', { params, signature }); // Debug log
  return signature;
}

// 📦 Endpoint to generate signature
router.post('/get-cloudinary-signature', (req, res) => {
  const timestamp = Math.floor(Date.now() / 1000);
  const folder = 'products';

  const signature = generateCloudinarySignature({ folder, timestamp });

  res.json({ timestamp, signature, folder });
});

export default router;
