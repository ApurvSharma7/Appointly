// seedDoctors.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Doctor from "./models/doctorModel.js"; 
import { doctors } from "./data/doctors.js";
import bcrypt from "bcrypt";

dotenv.config();

const seedDoctors = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected ✅");

    // Clear old doctors
    await Doctor.deleteMany();
    console.log("Old doctors cleared ✅");

    // Hash default password
    const defaultPassword = "doctor123";
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(defaultPassword, salt);

    // Add unique email, availability, and password
    const cleanedDoctors = doctors.map((doc, index) => ({
      ...doc,
      email: `doctor${index + 1}@medigo.com`, // unique email
      password: hashedPassword, // default password for all doctors
      available: true, // set default availability
    }));

    // Insert doctors into DB
    await Doctor.insertMany(cleanedDoctors);
    console.log("Doctors seeded successfully ✅");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding doctors ❌:", error);
    process.exit(1);
  }
};

seedDoctors();
