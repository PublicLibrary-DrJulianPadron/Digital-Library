import React from 'react';
import { Calendar, MapPin, Users, BookOpen, Award, Building, ArrowRight } from "lucide-react";
import bibliotecaHistoria from "/history_background.jpg";
import { ReturnButton } from "@/common/components/ui/return-button";

export default function HistoriaPage() {
  const historicalMilestones = [
    {
      title: "Fundación",
      icon: Calendar,
      content: "Establecida oficialmente en 1968, nacimos con la visión de democratizar el acceso al conocimiento en la región oriental.",
      highlight: "1968",
      colorTheme: {
        iconBg: "bg-[#003366]", // Biblioteca Blue
        iconColor: "text-white",
        highlightText: "text-[#60a5fa] dark:text-[#60a5fa]", // Highlight Blue
        borderColor: "group-hover:border-[#003366]/30",
        glow: "group-hover:shadow-[0_0_30px_-5px_rgba(0,51,102,0.3)]"
      }
    },
    {
      title: "Ubicación Estratégica",
      icon: MapPin,
      content: "Ubicada en la Av. Orinoco con Calle Libertador, somos el corazón cultural de Maturín.",
      highlight: "Av. Orinoco con Calle Libertador",
      colorTheme: {
        iconBg: "bg-[#ffe23b]", // Biblioteca Gold
        iconColor: "text-black",
        highlightText: "text-[#ffe23b] dark:text-[#ffe23b]",
        borderColor: "group-hover:border-[#ffe23b]/30",
        glow: "group-hover:shadow-[0_0_30px_-5px_rgba(255,226,59,0.3)]"
      }
    },
    {
      title: "Dr. Julián Padrón",
      icon: Award,
      content: "En honor al Dr. Julián Padrón, destacado intelectual y educador venezolano.",
      highlight: "Dr. Julián Padrón",
      colorTheme: {
        iconBg: "bg-[#16a34a]", // Green
        iconColor: "text-white",
        highlightText: "text-[#16a34a] dark:text-[#4ade80]",
        borderColor: "group-hover:border-[#16a34a]/30",
        glow: "group-hover:shadow-[0_0_30px_-5px_rgba(22,163,74,0.3)]"
      }
    },
    {
      title: "Servicio Comunitario",
      icon: Users,
      content: "Más de 55 años sirviendo a estudiantes, investigadores y ciudadanos de todas las edades.",
      highlight: "55 años",
      colorTheme: {
        iconBg: "bg-[#9333ea]", // Purple
        iconColor: "text-white",
        highlightText: "text-[#9333ea] dark:text-[#c084fc]",
        borderColor: "group-hover:border-[#9333ea]/30",
        glow: "group-hover:shadow-[0_0_30px_-5px_rgba(147,51,234,0.3)]"
      }
    }
  ];

  return (
    <main className="flex-1 w-full bg-background min-h-screen">
      {/* Header Section - Matching RoomsPage */}
      <section className="px-6 md:px-12 py-16 md:py-10 text-center relative overflow-hidden">

        <h1 className="font-display text-4xl md:text-5xl mb-4 text-biblioteca-blue dark:text-primary tracking-tight">
          Nuestra <span className="italic text-biblioteca-gold dark:text-highlight-gold">Historia</span>
        </h1>

        <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-8"></div>

        <p className="font-mono text-xs md:text-sm uppercase tracking-[0.2em] text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Más de medio siglo construyendo el futuro a través del conocimiento y la cultura en Maturín
        </p>
      </section>

      {/* Grid Section - Matching RoomsPage Card Style */}
      <section className="px-6 md:px-12 pb-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {historicalMilestones.map((item, index) => (
            <div
              key={index}
              className={`group relative flex flex-col items-center text-center border border-border p-8 bg-card/[0.5] hover:bg-muted/30 transition-all duration-500 overflow-hidden ${item.colorTheme.borderColor} ${item.colorTheme.glow}`}
            >
              <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(#fff_1px,transparent_1px)]"></div>

              <div className={`relative w-16 h-16 mb-6 flex items-center justify-center rounded-full border border-border/10 shadow-lg group-hover:scale-105 transition-all duration-300 ${item.colorTheme.iconBg}`}>
                <item.icon className={`h-7 w-7 stroke-[1.5] ${item.colorTheme.iconColor}`} />
              </div>

              <h3 className="font-display text-lg mb-3 tracking-wide text-foreground font-medium">
                {item.title}
              </h3>

              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                {item.content.split(item.highlight).map((part, i, arr) => (
                  <React.Fragment key={i}>
                    {part}
                    {i < arr.length - 1 && (
                      <span className={`font-bold ${item.colorTheme.highlightText}`}>{item.highlight}</span>
                    )}
                  </React.Fragment>
                ))}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Split Section - Mision/Vision + Image - Connecting styles */}
      <section className="px-6 md:px-12 py-24 bg-muted/10 border-y border-border/50">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

          {/* Text Content - Adapted from SelectedRoomPage style */}
          <div className="space-y-16">
            <div className="relative">
              <h3 className="text-3xl font-display italic text-foreground mb-6">
                Misión
              </h3>
              <div className="h-px w-12 bg-primary mb-6"></div>
              <p className="text-muted-foreground leading-relaxed text-lg font-light">
                Facilitar el acceso universal al conocimiento y la información, promoviendo la lectura, la investigación y el desarrollo cultural de nuestra comunidad.
              </p>
            </div>

            <div className="relative">
              <h3 className="text-3xl font-display italic text-foreground mb-6">
                Visión
              </h3>
              <div className="h-px w-12 bg-biblioteca-gold mb-6"></div>
              <p className="text-muted-foreground leading-relaxed text-lg font-light">
                Ser reconocida como la principal institución de información y cultura del oriente venezolano, adaptándose a las nuevas tecnologías mientras preservamos el valor del saber.
              </p>
            </div>
          </div>

          {/* Image Composition */}
          <div className="relative">
            <div className="absolute inset-0 bg-biblioteca-blue/5 rounded-lg transform translate-x-4 translate-y-4"></div>
            <div className="relative rounded-lg overflow-hidden border border-border shadow-2xl grayscale hover:grayscale-0 transition-all duration-700">
              <img
                src={bibliotecaHistoria}
                alt="Biblioteca Dr. Julián Padrón"
                className="w-full h-auto object-cover aspect-[4/3] hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-60"></div>
              <div className="absolute bottom-0 left-0 p-8">
                <p className="font-display text-2xl text-foreground italic">Dr. Julián Padrón</p>
                <p className="font-mono text-xs text-primary mt-2">ICONO CULTURAL</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Legacy/Quote Section */}
      <section className="py-32 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <BookOpen className="h-8 w-8 text-biblioteca-gold mx-auto mb-8 opacity-80" />
          <blockquote className="font-display text-3xl md:text-5xl font-medium leading-tight text-foreground mb-8">
            "El conocimiento es el único tesoro que crece cuando se comparte"
          </blockquote>
          <p className="text-muted-foreground font-mono text-xs uppercase tracking-widest">
            — Legado Institucional
          </p>

          <div className="mt-12 flex justify-center">
            <ReturnButton />
          </div>
        </div>
      </section>
    </main>
  );
}