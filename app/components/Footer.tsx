import Link from "next/link"

export default function Footer() {
    return (
        <footer className="bg-slate-50 dark:bg-gray-900 text-gray-800 dark:text-white border-t border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Información de la empresa */}
                    <div className="md:col-span-1">
                        <h3 className="text-xl font-bold mb-4 text-purple-600 dark:text-purple-400">Talento Positivo RH</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm leading-relaxed">
                            Consultora especializada en atracción y selección de profesionales con foco en perfiles industriales.
                            Conectamos talento calificado con empresas PYMES, nacionales y multinacionales.
                        </p>
                    </div>

                    {/* Enlaces útiles */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Enlaces útiles</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/" className="text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors text-sm">
                                    Inicio
                                </Link>
                            </li>
                            <li>
                                <Link href="/empleos" className="text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors text-sm">
                                    Empleos
                                </Link>
                            </li>
                            <li>
                                <Link href="/cargar-cv" className="text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors text-sm">
                                    Cargar CV
                                </Link>
                            </li>
                            <li>
                                <Link href="/#contacto" className="text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors text-sm">
                                    Contacto
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Información de contacto */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Contacto</h4>
                        <div className="space-y-3 text-gray-600 dark:text-gray-400">
                            <div className="flex items-center">
                                <svg className="h-4 w-4 mr-3 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <span className="text-sm">+54 (9) 11-6589-9729</span>
                            </div>
                            <div className="flex items-center">
                                <svg className="h-4 w-4 mr-3 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <span className="text-sm">rrhh@talentopositivorh.com</span>
                            </div>
                            <div className="flex items-center">
                                <svg className="h-4 w-4 mr-3 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span className="text-sm">San Miguel, Buenos Aires</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Línea divisoria y copyright */}
                <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-6">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
                        <p className="text-gray-500 dark:text-gray-400 text-xs">
                            © {new Date().getFullYear()} Talento Positivo RH. Todos los derechos reservados.
                        </p>
                        <div className="flex flex-col md:flex-row items-center space-y-1 md:space-y-0 md:space-x-4 text-xs">
                            <p className="text-gray-500 dark:text-gray-400">
                                Fundada por María Florencia Luna - Lic. en Gestión de Capital Humano
                            </p>
                            <span className="hidden md:inline text-gray-300 dark:text-gray-600">•</span>
                            <p className="text-gray-500 dark:text-gray-400">
                                Sitio web creado por{" "}
                                <Link
                                    href="https://bynadevs.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium transition-colors"
                                >
                                    byNAdevs
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
} 