import crypto from "crypto";
import { JWTSegments } from "./ctrLexico";


function base64UrlDecode(str: string): string {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  const pad = str.length % 4;
  if (pad) str += "=".repeat(4 - pad);
  return Buffer.from(str, "base64").toString("utf8");
}

function base64UrlEncode(str: string): string {
  return Buffer.from(str)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function createSignature(algorithm: string, secret: string, data: string): string {
  let algo: string;
  switch (algorithm) {
    case "HS256":
      algo = "sha256";
      break;
    case "HS384":
      algo = "sha384";
      break;
    default:
      throw new Error("Algoritmo no soportado");
  }

  return crypto
    .createHmac(algo, secret)
    .update(data)
    .digest("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

export function verificadorJWT(parts: JWTSegments, secret: string) {
  try {
    // Decodificar el header
    const headerJSON = JSON.parse(base64UrlDecode(parts.header));
    const algorithm = headerJSON.alg;
    if (!algorithm) {
      return { error: "El header no contiene el campo 'alg'" };
    }

    // Reconstruir la firma
    const unsignedToken = `${parts.header}.${parts.payload}`;
    if (algorithm === "none") {
      // Para 'none' se espera firma vacía
      const signatureValid = parts.signature === "" || parts.signature === undefined;
      // verificar exp si existe
      const payloadJSON = JSON.parse(base64UrlDecode(parts.payload));
      const now = Math.floor(Date.now() / 1000);
      if ("exp" in payloadJSON) {
        if (typeof payloadJSON.exp !== "number") return { error: "'exp' en payload no es numérico" };
        if (payloadJSON.exp <= now) return { valid: false, message: "El token ha expirado", algorithm };
      }
      return signatureValid
        ? { valid: true, message: "Firma válida (alg: none)", algorithm }
        : { valid: false, message: "Firma inválida para alg 'none'", algorithm };
    }
    const recalculatedSignature = createSignature(algorithm, secret, unsignedToken);

    // Comparar firmas
    const signatureValid = recalculatedSignature === parts.signature;

    // Decodificar payload y verificar 'exp' si existe
    const payloadJSON = JSON.parse(base64UrlDecode(parts.payload));
    const now = Math.floor(Date.now() / 1000);
    if ("exp" in payloadJSON) {
      if (typeof payloadJSON.exp !== "number") {
        return { error: "'exp' en payload no es numérico" };
      }
      if (payloadJSON.exp <= now) {
        return { valid: false, message: "El token ha expirado", algorithm };
      }
    }

    if (!signatureValid) {
      return {
        valid: false,
        message: "Firma inválida: el token ha sido modificado o la clave es incorrecta",
        algorithm,
      };
    }

    return {
      valid: true,
      message: "Firma válida: el token no ha sido alterado",
      algorithm,
      payload: payloadJSON,
    };
  } catch (err: any) {
    return { error: `Error al verificar el JWT: ${err.message}` };
  }
}
