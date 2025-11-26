import { useState } from "react";
import DiasCarousel from "./DiasCarousel";
import Horarios from "./Horarios";

const dias = [
    "martes 25 noviembre", "miércoles 26 noviembre", "jueves 27 noviembre", "viernes 28 noviembre",
    "sábado 29 noviembre", "domingo 30 noviembre", "lunes 1 diciembre", "martes 2 diciembre",
    "miércoles 3 diciembre", "jueves 4 diciembre", "viernes 5 diciembre", "sábado 6 diciembre",
    "domingo 7 diciembre", "lunes 8 diciembre", "martes 9 diciembre", "miércoles 10 diciembre",
    "jueves 11 diciembre", "viernes 12 diciembre", "sábado 13 diciembre", "domingo 14 diciembre",
    "lunes 15 diciembre"
];

const horarios = [
    "09:00 - 09:30", "09:30 - 10:00", "10:00 - 10:30", "10:30 - 11:00",
    "11:00 - 11:30", "11:30 - 12:00", "12:00 - 12:30", "12:30 - 13:00",
    "13:00 - 13:30", "13:30 - 14:00", "14:00 - 14:30", "14:30 - 15:00",
    "15:00 - 15:30", "15:30 - 16:00", "16:00 - 16:30", "16:30 - 17:00",
    "17:00 - 17:30", "17:30 - 18:00", "18:00 - 18:30", "18:30 - 19:00", "19:00 - 19:30","19:30 - 20:00"
];

export default function Turnos() {

    const [seleccion, setSeleccion] = useState(dias[0]);

    return (
        <div className="mt-1 p-4 bg-white w-full">

            <h3 className="text-lg font-semibold mb-4 capitalize border-b-2 border-black md:pb-3">
                {seleccion}:
            </h3>

            <DiasCarousel dias={dias} seleccion={seleccion} setSeleccion={setSeleccion} />

            <Horarios horarios={horarios} />
        </div>
    );
}
