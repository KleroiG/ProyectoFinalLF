export interface SemanticResult {
  valid: boolean;
  errors: string[];
  warnings?: string[];
  symbolTable?: Array<{ name: string; type: string; value: any }>;
  message?: string;
}

/**
 * Valida semantica del header y payload 
 */
export function analisisSemantico(header: any, payload: any): SemanticResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const symbolTable: Array<{ name: string; type: string; value: any }> = [];

  // Header checks
  if (!header || typeof header !== "object") {
    return { valid: false, errors: ["Header no es un objeto JSON válido"], symbolTable: [] };
  }

  if (!("alg" in header)) errors.push("Falta el campo obligatorio 'alg' en el header");
  if (!("typ" in header)) errors.push("Falta el campo obligatorio 'typ' en el header");

  if ("alg" in header && typeof header.alg !== "string") errors.push("'alg' debe ser una cadena de texto");
  if ("typ" in header && typeof header.typ !== "string") errors.push("'typ' debe ser una cadena de texto");

  // Algoritmos soportados
  const allowedAlgs = ["HS256", "HS384", "none"];
  if (header.alg && !allowedAlgs.includes(header.alg)) {
    errors.push(`'alg' no soportado. Permitidos: ${allowedAlgs.join(", ")}`);
  }

  // Payload revision
  if (!payload || typeof payload !== "object") {
    errors.push("Payload no es un objeto JSON válido");
  } else {
    const keys = Object.keys(payload);
    if (keys.length === 0) errors.push("El payload no contiene claims");

    for (const k of keys) {
      const v = payload[k];
      const t = typeof v;
      symbolTable.push({ name: k, type: Array.isArray(v) ? "array" : (v === null ? "null" : t), value: v });
    }

    // Claim-type validations
    if ("exp" in payload && typeof payload.exp !== "number") errors.push("'exp' debe ser numérico (timestamp en segundos)");
    if ("iat" in payload && typeof payload.iat !== "number") errors.push("'iat' debe ser numérico (timestamp en segundos)");
    if ("iss" in payload && typeof payload.iss !== "string") errors.push("'iss' debe ser una cadena de texto");
    if ("aud" in payload && !(typeof payload.aud === "string" || Array.isArray(payload.aud))) errors.push("'aud' debe ser string o array");

    // Temporal relations
    const now = Math.floor(Date.now() / 1000);
    if ("iat" in payload && typeof payload.iat === "number") {
      if (payload.iat > now) warnings.push("'iat' está en el futuro");
    }
    if ("exp" in payload && typeof payload.exp === "number") {
      if (payload.exp <= now) errors.push("El token ha expirado");
      if ("iat" in payload && typeof payload.iat === "number" && payload.exp <= payload.iat) errors.push("'exp' debe ser mayor que 'iat'");
    }

    // Optional: check standard claims presence recommended
    const recommended = ["sub", "exp", "iat"];
    const missingRecommended = recommended.filter(r => !(r in payload));
    if (missingRecommended.length > 0) warnings.push(`Faltan claims recomendados: ${missingRecommended.join(", ")}`);
  }

  if (errors.length > 0) {
    return { valid: false, errors, warnings, symbolTable };
  }

  return {
    valid: true,
    errors: [],
    warnings,
    symbolTable,
    message: "Análisis semántico exitoso: estructura y claims válidos"
  };
}