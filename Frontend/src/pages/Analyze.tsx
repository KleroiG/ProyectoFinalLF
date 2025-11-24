import { useState } from 'react';
import { FiZap, FiLoader, FiAlertCircle, FiCheckCircle, FiList, FiCode, FiLayers, FiHash, FiFileText, FiTable, FiAlertTriangle } from 'react-icons/fi';
import TokenInput from '../components/inputs/TokenInput';
import JSONEditor from '../components/inputs/JSONEditor';
import { JWTService, type Analyze as AnalyzeResponse } from '../services/jwt.service';

export default function Analyze() {
    const [token, setToken] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<AnalyzeResponse | null>(null);
    const [error, setError] = useState<string>('');

    const hasToken = token.trim().length > 0;

    const handleAnalyze = async () => {
        if (!hasToken) return;

        setIsLoading(true);
        setError('');
        setResult(null);

        try {
            const response = await JWTService.analyzeToken(token);

            if (response.success) {
                setResult(response as AnalyzeResponse);
            } else {
                if (response.errors && response.errors.length > 0) {
                    setError(response.errors.join('\n'));
                } else {
                    setError(response.error || 'Error en el análisis completo');
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
                    <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                        Análisis Completo
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Análisis léxico, sintáctico y semántico del JWT
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
                                {result.lex && (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 bg-gradient-to-br from-cyan-600/20 to-blue-600/20 rounded-lg flex items-center justify-center">
                                                <FiList className="text-cyan-400 w-5 h-5"/>
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-bold text-white">Análisis Léxico</h2>
                                                <p className="text-gray-500 text-sm">Tokenización de componentes</p>
                                            </div>
                                        </div>

                                        {/* Partes del Token */}
                                        <div className="group bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-xl hover:border-emerald-500/30 transition-all duration-300">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-10 h-10 bg-gradient-to-br from-emerald-600/20 to-green-600/20 rounded-lg flex items-center justify-center">
                                                    <FiHash className="text-emerald-400 w-5 h-5"/>
                                                </div>
                                                <div>
                                                    <h3 className="text-white font-semibold">Partes del Token</h3>
                                                    <p className="text-gray-500 text-xs">Segmentos codificados</p>
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <div className="bg-slate-950/50 border border-white/10 rounded-xl p-4">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="text-xs font-semibold text-cyan-400">HEADER</span>
                                                        <span className="text-xs text-gray-500">({result.lex.parts.header.length} chars)</span>
                                                    </div>
                                                    <p className="text-gray-300 text-sm font-mono break-all">{result.lex.parts.header}</p>
                                                </div>
                                                <div className="bg-slate-950/50 border border-white/10 rounded-xl p-4">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="text-xs font-semibold text-purple-400">PAYLOAD</span>
                                                        <span className="text-xs text-gray-500">({result.lex.parts.payload.length} chars)</span>
                                                    </div>
                                                    <p className="text-gray-300 text-sm font-mono break-all">{result.lex.parts.payload}</p>
                                                </div>
                                                <div className="bg-slate-950/50 border border-white/10 rounded-xl p-4">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="text-xs font-semibold text-pink-400">SIGNATURE</span>
                                                        <span className="text-xs text-gray-500">({result.lex.parts.signature.length} chars)</span>
                                                    </div>
                                                    <p className="text-gray-300 text-sm font-mono break-all">{result.lex.parts.signature}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="group bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-xl hover:border-indigo-500/30 transition-all duration-300">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 rounded-lg flex items-center justify-center">
                                                    <FiList className="text-indigo-400 w-5 h-5"/>
                                                </div>
                                                <div>
                                                    <h3 className="text-white font-semibold">Tokens del Header</h3>
                                                    <p className="text-gray-500 text-xs">{result.lex.headerTokens.length} tokens</p>
                                                </div>
                                            </div>
                                            <div className="bg-slate-950/50 border border-white/10 rounded-xl p-4">
                                                <div className="overflow-x-auto">
                                                    <table className="w-full text-sm">
                                                        <thead>
                                                            <tr className="border-b border-white/10">
                                                                <th className="text-left text-gray-400 font-medium py-2 px-3">Pos</th>
                                                                <th className="text-left text-gray-400 font-medium py-2 px-3">Tipo</th>
                                                                <th className="text-left text-gray-400 font-medium py-2 px-3">Valor</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {result.lex.headerTokens.map((token, idx) => (
                                                                <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                                    <td className="py-2 px-3 text-cyan-400 font-mono">{token.pos}</td>
                                                                    <td className="py-2 px-3 text-purple-400 font-semibold">{token.type.toUpperCase()}</td>
                                                                    <td className="py-2 px-3 text-gray-300 font-mono">{token.value || '-'}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="group bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-xl hover:border-pink-500/30 transition-all duration-300">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-10 h-10 bg-gradient-to-br from-pink-600/20 to-rose-600/20 rounded-lg flex items-center justify-center">
                                                    <FiList className="text-pink-400 w-5 h-5"/>
                                                </div>
                                                <div>
                                                    <h3 className="text-white font-semibold">Tokens del Payload</h3>
                                                    <p className="text-gray-500 text-xs">{result.lex.payloadTokens.length} tokens</p>
                                                </div>
                                            </div>
                                            <div className="bg-slate-950/50 border border-white/10 rounded-xl p-4">
                                                <div className="overflow-x-auto">
                                                    <table className="w-full text-sm">
                                                        <thead>
                                                            <tr className="border-b border-white/10">
                                                                <th className="text-left text-gray-400 font-medium py-2 px-3">Pos</th>
                                                                <th className="text-left text-gray-400 font-medium py-2 px-3">Tipo</th>
                                                                <th className="text-left text-gray-400 font-medium py-2 px-3">Valor</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {result.lex.payloadTokens.map((token, idx) => (
                                                                <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                                    <td className="py-2 px-3 text-cyan-400 font-mono">{token.pos}</td>
                                                                    <td className="py-2 px-3 text-purple-400 font-semibold">{token.type.toUpperCase()}</td>
                                                                    <td className="py-2 px-3 text-gray-300 font-mono">{token.value || '-'}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {result.syn && (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-lg flex items-center justify-center">
                                                <FiCode className="text-purple-400 w-5 h-5"/>
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-bold text-white">Análisis Sintáctico</h2>
                                                <p className="text-gray-500 text-sm">Validación de estructura</p>
                                            </div>
                                        </div>

                                        {/* Header Parseado */}
                                        <div className="group bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-xl hover:border-cyan-500/30 transition-all duration-300">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-10 h-10 bg-gradient-to-br from-cyan-600/20 to-blue-600/20 rounded-lg flex items-center justify-center">
                                                    <FiFileText className="text-cyan-400 w-5 h-5"/>
                                                </div>
                                                <div>
                                                    <h3 className="text-white font-semibold">Header Parseado</h3>
                                                    <p className="text-gray-500 text-xs">Estructura del encabezado</p>
                                                </div>
                                            </div>
                                            <JSONEditor
                                                label="Header (JSON)"
                                                value={JSON.stringify(result.syn.header, null, 2)}
                                                contentEditable={false}
                                                rows={6}
                                            />
                                        </div>

                                        {/* Payload Parseado */}
                                        <div className="group bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-xl hover:border-indigo-500/30 transition-all duration-300">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 rounded-lg flex items-center justify-center">
                                                    <FiFileText className="text-indigo-400 w-5 h-5"/>
                                                </div>
                                                <div>
                                                    <h3 className="text-white font-semibold">Payload Parseado</h3>
                                                    <p className="text-gray-500 text-xs">Estructura de datos</p>
                                                </div>
                                            </div>
                                            <JSONEditor
                                                label="Payload (JSON)"
                                                value={JSON.stringify(result.syn.payload, null, 2)}
                                                contentEditable={false}
                                                rows={8}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Análisis Semántico */}
                                {result.sem && (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 bg-gradient-to-br from-emerald-600/20 to-green-600/20 rounded-lg flex items-center justify-center">
                                                <FiLayers className="text-emerald-400 w-5 h-5"/>
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-bold text-white">Análisis Semántico</h2>
                                                <p className="text-gray-500 text-sm">Validación de tipos y coherencia</p>
                                            </div>
                                        </div>

                                        {/* Errores */}
                                        {result.sem.errors && result.sem.errors.length > 0 && (
                                            <div className="group bg-slate-900/50 backdrop-blur-sm border border-rose-500/30 rounded-2xl p-6 shadow-xl hover:border-rose-500/50 transition-all duration-300">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-rose-600/20 to-red-600/20 rounded-lg flex items-center justify-center">
                                                        <FiAlertCircle className="text-rose-400 w-5 h-5"/>
                                                    </div>
                                                    <div>
                                                        <h3 className="text-white font-semibold">Errores Detectados</h3>
                                                        <p className="text-gray-500 text-xs">{result.sem.errors.length} error(es)</p>
                                                    </div>
                                                </div>
                                                <div className="bg-rose-950/30 border border-rose-500/20 rounded-xl p-4">
                                                    <ul className="space-y-2">
                                                        {result.sem.errors.map((err, idx) => (
                                                            <li key={idx} className="text-rose-300 text-sm font-mono flex items-start gap-2">
                                                                <span className="text-rose-400 mt-1">•</span>
                                                                <span>{err}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        )}

                                        {/* Advertencias */}
                                        {result.sem.warnings && result.sem.warnings.length > 0 && (
                                            <div className="group bg-slate-900/50 backdrop-blur-sm border border-amber-500/30 rounded-2xl p-6 shadow-xl hover:border-amber-500/50 transition-all duration-300">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-amber-600/20 to-yellow-600/20 rounded-lg flex items-center justify-center">
                                                        <FiAlertTriangle className="text-amber-400 w-5 h-5"/>
                                                    </div>
                                                    <div>
                                                        <h3 className="text-white font-semibold">Advertencias</h3>
                                                        <p className="text-gray-500 text-xs">{result.sem.warnings.length} advertencia(s)</p>
                                                    </div>
                                                </div>
                                                <div className="bg-amber-950/30 border border-amber-500/20 rounded-xl p-4">
                                                    <ul className="space-y-2">
                                                        {result.sem.warnings.map((warning, idx) => (
                                                            <li key={idx} className="text-amber-300 text-sm font-mono flex items-start gap-2">
                                                                <span className="text-amber-400 mt-1">•</span>
                                                                <span>{warning}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        )}

                                        {/* Tabla de Símbolos */}
                                        {result.sem.symbolsTable && result.sem.symbolsTable.length > 0 && (
                                            <div className="group bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-xl hover:border-cyan-500/30 transition-all duration-300">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-600/20 to-blue-600/20 rounded-lg flex items-center justify-center">
                                                        <FiTable className="text-cyan-400 w-5 h-5"/>
                                                    </div>
                                                    <div>
                                                        <h3 className="text-white font-semibold">Tabla de Símbolos</h3>
                                                        <p className="text-gray-500 text-xs">{result.sem.symbolsTable.length} símbolo(s)</p>
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
                                                                {result.sem.symbolsTable.map((symbol, idx) => (
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
                        )}
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-xl sticky top-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-gradient-to-br from-cyan-600/20 to-blue-600/20 rounded-lg flex items-center justify-center">
                                    <FiZap className="text-cyan-400 w-5 h-5"/>
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold">Análisis</h3>
                                    <p className="text-gray-500 text-xs">Completo del token</p>
                                </div>
                            </div>

                            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-6">
                                <div className="flex items-start gap-3">
                                    <FiZap className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5"/>
                                    <div className="text-xs text-blue-300">
                                        <p className="font-semibold mb-1">Análisis completo:</p>
                                        <p>Incluye análisis léxico, sintáctico y semántico en un solo proceso.</p>
                                    </div>
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
                                        <FiZap className="w-6 h-6"/>
                                        <span>Analizar Token</span>
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
                                        {result.lex && (
                                            <p className="text-cyan-400">
                                                ✓ Análisis léxico
                                            </p>
                                        )}
                                        {result.syn && (
                                            <p className="text-purple-400">
                                                ✓ Análisis sintáctico
                                            </p>
                                        )}
                                        {result.sem && (
                                            <p className="text-emerald-400">
                                                ✓ Análisis semántico
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
