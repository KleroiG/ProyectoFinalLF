import { Router } from "express";
import { AnalisisLexico } from "../controllers/ctrLexico";
import { analisiSintactico } from "../controllers/ctrSintactico";
import { AnalisisSemantico } from "../controllers/ctrSemantico";
import { DecodificarJWT } from "../controllers/ctrDecodificador";
import { codificarJWT } from "../controllers/ctrCodificar";
import { verificadorJWT } from "../controllers/ctrVerificador";




const router = Router();

// Ruta para análisis léxico
router.post("/AnalisisLexico", (req, res) => {
  const { token } = req.body;
  const result = AnalisisLexico(token);

  if (typeof result === "string") {
    return res.status(400).json({ error: result });
  }

  res.json({ message: "Análisis léxico exitoso", parts: result });
});

// Ruta para análisis sintáctico
router.post("/AnalisisSintactico", (req, res) => {
  const { token } = req.body;
  const parts = token.split(".");

  if (parts.length !== 3) {
    return res.status(400).json({ error: "El token no tiene tres partes" });
  }

  const result = analisiSintactico({
    header: parts[0],
    payload: parts[1],
    signature: parts[2],
  });

  if (result.error) {
    return res.status(400).json(result);
  }

  res.json(result);
});

// Ruta para análisis semántico
router.post("/AnalisisSemantico", (req, res) => {
  const { token } = req.body;
  const parts = token.split(".");

  if (parts.length !== 3) {
    return res.status(400).json({ error: "El token no tiene tres partes" });
  }

  try {
    // Decodificar base64 y parsear JSON (como en la fase 2)
    const decode = (str: string) => {
      str = str.replace(/-/g, "+").replace(/_/g, "/");
      const pad = str.length % 4;
      if (pad) str += "=".repeat(4 - pad);
      return JSON.parse(Buffer.from(str, "base64").toString("utf8"));
    };

    const header = decode(parts[0]);
    const payload = decode(parts[1]);

    const result = AnalisisSemantico(header, payload);

    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: "Error al decodificar el token o JSON inválido" });
  }
});

// Ruta para decodificar JWT
router.post("/Decodificar", (req, res) => {
  const { token } = req.body;
  const parts = token.split(".");

  if (parts.length !== 3) {
    return res.status(400).json({ error: "El token no tiene tres partes válidas" });
  }

  const result = DecodificarJWT({
    header: parts[0],
    payload: parts[1],
    signature: parts[2],
  });

  if (result.error) return res.status(400).json(result);
  res.json(result);
});

// Ruta para codificar JWT
router.post("/Codificar", (req, res) => {
  const { header, payload, secret } = req.body;

  if (!header || !payload || !secret) {
    return res.status(400).json({
      error: "Debes enviar header, payload y secret"
    });
  }

  const result = codificarJWT(header, payload, secret);

  if (result.error) return res.status(400).json(result);
  res.json(result);
});

// Ruta para verificar JWT
router.post("/verificador", (req, res) => {
  const { token, secret } = req.body;

  if (!token || !secret) {
    return res.status(400).json({ error: "Debes enviar el token y la clave secreta" });
  }

  const parts = token.split(".");
  if (parts.length !== 3) {
    return res.status(400).json({ error: "El token no tiene tres partes válidas" });
  }

  const result = verificadorJWT(
    { header: parts[0], payload: parts[1], signature: parts[2] },
    secret
  );

  if (result.error) return res.status(400).json(result);
  res.json(result);
});


export default router;
