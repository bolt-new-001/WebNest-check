import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD
  }
});

// Enhanced Email Templates with Modern Design
const emailTemplates = {
  verification: (otp, name) => `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email - WebNest</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; line-height: 1.6;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f8fafc; min-height: 100vh;">
        <tr>
          <td align="center" style="padding: 40px 20px;">
            <table cellpadding="0" cellspacing="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); overflow: hidden;">
              
              <!-- Header with Brand -->
              <tr>
                <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
                  <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; margin: 0 auto;">
                    <tr>
                      <td style="text-align: center;">
                        <div style="background: rgba(255,255,255,0.2); border-radius: 50%; width: 80px; height: 80px; margin: 0 auto 20px; position: relative;">
                          <img src="https://drive.google.com/uc?export=view&id=14i0ACRkJEP0hKzguwtxlRHbiIzhCgxtw" alt="WebNest Logo" style="width: 60px; height: 60px; border-radius: 50%; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);" />
                        </div>
                        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">Verify Your Email</h1>
                        <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 16px;">Almost there! Let's confirm it's really you</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Content -->
              <tr>
                <td style="padding: 40px 32px;">
                  <div style="text-align: center;">
                    <h2 style="color: #1a202c; margin: 0 0 16px; font-size: 24px; font-weight: 600;">Hello ${name}! 👋</h2>
                    <p style="color: #4a5568; margin: 0 0 32px; font-size: 16px; line-height: 1.7;">
                      Welcome to <strong style="color: #667eea;">WebNest</strong>! We're excited to have you on board. 
                      Please verify your email address using the code below:
                    </p>
                    
                    <!-- OTP Box -->
                    <div style="background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); border: 2px dashed #667eea; border-radius: 12px; padding: 24px; margin: 32px 0; position: relative;">
                      <div style="background: #667eea; border-radius: 8px; padding: 16px 24px; display: inline-block;">
                        <span style="color: #ffffff; font-size: 32px; font-weight: 700; letter-spacing: 4px; font-family: 'Courier New', monospace;">${otp}</span>
                      </div>
                      <p style="color: #718096; margin: 12px 0 0; font-size: 14px;">
                        ⏱️ This code expires in <strong>15 minutes</strong>
                      </p>
                    </div>

                    <div style="background: #f0f8ff; border: 1px solid #bee3f8; border-radius: 8px; padding: 16px; margin: 24px 0;">
                      <p style="color: #2b6cb0; margin: 0; font-size: 14px;">
                        <strong>💡 Pro Tip:</strong> Copy and paste the code to avoid typos!
                      </p>
                    </div>
                  </div>
                </td>
              </tr>

              <!-- Security Notice -->
              <tr>
                <td style="background: #fafafa; padding: 24px 32px; border-top: 1px solid #e2e8f0;">
                  <div style="text-align: center;">
                    <p style="color: #718096; margin: 0; font-size: 14px; line-height: 1.6;">
                      🔒 <strong>Security Notice:</strong> If you didn't create an account with WebNest, 
                      please ignore this email. Your account won't be created without email verification.
                    </p>
                  </div>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background: #1a202c; padding: 32px; text-align: center;">
                  <p style="color: #a0aec0; margin: 0 0 16px; font-size: 16px; font-weight: 600;">
                    Best regards,<br>The WebNest Team
                  </p>
                  <div style="border-top: 1px solid #2d3748; padding-top: 16px; margin-top: 16px;">
                    <p style="color: #718096; margin: 0; font-size: 12px;">
                      © 2024 WebNest. All rights reserved.<br>
                      This is an automated message, please do not reply.
                    </p>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `,

  passwordReset: (resetLink, name) => `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password - WebNest</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; line-height: 1.6;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f8fafc; min-height: 100vh;">
        <tr>
          <td align="center" style="padding: 40px 20px;">
            <table cellpadding="0" cellspacing="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); overflow: hidden;">
              
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 40px 20px; text-align: center;">
                  <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; margin: 0 auto;">
                    <tr>
                      <td style="text-align: center;">
                        <div style="background: rgba(255,255,255,0.2); border-radius: 50%; width: 80px; height: 80px; margin: 0 auto 20px; position: relative;">
                          <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 36px;">🔐</div>
                        </div>
                        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">Password Reset</h1>
                        <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 16px;">Don't worry, we've got you covered</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Content -->
              <tr>
                <td style="padding: 40px 32px;">
                  <div style="text-align: center;">
                    <h2 style="color: #1a202c; margin: 0 0 16px; font-size: 24px; font-weight: 600;">Hello ${name}! 👋</h2>
                    <p style="color: #4a5568; margin: 0 0 24px; font-size: 16px; line-height: 1.7;">
                      We received a request to reset your password for your <strong style="color: #f5576c;">WebNest</strong> account.
                      No worries - it happens to the best of us!
                    </p>
                    
                    <div style="background: #fff5f5; border: 1px solid #fed7d7; border-radius: 12px; padding: 20px; margin: 24px 0;">
                      <p style="color: #c53030; margin: 0; font-size: 14px;">
                        <strong>⚠️ Security Alert:</strong> This reset link will expire in 1 hour for your security.
                      </p>
                    </div>

                    <!-- Reset Button -->
                    <div style="margin: 32px 0;">
                      <a href="${resetLink}" style="
                        display: inline-block;
                        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                        color: #ffffff;
                        text-decoration: none;
                        padding: 16px 32px;
                        border-radius: 50px;
                        font-weight: 600;
                        font-size: 16px;
                        box-shadow: 0 8px 20px rgba(245, 87, 108, 0.3);
                        transition: all 0.3s ease;
                      ">
                        🔑 Reset My Password
                      </a>
                    </div>

                    <div style="background: #f0f8ff; border: 1px solid #bee3f8; border-radius: 8px; padding: 16px; margin: 24px 0;">
                      <p style="color: #2b6cb0; margin: 0; font-size: 14px;">
                        <strong>Can't click the button?</strong> Copy and paste this link:<br>
                        <code style="background: #e2e8f0; padding: 4px 8px; border-radius: 4px; font-size: 12px; word-break: break-all;">${resetLink}</code>
                      </p>
                    </div>
                  </div>
                </td>
              </tr>

              <!-- Security Tips -->
              <tr>
                <td style="background: #fafafa; padding: 24px 32px; border-top: 1px solid #e2e8f0;">
                  <div style="text-align: left;">
                    <h3 style="color: #2d3748; margin: 0 0 12px; font-size: 16px; font-weight: 600;">🛡️ Security Tips:</h3>
                    <ul style="color: #718096; margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.6;">
                      <li>Use a strong, unique password</li>
                      <li>Don't share your password with anyone</li>
                      <li>Enable two-factor authentication if available</li>
                      <li>If you didn't request this, please contact our support team</li>
                    </ul>
                  </div>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background: #1a202c; padding: 32px; text-align: center;">
                  <p style="color: #a0aec0; margin: 0 0 16px; font-size: 16px; font-weight: 600;">
                    Best regards,<br>The WebNest Security Team
                  </p>
                  <div style="border-top: 1px solid #2d3748; padding-top: 16px; margin-top: 16px;">
                    <p style="color: #718096; margin: 0; font-size: 12px;">
                      © 2024 WebNest. All rights reserved.<br>
                      This is an automated security message, please do not reply.
                    </p>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `,

  subscription: (name, plan, price, features = []) => `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to ${plan} - WebNest</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; line-height: 1.6;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f8fafc; min-height: 100vh;">
        <tr>
          <td align="center" style="padding: 40px 20px;">
            <table cellpadding="0" cellspacing="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); overflow: hidden;">
              
              <!-- Celebration Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); padding: 40px 20px; text-align: center; position: relative;">
                  <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; margin: 0 auto;">
                    <tr>
                      <td style="text-align: center; position: relative;">
                        <div style="position: absolute; top: -20px; left: 20px; font-size: 24px;">🎉</div>
                        <div style="position: absolute; top: -20px; right: 20px; font-size: 24px;">🚀</div>
                        <div style="position: absolute; bottom: -20px; left: 30px; font-size: 20px;">⭐</div>
                        <div style="position: absolute; bottom: -20px; right: 30px; font-size: 20px;">💎</div>
                        
                        <div style="background: rgba(255,255,255,0.2); border-radius: 50%; width: 80px; height: 80px; margin: 0 auto 20px; position: relative;">
                          <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 36px;">🎯</div>
                        </div>
                        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">Subscription Confirmed!</h1>
                        <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 16px;">Welcome to the ${plan} experience</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Content -->
              <tr>
                <td style="padding: 40px 32px;">
                  <div style="text-align: center;">
                    <h2 style="color: #1a202c; margin: 0 0 16px; font-size: 24px; font-weight: 600;">Congratulations ${name}! 🎊</h2>
                    <p style="color: #4a5568; margin: 0 0 32px; font-size: 16px; line-height: 1.7;">
                      You've successfully upgraded to <strong style="color: #4facfe;">WebNest ${plan}</strong>! 
                      Get ready to unlock powerful features and take your experience to the next level.
                    </p>
                    
                    <!-- Subscription Details Card -->
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 16px; padding: 24px; margin: 32px 0; color: #ffffff;">
                      <h3 style="margin: 0 0 16px; font-size: 20px; font-weight: 600;">📋 Subscription Details</h3>
                      <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                          <td style="padding: 8px 0; text-align: left; color: rgba(255,255,255,0.9);">Plan:</td>
                          <td style="padding: 8px 0; text-align: right; font-weight: 600;">${plan}</td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0; text-align: left; color: rgba(255,255,255,0.9);">Price:</td>
                          <td style="padding: 8px 0; text-align: right; font-weight: 600; font-size: 18px;">${price}</td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0; text-align: left; color: rgba(255,255,255,0.9);">Billing:</td>
                          <td style="padding: 8px 0; text-align: right; font-weight: 600;">Monthly</td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0; text-align: left; color: rgba(255,255,255,0.9);">Status:</td>
                          <td style="padding: 8px 0; text-align: right;">
                            <span style="background: #22c55e; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">
                              ✓ Active
                            </span>
                          </td>
                        </tr>
                      </table>
                    </div>

                    <!-- Features Unlocked -->
                    <div style="background: #f0fdf4; border: 2px solid #22c55e; border-radius: 12px; padding: 24px; margin: 24px 0; text-align: left;">
                      <h3 style="color: #15803d; margin: 0 0 16px; font-size: 18px; font-weight: 600; text-align: center;">
                        🎁 Features Unlocked
                      </h3>
                      <div style="display: grid; gap: 8px;">
                        <div style="display: flex; align-items: center; color: #166534;">
                          <span style="margin-right: 8px;">✅</span> Unlimited projects
                        </div>
                        <div style="display: flex; align-items: center; color: #166534;">
                          <span style="margin-right: 8px;">✅</span> Priority customer support
                        </div>
                        <div style="display: flex; align-items: center; color: #166534;">
                          <span style="margin-right: 8px;">✅</span> Advanced analytics
                        </div>
                        <div style="display: flex; align-items: center; color: #166534;">
                          <span style="margin-right: 8px;">✅</span> Custom integrations
                        </div>
                        <div style="display: flex; align-items: center; color: #166534;">
                          <span style="margin-right: 8px;">✅</span> Enhanced security features
                        </div>
                      </div>
                    </div>

                    <!-- Quick Actions -->
                    <div style="margin: 32px 0;">
                      <h3 style="color: #1a202c; margin: 0 0 16px; font-size: 18px; font-weight: 600;">🚀 Quick Actions</h3>
                      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                        <a href="#" style="
                          display: block;
                          background: #f8fafc;
                          border: 2px solid #e2e8f0;
                          border-radius: 8px;
                          padding: 16px;
                          text-decoration: none;
                          color: #4a5568;
                          font-weight: 600;
                          text-align: center;
                          transition: all 0.3s ease;
                        ">
                          📊 View Dashboard
                        </a>
                        <a href="#" style="
                          display: block;
                          background: #f8fafc;
                          border: 2px solid #e2e8f0;
                          border-radius: 8px;
                          padding: 16px;
                          text-decoration: none;
                          color: #4a5568;
                          font-weight: 600;
                          text-align: center;
                          transition: all 0.3s ease;
                        ">
                          ⚙️ Manage Subscription
                        </a>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>

              <!-- Billing Info -->
              <tr>
                <td style="background: #fafafa; padding: 24px 32px; border-top: 1px solid #e2e8f0;">
                  <div style="text-align: center;">
                    <p style="color: #718096; margin: 0 0 12px; font-size: 14px; line-height: 1.6;">
                      💳 <strong>Auto-renewal:</strong> Your subscription will automatically renew monthly. 
                      You can cancel or modify your plan anytime from your account settings.
                    </p>
                    <p style="color: #4a5568; margin: 0; font-size: 14px; font-weight: 600;">
                      Questions? Our support team is here to help 24/7! 💬
                    </p>
                  </div>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background: #1a202c; padding: 32px; text-align: center;">
                  <p style="color: #a0aec0; margin: 0 0 16px; font-size: 16px; font-weight: 600;">
                    Thank you for choosing WebNest!<br>
                    <span style="color: #4facfe;">The WebNest Team</span> 💙
                  </p>
                  <div style="border-top: 1px solid #2d3748; padding-top: 16px; margin-top: 16px;">
                    <p style="color: #718096; margin: 0; font-size: 12px;">
                      © 2024 WebNest. All rights reserved.<br>
                      This is a subscription confirmation, please keep for your records.
                    </p>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `,

  // Bonus: Welcome Email Template
  welcome: (name, dashboardLink) => `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to WebNest!</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; line-height: 1.6;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f8fafc; min-height: 100vh;">
        <tr>
          <td align="center" style="padding: 40px 20px;">
            <table cellpadding="0" cellspacing="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); overflow: hidden;">
              
              <!-- Welcome Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%); padding: 40px 20px; text-align: center;">
                  <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; margin: 0 auto;">
                    <tr>
                      <td style="text-align: center;">
                        <div style="font-size: 48px; margin-bottom: 16px;">🎉</div>
                        <h1 style="color: #1a202c; margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">Welcome to WebNest!</h1>
                        <p style="color: #4a5568; margin: 8px 0 0; font-size: 18px;">Your journey to amazing web experiences starts now</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Content -->
              <tr>
                <td style="padding: 40px 32px; text-align: center;">
                  <h2 style="color: #1a202c; margin: 0 0 16px; font-size: 24px; font-weight: 600;">Hello ${name}! 👋</h2>
                  <p style="color: #4a5568; margin: 0 0 32px; font-size: 16px; line-height: 1.7;">
                    We're absolutely thrilled to have you as part of the <strong style="color: #667eea;">WebNest</strong> family! 
                    You're now ready to build something incredible.
                  </p>
                  
                  <div style="margin: 32px 0;">
                    <a href="${dashboardLink}" style="
                      display: inline-block;
                      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                      color: #ffffff;
                      text-decoration: none;
                      padding: 16px 32px;
                      border-radius: 50px;
                      font-weight: 600;
                      font-size: 16px;
                      box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
                    ">
                      🚀 Get Started Now
                    </a>
                  </div>

                  <!-- Getting Started Steps -->
                  <div style="background: #f8fafc; border-radius: 12px; padding: 24px; margin: 32px 0; text-align: left;">
                    <h3 style="color: #1a202c; margin: 0 0 20px; font-size: 18px; font-weight: 600; text-align: center;">
                      🎯 Quick Start Guide
                    </h3>
                    <div style="display: grid; gap: 16px;">
                      <div style="display: flex; align-items: center; padding: 12px; background: #ffffff; border-radius: 8px; border-left: 4px solid #667eea;">
                        <span style="font-size: 24px; margin-right: 16px;">1️⃣</span>
                        <div>
                          <strong style="color: #1a202c;">Complete your profile</strong>
                          <p style="color: #718096; margin: 4px 0 0; font-size: 14px;">Add your details to personalize your experience</p>
                        </div>
                      </div>
                      <div style="display: flex; align-items: center; padding: 12px; background: #ffffff; border-radius: 8px; border-left: 4px solid #48bb78;">
                        <span style="font-size: 24px; margin-right: 16px;">2️⃣</span>
                        <div>
                          <strong style="color: #1a202c;">Create your first project</strong>
                          <p style="color: #718096; margin: 4px 0 0; font-size: 14px;">Start building something amazing today</p>
                        </div>
                      </div>
                      <div style="display: flex; align-items: center; padding: 12px; background: #ffffff; border-radius: 8px; border-left: 4px solid #ed8936;">
                        <span style="font-size: 24px; margin-right: 16px;">3️⃣</span>
                        <div>
                          <strong style="color: #1a202c;">Explore our features</strong>
                          <p style="color: #718096; margin: 4px 0 0; font-size: 14px;">Discover all the tools at your disposal</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background: #1a202c; padding: 32px; text-align: center;">
                  <p style="color: #a0aec0; margin: 0 0 16px; font-size: 16px; font-weight: 600;">
                    Ready to build the future?<br>
                    <span style="color: #667eea;">The WebNest Team</span> 💜
                  </p>
                  <div style="border-top: 1px solid #2d3748; padding-top: 16px; margin-top: 16px;">
                    <p style="color: #718096; margin: 0; font-size: 12px;">
                      © 2024 WebNest. All rights reserved.<br>
                      Need help? Contact us at support@webnest.com
                    </p>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `,

  // Bonus: Account Suspension/Warning Email
  accountWarning: (name, reason, actionRequired) => `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Important Account Notice - WebNest</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; line-height: 1.6;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f8fafc; min-height: 100vh;">
        <tr>
          <td align="center" style="padding: 40px 20px;">
            <table cellpadding="0" cellspacing="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); overflow: hidden;">
              
              <!-- Warning Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #ff6b6b 0%, #ffa726 100%); padding: 40px 20px; text-align: center;">
                  <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; margin: 0 auto;">
                    <tr>
                      <td style="text-align: center;">
                        <div style="background: rgba(255,255,255,0.2); border-radius: 50%; width: 80px; height: 80px; margin: 0 auto 20px; position: relative;">
                          <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 36px;">⚠️</div>
                        </div>
                        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">Account Notice</h1>
                        <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 16px;">Immediate attention required</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Content -->
              <tr>
                <td style="padding: 40px 32px;">
                  <div style="text-align: center;">
                    <h2 style="color: #1a202c; margin: 0 0 16px; font-size: 24px; font-weight: 600;">Hello ${name},</h2>
                    <p style="color: #4a5568; margin: 0 0 24px; font-size: 16px; line-height: 1.7;">
                      We need to bring an important matter regarding your <strong style="color: #ff6b6b;">WebNest</strong> account to your attention.
                    </p>
                    
                    <div style="background: #fef2f2; border: 2px solid #fecaca; border-radius: 12px; padding: 20px; margin: 24px 0; text-align: left;">
                      <h3 style="color: #dc2626; margin: 0 0 12px; font-size: 16px; font-weight: 600;">Issue Details:</h3>
                      <p style="color: #991b1b; margin: 0; font-size: 14px; line-height: 1.6;">
                        ${reason}
                      </p>
                    </div>

                    <div style="background: #fffbeb; border: 2px solid #fed7aa; border-radius: 12px; padding: 20px; margin: 24px 0; text-align: left;">
                      <h3 style="color: #d97706; margin: 0 0 12px; font-size: 16px; font-weight: 600;">Required Action:</h3>
                      <p style="color: #92400e; margin: 0; font-size: 14px; line-height: 1.6;">
                        ${actionRequired}
                      </p>
                    </div>
                  </div>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background: #1a202c; padding: 32px; text-align: center;">
                  <p style="color: #a0aec0; margin: 0 0 16px; font-size: 16px; font-weight: 600;">
                    WebNest Security Team
                  </p>
                  <div style="border-top: 1px solid #2d3748; padding-top: 16px; margin-top: 16px;">
                    <p style="color: #718096; margin: 0; font-size: 12px;">
                      © 2024 WebNest. All rights reserved.<br>
                      This is an important security notice.
                    </p>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `
};

