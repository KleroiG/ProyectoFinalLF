import { JWTSegments } from "./ctrLexico";

export function decodeBase64Url(str: string): string {
  // Reemplaza caracteres no estándar y ajusta padding
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
  try {
    const headerDecoded = decodeBase64Url(parts.header);
    const payloadDecoded = decodeBase64Url(parts.payload);

    const header = JSON.parse(headerDecoded);
    const payload = JSON.parse(payloadDecoded);

    return {
      message: "Decodificación exitosa",
      header,
      payload,
      raw: {
        headerDecoded,
        payloadDecoded
      }
    };
  } catch (error: any) {
    return { error: `Error al decodificar o parsear el JWT: ${error.message}` };
  }
}
