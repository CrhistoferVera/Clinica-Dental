import { Head } from '@inertiajs/react';
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import CalendarioAgenda from '@/componentswelcome/Calendario/CalendarioAgenda';
import ListaCitas from '@/componentswelcome/Calendario/ListaCitas';

export default function GestionCitas({ auth }) {
    const [vistaActual, setVistaActual] = useState('calendario'); // 'calendario' o 'lista'

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Gestión de Citas</h2>}
        >
            <Head title="Gestión de Citas" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Selector de Vista */}
                    <div className="mb-6 flex justify-center gap-4">
                        <button
                            onClick={() => setVistaActual('calendario')}
                            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                                vistaActual === 'calendario'
                                    ? 'bg-black text-white'
                                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                            📅 Vista Calendario
                        </button>
                        <button
                            onClick={() => setVistaActual('lista')}
                            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                                vistaActual === 'lista'
                                    ? 'bg-black text-white'
                                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                            📋 Vista Lista
                        </button>
                    </div>

                    {/* Contenido según la vista */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        {vistaActual === 'calendario' ? (
                            <div className="p-6">
                                <CalendarioAgenda />
                            </div>
                        ) : (
                            <div className="p-6">
                                <ListaCitas />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
