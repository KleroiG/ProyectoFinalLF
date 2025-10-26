import { Link } from 'react-router-dom';
import {
    FiPlusCircle,
    FiShield,
    FiEye,
    FiList,
    FiCode,
    FiLayers,
    FiArrowRight
} from 'react-icons/fi';

export default function Home() {
    const features = [
        {
            path: '/generate',
            icon: FiPlusCircle,
            title: 'Generar JWT',
            description: 'Crea tokens JWT personalizados con header, payload y clave secreta.',
            gradient: 'from-indigo-600 to-purple-600',
            glowColor: 'from-indigo-500/20 via-purple-500/20 to-pink-500/20'
        },
        {
            path: '/verify-signature',
            icon: FiShield,
            title: 'Verificar Firma',
            description: 'Valida la autenticidad y la integridad de un token JWT.',
            gradient: 'from-emerald-600 to-teal-600',
            glowColor: 'from-emerald-500/20 via-teal-500/20 to-cyan-500/20'
        },
        {
            path: '/decode',
            icon: FiEye,
            title: 'Decodificar JWT',
            description: 'Decodifica tokens para ver su contenido sin verificar la firma.',
            gradient: 'from-cyan-600 to-blue-600',
            glowColor: 'from-cyan-500/20 via-blue-500/20 to-indigo-500/20'
        },
        {
            path: '/lexical-analysis',
            icon: FiList,
            title: 'Análisis Léxico',
            description: 'Analiza la estructura de tokens JWT a nivel léxico.',
            gradient: 'from-orange-600 to-red-600',
            glowColor: 'from-orange-500/20 via-red-500/20 to-pink-500/20'
        },
        {
            path: '/syntactic-analysis',
            icon: FiCode,
            title: 'Análisis Sintáctico',
            description: 'Examina la sintaxis y estructura del token JWT.',
            gradient: 'from-violet-600 to-purple-600',
            glowColor: 'from-violet-500/20 via-purple-500/20 to-fuchsia-500/20'
        },
        {
            path: '/semantic-analysis',
            icon: FiLayers,
            title: 'Análisis Semántico',
            description: 'Valida el significado y contexto de los claims del token.',
            gradient: 'from-pink-600 to-rose-600',
            glowColor: 'from-pink-500/20 via-rose-500/20 to-red-500/20'
        }
    ];

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <div className="relative inline-block mb-8">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-3xl animate-pulse"></div>
                        <div className="relative">
                            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/30 transform hover:scale-105 transition-all duration-300">
                                <FiCode className="text-white w-12 h-12" />
                            </div>
                        </div>
                    </div>

                    <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                        JWT Pro Tools
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-300 mb-4 max-w-3xl mx-auto leading-relaxed">
                        Herramientas profesionales para trabajar con <span className="text-blue-400 font-semibold">JSON Web Tokens</span>
                    </p>

                    <p className="text-base text-gray-400 max-w-2xl mx-auto">
                        Genera, verifica, decodifica y analiza tokens JWT con nuestra suite completa de herramientas
                    </p>
                </div>

                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-white text-center mb-8">
                        Explora nuestras herramientas
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature) => {
                            const Icon = feature.icon;
                            return (
                                <Link
                                    key={feature.path}
                                    to={feature.path}
                                    className="group relative bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-xl hover:border-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.glowColor} rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500`}></div>

                                    <div className="relative">
                                        <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                            <Icon className="text-white w-7 h-7" />
                                        </div>

                                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                                            {feature.title}
                                        </h3>

                                        <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                                            {feature.description}
                                        </p>

                                        <div className="flex items-center gap-2 text-blue-400 text-sm font-medium group-hover:gap-3 transition-all">
                                            <span>Comenzar</span>
                                            <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};