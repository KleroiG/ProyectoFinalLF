import { JWTSegments } from "./ctrLexico";

// Se valida que una cadena sea Base64URL
function validarBase64Url(str: string): boolean {
  // Solo caracteres válidos del alfabeto Base64URL
  return /^[A-Za-z0-9\-_]+$/.test(str);
}

//Decodificar Base64URL
export function decodeBase64Url(str: string): string {
  str = str.replace(/-/g, "+").replace(/_/g, "/");

  const pad = str.length % 4;
  if (pad) str += "=".repeat(4 - pad);

  try {
    return Buffer.from(str, "base64").toString("utf8");
  } catch {
    throw new Error("Error al decodificar Base64URL");
  }
}

export function DecodificarJWT(parts: JWTSegments) {
  const errores: string[] = [];

//Validacion léxica
  if (!validarBase64Url(parts.header)) {
    errores.push("Error léxico: el header contiene caracteres inválidos");
  }

  if (!validarBase64Url(parts.payload)) {
    errores.push("Error léxico: el payload contiene caracteres inválidos");
  }

  if (!validarBase64Url(parts.signature)) {
    errores.push("Error léxico: la firma contiene caracteres inválidos");
  }

  if (errores.length > 0) {
    return {
      fase: "léxico",
      valido: false,
      errores
    };
  }

//Decodificación
  let headerDecoded = "";
  let payloadDecoded = "";

  try {
    headerDecoded = decodeBase64Url(parts.header);
    payloadDecoded = decodeBase64Url(parts.payload);
  } catch (e: any) {
    return {
      fase: "decodificación",
      valido: false,
      error: `Error al decodificar Base64URL: ${e.message}`
    };
  }

  let headerJSON: any;
  let payloadJSON: any;

  try {
    headerJSON = JSON.parse(headerDecoded);
  } catch {
    return {
      fase: "sintáctico",
      valido: false,
      error: "Header decodificado no es un JSON válido"
    };
  }

  try {
    payloadJSON = JSON.parse(payloadDecoded);
  } catch {
    return {
      fase: "sintáctico",
      valido: false,
      error: "Payload decodificado no es un JSON válido"
    };
  }

  return {
    message: "Decodificación exitosa",
    valido: true,

    fases: {
      lexico: "OK",
      decodificacion: "OK",
      sintactico: "OK"
    },

    header: headerJSON,
    payload: payloadJSON,

    raw: {
      headerDecoded,
      payloadDecoded,
      signature: parts.signature
    }
  };
}
