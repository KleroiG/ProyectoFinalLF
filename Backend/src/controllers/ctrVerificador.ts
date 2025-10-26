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
    const recalculatedSignature = createSignature(algorithm, secret, unsignedToken);

    // Comparar firmas
    const valid = recalculatedSignature === parts.signature;

    return valid
      ? {
          valid: true,
          message: "Firma válida: el token no ha sido alterado",
          algorithm,
        }
      : {
          valid: false,
          message: "Firma inválida: el token ha sido modificado o la clave es incorrecta",
          algorithm,
        };
  } catch (err: any) {
    return { error: `Error al verificar el JWT: ${err.message}` };
  }
}
