// Types for History entries

export interface HistoryEntry {
    _id: string;
    token: string;
    tipo: string;
    algoritmo: string;
    detalles: any; // Variable structure
    fecha: string;
    __v: number;
}

export interface LexicalDetails {
    parts: {
        header: string;
        payload: string;
        signature: string;
    };
    headerDecoded: string;
    payloadDecoded: string;
    headerTokens: Array<{
        type: string;
        value?: string | number;
        pos: number;
    }>;
    payloadTokens: Array<{
        type: string;
        value?: string | number;
        pos: number;
    }>;
}

export interface SyntacticDetails {
    header: Record<string, any>;
    payload: Record<string, any>;
}

export interface SemanticDetails {
    valid: boolean;
    errors: string[];
    warnings: string[];
    symbolTable: Array<{
        name: string;
        type: string;
        value: any;
    }>;
    message: string;
}

export interface VerificationDetails {
    valid: boolean;
    message: string;
    algorithm: string;
}

export interface DecodeDetails {
    message: string;
    valido: boolean;
    fases: {
        lexico: string;
        decodificacion: string;
        sintactico: string;
    };
    header: Record<string, any>;
    payload: Record<string, any>;
    raw: {
        headerDecoded: string;
        payloadDecoded: string;
        signature: string;
    };
}

