'use client'

import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import CvUploadForm from "./CVUploadForm"
import { Upload } from "lucide-react"

export default function CVUploadDialog() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="default"
                    className="bg-primary hover:bg-primary/90 text-white shadow-md flex items-center gap-2 px-6 py-2.5 text-base"
                >
                    <Upload className="w-5 h-5" />
                    Carga tu CV
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Cargar tu CV</DialogTitle>
                    <DialogDescription>
                        Completá el formulario para postularte. Asegurate de subir tu CV en formato PDF.
                    </DialogDescription>
                </DialogHeader>
                <CvUploadForm />
            </DialogContent>
        </Dialog>
    )
}
