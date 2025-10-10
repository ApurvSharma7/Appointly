import Doctor from "../models/doctorModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import appointmentModel from "../models/appointmentModel.js";
import User from "../models/userModel.js";
import sendEmail from "../config/nodemailer.js";

export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({});
    res.json({ success: true, doctors });
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    res.json({ success: true, doctor });
  } catch (error) {
    console.error("Get Doctor Error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// API for doctor login
export const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({ success: false, message: "Email and password are required" });
    }

    // Find doctor by email
    const doctor = await Doctor.findOne({ email });
    
    if (!doctor) {
      return res.json({ success: false, message: "Doctor not found" });
    }

    // Check if doctor has a password set
    if (!doctor.password) {
      // If no password is set, set a default password
      const defaultPassword = "doctor123";
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(defaultPassword, salt);
      
      // Update doctor with default password
      await Doctor.findByIdAndUpdate(doctor._id, { password: hashedPassword });
      
      // Check if provided password matches default
      if (password !== defaultPassword) {
        return res.json({ success: false, message: "Please use default password: doctor123" });
      }
    } else {
      // Check password if it exists
      const isPasswordValid = await bcrypt.compare(password, doctor.password);
      
      if (!isPasswordValid) {
        return res.json({ success: false, message: "Invalid credentials" });
      }
    }

    // Generate JWT token
    const token = jwt.sign(
      { doctorId: doctor._id, email: doctor.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ 
      success: true, 
      token,
      doctor: {
        id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        speciality: doctor.speciality,
        image: doctor.image
      }
    });

  } catch (error) {
    console.error("Doctor Login Error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// API to get doctor appointments
export const getDoctorAppointments = async (req, res) => {
  try {
    const doctorId = req.doctorId; // From auth middleware
    
    const appointments = await appointmentModel.find({ docId: doctorId })
      .populate('userId', 'name email image dob')
      .populate('docId', 'name email image speciality fees');

    // Transform the data to match frontend expectations
    const transformedAppointments = appointments.map(appointment => ({
      ...appointment.toObject(),
      userData: appointment.userId,
      docData: appointment.docId,
      amount: appointment.docId?.fees || 0,
      cancelled: appointment.status === 'Cancelled',
      isCompleted: appointment.status === 'Confirmed'
    }));

    res.json({ success: true, appointments: transformedAppointments });

  } catch (error) {
    console.error("Get Doctor Appointments Error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// API to get doctor profile
export const getDoctorProfile = async (req, res) => {
  try {
    const doctorId = req.doctorId; // From auth middleware
    
    const doctor = await Doctor.findById(doctorId).select('-password');
    
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    res.json({ success: true, profileData: doctor });

  } catch (error) {
    console.error("Get Doctor Profile Error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// API to cancel doctor appointment
export const cancelDoctorAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const doctorId = req.doctorId; // From auth middleware

    // Verify the appointment belongs to this doctor and get full details
    const appointment = await appointmentModel.findOne({ 
      _id: appointmentId, 
      docId: doctorId 
    }).populate('userId', 'name email phone').populate('docId', 'name email');

    if (!appointment) {
      return res.json({ success: false, message: "Appointment not found or unauthorized" });
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, { 
      status: 'Cancelled',
      cancelled: true 
    });

    // Send email notification to patient
    try {
      const emailSubject = `Appointment Cancelled - Dr. ${appointment.docId.name}`;
      const emailText = `
Dear ${appointment.userId.name},

Your appointment has been cancelled:

Doctor: Dr. ${appointment.docId.name}
Date: ${appointment.slotDate}
Time: ${appointment.slotTime}
Status: Cancelled

Please contact the clinic if you need to reschedule or have any questions.

Best regards,
Medigo Team
      `;

      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">Appointment Cancelled</h2>
          
          <p>Dear ${appointment.userId.name},</p>
          
          <p>Your appointment has been cancelled:</p>
          
          <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
            <h3 style="color: #dc2626; margin-top: 0;">Appointment Details:</h3>
            <p><strong>Doctor:</strong> Dr. ${appointment.docId.name}</p>
            <p><strong>Date:</strong> ${appointment.slotDate}</p>
            <p><strong>Time:</strong> ${appointment.slotTime}</p>
            <p><strong>Status:</strong> <span style="color: #dc2626;">Cancelled</span></p>
          </div>
          
          <p>Please contact the clinic if you need to reschedule or have any questions.</p>
          
          <p style="margin-top: 30px;">Best regards,<br>Medigo Team</p>
        </div>
      `;

      await sendEmail(appointment.userId.email, emailSubject, emailText, emailHtml);
      console.log(`✅ Cancellation email sent to ${appointment.userId.name} (${appointment.userId.email})`);
    } catch (emailError) {
      console.error("❌ Failed to send cancellation email:", emailError);
    }

    res.json({ success: true, message: 'Appointment Cancelled' });

  } catch (error) {
    console.error("Cancel Doctor Appointment Error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// API to complete doctor appointment
export const completeDoctorAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const doctorId = req.doctorId; // From auth middleware

    // Verify the appointment belongs to this doctor and get full details
    const appointment = await appointmentModel.findOne({ 
      _id: appointmentId, 
      docId: doctorId 
    }).populate('userId', 'name email phone').populate('docId', 'name email');

    if (!appointment) {
      return res.json({ success: false, message: "Appointment not found or unauthorized" });
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, { 
      status: 'Confirmed',
      isCompleted: true 
    });

    // Send email notification to patient
    try {
      const emailSubject = `Appointment Confirmed - Dr. ${appointment.docId.name}`;
      const emailText = `
Dear ${appointment.userId.name},

Your appointment has been confirmed:

Doctor: Dr. ${appointment.docId.name}
Date: ${appointment.slotDate}
Time: ${appointment.slotTime}
Status: Confirmed

Please arrive 10 minutes before your scheduled time. If you need to reschedule or cancel, please contact us at least 24 hours in advance.

Best regards,
Medigo Team
      `;

      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #059669;">Appointment Confirmed</h2>
          
          <p>Dear ${appointment.userId.name},</p>
          
          <p>Your appointment has been confirmed:</p>
          
          <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #059669;">
            <h3 style="color: #059669; margin-top: 0;">Appointment Details:</h3>
            <p><strong>Doctor:</strong> Dr. ${appointment.docId.name}</p>
            <p><strong>Date:</strong> ${appointment.slotDate}</p>
            <p><strong>Time:</strong> ${appointment.slotTime}</p>
            <p><strong>Status:</strong> <span style="color: #059669;">Confirmed</span></p>
          </div>
          
          <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>📋 Important:</strong> Please arrive 10 minutes before your scheduled time. If you need to reschedule or cancel, please contact us at least 24 hours in advance.</p>
          </div>
          
          <p style="margin-top: 30px;">Best regards,<br>Medigo Team</p>
        </div>
      `;

      await sendEmail(appointment.userId.email, emailSubject, emailText, emailHtml);
      console.log(`✅ Confirmation email sent to ${appointment.userId.name} (${appointment.userId.email})`);
    } catch (emailError) {
      console.error("❌ Failed to send confirmation email:", emailError);
    }

    res.json({ success: true, message: 'Appointment Completed' });

  } catch (error) {
    console.error("Complete Doctor Appointment Error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// API to get doctor dashboard data
export const getDoctorDashboard = async (req, res) => {
  try {
    const doctorId = req.doctorId; // From auth middleware

    const appointments = await appointmentModel.find({ docId: doctorId })
      .populate('userId', 'name email image dob')
      .populate('docId', 'name email image speciality fees');

    // Get doctor info with ratings
    const doctor = await Doctor.findById(doctorId).select('averageRating totalRatings fees');

    // Transform the appointments data
    const transformedAppointments = appointments.map(appointment => ({
      ...appointment.toObject(),
      userData: appointment.userId,
      docData: appointment.docId,
      amount: appointment.docId?.fees || 0,
      cancelled: appointment.status === 'Cancelled',
      isCompleted: appointment.status === 'Confirmed'
    }));

    // Calculate earnings from completed appointments
    const completedAppointments = appointments.filter(apt => apt.status === 'Confirmed' || apt.status === 'Completed');
    const earnings = completedAppointments.reduce((total, apt) => total + (apt.docId?.fees || 0), 0);

    // Get unique patients count
    const uniquePatients = new Set(appointments.map(apt => apt.userId._id.toString())).size;

    const dashData = {
      appointments: appointments.length,
      completedAppointments: appointments.filter(apt => apt.status === 'Confirmed' || apt.status === 'Completed').length,
      cancelledAppointments: appointments.filter(apt => apt.status === 'Cancelled').length,
      pendingAppointments: appointments.filter(apt => apt.status === 'Pending').length,
      latestAppointments: transformedAppointments.reverse().slice(0, 5), // Latest 5 appointments
      earnings: earnings,
      patients: uniquePatients,
      averageRating: doctor.averageRating || 0,
      totalRatings: doctor.totalRatings || 0
    };

    res.json({ success: true, dashData });

  } catch (error) {
    console.error("Get Doctor Dashboard Error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// API to update doctor profile
export const updateDoctorProfile = async (req, res) => {
  try {
    const doctorId = req.doctorId; // From auth middleware
    const { address, fees, about, available } = req.body;

    // Validate required fields
    if (!address || !fees || !about) {
      return res.json({ success: false, message: "Missing required fields" });
    }

    // Update doctor profile
    const updatedDoctor = await Doctor.findByIdAndUpdate(
      doctorId,
      {
        address,
        fees: Number(fees),
        about,
        available: available !== undefined ? available : true
      },
      { new: true }
    ).select('-password');

    if (!updatedDoctor) {
      return res.json({ success: false, message: "Doctor not found" });
    }

    res.json({ 
      success: true, 
      message: "Profile updated successfully",
      profileData: updatedDoctor
    });

  } catch (error) {
    console.error("Update Doctor Profile Error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
