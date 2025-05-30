import { getTrabajosActivos } from "@/app/actions/getTrabajos";
import EmpleosClient from "./EmpleosClient";

export default async function Page() {
    const trabajos = await getTrabajosActivos();
    return <EmpleosClient trabajos={trabajos} />;
}
