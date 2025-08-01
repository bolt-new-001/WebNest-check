import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD
  }
});

const emailTemplates = {
  verification: (otp, name) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #2c3e50; text-align: center;">Email Verification</h1>
      <p>Hi ${name},</p>
      <p>Thank you for signing up with WebNest! Please use the following OTP to verify your email address:</p>
      <div style="background: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0;">
        <h2 style="font-size: 24px; color: #3498db;">${otp}</h2>
      </div>
      <p>This OTP will expire in 15 minutes. If you didn't request this verification, please ignore this email.</p>
      <p>Best regards,<br>WebNest Team</p>
    </div>
  `,

  passwordReset: (resetLink, name) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #2c3e50; text-align: center;">Password Reset Request</h1>
      <p>Hi ${name},</p>
      <p>We received a request to reset your password for your WebNest account.</p>
      <p>Click the button below to reset your password:</p>
      <div style="text-align: center; margin: 20px 0;">
        <a href="${resetLink}" style="
          display: inline-block;
          padding: 12px 24px;
          background: #3498db;
          color: white;
          text-decoration: none;
          border-radius: 4px;
          font-weight: bold;
        ">Reset Password</a>
      </div>
      <p>If you didn't request this password reset, please ignore this email.</p>
      <p>Best regards,<br>WebNest Team</p>
    </div>
  `,

  subscription: (name, plan, price) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #2c3e50; text-align: center;">Subscription Confirmation</h1>
      <p>Hi ${name},</p>
      <p>Thank you for upgrading to WebNest ${plan} plan!</p>
      <div style="background: #f5f5f5; padding: 20px; margin: 20px 0;">
        <p><strong>Plan:</strong> ${plan}</p>
        <p><strong>Price:</strong> ${price}</p>
      </div>
      <p>Your subscription will automatically renew every month. You can manage your subscription from your account settings.</p>
      <p>Best regards,<br>WebNest Team</p>
    </div>
  `
};

const sendEmail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_EMAIL,
      to,
      subject,
      html
    });
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export { sendEmail, emailTemplates };
