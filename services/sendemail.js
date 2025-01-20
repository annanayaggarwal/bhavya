const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config();

// Create transporter
const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    throw new Error('Email configuration missing. Please check your environment variables.');
  }

  return nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

// Send report email
const sendReportEmail = async (filePath, workerCount, timestamp) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"FactoryKaam" <${process.env.EMAIL_USER}>`,
      to: 'kshitij@factorykaam.com',
      cc: 'gaurav@factorykaam.com',
      subject: `Lenskart Worker Report - ${timestamp}`,
      html: `
        <p>Dear Admin,</p>
        <p>Please find attached the Lenskart worker report for the last 24 hours.</p>
        <p>Total workers in report: ${workerCount}</p>
        <p>Best Regards,<br>FactoryKaam Team</p>
      `,
      attachments: [{
        filename: path.basename(filePath),
        path: filePath,
        contentType: 'text/csv'
      }]
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully. Message ID:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

module.exports = {
  sendReportEmail
};
