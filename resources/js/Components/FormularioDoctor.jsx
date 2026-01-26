import { useState, useEffect } from 'react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

const DIAS_SEMANA = [
    { value: 1, label: 'Lunes' },
    { value: 2, label: 'Martes' },
    { value: 3, label: 'Miércoles' },
    { value: 4, label: 'Jueves' },
    { value: 5, label: 'Viernes' },
    { value: 6, label: 'Sábado' },
    { value: 0, label: 'Domingo' },
];

export default function FormularioDoctor({ doctor = null, especialidades = [], onGuardado, onCancelar }) {
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [data, setData] = useState({
        nombre: '',
        apellido: '',
        ci: '',
        telefono: '',
        email: '',
        fecha_nacimiento: '',
        matricula_profesional: '',
        observaciones: '',
        activo: true,
        especialidades: [],
        horarios: [],
    });

    // Cargar datos si estamos editando
    useEffect(() => {
        if (doctor) {
            setData({
                nombre: doctor.nombre || '',
                apellido: doctor.apellido || '',
                ci: doctor.ci || '',
                telefono: doctor.telefono || '',
                email: doctor.email || '',
                fecha_nacimiento: doctor.fecha_nacimiento ? doctor.fecha_nacimiento.split('T')[0] : '',
                matricula_profesional: doctor.matricula_profesional || '',
                observaciones: doctor.observaciones || '',
                activo: doctor.activo ?? true,
                especialidades: doctor.especialidades?.map(e => e.id) || [],
                horarios: doctor.horarios?.map(h => ({
                    day_of_week: h.day_of_week,
                    start_time: h.start_time?.substring(0, 5) || '08:00',
                    end_time: h.end_time?.substring(0, 5) || '18:00',
                    duration_minutes: h.duration_minutes || 30,
                })) || [],
            });
        }
    }, [doctor]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleEspecialidadChange = (especialidadId) => {
        setData(prev => {
            const especialidades = prev.especialidades.includes(especialidadId)
                ? prev.especialidades.filter(id => id !== especialidadId)
                : [...prev.especialidades, especialidadId];
            return { ...prev, especialidades };
        });
        if (errors.especialidades) {
            setErrors(prev => ({ ...prev, especialidades: null }));
        }
    };

    const handleHorarioToggle = (dayOfWeek) => {
        setData(prev => {
            const exists = prev.horarios.find(h => h.day_of_week === dayOfWeek);
            if (exists) {
                return {
                    ...prev,
                    horarios: prev.horarios.filter(h => h.day_of_week !== dayOfWeek)
                };
            } else {
                return {
                    ...prev,
                    horarios: [...prev.horarios, {
                        day_of_week: dayOfWeek,
                        start_time: '08:00',
                        end_time: '18:00',
                        duration_minutes: 30,
                    }]
                };
            }
        });
        if (errors.horarios) {
            setErrors(prev => ({ ...prev, horarios: null }));
        }
    };

    const handleHorarioChange = (dayOfWeek, field, value) => {
        setData(prev => ({
            ...prev,
            horarios: prev.horarios.map(h =>
                h.day_of_week === dayOfWeek
                    ? { ...h, [field]: value }
                    : h
            )
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            const url = doctor ? `/doctors/${doctor.id}` : '/doctors';
            const method = doctor ? 'put' : 'post';

            const response = await window.axios[method](url, data);

            onGuardado(response.data);
        } catch (error) {
            console.error('Error:', error);
            if (error.response?.status === 422 && error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else if (error.response?.status === 419) {
                alert('La sesión ha expirado. Por favor recarga la página.');
                window.location.reload();
            } else {
                alert(error.response?.data?.message || 'Error al guardar');
            }
        } finally {
            setLoading(false);
        }
    };

    const getHorario = (dayOfWeek) => {
        return data.horarios.find(h => h.day_of_week === dayOfWeek);
    };

    return (
        <form onSubmit={handleSubmit} className="p-6">
            <h3 className="text-lg font-semibold mb-6">
                {doctor ? 'Editar Doctor' : 'Nuevo Doctor'}
            </h3>

            {/* Datos Personales */}
            <div className="mb-6">
                <h4 className="text-md font-medium text-gray-700 mb-3 pb-2 border-b">
                    Datos Personales
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <InputLabel htmlFor="nombre" value="Nombre *" />
                        <TextInput
                            id="nombre"
                            name="nombre"
                            value={data.nombre}
                            onChange={handleChange}
                            className="mt-1 block w-full"
                            required
                        />
                        <InputError message={errors.nombre?.[0]} className="mt-1" />
                    </div>

                    <div>
                        <InputLabel htmlFor="apellido" value="Apellido *" />
                        <TextInput
                            id="apellido"
                            name="apellido"
                            value={data.apellido}
                            onChange={handleChange}
                            className="mt-1 block w-full"
                            required
                        />
                        <InputError message={errors.apellido?.[0]} className="mt-1" />
                    </div>

                    <div>
                        <InputLabel htmlFor="ci" value="CI / Carnet *" />
                        <TextInput
                            id="ci"
                            name="ci"
                            value={data.ci}
                            onChange={handleChange}
                            className="mt-1 block w-full"
                            required
                        />
                        <InputError message={errors.ci?.[0]} className="mt-1" />
                    </div>

                    <div>
                        <InputLabel htmlFor="telefono" value="Teléfono *" />
                        <TextInput
                            id="telefono"
                            name="telefono"
                            value={data.telefono}
                            onChange={handleChange}
                            className="mt-1 block w-full"
                            required
                        />
                        <InputError message={errors.telefono?.[0]} className="mt-1" />
                    </div>

                    <div>
                        <InputLabel htmlFor="email" value="Email *" />
                        <TextInput
                            id="email"
                            name="email"
                            type="email"
                            value={data.email}
                            onChange={handleChange}
                            className="mt-1 block w-full"
                            required={!doctor}
                            disabled={!!doctor}
                        />
                        {!doctor && (
                            <p className="text-xs text-gray-500 mt-1">
                                Este email será usado para el acceso del doctor
                            </p>
                        )}
                        <InputError message={errors.email?.[0]} className="mt-1" />
                    </div>

                    <div>
                        <InputLabel htmlFor="fecha_nacimiento" value="Fecha de Nacimiento" />
                        <TextInput
                            id="fecha_nacimiento"
                            name="fecha_nacimiento"
                            type="date"
                            value={data.fecha_nacimiento}
                            onChange={handleChange}
                            className="mt-1 block w-full"
                        />
                        <InputError message={errors.fecha_nacimiento?.[0]} className="mt-1" />
                    </div>

                    <div>
                        <InputLabel htmlFor="matricula_profesional" value="Matrícula Profesional" />
                        <TextInput
                            id="matricula_profesional"
                            name="matricula_profesional"
                            value={data.matricula_profesional}
                            onChange={handleChange}
                            className="mt-1 block w-full"
                            placeholder="Ej: MP-12345"
                        />
                        <InputError message={errors.matricula_profesional?.[0]} className="mt-1" />
                    </div>

                    {doctor && (
                        <div className="flex items-center">
                            <input
                                id="activo"
                                name="activo"
                                type="checkbox"
                                checked={data.activo}
                                onChange={handleChange}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <label htmlFor="activo" className="ml-2 block text-sm text-gray-900">
                                Doctor Activo
                            </label>
                        </div>
                    )}
                </div>
            </div>

            {/* Especialidades */}
            <div className="mb-6">
                <h4 className="text-md font-medium text-gray-700 mb-3 pb-2 border-b">
                    Especialidades *
                </h4>
                <p className="text-xs text-gray-500 mb-3">
                    Seleccione al menos una especialidad
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {especialidades.map((especialidad) => (
                        <label
                            key={especialidad.id}
                            className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                                data.especialidades.includes(especialidad.id)
                                    ? 'border-indigo-500 bg-indigo-50'
                                    : 'border-gray-200 hover:bg-gray-50'
                            }`}
                        >
                            <input
                                type="checkbox"
                                checked={data.especialidades.includes(especialidad.id)}
                                onChange={() => handleEspecialidadChange(especialidad.id)}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <div className="ml-3">
                                <span className="block text-sm font-medium text-gray-900">
                                    {especialidad.nombre}
                                </span>
                            </div>
                        </label>
                    ))}
                </div>
                <InputError message={errors.especialidades?.[0]} className="mt-1" />
            </div>

            {/* Horarios de Atención */}
            <div className="mb-6">
                <h4 className="text-md font-medium text-gray-700 mb-3 pb-2 border-b">
                    Horarios de Atención *
                </h4>
                <p className="text-xs text-gray-500 mb-3">
                    Seleccione los días que atiende y configure el horario (duración de cita: 30 min por defecto)
                </p>

                <div className="space-y-3">
                    {DIAS_SEMANA.map((dia) => {
                        const horario = getHorario(dia.value);
                        const isActive = !!horario;

                        return (
                            <div
                                key={dia.value}
                                className={`p-3 border rounded-lg transition-colors ${
                                    isActive ? 'border-green-500 bg-green-50' : 'border-gray-200'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={isActive}
                                            onChange={() => handleHorarioToggle(dia.value)}
                                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                        />
                                        <span className={`ml-3 font-medium ${isActive ? 'text-green-800' : 'text-gray-700'}`}>
                                            {dia.label}
                                        </span>
                                    </label>

                                    {isActive && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <input
                                                type="time"
                                                value={horario.start_time}
                                                onChange={(e) => handleHorarioChange(dia.value, 'start_time', e.target.value)}
                                                className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-green-500 focus:border-green-500"
                                            />
                                            <span className="text-gray-500">a</span>
                                            <input
                                                type="time"
                                                value={horario.end_time}
                                                onChange={(e) => handleHorarioChange(dia.value, 'end_time', e.target.value)}
                                                className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-green-500 focus:border-green-500"
                                            />
                                            <select
                                                value={horario.duration_minutes}
                                                onChange={(e) => handleHorarioChange(dia.value, 'duration_minutes', parseInt(e.target.value))}
                                                className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-green-500 focus:border-green-500"
                                            >
                                                <option value={15}>15 min</option>
                                                <option value={30}>30 min</option>
                                                <option value={45}>45 min</option>
                                                <option value={60}>60 min</option>
                                            </select>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
                <InputError message={errors.horarios?.[0]} className="mt-1" />
            </div>

            {/* Observaciones */}
            <div className="mb-6">
                <InputLabel htmlFor="observaciones" value="Observaciones" />
                <textarea
                    id="observaciones"
                    name="observaciones"
                    value={data.observaciones}
                    onChange={handleChange}
                    rows={2}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Información adicional del doctor..."
                />
                <InputError message={errors.observaciones?.[0]} className="mt-1" />
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-3 pt-4 border-t">
                <SecondaryButton type="button" onClick={onCancelar}>
                    Cancelar
                </SecondaryButton>
                <PrimaryButton type="submit" disabled={loading}>
                    {loading ? 'Guardando...' : (doctor ? 'Actualizar' : 'Crear Doctor')}
                </PrimaryButton>
            </div>
        </form>
    );
}
