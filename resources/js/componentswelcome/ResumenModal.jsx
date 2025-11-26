import { Fragment, useState } from "react";
import { Transition } from "@headlessui/react";
import { ArrowLeft } from "lucide-react";

export default function ResumenModal({ mostrar, onClose, servicio, fecha, hora }) {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    telefono: "",
    correo: "",
    metodoPago: "Efectivo",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFinalizar = () => {
    const resumen = {
      servicio,
      fecha,
      hora,
      ...form
    };
    console.log("Resumen de la cita:", resumen);
    onClose();
  };

  return (
    <Transition as={Fragment} show={mostrar}>
      {/* Fondo oscuro */}
      <Transition.Child
        as={Fragment}
        enter="transition-opacity duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-50"
        leave="transition-opacity duration-300"
        leaveFrom="opacity-50"
        leaveTo="opacity-0"
      >
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black z-40"
          style={{ opacity: 0.5 }}
        />
      </Transition.Child>

      {/* Panel */}
      <Transition.Child
        as={Fragment}
        enter="transform transition duration-300"
        enterFrom="translate-x-full"
        enterTo="translate-x-0"
        leave="transform transition duration-300"
        leaveFrom="translate-x-0"
        leaveTo="translate-x-full"
      >
        <div className="fixed top-0 right-0 h-full z-50 bg-white shadow-lg w-full md:w-96 flex flex-col overflow-auto">
          
          {/* Cabecera */}
          <div className="bg-black text-white flex items-center p-4">
            <button onClick={onClose} className="mr-4">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-bold text-center flex-1">Reservar Turno</h2>
          </div>

          {/* Contenido */}
          <div className="p-6 flex-1 flex flex-col gap-4">
            {/* Resumen */}
            <div className="bg-gray-100 p-4 rounded-lg">
              <p><strong>Servicio:</strong> {servicio}</p>
              <p><strong>Fecha:</strong> {fecha}</p>
              <p><strong>Hora:</strong> {hora}</p>
            </div>

            {/* Formulario */}
            <div className="flex flex-col gap-3">
              <input
                type="text"
                name="nombre"
                placeholder="Nombre"
                value={form.nombre}
                onChange={handleChange}
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              />
              <input
                type="text"
                name="apellido"
                placeholder="Apellido"
                value={form.apellido}
                onChange={handleChange}
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              />
              <input
                type="text"
                name="dni"
                placeholder="DNI / CI"
                value={form.dni}
                onChange={handleChange}
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              />
              <input
                type="text"
                name="telefono"
                placeholder="Teléfono / WhatsApp"
                value={form.telefono}
                onChange={handleChange}
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              />
              <input
                type="email"
                name="correo"
                placeholder="Correo"
                value={form.correo}
                onChange={handleChange}
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              />

              <select
                name="metodoPago"
                value={form.metodoPago}
                onChange={handleChange}
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option>Efectivo</option>
                <option>Transferencia Bancaria</option>
                <option>QR</option>
              </select>
            </div>
          </div>

          {/* Botón finalizar */}
          <div className="p-6 border-t">
            <button
              onClick={handleFinalizar}
              className="w-full bg-black text-white py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors"
            >
              Finalizar
            </button>
          </div>
        </div>
      </Transition.Child>
    </Transition>
  );
}
