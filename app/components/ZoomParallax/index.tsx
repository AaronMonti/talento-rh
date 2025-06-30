'use client'

import styles from './styles.module.scss';
import Picture1 from '../../../public/pexels-fauxels-3184418.jpg';
import Picture2 from '../../../public/services-nav-image.jpg';
import Picture3 from '../../../public/contact-nav-image.jpg';
import Picture4 from '../../../public/jobs-nav-image.png';
import Picture5 from '../../../public/pexels-fauxels-3184291.jpg';
import Picture6 from '../../../public/pexels-fauxels-3183186.jpg';
import Picture7 from '../../../public/about-nav-image.jpg';
import Picture8 from '../../../public/papeles-comerciales-de-naturaleza-muerta-con-varias-piezas-de-mecanismo.jpg';
import Picture9 from '../../../public/consulta-con-abogado.jpg';

import Image from 'next/image';
import { useScroll, useTransform, motion } from 'motion/react';
import { useRef } from 'react';

export default function Index() {
    const container = useRef(null);

    const { scrollYProgress } = useScroll({
        target: container,
        layoutEffect: false,
        offset: ['start start', 'end end']
    });

    const scale4 = useTransform(scrollYProgress, [0, 1], [1, 4]);
    const scale5 = useTransform(scrollYProgress, [0, 1], [1, 5]);
    const scale6 = useTransform(scrollYProgress, [0, 1], [1, 6]);

    const pictures = [
        { src: Picture1, scale: scale6 }, // Imagen central Talento+RH
        { src: Picture2, scale: scale4 },
        { src: Picture3, scale: scale4 },
        { src: Picture4, scale: scale4 },
        { src: Picture5, scale: scale5 },
        { src: Picture6, scale: scale5 },
        { src: Picture7, scale: scale4 },
        { src: Picture8, scale: scale4 },
        { src: Picture9, scale: scale4 }
    ];

    return (
        <div className={styles.wrapper}>
            {/* Versión mobile: imagen fija con texto encima */}
            <div className="relative h-screen w-full md:hidden">
                <Image
                    src={Picture1}
                    alt="Talento+RH"
                    placeholder="blur"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 flex items-center justify-center z-10">
                    <h2 className="text-secondary text-5xl font-black tracking-wider uppercase"
                        style={{
                            textShadow: '2px 2px 8px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 0, 0, 0.6)'
                        }}>
                        Talento+RH
                    </h2>
                </div>
            </div>

            {/* Versión desktop: efecto de scroll animado */}
            <div ref={container} className={`${styles.container} hidden md:block`}>
                <div className={styles.sticky}>
                    {pictures.map(({ src, scale }, index) => (
                        <motion.div key={index} style={{ scale }} className={styles.el}>
                            <div className={styles.imageContainer}>
                                <Image
                                    src={src}
                                    fill
                                    alt="image"
                                    placeholder="blur"
                                />
                                {index === 0 && (
                                    <div className={styles.overlayText}>
                                        <h2 className='text-secondary'>Talento+RH</h2>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
