export default function DescripcionMobile({ expanded, setExpanded }) {
    return (
        <div className="md:hidden text-sm text-gray-700 border-b-[3.6px] pb-3 ">

            {expanded ? (
                <>
                    <p className="mt-4 mb-3">
                        ¿Buscás un corte que te represente? Acá lo hacemos posible. Desde estilos clásicos 
                        hasta los más modernos, afeitados prolijos, diseño de barba y tratamientos capilares 
                        que cuidan tu imagen y te hacen destacar.
                    </p>

                    <p className="mb-3">
                        Usamos productos premium y técnicas actualizadas para que salgas con un look impecable. 
                        Vos traés la actitud, nosotros el estilo.
                    </p>

                    {/* Último párrafo + VER MENOS pegado */}
                    <p className="mb-1">
                        Reservá tu turno y viví una experiencia personalizada, relajada y con resultados 
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
                    ¿Buscás un corte que te represente? Acá lo hacemos posible. Desde estilos clásicos 
                    hasta los más modernos...
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
