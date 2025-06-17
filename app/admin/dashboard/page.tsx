import { supabase } from "@/app/lib/supabase";
import { Card } from "@/components/ui/card";
import {
    FileText,
    Briefcase,
    UserCheck,
    AlertCircle,
    LucideIcon
} from "lucide-react";

type ChangeType = "positive" | "negative" | "neutral";

interface StatData {
    mes_actual: number;
    mes_anterior: number;
    variacion_porcentual: number;
}

interface StatItem {
    title: string;
    value: number;
    previousValue: number;
    icon: LucideIcon;
    change: string;
    changeType: ChangeType;
    error: undefined;
}

function formatPercentageChange(porcentaje: number | null): { change: string; changeType: ChangeType } {
    if (porcentaje === null || porcentaje === 0) {
        return { change: "0%", changeType: "neutral" };
    } else if (porcentaje > 0) {
        return { change: `+${porcentaje}%`, changeType: "positive" };
    } else {
        return { change: `${porcentaje}%`, changeType: "negative" };
    }
}

function formatNumber(num: number): string {
    return new Intl.NumberFormat('es-AR').format(num);
}

// Componente para mostrar errores de manera elegante
function ErrorCard({ title, error }: { title: string; error: undefined }) {
    return (
        <Card variant="neubrutalist" className="!p-6 border-red-500 bg-red-50">
            <div className="flex items-center gap-3">
                <AlertCircle className="h-6 w-6 text-red-600" />
                <div>
                    <p className="text-sm font-bold text-red-800 uppercase tracking-wide">
                        Error en {title}
                    </p>
                    <p className="text-xs text-red-600 mt-1">
                        {error || 'Error desconocido'}
                    </p>
                </div>
            </div>
        </Card>
    );
}

export default async function Dashboard() {
    // Llamadas a las funciones de Supabase con manejo de tipos más explícito
    const postulacionesResult = await supabase
        .rpc('obtener_variacion_postulaciones')
        .single();

    const candidatosResult = await supabase
        .rpc('obtener_variacion_registro_candidatos')
        .single();

    const empleosResult = await supabase
        .rpc('obtener_variacion_registro_trabajos')
        .single();

    // Extraer datos y errores con verificación de tipos
    const postulacionesData = postulacionesResult.data as StatData | null;
    const postulacionesError = postulacionesResult.error;

    const candidatosData = candidatosResult.data as StatData | null;
    const candidatosError = candidatosResult.error;

    const empleosData = empleosResult.data as StatData | null;
    const empleosError = empleosResult.error;

    // Log de errores (solo en desarrollo)
    if (process.env.NODE_ENV === 'development') {
        if (postulacionesError) console.error('Error postulaciones:', postulacionesError);
        if (candidatosError) console.error('Error candidatos:', candidatosError);
        if (empleosError) console.error('Error empleos:', empleosError);
    }

    // Formatear cambios porcentuales
    const postulacionesChange = postulacionesData
        ? formatPercentageChange(postulacionesData.variacion_porcentual)
        : { change: "0%", changeType: "neutral" as ChangeType };

    const candidatosChange = candidatosData
        ? formatPercentageChange(candidatosData.variacion_porcentual)
        : { change: "0%", changeType: "neutral" as ChangeType };

    const empleosChange = empleosData
        ? formatPercentageChange(empleosData.variacion_porcentual)
        : { change: "0%", changeType: "neutral" as ChangeType };

    // Configuración de las estadísticas
    const stats: StatItem[] = [
        {
            title: "Total Empleos",
            value: empleosData?.mes_actual ?? 0,
            previousValue: empleosData?.mes_anterior ?? 0,
            icon: Briefcase,
            change: empleosChange.change,
            changeType: empleosChange.changeType,
            error: undefined
        },
        {
            title: "Postulaciones",
            icon: UserCheck,
            value: postulacionesData?.mes_actual ?? 0,
            previousValue: postulacionesData?.mes_anterior ?? 0,
            change: postulacionesChange.change,
            changeType: postulacionesChange.changeType,
            error: undefined
        },
        {
            title: "CVs Recibidos",
            icon: FileText,
            value: candidatosData?.mes_actual ?? 0,
            previousValue: candidatosData?.mes_anterior ?? 0,
            change: candidatosChange.change,
            changeType: candidatosChange.changeType,
            error: undefined
        }
    ];

    // Verificar si hay errores críticos
    const hasErrors = postulacionesError || candidatosError || empleosError;

    return (
        <div className="space-y-8">
            {/* Header */}
            <Card variant="neubrutalist" className="!p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-primary uppercase tracking-wide">
                        Panel de Control
                    </h1>
                    {hasErrors && (
                        <div className="flex items-center gap-2 text-amber-600">
                            <AlertCircle className="h-5 w-5" />
                            <span className="text-sm font-medium">
                                Algunos datos no se pudieron cargar
                            </span>
                        </div>
                    )}
                </div>
            </Card>

            {/* Estadísticas principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats.map((stat) => {
                    // Si hay error en esta estadística específica, mostrar error
                    if (stat.error) {
                        return <ErrorCard key={stat.title} title={stat.title} error={stat.error} />;
                    }

                    const IconComponent = stat.icon;

                    return (
                        <Card variant="neubrutalist" key={stat.title} className="!p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wide">
                                        {stat.title}
                                    </p>
                                    <p className="text-3xl font-black mt-2 text-primary">
                                        {formatNumber(stat.value)}
                                    </p>
                                    <div className="mt-3 space-y-1">
                                        <p className={`text-sm font-bold uppercase tracking-wide ${stat.changeType === 'positive'
                                            ? 'text-green-600'
                                            : stat.changeType === 'negative'
                                                ? 'text-red-600'
                                                : 'text-gray-600 dark:text-gray-400'
                                            }`}>
                                            {stat.change} vs mes anterior
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {formatNumber(stat.previousValue)} el mes pasado
                                        </p>
                                    </div>
                                </div>
                                <div className="bg-primary p-3 border-2 border-black shrink-0">
                                    <IconComponent className="h-8 w-8 text-white" />
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>

            {/* Información adicional o métricas secundarias */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card variant="neubrutalist" className="!p-6">
                    <h3 className="text-lg font-bold text-primary uppercase tracking-wide mb-4">
                        Resumen del Mes
                    </h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                Nuevos empleos publicados:
                            </span>
                            <span className="font-bold text-primary">
                                {formatNumber(empleosData?.mes_actual ?? 0)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                Postulaciones recibidas:
                            </span>
                            <span className="font-bold text-primary">
                                {formatNumber(postulacionesData?.mes_actual ?? 0)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                CVs nuevos registrados:
                            </span>
                            <span className="font-bold text-primary">
                                {formatNumber(candidatosData?.mes_actual ?? 0)}
                            </span>
                        </div>
                    </div>
                </Card>

                <Card variant="neubrutalist" className="!p-6">
                    <h3 className="text-lg font-bold text-primary uppercase tracking-wide mb-4">
                        Tendencia General
                    </h3>
                    <div className="space-y-3">
                        {stats.map((stat) => {
                            const IconComponent = stat.icon;
                            return (
                                <div key={stat.title} className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <IconComponent className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                            {stat.title}:
                                        </span>
                                    </div>
                                    <span className={`text-sm font-bold ${stat.changeType === 'positive'
                                        ? 'text-green-600'
                                        : stat.changeType === 'negative'
                                            ? 'text-red-600'
                                            : 'text-gray-600 dark:text-gray-400'
                                        }`}>
                                        {stat.change}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </Card>
            </div>
        </div>
    );
}