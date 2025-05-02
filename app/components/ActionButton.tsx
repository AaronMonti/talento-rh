import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { ReactNode } from "react";

interface FlipTextVerticalProps {
    children: ReactNode;
    icon: ReactNode;
}

export const ActionButton = () => {
    return (
        <section>
            <FlipTextVertical icon={<ArrowRight />}>Empleos</FlipTextVertical>
        </section>
    )
}

const FlipTextVertical = ({ children, icon }: FlipTextVerticalProps) => {
    return (
        <div>
            <motion.div className="absolute bg-primary w-52 px-8 py-3 -z-10 font-medium text-xl">
                {children}
            </motion.div>
            <Link href="/jobs">
                <div className="flex items-center justify-between gap-2 bg-secondary hover:bg-accent transition-colors duration-200 w-52 px-8 py-3 text-white border border-primary">
                    <span className="font-medium text-xl uppercase">
                        {children}
                    </span>
                    {icon}
                </div>
            </Link>
        </div>
    );
};