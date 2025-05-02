'use client';

import { useState, useEffect } from "react";
import { Card } from "@/app/components/ui/dashboard/Card";
import { Button } from "@/app/components/ui/dashboard/Button";
import { Input } from "@/app/components/ui/dashboard/Input";
import { Select } from "@/app/components/ui/dashboard/Select";
import { useForm } from "react-hook-form";
import { supabase } from "@/app/lib/supabase";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Toolbar } from "radix-ui";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

interface Empleo {
  id: string;
  titulo: string;
  empresa: string;
  ubicacion: string;
  modalidad: string;
  salario: string;
  descripcion: string;
}

interface FormData {
  titulo: string;
  empresa: string;
  ubicacion: string;
  modalidad: string;
  salario: string;
  descripcion: string;
}

// Radix Dialog Components
const DialogRoot = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogOverlay = DialogPrimitive.Overlay;
const DialogContent = DialogPrimitive.Content;
const DialogTitle = DialogPrimitive.Title;
const DialogDescription = DialogPrimitive.Description;
const DialogClose = DialogPrimitive.Close;

// Custom Dialog Component
const Dialog = ({ 
  children, 
  open, 
  onOpenChange, 
  title 
}: { 
  children: React.ReactNode; 
  open: boolean; 
  onOpenChange: (open: boolean) => void; 
  title: string;
}) => {
  return (
    <DialogRoot open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        <DialogContent className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-full max-w-md max-h-[85vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
            <DialogClose asChild>
              <button className="rounded-full p-1 hover:bg-gray-100">
                <X size={18} />
              </button>
            </DialogClose>
          </div>
          {children}
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
  );
};

export default function Empleos() {
  const [empleos, setEmpleos] = useState<Empleo[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentEmpleoId, setCurrentEmpleoId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [empleoToDelete, setEmpleoToDelete] = useState<Empleo | null>(null);

  const { register, handleSubmit, reset, watch, setValue } = useForm<FormData>({
    defaultValues: {
      titulo: "",
      empresa: "",
      ubicacion: "",
      modalidad: "remoto",
      salario: "",
      descripcion: ""
    }
  });

  const modalidadValue = watch("modalidad");

  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
    editorProps: {
      attributes: {
        class: "min-h-[150px] p-3 focus:outline-none"
      }
    },
    onUpdate: ({ editor }) => {
      setValue("descripcion", editor.getHTML());
    },
  });

  // Cargar empleos desde Firebase al iniciar
  useEffect(() => {
    fetchEmpleos();
  }, []);

  const fetchEmpleos = async () => {
    try {
      const { data, error } = await supabase
        .from("empleos")
        .select("*");
  
      if (error) throw error;
  
      setEmpleos(data as Empleo[]);
    } catch (error) {
      console.error("Error al cargar empleos:", error);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
  
      if (isEditing && currentEmpleoId) {
        const { error } = await supabase
          .from("empleos")
          .update(data)
          .eq("id", currentEmpleoId);
  
        if (error) throw error;
  
        setEmpleos(
          empleos.map(empleo =>
            empleo.id === currentEmpleoId ? { ...empleo, ...data } : empleo
          )
        );
      } else {
        const { data: newEmpleo, error } = await supabase
          .from("empleos")
          .insert(data)
          .select()
          .single(); // para obtener el ID creado
  
        if (error) throw error;
  
        setEmpleos([...empleos, newEmpleo as Empleo]);
      }
  
      setIsDialogOpen(false);
      setIsEditing(false);
      setCurrentEmpleoId(null);
      reset();
      editor?.commands.clearContent();
  
    } catch (error) {
      console.error(`Error al ${isEditing ? "actualizar" : "crear"} empleo:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("empleos")
        .delete()
        .eq("id", id);
  
      if (error) throw error;
  
      setEmpleos(empleos.filter(empleo => empleo.id !== id));
      setIsDeleteDialogOpen(false);
      setEmpleoToDelete(null);
    } catch (error) {
      console.error("Error al eliminar empleo:", error);
    }
  };

  const handleEdit = (empleo: Empleo) => {
    setIsEditing(true);
    setCurrentEmpleoId(empleo.id);

    // Llenar el formulario con los datos del empleo
    Object.entries(empleo).forEach(([key, value]) => {
      if (key !== 'id') {
        setValue(key as keyof FormData, value);
      }
    });

    // Establecer el contenido del editor
    if (editor) {
      editor.commands.setContent(empleo.descripcion);
    }

    setIsDialogOpen(true);
  };

  const handleConfirmDelete = (empleo: Empleo) => {
    setEmpleoToDelete(empleo);
    setIsDeleteDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setIsEditing(false);
    setCurrentEmpleoId(null);
    reset();
    editor?.commands.clearContent();
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <Card className="!p-4">
          <h1 className="text-3xl font-bold text-black">
            Gestión de Empleos
          </h1>
        </Card>

        <Button
          color="accent"
          onClick={() => {
            setIsEditing(false);
            setCurrentEmpleoId(null);
            reset();
            editor?.commands.clearContent();
            setIsDialogOpen(true);
          }}
        >
          Crear Nuevo Empleo
        </Button>

        {/* Diálogo para crear/editar empleo con Radix Primitives */}
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            if (!open) handleDialogClose();
            else setIsDialogOpen(true);
          }}
          title={isEditing ? "Editar Empleo" : "Crear Nuevo Empleo"}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Título del empleo"
              {...register("titulo", { required: true })}
              placeholder="ej. Desarrollador Frontend"
            />

            <Input
              label="Empresa"
              {...register("empresa", { required: true })}
              placeholder="ej. TechCorp"
            />

            <Input
              label="Ubicación"
              {...register("ubicacion", { required: true })}
              placeholder="ej. Madrid, España"
            />

            <Select
              label="Modalidad"
              options={[
                { label: "Remoto", value: "remoto" },
                { label: "Presencial", value: "presencial" },
                { label: "Híbrido", value: "hibrido" }
              ]}
              value={modalidadValue}
              onChange={(value) => setValue("modalidad", value)}
            />

            <Input
              label="Rango Salarial"
              {...register("salario")}
              placeholder="ej. 35,000€ - 45,000€"
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Descripción
              </label>

              <div className="border border-gray-300 rounded-md shadow-sm focus-within:ring-2 focus-within:ring-accent focus-within:border-accent overflow-hidden">
                <Toolbar.Root className="flex gap-2 border-b p-2 bg-gray-50">
                  <Toolbar.Button
                    onClick={() => editor?.chain().focus().toggleBold().run()}
                    className={`p-1 rounded ${editor?.isActive('bold') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                    type="button"
                  >
                    <span className="font-bold">B</span>
                  </Toolbar.Button>
                  <Toolbar.Button
                    onClick={() => editor?.chain().focus().toggleItalic().run()}
                    className={`p-1 rounded ${editor?.isActive('italic') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                    type="button"
                  >
                    <span className="italic">I</span>
                  </Toolbar.Button>
                  <Toolbar.Button
                    onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={`p-1 rounded ${editor?.isActive('heading', { level: 3 }) ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                    type="button"
                  >
                    <span className="font-semibold">H3</span>
                  </Toolbar.Button>
                  <Toolbar.Button
                    onClick={() => editor?.chain().focus().toggleBulletList().run()}
                    className={`p-1 rounded ${editor?.isActive('bulletList') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                    type="button"
                  >
                    • Lista
                  </Toolbar.Button>
                  <Toolbar.Button
                    onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                    className={`p-1 rounded ${editor?.isActive('orderedList') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                    type="button"
                  >
                    1. Lista
                  </Toolbar.Button>
                </Toolbar.Root>

                <EditorContent
                  editor={editor}
                  className="p-3 min-h-[150px] prose prose-sm max-w-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-2">
              <DialogClose asChild>
                <Button
                  variant="outline"
                  type="button"
                >
                  Cancelar
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Guardando..." : isEditing ? "Actualizar Empleo" : "Crear Empleo"}
              </Button>
            </div>
          </form>
        </Dialog>

        {/* Diálogo de confirmación para eliminar con Radix Primitives */}
        <Dialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          title="Confirmar eliminación"
        >
          <div className="space-y-4">
            <DialogDescription className="text-gray-700">
              ¿Estás seguro que deseas eliminar el empleo <strong>{empleoToDelete?.titulo}</strong>?
            </DialogDescription>
            <p className="text-sm text-gray-500">Esta acción no se puede deshacer.</p>

            <div className="flex justify-end gap-4 pt-4">
              <DialogClose asChild>
                <Button
                  variant="outline"
                >
                  Cancelar
                </Button>
              </DialogClose>
              <Button
                color="red"
                onClick={() => empleoToDelete && handleDelete(empleoToDelete.id)}
              >
                Eliminar
              </Button>
            </div>
          </div>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {empleos.length === 0 ? (
          <Card className="p-6 text-center text-gray-500">
            No hay empleos disponibles. ¡Crea el primero!
          </Card>
        ) : (
          empleos.map((empleo) => (
            <Card key={empleo.id} className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-primary">{empleo.titulo}</h3>
                  <p className="text-gray-600">{empleo.empresa}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(empleo)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    color="red"
                    onClick={() => handleConfirmDelete(empleo)}
                  >
                    Eliminar
                  </Button>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <p className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-medium">Ubicación:</span> {empleo.ubicacion}
                </p>
                <p className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-medium">Modalidad:</span> {empleo.modalidad}
                </p>
                <p className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-medium">Salario:</span> {empleo.salario}
                </p>
                <div className="mt-4">
                  <p className="font-medium text-sm text-gray-600 mb-1">Descripción:</p>
                  <div
                    className="text-sm text-gray-700 prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: empleo.descripcion }}
                  />
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}