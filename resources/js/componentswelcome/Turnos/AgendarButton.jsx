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
