import Image from "next/image";
import * as motion from "motion/react-client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function About() {
    return (
        <>

            {/* Intro Section */}
            <section id="nosotros" className="py-20">
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
            <section className="text-center md:text-left py-20 px-4 bg-gray-50">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                    <div className="mx-auto w-72 md:w-96 aspect-square overflow-hidden rounded-full">
                        <Image
                            src="/maria-flor.jpg"
                            alt="María Florencia Luna"
                            width={200}
                            height={200}
                            className="object-cover object-top w-full h-full"
                        />
                    </div>

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
            <section className="text-center md:text-left py-16 px-4">
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

            {/* CTA Section - Bolsa de Empleo */}
            <section className="py-20 bg-gradient-to-r from-primary/10 to-primary/5">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false }}
                        transition={{ duration: 0.6 }}
                        className="space-y-8"
                    >
                        <div className="space-y-4">
                            <h3 className="text-3xl md:text-4xl font-bold text-gray-800">
                                ¿Buscás nuevas oportunidades laborales?
                            </h3>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                Explorá nuestra bolsa de empleo y encontrá el trabajo que mejor se adapte a tu perfil profesional.
                                Tenemos oportunidades en el sector industrial con empresas líderes.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link href="/empleos">
                                <Button size="lg" className="px-8 py-4 text-lg font-semibold">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 00-2 2H8a2 2 0 00-2-2V6m8 0h2a2 2 0 012 2v6.5" />
                                    </svg>
                                    Ver Empleos Disponibles
                                </Button>
                            </Link>

                            <Link href="/cargar-cv">
                                <Button variant="outline" size="lg" className="px-8 py-4 text-lg font-semibold border-2">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                    Subir mi CV
                                </Button>
                            </Link>
                        </div>

                        <p className="text-sm text-gray-500">
                            Únete a nuestra base de datos y te contactaremos cuando tengamos una oportunidad que coincida con tu perfil
                        </p>
                    </motion.div>
                </div>
            </section>

        </>
    );
}
