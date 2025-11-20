import type { VercelRequest, VercelResponse } from '@vercel/node';
import formidable from 'formidable';
import nodemailer from 'nodemailer';

export const config = {
  api: {
    bodyParser: false,
  },
};

const parseForm = (req: VercelRequest): Promise<{ fields: any; files: any }> => {
  const form = formidable({
    keepExtensions: true,
    maxFileSize: 10 * 1024 * 1024, // 10MB
  });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
};

const sendEmailNotification = async (orderData: any) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.log('Email credentials not configured, skipping email');
    return;
  }

  const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const orderDetails = JSON.parse(orderData.orderDetails);
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'niyasjahangeer772@gmail.com',
    subject: `New SIRAQ Order - ${orderData.orderId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #F9B234;">New Order Received</h2>
        <p><strong>Order ID:</strong> ${orderData.orderId}</p>
        <p><strong>Product Type:</strong> ${orderData.productType.toUpperCase().replace('-', ' ')}</p>
        <h3>Order Details:</h3>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
          <pre style="white-space: pre-wrap;">${JSON.stringify(orderDetails, null, 2)}</pre>
        </div>
        <h3>Pricing:</h3>
        <p><strong>Total Price:</strong> ₹${orderDetails.pricing?.totalPrice || 'N/A'}</p>
        <p><strong>Quantity:</strong> ${orderDetails.pricing?.quantity || 'N/A'}</p>
        <p><strong>Paper Type:</strong> ${orderDetails.pricing?.paperType || 'N/A'}</p>
        <p><strong>Estimated Delivery:</strong> ${orderDetails.pricing?.estimatedDelivery || 'N/A'}</p>
        <hr>
        <p style="color: #666;">Check your WhatsApp (+91 82174 69646) for customer contact.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { fields, files } = await parseForm(req);
    
    const orderId = Array.isArray(fields.orderId) ? fields.orderId[0] : fields.orderId;
    const productType = Array.isArray(fields.productType) ? fields.productType[0] : fields.productType;
    const orderDetails = Array.isArray(fields.orderDetails) ? fields.orderDetails[0] : fields.orderDetails;

    console.log('Order received:', { orderId, productType });

    // Send email notification
    try {
      await sendEmailNotification({ orderId, productType, orderDetails });
    } catch (emailError) {
      console.error('Email error:', emailError);
      // Continue even if email fails
    }

    return res.status(200).json({
      success: true,
      orderId,
      message: 'Order submitted successfully',
    });
  } catch (error) {
    console.error('Order submission error:', error);
    return res.status(500).json({ error: 'Failed to process order' });
  }
}
