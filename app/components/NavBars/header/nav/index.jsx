'use client';
import styles from './style.module.scss';
import { useState } from 'react';
import { motion } from 'motion/react';
import { height } from '../anim';
import Body from './Body';
import Footer from './Footer';
import Image from './Image';

import picture1 from '@/public/about-nav-image.jpg'
import picture2 from '@/public/jobs-nav-image.png'
import picture3 from '@/public/contact-nav-image.jpg'
import picture4 from '@/public/pexels-fauxels-3184291.jpg'
import picture5 from '@/public/clients-nav-image.jpg'

const links = [
  {
    title: "Inicio",
    href: "/",
    src: picture1
  },
  {
    title: "Nosotros",
    href: "/shop",
    src: picture2
  },
  {
    title: "Clientes",
    href: "/about",
    src: picture3
  },
  {
    title: "Contacto",
    href: "/lookbook",
    src: picture4
  },
  {
    title: "Ofertas Laborales",
    href: "/empleos",
    src: picture5
  },
  {
    title: "Postulate",
    href: "/empleos",
    src: picture5
  }
]

export default function Index() {

  const [selectedLink, setSelectedLink] = useState({ isActive: false, index: 0 });

  return (
    <motion.div variants={height} initial="initial" animate="enter" exit="exit" className={styles.nav}>
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <Body links={links} selectedLink={selectedLink} setSelectedLink={setSelectedLink} />
          <Footer />
        </div>
        <Image src={links[selectedLink.index].src} isActive={selectedLink.isActive} />
      </div>
    </motion.div>
  )
}