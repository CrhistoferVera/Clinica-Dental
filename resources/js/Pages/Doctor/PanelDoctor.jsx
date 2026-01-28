import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import Modal from '@/Components/Modal';
import TextInput from '@/Components/TextInput';

export default function PanelDoctor({ doctor }) {
    const [citas, setCitas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date().toISOString().split('T')[0]);
    const [modalRecetaRapida, setModalRecetaRapida] = useState(false);
    const [busquedaPaciente, setBusquedaPaciente] = useState('');
    const [pacientesEncontrados, setPacientesEncontrados] = useState([]);
    const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);
    const [recetaForm, setRecetaForm] = useState({
        diagnostico: '',
        notas: '',
        medicamentos: [{ medicamento: '', dosis: '', frecuencia: '', duracion: '', indicaciones: '' }]
    });

    const hoy = new Date().toISOString().split('T')[0];
    const esHoy = fechaSeleccionada === hoy;

    // Cargar citas
    const cargarCitas = async () => {
        setLoading(true);
        try {
            const url = esHoy
                ? '/doctor/api/citas-hoy'
                : `/doctor/api/citas?fecha=${fechaSeleccionada}`;
            const response = await fetch(url);
            const data = await response.json();
            setCitas(data);
        } catch (error) {
            console.error('Error cargando citas:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarCitas();
    }, [fechaSeleccionada]);

    // Buscar pacientes para receta rápida
    useEffect(() => {
        const buscar = async () => {
            if (busquedaPaciente.length < 2) {
                setPacientesEncontrados([]);
                return;
            }
            try {
                const response = await fetch(`/doctor/api/pacientes/buscar?q=${busquedaPaciente}`);
                const data = await response.json();
                setPacientesEncontrados(data);
            } catch (error) {
                console.error('Error buscando pacientes:', error);
            }
        };
        const timer = setTimeout(buscar, 300);
        return () => clearTimeout(timer);
    }, [busquedaPaciente]);

    // Marcar como no asistió
    const marcarNoAsistio = async (citaId) => {
        if (!confirm('¿Confirmar que el paciente no asistió?')) return;

        try {
            const response = await fetch(`/doctor/api/cita/${citaId}/no-asistio`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || '',
                },
            });
            if (response.ok) {
                cargarCitas();
            } else {
                const error = await response.json();
                alert(error.message || 'Error al marcar como no asistió');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error de conexión');
        }
    };

    // Agregar medicamento a la receta
    const agregarMedicamento = () => {
        setRecetaForm(prev => ({
            ...prev,
            medicamentos: [...prev.medicamentos, { medicamento: '', dosis: '', frecuencia: '', duracion: '', indicaciones: '' }]
        }));
    };

    // Quitar medicamento
    const quitarMedicamento = (index) => {
        setRecetaForm(prev => ({
            ...prev,
            medicamentos: prev.medicamentos.filter((_, i) => i !== index)
        }));
    };

    // Guardar receta rápida
    const guardarRecetaRapida = async () => {
        if (!pacienteSeleccionado) {
            alert('Selecciona un paciente');
            return;
        }
        if (!recetaForm.diagnostico || recetaForm.medicamentos.some(m => !m.medicamento)) {
            alert('Completa el diagnóstico y al menos un medicamento');
            return;
        }

        try {
            const response = await fetch('/doctor/api/receta-rapida', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || '',
                },
                body: JSON.stringify({
                    patient_id: pacienteSeleccionado.id,
                    diagnostico: recetaForm.diagnostico,
                    notas: recetaForm.notas,
                    medicamentos: recetaForm.medicamentos,
                }),
            });

            if (response.ok) {
                alert('Receta creada exitosamente');
                cerrarModalReceta();
            } else {
                const error = await response.json();
                alert(error.message || 'Error al crear receta');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error de conexión');
        }
    };

    const cerrarModalReceta = () => {
        setModalRecetaRapida(false);
        setPacienteSeleccionado(null);
        setBusquedaPaciente('');
        setPacientesEncontrados([]);
        setRecetaForm({
            diagnostico: '',
            notas: '',
            medicamentos: [{ medicamento: '', dosis: '', frecuencia: '', duracion: '', indicaciones: '' }]
        });
    };

    const getEstadoStyle = (estado) => {
        switch (estado) {
            case 'confirmada': return 'bg-blue-100 text-blue-800';
            case 'programada': return 'bg-yellow-100 text-yellow-800';
            case 'atendida': return 'bg-green-100 text-green-800';
            case 'no_asistio': return 'bg-red-100 text-red-800';
            case 'cancelada': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getEstadoTexto = (estado) => {
        switch (estado) {
            case 'confirmada': return 'Confirmada';
            case 'programada': return 'Pendiente';
            case 'atendida': return 'Atendida';
            case 'no_asistio': return 'No asistió';
            case 'cancelada': return 'Cancelada';
            default: return estado;
        }
    };

    const formatearFecha = (fecha) => {
        return new Date(fecha + 'T00:00:00').toLocaleDateString('es-BO', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Panel del Doctor
                    </h2>
                    <span className="text-sm text-gray-500">
                        {doctor?.nombre} {doctor?.apellido}
                    </span>
                </div>
            }
        >
            <Head title="Panel del Doctor" />

            <div className="py-12">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">

                    {/* Cabecera con fecha y acciones */}
                    <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <div className="flex items-center gap-3">
                                <input
                                    type="date"
                                    value={fechaSeleccionada}
                                    onChange={(e) => setFechaSeleccionada(e.target.value)}
                                    className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                                {!esHoy && (
                                    <button
                                        onClick={() => setFechaSeleccionada(hoy)}
                                        className="text-sm text-indigo-600 hover:text-indigo-900"
                                    >
                                        Volver a hoy
                                    </button>
                                )}
                            </div>
                            <p className="text-lg font-medium text-gray-700 mt-2 capitalize">
                                {formatearFecha(fechaSeleccionada)}
                            </p>
                        </div>

                        <PrimaryButton onClick={() => setModalRecetaRapida(true)}>
                            + Receta Rápida
                        </PrimaryButton>
                    </div>

                    {/* Lista de citas */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                {esHoy ? 'Mis Citas de Hoy' : 'Citas del Día'}
                            </h3>

                            {loading ? (
                                <div className="text-center py-8 text-gray-500">
                                    Cargando citas...
                                </div>
                            ) : citas.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <p className="mt-2">No hay citas programadas para este día</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {citas.map((cita) => (
                                        <div
                                            key={cita.id}
                                            className={`flex items-center justify-between p-4 rounded-lg border ${
                                                cita.status === 'atendida' || cita.status === 'no_asistio' || cita.status === 'cancelada'
                                                    ? 'bg-gray-50 border-gray-200'
                                                    : 'bg-white border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <span className="text-xl font-mono font-bold text-gray-700 w-16">
                                                    {cita.time_start?.slice(0, 5)}
                                                </span>
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        {cita.patient_name} {cita.patient_lastname}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        CI: {cita.patient_dni} • {cita.notes || 'Sin motivo especificado'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEstadoStyle(cita.status)}`}>
                                                    {getEstadoTexto(cita.status)}
                                                </span>

                                                {(cita.status === 'programada' || cita.status === 'confirmada') && (
                                                    <div className="flex gap-2">
                                                        <Link
                                                            href={`/doctor/atender/${cita.id}`}
                                                            className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                                                        >
                                                            Atender
                                                        </Link>
                                                        <button
                                                            onClick={() => marcarNoAsistio(cita.id)}
                                                            className="px-3 py-2 text-red-600 hover:text-red-800 text-sm font-medium"
                                                        >
                                                            No asistió
                                                        </button>
                                                    </div>
                                                )}

                                                {cita.status === 'atendida' && (
                                                    <Link
                                                        href={`/doctor/atender/${cita.id}`}
                                                        className="px-4 py-2 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                                                    >
                                                        Ver detalle
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Resumen del día */}
                    {!loading && citas.length > 0 && (
                        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                                <p className="text-2xl font-bold text-gray-900">{citas.length}</p>
                                <p className="text-sm text-gray-500">Total citas</p>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                                <p className="text-2xl font-bold text-yellow-600">
                                    {citas.filter(c => c.status === 'programada' || c.status === 'confirmada').length}
                                </p>
                                <p className="text-sm text-gray-500">Pendientes</p>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                                <p className="text-2xl font-bold text-green-600">
                                    {citas.filter(c => c.status === 'atendida').length}
                                </p>
                                <p className="text-sm text-gray-500">Atendidas</p>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                                <p className="text-2xl font-bold text-red-600">
                                    {citas.filter(c => c.status === 'no_asistio').length}
                                </p>
                                <p className="text-sm text-gray-500">No asistieron</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Receta Rápida */}
            <Modal show={modalRecetaRapida} onClose={cerrarModalReceta} maxWidth="2xl">
                <div className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Nueva Receta Rápida</h3>

                    {/* Buscar paciente */}
                    {!pacienteSeleccionado ? (
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Buscar Paciente *
                            </label>
                            <TextInput
                                type="text"
                                placeholder="Nombre, apellido o CI..."
                                value={busquedaPaciente}
                                onChange={(e) => setBusquedaPaciente(e.target.value)}
                                className="w-full"
                            />
                            {pacientesEncontrados.length > 0 && (
                                <div className="mt-2 border rounded-lg max-h-40 overflow-y-auto">
                                    {pacientesEncontrados.map((p) => (
                                        <button
                                            key={p.id}
                                            onClick={() => {
                                                setPacienteSeleccionado(p);
                                                setBusquedaPaciente('');
                                                setPacientesEncontrados([]);
                                            }}
                                            className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b last:border-b-0"
                                        >
                                            <span className="font-medium">{p.nombre} {p.apellido}</span>
                                            <span className="text-gray-500 ml-2">CI: {p.ci}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="mb-4 p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                            <div>
                                <span className="font-medium">{pacienteSeleccionado.nombre} {pacienteSeleccionado.apellido}</span>
                                <span className="text-gray-500 ml-2">CI: {pacienteSeleccionado.ci}</span>
                            </div>
                            <button
                                onClick={() => setPacienteSeleccionado(null)}
                                className="text-red-500 hover:text-red-700"
                            >
                                Cambiar
                            </button>
                        </div>
                    )}

                    {/* Diagnóstico */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Diagnóstico *</label>
                        <TextInput
                            type="text"
                            value={recetaForm.diagnostico}
                            onChange={(e) => setRecetaForm(prev => ({ ...prev, diagnostico: e.target.value }))}
                            className="w-full"
                        />
                    </div>

                    {/* Medicamentos */}
                    <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium text-gray-700">Medicamentos *</label>
                            <button
                                type="button"
                                onClick={agregarMedicamento}
                                className="text-sm text-indigo-600 hover:text-indigo-900"
                            >
                                + Agregar
                            </button>
                        </div>
                        <div className="space-y-3">
                            {recetaForm.medicamentos.map((med, index) => (
                                <div key={index} className="p-3 border rounded-lg">
                                    <div className="flex justify-between mb-2">
                                        <span className="text-sm font-medium text-gray-500">Medicamento {index + 1}</span>
                                        {recetaForm.medicamentos.length > 1 && (
                                            <button
                                                onClick={() => quitarMedicamento(index)}
                                                className="text-red-500 hover:text-red-700 text-sm"
                                            >
                                                Quitar
                                            </button>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <input
                                            type="text"
                                            placeholder="Medicamento *"
                                            value={med.medicamento}
                                            onChange={(e) => {
                                                const newMeds = [...recetaForm.medicamentos];
                                                newMeds[index].medicamento = e.target.value;
                                                setRecetaForm(prev => ({ ...prev, medicamentos: newMeds }));
                                            }}
                                            className="col-span-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Dosis"
                                            value={med.dosis}
                                            onChange={(e) => {
                                                const newMeds = [...recetaForm.medicamentos];
                                                newMeds[index].dosis = e.target.value;
                                                setRecetaForm(prev => ({ ...prev, medicamentos: newMeds }));
                                            }}
                                            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Frecuencia"
                                            value={med.frecuencia}
                                            onChange={(e) => {
                                                const newMeds = [...recetaForm.medicamentos];
                                                newMeds[index].frecuencia = e.target.value;
                                                setRecetaForm(prev => ({ ...prev, medicamentos: newMeds }));
                                            }}
                                            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Duración"
                                            value={med.duracion}
                                            onChange={(e) => {
                                                const newMeds = [...recetaForm.medicamentos];
                                                newMeds[index].duracion = e.target.value;
                                                setRecetaForm(prev => ({ ...prev, medicamentos: newMeds }));
                                            }}
                                            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Indicaciones"
                                            value={med.indicaciones}
                                            onChange={(e) => {
                                                const newMeds = [...recetaForm.medicamentos];
                                                newMeds[index].indicaciones = e.target.value;
                                                setRecetaForm(prev => ({ ...prev, medicamentos: newMeds }));
                                            }}
                                            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Notas */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Notas adicionales</label>
                        <textarea
                            value={recetaForm.notas}
                            onChange={(e) => setRecetaForm(prev => ({ ...prev, notas: e.target.value }))}
                            rows={2}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Botones */}
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={cerrarModalReceta}
                            className="px-4 py-2 text-gray-700 hover:text-gray-900"
                        >
                            Cancelar
                        </button>
                        <PrimaryButton onClick={guardarRecetaRapida}>
                            Crear Receta
                        </PrimaryButton>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
