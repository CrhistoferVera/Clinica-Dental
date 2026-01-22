import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

// Datos hardcodeados para demostración
const STATS = {
    totalPacientes: 156,
    citasHoy: 8,
    citasPendientes: 23,
    recetasMes: 45,
};

const CITAS_HOY = [
    { id: 1, hora: '09:00', paciente: 'Juan Pérez', motivo: 'Control rutinario', estado: 'confirmada' },
    { id: 2, hora: '09:30', paciente: 'María González', motivo: 'Limpieza dental', estado: 'confirmada' },
    { id: 3, hora: '10:00', paciente: 'Carlos Rodríguez', motivo: 'Dolor muela', estado: 'programada' },
    { id: 4, hora: '10:30', paciente: 'Ana Martínez', motivo: 'Extracción', estado: 'confirmada' },
    { id: 5, hora: '11:30', paciente: 'Pedro Sánchez', motivo: 'Blanqueamiento', estado: 'programada' },
];

const ACTIVIDAD_RECIENTE = [
    { id: 1, tipo: 'cita', mensaje: 'Nueva cita agendada: María González', tiempo: 'Hace 5 min' },
    { id: 2, tipo: 'paciente', mensaje: 'Nuevo paciente registrado: Roberto Díaz', tiempo: 'Hace 15 min' },
    { id: 3, tipo: 'receta', mensaje: 'Receta emitida para Juan Pérez', tiempo: 'Hace 1 hora' },
    { id: 4, tipo: 'cita', mensaje: 'Cita completada: Ana López', tiempo: 'Hace 2 horas' },
];

export default function Dashboard() {
    const getEstadoColor = (estado) => {
        switch (estado) {
            case 'confirmada': return 'bg-green-100 text-green-800';
            case 'programada': return 'bg-yellow-100 text-yellow-800';
            case 'atendida': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getIconoActividad = (tipo) => {
        switch (tipo) {
            case 'cita': return '📅';
            case 'paciente': return '👤';
            case 'receta': return '📋';
            default: return '📌';
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    {/* Cards de estadísticas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {/* Total Pacientes */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Total Pacientes</p>
                                    <p className="text-2xl font-bold text-gray-900">{STATS.totalPacientes}</p>
                                </div>
                            </div>
                        </div>

                        {/* Citas Hoy */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-green-100 text-green-600">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Citas Hoy</p>
                                    <p className="text-2xl font-bold text-gray-900">{STATS.citasHoy}</p>
                                </div>
                            </div>
                        </div>

                        {/* Citas Pendientes */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Citas Pendientes</p>
                                    <p className="text-2xl font-bold text-gray-900">{STATS.citasPendientes}</p>
                                </div>
                            </div>
                        </div>

                        {/* Recetas del Mes */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Recetas (mes)</p>
                                    <p className="text-2xl font-bold text-gray-900">{STATS.recetasMes}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contenido principal */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        
                        {/* Citas de Hoy */}
                        <div className="lg:col-span-2 bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Citas de Hoy</h3>
                                <div className="space-y-3">
                                    {CITAS_HOY.map((cita) => (
                                        <div key={cita.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center gap-4">
                                                <span className="text-lg font-mono font-semibold text-gray-700">{cita.hora}</span>
                                                <div>
                                                    <p className="font-medium text-gray-900">{cita.paciente}</p>
                                                    <p className="text-sm text-gray-500">{cita.motivo}</p>
                                                </div>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEstadoColor(cita.estado)}`}>
                                                {cita.estado}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 text-center">
                                    <a href="/gestion-citas" className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                                        Ver todas las citas →
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Actividad Reciente */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h3>
                                <div className="space-y-4">
                                    {ACTIVIDAD_RECIENTE.map((actividad) => (
                                        <div key={actividad.id} className="flex items-start gap-3">
                                            <span className="text-xl">{getIconoActividad(actividad.tipo)}</span>
                                            <div>
                                                <p className="text-sm text-gray-900">{actividad.mensaje}</p>
                                                <p className="text-xs text-gray-500">{actividad.tiempo}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Accesos rápidos */}
                    <div className="mt-8 bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Accesos Rápidos</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <a href="/gestion-pacientes" className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                <span className="text-3xl mb-2">👤</span>
                                <span className="text-sm font-medium text-gray-700">Nuevo Paciente</span>
                            </a>
                            <a href="/gestion-citas" className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                <span className="text-3xl mb-2">📅</span>
                                <span className="text-sm font-medium text-gray-700">Nueva Cita</span>
                            </a>
                            <a href="/historia-clinica" className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                <span className="text-3xl mb-2">📋</span>
                                <span className="text-sm font-medium text-gray-700">Historia Clínica</span>
                            </a>
                            <a href="/recetas" className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                <span className="text-3xl mb-2">💊</span>
                                <span className="text-sm font-medium text-gray-700">Nueva Receta</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
