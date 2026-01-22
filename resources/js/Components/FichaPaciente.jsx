import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';

export default function FichaPaciente({ paciente, onEditar, onCerrar }) {
    if (!paciente) return null;

    const calcularEdad = (fechaNacimiento) => {
        if (!fechaNacimiento) return null;
        const hoy = new Date();
        const nacimiento = new Date(fechaNacimiento);
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const mes = hoy.getMonth() - nacimiento.getMonth();
        if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
            edad--;
        }
        return edad;
    };

    const edad = calcularEdad(paciente.fecha_nacimiento);

    return (
        <div className="p-6">
            {/* Encabezado */}
            <div className="border-b pb-4 mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                    {paciente.nombre} {paciente.apellido}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                    CI: {paciente.ci} {edad && `• ${edad} años`}
                </p>
            </div>

            {/* Datos de contacto */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                    <span className="text-sm font-medium text-gray-500">Teléfono</span>
                    <p className="text-gray-900">{paciente.telefono}</p>
                </div>
                <div>
                    <span className="text-sm font-medium text-gray-500">Email</span>
                    <p className="text-gray-900">{paciente.email || '-'}</p>
                </div>
                <div>
                    <span className="text-sm font-medium text-gray-500">Fecha de Nacimiento</span>
                    <p className="text-gray-900">
                        {paciente.fecha_nacimiento 
                            ? new Date(paciente.fecha_nacimiento).toLocaleDateString('es-BO')
                            : '-'}
                    </p>
                </div>
            </div>

            {/* Información médica */}
            <div className="space-y-4">
                {/* Alergias */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-red-800 mb-2">
                        ⚠️ Alergias
                    </h4>
                    <p className="text-red-700 text-sm">
                        {paciente.alergias || 'Ninguna registrada'}
                    </p>
                </div>

                {/* Antecedentes */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-blue-800 mb-2">
                        📋 Antecedentes Médicos
                    </h4>
                    <p className="text-blue-700 text-sm whitespace-pre-line">
                        {paciente.antecedentes || 'Ninguno registrado'}
                    </p>
                </div>

                {/* Observaciones */}
                {paciente.observaciones && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">
                            📝 Observaciones
                        </h4>
                        <p className="text-gray-600 text-sm whitespace-pre-line">
                            {paciente.observaciones}
                        </p>
                    </div>
                )}
            </div>

            {/* Botones */}
            <div className="mt-6 flex justify-end gap-3 border-t pt-4">
                <SecondaryButton onClick={onCerrar}>
                    Cerrar
                </SecondaryButton>
                <PrimaryButton onClick={() => onEditar(paciente)}>
                    Editar Paciente
                </PrimaryButton>
            </div>
        </div>
    );
}
