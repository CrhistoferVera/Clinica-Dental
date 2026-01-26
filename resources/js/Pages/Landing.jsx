import { Head, Link, usePage } from '@inertiajs/react';

export default function Landing() {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="Clínica Dental - Bienvenido" />

            <div className="min-h-screen bg-white">
                {/* Header */}
                <header className="fixed w-full top-0 z-50 bg-white shadow-md">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-20">
                            <div className="flex items-center gap-3">
                                <div className="bg-cyan-600 rounded-full p-2">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                </div>
                                <span className="text-xl font-bold text-gray-800">Clínica Dental</span>
                            </div>

                            <nav className="hidden md:flex items-center gap-6">
                                <a href="#servicios" className="text-gray-600 hover:text-cyan-600 transition-colors">Servicios</a>
                                <a href="#nosotros" className="text-gray-600 hover:text-cyan-600 transition-colors">Nosotros</a>
                                <a href="#contacto" className="text-gray-600 hover:text-cyan-600 transition-colors">Contacto</a>
                            </nav>

                            <div className="flex items-center gap-3">
                                {auth?.user ? (
                                    <>
                                        <Link
                                            href="/portal-paciente"
                                            className="px-4 py-2 text-cyan-600 font-medium hover:bg-cyan-50 rounded-lg transition-colors"
                                        >
                                            Mis Citas
                                        </Link>
                                        <Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                                        >
                                            Salir
                                        </Link>
                                    </>
                                ) : (
                                    <Link
                                        href={route('login')}
                                        className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
                                    >
                                        Iniciar Sesión
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="pt-24 bg-gradient-to-br from-cyan-50 via-white to-cyan-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-32">
                        <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-center">
                            <div>
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                                    Tu sonrisa, <span className="text-cyan-600">nuestra pasión</span>
                                </h1>
                                <p className="mt-6 md:mt-8 text-lg md:text-xl text-gray-600 leading-relaxed">
                                    Brindamos atención dental de calidad con tecnología de vanguardia y un equipo de profesionales comprometidos con tu bienestar.
                                </p>
                                <div className="mt-8 md:mt-10 flex flex-col sm:flex-row gap-4">
                                    {auth?.user ? (
                                        <Link
                                            href="/portal-paciente"
                                            className="inline-flex items-center justify-center px-20 py-20 bg-cyan-600 text-white font-semibold rounded-xl hover:bg-cyan-700 transition-all transform hover:scale-105 shadow-lg shadow-cyan-200"
                                        >
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            Agendar Cita
                                        </Link>
                                    ) : (
                                        <Link
                                            href={route('login')}
                                            className="inline-flex items-center justify-center px-8 py-4 bg-cyan-600 text-white font-semibold rounded-xl hover:bg-cyan-700 transition-all transform hover:scale-105 shadow-lg shadow-cyan-200"
                                        >
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                            </svg>
                                            Iniciar Sesión
                                        </Link>
                                    )}
                                    <a
                                        href="#contacto"
                                        className="inline-flex items-center justify-center px-8 py-4 border-2 border-cyan-600 text-cyan-600 font-semibold rounded-xl hover:bg-cyan-50 transition-all"
                                    >
                                        Contáctanos
                                    </a>
                                </div>
                            </div>
                            <div className="relative">
                                <div className="bg-cyan-600 rounded-3xl p-8 transform rotate-3 shadow-2xl">
                                    <img
                                        src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=600&h=400&fit=crop"
                                        alt="Clínica Dental"
                                        className="rounded-2xl transform -rotate-3"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Servicios */}
                <section id="servicios" className="py-20 md:py-28 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12 md:mb-20">
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">Nuestros Servicios</h2>
                            <p className="mt-4 md:mt-6 text-gray-600 text-lg max-w-2xl mx-auto">
                                Ofrecemos una amplia gama de tratamientos dentales para toda la familia
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[
                                {
                                    icon: (
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                    ),
                                    title: 'Limpieza Dental',
                                    description: 'Limpieza profesional para mantener tus dientes sanos y brillantes'
                                },
                                {
                                    icon: (
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                    ),
                                    title: 'Ortodoncia',
                                    description: 'Tratamientos de brackets y alineadores para una sonrisa perfecta'
                                },
                                {
                                    icon: (
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                        </svg>
                                    ),
                                    title: 'Blanqueamiento',
                                    description: 'Blanqueamiento dental profesional para una sonrisa radiante'
                                },
                                {
                                    icon: (
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                        </svg>
                                    ),
                                    title: 'Implantes',
                                    description: 'Implantes dentales de alta calidad para recuperar tu sonrisa'
                                },
                                {
                                    icon: (
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                    ),
                                    title: 'Endodoncia',
                                    description: 'Tratamientos de conducto para salvar dientes dañados'
                                },
                                {
                                    icon: (
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    ),
                                    title: 'Odontopediatría',
                                    description: 'Atención dental especializada para los más pequeños'
                                }
                            ].map((service, index) => (
                                <div key={index} className="bg-gray-50 rounded-2xl p-8 hover:shadow-xl transition-all hover:-translate-y-1">
                                    <div className="bg-cyan-100 text-cyan-600 rounded-xl p-3 w-fit">
                                        {service.icon}
                                    </div>
                                    <h3 className="mt-4 text-xl font-semibold text-gray-900">{service.title}</h3>
                                    <p className="mt-2 text-gray-600">{service.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Nosotros */}
                <section id="nosotros" className="py-40 md:py-28 bg-cyan-600 ">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
                            <div>
                                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">¿Por qué elegirnos?</h2>
                                <p className="mt-4 md:mt-6 text-cyan-100 text-lg md:text-xl ">
                                    Contamos con años de experiencia y un equipo de profesionales dedicados a tu salud dental.
                                </p>
                                <div className="mt-8 md:mt-10 space-y-4 md:space-y-5">
                                    {[
                                        'Profesionales certificados',
                                        'Tecnología de última generación',
                                        'Atención personalizada',
                                        'Horarios flexibles',
                                        'Precios accesibles'
                                    ].map((item, index) => (
                                        <div key={index} className="flex items-center gap-3">
                                            <svg className="w-6 h-6 text-cyan-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span className="text-white">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 md:gap-6">
                                <div className="bg-white/10 backdrop-blur rounded-2xl p-6 md:p-8 text-center">
                                    <div className="text-4xl md:text-5xl font-bold text-white">10+</div>
                                    <div className="text-cyan-100 mt-2 text-sm md:text-base">Años de experiencia</div>
                                </div>
                                <div className="bg-white/10 backdrop-blur rounded-2xl p-6 md:p-8 text-center">
                                    <div className="text-4xl md:text-5xl font-bold text-white">5000+</div>
                                    <div className="text-cyan-100 mt-2 text-sm md:text-base">Pacientes atendidos</div>
                                </div>
                                <div className="bg-white/10 backdrop-blur rounded-2xl p-6 md:p-8 text-center">
                                    <div className="text-4xl md:text-5xl font-bold text-white">15+</div>
                                    <div className="text-cyan-100 mt-2 text-sm md:text-base">Especialistas</div>
                                </div>
                                <div className="bg-white/10 backdrop-blur rounded-2xl p-6 md:p-8 text-center">
                                    <div className="text-4xl md:text-5xl font-bold text-white">98%</div>
                                    <div className="text-cyan-100 mt-2 text-sm md:text-base">Satisfacción</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Contacto */}
                <section id="contacto" className="py-20 md:py-28 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12 md:mb-20">
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">Contáctanos</h2>
                            <p className="mt-4 md:mt-6 text-gray-600 text-lg">Estamos aquí para ayudarte</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-lg transition-shadow">
                                <div className="bg-cyan-100 text-cyan-600 rounded-full p-4 w-fit mx-auto">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <h3 className="mt-4 text-lg font-semibold text-gray-900">Ubicación</h3>
                                <p className="mt-2 text-gray-600">Av. Principal #123<br />Ciudad, País</p>
                            </div>

                            <div className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-lg transition-shadow">
                                <div className="bg-cyan-100 text-cyan-600 rounded-full p-4 w-fit mx-auto">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </div>
                                <h3 className="mt-4 text-lg font-semibold text-gray-900">Teléfono</h3>
                                <p className="mt-2 text-gray-600">+591 123 456 789<br />+591 987 654 321</p>
                            </div>

                            <div className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-lg transition-shadow">
                                <div className="bg-cyan-100 text-cyan-600 rounded-full p-4 w-fit mx-auto">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="mt-4 text-lg font-semibold text-gray-900">Horarios</h3>
                                <p className="mt-2 text-gray-600">Lun - Vie: 8:00 - 18:00<br />Sáb: 8:00 - 12:00</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Final */}
                <section className="py-16 md:py-24 bg-gradient-to-r from-cyan-600 to-cyan-700">
                    <div className="max-w-4xl mx-auto px-4 text-center">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">¿Listo para tu cita?</h2>
                        <p className="mt-4 md:mt-6 text-cyan-500 text-lg md:text-xl">Agenda tu cita hoy y comienza a cuidar tu sonrisa</p>
                        <div className="mt-8 md:mt-10">
                            {auth?.user ? (
                                <Link
                                    href="/portal-paciente"
                                    className="inline-flex items-center px-8 py-4 bg-white text-cyan-600 font-semibold rounded-xl hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
                                >
                                    Ir a Mis Citas
                                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </Link>
                            ) : (
                                <Link
                                    href={route('login')}
                                    className="inline-flex items-center px-8 py-4 bg-white text-cyan-600 font-semibold rounded-xl hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
                                >
                                    Iniciar Sesión
                                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                    </svg>
                                </Link>
                            )}
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-gray-900 text-white py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid md:grid-cols-4 gap-8">
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="bg-cyan-600 rounded-full p-2">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                    </div>
                                    <span className="text-lg font-bold">Clínica Dental</span>
                                </div>
                                <p className="text-gray-400 text-sm">
                                    Tu sonrisa es nuestra pasión. Brindamos atención dental de calidad.
                                </p>
                            </div>

                            <div>
                                <h4 className="font-semibold mb-4">Enlaces</h4>
                                <ul className="space-y-2 text-gray-400 text-sm">
                                    <li><a href="#servicios" className="hover:text-white transition-colors">Servicios</a></li>
                                    <li><a href="#nosotros" className="hover:text-white transition-colors">Nosotros</a></li>
                                    <li><a href="#contacto" className="hover:text-white transition-colors">Contacto</a></li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-semibold mb-4">Servicios</h4>
                                <ul className="space-y-2 text-gray-400 text-sm">
                                    <li>Limpieza Dental</li>
                                    <li>Ortodoncia</li>
                                    <li>Blanqueamiento</li>
                                    <li>Implantes</li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-semibold mb-4">Contacto</h4>
                                <ul className="space-y-2 text-gray-400 text-sm">
                                    <li>+591 123 456 789</li>
                                    <li>info@clinicadental.com</li>
                                    <li>Av. Principal #123</li>
                                </ul>
                            </div>
                        </div>

                        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
                            <p>&copy; {new Date().getFullYear()} Clínica Dental. Todos los derechos reservados.</p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
