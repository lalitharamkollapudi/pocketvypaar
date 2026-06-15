import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // Enable CORS for testing locally if needed, Vercel handles it in production
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  const { mobile, email, otp } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, error: 'Email is required' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `OTP Verification for ${mobile}`,
      text: `Hello,\n\nThe OTP for user with mobile number ${mobile} is: ${otp}\n\nPlease use this OTP to verify your account in the Kirana Khata app.`
    };
    
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: `OTP sent to ${email} successfully` });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, error: 'Failed to send OTP email', details: error.message });
  }
}
