import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";

export default function DiasCarousel({ dias, seleccion, setSeleccion }) {
    const separar = (dia) => {
        const partes = dia.split(" ");
        return { nombre: partes[0], numero: partes[1], mes: partes[2] };
    };

    return (
        <Swiper
            modules={[FreeMode]}
            freeMode={{
                enabled: true,          // Activar modo libre
                momentum: true,         // Que siga moviéndose después de soltar
                momentumBounce: true,   // Rebote al final
                momentumBounceRatio: 1, 
                momentumRatio: 1,
                momentumVelocityRatio: 1,
                sticky: false           // Snap a slides (opcional)
            }}
            spaceBetween={20}           // Espacio entre slides
            slidesPerView={"auto"}      // Que se ajuste automáticamente
            className="py-3"
        >
            {dias.map((dia, i) => {
                const { nombre, numero, mes } = separar(dia);
                const activo = dia === seleccion;

                return (
                    <SwiperSlide
                        key={i}
                        style={{ width: "80px" }} // ancho fijo como tu diseño actual
                    >
                        <button
                            onClick={() => setSeleccion(dia)}
                            className={`
                                flex flex-col items-center px-3 py-2 rounded-xl border shadow
                                transition-all duration-150
                                ${activo
                                    ? "bg-black text-white border-black"
                                    : "bg-white text-black hover:bg-gray-100 border-gray-300"
                                }
                            `}
                        >
                            <span className="text-xs capitalize">{nombre}</span>
                            <span className="text-xl font-bold">{numero}</span>
                            <span className="text-xs capitalize">{mes}</span>
                        </button>
                    </SwiperSlide>
                );
            })}
        </Swiper>
    );
}
