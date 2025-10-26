import { Link, useLocation } from 'react-router-dom';
import { routes } from '../../routes';
import {FiCode, FiMenu, FiX} from 'react-icons/fi';
import type { Location } from 'history';

interface NavbarProps {
    isOpen: boolean;
    onToggle: () => void;
}

export default function Navbar({ isOpen, onToggle }: NavbarProps) {
    const location: Location = useLocation();

    return (
        <>
            {!isOpen && (
                <button
                    onClick={onToggle}
                    className="fixed top-4 left-4 z-50 lg:hidden p-3 bg-slate-900/90 backdrop-blur-md border border-white/10 rounded-xl text-white hover:bg-slate-800/90 transition-all shadow-lg"
                    aria-label="Abrir menú"
                >
                    <FiMenu className="w-6 h-6" />
                </button>
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed top-0 left-0 h-full z-40
                    bg-slate-900/95 backdrop-blur-xl border-r border-white/10
                    shadow-2xl shadow-black/20
                    transition-all duration-300 ease-in-out
                    overflow-hidden
                    ${isOpen ? 'w-64' : 'w-20 lg:w-20'}
                    ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}
            >
                <div className="flex flex-col h-full overflow-hidden">
                    <div className="relative h-20 flex items-center justify-between px-4">
                        <button
                            onClick={onToggle}
                            className="flex-shrink-0 p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all group"
                            aria-label="Toggle menu"
                        >
                            {isOpen ? (
                                <FiX className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
                            ) : (
                                <FiMenu className="w-6 h-6 group-hover:scale-110 transition-transform" />
                            )}
                        </button>

                        <Link
                            to="/"
                            className={`
                                flex items-center gap-3 overflow-hidden transition-all duration-300 group/logo
                                ${isOpen ? 'opacity-100 w-auto ml-2 mr-4' : 'opacity-0 w-0'}
                            `}
                            onClick={() => window.innerWidth < 1024 && onToggle()}
                        >
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 rounded-lg blur group-hover/logo:blur-md transition-all"></div>
                                    <div className="relative bg-gradient-to-br from-blue-600 to-cyan-600 p-2 rounded-lg transition-transform">
                                        <FiCode className="w-4 h-4 text-white" />
                                    </div>
                                </div>

                                <div className="flex flex-col">
                                    <span className="text-base font-bold leading-tight bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent group-hover/logo:from-blue-300 group-hover/logo:to-cyan-300 transition-all">
                                        JWT Pro Tools
                                    </span>
                                    <span className="text-[10px] text-gray-400 leading-tight">Pro Tools</span>
                                </div>
                            </div>
                        </Link>
                    </div>

                    <div className="px-4 py-3">
                        <div className="relative h-px">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent blur-sm"></div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50"></div>
                        </div>
                    </div>

                    <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                        {routes.map((route) => {
                            const Icon = route.icon;
                            const isActive = location.pathname === route.path;

                            return (
                                <Link
                                    key={route.path}
                                    to={route.path}
                                    onClick={() => window.innerWidth < 1024 && onToggle()}
                                    title={!isOpen ? route.name : ''}
                                    className={`
                                        group relative flex items-center gap-3 px-4 py-3.5 rounded-xl
                                        font-medium transition-all duration-300
                                        ${isActive
                                            ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/25 scale-[1.02]'
                                            : 'text-gray-400 hover:text-white hover:bg-white/5 hover:scale-[1.02]'
                                        }
                                    `}
                                >
                                    {isActive && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-cyan-300 rounded-r-full shadow-lg shadow-cyan-400/50"></div>
                                    )}

                                    <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 relative">
                                        <Icon className={`w-5 h-5 transition-transform duration-300 ${
                                            isActive ? 'scale-110' : 'group-hover:scale-110'
                                        }`} />
                                    </div>

                                    <span
                                        className={`
                                            transition-all duration-300 whitespace-nowrap overflow-hidden
                                            ${isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0'}
                                        `}
                                    >
                                        {route.name}
                                    </span>

                                    {!isOpen && (
                                        <div className="
                                            absolute left-full ml-6 px-4 py-2.5
                                            bg-slate-800 border border-white/20 rounded-xl
                                            text-sm font-medium text-white whitespace-nowrap
                                            opacity-0 invisible group-hover:opacity-100 group-hover:visible
                                            transition-all duration-200 pointer-events-none
                                            shadow-xl shadow-black/20 z-50
                                            before:content-[''] before:absolute before:right-full before:top-1/2 before:-translate-y-1/2
                                            before:border-8 before:border-transparent before:border-r-slate-800
                                        ">
                                            {route.name}
                                        </div>
                                    )}

                                    {!isActive && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-cyan-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:via-cyan-500/5 group-hover:to-blue-500/5 rounded-xl transition-all duration-300"></div>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                </div>
            </aside>
        </>
    );
}

