import { useState, useEffect } from 'react';

export default function HistorialCitas() {
    const [citas, setCitas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtro, setFiltro] = useState('todas');

    useEffect(() => {
        fetch('/mis-citas')
            .then(res => res.json())
            .then(data => {
                setCitas(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const formatearFecha = (fecha) => {
        const date = new Date(fecha + 'T00:00:00');
        return date.toLocaleDateString('es-ES', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatearHora = (hora) => {
        return hora.substring(0, 5);
    };

    const getStatusConfig = (status) => {
        const configs = {
            programada: { label: 'Programada', bg: 'bg-yellow-100', text: 'text-yellow-800' },
            confirmada: { label: 'Confirmada', bg: 'bg-blue-100', text: 'text-blue-800' },
            atendida: { label: 'Atendida', bg: 'bg-green-100', text: 'text-green-800' },
            no_asistio: { label: 'No Asistió', bg: 'bg-orange-100', text: 'text-orange-800' },
            cancelada: { label: 'Cancelada', bg: 'bg-red-100', text: 'text-red-800' }
        };
        return configs[status] || { label: status, bg: 'bg-gray-100', text: 'text-gray-800' };
    };

    const citasFiltradas = citas.filter(cita => {
        if (filtro === 'todas') return true;
        return cita.status === filtro;
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
            </div>
        );
    }

    if (citas.length === 0) {
        return (
            <div className="text-center py-12">
                <svg className="mx-auto h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Sin historial de citas</h3>
                <p className="mt-2 text-gray-500">Aún no has agendado ninguna cita.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-800">
                    Historial de Citas
                </h3>

                <div className="flex flex-wrap gap-2">
                    {['todas', 'programada', 'confirmada', 'atendida', 'cancelada'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFiltro(f)}
                            className={`px-3 py-1 text-sm rounded-full transition-colors ${
                                filtro === f
                                    ? 'bg-cyan-600 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            {f === 'todas' ? 'Todas' : getStatusConfig(f).label}
                        </button>
                    ))}
                </div>
            </div>

            {citasFiltradas.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    No hay citas con este filtro
                </div>
            ) : (
                <div className="space-y-3">
                    {citasFiltradas.map((cita) => {
                        const statusConfig = getStatusConfig(cita.status);
                        return (
                            <div key={cita.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusConfig.bg} ${statusConfig.text}`}>
                                                {statusConfig.label}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span className="font-medium capitalize">{formatearFecha(cita.date)}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600 mt-1">
                                            <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span>{formatearHora(cita.time_start)} - {formatearHora(cita.time_end)}</span>
                                        </div>
                                        {cita.notes && (
                                            <p className="mt-2 text-sm text-gray-500">
                                                <span className="font-medium">Notas:</span> {cita.notes}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <div className="text-center text-sm text-gray-500 pt-4">
                Mostrando {citasFiltradas.length} de {citas.length} citas
            </div>
        </div>
    );
}
