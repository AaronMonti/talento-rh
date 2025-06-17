"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Download, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";

async function getSignedUrl(path: string): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from("cvs")
    .createSignedUrl(path, 60);
  if (error) {
    console.error("Error obteniendo URL firmada:", error);
    return null;
  }
  return data?.signedUrl || null;
}

export default function Candidatos() {
  const [candidatos, setCandidatos] = useState<
    Array<{
      id: number;
      nombre_apellido: string;
      estudios: string;
      localidad: string;
      puesto_posicion: string;
      cv_url: string | null;
      cv_storage_path: string;
      fecha_registro: string;
    }>
  >([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortAsc, setSortAsc] = useState(true);

  async function handleDownloadCv(path: string, fileName: string) {
    try {
      const { data, error } = await supabase.storage
        .from("cvs")
        .download(path);

      if (error) {
        console.error("Error descargando archivo:", error);
        toast.error("Error al descargar el archivo.");
        return;
      }

      if (data) {
        const url = window.URL.createObjectURL(data);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Error en descarga:", error);
      toast.error("Error al descargar el archivo.");
    }
  }

  useEffect(() => {
    async function fetchCandidatos() {
      const { data, error } = await supabase
        .from("candidatos")
        .select("*")
        .order("fecha_registro", { ascending: false });

      if (error) {
        toast.error("Error cargando candidatos: " + error.message);
        setLoading(false);
        return;
      }

      // Mapeamos para obtener la URL firmada si no existe cv_url
      const candidatosConUrl = await Promise.all(
        (data || []).map(async (c) => {
          // Solo pedir URL firmada si cv_url no está definido o es null
          const url = c.cv_url ? c.cv_url : await getSignedUrl(c.cv_storage_path);
          return { ...c, cv_url: url };
        })
      );

      setCandidatos(candidatosConUrl);
      setLoading(false);
    }

    fetchCandidatos();
  }, []);

  async function handleDelete(id: number) {
    // Aquí podrías añadir lógica para borrar el archivo en Storage si quieres
    const { error } = await supabase.from("candidatos").delete().eq("id", id);
    if (error) {
      toast.error("Error al borrar candidato: " + error.message);
    } else {
      toast.success("Candidato borrado correctamente");
      setCandidatos((prev) => prev.filter((c) => c.id !== id));
    }
  }

  const filteredCandidatos = candidatos
    .filter((c) =>
      c.nombre_apellido
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      c.puesto_posicion
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      c.localidad
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      c.estudios
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const dateA = new Date(a.fecha_registro).getTime();
      const dateB = new Date(b.fecha_registro).getTime();
      return sortAsc ? dateA - dateB : dateB - dateA;
    });

  if (loading) {
    return (
      <div className="space-y-6">
        <Card variant="neubrutalist" className="!p-4">
          <h1 className="text-3xl font-bold text-primary uppercase tracking-wide">
            CVs Recibidos
          </h1>
        </Card>
        <Card variant="neubrutalist" className="!p-6">
          <p className="text-center font-bold text-lg">Cargando candidatos...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card variant="neubrutalist" className="!p-4">
        <h1 className="text-3xl font-bold text-primary uppercase tracking-wide">
          CVs Recibidos
        </h1>
      </Card>

      {candidatos.length === 0 && (
        <Card variant="neubrutalist" className="!p-6">
          <p className="text-center font-bold text-lg">No hay candidatos registrados.</p>
        </Card>
      )}

      <Card variant="neubrutalist" className="!p-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <Input
            variant="brutalist"
            type="text"
            placeholder="Buscar por nombre, puesto, localidad o estudios..."
            className="px-4 py-2 w-full md:w-1/2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button
            variant="brutalist"
            className="bg-[#8be9fd] hover:bg-[#50fa7b] text-black font-bold uppercase"
            onClick={() => setSortAsc(!sortAsc)}
          >
            Ordenar por fecha: {sortAsc ? "Ascendente" : "Descendente"}
          </Button>
        </div>
      </Card>

      {filteredCandidatos.map((c) => {
        return (
          <Card key={c.id} variant="neubrutalist">
            <CardHeader>
              <CardTitle className="text-xl font-black uppercase tracking-wide text-black dark:text-white">
                {c.nombre_apellido}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="font-bold">
                <strong className="text-primary">Estudios:</strong> {c.estudios}
              </p>
              <p className="font-bold">
                <strong className="text-primary">Localidad:</strong> {c.localidad}
              </p>
              <p className="font-bold">
                <strong className="text-primary">Puesto/Posición:</strong> {c.puesto_posicion}
              </p>
              <p className="font-bold">
                <strong className="text-primary">Fecha de registro:</strong>{" "}
                {c.fecha_registro
                  ? new Date(c.fecha_registro).toLocaleDateString("es-AR")
                  : "—"}
              </p>

              <div className="flex gap-4 mt-4 flex-wrap">
                {c.cv_url && (
                  <>
                    <Button
                      variant="brutalist"
                      asChild
                      className="bg-[#ff69b4] hover:bg-[#e44f9c] text-white"
                    >
                      <a
                        href={c.cv_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center font-bold uppercase"
                      >
                        <ExternalLink className="w-4 h-4 mr-1" /> Ver CV
                      </a>
                    </Button>

                    <Button
                      variant="brutalist"
                      onClick={() => handleDownloadCv(c.cv_storage_path, c.nombre_apellido)}
                      className="flex items-center font-bold uppercase bg-[#dd63ff] hover:bg-[#bd13ec] text-white"
                    >
                      <Download className="w-4 h-4 mr-1" /> Descargar
                    </Button>
                  </>
                )}

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="brutalist"
                      className="flex items-center font-bold uppercase bg-[#ff97d9] hover:bg-[#e44f9c] text-black"
                    >
                      <Trash2 className="w-4 h-4 mr-1" /> Borrar
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent variant="neubrutalist">
                    <AlertDialogHeader variant="neubrutalist">
                      <AlertDialogTitle variant="neubrutalist">
                        ¿Estás seguro que deseas borrar este candidato?
                      </AlertDialogTitle>
                      <AlertDialogDescription variant="neubrutalist">
                        Esta acción no se puede deshacer. El CV y los datos del
                        candidato se eliminarán permanentemente.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter variant="neubrutalist">
                      <AlertDialogCancel variant="neubrutalist">
                        Cancelar
                      </AlertDialogCancel>
                      <AlertDialogAction
                        variant="neubrutalist"
                        onClick={() => handleDelete(c.id)}
                      >
                        Borrar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}