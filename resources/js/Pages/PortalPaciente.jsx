import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import MenuPaciente from '@/componentswelcome/MenuPaciente';
import Turnos from '@/componentswelcome/Turnos';
import ConfirmarCita from '@/componentswelcome/ConfirmarCita';
import HistorialCitas from '@/componentswelcome/HistorialCitas';

export default function PortalPaciente() {
    const { auth } = usePage().props;
    const [activeTab, setActiveTab] = useState('reservar');
    const [menuOpen, setMenuOpen] = useState(false);

    const renderContent = () => {
        switch (activeTab) {
            case 'reservar':
                return (
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Reservar Nueva Cita</h2>
                            <p className="text-gray-600 mt-2">Selecciona el día y horario que mejor te convenga</p>
                        </div>
                        <Turnos />
                    </div>
                );
            case 'confirmar':
                return (
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <ConfirmarCita />
                    </div>
                );
            case 'historial':
                return (
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <HistorialCitas />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <>
            <Head title="Portal del Paciente - Clínica Dental" />

            <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white">
                {/* Header del Portal */}
                <header className="bg-white shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            <div className="flex items-center gap-4">
                                <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                                    <div className="bg-cyan-600 rounded-full p-2">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                    </div>
                                    <span className="text-lg font-bold text-gray-800">Clínica Dental</span>
                                </Link>
                                <span className="hidden sm:inline text-gray-300">|</span>
                                <span className="hidden sm:inline text-cyan-600 font-medium">Portal del Paciente</span>
                            </div>

                            <div className="flex items-center gap-4">
                                <Link
                                    href="/"
                                    className="hidden sm:flex items-center gap-2 text-gray-600 hover:text-cyan-600 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                    Inicio
                                </Link>

                                {/* User Menu */}
                                <div className="relative">
                                    <button
                                        onClick={() => setMenuOpen(!menuOpen)}
                                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        <div className="bg-cyan-100 text-cyan-600 rounded-full p-2">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <span className="hidden sm:inline text-gray-700 font-medium">{auth?.user?.name}</span>
                                        <svg className={`w-4 h-4 text-gray-400 transition-transform ${menuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    {menuOpen && (
                                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg py-2 z-50 border border-gray-100">
                                            <div className="px-4 py-3 border-b border-gray-100">
                                                <p className="text-sm font-medium text-gray-900">{auth?.user?.name} {auth?.user?.apellido}</p>
                                                <p className="text-xs text-gray-500">{auth?.user?.email}</p>
                                            </div>
                                            <Link
                                                href="/"
                                                className="sm:hidden flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                                </svg>
                                                Ir al Inicio
                                            </Link>
                                            <Link
                                                href={route('logout')}
                                                method="post"
                                                as="button"
                                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
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
                        </div>
                    </div>
                </header>

                {/* Bienvenida */}
                <div className="text-center mt-8 mb-4 px-4">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                        Bienvenido, <span className="text-cyan-600">{auth?.user?.name || 'Paciente'}</span>
                    </h1>
                    <p className="text-gray-600 mt-2 max-w-xl mx-auto">
                        Tu sonrisa es nuestra prioridad. Gestiona tus citas de manera fácil y rápida.
                    </p>
                </div>

                {/* Menú y Contenido */}
                <div className="max-w-4xl mx-auto px-4 pb-8">
                    <MenuPaciente activeTab={activeTab} setActiveTab={setActiveTab} />
                    {renderContent()}
                </div>

                {/* Info de contacto */}
                <div className="bg-cyan-600 text-white py-8 mt-8">
                    <div className="max-w-4xl mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                            <div className="flex flex-col items-center">
                                <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <h3 className="font-semibold">Ubicación</h3>
                                <p className="text-cyan-100 text-sm">Av. Principal #123</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <h3 className="font-semibold">Teléfono</h3>
                                <p className="text-cyan-100 text-sm">+591 123 456 789</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h3 className="font-semibold">Horarios</h3>
                                <p className="text-cyan-100 text-sm">Lun - Vie: 8:00 - 18:00</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="bg-gray-900 text-white py-6">
                    <div className="max-w-7xl mx-auto px-4 text-center text-gray-400 text-sm">
                        <p>&copy; {new Date().getFullYear()} Clínica Dental. Todos los derechos reservados.</p>
                    </div>
                </footer>
            </div>
        </>
    );
}
