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
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f7f6; margin: 0; padding: 40px 0; -webkit-font-smoothing: antialiased; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 8px 30px rgba(0,0,0,0.08); overflow: hidden; }
        .header { background: linear-gradient(135deg, #0ea5e9, #0284c7); padding: 40px 20px; text-align: center; color: #ffffff; }
        .header h1 { margin: 0; font-size: 32px; font-weight: 700; letter-spacing: 0.5px; text-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .header p { margin: 10px 0 0; font-size: 16px; opacity: 0.9; font-weight: 300; }
        .content { padding: 40px 40px; color: #334155; line-height: 1.8; font-size: 16px; }
        .greeting { font-size: 20px; font-weight: 600; color: #0f172a; margin-top: 0; }
        .highlight { color: #0ea5e9; font-weight: 600; }
        .otp-container { margin: 35px 0; padding: 30px; background: #f8fafc; border-radius: 16px; text-align: center; border: 1px solid #e2e8f0; box-shadow: inset 0 2px 4px rgba(0,0,0,0.02); }
        .otp-label { font-size: 14px; text-transform: uppercase; letter-spacing: 1.5px; color: #64748b; margin-bottom: 15px; display: block; font-weight: 600; }
        .otp-code { font-size: 48px; font-weight: 800; color: #0f172a; letter-spacing: 12px; margin: 0; font-family: 'Courier New', Courier, monospace; text-shadow: 2px 2px 0px #e2e8f0; }
        .warning { font-size: 14px; color: #64748b; background: #fffbeb; padding: 15px; border-left: 4px solid #f59e0b; border-radius: 4px; margin-top: 30px; }
        .footer { background-color: #f8fafc; padding: 30px; text-align: center; font-size: 13px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
        .footer a { color: #0ea5e9; text-decoration: none; }
      </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Pocket Vyapaar</h1>
            <p>Your Smart Digital Khata</p>
          </div>
          <div class="content">
            <h2 class="greeting">Welcome Aboard!</h2>
            <p>Thank you for registering with <strong>Pocket Vyapaar</strong>. We are thrilled to have you join our platform designed to make your daily transactions and record-keeping absolutely seamless.</p>
            <p>To securely complete your registration for the mobile number <span class="highlight">${mobile}</span>, please use the verification code below:</p>
            
            <div class="otp-container">
              <span class="otp-label">Secure Verification Code</span>
              <p class="otp-code">${otp}</p>
            </div>
            
            <p>Enter this code in the app to instantly activate your account and start managing your ledger effortlessly.</p>
            
            <div class="warning">
              <strong>Security Notice:</strong> This code is valid for the next 10 minutes. Please do not share this OTP with anyone. If you didn't request this, simply ignore this email.
            </div>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Pocket Vyapaar Inc. All rights reserved.</p>
            <p>Need help? Contact our <a href="#">Support Team</a></p>
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
