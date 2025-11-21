import crypto from "crypto";
import { AnalisisLexico } from "./ctrLexico";
import { analisisSintactico } from "./ctrSintactico";
import { analisisSemantico } from "./ctrSemantico";

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
      throw new Error("Algoritmo no soportado. Usa HS256 o HS384.");
  }

  const signature = crypto
    .createHmac(algo, secret)
    .update(data)
    .digest("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  return signature;
}

// Codifica un JWT dado el header, payload y la clave secreta
export function codificarJWT(header: any, payload: any, secret: string) {
  try {
    // Analisis Lexico
    const textoHeader = JSON.stringify(header);
    const textoPayload = JSON.stringify(payload);

    const lexicoHeader = AnalisisLexico(textoHeader);
    const lexicoPayload = AnalisisLexico(textoPayload);

    if (lexicoHeader.errors?.length || lexicoPayload.errors?.length) {
      return {
        fase: "léxico",
        error: [...(lexicoHeader.errors || []), ...(lexicoPayload.errors || [])]
      };
    }

    // Analisis Sintactico
    let sintacticoHeader = null;
    let sintacticoPayload = null;

    try {
      sintacticoHeader = analisisSintactico({
        header: base64UrlEncode(textoHeader),
        payload: base64UrlEncode(textoPayload),
        signature: ""
      });
    } catch {
      return { fase: "sintáctico", error: "Header inválido" };
    }

    try {
      sintacticoPayload = JSON.parse(textoPayload);
    } catch {
      return { fase: "sintáctico", error: "Payload inválido" };
    }

    // Analisis semantico
    const semantico = analisisSemantico(header, payload);

    if (!semantico.valid) {
      return {
        fase: "semántico",
        errores: semantico.errors
      };
    }

    // Codificacion en base64
    const headerBase64 = base64UrlEncode(textoHeader);
    const payloadBase64 = base64UrlEncode(textoPayload);

    const unsigned = `${headerBase64}.${payloadBase64}`;

    // Firma hcmac
    const signature = createSignature(header.alg, secret, unsigned);

    const tokenFinal = `${unsigned}.${signature}`;

    return {
      message: "JWT generado exitosamente",
      token: tokenFinal,
      algorithm: header.alg,
      fases: {
        lexico: "OK",
        sintactico: "OK",
        semantico: "OK"
      }
    };
  } catch (err: any) {
    return {
      error: `Error inesperado: ${err.message}`
    };
  }
}
