import { useState } from "react";
import { Clock, User, Phone, Mail, MoreVertical, X, Check, Calendar, Trash2, RefreshCw } from "lucide-react";
import ModalReprogramar from "./ModalReprogramar";

export default function CitaCard({ cita, onUpdate }) {
    const [mostrarMenu, setMostrarMenu] = useState(false);
    const [mostrarDetalles, setMostrarDetalles] = useState(false);
    const [mostrarReprogramar, setMostrarReprogramar] = useState(false);
    const [loading, setLoading] = useState(false);

    const estadoConfig = {
        programada: { color: "bg-yellow-100 text-yellow-800 border-yellow-300", label: "Programada" },
        confirmada: { color: "bg-green-100 text-green-800 border-green-300", label: "Confirmada" },
        atendida: { color: "bg-blue-100 text-blue-800 border-blue-300", label: "Atendida" },
        no_asistio: { color: "bg-red-100 text-red-800 border-red-300", label: "No asistió" },
        cancelada: { color: "bg-gray-100 text-gray-800 border-gray-300", label: "Cancelada" }
    };

    const cambiarEstado = async (nuevoEstado) => {
        setLoading(true);
        try {
            let endpoint = `/appointments/${cita.id}`;

            // Usar endpoints específicos para cada acción
            switch (nuevoEstado) {
                case 'confirmada':
                    endpoint = `/appointments/${cita.id}/confirm`;
                    break;
                case 'atendida':
                    endpoint = `/appointments/${cita.id}/attended`;
                    break;
                case 'no_asistio':
                    endpoint = `/appointments/${cita.id}/no-show`;
                    break;
                case 'cancelada':
                    endpoint = `/appointments/${cita.id}/cancel`;
                    break;
            }

            const response = await fetch(endpoint, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                }
            });

            if (!response.ok) throw new Error('Error al actualizar');

            onUpdate();
            setMostrarMenu(false);
        } catch (error) {
            alert('Error al actualizar el estado de la cita');
        } finally {
            setLoading(false);
        }
    };

    const eliminarCita = async () => {
        if (!confirm('¿Está seguro de eliminar esta cita?')) return;

        setLoading(true);
        try {
            const response = await fetch(`/appointments/${cita.id}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                }
            });

            if (!response.ok) throw new Error('Error al eliminar');

            onUpdate();
        } catch (error) {
            alert('Error al eliminar la cita');
        } finally {
            setLoading(false);
        }
    };

    const config = estadoConfig[cita.status] || estadoConfig.programada;

    return (
        <>
            <div
                onClick={() => setMostrarDetalles(true)}
                className={`border rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow ${config.color}`}
            >
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span className="font-semibold text-sm">{cita.time_start}</span>
                    </div>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setMostrarMenu(!mostrarMenu);
                        }}
                        className="relative p-1 hover:bg-white rounded"
                    >
                        <MoreVertical className="w-4 h-4" />

                        {mostrarMenu && (
                            <div className="absolute right-0 top-6 bg-white border rounded-lg shadow-lg z-10 min-w-[180px]">
                                {(cita.status === 'programada' || cita.status === 'confirmada') && (
                                    <button
                                        onClick={() => {
                                            setMostrarReprogramar(true);
                                            setMostrarMenu(false);
                                        }}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm flex items-center gap-2"
                                    >
                                        <RefreshCw className="w-4 h-4" />
                                        Reprogramar
                                    </button>
                                )}
                                {cita.status === 'programada' && (
                                    <button
                                        onClick={() => cambiarEstado('confirmada')}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm flex items-center gap-2"
                                    >
                                        <Check className="w-4 h-4" />
                                        Confirmar
                                    </button>
                                )}
                                {(cita.status === 'programada' || cita.status === 'confirmada') && (
                                    <>
                                        <button
                                            onClick={() => cambiarEstado('atendida')}
                                            className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm flex items-center gap-2"
                                        >
                                            <Check className="w-4 h-4" />
                                            Marcar atendida
                                        </button>
                                        <button
                                            onClick={() => cambiarEstado('no_asistio')}
                                            className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm flex items-center gap-2"
                                        >
                                            <X className="w-4 h-4" />
                                            No asistió
                                        </button>
                                        <button
                                            onClick={() => cambiarEstado('cancelada')}
                                            className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm flex items-center gap-2 text-red-600"
                                        >
                                            <X className="w-4 h-4" />
                                            Cancelar
                                        </button>
                                    </>
                                )}
                                <button
                                    onClick={eliminarCita}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm flex items-center gap-2 text-red-600 border-t"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Eliminar
                                </button>
                            </div>
                        )}
                    </button>
                </div>
                <p className="text-sm font-medium truncate">{cita.patient_name} {cita.patient_lastname}</p>
                <p className="text-xs text-gray-600 mt-1">{config.label}</p>
            </div>

            {/* Modal de detalles */}
            {mostrarDetalles && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-bold">Detalles de la Cita</h3>
                            <button
                                onClick={() => setMostrarDetalles(false)}
                                className="p-1 hover:bg-gray-100 rounded"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className={`px-3 py-2 rounded-lg border ${config.color}`}>
                                <p className="text-sm font-semibold">{config.label}</p>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <User className="w-5 h-5 text-gray-500 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-gray-500">Paciente</p>
                                        <p className="font-semibold">{cita.patient_name} {cita.patient_lastname}</p>
                                        <p className="text-sm text-gray-600">DNI: {cita.patient_dni}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Calendar className="w-5 h-5 text-gray-500 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-gray-500">Fecha y hora</p>
                                        <p className="font-semibold">{cita.date}</p>
                                        <p className="text-sm text-gray-600">{cita.time_start} - {cita.time_end}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Phone className="w-5 h-5 text-gray-500 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-gray-500">Teléfono</p>
                                        <p className="font-semibold">{cita.patient_phone}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Mail className="w-5 h-5 text-gray-500 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-gray-500">Email</p>
                                        <p className="font-semibold">{cita.patient_email}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="w-5 h-5 text-gray-500 mt-0.5">💳</div>
                                    <div>
                                        <p className="text-sm text-gray-500">Método de pago</p>
                                        <p className="font-semibold">{cita.payment_method}</p>
                                    </div>
                                </div>

                                {cita.notes && (
                                    <div className="flex items-start gap-3">
                                        <div className="w-5 h-5 text-gray-500 mt-0.5">📝</div>
                                        <div>
                                            <p className="text-sm text-gray-500">Notas</p>
                                            <p className="font-semibold">{cita.notes}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="pt-4 border-t flex gap-2">
                                <button
                                    onClick={() => setMostrarDetalles(false)}
                                    className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold"
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de reprogramar */}
            <ModalReprogramar
                mostrar={mostrarReprogramar}
                onClose={() => setMostrarReprogramar(false)}
                cita={cita}
                onSuccess={onUpdate}
            />
        </>
    );
}
