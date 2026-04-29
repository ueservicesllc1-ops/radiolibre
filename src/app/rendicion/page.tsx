"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { defaultAccountabilityPhaseTitles, getAccountability, getAccountabilityPhaseTitles } from "@/lib/cms";
import type { AccountabilityItem, AccountabilityPhaseTitles } from "@/types/cms";
import { Download } from "lucide-react";

export default function RendicionPage() {
  const [items, setItems] = useState<AccountabilityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [phaseTitles, setPhaseTitles] = useState<AccountabilityPhaseTitles>(defaultAccountabilityPhaseTitles);

  useEffect(() => {
    Promise.all([getAccountability(), getAccountabilityPhaseTitles()])
      .then(([accountabilityItems, customTitles]) => {
        setItems(accountabilityItems);
        setPhaseTitles(customTitles);
      })
      .finally(() => setLoading(false));
  }, []);

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
                
                const defaultTitles = phaseTitles[phaseNum] || [];

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
