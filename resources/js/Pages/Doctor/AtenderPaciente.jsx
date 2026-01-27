import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';

export default function AtenderPaciente({ cita, patient, historial, doctor }) {
    const [loading, setLoading] = useState(false);
    const [mostrarHistorial, setMostrarHistorial] = useState(false);
    const [generarReceta, setGenerarReceta] = useState(false);

    const [form, setForm] = useState({
        appointment_id: cita?.id || null,
        patient_id: patient?.id || null,
        motivo_consulta: cita?.notes || '',
        sintomas: '',
        diagnostico: '',
        tratamiento: '',
        observaciones: '',
        proxima_cita_sugerida: '',
        generar_receta: false,
        medicamentos: [{ medicamento: '', dosis: '', frecuencia: '', duracion: '', indicaciones: '' }]
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const agregarMedicamento = () => {
        setForm(prev => ({
            ...prev,
            medicamentos: [...prev.medicamentos, { medicamento: '', dosis: '', frecuencia: '', duracion: '', indicaciones: '' }]
        }));
    };

    const quitarMedicamento = (index) => {
        setForm(prev => ({
            ...prev,
            medicamentos: prev.medicamentos.filter((_, i) => i !== index)
        }));
    };

    const actualizarMedicamento = (index, campo, valor) => {
        const newMeds = [...form.medicamentos];
        newMeds[index][campo] = valor;
        setForm(prev => ({ ...prev, medicamentos: newMeds }));
    };

    const marcarNoAsistio = async () => {
        if (!confirm('¿Confirmar que el paciente no asistió a esta cita?')) return;

        try {
            const response = await fetch(`/doctor/api/cita/${cita.id}/no-asistio`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || '',
                },
            });

            if (response.ok) {
                router.visit('/doctor/panel');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al actualizar la cita');
        }
    };

    const guardarAtencion = async () => {
        // Validaciones
        if (!form.motivo_consulta || !form.diagnostico || !form.tratamiento) {
            alert('Por favor completa los campos obligatorios: Motivo, Diagnóstico y Tratamiento');
            return;
        }

        if (generarReceta && form.medicamentos.some(m => !m.medicamento)) {
            alert('Por favor completa el nombre de todos los medicamentos');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('/doctor/api/atencion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || '',
                },
                body: JSON.stringify({
                    ...form,
                    generar_receta: generarReceta,
                    medicamentos: generarReceta ? form.medicamentos : [],
                }),
            });

            const result = await response.json();

            if (response.ok) {
                alert('Atención registrada exitosamente');
                router.visit('/doctor/panel');
            } else {
                alert(result.message || 'Error al guardar la atención');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error de conexión');
        } finally {
            setLoading(false);
        }
    };

    const calcularEdad = (fechaNacimiento) => {
        if (!fechaNacimiento) return null;
        const hoy = new Date();
        const nacimiento = new Date(fechaNacimiento);
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const mes = hoy.getMonth() - nacimiento.getMonth();
        if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
            edad--;
        }
        return edad;
    };

    const edad = patient ? calcularEdad(patient.fecha_nacimiento) : null;
    const citaAtendida = cita?.status === 'atendida';

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        {citaAtendida ? 'Detalle de Atención' : 'Atender Paciente'}
                    </h2>
                    <Link
                        href="/doctor/panel"
                        className="text-sm text-indigo-600 hover:text-indigo-900"
                    >
                        ← Volver al panel
                    </Link>
                </div>
            }
        >
            <Head title={citaAtendida ? 'Detalle de Atención' : 'Atender Paciente'} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">

                    {/* Información del paciente */}
                    <div className="bg-white shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900">
                                        {patient ? `${patient.nombre} ${patient.apellido}` : `${cita?.patient_name} ${cita?.patient_lastname}`}
                                    </h3>
                                    <p className="text-gray-500 mt-1">
                                        CI: {patient?.ci || cita?.patient_dni}
                                        {edad && ` • ${edad} años`}
                                    </p>
                                    {patient?.telefono && (
                                        <p className="text-gray-500">Tel: {patient.telefono}</p>
                                    )}
                                </div>
                                <div className="text-right text-sm text-gray-500">
                                    <p>Cita: {cita?.time_start?.slice(0, 5)} hrs</p>
                                    <p>{new Date(cita?.date).toLocaleDateString('es-BO')}</p>
                                </div>
                            </div>

                            {/* Alertas médicas */}
                            {patient?.alergias && (
                                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <span className="font-semibold text-red-800">⚠️ Alergias:</span>
                                    <span className="text-red-700 ml-2">{patient.alergias}</span>
                                </div>
                            )}

                            {patient?.antecedentes && (
                                <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                    <span className="font-semibold text-blue-800">📋 Antecedentes:</span>
                                    <span className="text-blue-700 ml-2">{patient.antecedentes}</span>
                                </div>
                            )}

                            {/* Botón ver historial */}
                            {historial && historial.length > 0 && (
                                <button
                                    onClick={() => setMostrarHistorial(true)}
                                    className="mt-4 text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                                >
                                    📁 Ver historial del paciente ({historial.length} atenciones previas)
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Formulario de atención */}
                    {!citaAtendida ? (
                        <div className="bg-white shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                                    Registro de Atención
                                </h4>

                                <div className="space-y-4">
                                    {/* Motivo de consulta */}
                                    <div>
                                        <InputLabel htmlFor="motivo_consulta" value="Motivo de consulta *" />
                                        <TextInput
                                            id="motivo_consulta"
                                            name="motivo_consulta"
                                            value={form.motivo_consulta}
                                            onChange={handleChange}
                                            className="mt-1 block w-full"
                                            placeholder="Ej: Dolor en muela inferior derecha"
                                        />
                                    </div>

                                    {/* Síntomas */}
                                    <div>
                                        <InputLabel htmlFor="sintomas" value="Síntomas" />
                                        <textarea
                                            id="sintomas"
                                            name="sintomas"
                                            value={form.sintomas}
                                            onChange={handleChange}
                                            rows={2}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            placeholder="Ej: Inflamación, sensibilidad al frío y calor"
                                        />
                                    </div>

                                    {/* Diagnóstico */}
                                    <div>
                                        <InputLabel htmlFor="diagnostico" value="Diagnóstico *" />
                                        <textarea
                                            id="diagnostico"
                                            name="diagnostico"
                                            value={form.diagnostico}
                                            onChange={handleChange}
                                            rows={2}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            placeholder="Ej: Caries profunda en pieza 36"
                                        />
                                    </div>

                                    {/* Tratamiento */}
                                    <div>
                                        <InputLabel htmlFor="tratamiento" value="Tratamiento realizado *" />
                                        <textarea
                                            id="tratamiento"
                                            name="tratamiento"
                                            value={form.tratamiento}
                                            onChange={handleChange}
                                            rows={2}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            placeholder="Ej: Endodoncia, primera sesión completada"
                                        />
                                    </div>

                                    {/* Observaciones */}
                                    <div>
                                        <InputLabel htmlFor="observaciones" value="Observaciones" />
                                        <textarea
                                            id="observaciones"
                                            name="observaciones"
                                            value={form.observaciones}
                                            onChange={handleChange}
                                            rows={2}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            placeholder="Notas adicionales..."
                                        />
                                    </div>

                                    {/* Próxima cita sugerida */}
                                    <div>
                                        <InputLabel htmlFor="proxima_cita_sugerida" value="Próxima cita sugerida" />
                                        <TextInput
                                            id="proxima_cita_sugerida"
                                            name="proxima_cita_sugerida"
                                            value={form.proxima_cita_sugerida}
                                            onChange={handleChange}
                                            className="mt-1 block w-full"
                                            placeholder="Ej: Control en 7 días"
                                        />
                                    </div>

                                    {/* Toggle receta */}
                                    <div className="border-t pt-4">
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={generarReceta}
                                                onChange={(e) => setGenerarReceta(e.target.checked)}
                                                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                                            />
                                            <span className="ml-2 text-sm font-medium text-gray-700">
                                                Generar receta médica
                                            </span>
                                        </label>
                                    </div>

                                    {/* Medicamentos (si genera receta) */}
                                    {generarReceta && (
                                        <div className="border rounded-lg p-4 bg-gray-50">
                                            <div className="flex justify-between items-center mb-3">
                                                <h5 className="font-medium text-gray-900">Medicamentos</h5>
                                                <button
                                                    type="button"
                                                    onClick={agregarMedicamento}
                                                    className="text-sm text-indigo-600 hover:text-indigo-900"
                                                >
                                                    + Agregar medicamento
                                                </button>
                                            </div>

                                            <div className="space-y-4">
                                                {form.medicamentos.map((med, index) => (
                                                    <div key={index} className="bg-white p-3 rounded border">
                                                        <div className="flex justify-between mb-2">
                                                            <span className="text-sm text-gray-500">Medicamento {index + 1}</span>
                                                            {form.medicamentos.length > 1 && (
                                                                <button
                                                                    onClick={() => quitarMedicamento(index)}
                                                                    className="text-red-500 hover:text-red-700 text-sm"
                                                                >
                                                                    Quitar
                                                                </button>
                                                            )}
                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                            <input
                                                                type="text"
                                                                placeholder="Nombre del medicamento *"
                                                                value={med.medicamento}
                                                                onChange={(e) => actualizarMedicamento(index, 'medicamento', e.target.value)}
                                                                className="md:col-span-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                            />
                                                            <input
                                                                type="text"
                                                                placeholder="Dosis (ej: 500mg)"
                                                                value={med.dosis}
                                                                onChange={(e) => actualizarMedicamento(index, 'dosis', e.target.value)}
                                                                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                            />
                                                            <input
                                                                type="text"
                                                                placeholder="Frecuencia (ej: cada 8 hrs)"
                                                                value={med.frecuencia}
                                                                onChange={(e) => actualizarMedicamento(index, 'frecuencia', e.target.value)}
                                                                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                            />
                                                            <input
                                                                type="text"
                                                                placeholder="Duración (ej: 7 días)"
                                                                value={med.duracion}
                                                                onChange={(e) => actualizarMedicamento(index, 'duracion', e.target.value)}
                                                                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                            />
                                                            <input
                                                                type="text"
                                                                placeholder="Indicaciones especiales"
                                                                value={med.indicaciones}
                                                                onChange={(e) => actualizarMedicamento(index, 'indicaciones', e.target.value)}
                                                                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Botones de acción */}
                                <div className="mt-6 flex flex-col sm:flex-row justify-between gap-4 pt-4 border-t">
                                    <button
                                        onClick={marcarNoAsistio}
                                        className="px-4 py-2 text-red-600 hover:text-red-800 font-medium"
                                    >
                                        Marcar como no asistió
                                    </button>

                                    <div className="flex gap-3">
                                        <Link
                                            href="/doctor/panel"
                                            className="px-4 py-2 text-gray-700 hover:text-gray-900"
                                        >
                                            Cancelar
                                        </Link>
                                        <PrimaryButton onClick={guardarAtencion} disabled={loading}>
                                            {loading ? 'Guardando...' : 'Guardar y Finalizar'}
                                        </PrimaryButton>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Vista de cita ya atendida */
                        <div className="bg-white shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                        ✓ Atendida
                                    </span>
                                </div>
                                <p className="text-gray-500">
                                    Esta cita ya fue atendida. Puedes ver el registro en el historial del paciente.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Historial */}
            <Modal show={mostrarHistorial} onClose={() => setMostrarHistorial(false)} maxWidth="2xl">
                <div className="p-6">
                    <h3 className="text-lg font-semibold mb-4">
                        Historial de {patient?.nombre} {patient?.apellido}
                    </h3>

                    {historial && historial.length > 0 ? (
                        <div className="space-y-4 max-h-96 overflow-y-auto">
                            {historial.map((registro) => (
                                <div key={registro.id} className="border rounded-lg p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <p className="font-medium text-gray-900">{registro.motivo_consulta}</p>
                                            <p className="text-sm text-gray-500">
                                                {new Date(registro.fecha).toLocaleDateString('es-BO')}
                                                {registro.doctor && ` • Dr(a). ${registro.doctor.nombre} ${registro.doctor.apellido}`}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-sm space-y-1">
                                        <p><span className="font-medium">Diagnóstico:</span> {registro.diagnostico}</p>
                                        <p><span className="font-medium">Tratamiento:</span> {registro.tratamiento}</p>
                                        {registro.observaciones && (
                                            <p><span className="font-medium">Observaciones:</span> {registro.observaciones}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No hay atenciones previas registradas.</p>
                    )}

                    <div className="mt-4 flex justify-end">
                        <SecondaryButton onClick={() => setMostrarHistorial(false)}>
                            Cerrar
                        </SecondaryButton>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
