import { getTrabajosParaDashboard } from "@/app/actions/getTrabajos";
import EmpleosClient from "./EmpleosClient";

export default async function Page() {
    const trabajos = await getTrabajosParaDashboard();
    return <EmpleosClient trabajos={trabajos} />;
}
