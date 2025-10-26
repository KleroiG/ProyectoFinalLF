import {useState} from 'react';
import {FiEye, FiLoader, FiAlertCircle, FiLock, FiUnlock} from 'react-icons/fi';
import JSONEditor from '../components/inputs/JSONEditor.tsx';
import {JWTService} from '../services/jwt.service.ts';

export default function Decode() {
    const [token, setToken] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [decodedHeader, setDecodedHeader] = useState<string>('');
    const [decodedPayload, setDecodedPayload] = useState<string>('');
    const [error, setError] = useState<string>('');

    const isFormValid = token.split('.').length === 3;

    const handleDecode = async () => {
        if (!isFormValid) return;

        setIsLoading(true);

        const response = await JWTService.decodeJWT({token});

        setIsLoading(false);

        if (response.success && response.header && response.payload) {
            setDecodedHeader(response.header);
            setDecodedPayload(response.payload);
            setError('');
        } else {
            setError(response.error || 'Error al decodificar el token');
            setDecodedHeader('');
            setDecodedPayload('');
        }
    };

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <div className="relative inline-block mb-6">
                        <div
                            className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-indigo-500/20 rounded-3xl blur-2xl animate-pulse"></div>
                    </div>
                    <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Decodificar JSON Web Token
                    </h1>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <div
                            className="group bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-xl hover:border-cyan-500/30 transition-all duration-300">
                            <div className="flex items-center gap-3 mb-4">
                                <div
                                    className="w-10 h-10 bg-gradient-to-br from-cyan-600/20 to-blue-600/20 rounded-lg flex items-center justify-center">
                                    <FiLock className="text-cyan-400 w-5 h-5"/>
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold">Token JWT</h3>
                                    <p className="text-gray-500 text-xs">Pega aquí el token a decodificar</p>
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

                        {(decodedHeader || decodedPayload) && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div
                                    className="group bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-xl hover:border-blue-500/30 transition-all duration-300">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div
                                            className="w-10 h-10 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 rounded-lg flex items-center justify-center">
                                            <span className="text-blue-400 font-bold text-sm">1</span>
                                        </div>
                                        <div>
                                            <h3 className="text-white font-semibold">Header Decodificado</h3>
                                            <p className="text-gray-500 text-xs">Metadatos y algoritmo del token</p>
                                        </div>
                                    </div>
                                    <JSONEditor
                                        label="Header (JSON)"
                                        value={JSON.stringify(decodedPayload, null, 2)}
                                        contentEditable={false}
                                        rows={6}
                                    />
                                </div>

                                <div
                                    className="group bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-xl hover:border-indigo-500/30 transition-all duration-300">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div
                                            className="w-10 h-10 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 rounded-lg flex items-center justify-center">
                                            <span className="text-indigo-400 font-bold text-sm">2</span>
                                        </div>
                                        <div>
                                            <h3 className="text-white font-semibold">Payload Decodificado</h3>
                                            <p className="text-gray-500 text-xs">Claims y datos del usuario</p>
                                        </div>
                                    </div>
                                    <JSONEditor
                                        label="Payload (JSON)"
                                        value={JSON.stringify(decodedPayload, null, 2)}
                                        contentEditable={false}
                                        rows={8}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="lg:col-span-1">
                        <div
                            className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-xl sticky top-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div
                                    className="w-10 h-10 bg-gradient-to-br from-cyan-600/20 to-blue-600/20 rounded-lg flex items-center justify-center">
                                    <FiUnlock className="text-cyan-400 w-5 h-5"/>
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold">Decodificación</h3>
                                    <p className="text-gray-500 text-xs">Sin verificación</p>
                                </div>
                            </div>

                            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-6">
                                <div className="flex items-start gap-3">
                                    <FiAlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5"/>
                                    <div className="text-xs text-amber-300">
                                        <p className="font-semibold mb-1">Importante:</p>
                                        <p>Esta operación solo decodifica el token. No verifica la firma ni valida
                                            su autenticidad.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-400">Token ingresado:</span>
                                    {isFormValid ? (
                                        <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                                            <FiEye className="w-4 h-4"/>
                                            Listo
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1.5 text-amber-400 font-medium">
                                            <FiAlertCircle className="w-4 h-4"/>
                                            Vacío
                                        </span>
                                    )}
                                </div>
                            </div>

                            <button
                                onClick={handleDecode}
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
                                        <span>Decodificando...</span>
                                    </>
                                ) : (
                                    <>
                                        <FiEye className="w-6 h-6"/>
                                        <span>Decodificar JWT</span>
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
                                <h3 className="text-xl font-bold text-white mb-2">Error al Decodificar Token</h3>
                                <div className="bg-rose-950/30 border border-rose-500/20 rounded-lg p-4">
                                    <p className="text-rose-300 text-sm font-mono">{error}</p>
                                </div>
                                <p className="text-gray-400 text-sm mt-3">
                                    Verifica que el token tenga el formato correcto (3 partes separadas por puntos).
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
