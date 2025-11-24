import { useEffect, useState } from 'react';
import { FiClock, FiCode, FiAlertCircle, FiCheckCircle, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { getHistory } from '../services/jwt.service';
import type { HistoryEntry } from '../types/history.types';

export const History = () => {
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        try {
            setLoading(true);
            const data = await getHistory();
            setHistory(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cargar el historial');
        } finally {
            setLoading(false);
        }
    };

    const toggleExpand = (id: string) => {
        setExpandedIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    };

    const getTypeColor = (tipo: string) => {
        if (tipo.includes('Léxico')) return 'from-purple-500 to-pink-500';
        if (tipo.includes('Sintáctico')) return 'from-blue-500 to-cyan-500';
        if (tipo.includes('Semántico')) return 'from-green-500 to-emerald-500';
        if (tipo.includes('Verificado') || tipo.includes('Decodificado')) return 'from-orange-500 to-amber-500';
        return 'from-gray-500 to-slate-500';
    };

    const renderDetails = (entry: HistoryEntry) => {
        const { tipo, detalles } = entry;

        // Análisis Léxico
        if (tipo.includes('Léxico')) {
            return (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-slate-800/50 rounded-lg p-4">
                            <h4 className="text-sm font-semibold text-cyan-400 mb-2">Header Tokens</h4>
                            <div className="text-xs text-gray-400">{detalles.headerTokens?.length || 0} tokens</div>
                        </div>
                        <div className="bg-slate-800/50 rounded-lg p-4">
                            <h4 className="text-sm font-semibold text-cyan-400 mb-2">Payload Tokens</h4>
                            <div className="text-xs text-gray-400">{detalles.payloadTokens?.length || 0} tokens</div>
                        </div>
                        <div className="bg-slate-800/50 rounded-lg p-4">
                            <h4 className="text-sm font-semibold text-cyan-400 mb-2">Signature</h4>
                            <div className="text-xs text-gray-400 truncate">{detalles.parts?.signature}</div>
                        </div>
                    </div>
                </div>
            );
        }

        // Análisis Sintáctico
        if (tipo.includes('Sintáctico')) {
            return (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-slate-800/50 rounded-lg p-4">
                            <h4 className="text-sm font-semibold text-blue-400 mb-2">Header</h4>
                            <pre className="text-xs text-gray-300 overflow-x-auto">
                                {JSON.stringify(detalles.header, null, 2)}
                            </pre>
                        </div>
                        <div className="bg-slate-800/50 rounded-lg p-4">
                            <h4 className="text-sm font-semibold text-blue-400 mb-2">Payload</h4>
                            <pre className="text-xs text-gray-300 overflow-x-auto">
                                {JSON.stringify(detalles.payload, null, 2)}
                            </pre>
                        </div>
                    </div>
                </div>
            );
        }

        // Análisis Semántico
        if (tipo.includes('Semántico')) {
            return (
                <div className="space-y-4">
                    {detalles.warnings && detalles.warnings.length > 0 && (
                        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <FiAlertCircle className="text-yellow-400" />
                                <h4 className="text-sm font-semibold text-yellow-400">Advertencias</h4>
                            </div>
                            <ul className="list-disc list-inside text-xs text-yellow-200 space-y-1">
                                {detalles.warnings.map((warning: string, idx: number) => (
                                    <li key={idx}>{warning}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {detalles.symbolTable && detalles.symbolTable.length > 0 && (
                        <div className="bg-slate-800/50 rounded-lg p-4">
                            <h4 className="text-sm font-semibold text-green-400 mb-3">Tabla de Símbolos</h4>
                            <div className="space-y-2">
                                {detalles.symbolTable.map((symbol: any, idx: number) => (
                                    <div key={idx} className="flex items-center justify-between text-xs bg-slate-900/50 rounded p-2">
                                        <span className="text-cyan-300 font-mono">{symbol.name}</span>
                                        <span className="text-purple-300">{symbol.type}</span>
                                        <span className="text-gray-300 truncate max-w-[200px]">{String(symbol.value)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {detalles.message && (
                        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                            <p className="text-sm text-green-300">{detalles.message}</p>
                        </div>
                    )}
                </div>
            );
        }

        // Verificación
        if (tipo.includes('Verificado')) {
            return (
                <div className="space-y-4">
                    <div className={`${detalles.valid ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'} border rounded-lg p-4`}>
                        <div className="flex items-center gap-2 mb-2">
                            {detalles.valid ? (
                                <FiCheckCircle className="text-green-400" />
                            ) : (
                                <FiAlertCircle className="text-red-400" />
                            )}
                            <h4 className={`text-sm font-semibold ${detalles.valid ? 'text-green-400' : 'text-red-400'}`}>
                                {detalles.valid ? 'Firma Válida' : 'Firma Inválida'}
                            </h4>
                        </div>
                        <p className="text-sm text-gray-300">{detalles.message}</p>
                    </div>
                </div>
            );
        }

        // Decodificado
        if (tipo.includes('Decodificado')) {
            return (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-slate-800/50 rounded-lg p-4">
                            <h4 className="text-sm font-semibold text-orange-400 mb-2">Header</h4>
                            <pre className="text-xs text-gray-300 overflow-x-auto">
                                {JSON.stringify(detalles.header, null, 2)}
                            </pre>
                        </div>
                        <div className="bg-slate-800/50 rounded-lg p-4">
                            <h4 className="text-sm font-semibold text-orange-400 mb-2">Payload</h4>
                            <pre className="text-xs text-gray-300 overflow-x-auto">
                                {JSON.stringify(detalles.payload, null, 2)}
                            </pre>
                        </div>
                    </div>
                    {detalles.fases && (
                        <div className="bg-slate-800/50 rounded-lg p-4">
                            <h4 className="text-sm font-semibold text-orange-400 mb-2">Fases</h4>
                            <div className="flex gap-4 text-xs">
                                {Object.entries(detalles.fases).map(([fase, estado]) => (
                                    <div key={fase} className="flex items-center gap-2">
                                        <span className="text-gray-400 capitalize">{fase}:</span>
                                        <span className={`font-semibold ${estado === 'OK' ? 'text-green-400' : 'text-red-400'}`}>
                                            {String(estado)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            );
        }

        // Fallback para otros tipos
        return (
            <div className="bg-slate-800/50 rounded-lg p-4">
                <pre className="text-xs text-gray-300 overflow-x-auto">
                    {JSON.stringify(detalles, null, 2)}
                </pre>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">Cargando historial...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 max-w-md">
                    <div className="flex items-center gap-2 mb-2">
                        <FiAlertCircle className="text-red-400 text-xl" />
                        <h3 className="text-lg font-semibold text-red-400">Error</h3>
                    </div>
                    <p className="text-gray-300">{error}</p>
                    <button
                        onClick={loadHistory}
                        className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <FiClock className="text-cyan-400 text-3xl" />
                        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                            Historial de Análisis
                        </h1>
                    </div>
                    <p className="text-gray-400">
                        Revisa el historial completo de todos los análisis y operaciones realizadas con JWT
                    </p>
                    <div className="mt-4 flex items-center gap-4">
                        <div className="text-sm text-gray-500">
                            Total de registros: <span className="text-cyan-400 font-semibold">{history.length}</span>
                        </div>
                        <button
                            onClick={loadHistory}
                            className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                        >
                            Actualizar
                        </button>
                    </div>
                </div>

                {/* History List */}
                {history.length === 0 ? (
                    <div className="bg-slate-900/50 border border-white/10 rounded-xl p-12 text-center">
                        <FiCode className="text-gray-600 text-6xl mx-auto mb-4" />
                        <p className="text-gray-400 text-lg">No hay registros en el historial</p>
                        <p className="text-gray-500 text-sm mt-2">Los análisis realizados aparecerán aquí</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {history.map((entry) => {
                            const isExpanded = expandedIds.has(entry._id);
                            const typeColor = getTypeColor(entry.tipo);

                            return (
                                <div
                                    key={entry._id}
                                    className="bg-slate-900/50 border border-white/10 rounded-xl overflow-hidden hover:border-cyan-500/30 transition-all"
                                >
                                    {/* Header */}
                                    <div
                                        className="p-4 cursor-pointer"
                                        onClick={() => toggleExpand(entry._id)}
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${typeColor} text-white`}>
                                                        {entry.tipo}
                                                    </span>
                                                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-gray-300">
                                                        {entry.algoritmo}
                                                    </span>
                                                </div>
                                                <div className="text-xs text-gray-500 font-mono truncate">
                                                    {entry.token}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 flex-shrink-0">
                                                <div className="text-right">
                                                    <div className="text-xs text-gray-400">
                                                        {formatDate(entry.fecha)}
                                                    </div>
                                                </div>
                                                <button className="text-gray-400 hover:text-cyan-400 transition-colors">
                                                    {isExpanded ? (
                                                        <FiChevronUp className="w-5 h-5" />
                                                    ) : (
                                                        <FiChevronDown className="w-5 h-5" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded Details */}
                                    {isExpanded && (
                                        <div className="border-t border-white/10 p-4 bg-slate-950/50">
                                            {renderDetails(entry)}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default History;