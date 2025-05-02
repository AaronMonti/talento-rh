"use client";

import { Card } from "@/app/components/ui/dashboard/Card";
import { 
  Users, 
  FileText, 
  Briefcase, 
  UserCheck 
} from "lucide-react";

export default function Dashboard() {
  const stats = [
    {
      title: "Total Empleos",
      value: "24",
      icon: Briefcase,
      change: "+12%",
      changeType: "positive"
    },
    {
      title: "CVs Recibidos",
      value: "145",
      icon: FileText,
      change: "+22%",
      changeType: "positive"
    },
    {
      title: "Postulaciones",
      value: "89",
      icon: Users,
      change: "+8%",
      changeType: "positive"
    },
    {
      title: "Candidatos",
      value: "34",
      icon: UserCheck,
      change: "+15%",
      changeType: "positive"
    }
  ];

  return (
    <div className="space-y-8">
      <Card className="!p-4">
        <h1 className="text-3xl font-bold text-primary">
          Panel de Control
        </h1>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="!p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold mt-1 text-primary">{stat.value}</p>
                <p className={`text-sm mt-2 ${
                  stat.changeType === 'positive' ? 'text-accent' : 'text-red-600'
                }`}>
                  {stat.change} vs mes anterior
                </p>
              </div>
              <stat.icon className="h-8 w-8 text-secondary" />
            </div>
          </Card>
        ))}
      </div>

      {/* Aquí puedes agregar más secciones como gráficos o tablas */}
    </div>
  );
}