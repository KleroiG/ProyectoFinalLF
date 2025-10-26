// Tipos y constantes para JWT

export interface GenerateJWTRequest {
    header: string;
    payload: string;
    secretKey: string;
}

export interface GenerateJWTResponse {
    success: boolean;
    token?: string;
    error?: string;
}

export interface JWTError {
    message: string;
    details?: string;
}

export interface DecodeJWTRequest {
    token: string;
}

export interface DecodeJWTResponse {
    success: boolean;
    header?: string;
    payload?: string;
    error?: string;
}

