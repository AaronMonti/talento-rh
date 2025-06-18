'use client'

import CVUploadForm from "@/app/components/CVUploadForm"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function CvUploadPage() {
    return (
        <div className="max-w-xl mx-auto py-10">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Carga tu CV</CardTitle>
                    <CardDescription className="text-md">Completa el siguiente formulario para enviar tu CV. Asegúrate de que el archivo esté en formato PDF.</CardDescription>
                </CardHeader>
                <CardContent>
                    <CVUploadForm />
                </CardContent>
            </Card>
        </div>
    )
}
