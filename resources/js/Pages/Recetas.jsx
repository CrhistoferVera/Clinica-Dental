import { Head } from '@inertiajs/react';
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import Modal from '@/Components/Modal';

const PACIENTES_DEMO = [
    { id: 1, nombre: 'Juan', apellido: 'Pérez', ci: '12345678', edad: 35 },
    { id: 2, nombre: 'María', apellido: 'González', ci: '87654321', edad: 28 },
    { id: 3, nombre: 'Carlos', apellido: 'Rodríguez', ci: '45678912', edad: 42 },
];

const RECETAS_DEMO = [
    {
        id: 1,
        paciente_id: 1,
        paciente_nombre: 'Juan Pérez',
        fecha: '2025-01-20',
        doctor: 'Dr. López',
        diagnostico: 'Infección dental',
        medicamentos: [
            { nombre: 'Amoxicilina 500mg', indicaciones: 'Tomar 1 cápsula cada 8 horas por 7 días' },
            { nombre: 'Ibuprofeno 400mg', indicaciones: 'Tomar 1 tableta cada 8 horas por 3 días (con alimentos)' },
        ]
    },
    {
        id: 2,
        paciente_id: 2,
        paciente_nombre: 'María González',
        fecha: '2025-01-18',
        doctor: 'Dra. Martínez',
        diagnostico: 'Post blanqueamiento dental',
        medicamentos: [
            { nombre: 'Sensodyne Repair', indicaciones: 'Usar como pasta dental regular por 2 semanas' },
        ]
    },
    {
        id: 3,
        paciente_id: 1,
        paciente_nombre: 'Juan Pérez',
        fecha: '2025-01-10',
        doctor: 'Dr. López',
        diagnostico: 'Gingivitis',
        medicamentos: [
            { nombre: 'Clorhexidina 0.12%', indicaciones: 'Enjuagar 15ml por 30 segundos, 2 veces al día por 14 días' },
            { nombre: 'Colgate PerioGard', indicaciones: 'Usar como pasta dental por 1 mes' },
        ]
    },
];

