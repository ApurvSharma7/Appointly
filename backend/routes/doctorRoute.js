import express from "express";
import { 
  getAllDoctors, 
  getDoctorById, 
  loginDoctor,
  getDoctorAppointments,
  getDoctorProfile,
  cancelDoctorAppointment,
  completeDoctorAppointment,
  getDoctorDashboard,
  updateDoctorProfile
} from "../controllers/doctorController.js";
import authDoctor from "../middleware/authDoctor.js";

const router = express.Router();

// POST doctor login
router.post("/login", loginDoctor);

// Protected routes (require doctor authentication)
router.get("/appointments", authDoctor, getDoctorAppointments);
router.get("/profile", authDoctor, getDoctorProfile);
router.post("/update-profile", authDoctor, updateDoctorProfile);
router.post("/cancel-appointment", authDoctor, cancelDoctorAppointment);
router.post("/complete-appointment", authDoctor, completeDoctorAppointment);
router.get("/dashboard", authDoctor, getDoctorDashboard);

// GET all doctors (public)
router.get("/", getAllDoctors);
router.get("/:id", getDoctorById);   // This should be last to avoid conflicts

export default router;
