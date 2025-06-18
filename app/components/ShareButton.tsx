'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

interface ShareButtonProps {
    url: string;
    title: string;
    text?: string;
}

export default function ShareButton({ url }: ShareButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            // Asegurar que la URL tenga el protocolo HTTPS
            let fullUrl = url;
            if (typeof window !== 'undefined') {
                if (!url.startsWith('http://') && !url.startsWith('https://')) {
                    // Si la URL es relativa, crear la URL completa
                    fullUrl = `${window.location.origin}${url.startsWith('/') ? '' : '/'}${url}`;
                } else if (!url.startsWith('https://') && url.startsWith('http://')) {
                    // Si tiene http, cambiar a https
                    fullUrl = url.replace('http://', 'https://');
                }
            }

            await navigator.clipboard.writeText(fullUrl);
            setCopied(true);
            toast.success('¡URL copiada al portapapeles!');

            // Resetear el estado después de 2 segundos
            setTimeout(() => {
                setCopied(false);
            }, 2000);
        } catch {
            toast.error('Error al copiar la URL');
        }
    };

    return (
        <Button
            onClick={handleCopy}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
        >
            {copied ? (
                <>
                    <Check size={16} className="text-green-600" />
                    <span>¡Copiado!</span>
                </>
            ) : (
                <>
                    <Copy size={16} />
                    <span>Compartir</span>
                </>
            )}
        </Button>
    );
} 