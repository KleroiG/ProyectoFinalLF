import express from "express";
import jwtRoutes from "./routes/jwtRoutes";
import { conectarDB } from "./configuracion/db";

const app = express();
app.use(express.json());

conectarDB();

app.use("/api/jwt", jwtRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en puerto ${PORT}`);
});
