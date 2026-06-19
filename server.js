import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import 'dotenv/config';

const app = express();
app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

app.post('/api/send-otp', async (req, res) => {
  const { mobile, email, otp } = req.body;
  
  if (!email) {
    return res.status(400).json({ success: false, error: 'Email is required' });
  }

  try {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
      <style>
        body { font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6; margin: 0; padding: 40px 0; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); overflow: hidden; }
        .header { background: linear-gradient(135deg, #3b82f6, #1d4ed8); padding: 30px 20px; text-align: center; color: white; }
        .header h1 { margin: 0; font-size: 28px; font-weight: 700; letter-spacing: 1px; }
        .content { padding: 40px 30px; color: #374151; line-height: 1.6; font-size: 16px; }
        .otp-box { background-color: #eff6ff; border: 2px dashed #3b82f6; border-radius: 12px; padding: 24px; text-align: center; margin: 32px 0; }
        .otp-code { font-size: 42px; font-weight: 800; color: #1d4ed8; letter-spacing: 8px; margin: 0; font-family: monospace; }
        .footer { background-color: #f9fafb; padding: 24px; text-align: center; font-size: 13px; color: #6b7280; border-top: 1px solid #f3f4f6; }
      </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Pocket Vyapaar</h1>
          </div>
          <div class="content">
            <h2 style="margin-top:0; color:#111827;">Verification Code</h2>
            <p>Hello,</p>
            <p>Please use the following OTP to verify your account linked with mobile number <strong>${mobile}</strong>.</p>
            
            <div class="otp-box">
              <p class="otp-code">${otp}</p>
            </div>
            
            <p>This code is valid for 10 minutes. If you did not request this code, please ignore this email.</p>
          </div>
          <div class="footer">
            &copy; ${new Date().getFullYear()} Pocket Vyapaar. All rights reserved.<br>
            This is an automated message, please do not reply.
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"Pocket Vyapaar" <${process.env.EMAIL_USER}>`,
      to: email, // Sending to the dynamic user email
      subject: `OTP Verification for ${mobile}`,
      text: `Hello,\n\nThe OTP for user with mobile number ${mobile} is: ${otp}\n\nPlease use this OTP to verify the account in the Kirana Khata app.`,
      html: htmlContent
    };
    
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: `OTP sent to ${email} successfully` });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, error: 'Failed to send OTP email' });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Email SMTP server running on http://localhost:${PORT}`);
});
