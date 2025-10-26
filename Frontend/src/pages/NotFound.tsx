import { Link } from 'react-router-dom';
import { FiHome, FiAlertCircle } from 'react-icons/fi';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center px-4 relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            <div className="text-center relative z-10">
                <div className="flex justify-center mb-8 animate-bounce">
                    <div className="relative">
                        <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-xl"></div>
                        <FiAlertCircle className="w-24 h-24 text-cyan-400 relative" />
                    </div>
                </div>

                <div className="relative inline-block mb-6">
                    <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 tracking-tight animate-pulse">
                        404
                    </h1>
                    <div className="absolute inset-0 text-9xl font-bold text-cyan-400/20 blur-2xl tracking-tight">
                        404
                    </div>
                </div>

                <div className="flex items-center justify-center gap-4 mb-6">
                    <div className="h-px w-16 bg-gradient-to-r from-transparent to-cyan-500"></div>
                    <div className="h-2 w-2 bg-cyan-400 rounded-full animate-pulse"></div>
                    <div className="h-px w-16 bg-gradient-to-l from-transparent to-cyan-500"></div>
                </div>

                <h2 className="text-3xl font-semibold text-white mb-4">
                    Página no encontrada
                </h2>

                <p className="text-gray-400 text-lg mb-10 max-w-md mx-auto leading-relaxed">
                    La página que buscas no existe o ha sido movida.
                </p>

                <Link
                    to="/"
                    className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-lg shadow-blue-500/25 hover:shadow-cyan-500/50 relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    <FiHome className="w-5 h-5 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
                    <span className="relative z-10">Volver al inicio</span>
                </Link>

            </div>
        </div>
    );
};