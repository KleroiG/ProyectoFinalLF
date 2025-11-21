import { Router } from "express";
import { AnalisisLexico } from "../controllers/ctrLexico";
import { analisisSintactico } from "../controllers/ctrSintactico";
import { analisisSemantico } from "../controllers/ctrSemantico";
import { DecodificarJWT } from "../controllers/ctrDecodificador";
import { codificarJWT } from "../controllers/ctrCodificar";
import { verificadorJWT } from "../controllers/ctrVerificador";
import TokenResult from "../modelos/ResultadosTokens";



const router = Router();

// Ruta léxico
router.post("/AnalisisLexico", async (req, res) => {
  const { token } = req.body;

  const result = AnalisisLexico(token);

  // Si hay errores léxicos
  if (result.errors) {
    return res.status(400).json({
      fase: "léxico",
      errores: result.errors
    });
  }

  // Guardar en la base de datos
  await TokenResult.create({
    token,
    tipo: "Análisis Léxico",
    algoritmo: "No disponible en fase léxica",
    detalles: result,
  });

  return res.json({
    message: "Análisis léxico exitoso",
    resultado: result,
  });
});

// Ruta sintactico
router.post("/AnalisisSintactico", async (req, res) => {
  const { token } = req.body;

  const parts = token.split(".");
  if (parts.length !== 3) {
    return res.status(400).json({ error: "El token no tiene tres partes" });
  }

  const result = analisisSintactico({
    header: parts[0],
    payload: parts[1],
    signature: parts[2],
  });

  if (result.error) {
    return res.status(400).json({
      fase: "sintáctico",
      error: result.error,
    });
  }

  await TokenResult.create({
    token,
    tipo: "Análisis Sintáctico",
    algoritmo: result.header?.alg || "No detectado",
    detalles: result,
  });

  return res.json(result);
});

// Ruta semanctica
router.post("/AnalisisSemantico", async (req, res) => {
  const { token } = req.body;

  const parts = token.split(".");
  if (parts.length !== 3) {
    return res.status(400).json({ error: "El token no tiene tres partes" });
  }

  try {
    // Decodificación segura
    const decode = (str: string) => {
      str = str.replace(/-/g, "+").replace(/_/g, "/");
      const pad = str.length % 4;
      if (pad) str += "=".repeat(4 - pad);
      return JSON.parse(Buffer.from(str, "base64").toString("utf8"));
    };

    const header = decode(parts[0]);
    const payload = decode(parts[1]);

    const result = analisisSemantico(header, payload);

    await TokenResult.create({
      token,
      tipo: "Análisis Semántico",
      algoritmo: header.alg || "No detectado",
      detalles: result,
    });

    return res.json(result);

  } catch (err) {
    return res.status(400).json({
      fase: "semántico",
      error: "Error al decodificar el token o JSON inválido",
    });
  }
});

// Ruta para decodificar JWT
router.post("/Decodificar", async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: "Debes enviar un token" });
  }

  const parts = token.split(".");
  if (parts.length !== 3) {
    return res.status(400).json({ error: "El token no tiene tres partes válidas" });
  }

  const result = DecodificarJWT({
    header: parts[0],
    payload: parts[1],
    signature: parts[2],
  });

  // Registrar en BD SOLO si la decodificación es válida
  await TokenResult.create({
    token,
    tipo: "Decodificado",
    algoritmo: result?.header?.alg || "No disponible",
    detalles: result,
  });

  // Si falla una fase
  if (result.valido === false) {
    return res.status(400).json(result);
  }

  return res.json(result);
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

  // Si hubo error en alguna fase
  if (!result.token) {
    await TokenResult.create({
      token: null,
      tipo: "Codificación Fallida",
      algoritmo: header?.alg || "No disponible",
      detalles: result,
    });
    return res.status(400).json(result);
  }

  // Si todo salió bien
  await TokenResult.create({
    token: result.token,
    tipo: "Codificado",
    algoritmo: result.algorithm,
    detalles: result,
  });

  return res.json(result);
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
    tipo: result.valid ? "Verificado: firma valida" : "Verificado: firma invalida",
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

// Ruta para análisis completo (léxico, sintáctico, semántico)
router.post("/Analyze", (req, res) => {
  const { token } = req.body;
  const lex = AnalisisLexico(token);
  if (lex.errors) return res.status(400).json({ phase: "lexico", errors: lex.errors });
  const parts = lex.parts!;
  const syn = analisisSintactico(parts);
  if (syn.error) return res.status(400).json({ phase: "sintactico", error: syn.error });
  const sem = analisisSemantico(syn.header, syn.payload);
  if (!sem.valid) return res.status(400).json({ phase: "semantico", ...sem });
  return res.json({ phase: "ok", lex, syn, sem });
});

export default router;
