export default function DescripcionMobile({ expanded, setExpanded }) {
    return (
        <div className="md:hidden text-sm text-gray-700 border-b-[3.6px] pb-3 ">

            {expanded ? (
                <>
                    <p className="mt-4 mb-3">
                        ¿Buscás una consulta que te cuide? Acá lo hacemos posible. Desde controles preventivos
                        hasta tratamientos más complejos, limpieza dental, diseño de sonrisa y tratamientos dentales
                        que cuidan tu salud y te hacen sonreír.
                    </p>

                    <p className="mb-3">
                        Usamos equipos modernos y técnicas actualizadas para que salgas con una sonrisa impecable.
                        Vos traés la confianza, nosotros el cuidado.
                    </p>

                    {/* Último párrafo + VER MENOS pegado */}
                    <p className="mb-1">
                        Reservá tu cita y viví una experiencia personalizada, relajada y con resultados
                        que hablan por sí solos.
                        <span
                            className="text-blue-600 ml-1 cursor-pointer hover:underline"
                            onClick={() => setExpanded(false)}
                        >
                            Ver menos
                        </span>
                    </p>
                </>
            ) : (
                <p className="mt-4 mb-1">
                    ¿Buscás una consulta que te cuide? Acá lo hacemos posible. Desde controles preventivos
                    hasta tratamientos más complejos...
                    <span
                        className="text-blue-600 ml-1 cursor-pointer hover:underline"
                        onClick={() => setExpanded(true)}
                    >
                        Ver más
                    </span>
                </p>
            )}
        </div>
    );
}
