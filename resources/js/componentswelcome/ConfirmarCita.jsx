import { useState, useEffect } from 'react';

export default function ConfirmarCita() {
    const [citas, setCitas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [procesando, setProcesando] = useState(null);

    useEffect(() => {
        cargarCitas();
    }, []);

    const cargarCitas = () => {
        setLoading(true);
        fetch('/mis-citas/pendientes')
            .then(res => res.json())
            .then(data => {
                setCitas(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    const confirmarCita = async (id) => {
        setProcesando(id);
        try {
            const response = await fetch(`/mis-citas/${id}/confirmar`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content
                }
            });

            if (response.ok) {
                cargarCitas();
            }
        } catch (error) {
            console.error('Error al confirmar:', error);
        }
        setProcesando(null);
    };

    const cancelarCita = async (id) => {
        if (!confirm('¿Estás seguro de que deseas cancelar esta cita?')) return;

        setProcesando(id);
        try {
            const response = await fetch(`/mis-citas/${id}/cancelar`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content
                }
            });

            if (response.ok) {
                cargarCitas();
            }
        } catch (error) {
            console.error('Error al cancelar:', error);
        }
        setProcesando(null);
    };

    const formatearFecha = (fecha) => {
        const date = new Date(fecha + 'T00:00:00');
        return date.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatearHora = (hora) => {
        return hora.substring(0, 5);
    };

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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">No tienes citas pendientes</h3>
                <p className="mt-2 text-gray-500">Todas tus citas están confirmadas o no tienes citas programadas.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Citas Pendientes de Confirmación
            </h3>

            {citas.map((cita) => (
                <div key={cita.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                                    Pendiente
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
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => confirmarCita(cita.id)}
                                disabled={procesando === cita.id}
                                className="flex-1 sm:flex-none px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {procesando === cita.id ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Confirmar
                                    </>
                                )}
                            </button>
                            <button
                                onClick={() => cancelarCita(cita.id)}
                                disabled={procesando === cita.id}
                                className="flex-1 sm:flex-none px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
