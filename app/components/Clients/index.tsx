// React Server Components
import * as motion from "motion/react-client"
import Image from "next/image"
import styles from './styles.module.css'

export default function Clients() {
    const clients = [
        { name: "SCANIA", logo: "/clients_logo/SCANIA.png" },
        { name: "GRUPO PELCO", logo: "/clients_logo/GRUPO_PELCO.png" },
        { name: "SHC LOGISTICA", logo: "/clients_logo/SHC_LOGISTICA.png" },
        { name: "GRIFERIA PEIRANO", logo: "/clients_logo/GRIFERIA_PEIRANO.png" },
        { name: "ROTOPLAS", logo: "/clients_logo/ROTOPLAS.png" },
        { name: "HYDAC", logo: "/clients_logo/HYDAC.png" },
        { name: "CRETA", logo: "/clients_logo/CRETA.webp" },
        { name: "GRANDWICH", logo: "/clients_logo/GRANDWICH.png" },
        { name: "PRENTEX", logo: "/clients_logo/PRENTEX.png" },
        { name: "VALBOL", logo: "/clients_logo/VALBOL.png" },
        { name: "MASUMA", logo: "/clients_logo/MASUMA.png" },
        { name: "SOHO", logo: "/clients_logo/SOHO.png" },
        { name: "OSLE", logo: "/clients_logo/OSLE.png" },
        /* { name: "FARMALINE", logo: "/clients_logo/FARMALINE.png" }, */
        { name: "AM CONSULTING", logo: "/clients_logo/AM_CONSULTING.png" },
        { name: "DENTAL SI", logo: "/clients_logo/DENTAL_SI.png" },
        { name: "TMF GROUP", logo: "/clients_logo/TMF_GROUP.png" },
        { name: "LASER SOLUTION", logo: "/clients_logo/LASER_SOLUTION.png" },
        { name: "AY QUE AMOR", logo: "/clients_logo/AY_QUE_AMOR.png" },
        { name: "GRANOTEC", logo: "/clients_logo/GRANOTEC.png" },
        { name: "ZENH REHAU", logo: "/clients_logo/REHAU.svg" },
        { name: "GLAMIT", logo: "/clients_logo/GLAMIT.png" },
        { name: "DANES", logo: "/clients_logo/DANES.png" },
        { name: "HOTEL FALCON", logo: "/clients_logo/HOTEL_FALCON.png" },
        { name: "SELENE MEDIA", logo: "/clients_logo/SELENE_MEDIA.png" },
        { name: "SERTEC", logo: "/clients_logo/SERTEC.png" },
        { name: "SERVITEX", logo: "/clients_logo/SERVITEX.png" },
        { name: "STEELDEC", logo: "/clients_logo/STEELDEC.webp" },
        { name: "ELECTRICIDAD CENTER", logo: "/clients_logo/ELECTRICIDAD_CENTER.png" },
        { name: "ROYAL CHEF", logo: "/clients_logo/ROYAL_CHEF.png" },
        { name: "TRYMO", logo: "/clients_logo/TRYMO_SRL.png" },
        { name: "B&B", logo: "/clients_logo/B&B.png" },
        { name: "FOSCHIA", logo: "/clients_logo/FOSCHIA.png" },
        { name: "KEY BISCAYNE", logo: "/clients_logo/KEY_BISCAYNE.png" },
        { name: "RAPIBOY", logo: "/clients_logo/RAPIBOY.png" },
        { name: "LERIN", logo: "/clients_logo/LERIN.png" },
        { name: "NAIF", logo: "/clients_logo/NAIF.png" },
        { name: "JVA SWISS PERSONAL CARE", logo: "/clients_logo/JVA_SWISS.png" }
    ]

    // Dividir los clientes en dos grupos para las filas
    const firstRow = clients.slice(0, Math.ceil(clients.length / 2))
    const secondRow = clients.slice(Math.ceil(clients.length / 2))

    return (
        <section id="clientes" className="py-20 overflow-hidden">
            <div className="mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false }}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-3xl mx-auto mb-16"
                >
                    <h2 className="text-4xl font-bold text-gray-800 mb-6">Nuestros Clientes</h2>
                    <div className="w-24 h-1 bg-primary mx-auto mb-8"></div>
                    <p className="text-xl text-gray-600">
                        Empresas líderes que confían en nosotros para encontrar el mejor talento
                    </p>
                </motion.div>

                <div className={styles.logosContainer}>
                    {/* Primera fila de logos */}
                    <div className={styles.logoRow}>
                        <div className={styles.marquee}>
                            {[...firstRow, ...firstRow].map((client, index) => (
                                <div key={index} className={styles.logoWrapper}>
                                    <Image
                                        src={client.logo}
                                        alt={client.name}
                                        width={150}
                                        height={75}
                                        className="object-contain"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Segunda fila de logos (dirección opuesta) */}
                    <div className={`${styles.logoRow} ${styles.reverse}`}>
                        <div className={styles.marquee}>
                            {[...secondRow, ...secondRow].map((client, index) => (
                                <div key={index} className={styles.logoWrapper}>
                                    <Image
                                        src={client.logo}
                                        alt={client.name}
                                        width={150}
                                        height={75}
                                        className="object-contain"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
} 