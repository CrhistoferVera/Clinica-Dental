import { Head } from '@inertiajs/react';
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import Modal from '@/Components/Modal';

// Datos hardcodeados para demostración
const PACIENTES_DEMO = [
    { id: 1, nombre: 'Juan', apellido: 'Pérez', ci: '12345678' },
    { id: 2, nombre: 'María', apellido: 'González', ci: '87654321' },
    { id: 3, nombre: 'Carlos', apellido: 'Rodríguez', ci: '45678912' },
];

const NOTAS_DEMO = {
    1: [
        {
            id: 1,
            fecha: '2025-01-20',
            motivo: 'Dolor en muela inferior derecha',
            diagnostico: 'Caries profunda en pieza 46',
            tratamiento: 'Endodoncia + corona',
            evolucion: 'Se realizó primera sesión de endodoncia. Paciente tolera bien el procedimiento.',
            doctor: 'Dr. López'
        },
        {
            id: 2,
            fecha: '2025-01-10',
            motivo: 'Control rutinario',
            diagnostico: 'Gingivitis leve',
            tratamiento: 'Limpieza dental + enjuague con clorhexidina',
            evolucion: 'Se recomienda mejorar técnica de cepillado. Control en 3 meses.',
            doctor: 'Dr. López'
        },
    ],
    2: [
        {
            id: 3,
            fecha: '2025-01-18',
            motivo: 'Blanqueamiento dental',
            diagnostico: 'Pigmentación dental por café',
            tratamiento: 'Blanqueamiento con peróxido de hidrógeno al 35%',
            evolucion: 'Primera sesión completada. Programar segunda sesión en 1 semana.',
            doctor: 'Dra. Martínez'
        },
    ],
    3: [],
};

export default function HistoriaClinica() {
    const [busqueda, setBusqueda] = useState('');
    const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);
    const [modalNuevaNotaAbierto, setModalNuevaNotaAbierto] = useState(false);
    const [notaExpandida, setNotaExpandida] = useState(null);

    const pacientesFiltrados = PACIENTES_DEMO.filter(p =>
        `${p.nombre} ${p.apellido} ${p.ci}`.toLowerCase().includes(busqueda.toLowerCase())
    );

    const notasDelPaciente = pacienteSeleccionado ? (NOTAS_DEMO[pacienteSeleccionado.id] || []) : [];

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Historia Clínica</h2>}
        >
            <Head title="Historia Clínica" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        
                        {/* Panel izquierdo: Lista de pacientes */}
                        <div className="lg:col-span-1">
                            <div className="bg-white shadow-sm sm:rounded-lg p-4">
                                <h3 className="font-semibold text-gray-700 mb-3">Seleccionar Paciente</h3>
                                <TextInput
                                    type="text"
                                    placeholder="Buscar paciente..."
                                    value={busqueda}
                                    onChange={(e) => setBusqueda(e.target.value)}
                                    className="w-full mb-3"
                                />
                                <div className="space-y-2 max-h-96 overflow-y-auto">
                                    {pacientesFiltrados.map((paciente) => (
                                        <button
                                            key={paciente.id}
                                            onClick={() => setPacienteSeleccionado(paciente)}
                                            className={`w-full text-left p-3 rounded-lg border transition-colors ${
                                                pacienteSeleccionado?.id === paciente.id
                                                    ? 'bg-gray-800 text-white border-gray-800'
                                                    : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
                                            }`}
                                        >
                                            <div className="font-medium">{paciente.nombre} {paciente.apellido}</div>
                                            <div className={`text-sm ${pacienteSeleccionado?.id === paciente.id ? 'text-gray-300' : 'text-gray-500'}`}>
                                                CI: {paciente.ci}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Panel derecho: Notas clínicas */}
                        <div className="lg:col-span-2">
                            <div className="bg-white shadow-sm sm:rounded-lg p-6">
                                {!pacienteSeleccionado ? (
                                    <div className="text-center py-12 text-gray-500">
                                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <p className="mt-2">Selecciona un paciente para ver su historia clínica</p>
                                    </div>
                                ) : (
                                    <>
                                        {/* Encabezado del paciente */}
                                        <div className="flex justify-between items-center mb-6 pb-4 border-b">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {pacienteSeleccionado.nombre} {pacienteSeleccionado.apellido}
                                                </h3>
                                                <p className="text-sm text-gray-500">CI: {pacienteSeleccionado.ci}</p>
                                            </div>
                                            <PrimaryButton onClick={() => setModalNuevaNotaAbierto(true)}>
                                                + Nueva Nota
                                            </PrimaryButton>
                                        </div>

                                        {/* Lista de notas */}
                                        {notasDelPaciente.length === 0 ? (
                                            <div className="text-center py-8 text-gray-500">
                                                No hay notas clínicas registradas
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                {notasDelPaciente.map((nota) => (
                                                    <div
                                                        key={nota.id}
                                                        className="border rounded-lg overflow-hidden"
                                                    >
                                                        {/* Cabecera de la nota (siempre visible) */}
                                                        <button
                                                            onClick={() => setNotaExpandida(notaExpandida === nota.id ? null : nota.id)}
                                                            className="w-full text-left p-4 bg-gray-50 hover:bg-gray-100 flex justify-between items-center"
                                                        >
                                                            <div>
                                                                <div className="font-medium text-gray-900">{nota.motivo}</div>
                                                                <div className="text-sm text-gray-500">
                                                                    {new Date(nota.fecha).toLocaleDateString('es-BO')} • {nota.doctor}
                                                                </div>
                                                            </div>
                                                            <svg
                                                                className={`w-5 h-5 text-gray-400 transition-transform ${notaExpandida === nota.id ? 'rotate-180' : ''}`}
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                            </svg>
                                                        </button>

                                                        {/* Contenido expandible */}
                                                        {notaExpandida === nota.id && (
                                                            <div className="p-4 space-y-3 border-t">
                                                                <div>
                                                                    <span className="text-sm font-semibold text-gray-700">Diagnóstico:</span>
                                                                    <p className="text-gray-600">{nota.diagnostico}</p>
                                                                </div>
                                                                <div>
                                                                    <span className="text-sm font-semibold text-gray-700">Tratamiento:</span>
                                                                    <p className="text-gray-600">{nota.tratamiento}</p>
                                                                </div>
                                                                <div>
                                                                    <span className="text-sm font-semibold text-gray-700">Evolución:</span>
                                                                    <p className="text-gray-600">{nota.evolucion}</p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Nueva Nota */}
            <Modal show={modalNuevaNotaAbierto} onClose={() => setModalNuevaNotaAbierto(false)} maxWidth="lg">
                <div className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Nueva Nota Clínica</h3>
                    <p className="text-sm text-gray-500 mb-4">
                        Paciente: {pacienteSeleccionado?.nombre} {pacienteSeleccionado?.apellido}
                    </p>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Motivo de consulta *</label>
                            <input type="text" className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Diagnóstico *</label>
                            <input type="text" className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tratamiento *</label>
                            <textarea rows={2} className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"></textarea>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Evolución / Notas</label>
                            <textarea rows={2} className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"></textarea>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            onClick={() => setModalNuevaNotaAbierto(false)}
                            className="px-4 py-2 text-gray-700 hover:text-gray-900"
                        >
                            Cancelar
                        </button>
                        <PrimaryButton onClick={() => {
                            alert('Nota guardada (demo)');
                            setModalNuevaNotaAbierto(false);
                        }}>
                            Guardar Nota
                        </PrimaryButton>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
