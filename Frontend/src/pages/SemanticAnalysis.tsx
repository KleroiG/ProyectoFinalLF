import { useState } from 'react';
import { FiLayers, FiAlertTriangle, FiTable, FiLoader, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import TokenInput from '../components/inputs/TokenInput';
import { JWTService, type SemanticAnalysis as SemanticAnalysisResponse } from '../services/jwt.service';

export default function SemanticAnalysis() {
    const [token, setToken] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<SemanticAnalysisResponse | null>(null);
    const [error, setError] = useState<string>('');

    const hasToken = token.trim().length > 0;

    const handleAnalyze = async () => {
        if (!hasToken) return;

        setIsLoading(true);
        setError('');
        setResult(null);

        try {
            const response = await JWTService.semanticAnalysis(token);

            if (response.success) {
                setResult(response as SemanticAnalysisResponse);
            } else {
                if (response.errors && response.errors.length > 0) {
                    setError(response.errors.join('\n'));
                } else {
                    setError(response.error || 'Error en el análisis semántico');
                }
            }
        } catch (err) {
            setError('Error inesperado durante el análisis');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <div className="relative inline-block mb-6">
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-indigo-500/20 rounded-3xl blur-2xl animate-pulse"></div>
                    </div>
                    <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Análisis Semántico
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Validación de tipos y coherencia del JWT
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="group bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-xl hover:border-cyan-500/30 transition-all duration-300">
                            <TokenInput
                                value={token}
                                onChange={setToken}
                                label="Token Codificado"
                            />
                        </div>

                        {result && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {result.errors && result.errors.length > 0 && (
                                    <div className="group bg-slate-900/50 backdrop-blur-sm border border-rose-500/30 rounded-2xl p-6 shadow-xl hover:border-rose-500/50 transition-all duration-300">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 bg-gradient-to-br from-rose-600/20 to-red-600/20 rounded-lg flex items-center justify-center">
                                                <FiAlertCircle className="text-rose-400 w-5 h-5"/>
                                            </div>
                                            <div>
                                                <h3 className="text-white font-semibold">Errores Detectados</h3>
                                                <p className="text-gray-500 text-xs">{result.errors.length} error(es) encontrado(s)</p>
                                            </div>
                                        </div>
                                        <div className="bg-rose-950/30 border border-rose-500/20 rounded-xl p-4">
                                            <ul className="space-y-2">
                                                {result.errors.map((err, idx) => (
                                                    <li key={idx} className="text-rose-300 text-sm font-mono flex items-start gap-2">
                                                        <span className="text-rose-400 mt-1">•</span>
                                                        <span>{err}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                )}

                                {result.warnings && result.warnings.length > 0 && (
                                    <div className="group bg-slate-900/50 backdrop-blur-sm border border-amber-500/30 rounded-2xl p-6 shadow-xl hover:border-amber-500/50 transition-all duration-300">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 bg-gradient-to-br from-amber-600/20 to-yellow-600/20 rounded-lg flex items-center justify-center">
                                                <FiAlertTriangle className="text-amber-400 w-5 h-5"/>
                                            </div>
                                            <div>
                                                <h3 className="text-white font-semibold">Advertencias</h3>
                                                <p className="text-gray-500 text-xs">{result.warnings.length} advertencia(s) encontrada(s)</p>
                                            </div>
                                        </div>
                                        <div className="bg-amber-950/30 border border-amber-500/20 rounded-xl p-4">
                                            <ul className="space-y-2">
                                                {result.warnings.map((warning, idx) => (
                                                    <li key={idx} className="text-amber-300 text-sm font-mono flex items-start gap-2">
                                                        <span className="text-amber-400 mt-1">•</span>
                                                        <span>{warning}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                )}

                                {result.symbolsTable && result.symbolsTable.length > 0 && (
                                    <div className="group bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-xl hover:border-cyan-500/30 transition-all duration-300">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 bg-gradient-to-br from-cyan-600/20 to-blue-600/20 rounded-lg flex items-center justify-center">
                                                <FiTable className="text-cyan-400 w-5 h-5"/>
                                            </div>
                                            <div>
                                                <h3 className="text-white font-semibold">Tabla de Símbolos</h3>
                                                <p className="text-gray-500 text-xs">{result.symbolsTable.length} símbolo(s) identificado(s)</p>
                                            </div>
                                        </div>
                                        <div className="bg-slate-950/50 border border-white/10 rounded-xl p-4">
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-sm">
                                                    <thead>
                                                        <tr className="border-b border-white/10">
                                                            <th className="text-left text-gray-400 font-medium py-2 px-3">Nombre</th>
                                                            <th className="text-left text-gray-400 font-medium py-2 px-3">Tipo</th>
                                                            <th className="text-left text-gray-400 font-medium py-2 px-3">Valor</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {result.symbolsTable.map((symbol, idx) => (
                                                            <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                                <td className="py-2 px-3 text-cyan-400 font-semibold">{symbol.name}</td>
                                                                <td className="py-2 px-3 text-purple-400 font-mono">{symbol.type}</td>
                                                                <td className="py-2 px-3 text-gray-300 font-mono break-all">
                                                                    {typeof symbol.value === 'object'
                                                                        ? JSON.stringify(symbol.value)
                                                                        : String(symbol.value)}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-xl sticky top-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-gradient-to-br from-cyan-600/20 to-blue-600/20 rounded-lg flex items-center justify-center">
                                    <FiLayers className="text-cyan-400 w-5 h-5"/>
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold">Análisis</h3>
                                    <p className="text-gray-500 text-xs">Validación semántica</p>
                                </div>
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-400">Estado del token:</span>
                                    {hasToken ? (
                                        <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                                            <FiCheckCircle className="w-4 h-4"/>
                                            Ingresado
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
                                disabled={!hasToken || isLoading}
                                className={`
                                    group relative w-full py-4 px-6 rounded-xl font-semibold text-lg
                                    transition-all duration-300 overflow-hidden
                                    flex items-center justify-center gap-3
                                    ${hasToken && !isLoading
                                        ? 'bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02] active:scale-[0.98]'
                                        : 'bg-slate-800 text-gray-500 cursor-not-allowed opacity-60'
                                    }
                                `}
                            >
                                {hasToken && !isLoading && (
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
                                        <FiLayers className="w-6 h-6"/>
                                        <span>Iniciar Análisis</span>
                                    </>
                                )}
                            </button>

                            {result && (
                                <div className="mt-6 pt-6 border-t border-white/10">
                                    <div className="flex items-center gap-2 mb-3">
                                        <FiCheckCircle className="w-5 h-5 text-emerald-400"/>
                                        <span className="text-sm font-semibold text-emerald-400">Análisis Completado</span>
                                    </div>
                                    <div className="space-y-2 text-xs">
                                        {result.errors && result.errors.length > 0 && (
                                            <p className="text-rose-400">
                                                • {result.errors.length} error(es)
                                            </p>
                                        )}
                                        {result.warnings && result.warnings.length > 0 && (
                                            <p className="text-amber-400">
                                                • {result.warnings.length} advertencia(s)
                                            </p>
                                        )}
                                        {result.symbolsTable && result.symbolsTable.length > 0 && (
                                            <p className="text-cyan-400">
                                                • {result.symbolsTable.length} símbolo(s)
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
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
                                    {error.split('\n').length > 1 ? (
                                        <ul className="space-y-2">
                                            {error.split('\n').map((err, idx) => (
                                                <li key={idx} className="text-rose-300 text-sm font-mono flex items-start gap-2">
                                                    <span className="text-rose-400 mt-1">•</span>
                                                    <span>{err}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-rose-300 text-sm font-mono">{error}</p>
                                    )}
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
