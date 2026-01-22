import { useState, useEffect } from 'react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function FormularioPaciente({ paciente = null, onGuardado, onCancelar }) {
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [data, setData] = useState({
        nombre: '',
        apellido: '',
        ci: '',
        telefono: '',
        email: '',
        fecha_nacimiento: '',
        alergias: '',
        antecedentes: '',
        observaciones: '',
    });

    // Cargar datos si estamos editando
    useEffect(() => {
        if (paciente) {
            setData({
                nombre: paciente.nombre || '',
                apellido: paciente.apellido || '',
                ci: paciente.ci || '',
                telefono: paciente.telefono || '',
                email: paciente.email || '',
                fecha_nacimiento: paciente.fecha_nacimiento ? paciente.fecha_nacimiento.split('T')[0] : '',
                alergias: paciente.alergias || '',
                antecedentes: paciente.antecedentes || '',
                observaciones: paciente.observaciones || '',
            });
        }
    }, [paciente]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(prev => ({ ...prev, [name]: value }));
        // Limpiar error del campo al escribir
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            const url = paciente ? `/patients/${paciente.id}` : '/patients';
            const method = paciente ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || '',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                if (response.status === 422 && result.errors) {
                    setErrors(result.errors);
                } else {
                    alert(result.message || 'Error al guardar');
                }
                return;
            }

            onGuardado(result.patient);
        } catch (error) {
            console.error('Error:', error);
            alert('Error de conexión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-6">
            <h3 className="text-lg font-semibold mb-6">
                {paciente ? 'Editar Paciente' : 'Nuevo Paciente'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nombre */}
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

                {/* Apellido */}
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

                {/* CI */}
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

                {/* Teléfono */}
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

                {/* Email */}
                <div>
                    <InputLabel htmlFor="email" value="Email" />
                    <TextInput
                        id="email"
                        name="email"
                        type="email"
                        value={data.email}
                        onChange={handleChange}
                        className="mt-1 block w-full"
                    />
                    <InputError message={errors.email?.[0]} className="mt-1" />
                </div>

                {/* Fecha Nacimiento */}
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
            </div>

            {/* Alergias */}
            <div className="mt-4">
                <InputLabel htmlFor="alergias" value="Alergias" />
                <textarea
                    id="alergias"
                    name="alergias"
                    value={data.alergias}
                    onChange={handleChange}
                    rows={2}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Ej: Penicilina, látex..."
                />
                <InputError message={errors.alergias?.[0]} className="mt-1" />
            </div>

            {/* Antecedentes */}
            <div className="mt-4">
                <InputLabel htmlFor="antecedentes" value="Antecedentes Médicos" />
                <textarea
                    id="antecedentes"
                    name="antecedentes"
                    value={data.antecedentes}
                    onChange={handleChange}
                    rows={2}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Enfermedades previas, cirugías, etc."
                />
                <InputError message={errors.antecedentes?.[0]} className="mt-1" />
            </div>

            {/* Observaciones */}
            <div className="mt-4">
                <InputLabel htmlFor="observaciones" value="Observaciones" />
                <textarea
                    id="observaciones"
                    name="observaciones"
                    value={data.observaciones}
                    onChange={handleChange}
                    rows={2}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <InputError message={errors.observaciones?.[0]} className="mt-1" />
            </div>

            {/* Botones */}
            <div className="mt-6 flex justify-end gap-3">
                <SecondaryButton type="button" onClick={onCancelar}>
                    Cancelar
                </SecondaryButton>
                <PrimaryButton type="submit" disabled={loading}>
                    {loading ? 'Guardando...' : (paciente ? 'Actualizar' : 'Crear Paciente')}
                </PrimaryButton>
            </div>
        </form>
    );
}
