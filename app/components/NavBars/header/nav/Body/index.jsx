import { motion } from 'motion/react';
import Link from 'next/link';
import styles from './style.module.scss';
import { blur, translate } from '../../anim';

export default function Body({ links, selectedLink, setSelectedLink, onClose }) {

    const getChars = (word) => {
        let chars = [];
        word.split("").forEach((char, i) => {
            if (char === " ") {
                chars.push(
                    <motion.span
                        custom={[i * 0.02, (word.length - i) * 0.01]}
                        variants={translate}
                        initial="initial"
                        animate="enter"
                        exit="exit"
                        key={`space_${i}`}
                        style={{ marginRight: '0.25em' }}
                    >
                        &nbsp;
                    </motion.span>
                );
            } else {
                chars.push(
                    <motion.span
                        custom={[i * 0.02, (word.length - i) * 0.01]}
                        variants={translate}
                        initial="initial"
                        animate="enter"
                        exit="exit"
                        key={char + i}
                    >
                        {char}
                    </motion.span>
                );
            }
        });
        return chars;
    }

    return (
        <div className={styles.body}>
            {links.map((link, index) => {
                const { title, href } = link;
                const isLast = index === links.length - 1;
                const isJobs = title === "Búsquedas Laborales";

                return (
                    <div key={`link_${index}`} className="flex items-center">
                        <Link href={href} onClick={onClose}>
                            <motion.p
                                onMouseOver={() => { setSelectedLink({ isActive: true, index }) }}
                                onMouseLeave={() => { setSelectedLink({ isActive: false, index }) }}
                                variants={blur}
                                animate={selectedLink.isActive && selectedLink.index != index ? "open" : "closed"}
                                className={isJobs ? 'text-secondary' : ''}
                            >
                                {getChars(title)}
                            </motion.p>
                        </Link>
                        {!isLast && (
                            <motion.span
                                className={styles.separator}
                                variants={blur}
                                animate={selectedLink.isActive ? "open" : "closed"}>
                                |
                            </motion.span>
                        )}
                    </div>
                )
            })}
        </div>
    )
}
