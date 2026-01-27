import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import Modal from '@/Components/Modal';
import FormularioDoctor from '@/Components/FormularioDoctor';

export default function GestionDoctores() {
    const [doctores, setDoctores] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [loading, setLoading] = useState(true);
    const [modalAbierto, setModalAbierto] = useState(false);
    const [doctorEditando, setDoctorEditando] = useState(null);
    const [paginacion, setPaginacion] = useState(null);
    const [modalCredenciales, setModalCredenciales] = useState(false);
    const [credenciales, setCredenciales] = useState(null);
    const [especialidades, setEspecialidades] = useState([]);

    // Cargar especialidades
    const cargarEspecialidades = async () => {
        try {
            const response = await fetch('/doctors/especialidades');
            const data = await response.json();
            setEspecialidades(data);
        } catch (error) {
            console.error('Error cargando especialidades:', error);
        }
    };

    // Cargar doctores
    const cargarDoctores = async (url = '/doctors') => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (busqueda) params.append('buscar', busqueda);

            const response = await fetch(`${url}?${params}`);
            const data = await response.json();

            setDoctores(data.data);
            setPaginacion({
                currentPage: data.current_page,
                lastPage: data.last_page,
                total: data.total,
                links: data.links
            });
        } catch (error) {
            console.error('Error cargando doctores:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarEspecialidades();
        cargarDoctores();
    }, []);

    // Buscar con debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            cargarDoctores();
        }, 300);
        return () => clearTimeout(timer);
    }, [busqueda]);

    const abrirModalNuevo = () => {
        setDoctorEditando(null);
        setModalAbierto(true);
    };

    const abrirModalEditar = (doctor) => {
        setDoctorEditando(doctor);
        setModalAbierto(true);
    };

    const cerrarModal = () => {
        setModalAbierto(false);
        setDoctorEditando(null);
    };

    const handleGuardado = (result) => {
        cerrarModal();
        cargarDoctores();

        // Si hay credenciales (nuevo doctor), mostrar modal
        if (result?.credentials) {
            setCredenciales(result.credentials);
            setModalCredenciales(true);
        }
    };

    const cerrarModalCredenciales = () => {
        setModalCredenciales(false);
        setCredenciales(null);
    };

    const copiarCredenciales = () => {
        const texto = `Email: ${credenciales.email}\nContraseña: ${credenciales.password}`;
        navigator.clipboard.writeText(texto);
        alert('Credenciales copiadas al portapapeles');
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Gestión de Doctores</h2>}
        >
            <Head title="Gestión de Doctores" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Barra de búsqueda y botón nuevo */}
                    <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
                        <div className="w-full sm:w-96">
                            <TextInput
                                type="text"
                                placeholder="Buscar por nombre, CI, teléfono o matrícula..."
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                                className="w-full"
                            />
                        </div>
                        <PrimaryButton onClick={abrirModalNuevo}>
                            + Nuevo Doctor
                        </PrimaryButton>
                    </div>

                    {/* Tabla de doctores */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {loading ? (
                                <div className="text-center py-8 text-gray-500">
                                    Cargando...
                                </div>
                            ) : doctores.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    No se encontraron doctores
                                </div>
                            ) : (
                                <>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Doctor
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        CI
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Teléfono
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Especialidades
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Estado
                                                    </th>
                                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Acciones
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {doctores.map((doctor) => (
                                                    <tr key={doctor.id} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                Dr. {doctor.nombre} {doctor.apellido}
                                                            </div>
                                                            {doctor.matricula_profesional && (
                                                                <div className="text-xs text-gray-500">
                                                                    Mat: {doctor.matricula_profesional}
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {doctor.ci}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {doctor.telefono}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex flex-wrap gap-1">
                                                                {doctor.especialidades?.map((esp) => (
                                                                    <span
                                                                        key={esp.id}
                                                                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                                                                    >
                                                                        {esp.nombre}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                                doctor.activo
                                                                    ? 'bg-green-100 text-green-800'
                                                                    : 'bg-red-100 text-red-800'
                                                            }`}>
                                                                {doctor.activo ? 'Activo' : 'Inactivo'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                            <button
                                                                onClick={() => abrirModalEditar(doctor)}
                                                                className="text-indigo-600 hover:text-indigo-900"
                                                            >
                                                                Editar
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Paginación simple */}
                                    {paginacion && paginacion.lastPage > 1 && (
                                        <div className="mt-4 flex justify-between items-center">
                                            <span className="text-sm text-gray-500">
                                                Mostrando {doctores.length} de {paginacion.total} doctores
                                            </span>
                                            <div className="flex gap-2">
                                                {paginacion.links.map((link, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => link.url && cargarDoctores(link.url)}
                                                        disabled={!link.url}
                                                        className={`px-3 py-1 text-sm rounded ${
                                                            link.active
                                                                ? 'bg-gray-800 text-white'
                                                                : link.url
                                                                    ? 'bg-gray-200 hover:bg-gray-300'
                                                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                        }`}
                                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    {/* Modal de formulario */}
                    <Modal show={modalAbierto} onClose={cerrarModal} maxWidth="lg">
                        <FormularioDoctor
                            doctor={doctorEditando}
                            especialidades={especialidades}
                            onGuardado={handleGuardado}
                            onCancelar={cerrarModal}
                        />
                    </Modal>

                    {/* Modal de credenciales */}
                    <Modal show={modalCredenciales} onClose={cerrarModalCredenciales} maxWidth="md">
                        <div className="p-6">
                            <div className="text-center mb-6">
                                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900">
                                    Doctor Creado Exitosamente
                                </h3>
                                <p className="text-gray-600 mt-2">
                                    Guarde las siguientes credenciales para que el doctor pueda acceder al sistema:
                                </p>
                            </div>

                            {credenciales && (
                                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                    <div className="mb-3">
                                        <label className="block text-sm font-medium text-gray-500 mb-1">
                                            Email / Usuario
                                        </label>
                                        <div className="bg-white border rounded px-3 py-2 font-mono text-gray-900">
                                            {credenciales.email}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">
                                            Contraseña
                                        </label>
                                        <div className="bg-white border rounded px-3 py-2 font-mono text-gray-900">
                                            {credenciales.password}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-3">
                                <button
                                    onClick={copiarCredenciales}
                                    className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                    </svg>
                                    Copiar Credenciales
                                </button>
                                <button
                                    onClick={cerrarModalCredenciales}
                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </Modal>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
