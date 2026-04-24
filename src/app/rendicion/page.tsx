"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { getAccountability } from "@/lib/cms";
import type { AccountabilityItem } from "@/types/cms";
import { FileText, Image as ImageIcon, Music, Video, Calendar, ChevronRight, X, Download, ExternalLink } from "lucide-react";

export default function RendicionPage() {
  const [items, setItems] = useState<AccountabilityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState<{ title: string; type: string; urls: string[] } | null>(null);

  useEffect(() => {
    getAccountability().then(setItems).finally(() => setLoading(false));
  }, []);

  // Agrupar por año
  const years = Array.from(new Set(items.map((i) => i.year))).sort((a, b) => b.localeCompare(a));

  const getFileName = (url: string) => {
    const parts = url.split("/");
    const name = parts[parts.length - 1];
    // Quitar el UUID del principio (ej: UUID-nombre.ext)
    return name.split("-").slice(1).join("-") || name;
  };

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      {/* Encabezado Estilo Documento */}
      <div className="pt-32 pb-10 px-4">
        <div className="max-w-4xl mx-auto text-center border-b-2 border-brand-night pb-10">
          <h1 className="text-3xl md:text-5xl font-black text-brand-night uppercase tracking-tighter">
            Rendicion de Cuentas Año 2025
          </h1>
          <p className="mt-4 text-zinc-500 font-bold uppercase tracking-widest text-sm">
            Radio Libre 93.9 FM - Babahoyo, Ecuador
          </p>
        </div>
      </div>

      <section className="pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-accent border-t-transparent" />
            </div>
          ) : (
            <div className="space-y-16">
              {[0, 1, 2, 3].map((phaseNum) => {
                const phaseEntries = items.filter((i) => i.year === "2025" && i.phase === phaseNum);
                
                const defaultTitles = 
                  phaseNum === 0 ? [
                    "1. Designación al proceso de Rendición de cuentas", 
                    "2. Cronograma de Trabajo"
                  ] :
                  phaseNum === 1 ? [
                    "Informe preliminar 2025", "Atención directa a la comunidad año 2025", "Aprobación del Informe", 
                    "Certificado emitido por el IESS", "Parrilla de Programación 2025", "Código Deontológico", 
                    "Convenios de Cooperación Interinstitucional 2025", "Licencia Soprofon", 
                    "Procesos de contratación 2025", "Estado Financieros año 2025"
                  ] :
                  phaseNum === 2 ? [
                    "Convocatoria a la deliberación Pública", "Registro de llamadas telefónicas", "Aporte de la Ciudadanía", 
                    "Foto 1", "Foto 2", "Foto 3", "Foto 4", "Foto 5"
                  ] :
                  [
                    "1. Informe Final de Rendición de cuentas 2025", 
                    "AUDIO RENDICION DE CUENTAS", 
                    "VIDEO RENDICION DE CUENTAS"
                  ];

                return (
                  <div key={phaseNum} className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <h2 className="text-2xl font-black text-white bg-brand-night inline-block px-6 py-2 mb-8 skew-x-[-10deg]">
                      FASE {phaseNum}
                    </h2>
                    
                    <div className="grid gap-2">
                      {defaultTitles.map((title, tIdx) => {
                        // Buscar si existe un archivo con este nombre (o que contenga el nombre)
                        const file = phaseEntries.flatMap(e => e.files || []).find(f => 
                          f.name.toLowerCase().includes(title.toLowerCase().replace(/^\d+\.\s*/, ""))
                        );

                        return (
                          <div key={tIdx} className="group">
                            {file ? (
                              <a 
                                href={file.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-4 rounded-xl border border-transparent hover:border-brand-accent hover:bg-zinc-50 transition-all"
                              >
                                <div className="flex items-center gap-4">
                                  <div className="h-2 w-2 rounded-full bg-brand-accent" />
                                  <span className="text-lg font-bold text-brand-night group-hover:text-brand-ink underline decoration-brand-accent/30 decoration-2 underline-offset-4">
                                    {title}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-zinc-400 group-hover:text-brand-night">
                                  <span className="text-[10px] font-black uppercase tracking-widest">Descargar</span>
                                  <Download size={18} />
                                </div>
                              </a>
                            ) : (
                              <div className="flex items-center justify-between p-4 rounded-xl border border-transparent opacity-40">
                                <div className="flex items-center gap-4">
                                  <div className="h-2 w-2 rounded-full bg-zinc-300" />
                                  <span className="text-lg font-medium text-zinc-600">
                                    {title}
                                  </span>
                                </div>
                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Pendiente</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
