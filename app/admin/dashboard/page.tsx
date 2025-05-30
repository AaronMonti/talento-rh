import { supabase } from "@/app/lib/supabase";
import { Card } from "@/components/ui/card";
/* import { Card } from "@/app/components/ui/dashboard/Card"; */
import {
    FileText,
    Briefcase,
    UserCheck
} from "lucide-react";

type ChangeType = "positive" | "negative" | "neutral"

function formatPercentageChange(porcentaje: number | null): { change: string; changeType: ChangeType } {
    if (porcentaje === null) {
        return { change: "0%", changeType: "neutral" }
    } else if (porcentaje >= 0) {
        return { change: `+${porcentaje}%`, changeType: "positive" }
    } else {
        return { change: `${porcentaje}%`, changeType: "negative" }
    }
}

/* type ContarMesResult = {
    mes_actual: number
    mes_anterior: number
    variacion_porcentual: number | null
} */

export default async function Dashboard() {
    const { data: postulacionesData, error: postulacionesError } = await supabase.rpc('contar_postulaciones_mes')

    const { data: candidatosData, error: candidatosError } = await supabase.rpc('contar_candidatos_mes')


    if (postulacionesError) {
        console.error('Error postulaciones:', postulacionesError)
    }
    if (candidatosError) {
        console.error('Error candidatos:', candidatosError)
    }

    const postulacionesChange = postulacionesData ? formatPercentageChange(postulacionesData.variacion_porcentual) : { change: "0%", changeType: "neutral" }
    const candidatosChange = candidatosData ? formatPercentageChange(candidatosData.variacion_porcentual) : { change: "0%", changeType: "neutral" }

    const stats = [
        {
            title: "Total Empleos",
            value: "24",
            icon: Briefcase,
            change: "+12%",
            changeType: "positive"
        },
        {
            title: "Postulaciones",
            icon: UserCheck,
            value: postulacionesData?.mes_actual ?? 0,
            change: postulacionesChange.change,
            changeType: postulacionesChange.changeType
        },
        {
            title: "CVs Recibidos",
            icon: FileText,
            value: candidatosData?.mes_actual ?? 0,
            change: candidatosChange.change,
            changeType: candidatosChange.changeType
        }
    ];

    return (
        <div className="space-y-8">
            <Card variant="neubrutalist" className="!p-4">
                <h1 className="text-3xl font-bold text-primary">
                    Panel de Control
                </h1>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <Card variant="neubrutalist" key={stat.title} className="!p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">{stat.title}</p>
                                <p className="text-2xl font-bold mt-1 text-primary">{stat.value}</p>
                                <p className={`text-sm mt-2 ${stat.changeType === 'positive' ? 'text-accent' : 'text-red-600'
                                    }`}>
                                    {stat.change} vs mes anterior
                                </p>
                            </div>
                            <stat.icon className="h-8 w-8 text-secondary" />
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}