import { useState, useEffect } from "react";
import DiasCarousel from "./Turnos/DiasCarousel";
import Horarios from "./Turnos/Horarios";
import AgendarButton from "./Turnos/AgendarButton";
import ResumenModal from "./Turnos/ResumenModal";

export default function Turnos() {
    const [dias, setDias] = useState([]);
    const [horarios, setHorarios] = useState([]);
    const [seleccionDia, setSeleccionDia] = useState(null);
    const [seleccionHora, setSeleccionHora] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [botonVisible, setBotonVisible] = useState(false);

    // 1️⃣ Obtener días desde API
    useEffect(() => {
        fetch('/available-days')
            .then(res => res.json())
            .then(data => {
                setDias(data);
                setSeleccionDia(data[0]?.value || null); // primer día real
            });
    }, []);

    // 2️⃣ Obtener horarios al cambiar día
    useEffect(() => {
        if (!seleccionDia) return;
        fetch(`/available-hours?date=${seleccionDia}`)
            .then(res => res.json())
            .then(data => {
                setHorarios(data);
                setSeleccionHora(null);
                setBotonVisible(false);
            });
    }, [seleccionDia]);

    // 3️⃣ Mostrar botón si se selecciona hora
    useEffect(() => {
        setBotonVisible(!!seleccionHora);
    }, [seleccionHora]);

    return (
        <div className="mt-1 p-4 bg-white w-full relative">
            <h3 className="text-lg font-semibold mb-4 capitalize border-b-2 border-black md:pb-3">
                {dias.find(d => d.value === seleccionDia)?.label || ""}:
            </h3>

            <DiasCarousel dias={dias} seleccion={seleccionDia} setSeleccion={setSeleccionDia} />

            <Horarios 
                horarios={horarios} 
                onSeleccionarHora={setSeleccionHora} 
                seleccionHora={seleccionHora}
            />

            <AgendarButton
                hora={seleccionHora}
                visible={botonVisible}
                onClick={() => setMostrarModal(true)}
            />

            <ResumenModal
                mostrar={mostrarModal}
                onClose={() => setMostrarModal(false)}
                servicio="Clínica Dental"
                fechaLabel={dias.find(d => d.value === seleccionDia)?.label || ""}
                fechaValue={seleccionDia}
                hora={seleccionHora}
            />
        </div>
    );
}
