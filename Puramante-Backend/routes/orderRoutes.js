import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import ExcelJS from "exceljs";
import Order from "../model/Order.js";
import { requireAdmin, requireAuth } from "../middleware/auth.js";
import Product from "../model/Product.js";
import { getNextOrderId } from "../config/getNextOrderId.js";
import nodemailer from "nodemailer";
import axios from "axios";
import mongoose from "mongoose";
import { v2 as cloudinary } from 'cloudinary';
import os from 'os';
import { promises as fs } from 'fs';
import fsSync from 'fs';
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'info@puramentejewel.com',
    pass: process.env.EMAIL_PASS,
  },
});

const ensureUploadsDirectory = async () => {
  const uploadPath = path.join(__dirname, "../uploads");
  try {
    await fs.access(uploadPath);
  } catch (err) {
    if (err.code === 'ENOENT') {
      await fs.mkdir(uploadPath, { recursive: true });
    } else {
      throw err;
    }
  }
  return uploadPath;
};

const generateExcelFile = async (orderData, filePath) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Price Quotation");
  const tempFiles = [];

  // Add company header
  sheet.mergeCells('A1:F1');
  sheet.getCell('A1').value = 'Puramente International';
  sheet.getCell('A1').font = { size: 16, bold: true, color: { argb: 'FF2F5496' } };
  sheet.getCell('A1').alignment = { horizontal: 'center' };

  sheet.mergeCells('A2:F2');
  sheet.getCell('A2').value = '113/101, Sector-11, Pratap Nagar, Sanganer, Jaipur, 302033';
  sheet.getCell('A2').alignment = { horizontal: 'center' };

  sheet.mergeCells('A3:F3');
  sheet.getCell('A3').value = 'Mob: +919314346148 | www.puramentejewel.com';
  sheet.getCell('A3').alignment = { horizontal: 'center' };

  // Add quotation title
  sheet.mergeCells('A5:F5');
  sheet.getCell('A5').value = 'PRICE QUOTATION';
  sheet.getCell('A5').font = { size: 14, bold: true };
  sheet.getCell('A5').alignment = { horizontal: 'center' };
  sheet.getRow(5).height = 30;

  // Customer information
  const customerInfo = [
    ['Name:', orderData.firstName || ''],
    ['Email:', orderData.email || ''],
    ['Mob.:', orderData.contactNumber || ''],
    ['Company:', orderData.companyName || ''],
    ['Address:', orderData.address || ''],
    ['Ref. No:', orderData.orderId || ''],
    ['Date:', new Date().toLocaleDateString()],
    ['Currency:', 'US$']
  ];

  customerInfo.forEach(([label, value], idx) => {
    sheet.getCell(`A${7 + idx}`).value = label;
    sheet.getCell(`A${7 + idx}`).font = { bold: true };
    sheet.getCell(`B${7 + idx}`).value = value;
  });

  // Product table header
  const headers = ['Model No.', 'Image', 'Item', 'Metal', 'Price', 'Qty', 'Amount'];
  sheet.addRow(headers);
  sheet.getRow(16).eachCell((cell) => {
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2F5496' } };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
  });

  // Process all images first and collect their positions
  const imageProcessingPromises = (orderData.orderDetails || []).map(async (item, index) => {
    const rowNumber = 17 + index;
    let imageInfo = null;

    if (item.cloudinaryId) {
      try {
        console.log(`Processing image for: ${item.name}`);
        
        // Clean the Cloudinary public ID
        let cleanPublicId = item.cloudinaryId
          .replace(/\.[^/.]+$/, "")
          .replace(/^https?:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\//, "");

        // Generate Cloudinary URL
        const imageUrl = cloudinary.url(cleanPublicId, {
          width: 300,
          height: 300,
          crop: 'fill',
          quality: 'auto',
          format: 'png',
          secure: true
        });

        // Download image
        const response = await axios.get(imageUrl, {
          responseType: 'arraybuffer',
          timeout: 20000,
          headers: { 'User-Agent': 'Mozilla/5.0' }
        });

        if (!response.data || response.data.length === 0) {
          throw new Error('Empty image response');
        }

        // Create temp file
        const tempImagePath = path.join(os.tmpdir(), `product_img_${Date.now()}_${index}.jpg`);
        await fs.writeFile(tempImagePath, response.data);
        tempFiles.push(tempImagePath);

        // Verify image file
        const stats = await fs.stat(tempImagePath);
        if (stats.size === 0) {
          throw new Error('Downloaded image is empty');
        }

        imageInfo = {
          path: tempImagePath,
          rowNumber,
          index
        };

      } catch (error) {
        console.error(`Image processing failed for ${item.name}:`, error);
        return {
          rowNumber,
          error: 'Image not available'
        };
      }
    }

    return {
      rowNumber,
      imageInfo
    };
  });

  // Wait for all image processing to complete
  const imageProcessingResults = await Promise.all(imageProcessingPromises);

  // Now add all product rows with their data
  for (const [index, item] of (orderData.orderDetails || []).entries()) {
    const rowNumber = 17 + index;
    
    // Add product data row
    const rowData = [
      item.sku || 'N/A',
      '', // Image placeholder (will be replaced if available)
      item.name || 'Unnamed Product',
      item.metal || '925 SILVER',
      item.price ? `$${item.price.toFixed(2)}` : '$-',
      item.quantity || 1,
      item.price ? `$${(item.price * (item.quantity || 1)).toFixed(2)}` : '$-'
    ];

    const row = sheet.addRow(rowData);
    if (!row) {
      console.error('Failed to add row for item:', item);
      continue;
    }

    sheet.getRow(rowNumber).height = 120;

    // Format cells
    sheet.getRow(rowNumber).eachCell((cell) => {
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });
  }

  // Add images to their respective rows
  for (const result of imageProcessingResults) {
    if (result.imageInfo) {
      try {
        const imageId = workbook.addImage({
          filename: result.imageInfo.path,
          extension: 'jpg',
        });

        sheet.addImage(imageId, {
          tl: { col: 1, row: result.rowNumber - 1, offsetX: 2, offsetY: 2 },
          br: { col: 2, row: result.rowNumber, offsetX: -2, offsetY: -2 },
          editAs: 'oneCell'
        });

        console.log(`Successfully added image for row ${result.rowNumber}`);
      } catch (error) {
        console.error(`Failed to add image to row ${result.rowNumber}:`, error);
        sheet.getCell(`B${result.rowNumber}`).value = 'Image not available';
        sheet.getCell(`B${result.rowNumber}`).font = { color: { argb: 'FFFF0000' } };
      }
    } else if (result.error) {
      sheet.getCell(`B${result.rowNumber}`).value = result.error;
      sheet.getCell(`B${result.rowNumber}`).font = { color: { argb: 'FFFF0000' } };
    }
  }

  // Calculate total
  const totalRow = 17 + (orderData.orderDetails?.length || 0);
  sheet.mergeCells(`A${totalRow}:E${totalRow}`);
  sheet.getCell(`A${totalRow}`).value = 'TOTAL';
  sheet.getCell(`A${totalRow}`).font = { bold: true };
  sheet.getCell(`A${totalRow}`).alignment = { horizontal: 'right' };
  
  const totalAmount = orderData.orderDetails?.reduce((sum, item) => {
    return sum + (item.price || 0) * (item.quantity || 1);
  }, 0);
  
  sheet.getCell(`F${totalRow}`).value = `$${totalAmount?.toFixed(2) || '0.00'}`;
  sheet.getCell(`F${totalRow}`).font = { bold: true };

  // Set column widths
  sheet.columns = [
    { width: 15 }, // Model No.
    { width: 20 }, // Image
    { width: 25 }, // Item
    { width: 15 }, // Metal
    { width: 12 }, // Price
    { width: 8 },  // Qty
    { width: 12 }  // Amount
  ];

  await workbook.xlsx.writeFile(filePath);

  // Clean up temp files
  for (const file of tempFiles) {
    try {
      await fs.unlink(file);
    } catch (err) {
      console.warn('Failed to delete temp file:', file, err.message);
    }
  }
};

