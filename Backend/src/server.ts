import express from "express";
import jwtRoutes from "./routes/jwtRoutes";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Servidor backend corriendo correctamente 🚀");
});

app.use("/api/jwt", jwtRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en puerto ${PORT}`);
});