// Enhanced Email Service with Error Handling and Analytics
const sendEmail = async (to, subject, html, options = {}) => {
  const { 
    priority = 'normal',
    replyTo = process.env.SMTP_EMAIL,
    trackOpens = false,
    trackClicks = false 
  } = options;

  try {
    const mailOptions = {
      from: {
        name: 'WebNest',
        address: process.env.SMTP_EMAIL
      },
      to,
      subject,
      html,
      replyTo,
      priority,
      headers: {
        'X-Mailer': 'WebNest Email Service v2.0',
        'X-Priority': priority === 'high' ? '1' : priority === 'low' ? '5' : '3'
      }
    };

    // Add tracking if enabled
    if (trackOpens || trackClicks) {
      mailOptions.headers['X-Track-Opens'] = trackOpens;
      mailOptions.headers['X-Track-Clicks'] = trackClicks;
    }

    const info = await transporter.sendMail(mailOptions);
    
    // Log success (you can integrate with your logging service)
    console.log(`✅ Email sent successfully to ${to}:`, {
      messageId: info.messageId,
      subject,
      timestamp: new Date().toISOString()
    });
    
    return {
      success: true,
      messageId: info.messageId,
      info
    };
    
  } catch (error) {
    // Enhanced error logging
    console.error(`❌ Failed to send email to ${to}:`, {
      error: error.message,
      subject,
      timestamp: new Date().toISOString(),
      stack: error.stack
    });
    
    throw {
      success: false,
      error: error.message,
      code: error.code || 'EMAIL_SEND_FAILED'
    };
  }
};