router.post("/submit-order", requireAuth, async (req, res) => {
  // Auth required
  try {
    const authHeader = req.headers.authorization || "";
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
  } catch (err) {
    return res.status(401).json({ success: false, error: "Invalid or expired token" });
  }
  try {
    const { firstName, email, contactNumber, companyName, country, message, orderDetails } = req.body;

    // Validate required fields
    if (!firstName || !email || !contactNumber || !country) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const orderId = await getNextOrderId();
    const uploadPath = await ensureUploadsDirectory();
    const filePath = path.join(uploadPath, `Quotation_${orderId}.xlsx`);

    // Fetch complete product data with Cloudinary URLs
    // Update the enrichedOrderDetails processing in the submit-order route
const enrichedOrderDetails = await Promise.all(
  orderDetails.map(async (item, index) => {
    try {
      // Ensure all critical fields exist with defaults
      const baseData = {
        sku: `TEMP-${index}`,
        name: 'Unnamed Product',
        description: '',
        price: 0,
        metal: '925 SILVER',
        cloudinaryId: null,
        quantity: 1,
        ...item
      };

      if (item.productId && mongoose.isValidObjectId(item.productId)) {
        try {
          const product = await Product.findById(item.productId).lean();
          if (product) {
            return {
              ...baseData,
              sku: product.sku || baseData.sku,
              name: product.name || baseData.name,
              description: product.description || baseData.description,
              price: product.price ?? baseData.price,
              metal: product.metal || baseData.metal,
              cloudinaryId: product.cloudinaryId || baseData.cloudinaryId
            };
          }
        } catch (dbError) {
          console.error(`DB Error for product ${item.productId}:`, dbError);
        }
      }
      
      return baseData;
    } catch (error) {
      console.error(`Error processing item ${index}:`, error);
      return {
        sku: `ERR-${index}`,
        name: 'Error Processing Product',
        price: 0,
        metal: '925 SILVER',
        quantity: 1,
        cloudinaryId: null
      };
    }
  })
);

    
    await generateExcelFile({
  orderId,
  firstName,
  email,
  contactNumber,
  companyName,
  country,
  message,
  orderDetails: enrichedOrderDetails // Make sure this is the enriched data
}, filePath);

    const newOrder = new Order({
      orderId,
      firstName,
      email,
      contactNumber,
      companyName,
      country,
      message,
      orderDetails: enrichedOrderDetails,
      excelFilePath: `/uploads/Quotation_${orderId}.xlsx`,
      status: 'Pending'
    });

    await newOrder.save();

    const customerMailOptions = {
      from: `"Puramente International" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Thank You for Your Quotation Request #${orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; line-height: 1.6;">
          <h2 style="color: #2F5496; text-align: center;">Thank You For Your Inquiry!</h2>
          <p>Dear ${firstName},</p>
          
          <p>We have received your quotation request (Reference #${orderId}) and our team is currently processing it.</p>
          
          <p><strong>Our team will contact you within 24-48 hours</strong> to discuss your requirements and provide the quotation.</p>
          
          <p style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; border-left: 4px solid #2F5496;">
            <strong>For immediate assistance:</strong><br>
            Email: ${process.env.EMAIL_USER}<br>
            Phone: +919314346148<br>
            WhatsApp: +919314346148
          </p>
          
          <p>We appreciate your business and look forward to serving you.</p>
          
          <p>Best regards,<br/>
          <strong>Puramente International Team</strong></p>
        </div>
      `,
      text: `Dear ${firstName},\n\nThank you for your quotation request (Reference #${orderId}).\n\nOur team is processing your request and will contact you within 24-48 hours.\n\nFor immediate assistance:\nEmail: ${process.env.EMAIL_USER}\nPhone: +919314346148\nWhatsApp: +919314346148\n\nBest regards,\nPuramente International Team`,
      headers: {
        'X-Priority': '1',
        'X-Mailer': 'Puramente Jewelry System'
      }
    };

    const adminMailOptions = {
      from: `"Puramente International" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `NEW QUOTATION REQUEST - ${orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2F5496;">New Quotation Request Received</h2>
          
          <p><strong>Customer Details:</strong></p>
          <ul>
            <li><strong>Name:</strong> ${firstName}</li>
            <li><strong>Email:</strong> ${email}</li>
            <li><strong>Phone:</strong> ${contactNumber}</li>
            <li><strong>Company:</strong> ${companyName || 'Not provided'}</li>
            <li><strong>Country:</strong> ${country}</li>
          </ul>
          
          <p><strong>Order Summary:</strong></p>
          <ul>
            <li><strong>Reference No.:</strong> ${orderId}</li>
            <li><strong>Total Items:</strong> ${orderDetails.length}</li>
            <li><strong>Total Quantity:</strong> ${orderDetails.reduce((sum, item) => sum + (item.quantity || 1), 0)}</li>
          </ul>
          
          <p>Customer message: ${message || 'No additional message'}</p>
          
          <p>Please find attached the complete quotation details with product images.</p>
          
          <p style="color: #d9534f;"><strong>Action Required:</strong> Please contact the customer within 24-48 hours.</p>
          
          <p>Best regards,<br/>
          <strong>Automated System</strong></p>
        </div>
      `,
      attachments: [{
        filename: `Quotation_${orderId}.xlsx`,
        path: filePath
      }]
    };

    // Send emails
    await Promise.all([
      transporter.sendMail(customerMailOptions).catch(err => 
        console.error('Customer email failed:', err)
      ),
      transporter.sendMail(adminMailOptions).catch(err => 
        console.error('Admin email failed:', err)
      )
    ]);

    res.status(200).json({
      success: true,
      message: "Quotation request received successfully",
      orderId,
      downloadLink: `/api/orders/download/Quotation_${orderId}.xlsx`
    });

  } catch (error) {
    console.error("Order submission error:", error);
    res.status(500).json({ 
      success: false,
      error: "Internal Server Error",
      details: error.message 
    });
  }
});

router.get("/download/:filename", (req, res) => {
  const filePath = path.join(__dirname, "../uploads", req.params.filename);
  if (fsSync.existsSync(filePath)) {
    res.download(filePath);
  } else {
    res.status(404).json({ error: "File not found" });
  }
});

router.get("/orders", requireAdmin, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});


// DELETE ORDER by ID
router.delete("/orders/:id", requireAdmin, async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    res.status(200).json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


export default router;