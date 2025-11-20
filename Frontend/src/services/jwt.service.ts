import type {GenerateJWTResponse, DecodeJWTRequest, DecodeJWTResponse} from '../types/jwt.types';

const API_BASE_URL: string = "https://acceptable-olwen-proyectolf-1e69aa9f.koyeb.app/api/jwt"

export class JWTService {
    static async generateJWT(data: { header: object; payload: object; secret: string }): Promise<GenerateJWTResponse> {
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
                    error: errorData.error || `Error ${response.status}: ${response.statusText}`,
                };
            }

            const result = await response.json();
            return {
                success: true,
                token: result.token,
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Error de conexión con el servidor',
            };
        }
    }

    static async decodeJWT(data: DecodeJWTRequest): Promise<DecodeJWTResponse> {
        try {
            const response = await fetch(`${API_BASE_URL}/Decodificar`, {
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
                    error: errorData.error || `Error ${response.status}: ${response.statusText}`,
                };
            }

            const result = await response.json();
            return {
                success: true,
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

    static async verifySignature(token: string, secret: string): Promise<{ success: boolean; data?: any; error?: string }> {
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
                    success: false,
                    error: errorData.error || `Error ${response.status}: ${response.statusText}`,
                };
            }

            const result = await response.json();
            return {
                success: true,
                data: result,
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Error de conexión con el servidor',
            };
        }
    }

    static async lexicalAnalysis(token: string): Promise<{ success: boolean; data?: any; error?: string }> {
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
                    error: errorData.error || `Error ${response.status}: ${response.statusText}`,
                };
            }

            const result = await response.json();
            return {
                success: true,
                data: result,
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Error de conexión con el servidor',
            };
        }
    }

    static async syntacticAnalysis(token: string): Promise<{ success: boolean; data?: any; error?: string }> {
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
                    error: errorData.error || `Error ${response.status}: ${response.statusText}`,
                };
            }

            const result = await response.json();
            return {
                success: true,
                data: result,
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Error de conexión con el servidor',
            };
        }
    }

    static async semanticAnalysis(token: string): Promise<{ success: boolean; data?: any; error?: string }> {
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
                    error: errorData.error || `Error ${response.status}: ${response.statusText}`,
                };
            }

            const result = await response.json();

            if (!result.valid) {
                return {
                    success: false,
                    error: result.errors.join(', ') || 'Errores semánticos desconocidos',
                }
            }

            const {valid, ...res} = result;

            return {
                success: true,
                data: res,
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Error de conexión con el servidor',
            };
        }
    }
}
