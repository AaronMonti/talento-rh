// app/empleos/layout.tsx
export const dynamic = 'force-dynamic';
import { ReactNode } from "react";
import Header from "@/app/components/NavBars/header"



export default function EmpleosLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-20 md:pt-24">{children}</main>
    </div>
  );
}