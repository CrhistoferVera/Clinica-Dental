import { Fragment, useState } from "react";
import { Transition } from "@headlessui/react";
import { usePage } from '@inertiajs/react';

export default function ResumenModal({ mostrar, onClose, servicio, doctor, fechaLabel, fechaValue, hora }) {
  const { auth } = usePage().props;
  const user = auth?.user;

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('confirmar'); // 'confirmar' | 'exito'
  const [citaCreada, setCitaCreada] = useState(null);
  const [error, setError] = useState("");

  const handleConfirmar = async () => {
    if (!hora || !fechaValue || !doctor) {
      setError('Faltan datos para crear la cita');
      return;
    }

    setLoading(true);
    setError("");

    try {
      const [horaInicio, horaFin] = hora.split(" - ");
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

      const response = await fetch('/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken,
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          doctor_id: doctor?.id,
          patient_name: user?.name || '',
          patient_lastname: user?.apellido || '',
          patient_dni: user?.ci || '',
          patient_phone: user?.telefono || '',
          patient_email: user?.email || '',
          payment_method: 'Por definir',
          date: fechaValue,
          time_start: horaInicio,
          time_end: horaFin,
        })
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 419) {
          throw new Error('La sesión ha expirado. Por favor recarga la página.');
        }
        if (response.status === 422 && data.errors) {
          const errores = Object.values(data.errors).flat();
          throw new Error(errores.join(', '));
        }
        throw new Error(data.message || 'Error al crear la cita');
      }

      setCitaCreada({
        ...data.appointment,
        doctorNombre: `Dr. ${doctor?.nombre} ${doctor?.apellido}`,
        especialidad: servicio,
        fechaLabel: fechaLabel,
        hora: hora
      });
      setStep('exito');

    } catch (err) {
      setError(err.message || 'Error al crear la cita. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleCerrar = () => {
    setStep('confirmar');
    setCitaCreada(null);
    setError("");
    onClose();
    if (step === 'exito') {
      window.location.reload();
    }
  };

  return (
    <Transition as={Fragment} show={mostrar}>
      {/* Fondo oscuro */}
      <Transition.Child
        as={Fragment}
        enter="transition-opacity duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed inset-0 bg-black/50 z-40" onClick={step === 'confirmar' ? handleCerrar : undefined} />
      </Transition.Child>

      {/* Modal centrado */}
      <Transition.Child
        as={Fragment}
        enter="transition-all duration-300"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="transition-all duration-200"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">

            {step === 'confirmar' ? (
              <>
                {/* Header */}
                <div className="bg-cyan-600 text-white p-6 text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold">Confirmar Cita</h2>
                  <p className="text-cyan-100 text-sm mt-1">Revisa los datos antes de confirmar</p>
                </div>

                {/* Contenido */}
                <div className="p-6">
                  {/* Datos de la cita */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="bg-cyan-100 text-cyan-600 rounded-full p-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Especialidad</p>
                        <p className="font-medium text-gray-800">{servicio}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="bg-cyan-100 text-cyan-600 rounded-full p-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Doctor</p>
                        <p className="font-medium text-gray-800">Dr. {doctor?.nombre} {doctor?.apellido}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="bg-cyan-100 text-cyan-600 rounded-full p-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Fecha y Hora</p>
                        <p className="font-medium text-gray-800 capitalize">{fechaLabel}</p>
                        <p className="text-cyan-600 font-semibold">{hora}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="bg-cyan-100 text-cyan-600 rounded-full p-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Paciente</p>
                        <p className="font-medium text-gray-800">{user?.name} {user?.apellido}</p>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Error */}
                  {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                      {error}
                    </div>
                  )}

                  {/* Botones */}
                  <div className="flex gap-3">
                    <button
                      onClick={handleCerrar}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleConfirmar}
                      disabled={loading}
                      className="flex-1 px-4 py-3 bg-cyan-600 text-white rounded-xl font-medium hover:bg-cyan-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Reservando...' : 'Confirmar Cita'}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Modal de Éxito */}
                <div className="p-6 text-center">
                  {/* Icono de éxito */}
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>

                  <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Cita Reservada!</h2>
                  <p className="text-gray-600 mb-6">Tu cita ha sido registrada exitosamente</p>

                  {/* Resumen de la cita */}
                  <div className="bg-gray-50 rounded-xl p-4 text-left mb-6">
                    <h3 className="font-semibold text-gray-800 mb-3 text-center">Detalles de tu cita</h3>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Especialidad:</span>
                        <span className="font-medium">{citaCreada?.especialidad}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Doctor:</span>
                        <span className="font-medium">{citaCreada?.doctorNombre}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Fecha:</span>
                        <span className="font-medium capitalize">{citaCreada?.fechaLabel}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Hora:</span>
                        <span className="font-medium text-cyan-600">{citaCreada?.hora}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Estado:</span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Pendiente de confirmar
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Alerta importante */}
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <div className="bg-amber-100 rounded-full p-1.5 mt-0.5">
                        <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-amber-800 text-sm">Importante</p>
                        <p className="text-amber-700 text-sm mt-1">
                          Debes confirmar tu cita <strong>24 horas antes</strong> desde la sección "Confirmar Citas" en tu portal.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Botón cerrar */}
                  <button
                    onClick={handleCerrar}
                    className="w-full px-4 py-3 bg-cyan-600 text-white rounded-xl font-medium hover:bg-cyan-700 transition-colors"
                  >
                    Entendido
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </Transition.Child>
    </Transition>
  );
}
