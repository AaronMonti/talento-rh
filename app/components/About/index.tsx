import Image from "next/image"
// React Server Components
import * as motion from "motion/react-client"

export default function About() {
    return (
        <>
            {/* Intro Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false }}
                        transition={{ duration: 0.6 }}
                        className="text-center max-w-3xl mx-auto mb-16"
                    >
                        <h2 className="text-4xl font-bold text-gray-800 mb-6">Sobre Nosotros</h2>
                        <div className="w-24 h-1 bg-primary mx-auto mb-8"></div>
                        <p className="text-xl text-gray-600 leading-relaxed">
                            En Talento RH, nos dedicamos a transformar la manera en que las empresas
                            encuentran su talento ideal y los profesionales alcanzan su máximo potencial.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                ),
                                title: "Experiencia Comprobada",
                                description: "Más de una década transformando la gestión del talento humano en América Latina"
                            },
                            {
                                icon: (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                ),
                                title: "Red de Talento Global",
                                description: "Conectamos empresas con los mejores profesionales a nivel internacional"
                            },
                            {
                                icon: (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                ),
                                title: "Innovación Constante",
                                description: "Utilizamos tecnología de vanguardia para optimizar los procesos de selección"
                            }
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: false }}
                                transition={{ duration: 0.6, delay: index * 0.2 }}
                                className="bg-gray-50 rounded-lg p-8 transition-transform hover:scale-105"
                            >
                                <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                                    <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        {feature.icon}
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">{feature.title}</h3>
                                <p className="text-gray-600 text-center">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: false }}
                            transition={{ duration: 0.8 }}
                            className="space-y-6"
                        >
                            <h2 className="text-3xl font-bold text-gray-800">Nuestra Misión</h2>
                            <p className="text-gray-600 leading-relaxed">
                                Nos dedicamos a conectar el talento excepcional con oportunidades extraordinarias.
                                A través de nuestra experiencia y tecnología innovadora, facilitamos el crecimiento
                                tanto de profesionales como de empresas.
                            </p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: false }}
                            transition={{ duration: 0.8 }}
                            className="relative h-[400px] rounded-lg overflow-hidden shadow-xl"
                        >
                            <Image
                                src="/pexels-fauxels-3183186.jpg"
                                alt="Equipo trabajando"
                                fill
                                className="object-cover"
                            />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-3xl font-bold text-center text-gray-800 mb-6"
                    >
                        Nuestros Valores
                    </motion.h2>
                    {/* <div className="w-24 h-1 bg-primary mx-auto mb-12"></div> */}
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Innovación",
                                description: "Buscamos constantemente nuevas formas de mejorar y evolucionar"
                            },
                            {
                                title: "Integridad",
                                description: "Actuamos con honestidad y transparencia en todo momento"
                            },
                            {
                                title: "Excelencia",
                                description: "Nos esforzamos por superar las expectativas en cada proyecto"
                            }
                        ].map((value, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.2 }}
                                className="bg-white p-6 rounded-lg shadow-sm"
                            >
                                <h3 className="text-xl font-bold text-gray-800 mb-3">{value.title}</h3>
                                <p className="text-gray-600">{value.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
} 