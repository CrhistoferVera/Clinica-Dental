import { Head } from '@inertiajs/react';
import { useState } from 'react';
import Header from '@/componentswelcome/Header';
import MenuPaciente from '@/componentswelcome/MenuPaciente';
import Turnos from '@/componentswelcome/Turnos';
import ConfirmarCita from '@/componentswelcome/ConfirmarCita';
import HistorialCitas from '@/componentswelcome/HistorialCitas';
import Footer from '@/componentswelcome/Footer';

export default function Welcome({ auth }) {
    const [activeTab, setActiveTab] = useState('reservar');

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
            <Head title="Clínica Dental - Inicio" />

            <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white">
                <Header />

                {/* Bienvenida */}
                <div className="text-center mt-20 mb-4 px-4">
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

                <Footer />
            </div>
        </>
    );
}
