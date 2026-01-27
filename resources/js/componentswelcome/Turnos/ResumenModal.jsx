import { Fragment, useState } from "react";
import { Transition } from "@headlessui/react";
import { ArrowLeft } from "lucide-react";
import { usePage } from '@inertiajs/react';
import InputField from "./InputField";

export default function ResumenModal({ mostrar, onClose, servicio, doctor, fechaLabel, fechaValue, hora }) {
  const { props } = usePage();
  const csrfTokenFromProps = props.csrf_token;

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    telefono: "",
    correo: "",
    metodoPago: "Efectivo",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

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

  const handleFinalizar = async () => {
    const mensajeError = validarFormulario();
    if (mensajeError) {
      setError(mensajeError);
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Usar directamente fechaValue que ya viene en formato YYYY-MM-DD
      const fechaFormateada = fechaValue;

      // Extraer hora de inicio y fin del formato "HH:MM - HH:MM"
      const [horaInicio, horaFin] = hora.split(" - ");

      // Obtener token CSRF de Inertia props o del meta tag
      const csrfToken = csrfTokenFromProps || document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

      if (!csrfToken) {
        throw new Error('Token CSRF no encontrado. Por favor recarga la página.');
      }

      console.log('Datos a enviar:', {
        fecha: fechaFormateada,
        horaInicio,
        horaFin,
        csrfToken: csrfToken.substring(0, 10) + '...'
      }); // Debug

      const response = await fetch('/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken,
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          doctor_id: doctor?.id,
          patient_name: form.nombre,
          patient_lastname: form.apellido,
          patient_dni: form.dni,
          patient_phone: form.telefono,
          patient_email: form.correo,
          payment_method: form.metodoPago,
          date: fechaFormateada,
          time_start: horaInicio,
          time_end: horaFin,
        })
      });

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        if (response.status === 419) {
          throw new Error('La sesión ha expirado. Por favor recarga la página.');
        }
        throw new Error('Error al procesar la respuesta del servidor.');
      }

      if (!response.ok) {
        // Manejar errores de validación (422)
        if (response.status === 422 && data.errors) {
          const errores = Object.values(data.errors).flat();
          throw new Error(errores.join(', '));
        }
        throw new Error(data.message || 'Error al crear la cita');
      }

      setSuccess(true);
      setTimeout(() => {
        setForm({
          nombre: "",
          apellido: "",
          dni: "",
          telefono: "",
          correo: "",
          metodoPago: "Efectivo",
        });
        setSuccess(false);
        onClose();
        // Opcional: Recargar horarios disponibles
        window.location.reload();
      }, 2000);

    } catch (err) {
      setError(err.message || 'Error al crear la cita. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
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
            <div className="bg-gray-100 p-4 rounded-lg space-y-1">
              <p><strong>Especialidad:</strong> {servicio}</p>
              {doctor && (
                <p><strong>Doctor:</strong> Dr. {doctor.nombre} {doctor.apellido}</p>
              )}
              <p><strong>Fecha:</strong> {fechaLabel}</p>
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

          {/* Mensaje de éxito */}
          {success && (
            <div className="p-4 bg-green-100 text-green-700 font-semibold rounded-lg mx-6 -mt-2 mb-2">
              ¡Cita agendada exitosamente!
            </div>
          )}

          {/* Botón finalizar */}
          <div className="p-6 border-t">
            <button
              onClick={handleFinalizar}
              disabled={loading || success}
              className="w-full bg-black text-white py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Guardando...' : success ? '¡Listo!' : 'Finalizar'}
            </button>
          </div>
        </div>
      </Transition.Child>
    </Transition>
  );
}
