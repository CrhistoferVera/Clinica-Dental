export default function AgendarButton({ hora, visible, onClick }) {
  return (
    <div
      className={`
        fixed 
        md:bottom-5 md:right-10 bottom-4 left-[65%] md:left-[80%] transform -translate-x-1/2
        md:w-auto w-[90%]
        z-50
        transition-all duration-300
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none"}
      `}
    >
      {hora && (
        <button
          onClick={onClick}
          className="
            bg-black text-white font-semibold py-3 px-6 rounded-full shadow-lg
            transition-all duration-300 hover:bg-gray-800
          "
        >
          Agendar hora: {hora}
        </button>
      )}
    </div>
  );
}
