import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "";

export const conectarDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Conectado a la base de datos MongoDB");
  } catch (error) {
    console.error("Error al conectar con MongoDB:", error);
    process.exit(1);
  }
};
