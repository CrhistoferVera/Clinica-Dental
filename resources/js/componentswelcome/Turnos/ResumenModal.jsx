import { Fragment, useState } from "react";
import { Transition } from "@headlessui/react";
import { ArrowLeft } from "lucide-react";
import InputField from "./InputField";

export default function ResumenModal({ mostrar, onClose, servicio, fecha, hora }) {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    telefono: "",
    correo: "",
    metodoPago: "Efectivo",
  });

  const [error, setError] = useState("");

 // Validaciones
const soloLetras = (val) => val.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");


  const soloNumeros = (val) => val.replace(/[^0-9]/g, "");

  const correoValido = (val) => val.replace(/\s/g, ""); // sin espacios

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const validarFormulario = () => {
    if (!form.nombre) return "Ingrese su nombre";
    if (!form.apellido) return "Ingrese su apellido";
    if (!form.dni) return "Ingrese su DNI / CI";
    if (!form.telefono) return "Ingrese su teléfono";
    if (!form.correo) return "Ingrese su correo";
    if (!form.correo.includes("@")) return "Correo inválido";
    return "";
  };

  const handleFinalizar = () => {
    const mensajeError = validarFormulario();
    if (mensajeError) {
      setError(mensajeError);
      return; // No enviar si hay error
    }

    const resumen = { servicio, fecha, hora, ...form };
    console.log("Resumen de la cita:", resumen);
    setError("");
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
        <div onClick={onClose} className="fixed inset-0 bg-black z-40" style={{ opacity: 0.5 }} />
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
              <InputField label="Nombre" name="nombre" value={form.nombre} onChange={handleChange} validation={soloLetras} maxLength={30} />
              <InputField label="Apellido" name="apellido" value={form.apellido} onChange={handleChange} validation={soloLetras} maxLength={30} />
              <InputField label="DNI / CI" name="dni" value={form.dni} onChange={handleChange} validation={soloNumeros} maxLength={15} />
              <InputField label="Teléfono / WhatsApp" name="telefono" value={form.telefono} onChange={handleChange} validation={soloNumeros} maxLength={15} />
              <InputField label="Correo" name="correo" value={form.correo} onChange={handleChange} type="email" validation={correoValido} maxLength={50} />

              <div className="relative w-full">
                <select
                  name="metodoPago"
                  value={form.metodoPago}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option>Efectivo</option>
                  <option>Transferencia Bancaria</option>
                  <option>QR</option>
                </select>
                <label className="absolute left-3 -top-2 text-gray-500 bg-white px-1 text-sm">Método de pago</label>
              </div>
            </div>
          </div>

          {/* Mensaje de error */}
          {error && (
            <div className="p-4 bg-red-100 text-red-700 font-semibold rounded-lg mx-6 -mt-2 mb-2">
              {error}
            </div>
          )}

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
