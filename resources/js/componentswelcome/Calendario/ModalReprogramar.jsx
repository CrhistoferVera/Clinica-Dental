import { useState, useEffect, Fragment } from "react";
import { Transition } from "@headlessui/react";
import { ArrowLeft, Calendar, Clock } from "lucide-react";

export default function ModalReprogramar({ mostrar, onClose, cita, onSuccess }) {
    const [dias, setDias] = useState([]);
    const [horarios, setHorarios] = useState([]);
    const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
    const [horaSeleccionada, setHoraSeleccionada] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (mostrar) {
            cargarDiasDisponibles();
        }
    }, [mostrar]);

    useEffect(() => {
        if (fechaSeleccionada) {
            cargarHorariosDisponibles();
        }
    }, [fechaSeleccionada]);

    const cargarDiasDisponibles = async () => {
        try {
            const response = await fetch('/available-days');
            const data = await response.json();
            setDias(data);
            setFechaSeleccionada(data[0]?.value || null);
        } catch (err) {
            console.error("Error al cargar días:", err);
        }
    };

    const cargarHorariosDisponibles = async () => {
        if (!fechaSeleccionada) return;

        try {
            const response = await fetch(`/available-hours?date=${fechaSeleccionada}`);
            const data = await response.json();
            setHorarios(data);
            setHoraSeleccionada(null);
        } catch (err) {
            console.error("Error al cargar horarios:", err);
        }
    };

    const handleReprogramar = async () => {
        if (!fechaSeleccionada || !horaSeleccionada) {
            setError("Seleccione fecha y hora");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const [horaInicio, horaFin] = horaSeleccionada.split(" - ");

            const response = await fetch(`/appointments/${cita.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                },
                body: JSON.stringify({
                    date: fechaSeleccionada,
                    time_start: horaInicio,
                    time_end: horaFin,
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error al reprogramar');
            }

            onSuccess();
            onClose();
        } catch (err) {
            setError(err.message || 'Error al reprogramar la cita');
        } finally {
            setLoading(false);
        }
    };

    if (!mostrar) return null;

    return (
        <Transition as={Fragment} show={mostrar}>
            <Transition.Child
                as={Fragment}
                enter="transition-opacity duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-50"
                leave="transition-opacity duration-300"
                leaveFrom="opacity-50"
                leaveTo="opacity-0"
            >
                <div onClick={onClose} className="fixed inset-0 bg-black z-40" style={{ opacity: 0.5 }} />
            </Transition.Child>

            <Transition.Child
                as={Fragment}
                enter="transform transition duration-300"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition duration-300"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
            >
                <div className="fixed top-0 right-0 h-full z-50 bg-white shadow-lg w-full md:w-96 flex flex-col">
                    {/* Cabecera */}
                    <div className="bg-black text-white flex items-center p-4">
                        <button onClick={onClose} className="mr-4">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <h2 className="text-lg font-bold">Reprogramar Cita</h2>
                    </div>

                    {/* Contenido */}
                    <div className="flex-1 overflow-auto p-6">
                        {/* Info de la cita actual */}
                        <div className="bg-gray-100 p-4 rounded-lg mb-6">
                            <p className="text-sm text-gray-600 mb-2">Cita actual</p>
                            <p className="font-semibold">{cita.patient_name} {cita.patient_lastname}</p>
                            <p className="text-sm text-gray-600">{cita.date} - {cita.time_start}</p>
                        </div>

                        {/* Selección de fecha */}
                        <div className="mb-6">
                            <label className="flex items-center gap-2 font-semibold mb-3">
                                <Calendar className="w-5 h-5" />
                                Nueva Fecha
                            </label>
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                                {dias.map(dia => (
                                    <button
                                        key={dia.value}
                                        onClick={() => setFechaSeleccionada(dia.value)}
                                        className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-colors ${
                                            fechaSeleccionada === dia.value
                                                ? 'border-black bg-black text-white'
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        {dia.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Selección de hora */}
                        {fechaSeleccionada && (
                            <div>
                                <label className="flex items-center gap-2 font-semibold mb-3">
                                    <Clock className="w-5 h-5" />
                                    Nueva Hora
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {horarios.length > 0 ? (
                                        horarios.map((hora, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setHoraSeleccionada(hora)}
                                                className={`px-3 py-2 rounded-lg border-2 transition-colors text-sm ${
                                                    horaSeleccionada === hora
                                                        ? 'border-black bg-black text-white'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                            >
                                                {hora}
                                            </button>
                                        ))
                                    ) : (
                                        <p className="col-span-2 text-gray-400 text-center py-4">
                                            No hay horarios disponibles
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Mensaje de error */}
                        {error && (
                            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                                {error}
                            </div>
                        )}
                    </div>

                    {/* Botones */}
                    <div className="p-6 border-t space-y-2">
                        <button
                            onClick={handleReprogramar}
                            disabled={loading || !fechaSeleccionada || !horaSeleccionada}
                            className="w-full bg-black text-white py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Guardando...' : 'Confirmar Reprogramación'}
                        </button>
                        <button
                            onClick={onClose}
                            className="w-full bg-gray-100 text-gray-700 py-3 rounded-full font-semibold hover:bg-gray-200 transition-colors"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            </Transition.Child>
        </Transition>
    );
}
