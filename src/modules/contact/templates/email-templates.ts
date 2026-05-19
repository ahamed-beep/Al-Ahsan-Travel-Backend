// utils/email-templates.ts

export const getUserConfirmationEmail = (name: string) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Umrah Inquiry Received</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          background: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .header {
          background: #1C398E;
          padding: 30px 20px;
          text-align: center;
        }
        .header h1 {
          color: #ffffff;
          margin: 0;
          font-size: 24px;
        }
        .content {
          padding: 30px;
        }
        .greeting {
          font-size: 18px;
          color: #333;
          margin-bottom: 20px;
        }
        .message-box {
          background: #F9FAFB;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
          border-left: 4px solid #1C398E;
        }
        .footer {
          background: #F9FAFB;
          padding: 20px;
          text-align: center;
          font-size: 12px;
          color: #666;
        }
        .button {
          background: #1C398E;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 6px;
          display: inline-block;
          margin: 20px 0;
        }
        .social-icons {
          margin-top: 20px;
        }
        .social-icons a {
          margin: 0 10px;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🕋 Al-Ahsan Travels</h1>
        </div>
        <div class="content">
          <div class="greeting">
            Assalamu Alaikum <strong>${name}</strong>,
          </div>
          <p>JazakAllah Khair for contacting Al-Ahsan Travels!</p>
          <p>We have received your Umrah inquiry and our team will get back to you within <strong>1-2 hours</strong>.</p>
          
          <div class="message-box">
            <p style="margin: 0; font-weight: bold;">📋 Your Inquiry Summary:</p>
            <p style="margin: 10px 0 0 0; font-size: 14px; color: #555;">
              We have noted your requirements and will provide you with the best Umrah packages tailored to your needs.
            </p>
          </div>

          <p>In the meantime, you can:</p>
          <ul>
            <li>📞 Call us at: <strong>+44 XXX XXX XXX</strong></li>
            <li>💬 WhatsApp us: <strong>+44 XXX XXX XXX</strong></li>
            <li>📧 Email us: <strong>info@alahsantravels.com</strong></li>
          </ul>

          <center>
            <a href="https://wa.me/447123456789" class="button">📱 Chat on WhatsApp</a>
          </center>
        </div>
        <div class="footer">
          <p>© 2024 Al-Ahsan Travels. All rights reserved.</p>
          <p>📍 London, United Kingdom</p>
          <div class="social-icons">
            <a href="#">Facebook</a> | <a href="#">Instagram</a> | <a href="#">Twitter</a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const getAdminNotificationEmail = (data: {
  fullName: string;
  email: string;
  phone: string;
  travelDate?: string;
  message: string;
}) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Umrah Inquiry Received</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          background: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .header {
          background: #dc2626;
          padding: 30px 20px;
          text-align: center;
        }
        .header h1 {
          color: #ffffff;
          margin: 0;
          font-size: 24px;
        }
        .content {
          padding: 30px;
        }
        .info-box {
          background: #F9FAFB;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
        }
        .info-row {
          padding: 10px 0;
          border-bottom: 1px solid #e5e7eb;
        }
        .label {
          font-weight: bold;
          color: #374151;
          width: 120px;
          display: inline-block;
        }
        .value {
          color: #111827;
        }
        .footer {
          background: #F9FAFB;
          padding: 20px;
          text-align: center;
          font-size: 12px;
          color: #666;
        }
        .button {
          background: #1C398E;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 6px;
          display: inline-block;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔔 New Umrah Inquiry</h1>
        </div>
        <div class="content">
          <p><strong>A new Umrah inquiry has been received!</strong></p>
          
          <div class="info-box">
            <div class="info-row">
              <span class="label">👤 Name:</span>
              <span class="value">${data.fullName}</span>
            </div>
            <div class="info-row">
              <span class="label">📧 Email:</span>
              <span class="value">${data.email}</span>
            </div>
            <div class="info-row">
              <span class="label">📞 Phone:</span>
              <span class="value">${data.phone}</span>
            </div>
            ${data.travelDate ? `
            <div class="info-row">
              <span class="label">📅 Travel Date:</span>
              <span class="value">${data.travelDate}</span>
            </div>
            ` : ''}
            <div class="info-row">
              <span class="label">💬 Message:</span>
              <span class="value">${data.message}</span>
            </div>
          </div>

          <p>Please respond to this inquiry as soon as possible.</p>

          <center>
            <a href="${process.env.ADMIN_PANEL_URL}/contacts" class="button">📋 View in Admin Panel</a>
          </center>

          <p style="margin-top: 20px; font-size: 12px; color: #666;">
            You can also reply directly to: <strong>${data.email}</strong>
          </p>
        </div>
        <div class="footer">
          <p>Al-Ahsan Travels - Admin Notification</p>
          <p>Sent at: ${new Date().toLocaleString()}</p>
        </div>
      </div>
    </body>
    </html>
  `;
};