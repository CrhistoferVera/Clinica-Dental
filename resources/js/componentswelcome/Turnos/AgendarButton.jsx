export default function AgendarButton({ hora, visible, onClick }) {
  return (
    <div
      className={`
        fixed text-center bottom-4 z-50
        md:bottom-5 md:right-5 md:left-auto
        w-[90%] md:w-auto
        transition-all duration-300
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none"}
        ${hora ? "" : "hidden"}
        md:translate-x-0
        left-1/2 transform -translate-x-1/2 md:left-auto
      `}
    >
      {hora && (
        <button
          onClick={onClick}
          className="
            bg-cyan-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg
            transition-all duration-300 hover:bg-cyan-700 hover:shadow-xl
            flex items-center gap-2 mx-auto
          "
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Reservar Cita: {hora}
        </button>
      )}
    </div>
  );
}
