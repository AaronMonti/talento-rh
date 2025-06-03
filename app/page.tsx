'use client'

import Index from "./components/ZoomParallax";
import Header from "@/app/components/NavBars/header"
import About from "./components/About"
import Clients from "./components/Clients"
import Contact from "./components/Contact"
import WhatsappButton from "./components/WhatsappButton";

export default function Home() {
  return (
    <main>
      <WhatsappButton />
      <Header />
      <Index />
      <About />
      <Clients />
      <Contact />
    </main>
  )
}