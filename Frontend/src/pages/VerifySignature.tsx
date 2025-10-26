import {useState} from 'react';
import {FiShield, FiLoader, FiAlertCircle, FiCheckCircle, FiLock, FiKey} from 'react-icons/fi';
import {JWTService} from "../services/jwt.service.ts";
import SecretKeyInput from "../components/inputs/SecretKeyInput.tsx";

export default function VerifySignature() {
    const [token, setToken] = useState('');
    const [secretKey, setSecretKey] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<{ isValid: boolean; message: string } | null>(null);
    const [error, setError] = useState<string>('');

    const isFormValid = token.split('.').length === 3 && secretKey.trim().length > 0;

    const handleVerify = async () => {
        if (!isFormValid) return;

        setIsLoading(true);

        const result = await JWTService.verifySignature(token, secretKey);
        setIsLoading(false);

        if (result.success) {
            setResult({
                isValid: result.data.valid,
                message: result.data.message,
            });

            setError('');
        } else {
            setError(result.error || 'Error desconocido durante la verificación');
            setResult(null);
        }
    };

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <div className="relative inline-block mb-6">
                        <div
                            className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-indigo-500/20 rounded-3xl blur-2xl animate-pulse"></div>
                    </div>
                    <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Verificar Firma
                    </h1>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Token Input */}
                        <div
                            className="group bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-xl hover:border-cyan-500/30 transition-all duration-300">
                            <div className="flex items-center gap-3 mb-4">
                                <div
                                    className="w-10 h-10 bg-gradient-to-br from-cyan-600/20 to-blue-600/20 rounded-lg flex items-center justify-center">
                                    <FiLock className="text-cyan-400 w-5 h-5"/>
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold">Token JWT</h3>
                                    <p className="text-gray-500 text-xs">Pega aquí el token a verificar</p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Token Codificado
                                </label>
                                <textarea
                                    value={token}
                                    onChange={(e) => setToken(e.target.value)}
                                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ..."
                                    rows={6}
                                    className="
                                        w-full px-4 py-3
                                        bg-slate-950/50
                                        border border-white/10 rounded-xl
                                        text-gray-200 text-sm font-mono
                                        placeholder-gray-500
                                        focus:outline-none focus:ring-3 focus:ring-cyan-500/50 focus:border-cyan-500/50
                                        transition-all duration-300
                                        resize-none
                                        scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent
                                        hover:scrollbar-thumb-white/30
                                    "
                                />
                            </div>
                        </div>

                        {/* Secret Key Input */}
                        <div
                            className="group bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-xl hover:border-purple-500/30 transition-all duration-300">
                            <div className="flex items-center gap-3 mb-4">
                                <div
                                    className="w-10 h-10 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-lg flex items-center justify-center">
                                    <FiKey className="text-purple-400 w-5 h-5"/>
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold">Clave Secreta</h3>
                                    <p className="text-gray-500 text-xs">Clave utilizada para firmar el token</p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <SecretKeyInput
                                    value={secretKey}
                                    onChange={setSecretKey}
                                    description="Clave secreta utilizada para verificar la firma del token."
                                />
                            </div>
                        </div>

                        {/* Result */}
                        {result && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div
                                    className={`group bg-slate-900/50 backdrop-blur-sm border rounded-2xl p-6 shadow-xl transition-all duration-300 ${
                                        result.isValid
                                            ? 'border-emerald-500/30 hover:border-emerald-500/50'
                                            : 'border-rose-500/30 hover:border-rose-500/50'
                                    }`}>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                            result.isValid
                                                ? 'bg-gradient-to-br from-emerald-600/20 to-green-600/20'
                                                : 'bg-gradient-to-br from-rose-600/20 to-red-600/20'
                                        }`}>
                                            {result.isValid ? (
                                                <FiCheckCircle className="text-emerald-400 w-5 h-5"/>
                                            ) : (
                                                <FiAlertCircle className="text-rose-400 w-5 h-5"/>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-white font-semibold">Resultado de la Verificación</h3>
                                            <p className="text-gray-500 text-xs">
                                                {result.isValid ? 'Firma verificada exitosamente' : 'La verificación falló'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className={`rounded-xl p-4 ${
                                        result.isValid
                                            ? 'bg-emerald-950/30 border border-emerald-500/20'
                                            : 'bg-rose-950/30 border border-rose-500/20'
                                    }`}>
                                        <div className="flex items-center gap-3">
                                            <div className={`w-3 h-3 rounded-full ${
                                                result.isValid ? 'bg-emerald-400' : 'bg-rose-400'
                                            }`}></div>
                                            <p className={`font-mono text-sm ${
                                                result.isValid ? 'text-emerald-300' : 'text-rose-300'
                                            }`}>
                                                {result.message}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div
                            className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-xl sticky top-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div
                                    className="w-10 h-10 bg-gradient-to-br from-cyan-600/20 to-blue-600/20 rounded-lg flex items-center justify-center">
                                    <FiShield className="text-cyan-400 w-5 h-5"/>
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold">Verificación</h3>
                                    <p className="text-gray-500 text-xs">Validación de firma</p>
                                </div>
                            </div>

                            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-6">
                                <div className="flex items-start gap-3">
                                    <FiShield className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5"/>
                                    <div className="text-xs text-blue-300">
                                        <p className="font-semibold mb-1">Verificación de firma:</p>
                                        <p>Se validará que el token fue firmado con la clave secreta proporcionada.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-400">Token:</span>
                                    {token.split('.').length === 3 ? (
                                        <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                                            <FiCheckCircle className="w-4 h-4"/>
                                            Válido
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1.5 text-amber-400 font-medium">
                                            <FiAlertCircle className="w-4 h-4"/>
                                            Requerido
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-400">Clave secreta:</span>
                                    {secretKey.trim().length > 0 ? (
                                        <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                                            <FiCheckCircle className="w-4 h-4"/>
                                            Proporcionada
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1.5 text-amber-400 font-medium">
                                            <FiAlertCircle className="w-4 h-4"/>
                                            Requerida
                                        </span>
                                    )}
                                </div>
                            </div>

                            <button
                                onClick={handleVerify}
                                disabled={!isFormValid || isLoading}
                                className={`
                                    group relative w-full py-4 px-6 rounded-xl font-semibold text-lg
                                    transition-all duration-300 overflow-hidden
                                    flex items-center justify-center gap-3
                                    ${isFormValid && !isLoading
                                    ? 'bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02] active:scale-[0.98]'
                                    : 'bg-slate-800 text-gray-500 cursor-not-allowed opacity-60'
                                }
                                `}
                            >
                                {isFormValid && !isLoading && (
                                    <div
                                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div
                                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                                    </div>
                                )}

                                {isLoading ? (
                                    <>
                                        <FiLoader className="w-6 h-6 animate-spin"/>
                                        <span>Verificando...</span>
                                    </>
                                ) : (
                                    <>
                                        <FiShield className="w-6 h-6"/>
                                        <span>Verificar Firma</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {error && (
                    <div
                        className="mt-8 bg-gradient-to-br from-slate-900/80 to-slate-900/50 backdrop-blur-sm border border-rose-500/30 rounded-2xl p-8 shadow-2xl shadow-rose-500/10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-start gap-4">
                            <div className="relative">
                                <div
                                    className="absolute inset-0 bg-rose-400/30 rounded-full blur-xl animate-pulse"></div>
                                <div
                                    className="relative w-12 h-12 bg-rose-500/20 rounded-xl flex items-center justify-center">
                                    <FiAlertCircle className="w-7 h-7 text-rose-400"/>
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-white mb-2">Error en la Verificación</h3>
                                <div className="bg-rose-950/30 border border-rose-500/20 rounded-lg p-4">
                                    <p className="text-rose-300 text-sm font-mono">{error}</p>
                                </div>
                                <p className="text-gray-400 text-sm mt-3">
                                    Verifica que el token y la clave secreta sean correctos.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
