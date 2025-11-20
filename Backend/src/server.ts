import express from "express";
import cors from "cors";
import jwtRoutes from "./routes/jwtRoutes";
import { conectarDB } from "./configuracion/db";

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",                 // Para desarrollo local
    "https://acceptable-olwen-proyectolf-1e69aa9f.koyeb.app", // Backend
    "https://tu-frontend.vercel.app"         // Frontend
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

conectarDB();

app.use("/api/jwt", jwtRoutes);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en puerto ${PORT}`);
});
