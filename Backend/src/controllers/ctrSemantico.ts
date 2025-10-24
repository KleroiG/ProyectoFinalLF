interface SemanticResult {
  message?: string;
  errors?: string[];
  valid?: boolean;
}

export function AnalisisSemantico(header: any, payload: any): SemanticResult {
  const errors: string[] = [];

  // Validación del header
  if (!header.alg) errors.push("Falta el campo obligatorio 'alg' en el header");
  if (!header.typ) errors.push("Falta el campo obligatorio 'typ' en el header");

  // Validar tipos
  if (header.alg && typeof header.alg !== "string")
    errors.push("'alg' debe ser una cadena de texto");
  if (header.typ && typeof header.typ !== "string")
    errors.push("'typ' debe ser una cadena de texto");

  // Validación del payload (claims)
  const standardClaims = ["sub", "name", "iat", "exp", "iss", "aud"];
  const payloadKeys = Object.keys(payload);

  // Verificar que al menos tenga algo
  if (payloadKeys.length === 0)
    errors.push("El payload no contiene claims");

  // Validar tipos estándar
  if (payload.exp && typeof payload.exp !== "number")
    errors.push("'exp' debe ser numérico (timestamp en segundos)");

  if (payload.iat && typeof payload.iat !== "number")
    errors.push("'iat' debe ser numérico (timestamp en segundos)");

  //Validar expiracion
  if (payload.exp) {
    const ahora = Math.floor(Date.now() / 1000);
    if (ahora > payload.exp)
      errors.push("El token ha expirado");
  }

  // Resultado final
  if (errors.length > 0) {
    return {
      valid: false,
      errors,
    };
  }

  return {
    valid: true,
    message: "Análisis semántico exitoso: estructura y claims válidos",
  };
}
