import { useState, useEffect } from 'react';
import { FiKey, FiLoader, FiCopy, FiCheck, FiAlertCircle } from 'react-icons/fi';
import JSONEditor from '../components/inputs/JSONEditor.tsx';
import SecretKeyInput from '../components/inputs/SecretKeyInput.tsx';
import { JWTService } from '../services/jwt.service.ts';
import {JSONService} from "../services/json.service.ts";

export default function Generate() {
    const [header, setHeader] = useState('{\n  "typ": "JWT",\n  "alg": "HS256"\n}');
    const [payload, setPayload] = useState('{\n  "sub": "1234567890",\n  "username": "John Doe",\n  "iat": 1516239022,\n  "exp": 15166380229,\n  "role": "user",\n  "aud": "https://proyecto-final-lf.vercel.app"\n}');
    const [secretKey, setSecretKey] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [generatedToken, setGeneratedToken] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [isCopied, setIsCopied] = useState(false);
    const [payloadError, setPayloadError] = useState<string>('');

    // Validaciones del payload
    useEffect(() => {
        if (!JSONService.isValidJSON(payload)) {
            setPayloadError('');
            return;
        }

        try {
            const payloadObj = JSON.parse(payload);
            const claims = Object.keys(payloadObj);

            // Validar mínimo 6 claims
            if (claims.length < 6) {
                setPayloadError(`El payload debe contener al menos 6 claims. Actualmente tiene ${claims.length} claim${claims.length !== 1 ? 's' : ''}.`);
                return;
            }

            // Validar que iat sea menor que exp
            if (payloadObj.iat !== undefined && payloadObj.exp !== undefined) {
                const iat = Number(payloadObj.iat);
                const exp = Number(payloadObj.exp);

                if (!isNaN(iat) && !isNaN(exp) && iat >= exp) {
                    setPayloadError('El claim "iat" (issued at) debe ser menor que "exp" (expiration). El token no puede expirar antes de ser emitido.');
                    return;
                }
            }

            setPayloadError('');
        } catch {
            setPayloadError('');
        }
    }, [payload]);

    const isPayloadValid = JSONService.isValidJSON(payload) && !payloadError;

    const isFormValid =
        header.trim() !== '' &&
        payload.trim() !== '' &&
        secretKey.trim() !== '' &&
        JSONService.isValidJSON(header) &&
        isPayloadValid;

    const handleGenerate = async () => {
        if (!isFormValid) return;

        setIsLoading(true);

        const response = await JWTService.generateJWT({
            header: JSON.parse(header),
            payload: JSON.parse(payload),
            secret: secretKey,
        });

        setIsLoading(false);

        if (response.success && response.token) {
            setGeneratedToken(response.token);
            setError('');
        } else {
            setError(response.error || 'Error al generar el token');
            setGeneratedToken('')
        }
    };

    const handleCopy = async () => {
        if (generatedToken) {
            await navigator.clipboard.writeText(generatedToken);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        }
    };

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <div className="relative inline-block mb-6">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-2xl animate-pulse"></div>
                    </div>
                    <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Generar JSON Web Token
                    </h1>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="group bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-xl hover:border-indigo-500/30 transition-all duration-300">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 rounded-lg flex items-center justify-center">
                                    <span className="text-indigo-400 font-bold text-sm">1</span>
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold">Header</h3>
                                    <p className="text-gray-500 text-xs">Metadatos del token (incluye algoritmo)</p>
                                </div>
                            </div>
                            <JSONEditor
                                label="Header (JSON)"
                                value={header}
                                onChange={setHeader}
                                placeholder="Ingresa el header en formato JSON"
                                rows={6}
                            />
                        </div>

                        <div className={`group bg-slate-900/50 backdrop-blur-sm border ${
                            !isPayloadValid && payload.trim() !== '' ? 'border-rose-500/50' : 'border-white/10'
                        } rounded-2xl p-6 shadow-xl hover:border-purple-500/30 transition-all duration-300`}>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-lg flex items-center justify-center">
                                    <span className="text-purple-400 font-bold text-sm">2</span>
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold">Payload</h3>
                                    <p className="text-gray-500 text-xs">Datos del usuario o claims</p>
                                </div>
                            </div>
                            <JSONEditor
                                label="Payload (JSON)"
                                value={payload}
                                onChange={setPayload}
                                placeholder='Ingresa el payload en formato JSON'
                                rows={8}
                            />
                            {payloadError && (
                                <div className="mt-3 flex items-start gap-2 text-rose-400 text-sm bg-rose-950/30 border border-rose-500/20 rounded-lg p-3">
                                    <FiAlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                    <span>{payloadError}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-xl sticky top-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-gradient-to-br from-pink-600/20 to-rose-600/20 rounded-lg flex items-center justify-center">
                                    <span className="text-pink-400 font-bold text-sm">3</span>
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold">Seguridad</h3>
                                    <p className="text-gray-500 text-xs">Clave de firma</p>
                                </div>
                            </div>

                            <SecretKeyInput
                                value={secretKey}
                                onChange={setSecretKey}
                                description="Esta clave se usará para firmar el token"
                            />

                            <div className="my-6 relative h-px">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-400/20 to-transparent"></div>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-purple-400 rounded-full shadow-lg shadow-purple-400/50"></div>
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-400">Estado del formulario:</span>
                                    {isFormValid ? (
                                        <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                                            <FiCheck className="w-4 h-4" />
                                            Válido
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1.5 text-amber-400 font-medium">
                                            <FiAlertCircle className="w-4 h-4" />
                                            Incompleto
                                        </span>
                                    )}
                                </div>
                            </div>

                            <button
                                onClick={handleGenerate}
                                disabled={!isFormValid || isLoading}
                                className={`
                                    group relative w-full py-4 px-6 rounded-xl font-semibold text-lg
                                    transition-all duration-300 overflow-hidden
                                    flex items-center justify-center gap-3
                                    ${isFormValid && !isLoading
                                        ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-[1.02] active:scale-[0.98]'
                                        : 'bg-slate-800 text-gray-500 cursor-not-allowed opacity-60'
                                    }
                                `}
                            >
                                {isFormValid && !isLoading && (
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                                    </div>
                                )}
                                
                                {isLoading ? (
                                    <>
                                        <FiLoader className="w-6 h-6 animate-spin" />
                                        <span>Generando...</span>
                                    </>
                                ) : (
                                    <>
                                        <FiKey className="w-6 h-6" />
                                        <span>Generar JWT</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {generatedToken && (
                    <div className="mt-8 bg-gradient-to-br from-slate-900/80 to-slate-900/50 backdrop-blur-sm border border-emerald-500/30 rounded-2xl p-8 shadow-2xl shadow-emerald-500/10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div>
                                    <h3 className="text-xl font-bold text-white">¡Token Generado Exitosamente!</h3>
                                </div>
                            </div>
                            <button
                                onClick={handleCopy}
                                className={`
                                    flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium
                                    border transition-all duration-300
                                    ${isCopied 
                                        ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' 
                                        : 'bg-white/5 hover:bg-white/10 border-white/20 hover:border-white/30 text-gray-300 hover:text-white hover:scale-105'
                                    }
                                `}
                            >
                                {isCopied ? (
                                    <>
                                        <FiCheck className="w-5 h-5" />
                                        <span>¡Copiado!</span>
                                    </>
                                ) : (
                                    <>
                                        <FiCopy className="w-5 h-5" />
                                        <span>Copiar Token</span>
                                    </>
                                )}
                            </button>
                        </div>
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 rounded-xl blur-xl"></div>
                            <div className="relative bg-slate-950/70 border border-white/10 rounded-xl p-6 overflow-x-auto">
                                <code className="text-sm text-emerald-400 font-mono break-all leading-relaxed">
                                    {generatedToken}
                                </code>
                            </div>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="mt-8 bg-gradient-to-br from-slate-900/80 to-slate-900/50 backdrop-blur-sm border border-rose-500/30 rounded-2xl p-8 shadow-2xl shadow-rose-500/10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-start gap-4">
                            <div className="relative">
                                <div className="absolute inset-0 bg-rose-400/30 rounded-full blur-xl animate-pulse"></div>
                                <div className="relative w-12 h-12 bg-rose-500/20 rounded-xl flex items-center justify-center">
                                    <FiAlertCircle className="w-7 h-7 text-rose-400" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-white mb-2">Error al Generar Token</h3>
                                <div className="bg-rose-950/30 border border-rose-500/20 rounded-lg p-4">
                                    <p className="text-rose-300 text-sm font-mono">{error}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}