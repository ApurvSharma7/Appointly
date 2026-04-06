import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import userRoutes from "../routes/userRoute.js";
import doctorRoutes from "../routes/doctorRoute.js";
import paymentRoutes from "../routes/paymentRoutes.js"; 
import adminRouter from "../routes/adminRoute.js";
import connectCloudinary from "../config/cloudinary.js";

dotenv.config();

// connect to Cloudinary
connectCloudinary();

const app = express();

// middleware
app.use(cors({
  origin: "*",
  methods: "GET,POST,PUT,DELETE,OPTIONS",
  allowedHeaders: "Content-Type,Authorization"
}));

app.use(express.json());

// routes
app.use("/api/user", userRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/admin", adminRouter);

// test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// connect to DB at top level for Vercel
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

export default app;
