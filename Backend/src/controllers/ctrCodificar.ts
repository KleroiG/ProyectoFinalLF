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

  return crypto
    .createHmac(algo, secret)
    .update(data)
    .digest("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

export function codificarJWT(header: any, payload: any, secret: string): any {
  try {
    if (!header || typeof header !== "object") {
      return { fase: "semántico", error: "Header inválido o ausente" };
    }
    if (!payload || typeof payload !== "object") {
      return { fase: "semántico", error: "Payload inválido o ausente" };
    }
    if (!secret || typeof secret !== "string") {
      return { fase: "semántico", error: "Secret inválido o ausente" };
    }
    if (!header.alg || !header.typ) {
      return { fase: "semántico", error: "El header debe incluir 'alg' y 'typ'." };
    }

    const now = Math.floor(Date.now() / 1000);
    if (!("exp" in payload) || typeof payload.exp !== "number") {
      payload.exp = now + 25 * 60; // 25 minutos en segundos
    }

    const semantico = analisisSemantico(header, payload);
    if (!semantico.valid) {
      return { fase: "semántico", errores: semantico.errors || ["Error semántico desconocido"] };
    }


    const headerBase64 = base64UrlEncode(JSON.stringify(header));
    const payloadBase64 = base64UrlEncode(JSON.stringify(payload));
    const unsignedToken = `${headerBase64}.${payloadBase64}`;

    let signature: string;
    try {
      if (header.alg === "none") {
        signature = "";
      } else {
        signature = createSignature(header.alg, secret, unsignedToken);
      }
    } catch (err: any) {
      return { fase: "semántico", error: `Algoritmo no soportado: ${header.alg}` };
    }

    const fullToken = `${unsignedToken}.${signature}`;

    const lexResult = AnalisisLexico(fullToken);
    if (lexResult.errors && lexResult.errors.length > 0) {
      return { fase: "léxico", error: lexResult.errors };
    }

    try {

      analisisSintactico({
        header: headerBase64,
        payload: payloadBase64,
        signature: signature
      });
    } catch (e: any) {
      return { fase: "sintáctico", error: e?.message || "Error en análisis sintáctico" };
    }

    //Envia resultado final si todo esta bien
    return {
      message: "JWT generado exitosamente",
      token: fullToken,
      algorithm: header.alg,
      fases: {
        lexico: "OK",
        sintactico: "OK",
        semantico: "OK"
      }
    };

  } catch (err: any) {
    return {
      error: `Error inesperado: ${err?.message || String(err)}`
    };
  }
}
