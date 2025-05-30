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

async function getSignedUrl(path: string): Promise<string | null> {
  const { data } = await supabase.storage
    .from("cvs")
    .createSignedUrl(path, 60 * 60);
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

  useEffect(() => {
    async function fetchCandidatos() {
      const { data, error } = await supabase
        .from("candidatos") // Asumo que la tabla se llama así
        .select("*")
        .order("fecha_registro", { ascending: false });

      if (error) {
        toast.error("Error cargando candidatos: " + error.message);
        setLoading(false);
        return;
      }

      const candidatosConUrl = await Promise.all(
        (data || []).map(async (c) => {
          const url = c.cv_url || await getSignedUrl(c.cv_storage_path);
          return { ...c, cv_url: url };
        })
      );

      setCandidatos(candidatosConUrl);
      setLoading(false);
    }

    fetchCandidatos();
  }, []);

  async function handleDelete(id: number) {
    const { error } = await supabase.from("candidatos").delete().eq("id", id);
    if (error) {
      toast.error("Error al borrar candidato: " + error.message);
    } else {
      toast.success("Candidato borrado correctamente");
      setCandidatos((prev) => prev.filter((c) => c.id !== id));
    }
  }

  if (loading) return <p>Cargando candidatos...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">CVs Recibidos</h1>

      {candidatos.length === 0 && <p>No hay candidatos registrados.</p>}

      {candidatos.map((c) => {

        return (
          <Card key={c.id}>
            <CardHeader>
              <CardTitle>{c.nombre_apellido}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p><strong>Estudios:</strong> {c.estudios}</p>
              <p><strong>Localidad:</strong> {c.localidad}</p>
              <p><strong>Puesto/Posición:</strong> {c.puesto_posicion}</p>
              <p><strong>Fecha de registro:</strong> {c.fecha_registro}</p>

              <div className="flex gap-4 mt-4">
                {c.cv_url && (
                  <>
                    <Button variant="outline" asChild>
                      <a
                        href={c.cv_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center"
                      >
                        <ExternalLink className="w-4 h-4 mr-1" /> Ver CV
                      </a>
                    </Button>

                    <Button
                      variant="secondary"
                      onClick={() => window.open(c.cv_url!, "_blank")}
                      className="flex items-center"
                    >
                      <Download className="w-4 h-4 mr-1" /> Descargar
                    </Button>
                  </>
                )}

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="flex items-center">
                      <Trash2 className="w-4 h-4 mr-1" /> Borrar
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        ¿Estás seguro que deseas borrar este candidato?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta acción no se puede deshacer. El CV y los datos del
                        candidato se eliminarán permanentemente.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(c.id)}
                        className="bg-destructive text-white hover:bg-destructive/90"
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
