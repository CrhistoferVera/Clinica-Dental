export default function InputField({
  label,
  name,
  value,
  onChange,
  type = "text",
  validation,
  maxLength = 50,
}) {
  const handleInputChange = (e) => {
    let val = e.target.value;

    // Limitar cantidad de caracteres
    if (val.length > maxLength) val = val.slice(0, maxLength);

    // Aplicar validación
    if (validation) val = validation(val);

    onChange({ target: { name, value: val } });
  };

  return (
    <div className="relative w-full">
      <input
        type={type}
        name={name}
        value={value}
        onChange={handleInputChange}
        className="border border-gray-300 rounded-lg px-3 pt-5 pb-2 w-full focus:outline-none focus:ring-2 focus:ring-black mb-2"
      />
      <label
        htmlFor={name}
        className="absolute left-3 -top-2 text-gray-500 text-sm bg-white px-1 pointer-events-none"
      >
        {label}
      </label>
    </div>
  );
}
