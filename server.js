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
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email, // Sending to the dynamic user email
      subject: `OTP Verification for ${mobile}`,
      text: `Hello,\n\nThe OTP for user with mobile number ${mobile} is: ${otp}\n\nPlease use this OTP to verify the account in the Kirana Khata app.`
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
