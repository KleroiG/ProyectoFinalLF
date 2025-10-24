import crypto from "crypto";

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

export function codificarJWT(header: any, payload: any, secret: string): any {
  try {
    if (!header.alg || !header.typ)
      return { error: "El header debe incluir 'alg' y 'typ'." };

    const headerBase64 = base64UrlEncode(JSON.stringify(header));
    const payloadBase64 = base64UrlEncode(JSON.stringify(payload));

    const unsignedToken = `${headerBase64}.${payloadBase64}`;
    const signature = createSignature(header.alg, secret, unsignedToken);

    const fullToken = `${unsignedToken}.${signature}`;

    return {
      message: "JWT generado exitosamente",
      token: fullToken,
      header,
      payload,
      algorithm: header.alg
    };
  } catch (err: any) {
    return { error: `Error al generar el token: ${err.message}` };
  }
}
