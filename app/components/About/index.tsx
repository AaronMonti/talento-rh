import Image from "next/image";
import * as motion from "motion/react-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
                        <p className="text-xl text-gray-600 leading-relaxed text-center">
                            En <span className="font-bold">Talento Positivo RH</span> somos una consultora especializada en atracción y selección de profesionales, con foco en <span className="font-semibold">perfiles industriales</span>.
                            Nos especializamos en identificar colaboradores que impulsen el crecimiento de las organizaciones, alineando talento con cultura y objetivos empresariales.
                        </p>
                    </motion.div>
                </div>
            </section>
            {/* Fundadora Section */}
            <section className="py-20 px-4 bg-gray-50">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                    <Image
                        src="/maria-flor.jpg"
                        alt="María Florencia Luna"
                        width={400}
                        height={400}
                        className="rounded-lg object-cover"
                    />
                    <div>
                        <p className="text-primary text-xl md:text-2xl font-semibold uppercase tracking-wide mb-2">
                            Fundadora
                        </p>
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">
                            María Florencia Luna
                        </h2>
                        <p className="text-gray-600 leading-relaxed">
                            Licenciada en Gestión de Capital Humano (Universidad de Belgrano), con más de 15 años de experiencia en empresas PYMES, nacionales y multinacionales. Fundadora de Talento Positivo RH, impulsa el crecimiento organizacional a través de la selección estratégica de talento humano.
                        </p>
                    </div>
                </div>
            </section>

            {/* Misión Section */}
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
                                Asegurar la conexión perfecta entre el talento adecuado y el puesto ideal. Lo hacemos con rapidez, cercanía y efectividad. Buscamos, evaluamos y vinculamos personas con alto potencial, alineadas con la cultura de cada organización.
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

                    <div className="grid md:grid-cols-3 gap-8 items-stretch">
                        {[
                            {
                                title: "Cercanía",
                                description:
                                    "Trabajamos junto a nuestros clientes, comprendiendo su cultura organizacional y necesidades reales.",
                                icon: (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M18.364 5.636a9 9 0 11-12.728 0M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                )
                            },
                            {
                                title: "Rapidez y Efectividad",
                                description:
                                    "Agilizamos los procesos de selección para conectar talento con empresas en el menor tiempo posible.",
                                icon: (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                )
                            },
                            {
                                title: "Talento que impulsa",
                                description:
                                    "Seleccionamos protagonistas del cambio que aportan valor en entornos industriales dinámicos.",
                                icon: (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M13 10V3L4 14h7v7l9-11h-7z"
                                    />
                                )
                            }
                        ].map((value, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.2 }}
                                className="h-full"
                            >
                                <Card className="h-full flex flex-col items-center text-center p-6 transition-transform hover:scale-105">
                                    <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                                        <svg
                                            className="w-8 h-8 text-primary"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            {value.icon}
                                        </svg>
                                    </div>
                                    <CardContent className="flex flex-col flex-grow">
                                        <h3 className="text-xl font-bold text-gray-800 mb-3">{value.title}</h3>
                                        <p className="text-gray-600">{value.description}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

        </>
    );
}
