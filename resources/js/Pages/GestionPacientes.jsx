import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import Modal from '@/Components/Modal';
import FormularioPaciente from '@/Components/FormularioPaciente';
import FichaPaciente from '@/Components/FichaPaciente';

export default function GestionPacientes() {
    const [pacientes, setPacientes] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [loading, setLoading] = useState(true);
    const [modalAbierto, setModalAbierto] = useState(false);
    const [pacienteEditando, setPacienteEditando] = useState(null);
    const [paginacion, setPaginacion] = useState(null);
    const [modalFichaAbierto, setModalFichaAbierto] = useState(false);
    const [pacienteViendo, setPacienteViendo] = useState(null);

    // Cargar pacientes
    const cargarPacientes = async (url = '/patients') => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (busqueda) params.append('buscar', busqueda);
            
            const response = await fetch(`${url}?${params}`);
            const data = await response.json();
            
            setPacientes(data.data);
            setPaginacion({
                currentPage: data.current_page,
                lastPage: data.last_page,
                total: data.total,
                links: data.links
            });
        } catch (error) {
            console.error('Error cargando pacientes:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarPacientes();
    }, []);

    // Buscar con debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            cargarPacientes();
        }, 300);
        return () => clearTimeout(timer);
    }, [busqueda]);

    const abrirModalNuevo = () => {
        setPacienteEditando(null);
        setModalAbierto(true);
    };

    const abrirModalEditar = (paciente) => {
        setPacienteEditando(paciente);
        setModalAbierto(true);
    };

    const cerrarModal = () => {
        setModalAbierto(false);
        setPacienteEditando(null);
    };

    const handleGuardado = () => {
        cerrarModal();
        cargarPacientes();
    };

    const abrirFicha = (paciente) => {
        setPacienteViendo(paciente);
        setModalFichaAbierto(true);
    };

    const cerrarFicha = () => {
        setModalFichaAbierto(false);
        setPacienteViendo(null);
    };

    const editarDesdeFicha = (paciente) => {
        cerrarFicha();
        abrirModalEditar(paciente);
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Gestión de Pacientes</h2>}
        >
            <Head title="Gestión de Pacientes" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Barra de búsqueda y botón nuevo */}
                    <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
                        <div className="w-full sm:w-96">
                            <TextInput
                                type="text"
                                placeholder="Buscar por nombre, CI o teléfono..."
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                                className="w-full"
                            />
                        </div>
                        <PrimaryButton onClick={abrirModalNuevo}>
                            + Nuevo Paciente
                        </PrimaryButton>
                    </div>

                    {/* Tabla de pacientes */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {loading ? (
                                <div className="text-center py-8 text-gray-500">
                                    Cargando...
                                </div>
                            ) : pacientes.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    No se encontraron pacientes
                                </div>
                            ) : (
                                <>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Paciente
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        CI
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Teléfono
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Email
                                                    </th>
                                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Acciones
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {pacientes.map((paciente) => (
                                                    <tr key={paciente.id} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {paciente.nombre} {paciente.apellido}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {paciente.ci}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {paciente.telefono}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {paciente.email || '-'}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                            <button
                                                                onClick={() => abrirModalEditar(paciente)}
                                                                className="text-indigo-600 hover:text-indigo-900 mr-4"
                                                            >
                                                                Editar
                                                            </button>
                                                            <button
                                                                onClick={() => abrirFicha(paciente)}
                                                                className="text-green-600 hover:text-green-900"
                                                            >
                                                                Ver Ficha
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
                                                Mostrando {pacientes.length} de {paginacion.total} pacientes
                                            </span>
                                            <div className="flex gap-2">
                                                {paginacion.links.map((link, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => link.url && cargarPacientes(link.url)}
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

                    {/* Modal placeholder - lo crearemos en el siguiente prompt */}
                    <Modal show={modalAbierto} onClose={cerrarModal} maxWidth="lg">
                        <FormularioPaciente
                            paciente={pacienteEditando}
                            onGuardado={handleGuardado}
                            onCancelar={cerrarModal}
                        />
                    </Modal>

                    <Modal show={modalFichaAbierto} onClose={cerrarFicha} maxWidth="lg">
                        <FichaPaciente
                            paciente={pacienteViendo}
                            onEditar={editarDesdeFicha}
                            onCerrar={cerrarFicha}
                        />
                    </Modal>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