// Utility function to send specific email types
const emailService = {
  // Send verification email
  sendVerification: async (to, name, otp, options = {}) => {
    const subject = '🔐 Verify Your Email - WebNest';
    const html = emailTemplates.verification(otp, name);
    return await sendEmail(to, subject, html, { priority: 'high', ...options });
  },

  // Send password reset email
  sendPasswordReset: async (to, name, resetLink, options = {}) => {
    const subject = '🔑 Reset Your Password - WebNest';
    const html = emailTemplates.passwordReset(resetLink, name);
    return await sendEmail(to, subject, html, { priority: 'high', ...options });
  },

  // Send subscription confirmation
  sendSubscription: async (to, name, plan, price, features, options = {}) => {
    const subject = `🎉 Welcome to ${plan} - WebNest`;
    const html = emailTemplates.subscription(name, plan, price, features);
    return await sendEmail(to, subject, html, { priority: 'normal', ...options });
  },

  // Send welcome email
  sendWelcome: async (to, name, dashboardLink, options = {}) => {
    const subject = '🚀 Welcome to WebNest - Let\'s Get Started!';
    const html = emailTemplates.welcome(name, dashboardLink);
    return await sendEmail(to, subject, html, { priority: 'normal', ...options });
  },

  // Send account warning
  sendAccountWarning: async (to, name, reason, actionRequired, options = {}) => {
    const subject = '⚠️ Important Account Notice - WebNest';
    const html = emailTemplates.accountWarning(name, reason, actionRequired);
    return await sendEmail(to, subject, html, { priority: 'high', ...options });
  },

  // Bulk email sender with rate limiting
  sendBulk: async (emails, delayMs = 1000) => {
    const results = [];
    
    for (let i = 0; i < emails.length; i++) {
      const { to, subject, html, options } = emails[i];
      
      try {
        const result = await sendEmail(to, subject, html, options);
        results.push({ to, success: true, result });
        
        // Rate limiting delay
        if (i < emails.length - 1) {
          await new Promise(resolve => setTimeout(resolve, delayMs));
        }
        
      } catch (error) {
        results.push({ to, success: false, error });
      }
    }
    
    return results;
  }
};

// Export everything
export { 
  sendEmail, 
  emailTemplates, 
  emailService 
};