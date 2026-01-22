export default function Horarios({ horarios, onSeleccionarHora, seleccionHora }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 md:mt-5 mt-6 border-t-2 border-black md:pt-3">
      {horarios.map((slot, idx) => {
        const horario = slot.horario;
        const ocupado = slot.ocupado;

        return (
          <button
            key={idx}
            onClick={() => !ocupado && onSeleccionarHora(horario)}
            disabled={ocupado}
            className={`px-4 py-3 rounded-full text-sm font-medium transition-all duration-200 mt-3
              ${ocupado
                ? "bg-red-500 text-white cursor-not-allowed opacity-75"
                : seleccionHora === horario
                  ? "bg-gray-800 text-white hover:bg-gray-700 hover:shadow-lg active:scale-95"
                  : "bg-white text-black border border-black hover:shadow-lg active:scale-95"
              }`}
          >
            {horario}
            {ocupado && <span className="block text-xs">Ocupado</span>}
          </button>
        );
      })}
    </div>
  );
}
