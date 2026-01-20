import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import CitaCard from "./CitaCard";

export default function CalendarioAgenda() {
    const [vistaActual, setVistaActual] = useState("mes"); // "mes" o "semana"
    const [fechaActual, setFechaActual] = useState(new Date());
    const [citas, setCitas] = useState([]);
    const [loading, setLoading] = useState(false);

    const meses = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    const diasSemana = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

    // Cargar citas del mes actual
    useEffect(() => {
        cargarCitas();
    }, [fechaActual]);

    const cargarCitas = async () => {
        setLoading(true);
        try {
            const mes = fechaActual.getMonth() + 1;
            const anio = fechaActual.getFullYear();
            const response = await fetch(`/appointments/calendar?month=${mes}&year=${anio}`);
            const data = await response.json();
            setCitas(data);
        } catch (error) {
            console.error("Error al cargar citas:", error);
        } finally {
            setLoading(false);
        }
    };

    // Navegación
    const anterior = () => {
        if (vistaActual === "mes") {
            setFechaActual(new Date(fechaActual.getFullYear(), fechaActual.getMonth() - 1));
        } else {
            const nuevaFecha = new Date(fechaActual);
            nuevaFecha.setDate(nuevaFecha.getDate() - 7);
            setFechaActual(nuevaFecha);
        }
    };

    const siguiente = () => {
        if (vistaActual === "mes") {
            setFechaActual(new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1));
        } else {
            const nuevaFecha = new Date(fechaActual);
            nuevaFecha.setDate(nuevaFecha.getDate() + 7);
            setFechaActual(nuevaFecha);
        }
    };

    const hoy = () => {
        setFechaActual(new Date());
    };

    // Obtener días del mes
    const obtenerDiasDelMes = () => {
        const primerDia = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1);
        const ultimoDia = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 0);
        const diasDelMes = [];

        // Días vacíos al inicio
        for (let i = 0; i < primerDia.getDay(); i++) {
            diasDelMes.push(null);
        }

        // Días del mes
        for (let dia = 1; dia <= ultimoDia.getDate(); dia++) {
            diasDelMes.push(new Date(fechaActual.getFullYear(), fechaActual.getMonth(), dia));
        }

        return diasDelMes;
    };

    // Obtener días de la semana
    const obtenerDiasDeLaSemana = () => {
        const inicio = new Date(fechaActual);
        inicio.setDate(inicio.getDate() - inicio.getDay()); // Ir al domingo

        const dias = [];
        for (let i = 0; i < 7; i++) {
            const dia = new Date(inicio);
            dia.setDate(dia.getDate() + i);
            dias.push(dia);
        }
        return dias;
    };

    // Obtener citas de un día específico
    const obtenerCitasDelDia = (fecha) => {
        if (!fecha) return [];
        const fechaStr = fecha.toISOString().split('T')[0];
        return citas.filter(cita => cita.date === fechaStr);
    };

    // Renderizar vista mensual
    const renderVistaMensual = () => {
        const dias = obtenerDiasDelMes();
        const hoyStr = new Date().toISOString().split('T')[0];

        return (
            <div className="grid grid-cols-7 gap-2">
                {/* Encabezado días de la semana */}
                {diasSemana.map(dia => (
                    <div key={dia} className="text-center font-semibold text-gray-600 py-2">
                        {dia}
                    </div>
                ))}

                {/* Días del mes */}
                {dias.map((fecha, index) => {
                    if (!fecha) {
                        return <div key={`empty-${index}`} className="aspect-square" />;
                    }

                    const citasDelDia = obtenerCitasDelDia(fecha);
                    const esHoy = fecha.toISOString().split('T')[0] === hoyStr;

                    return (
                        <div
                            key={index}
                            className={`aspect-square border rounded-lg p-2 hover:bg-gray-50 transition-colors ${
                                esHoy ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                            }`}
                        >
                            <div className={`text-sm font-semibold ${esHoy ? 'text-blue-600' : 'text-gray-700'}`}>
                                {fecha.getDate()}
                            </div>
                            {citasDelDia.length > 0 && (
                                <div className="mt-1 space-y-1">
                                    {citasDelDia.slice(0, 2).map(cita => (
                                        <div
                                            key={cita.id}
                                            className={`text-xs px-1 py-0.5 rounded truncate ${
                                                cita.status === 'programada' ? 'bg-yellow-100 text-yellow-800' :
                                                cita.status === 'confirmada' ? 'bg-green-100 text-green-800' :
                                                cita.status === 'atendida' ? 'bg-blue-100 text-blue-800' :
                                                'bg-red-100 text-red-800'
                                            }`}
                                        >
                                            {cita.time_start}
                                        </div>
                                    ))}
                                    {citasDelDia.length > 2 && (
                                        <div className="text-xs text-gray-500">
                                            +{citasDelDia.length - 2} más
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    };

    // Renderizar vista semanal
    const renderVistaSemanal = () => {
        const dias = obtenerDiasDeLaSemana();
        const hoyStr = new Date().toISOString().split('T')[0];

        return (
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                {dias.map((fecha, index) => {
                    const citasDelDia = obtenerCitasDelDia(fecha);
                    const esHoy = fecha.toISOString().split('T')[0] === hoyStr;

                    return (
                        <div key={index} className="border rounded-lg overflow-hidden">
                            <div className={`p-3 text-center font-semibold ${
                                esHoy ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'
                            }`}>
                                <div className="text-sm">{diasSemana[fecha.getDay()]}</div>
                                <div className="text-2xl">{fecha.getDate()}</div>
                            </div>
                            <div className="p-2 space-y-2 min-h-[200px]">
                                {citasDelDia.length > 0 ? (
                                    citasDelDia.map(cita => (
                                        <CitaCard key={cita.id} cita={cita} onUpdate={cargarCitas} />
                                    ))
                                ) : (
                                    <p className="text-gray-400 text-sm text-center py-4">Sin citas</p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow">
            {/* Cabecera */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold">
                        {meses[fechaActual.getMonth()]} {fechaActual.getFullYear()}
                    </h2>
                    <button
                        onClick={hoy}
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-semibold"
                    >
                        Hoy
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    {/* Navegación */}
                    <button
                        onClick={anterior}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={siguiente}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>

                    {/* Selector de vista */}
                    <div className="flex gap-1 ml-4 border rounded-lg overflow-hidden">
                        <button
                            onClick={() => setVistaActual("semana")}
                            className={`px-4 py-2 text-sm font-semibold ${
                                vistaActual === "semana" ? 'bg-black text-white' : 'bg-white text-gray-700'
                            }`}
                        >
                            Semana
                        </button>
                        <button
                            onClick={() => setVistaActual("mes")}
                            className={`px-4 py-2 text-sm font-semibold ${
                                vistaActual === "mes" ? 'bg-black text-white' : 'bg-white text-gray-700'
                            }`}
                        >
                            Mes
                        </button>
                    </div>
                </div>
            </div>

            {/* Contenido del calendario */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
                    <p className="mt-4 text-gray-600">Cargando citas...</p>
                </div>
            ) : (
                vistaActual === "mes" ? renderVistaMensual() : renderVistaSemanal()
            )}
        </div>
    );
}
