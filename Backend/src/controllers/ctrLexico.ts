export interface JWTSegments {
  header: string;
  payload: string;
  signature: string;
}

export function AnalisisLexico(token: string): JWTSegments | string {
  // El token debe tener 3 partes separadas por puntos
  const parts = token.split(".");

  if (parts.length !== 3) {
    return "Error léxico: El token no contiene exactamente tres partes (header.payload.signature)";
  }

  const [header, payload, signature] = parts;

  // Validar que las partes no estén vacías
  if (!header || !payload || !signature) {
    return "Error léxico: Una de las partes del JWT está vacía";
  }

  return { header, payload, signature };
}
