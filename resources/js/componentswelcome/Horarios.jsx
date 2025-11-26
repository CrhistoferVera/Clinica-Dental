// Horarios.jsx
export default function Horarios({ horarios }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 md:mt-5 mt-6 border-t-2 border-black md:pt-3">
      {horarios.map((hora, idx) => (
        <button
          key={idx}
          className="
            px-4 py-3 
            bg-gray-800 text-white 
            rounded-full 
            text-sm font-medium
            transition-all duration-200 
            hover:bg-white hover:text-black 
            hover:shadow-lg
            active:scale-95
            mt-3
          "
        >
          {hora}
        </button>
      ))}
    </div>
  );
}
