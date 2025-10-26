import React, { useState } from 'react';
import { FiSearch, FiLoader, FiAlertCircle, FiCheckCircle, FiLock } from 'react-icons/fi';

interface AnalyzeProps {
    title: string;
    onAnalyze: (token: string) => Promise<{ success: boolean; data?: any; error?: string }>;
    icon?: React.ReactNode;
}

export default function Analyze({ title, onAnalyze, icon }: AnalyzeProps) {
    const [token, setToken] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string>('');

    const isFormValid = token.split('.').length === 3;

    const handleAnalyze = async () => {
        if (!isFormValid) return;

        setIsLoading(true);

        try {
            const response = await onAnalyze(token);

            if (response.success) {
                setResult(response.data);
                setError('');
            } else {
                setError(response.error || 'Error en el análisis');
                setResult(null);
            }
        } catch (err) {
            setError('Error inesperado durante el análisis');
            setResult(null);
        } finally {
            setIsLoading(false);
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
                        {title}
                    </h1>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="group bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-xl hover:border-cyan-500/30 transition-all duration-300">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-gradient-to-br from-cyan-600/20 to-blue-600/20 rounded-lg flex items-center justify-center">
                                    <FiLock className="text-cyan-400 w-5 h-5"/>
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold">Token JWT</h3>
                                    <p className="text-gray-500 text-xs">Pega aquí el token a analizar</p>
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

                        {result && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="group bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-xl hover:border-emerald-500/30 transition-all duration-300">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-600/20 to-green-600/20 rounded-lg flex items-center justify-center">
                                            <FiCheckCircle className="text-emerald-400 w-5 h-5"/>
                                        </div>
                                        <div>
                                            <h3 className="text-white font-semibold">Resultado del Análisis</h3>
                                            <p className="text-gray-500 text-xs">{result?.message || 'Análisis completado exitosamente'}</p>
                                        </div>
                                    </div>
                                    {(() => {
                                        if (typeof result === 'string') {
                                            return (
                                                <div className="bg-slate-950/50 border border-white/10 rounded-xl p-4">
                                                    <pre className="text-gray-200 text-sm font-mono whitespace-pre-wrap overflow-x-auto">
                                                        {result}
                                                    </pre>
                                                </div>
                                            );
                                        }

                                        if (typeof result === 'object' && result !== null) {
                                            const { message, ...displayData } = result;
                                            if (Object.keys(displayData).length > 0) {
                                                return (
                                                    <div className="bg-slate-950/50 border border-white/10 rounded-xl p-4">
                                                        <pre className="text-gray-200 text-sm font-mono whitespace-pre-wrap overflow-x-auto">
                                                            {JSON.stringify(displayData, null, 2)}
                                                        </pre>
                                                    </div>
                                                );
                                            }
                                        }

                                        return null;
                                    })()}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-xl sticky top-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-gradient-to-br from-cyan-600/20 to-blue-600/20 rounded-lg flex items-center justify-center">
                                    {icon || <FiSearch className="text-cyan-400 w-5 h-5"/>}
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold">Análisis</h3>
                                    <p className="text-gray-500 text-xs">Procesamiento de token</p>
                                </div>
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-400">Token ingresado:</span>
                                    {isFormValid ? (
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
                            </div>

                            <button
                                onClick={handleAnalyze}
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
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                                    </div>
                                )}

                                {isLoading ? (
                                    <>
                                        <FiLoader className="w-6 h-6 animate-spin"/>
                                        <span>Analizando...</span>
                                    </>
                                ) : (
                                    <>
                                        {icon || <FiSearch className="w-6 h-6"/>}
                                        <span>Iniciar Análisis</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="mt-8 bg-gradient-to-br from-slate-900/80 to-slate-900/50 backdrop-blur-sm border border-rose-500/30 rounded-2xl p-8 shadow-2xl shadow-rose-500/10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-start gap-4">
                            <div className="relative">
                                <div className="absolute inset-0 bg-rose-400/30 rounded-full blur-xl animate-pulse"></div>
                                <div className="relative w-12 h-12 bg-rose-500/20 rounded-xl flex items-center justify-center">
                                    <FiAlertCircle className="w-7 h-7 text-rose-400"/>
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-white mb-2">Error en el Análisis</h3>
                                <div className="bg-rose-950/30 border border-rose-500/20 rounded-lg p-4">
                                    <p className="text-rose-300 text-sm font-mono">{error}</p>
                                </div>
                                <p className="text-gray-400 text-sm mt-3">
                                    Verifica que el token tenga el formato correcto y sea válido.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
