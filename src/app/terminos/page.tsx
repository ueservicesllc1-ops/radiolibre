import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function TerminosPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-zinc-50 pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 md:p-16 shadow-sm border border-zinc-100">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-brand-accent mb-4">Legal</p>
          <h1 className="text-4xl md:text-5xl font-black text-brand-ink mb-10 leading-tight">
            Términos y <span className="text-brand-accent">Condiciones</span>
          </h1>

          <div className="prose prose-zinc max-w-none text-zinc-600 space-y-8">
            <section>
              <h2 className="text-xl font-bold text-brand-ink mb-4 uppercase tracking-tight">1. Aceptación de los Términos</h2>
              <p>
                Al acceder y utilizar el sitio web de Radio Libre 93.9FM, usted acepta cumplir con estos términos y condiciones. Si no está de acuerdo con alguna parte de estos términos, le rogamos que no utilice nuestro sitio.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-brand-ink mb-4 uppercase tracking-tight">2. Propiedad Intelectual</h2>
              <p>
                Todo el contenido de este sitio, incluyendo textos, gráficos, logotipos, audios y software, es propiedad de Radio Libre o de sus proveedores de contenido y está protegido por las leyes de propiedad intelectual internacionales y de Ecuador.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-brand-ink mb-4 uppercase tracking-tight">3. Uso del Sitio</h2>
              <p>
                Este sitio es para su uso personal y no comercial. No puede modificar, copiar, distribuir, transmitir, mostrar, realizar, reproducir, publicar, licenciar, crear trabajos derivados, transferir o vender cualquier información obtenida de este sitio sin el consentimiento previo por escrito.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-brand-ink mb-4 uppercase tracking-tight">4. Limitación de Responsabilidad</h2>
              <p>
                Radio Libre no garantiza que el sitio funcione sin interrupciones o errores. La radio no se hace responsable por daños directos o indirectos derivados del uso o la imposibilidad de uso de este sitio web.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-brand-ink mb-4 uppercase tracking-tight">5. Enlaces a Terceros</h2>
              <p>
                Nuestro sitio puede contener enlaces a sitios web de terceros. Estos enlaces se proporcionan únicamente para su conveniencia. No tenemos control sobre el contenido de dichos sitios y no aceptamos ninguna responsabilidad por ellos.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-brand-ink mb-4 uppercase tracking-tight">6. Modificaciones</h2>
              <p>
                Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en vigor inmediatamente después de su publicación en el sitio web.
              </p>
            </section>

            <section className="pt-10 border-t border-zinc-100 mt-10 text-xs italic">
              Última actualización: Abril 2026. Radio Libre 93.9FM, Babahoyo, Ecuador.
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
