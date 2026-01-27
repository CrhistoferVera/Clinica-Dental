export default function Horarios({ horarios, onSeleccionarHora, seleccionHora }) {
  if (horarios.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 border-t border-gray-200 mt-4">
        <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p>No hay horarios disponibles para este día</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-gray-200">
      {horarios.map((slot, idx) => {
        const horario = slot.horario;
        const ocupado = slot.ocupado;
        const seleccionado = seleccionHora === horario;

        return (
          <button
            key={idx}
            onClick={() => !ocupado && onSeleccionarHora(horario)}
            disabled={ocupado}
            className={`relative p-3 rounded-xl text-sm font-medium transition-all duration-200 border-2
              ${ocupado
                ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                : seleccionado
                  ? "bg-cyan-600 text-white border-cyan-600 shadow-lg scale-105"
                  : "bg-white text-gray-700 border-gray-200 hover:border-cyan-500 hover:bg-cyan-50"
              }`}
          >
            <div className="flex items-center justify-center gap-2">
              {seleccionado && (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
              <span>{horario}</span>
            </div>
            {ocupado && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                Ocupado
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
