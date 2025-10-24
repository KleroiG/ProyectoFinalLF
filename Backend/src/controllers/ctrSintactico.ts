import { JWTSegments } from "./ctrLexico";

// Función para decodificar Base64URL a texto
function base64UrlDecode(str: string): string {
  try {
    // Reemplazar caracteres no estándar del Base64URL
    str = str.replace(/-/g, "+").replace(/_/g, "/");

    // Agregar padding si falta
    const pad = str.length % 4;
    if (pad) {
      str += "=".repeat(4 - pad);
    }

    // Decodificar
    return Buffer.from(str, "base64").toString("utf8");
  } catch {
    throw new Error("Error al decodificar Base64URL");
  }
}

// Función principal del análisis sintáctico
export function analisiSintactico(parts: JWTSegments): any {
  try {
    const headerDecoded = base64UrlDecode(parts.header);
    const payloadDecoded = base64UrlDecode(parts.payload);

    // Verificar que ambos sean JSON válidos
    const headerJSON = JSON.parse(headerDecoded);
    const payloadJSON = JSON.parse(payloadDecoded);

    return {
      message: "Análisis sintáctico exitoso",
      header: headerJSON,
      payload: payloadJSON,
    };
  } catch (err: any) {
    return { error: `Error sintáctico: ${err.message}` };
  }
}
