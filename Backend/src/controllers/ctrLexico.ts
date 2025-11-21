export interface JWTSegments {
  header: string;
  payload: string;
  signature: string;
}

export type JSONTokenType =
  | "brace_open" | "brace_close"
  | "bracket_open" | "bracket_close"
  | "colon" | "comma"
  | "string" | "number" | "boolean" | "null";

export interface JSONToken {
  type: JSONTokenType;
  value?: string | number | boolean | null;
  pos: number;
}

export interface LexResult {
  parts?: JWTSegments;
  headerDecoded?: string;
  payloadDecoded?: string;
  headerTokens?: JSONToken[];
  payloadTokens?: JSONToken[];
  errors?: string[];
}

/**
 * Alfabeto permitido
 * Permite: A-Z a-z 0-9 - _
 */
function isBase64Url(str: string): boolean {
  // empty string invalid
  if (!str || str.length === 0) return false;
  const re = /^[A-Za-z0-9\-_]+$/;
  return re.test(str);
}

function base64UrlDecodeSafe(str: string): string {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  const pad = str.length % 4;
  if (pad) str += "=".repeat(4 - pad);
  return Buffer.from(str, "base64").toString("utf8");
}

/**
 * Tokenizador mínimo para JSON legible
 * Genera tokens con posición
 */
export function tokenizeJSON(input: string): { tokens?: JSONToken[]; error?: string } {
  const tokens: JSONToken[] = [];
  let i = 0;
  const n = input.length;

  const isWS = (ch: string) => /\s/.test(ch);

  function skipWS() {
    while (i < n && isWS(input[i])) i++;
  }

  function readString(): JSONToken | string {
    const start = i;
    i++; // skip opening "
    let result = "";
    while (i < n) {
      const ch = input[i];
      if (ch === '"') {
        i++;
        return { type: "string", value: result, pos: start };
      }
      if (ch === "\\") {
        i++;
        if (i >= n) return `Unterminated escape at ${i}`;
        const esc = input[i++];
        switch (esc) {
          case '"': result += '"'; break;
          case "\\": result += "\\"; break;
          case "/": result += "/"; break;
          case "b": result += "\b"; break;
          case "f": result += "\f"; break;
          case "n": result += "\n"; break;
          case "r": result += "\r"; break;
          case "t": result += "\t"; break;
          case "u": {
            const hex = input.substr(i, 4);
            if (!/^[0-9a-fA-F]{4}$/.test(hex)) return `Invalid unicode escape at ${i}`;
            result += String.fromCharCode(parseInt(hex, 16));
            i += 4;
            break;
          }
          default:
            return `Invalid escape sequence \\${esc} at ${i}`;
        }
      } else {
        result += ch;
        i++;
      }
    }
    return `Unterminated string starting at ${start}`;
  }

  function readNumber(): JSONToken {
    const start = i;
    let numStr = "";
    if (input[i] === "-") {
      numStr += "-";
      i++;
    }
    if (input[i] === "0") {
      numStr += "0";
      i++;
    } else {
      if (!/[0-9]/.test(input[i])) {
        // invalid number
      }
      while (i < n && /[0-9]/.test(input[i])) {
        numStr += input[i++];
      }
    }
    if (input[i] === ".") {
      numStr += ".";
      i++;
      while (i < n && /[0-9]/.test(input[i])) numStr += input[i++];
    }
    if (input[i] === "e" || input[i] === "E") {
      numStr += input[i++];
      if (input[i] === "+" || input[i] === "-") numStr += input[i++];
      while (i < n && /[0-9]/.test(input[i])) numStr += input[i++];
    }
    const val = Number(numStr);
    return { type: "number", value: val, pos: start };
  }

  while (i < n) {
    skipWS();
    if (i >= n) break;
    const ch = input[i];
    if (ch === "{") { tokens.push({ type: "brace_open", pos: i }); i++; continue; }
    if (ch === "}") { tokens.push({ type: "brace_close", pos: i }); i++; continue; }
    if (ch === "[") { tokens.push({ type: "bracket_open", pos: i }); i++; continue; }
    if (ch === "]") { tokens.push({ type: "bracket_close", pos: i }); i++; continue; }
    if (ch === ":") { tokens.push({ type: "colon", pos: i }); i++; continue; }
    if (ch === ",") { tokens.push({ type: "comma", pos: i }); i++; continue; }
    if (ch === '"') {
      const res = readString();
      if (typeof res === "string") return { error: res };
      tokens.push(res);
      continue;
    }
    if (ch === "-" || /[0-9]/.test(ch)) {
      tokens.push(readNumber());
      continue;
    }
    if (input.startsWith("true", i)) {
      tokens.push({ type: "boolean", value: true, pos: i }); i += 4; continue;
    }
    if (input.startsWith("false", i)) {
      tokens.push({ type: "boolean", value: false, pos: i }); i += 5; continue;
    }
    if (input.startsWith("null", i)) {
      tokens.push({ type: "null", value: null, pos: i }); i += 4; continue;
    }
    return { error: `Unexpected character '${ch}' at position ${i}` };
  }

  return { tokens };
}

/**
 * Analizador léxico principal para JWT
 */
export function AnalisisLexico(token: string): LexResult {
  const errors: string[] = [];

  const parts = token.split(".");
  if (parts.length !== 3) {
    errors.push("Error léxico: El token no contiene exactamente tres partes (header.payload.signature)");
    return { errors };
  }

  const [headerB64, payloadB64, signature] = parts;

  if (!headerB64 || !payloadB64 || !signature) {
    errors.push("Error léxico: Una de las partes del JWT está vacía");
    return { errors };
  }

  // Validar Base64URL
  if (!isBase64Url(headerB64)) errors.push("Error léxico: caracteres inválidos en header (esperado Base64URL)");
  if (!isBase64Url(payloadB64)) errors.push("Error léxico: caracteres inválidos en payload (esperado Base64URL)");
  // signature can contain '.'? typically base64url as well
  if (!/^[A-Za-z0-9\-_]+$/.test(signature)) errors.push("Error léxico: caracteres inválidos en signature (esperado Base64URL)");

  let headerDecoded = "";
  let payloadDecoded = "";
  if (errors.length === 0) {
    try {
      headerDecoded = base64UrlDecodeSafe(headerB64);
    } catch (e) {
      errors.push("Error léxico: fallo al decodificar header Base64URL");
    }
    try {
      payloadDecoded = base64UrlDecodeSafe(payloadB64);
    } catch (e) {
      errors.push("Error léxico: fallo al decodificar payload Base64URL");
    }
  }

  // Tokenizar los JSON decodificados (si hay)
  let headerTokens: JSONToken[] | undefined;
  let payloadTokens: JSONToken[] | undefined;

  if (headerDecoded) {
    const t = tokenizeJSON(headerDecoded);
    if (t.error) errors.push(`Error léxico (header): ${t.error}`);
    else headerTokens = t.tokens;
  }
  if (payloadDecoded) {
    const t = tokenizeJSON(payloadDecoded);
    if (t.error) errors.push(`Error léxico (payload): ${t.error}`);
    else payloadTokens = t.tokens;
  }

  if (errors.length > 0) return { errors };

  return {
    parts: { header: headerB64, payload: payloadB64, signature },
    headerDecoded,
    payloadDecoded,
    headerTokens,
    payloadTokens,
  }; 
}
