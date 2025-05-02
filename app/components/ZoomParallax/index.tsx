'use client'

import styles from './styles.module.scss';
import Picture1 from '../../../public/pexels-fauxels-3184418.jpg';
import Picture2 from '../../../public/services-nav-image.jpg';
import Picture3 from '../../../public/contact-nav-image.jpg';
import Picture4 from '../../../public/jobs-nav-image.png';
import Picture5 from '../../../public/pexels-fauxels-3184291.jpg';
import Picture6 from '../../../public/pexels-fauxels-3183186.jpg';
import Picture7 from '../../../public/about-nav-image.jpg';

import Image from 'next/image';
import { useScroll, useTransform, motion } from 'framer-motion';
import { useRef } from 'react';

export default function Index() {

    const container = useRef(null);
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ['start start', 'end end']
    })

    const scale4 = useTransform(scrollYProgress, [0, 1], [1, 4]);
    const scale5 = useTransform(scrollYProgress, [0, 1], [1, 5]);
    const scale6 = useTransform(scrollYProgress, [0, 1], [1, 6]);

    const pictures = [
        {
            src: Picture1, // Imagen central con Talento+RH
            scale: scale6
        },
        {
            src: Picture2,
            scale: scale4
        },
        {
            src: Picture3,
            scale: scale4
        },
        {
            src: Picture4,
            scale: scale4
        },
        {
            src: Picture5,
            scale: scale5
        },
        {
            src: Picture6,
            scale: scale5
        },
        {
            src: Picture7,
            scale: scale4
        },
        {
            src: Picture2, // Repetimos algunas imágenes para completar el patrón
            scale: scale4
        },
        {
            src: Picture3,
            scale: scale4
        }
    ]

    return (
        <div ref={container} className={styles.container}>
            <div className={styles.sticky}>
                {
                    pictures.map(({ src, scale }, index) => (
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
                    ))
                }
            </div>
        </div>
    )
}