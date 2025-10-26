import { Router } from "express";
import { AnalisisLexico } from "../controllers/ctrLexico";
import { analisiSintactico } from "../controllers/ctrSintactico";
import { AnalisisSemantico } from "../controllers/ctrSemantico";
import { DecodificarJWT } from "../controllers/ctrDecodificador";
import { codificarJWT } from "../controllers/ctrCodificar";
import { verificadorJWT } from "../controllers/ctrVerificador";
import TokenResult from "../modelos/ResultadosTokens";



const router = Router();

// Ruta para análisis léxico
router.post("/AnalisisLexico", async (req, res) => {
  const { token } = req.body;
  const result = AnalisisLexico(token);

  if (typeof result === "string") {
    return res.status(400).json({ error: result });
  }

  await TokenResult.create({
    token,
    tipo: "Analizado Léxicamente",
    algoritmo: result.header,
    detalles: result,
  });

  res.json({ message: "Análisis léxico exitoso", parts: result });
});

// Ruta para análisis sintáctico
router.post("/AnalisisSintactico", async (req, res) => {
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

  await TokenResult.create({
    token,
    tipo: "Analizado Sintácticamente",
    algoritmo: result.header.alg,
    detalles: result,
  });

  res.json(result);
});

// Ruta para análisis semántico
router.post("/AnalisisSemantico", async (req, res) => {
  const { token } = req.body;
  const parts = token.split(".");

  if (parts.length !== 3) {
    return res.status(400).json({ error: "El token no tiene tres partes" });
  }

  try {
    const decode = (str: string) => {
      str = str.replace(/-/g, "+").replace(/_/g, "/");
      const pad = str.length % 4;
      if (pad) str += "=".repeat(4 - pad);
      return JSON.parse(Buffer.from(str, "base64").toString("utf8"));
    };

    const header = decode(parts[0]);
    const payload = decode(parts[1]);

    const result = AnalisisSemantico(header, payload);

    await TokenResult.create({
      token,
      tipo: "Analizado Semánticamente",
      algoritmo: header.alg,
      detalles: result,
    });

    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: "Error al decodificar el token o JSON inválido" });
  }
});

// Ruta para decodificar JWT
router.post("/Decodificar", async (req, res) => {
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

  await TokenResult.create({
    token,
    tipo: "Decodificado",
    algoritmo: result.header.alg,
    detalles: result,
  });

  if (result.error) return res.status(400).json(result);
  res.json(result);
});

// Ruta para codificar JWT
router.post("/Codificar", async (req, res) => {
  const { header, payload, secret } = req.body;

  if (!header || !payload || !secret) {
    return res.status(400).json({
      error: "Debes enviar header, payload y secret"
    });
  }

  const result = codificarJWT(header, payload, secret);

  await TokenResult.create({
    token: result.token,
    tipo: "Codificado",
    algoritmo: result.algorithm,
    detalles: result,
  });

  if (result.error) return res.status(400).json(result);
  res.json(result);
});


// Ruta para verificar JWT
router.post("/Verificar", async (req, res) => {
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

  await TokenResult.create({
    token,
    tipo: "Verificado: " + result.valid ? "firma valida" : "firma invalida",
    algoritmo: result.algorithm,
    detalles: result,
  });

  if (result.error) return res.status(400).json(result);
  res.json(result);
});

// Ruta para obtener el historial de tokens analizados
router.get("/Historial", async (req, res) => {
  const registros = await TokenResult.find().sort({ fecha: -1 }).limit(20);
  res.json(registros);
});


export default router;
