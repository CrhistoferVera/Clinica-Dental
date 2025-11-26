export default function Horarios({ horarios, onSeleccionarHora, seleccionHora }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 md:mt-5 mt-6 border-t-2 border-black md:pt-3">
      {horarios.map((hora, idx) => (
        <button
          key={idx}
          onClick={() => onSeleccionarHora(hora)}
          className={`
            px-4 py-3 
            rounded-full 
            text-sm font-medium
            transition-all duration-200 
            hover:shadow-lg
            active:scale-95
            mt-3
            ${seleccionHora === hora ? "bg-gray-800 text-white hover:bg-gray-700" : "bg-white text-black border border-black"}
          `}
        >
          {hora}
        </button>
      ))}
    </div>
  );
}
