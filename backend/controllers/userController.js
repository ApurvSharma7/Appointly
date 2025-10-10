// controllers/authUser.js
import jwt from "jsonwebtoken";;
import dotenv from "dotenv";
import Razorpay from "razorpay";
import Stripe from "stripe";
import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";

import User from "../models/userModel.js";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import sendEmail from "../config/nodemailer.js";

dotenv.config();

// ================== Helpers ==================

const signToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

// @desc Register user
// @route POST /api/user/register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ success: false, message: "Email already registered" });
    }

    const user = await User.create({ name, email, password });

    const token = signToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: { _id: user._id, name: user.name, email: user.email, image: user.image },
    });
  } catch (err) {
    console.error("❌ Register error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc Login user
// @route POST /api/user/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = signToken(user._id);

    res.json({
      success: true,
      token,
      user: { _id: user._id, name: user.name, email: user.email, image: user.image },
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc Get user profile
// @route GET /api/user/profile
// @access Private
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, user });
  } catch (err) {
    console.error("❌ Profile error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ================== Multer Setup for Profile Image ==================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(process.cwd(), "uploads/profile");
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
export const uploadProfileImage = multer({ storage });

// ================== Profile Update Controller ==================
export const updateProfile = async (req, res) => {
  try {
    console.log("📩 Incoming profile update:", req.body);

    // ✅ Check if middleware sets req.userId or req.user.id
    const userId = req.userId || (req.user && req.user.id);
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized: No userId found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const { name, phone, address, gender, dob } = req.body;

    if (name) user.name = name;
    if (phone) user.phone = phone;

    // ✅ Safe address parsing
    if (address) {
      try {
        user.address = typeof address === "string" ? JSON.parse(address) : address;
      } catch (err) {
        console.error("❌ Address parsing failed:", err.message);
        user.address = address; // fallback
      }
    }

    if (gender) user.gender = gender;
    if (dob) user.dob = dob;

    // ✅ Handle image update
    if (req.file) {
      if (user.image) {
        const oldImagePath = path.join(process.cwd(), user.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      user.image = `/uploads/profile/${req.file.filename}`;
    }

    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (err) {
    console.error("❌ Update profile error:", err);
    res.status(500).json({
      success: false,
      message: "Server error updating profile",
      error: err.message,
    });
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.json({ success: true, message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Logout failed" });
  }
};

// ================== Appointment Controllers =================
// Book appointment
export const bookAppointment = async (req, res) => {
  try {
    const { docId, slotDate, slotTime } = req.body;
    const userId = req.userId; // ✅ 

    // Validate required fields
    if (!docId || !slotDate || !slotTime) {
      return res.status(400).json({ 
        success: false, 
        message: "Doctor ID, slot date, and slot time are required" 
      });
    }

    // Check doctor exists and is available
    const doctor = await doctorModel.findById(docId);
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    if (!doctor.available) {
      return res.status(400).json({ success: false, message: "Doctor is not available" });
    }

    // Get user details for email
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Check if user already has an appointment at this time
    const userExistingAppointment = await appointmentModel.findOne({ 
      userId, 
      slotDate, 
      slotTime,
      status: { $in: ["Pending", "Confirmed"] }
    });
    if (userExistingAppointment) {
      return res.status(400).json({ 
        success: false, 
        message: "You already have an appointment at this time" 
      });
    }

    // Check if slot already booked by any user
    const existingAppointment = await appointmentModel.findOne({ 
      docId, 
      slotDate, 
      slotTime,
      status: { $in: ["Pending", "Confirmed"] }
    });
    if (existingAppointment) {
      return res.status(400).json({ success: false, message: "This slot is already booked" });
    }

    // Validate slot date is not in the past
    const appointmentDate = new Date(slotDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (appointmentDate < today) {
      return res.status(400).json({ 
        success: false, 
        message: "Cannot book appointments for past dates" 
      });
    }

    // Create appointment
    const appointment = await appointmentModel.create({
      userId,
      docId,
      slotDate,
      slotTime,
      status: "Pending",
    });

    // Send email notification to doctor
    try {
      const emailSubject = `New Appointment Booking - ${doctor.name}`;
      const emailText = `
Dear Dr. ${doctor.name},

A new appointment has been booked with you:

Patient Details:
- Name: ${user.name}
- Email: ${user.email}
- Phone: ${user.phone || 'Not provided'}

Appointment Details:
- Date: ${slotDate}
- Time: ${slotTime}
- Status: Pending

Please log in to your admin panel to confirm or manage this appointment.

Best regards,
Medigo Team
      `;

      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">New Appointment Booking</h2>
          
          <p>Dear Dr. ${doctor.name},</p>
          
          <p>A new appointment has been booked with you:</p>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e40af; margin-top: 0;">Patient Details:</h3>
            <p><strong>Name:</strong> ${user.name}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Phone:</strong> ${user.phone || 'Not provided'}</p>
          </div>
          
          <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e40af; margin-top: 0;">Appointment Details:</h3>
            <p><strong>Date:</strong> ${slotDate}</p>
            <p><strong>Time:</strong> ${slotTime}</p>
            <p><strong>Status:</strong> <span style="color: #f59e0b;">Pending</span></p>
          </div>
          
          <p>Please log in to your admin panel to confirm or manage this appointment.</p>
          
          <p style="margin-top: 30px;">Best regards,<br>Medigo Team</p>
        </div>
      `;

      await sendEmail(doctor.email, emailSubject, emailText, emailHtml);
      console.log(`✅ Appointment email sent to Dr. ${doctor.name} (${doctor.email})`);
    } catch (emailError) {
      console.error("❌ Failed to send appointment email:", emailError);
      // Don't fail the appointment booking if email fails
    }

    res.json({
      success: true,
      message: "Appointment booked successfully",
      data: appointment,
    });
  } catch (err) {
    console.error("❌ Book appointment error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get user's appointments
export const getUserAppointments = async (req, res) => {
  try {
    const userId = req.userId; // ✅ correct field
    const appointments = await appointmentModel
      .find({ userId })
      .populate("docId", "name speciality image"); // ✅ populate useful fields

    res.json({ success: true, data: appointments });
  } catch (err) {
    console.error("❌ Get appointments error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Cancel an appointment
export const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    // ✅ Validate input
    if (!appointmentId) {
      return res
        .status(400)
        .json({ success: false, message: "Appointment ID is required" });
    }

    // ✅ Ensure req.userId exists (from auth middleware)
    if (!req.userId) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: user not logged in" });
    }

    console.log("Attempting to cancel appointment:", appointmentId, "for user:", req.userId);

    // ✅ Find appointment and check ownership
    const appointment = await appointmentModel.findById(appointmentId);
    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });
    }

    if (appointment.userId.toString() !== req.userId.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "You are not authorized to cancel this appointment" });
    }

    if (appointment.status === "Cancelled") {
      return res
        .status(400)
        .json({ success: false, message: "Appointment is already cancelled" });
    }

    // ✅ Update appointment status
    appointment.status = "Cancelled";
    await appointment.save();

    return res.status(200).json({
      success: true,
      message: "Appointment cancelled successfully",
      appointment,
    });
  } catch (error) {
    console.error("Cancel appointment error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ================== Payments: Razorpay ==================

export const paymentRazorpay = async (req, res) => {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: req.body.amount * 100, // INR → paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json({ success: true, order });
  } catch (err) {
    console.error("Razorpay order error:", err);
    res.status(500).json({ success: false, message: "Payment initiation failed" });
  }
};

export const verifyRazorpay = async (req, res) => {
  try {
    const {
      appointmentId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      // ✅ Update appointment payment
      await Appointment.findByIdAndUpdate(appointmentId, {
        paymentStatus: "Paid",
        transactionId: razorpay_payment_id,
      });

      return res.json({ success: true, message: "Payment verified" });
    } else {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }
  } catch (err) {
    console.error("Verify Razorpay error:", err);
    res.status(500).json({ success: false, message: "Verification failed" });
  }
};

// ================== Payments: Stripe ==================
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const paymentStripe = async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: { name: req.body.productName || "Doctor Appointment" },
            unit_amount: req.body.amount * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/payment-success`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-failed`,
    });

    res.json({ success: true, id: session.id });
  } catch (err) {
    console.error("Stripe payment error:", err);
    res.status(500).json({ success: false, message: "Stripe payment failed" });
  }
};

export const stripeSuccess = async (_, res) => {
  res.json({ success: true, message: "Payment successful" });
};

// Get available slots for a doctor
export const getDoctorSlots = async (req, res) => {
  try {
    const { docId } = req.params;
    
    if (!docId) {
      return res.status(400).json({ 
        success: false, 
        message: "Doctor ID is required" 
      });
    }

    // Check doctor exists
    const doctor = await doctorModel.findById(docId);
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    // Get all booked appointments for this doctor
    const bookedAppointments = await appointmentModel.find({
      docId,
      status: { $in: ["Pending", "Confirmed"] }
    }).select('slotDate slotTime');

    // Create a map of booked slots
    const bookedSlots = {};
    bookedAppointments.forEach(appointment => {
      const slotKey = `${appointment.slotDate}_${appointment.slotTime}`;
      bookedSlots[slotKey] = true;
    });

    res.json({
      success: true,
      data: {
        doctor: {
          _id: doctor._id,
          name: doctor.name,
          speciality: doctor.speciality,
          available: doctor.available,
          fees: doctor.fees,
          image: doctor.image,
          averageRating: doctor.averageRating,
          totalRatings: doctor.totalRatings
        },
        bookedSlots
      }
    });
  } catch (err) {
    console.error("❌ Get doctor slots error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ================== Rating Controllers ==================

// Rate doctor after appointment
export const rateDoctor = async (req, res) => {
  try {
    const { appointmentId, rating, feedback } = req.body;
    const userId = req.userId;

    // Validate input
    if (!appointmentId || rating === undefined || rating === null) {
      return res.status(400).json({
        success: false,
        message: "Appointment ID and rating are required"
      });
    }

    if (rating < 0 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 0 and 5"
      });
    }

    // Find appointment
    const appointment = await appointmentModel.findById(appointmentId)
      .populate('docId', 'name email');
    
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found"
      });
    }

    // Check if user owns this appointment
    if (appointment.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to rate this appointment"
      });
    }

    // Check if appointment is paid
    if (appointment.paymentStatus !== "Paid") {
      return res.status(400).json({
        success: false,
        message: "You can only rate paid appointments"
      });
    }

    // Check if already rated
    if (appointment.rating !== null) {
      return res.status(400).json({
        success: false,
        message: "You have already rated this appointment"
      });
    }

    // Update appointment with rating
    appointment.rating = rating;
    appointment.feedback = feedback || null;
    appointment.ratedAt = new Date();
    await appointment.save();

    // Update doctor's average rating
    await updateDoctorRating(appointment.docId._id);

    res.json({
      success: true,
      message: "Rating submitted successfully",
      data: {
        appointmentId: appointment._id,
        rating: appointment.rating,
        feedback: appointment.feedback,
        ratedAt: appointment.ratedAt
      }
    });
  } catch (err) {
    console.error("❌ Rate doctor error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Helper function to update doctor's average rating
const updateDoctorRating = async (doctorId) => {
  try {
    const ratings = await appointmentModel.find({
      docId: doctorId,
      rating: { $ne: null }
    }).select('rating');

    if (ratings.length === 0) {
      await doctorModel.findByIdAndUpdate(doctorId, {
        averageRating: 0,
        totalRatings: 0
      });
      return;
    }

    const totalRating = ratings.reduce((sum, appointment) => sum + appointment.rating, 0);
    const averageRating = totalRating / ratings.length;

    await doctorModel.findByIdAndUpdate(doctorId, {
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
      totalRatings: ratings.length
    });
  } catch (err) {
    console.error("❌ Update doctor rating error:", err);
  }
};

// Get doctor reviews and ratings
export const getDoctorReviews = async (req, res) => {
  try {
    const { docId } = req.params;

    if (!docId) {
      return res.status(400).json({
        success: false,
        message: "Doctor ID is required"
      });
    }

    // Get doctor info
    const doctor = await doctorModel.findById(docId).select('name averageRating totalRatings');
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found"
      });
    }

    // Get reviews with user info
    const reviews = await appointmentModel.find({
      docId,
      rating: { $ne: null },
      feedback: { $ne: null, $ne: "" }
    })
    .populate('userId', 'name image')
    .select('rating feedback ratedAt')
    .sort({ ratedAt: -1 })
    .limit(10); // Limit to latest 10 reviews

    res.json({
      success: true,
      data: {
        doctor: {
          _id: doctor._id,
          name: doctor.name,
          averageRating: doctor.averageRating,
          totalRatings: doctor.totalRatings
        },
        reviews
      }
    });
  } catch (err) {
    console.error("❌ Get doctor reviews error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
