import { Link } from '@inertiajs/react';

// resources/js/Components/Header.jsx
export default function Header() {
    return (
        <header
            className="w-full relative flex justify-center items-center md:h-40 h-32 bg-cover bg-center"
            style={{
                backgroundImage: "url('https://res.cloudinary.com/dnbklbswg/image/upload/v1764120370/fondo1-1_zfg4na.jpg')"
            }}
        >
            <div className="absolute top-4 right-4">
                <Link
                    href="/login"
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors bg-white/80"
                >
                    Iniciar sesión
                </Link>
            </div>
            {/* Logo circular */}
            <div className="absolute top-full transform -translate-y-1/2 bg-black rounded-full p-4  border-4 border-white">
                <img
                    src="https://res.cloudinary.com/dnbklbswg/image/upload/v1763039388/automatizando_logo-removebg-preview_eekag0.png"
                    alt="Logo"
                    className="md:w-28 md:h-28 h-20 w-20 object-contain rounded-full "
                />
            </div>
        </header>
    );
}
