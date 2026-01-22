import { useState, useEffect } from "react";
import { Search, Filter, Calendar, Clock, User } from "lucide-react";
import CitaCard from "./CitaCard";

export default function ListaCitas() {
    const [citas, setCitas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtroEstado, setFiltroEstado] = useState('todas');
    const [filtroFecha, setFiltroFecha] = useState('');
    const [busqueda, setBusqueda] = useState('');

    useEffect(() => {
        cargarCitas();
    }, [filtroEstado, filtroFecha]);

    const cargarCitas = async () => {
        setLoading(true);
        try {
            let url = '/appointments?';

            if (filtroEstado !== 'todas') {
                url += `status=${filtroEstado}&`;
            }

            if (filtroFecha) {
                url += `date=${filtroFecha}&`;
            }

            const response = await fetch(url);
            const data = await response.json();
            setCitas(data);
        } catch (error) {
            console.error('Error al cargar citas:', error);
        } finally {
            setLoading(false);
        }
    };

    // Filtrar por búsqueda local
    const citasFiltradas = citas.filter(cita => {
        if (!busqueda) return true;

        const searchLower = busqueda.toLowerCase();
        return (
            cita.patient_name.toLowerCase().includes(searchLower) ||
            cita.patient_lastname.toLowerCase().includes(searchLower) ||
            cita.patient_dni.includes(searchLower) ||
            cita.patient_phone.includes(searchLower) ||
            cita.patient_email.toLowerCase().includes(searchLower)
        );
    });

    // Agrupar por fecha
    const citasAgrupadasPorFecha = citasFiltradas.reduce((grupos, cita) => {
        const fecha = cita.date;
        if (!grupos[fecha]) {
            grupos[fecha] = [];
        }
        grupos[fecha].push(cita);
        return grupos;
    }, {});

    const formatearFecha = (fechaStr) => {
        if (!fechaStr) return 'Fecha no disponible';

        // Asegurar formato YYYY-MM-DD
        const partes = fechaStr.split('T')[0].split('-');
        if (partes.length !== 3) return fechaStr;

        const [year, month, day] = partes.map(Number);
        const fecha = new Date(year, month - 1, day);

        if (isNaN(fecha.getTime())) return fechaStr;

        const opciones = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
        return fecha.toLocaleDateString('es-ES', opciones);
    };

    const estadoConfig = {
        todas: { label: 'Todas', color: 'bg-gray-100 text-gray-800' },
        programada: { label: 'Programadas', color: 'bg-yellow-100 text-yellow-800' },
        confirmada: { label: 'Confirmadas', color: 'bg-green-100 text-green-800' },
        atendida: { label: 'Atendidas', color: 'bg-blue-100 text-blue-800' },
        no_asistio: { label: 'No asistieron', color: 'bg-red-100 text-red-800' },
        cancelada: { label: 'Canceladas', color: 'bg-gray-100 text-gray-800' }
    };

    return (
        <div className="space-y-6">
            {/* Cabecera con estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="text-2xl font-bold text-yellow-800">
                        {citas.filter(c => c.status === 'programada').length}
                    </div>
                    <div className="text-sm text-yellow-600">Programadas</div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-800">
                        {citas.filter(c => c.status === 'confirmada').length}
                    </div>
                    <div className="text-sm text-green-600">Confirmadas</div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-800">
                        {citas.filter(c => c.status === 'atendida').length}
                    </div>
                    <div className="text-sm text-blue-600">Atendidas</div>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="text-2xl font-bold text-red-800">
                        {citas.filter(c => c.status === 'no_asistio').length}
                    </div>
                    <div className="text-sm text-red-600">No asistieron</div>
                </div>
            </div>

            {/* Filtros y búsqueda */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Búsqueda */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre, DNI, teléfono..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        />
                    </div>

                    {/* Filtro por estado */}
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <select
                            value={filtroEstado}
                            onChange={(e) => setFiltroEstado(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent appearance-none"
                        >
                            {Object.entries(estadoConfig).map(([key, config]) => (
                                <option key={key} value={key}>
                                    {config.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Filtro por fecha */}
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="date"
                            value={filtroFecha}
                            onChange={(e) => setFiltroFecha(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Botón limpiar filtros */}
                {(filtroEstado !== 'todas' || filtroFecha || busqueda) && (
                    <button
                        onClick={() => {
                            setFiltroEstado('todas');
                            setFiltroFecha('');
                            setBusqueda('');
                        }}
                        className="text-sm text-gray-600 hover:text-gray-800 underline"
                    >
                        Limpiar filtros
                    </button>
                )}
            </div>

            {/* Lista de citas */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
                    <p className="mt-4 text-gray-600">Cargando citas...</p>
                </div>
            ) : citasFiltradas.length === 0 ? (
                <div className="text-center py-12">
                    <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 text-lg">No se encontraron citas</p>
                    <p className="text-gray-400 text-sm mt-2">
                        {busqueda || filtroEstado !== 'todas' || filtroFecha
                            ? 'Intenta cambiar los filtros'
                            : 'Aún no hay citas registradas'}
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
                    {Object.entries(citasAgrupadasPorFecha)
                        .sort(([fechaA], [fechaB]) => new Date(fechaB) - new Date(fechaA))
                        .map(([fecha, citasDeLaFecha]) => (
                            <div key={fecha} className="space-y-3">
                                {/* Encabezado de fecha */}
                                <div className="sticky top-0 bg-white border-b-2 border-gray-200 pb-2">
                                    <h3 className="text-lg font-semibold text-gray-800 capitalize">
                                        {formatearFecha(fecha)}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        {citasDeLaFecha.length} {citasDeLaFecha.length === 1 ? 'cita' : 'citas'}
                                    </p>
                                </div>

                                {/* Citas de ese día */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {citasDeLaFecha
                                        .sort((a, b) => a.time_start.localeCompare(b.time_start))
                                        .map(cita => (
                                            <CitaCard
                                                key={cita.id}
                                                cita={cita}
                                                onUpdate={cargarCitas}
                                            />
                                        ))}
                                </div>
                            </div>
                        ))}
                </div>
            )}

            {/* Resumen total */}
            {citasFiltradas.length > 0 && (
                <div className="text-center text-gray-500 text-sm pt-4 border-t">
                    Mostrando {citasFiltradas.length} de {citas.length} citas totales
                </div>
            )}
        </div>
    );
}
