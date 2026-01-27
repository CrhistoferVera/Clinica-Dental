import { useState, useEffect } from "react";
import DiasCarousel from "./Turnos/DiasCarousel";
import Horarios from "./Turnos/Horarios";
import AgendarButton from "./Turnos/AgendarButton";
import ResumenModal from "./Turnos/ResumenModal";

export default function Turnos() {
    // Estados para el flujo
    const [paso, setPaso] = useState(1);

    // Datos
    const [especialidades, setEspecialidades] = useState([]);
    const [doctores, setDoctores] = useState([]);
    const [doctoresFiltrados, setDoctoresFiltrados] = useState([]);
    const [dias, setDias] = useState([]);
    const [horarios, setHorarios] = useState([]);

    // Selecciones
    const [especialidadSeleccionada, setEspecialidadSeleccionada] = useState(null);
    const [doctorSeleccionado, setDoctorSeleccionado] = useState(null);
    const [seleccionDia, setSeleccionDia] = useState(null);
    const [seleccionHora, setSeleccionHora] = useState(null);

    // UI
    const [mostrarModal, setMostrarModal] = useState(false);
    const [loading, setLoading] = useState(false);

    // 1. Cargar especialidades y doctores al inicio
    useEffect(() => {
        Promise.all([
            fetch('/especialidades/activas').then(res => res.json()),
            fetch('/doctors/activos').then(res => res.json())
        ]).then(([espData, docData]) => {
            setEspecialidades(espData);
            setDoctores(docData);
        });
    }, []);

    // 2. Filtrar doctores cuando se selecciona especialidad
    useEffect(() => {
        if (!especialidadSeleccionada) {
            setDoctoresFiltrados([]);
            return;
        }

        const filtrados = doctores.filter(doctor =>
            doctor.especialidades?.some(esp => esp.id === especialidadSeleccionada.id)
        );
        setDoctoresFiltrados(filtrados);
        setDoctorSeleccionado(null);
        setSeleccionDia(null);
        setSeleccionHora(null);
    }, [especialidadSeleccionada, doctores]);

    // 3. Cargar días cuando se selecciona doctor
    useEffect(() => {
        if (!doctorSeleccionado) {
            setDias([]);
            return;
        }

        fetch('/available-days')
            .then(res => res.json())
            .then(data => {
                // Filtrar días donde el doctor tiene horario
                const diasConHorario = data.filter(dia => {
                    const fecha = new Date(dia.value + 'T12:00:00');
                    const dayOfWeek = fecha.getDay();
                    return doctorSeleccionado.horarios?.some(h => h.day_of_week === dayOfWeek && h.activo);
                });
                setDias(diasConHorario);
                if (diasConHorario.length > 0) {
                    setSeleccionDia(diasConHorario[0].value);
                }
            });

        setSeleccionHora(null);
    }, [doctorSeleccionado]);

    // 4. Cargar horarios cuando se selecciona día
    useEffect(() => {
        if (!seleccionDia || !doctorSeleccionado) {
            setHorarios([]);
            return;
        }

        setLoading(true);
        fetch(`/available-hours?date=${seleccionDia}&doctor_id=${doctorSeleccionado.id}`)
            .then(res => res.json())
            .then(data => {
                setHorarios(data);
                setSeleccionHora(null);
            })
            .finally(() => setLoading(false));
    }, [seleccionDia, doctorSeleccionado]);

    const handleSelectEspecialidad = (esp) => {
        setEspecialidadSeleccionada(esp);
        setPaso(2);
    };

    const handleSelectDoctor = (doc) => {
        setDoctorSeleccionado(doc);
        setPaso(3);
    };

    const handleBack = () => {
        if (paso === 2) {
            setEspecialidadSeleccionada(null);
            setPaso(1);
        } else if (paso === 3) {
            setDoctorSeleccionado(null);
            setSeleccionDia(null);
            setSeleccionHora(null);
            setPaso(2);
        }
    };

    // Renderizar paso actual
    const renderPaso = () => {
        switch (paso) {
            case 1:
                return (
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">
                            Paso 1: Selecciona una especialidad
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {especialidades.map((esp) => (
                                <button
                                    key={esp.id}
                                    onClick={() => handleSelectEspecialidad(esp)}
                                    className="p-4 border-2 border-gray-200 rounded-xl hover:border-cyan-500 hover:bg-cyan-50 transition-all text-left group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="bg-cyan-100 text-cyan-600 rounded-full p-2 group-hover:bg-cyan-500 group-hover:text-white transition-colors">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-800 block">{esp.nombre}</span>
                                            {esp.descripcion && (
                                                <span className="text-sm text-gray-500">{esp.descripcion}</span>
                                            )}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                        {especialidades.length === 0 && (
                            <p className="text-center text-gray-500 py-8">Cargando especialidades...</p>
                        )}
                    </div>
                );

            case 2:
                return (
                    <div>
                        <button
                            onClick={handleBack}
                            className="flex items-center gap-2 text-cyan-600 hover:text-cyan-700 mb-4"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Cambiar especialidad
                        </button>

                        <div className="bg-cyan-50 rounded-lg p-3 mb-4">
                            <span className="text-sm text-cyan-600">Especialidad:</span>
                            <span className="font-medium text-cyan-800 ml-2">{especialidadSeleccionada?.nombre}</span>
                        </div>

                        <h3 className="text-lg font-semibold mb-4 text-gray-800">
                            Paso 2: Selecciona un doctor
                        </h3>

                        {doctoresFiltrados.length > 0 ? (
                            <div className="grid grid-cols-1 gap-3">
                                {doctoresFiltrados.map((doc) => (
                                    <button
                                        key={doc.id}
                                        onClick={() => handleSelectDoctor(doc)}
                                        className="p-4 border-2 border-gray-200 rounded-xl hover:border-cyan-500 hover:bg-cyan-50 transition-all text-left"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="bg-gray-200 rounded-full p-3">
                                                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </div>
                                            <div className="flex-1">
                                                <span className="font-medium text-gray-800 block">
                                                    Dr. {doc.nombre} {doc.apellido}
                                                </span>
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {doc.especialidades?.map(esp => (
                                                        <span
                                                            key={esp.id}
                                                            className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded"
                                                        >
                                                            {esp.nombre}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                                <p>No hay doctores disponibles para esta especialidad</p>
                            </div>
                        )}
                    </div>
                );

            case 3:
                return (
                    <div>
                        <button
                            onClick={handleBack}
                            className="flex items-center gap-2 text-cyan-600 hover:text-cyan-700 mb-4"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Cambiar doctor
                        </button>

                        <div className="bg-cyan-50 rounded-lg p-3 mb-4 space-y-1">
                            <div>
                                <span className="text-sm text-cyan-600">Especialidad:</span>
                                <span className="font-medium text-cyan-800 ml-2">{especialidadSeleccionada?.nombre}</span>
                            </div>
                            <div>
                                <span className="text-sm text-cyan-600">Doctor:</span>
                                <span className="font-medium text-cyan-800 ml-2">
                                    Dr. {doctorSeleccionado?.nombre} {doctorSeleccionado?.apellido}
                                </span>
                            </div>
                        </div>

                        <h3 className="text-lg font-semibold mb-4 text-gray-800">
                            Paso 3: Selecciona día y horario
                        </h3>

                        {dias.length > 0 ? (
                            <>
                                <h4 className="text-md font-medium mb-2 text-gray-700 capitalize border-b pb-2">
                                    {dias.find(d => d.value === seleccionDia)?.label || ""}
                                </h4>

                                <DiasCarousel
                                    dias={dias}
                                    seleccion={seleccionDia}
                                    setSeleccion={setSeleccionDia}
                                />

                                {loading ? (
                                    <div className="text-center py-8 text-gray-500">
                                        Cargando horarios...
                                    </div>
                                ) : (
                                    <Horarios
                                        horarios={horarios}
                                        onSeleccionarHora={setSeleccionHora}
                                        seleccionHora={seleccionHora}
                                    />
                                )}

                                <AgendarButton
                                    hora={seleccionHora}
                                    visible={!!seleccionHora}
                                    onClick={() => setMostrarModal(true)}
                                />
                            </>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p>Este doctor no tiene horarios configurados</p>
                            </div>
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="p-4 bg-white w-full">
            {/* Indicador de pasos */}
            <div className="flex items-center justify-center mb-6">
                {[1, 2, 3].map((num) => (
                    <div key={num} className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                            paso >= num
                                ? 'bg-cyan-600 text-white'
                                : 'bg-gray-200 text-gray-500'
                        }`}>
                            {num}
                        </div>
                        {num < 3 && (
                            <div className={`w-12 h-1 mx-1 transition-colors ${
                                paso > num ? 'bg-cyan-600' : 'bg-gray-200'
                            }`} />
                        )}
                    </div>
                ))}
            </div>

            {renderPaso()}

            <ResumenModal
                mostrar={mostrarModal}
                onClose={() => setMostrarModal(false)}
                servicio={especialidadSeleccionada?.nombre || "Clinica Dental"}
                doctor={doctorSeleccionado}
                fechaLabel={dias.find(d => d.value === seleccionDia)?.label || ""}
                fechaValue={seleccionDia}
                hora={seleccionHora}
            />
        </div>
    );
}
