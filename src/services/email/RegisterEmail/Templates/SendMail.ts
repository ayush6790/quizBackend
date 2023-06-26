import nodemailer from "nodemailer";
import * as fs from 'fs';
import * as path from 'path'

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com", // SMTP server hostname
  port: 587, // SMTP server port
  secure: false, // Use SSL/TLS
  auth: {
    user: process.env.WELCOME_REGISTER_EMAIL_USERNAME,
    pass: process.env.WELCOME_REGISTER_EMAIL_PASSWORD
  },
});

const templatePath = path.join(__dirname, 'Register_email_templates.html');

const template = fs.readFileSync(templatePath, 'utf8');

// Replace placeholders in the template with actual data
const personalizedTemplate = template.replace('{{name}}', 'Rahul');

// Create an email message
const message = {
    from: "welcome@knowledgeforcurious.com",
    to: "rahul52us@gmail.com",
    subject: "Hello, World!",
    html: personalizedTemplate,
  };

  // Send the email
  transporter.sendMail(message, (err, info) => {
    if (err) {
      console.error("Error sending email:", err);
    } else {
      console.log("Email sent:", info);
    }
  });
