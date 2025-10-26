import { Schema, model } from "mongoose";

const tokenResultSchema = new Schema({
  token: { type: String, required: true },
  tipo: { type: String, required: true },   // "válido", "expirado", "firma inválida"
  algoritmo: { type: String },
  fecha: { type: Date, default: Date.now },
  detalles: { type: Object },                // información adicional (payload, errores,)
});

export default model("TokenResult", tokenResultSchema);
