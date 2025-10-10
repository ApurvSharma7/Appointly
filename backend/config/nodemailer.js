import nodemailer from "nodemailer";

// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "quickcourtt@gmail.com",
    pass: "gmlezjxuvkxomlmo", // Gmail App Password
  },
});

// Wrap in an async IIFE so we can use await.
const sendEmail = async ( to , subject , text , html) => {
  const info = await transporter.sendMail({
    from: "quickcourtt@gmail.com",
    to: to,
    subject: subject,
    text: text, // plain‑text body
    html: html, // HTML body
  });

  console.log("Message sent:", info.messageId);
}; 
 
export default sendEmail