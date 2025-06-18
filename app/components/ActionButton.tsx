import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ActionButton() {
    return (
        <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
            {/* Botón principal para la bolsa de empleo */}
            <Link href="/empleos">
                <Button
                    size="lg"
                    className="shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-primary hover:bg-primary/90"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 00-2 2H8a2 2 0 00-2-2V6m8 0h2a2 2 0 012 2v6.5" />
                    </svg>
                    Ver Empleos
                </Button>
            </Link>

            {/* Botón secundario para subir CV */}
            <Link href="/cargar-cv">
                <Button
                    variant="outline"
                    size="lg"
                    className="shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    Subir CV
                </Button>
            </Link>
        </div>
    )
}