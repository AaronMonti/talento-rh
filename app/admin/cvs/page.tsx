'use client';

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";
import { Card } from "@/app/components/ui/dashboard/Card";
import { Input } from "@/app/components/ui/dashboard/Input";
import { Select } from "@/app/components/ui/dashboard/Select";
import { FileText, Download } from "lucide-react";
import { Button } from "@/app/components/ui/dashboard/Button";

interface CV {
  id: string;
  nombre: string;
  email: string;
  empleo_titulo: string;
  fecha_postulacion: string;
  cv_url: string;
  signedUrl?: string;
}

export default function CVs() {
  const [cvs, setCvs] = useState<CV[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCVs = async () => {
      setLoading(true);

      // 1. Obtener CVs desde la tabla "postulaciones"
      const { data, error } = await supabase
        .from("postulaciones")
        .select("id, nombre, email, empleo_titulo, fecha_postulacion, cv_url, empleo_id");

      let signedCvs: CV[] = [];

      if (error) {
        console.error("❌ Error al cargar los CVs:", error.message);
      } else if (data && data.length > 0) {
        signedCvs = await Promise.all(
          data.map(async (cv) => {
            let path = "";

            if (cv.empleo_id) {
              path = `${cv.empleo_id}/${cv.cv_url.split("/").pop()}`;
            } else {
              path = `cvs/${cv.cv_url.split("/").pop()}`;
            }

            const { data: signed, error: signedErr } = await supabase
              .storage
              .from("cvs")
              .createSignedUrl(path, 3600);

            if (signedErr) {
              console.error("❌ Error generando signed URL:", signedErr.message);
            }

            return {
              ...cv,
              signedUrl: signed?.signedUrl || cv.cv_url,
            };
          })
        );
      }

      // 2. Obtener archivos desde la carpeta "curriculums"
      const { data: curriculumFiles, error: curriculumError } = await supabase
        .storage
        .from("cvs")
        .list("curriculums", { limit: 100 });

      let curriculumCVs: CV[] = [];

      if (curriculumError) {
        console.error("❌ Error al listar archivos en 'curriculums':", curriculumError.message);
      } else {
        curriculumCVs = await Promise.all(
          (curriculumFiles || [])
          .filter((file) => file.name !== ".emptyFolderPlaceholder")
          .map(async (file) => {
            const path = `curriculums/${file.name}`;
            const { data: signed, error: signedErr } = await supabase
              .storage
              .from("cvs")
              .createSignedUrl(path, 3600);

            if (signedErr) {
              console.error(`❌ Error creando signed URL para ${file.name}:`, signedErr.message);
            }

            return {
              id: `curriculum-${file.name}`,
              nombre: file.name.replace(".pdf", ""),
              email: "",
              empleo_titulo: "",
              fecha_postulacion: file.updated_at || new Date().toISOString(),
              cv_url: path,
              signedUrl: signed?.signedUrl || "",
            };
          })
        );
      }

      // 3. Combinar ambos
      setCvs([...signedCvs, ...curriculumCVs]);
      setLoading(false);
    };

    fetchCVs();
  }, []);

  const handleDownload = async (cv: CV) => {
    if (!cv.signedUrl) {
      console.error("❌ No se encontró la URL firmada para el CV");
      return;
    }

    try {
      const response = await fetch(cv.signedUrl);
      if (!response.ok) {
        throw new Error("No se pudo obtener el archivo");
      }

      const blob = await response.blob();

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${cv.nombre}_CV.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("❌ Error descargando el archivo:", error);
    }
  };

  return (
    <div className="space-y-8">
      <Card className="!p-4">
        <h1 className="text-3xl font-bold text-primary">Banco de CVs</h1>
      </Card>

      <Card className="!p-6">
        <div className="flex gap-4 mb-6">
          <Input
            placeholder="Buscar por nombre o posición..."
            className="flex-1"
          />
          <Select
            options={[{ label: "Todos", value: "all" }]}
            placeholder="Filtrar por estado"
          />
        </div>

        <div className="space-y-4">
          {loading ? (
            <p>Cargando CVs...</p>
          ) : cvs.length === 0 ? (
            <p>No hay postulaciones aún.</p>
          ) : (
            cvs.map((cv) => (
              <Card key={cv.id} className="!p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <FileText className="h-8 w-8 text-secondary" />
                  <div>
                    <h3 className="font-bold text-primary">{cv.nombre}</h3>
                    {cv.empleo_titulo ? (
                      <>
                        <p className="text-sm text-gray-600">{cv.empleo_titulo}</p>
                        <p className="text-xs text-tertiary">
                          Recibido: {new Date(cv.fecha_postulacion).toLocaleDateString()}
                        </p>
                      </>
                    ) : (
                      <p className="text-sm text-gray-500 italic">Archivo sin postulación</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="!p-2" onClick={() => handleDownload(cv)}>
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
