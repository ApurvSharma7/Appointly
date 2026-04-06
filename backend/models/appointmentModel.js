// models/appointmentModel.js
import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    docId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    slotDate: { type: String, required: true },
    slotTime: { type: String, required: true },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled", "Completed"],
      default: "Pending",
    },
    paymentStatus: {
      type: String,
      enum: ["Unpaid", "Paid", "Failed"],
      default: "Unpaid",
    },
    transactionId: { type: String },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: null,
    },
    feedback: {
      type: String,
      maxlength: 500,
      default: null,
    },
    ratedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Add compound index to prevent duplicate bookings for the same doctor, date, and time
// Only for non-cancelled appointments
appointmentSchema.index(
  { docId: 1, slotDate: 1, slotTime: 1, status: 1 },
  {
    unique: true,
    partialFilterExpression: {
      status: { $in: ["Pending", "Confirmed"] }
    }
  }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;
