const API_BASE_URL: string = "https://acceptable-olwen-proyectolf-1e69aa9f.koyeb.app/api/jwt"


export interface GenericResponse {
    success: true;
    message: string;
}

export interface Token {
    type: string;
    value?: string;
    pos: number;
}

export interface LexicalAnalysis extends GenericResponse {
    parts: {
        header: string;
        payload: string;
        signature: string;
    },
    headerDecoded: string;
    payloadDecoded: string;
    headerTokens: Token[];
    payloadTokens: Token[];
}

export interface SyntacticAnalysis extends GenericResponse {
    header: unknown;
    payload: unknown;
}

export interface SemanticAnalysis extends GenericResponse {
    errors: string[];
    warnings: string[];
    symbolsTable: Array<{
        name: string;
        type: string;
        value: unknown;
    }>;
}

export interface GeneratedToken extends GenericResponse {
    token: string;
}

export interface DecodedToken extends GenericResponse {
    header: unknown;
    payload: unknown;
    raw: {
        headerDecoded: string;
        payloadDecoded: string;
        signature: string;
    }

}

type Response<T> =
    | { success: false; error?: string; errors?: string[] }
    | T;


export interface GenerateTokenData {
    header: unknown;
    payload: unknown;
    secret: string
}

export interface Analyze extends GenericResponse {
    lex?: LexicalAnalysis;
    syn?: SyntacticAnalysis;
    sem?: SemanticAnalysis;
}

export class JWTService {
    static async generate(data: GenerateTokenData): Promise<Response<GeneratedToken>> {

        try {
            const response = await fetch(`${API_BASE_URL}/Codificar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                return {
                    success: false,
                    error: errorData.error || "Error al generar el token",
                    errors: errorData.errores,
                };
            }

            const result = await response.json();
            return {
                success: true,
                message: result.mensaje || 'Token generado exitosamente',
                token: result.token,
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Error de conexión con el servidor',
            };
        }
    }


    static async decode(token: string): Promise<Response<DecodedToken>> {
        try {
            const response = await fetch(`${API_BASE_URL}/Decodificar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({token}),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                return {
                    success: false,
                    error: errorData.error || "Error al decodificar el token",
                    errors: errorData.errores,
                };
            }

            const result = await response.json();
            return {
                message: 'Token decodificado exitosamente',
                success: true,
                header: result.header,
                payload: result.payload,
                raw: {
                    headerDecoded: result.raw.headerDecoded,
                    payloadDecoded: result.raw.payloadDecoded,
                    signature: result.raw.signature,
                }
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Error de conexión con el servidor',
            };
        }
    }

    static async verifySignature(token: string, secret: string): Promise<Response<GenericResponse>> {
        try {
            const response = await fetch(`${API_BASE_URL}/Verificar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({token, secret}),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                return {
                    success: errorData.valid || false,
                    error: errorData.error || "Error al verificar la firma",
                    errors: errorData.errores,
                }
            }

            const result = await response.json();
            return {
                success: result.valid,
                message: result.valid ? 'Firma verificada correctamente' : 'Firma no válida',
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Error de conexión con el servidor',
            };
        }
    }

    static async lexicalAnalysis(token: string): Promise<Response<LexicalAnalysis>> {
        try {
            const response = await fetch(`${API_BASE_URL}/AnalisisLexico`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({token}),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                return {
                    success: false,
                    error: errorData.error || "Error durante el análisis léxico",
                    errors: errorData.errores,
                };
            }

            const result = await response.json();
            return {
                success: true,
                message: 'Análisis léxico realizado exitosamente',
                parts: result.resultado.parts,
                headerDecoded: result.resultado.headerDecoded,
                payloadDecoded: result.resultado.payloadDecoded,
                headerTokens: result.resultado.headerTokens,
                payloadTokens: result.resultado.payloadTokens,
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Error de conexión con el servidor',
            };
        }
    }

    static async syntacticAnalysis(token: string): Promise<Response<SyntacticAnalysis>> {
        try {
            const response = await fetch(`${API_BASE_URL}/AnalisisSintactico`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({token}),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                return {
                    success: false,
                    error: errorData.error || "Error durante el análisis sintáctico",
                    errors: errorData.errores,
                };
            }

            const result = await response.json();
            return {
                success: true,
                message: 'Análisis sintáctico realizado exitosamente',
                header: result.header,
                payload: result.payload,
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Error de conexión con el servidor',
            };
        }
    }

    static async semanticAnalysis(token: string): Promise<Response<SemanticAnalysis>> {
        try {
            const response = await fetch(`${API_BASE_URL}/AnalisisSemantico`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({token}),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                return {
                    success: false,
                    error: errorData.error || "Error durante el análisis semántico",
                    errors: errorData.errores,
                };
            }

            const result = await response.json();

            return {
                success: true,
                message: 'Análisis semántico realizado exitosamente',
                errors: result.errors,
                warnings: result.warnings,
                symbolsTable: result.symbolTable,
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Error de conexión con el servidor',
            };
        }
    }

    static async analyzeToken(token: string): Promise<Response<Analyze>> {
        try {
            const response = await fetch(`${API_BASE_URL}/Analisis`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({token}),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                return {
                    success: false,
                    error: errorData.error || "Error durante el análisis del token",
                    errors: errorData.errors,
                };
            }

            const result = await response.json();

            return {
                success: true,
                message: 'Análisis semántico realizado exitosamente',
                lex: result.lex,
                syn: result.syn,
                sem: result.sem,
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Error de conexión con el servidor',
            };
        }
    }
}

export const getHistory = async () => {
    const response = await fetch(`${API_BASE_URL}/Historial`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Error al obtener el historial');
    }

    return response.json();
};
