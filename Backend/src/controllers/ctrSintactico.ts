import { JWTSegments } from "./ctrLexico";

class JSONParseError extends Error {
  pos: number;
  constructor(message: string, pos: number) {
    super(`${message} at position ${pos}`);
    this.pos = pos;
    this.name = "JSONParseError";
  }
}

export function parseJSON(input: string): any {
  let i = 0;
  const n = input.length;

  const isWS = (ch: string) => /\s/.test(ch);

  function skipWS() {
    while (i < n && isWS(input[i])) i++;
  }

  function parseValue(): any {
    skipWS();
    if (i >= n) throw new JSONParseError("Unexpected end of input", i);
    const ch = input[i];
    if (ch === "{") return parseObject();
    if (ch === "[") return parseArray();
    if (ch === '"') return parseString();
    if (ch === "t") return parseLiteral("true", true);
    if (ch === "f") return parseLiteral("false", false);
    if (ch === "n") return parseLiteral("null", null);
    return parseNumber();
  }

  function parseLiteral(lit: string, val: any) {
    if (input.substr(i, lit.length) === lit) {
      i += lit.length;
      return val;
    }
    throw new JSONParseError(`Expected literal ${lit}`, i);
  }

  function parseString(): string {
    if (input[i] !== '"') throw new JSONParseError("Expected string", i);
    i++;
    let result = "";
    while (i < n) {
      const ch = input[i];
      if (ch === '"') { i++; return result; }
      if (ch === "\\") {
        i++;
        if (i >= n) throw new JSONParseError("Unterminated escape", i);
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
            if (!/^[0-9a-fA-F]{4}$/.test(hex)) throw new JSONParseError("Invalid unicode escape", i);
            result += String.fromCharCode(parseInt(hex, 16));
            i += 4;
            break;
          }
          default:
            throw new JSONParseError(`Invalid escape \\${esc}`, i);
        }
      } else {
        result += ch;
        i++;
      }
    }
    throw new JSONParseError("Unterminated string", i);
  }

  function parseNumber(): number {
    const start = i;
    if (input[i] === "-") i++;
    if (input[i] === "0") {
      i++;
    } else {
      if (!/[0-9]/.test(input[i])) throw new JSONParseError("Invalid number", i);
      while (i < n && /[0-9]/.test(input[i])) i++;
    }
    if (input[i] === ".") {
      i++;
      if (!/[0-9]/.test(input[i])) throw new JSONParseError("Invalid number fraction", i);
      while (i < n && /[0-9]/.test(input[i])) i++;
    }
    if (input[i] === "e" || input[i] === "E") {
      i++;
      if (input[i] === "+" || input[i] === "-") i++;
      if (!/[0-9]/.test(input[i])) throw new JSONParseError("Invalid number exponent", i);
      while (i < n && /[0-9]/.test(input[i])) i++;
    }
    const numStr = input.substring(start, i);
    return Number(numStr);
  }

  function expect(ch: string) {
    skipWS();
    if (input[i] !== ch) throw new JSONParseError(`Expected '${ch}'`, i);
    i++;
  }

  function parseArray(): any[] {
    i++;
    const arr: any[] = [];
    skipWS();
    if (input[i] === "]") { i++; return arr; }
    while (true) {
      const val = parseValue();
      arr.push(val);
      skipWS();
      if (input[i] === "]") { i++; return arr; }
      expect(",");
      skipWS();
    }
  }

  function parseObject(): Record<string, any> {
    i++;
    const obj: Record<string, any> = {};
    skipWS();
    if (input[i] === "}") { i++; return obj; }
    while (true) {
      skipWS();
      const key = parseString();
      skipWS();
      expect(":");
      const val = parseValue();
      obj[key] = val;
      skipWS();
      if (input[i] === "}") { i++; return obj; }
      expect(",");
      skipWS();
    }
  }

  const value = parseValue();
  skipWS();
  if (i < n) throw new JSONParseError("Unexpected token after JSON value", i);
  return value;
}

/**
 * Función principal que recibe las partes (Base64URL) y valida sintaxis JSON
 */
export function analisisSintactico(parts: JWTSegments): { header?: any; payload?: any; error?: string } {
  try {
    // Se decodifica base64url
    const decode = (s: string) => {
      s = s.replace(/-/g, "+").replace(/_/g, "/");
      const pad = s.length % 4;
      if (pad) s += "=".repeat(4 - pad);
      return Buffer.from(s, "base64").toString("utf8");
    };
    const headerDecoded = decode(parts.header);
    const payloadDecoded = decode(parts.payload);

    const headerObj = parseJSON(headerDecoded);
    const payloadObj = parseJSON(payloadDecoded);

    return { header: headerObj, payload: payloadObj };
  } catch (err: any) {
    return { error: `Error sintáctico: ${err.message}` };
  }
}
