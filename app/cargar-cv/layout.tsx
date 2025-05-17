// app/empleos/layout.tsx
import { ReactNode } from "react";
import Header from "@/app/components/NavBars/header"

export default function EmpleosLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen">
            <Header />
            <main className="relative top-25">{children}</main>
        </div>
    );
}