export default function Recetas() {
    const [busqueda, setBusqueda] = useState('');
    const [modalNuevaReceta, setModalNuevaReceta] = useState(false);
    const [recetaViendo, setRecetaViendo] = useState(null);
    const [modalImprimir, setModalImprimir] = useState(false);

    const [nuevaReceta, setNuevaReceta] = useState({
        paciente_id: '',
        diagnostico: '',
        medicamentos: [{ nombre: '', indicaciones: '' }]
    });

    const recetasFiltradas = RECETAS_DEMO.filter(r =>
        r.paciente_nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        r.diagnostico.toLowerCase().includes(busqueda.toLowerCase())
    );

    const agregarMedicamento = () => {
        setNuevaReceta(prev => ({
            ...prev,
            medicamentos: [...prev.medicamentos, { nombre: '', indicaciones: '' }]
        }));
    };

    const quitarMedicamento = (index) => {
        setNuevaReceta(prev => ({
            ...prev,
            medicamentos: prev.medicamentos.filter((_, i) => i !== index)
        }));
    };

    const abrirImprimir = (receta) => {
        setRecetaViendo(receta);
        setModalImprimir(true);
    };

    const imprimir = () => {
        window.print();
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Recetas</h2>}
        >
            <Head title="Recetas" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Barra superior */}
                    <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
                        <TextInput
                            type="text"
                            placeholder="Buscar por paciente o diagnóstico..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            className="w-full sm:w-96"
                        />
                        <PrimaryButton onClick={() => setModalNuevaReceta(true)}>
                            + Nueva Receta
                        </PrimaryButton>
                    </div>

                    {/* Lista de recetas */}
                    <div className="bg-white shadow-sm sm:rounded-lg overflow-hidden">
                        <div className="p-6">
                            {recetasFiltradas.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    No se encontraron recetas
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {recetasFiltradas.map((receta) => (
                                        <div
                                            key={receta.id}
                                            className="border rounded-lg p-4 hover:bg-gray-50"
                                        >
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">
                                                        {receta.paciente_nombre}
                                                    </h4>
                                                    <p className="text-sm text-gray-500">
                                                        {new Date(receta.fecha).toLocaleDateString('es-BO')} • {receta.doctor}
                                                    </p>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        <span className="font-medium">Diagnóstico:</span> {receta.diagnostico}
                                                    </p>
                                                    <div className="mt-2">
                                                        <span className="text-sm font-medium text-gray-600">Medicamentos: </span>
                                                        <span className="text-sm text-gray-500">
                                                            {receta.medicamentos.map(m => m.nombre).join(', ')}
                                                        </span>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => abrirImprimir(receta)}
                                                    className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                                                >
                                                    Ver / Imprimir
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Nueva Receta */}
            <Modal show={modalNuevaReceta} onClose={() => setModalNuevaReceta(false)} maxWidth="lg">
                <div className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Nueva Receta</h3>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Paciente *</label>
                            <select className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                                <option value="">Seleccionar paciente...</option>
                                {PACIENTES_DEMO.map(p => (
                                    <option key={p.id} value={p.id}>{p.nombre} {p.apellido} - CI: {p.ci}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Diagnóstico *</label>
                            <input type="text" className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-medium text-gray-700">Medicamentos *</label>
                                <button
                                    type="button"
                                    onClick={agregarMedicamento}
                                    className="text-sm text-indigo-600 hover:text-indigo-900"
                                >
                                    + Agregar medicamento
                                </button>
                            </div>
                            
                            {nuevaReceta.medicamentos.map((med, index) => (
                                <div key={index} className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        placeholder="Medicamento"
                                        className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Indicaciones"
                                        className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                    {nuevaReceta.medicamentos.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => quitarMedicamento(index)}
                                            className="px-2 text-red-500 hover:text-red-700"
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <button onClick={() => setModalNuevaReceta(false)} className="px-4 py-2 text-gray-700 hover:text-gray-900">
                            Cancelar
                        </button>
                        <PrimaryButton onClick={() => {
                            alert('Receta creada (demo)');
                            setModalNuevaReceta(false);
                        }}>
                            Crear Receta
                        </PrimaryButton>
                    </div>
                </div>
            </Modal>

            {/* Modal Imprimir Receta */}
            <Modal show={modalImprimir} onClose={() => setModalImprimir(false)} maxWidth="2xl">
                {recetaViendo && (
                    <div className="p-8" id="receta-imprimible">
                        {/* Contenido imprimible */}
                        <div className="print:block">
                            {/* Encabezado */}
                            <div className="text-center border-b-2 border-gray-300 pb-4 mb-6">
                                <h1 className="text-2xl font-bold text-gray-900">Clínica Dental</h1>
                                <p className="text-gray-600">Av. Principal #123, Cochabamba</p>
                                <p className="text-gray-600">Tel: (4) 4444444</p>
                            </div>

                            <h2 className="text-xl font-bold text-center mb-6">RECETA MÉDICA</h2>

                            {/* Datos del paciente */}
                            <div className="mb-6 p-4 bg-gray-50 rounded-lg print:bg-white print:border">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <span className="font-semibold">Paciente:</span> {recetaViendo.paciente_nombre}
                                    </div>
                                    <div>
                                        <span className="font-semibold">Fecha:</span> {new Date(recetaViendo.fecha).toLocaleDateString('es-BO')}
                                    </div>
                                    <div className="col-span-2">
                                        <span className="font-semibold">Diagnóstico:</span> {recetaViendo.diagnostico}
                                    </div>
                                </div>
                            </div>

                            {/* Medicamentos */}
                            <div className="mb-8">
                                <h3 className="font-bold text-lg mb-3 border-b pb-2">Prescripción:</h3>
                                <div className="space-y-4">
                                    {recetaViendo.medicamentos.map((med, index) => (
                                        <div key={index} className="pl-4 border-l-4 border-indigo-500">
                                            <p className="font-semibold text-gray-900">Rp. {med.nombre}</p>
                                            <p className="text-gray-600 italic ml-4">{med.indicaciones}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Firma */}
                            <div className="mt-12 pt-8 border-t">
                                <div className="w-64 mx-auto text-center">
                                    <div className="border-b border-gray-400 mb-2"></div>
                                    <p className="font-semibold">{recetaViendo.doctor}</p>
                                    <p className="text-sm text-gray-500">Firma y Sello</p>
                                </div>
                            </div>
                        </div>

                        {/* Botones (no se imprimen) */}
                        <div className="mt-6 flex justify-end gap-3 print:hidden">
                            <button onClick={() => setModalImprimir(false)} className="px-4 py-2 text-gray-700 hover:text-gray-900">
                                Cerrar
                            </button>
                            <PrimaryButton onClick={imprimir}>
                                🖨️ Imprimir
                            </PrimaryButton>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Estilos para impresión */}
            <style>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    #receta-imprimible, #receta-imprimible * {
                        visibility: visible;
                    }
                    #receta-imprimible {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        padding: 20mm;
                    }
                    .print\\:hidden {
                        display: none !important;
                    }
                }
            `}</style>
        </AuthenticatedLayout>
    );
}
