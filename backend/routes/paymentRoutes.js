// backend/routes/paymentRoutes.js
import express from "express";
import razorpayInstance from "../config/razorpay.js";
import crypto from "crypto";
import Appointment from "../models/appointmentModel.js"; // adjust path to your model

const router = express.Router();

// ✅ Create Razorpay Order
router.post("/razorpay", async (req, res) => {
  try {
    const { amount, currency = "INR", receipt = "receipt#1" } = req.body;

    const options = {
      amount: amount * 100, // Razorpay expects paise
      currency,
      receipt,
      payment_capture: 1,
    };

    const order = await razorpayInstance.orders.create(options);

    // ✅ Return full order object
    res.json({ success: true, order });
  } catch (error) {
    console.error("Razorpay order error:", error);
    res.status(500).json({ success: false, message: "Payment initiation failed" });
  }
});

import sendEmail from "../config/nodemailer.js";

// Skip signature verification → directly update appointment
router.post("/verify", async (req, res) => {
  try {
    const { razorpay_payment_id, appointmentId } = req.body;

    if (!razorpay_payment_id || !appointmentId) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    // ✅ Mark as paid directly and get details for email
    const appointment = await Appointment.findByIdAndUpdate(appointmentId, {
      paymentStatus: "Paid",
      transactionId: razorpay_payment_id,
      status: "Confirmed", // optional: auto-confirm appointment
    }, { new: true }).populate("userId", "name email").populate("docId", "name fees email");

    if (appointment && appointment.userId) {
      try {
        // --- 1. Notification to Patient ---
        const patientSubject = `Payment Confirmed - ${appointment.docId.name}`;
        const patientHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1f2937;">
            <h2 style="color: #059669;">Payment Successful!</h2>
            <p>Dear ${appointment.userId.name},</p>
            <p>Your payment for your appointment with <strong>${appointment.docId.name}</strong> has been confirmed.</p>
            
            <div style="background-color: #f0fdf4; padding: 25px; border-radius: 12px; margin: 20px 0; border: 1px solid #d1fae5;">
              <h3 style="color: #065f46; margin-top: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Transaction Details:</h3>
              <p><strong>Appointment ID:</strong> ${appointmentId}</p>
              <p><strong>Transaction ID:</strong> ${razorpay_payment_id}</p>
              <p><strong>Amount Paid:</strong> Rs. ${appointment.docId.fees}</p>
              <p><strong>Payment Status:</strong> <span style="color: #059669; font-weight: bold;">PAID</span></p>
            </div>
            
            <p>Your appointment is now <strong>Confirmed</strong>. Please arrive 10 minutes before your scheduled time.</p>
            
            <p style="margin-top: 30px; border-top: 1px solid #e5e7eb; pt: 20px;">
              Best regards,<br>
              <strong>Appointly Team</strong>
            </p>
          </div>
        `;

        await sendEmail(appointment.userId.email, patientSubject, patientSubject, patientHtml);
        console.log(`✅ Payment confirmation email sent to patient: ${appointment.userId.email}`);

        // --- 2. Notification to Doctor ---
        if (appointment.docId && appointment.docId.email) {
          const doctorSubject = `Payment Received - Patient: ${appointment.userId.name}`;
          const doctorHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1f2937;">
              <h2 style="color: #2563eb;">New Payment Received</h2>
              <p>Dear ${appointment.docId.name},</p>
              <p>A payment has been successfully processed for an upcoming appointment.</p>
              
              <div style="background-color: #f8fafc; padding: 25px; border-radius: 12px; margin: 20px 0; border: 1px solid #e2e8f0;">
                <h3 style="color: #1e3a8a; margin-top: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Patient & Payment Info:</h3>
                <p><strong>Patient Name:</strong> ${appointment.userId.name}</p>
                <p><strong>Amount Received:</strong> Rs. ${appointment.docId.fees}</p>
                <p><strong>Transaction ID:</strong> ${razorpay_payment_id}</p>
                <p><strong>Date:</strong> ${appointment.slotDate}</p>
                <p><strong>Time:</strong> ${appointment.slotTime}</p>
              </div>
              
              <p>This appointment is now automatically <strong>Confirmed</strong> in your dashboard.</p>
              
              <p style="margin-top: 30px; border-top: 1px solid #e5e7eb; pt: 20px;">
                Best regards,<br>
                <strong>Appointly Team</strong>
              </p>
            </div>
          `;

          await sendEmail(appointment.docId.email, doctorSubject, doctorSubject, doctorHtml);
          console.log(`✅ Payment alert email sent to doctor: ${appointment.docId.email}`);
        }

      } catch (emailError) {
        console.error("❌ Failed to send emails:", emailError);
      }
    }

    return res.json({ success: true, message: "Payment marked as successful" });
  } catch (error) {
    console.error("Payment update error:", error);
    res.status(500).json({ success: false, message: "Payment update failed" });
  }
});

export default router;
