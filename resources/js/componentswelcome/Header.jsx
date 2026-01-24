import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Header() {
    const { auth } = usePage().props;
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header
            className="w-full relative flex justify-center items-center md:h-40 h-32 bg-cover bg-center"
            style={{
                backgroundImage: "url('https://res.cloudinary.com/dnbklbswg/image/upload/v1764120370/fondo1-1_zfg4na.jpg')"
            }}
        >
            {auth?.user ? (
                <div className="absolute top-4 right-4">
                    <div className="relative">
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white/90 rounded-lg hover:bg-white transition-colors shadow-md"
                        >
                            <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span className="hidden sm:inline">{auth.user.name}</span>
                            <svg className={`w-4 h-4 transition-transform ${menuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {menuOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                                <div className="px-4 py-2 border-b border-gray-100">
                                    <p className="text-sm font-medium text-gray-900">{auth.user.name}</p>
                                    <p className="text-xs text-gray-500">{auth.user.email}</p>
                                </div>
                                <Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    Cerrar Sesión
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="absolute top-4 right-4">
                    <Link
                        href="/login"
                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors bg-white/80"
                    >
                        Iniciar sesión
                    </Link>
                </div>
            )}

            {/* Logo circular */}
            <div className="absolute top-full transform -translate-y-1/2 bg-black rounded-full p-4 border-4 border-white">
                <img
                    src="https://res.cloudinary.com/dnbklbswg/image/upload/v1763039388/automatizando_logo-removebg-preview_eekag0.png"
                    alt="Logo"
                    className="md:w-28 md:h-28 h-20 w-20 object-contain rounded-full"
                />
            </div>
        </header>
    );
}
