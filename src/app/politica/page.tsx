import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function PoliticaPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-zinc-50 pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 md:p-16 shadow-sm border border-zinc-100">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-brand-accent mb-4">Privacidad</p>
          <h1 className="text-4xl md:text-5xl font-black text-brand-ink mb-10 leading-tight">
            Política de <span className="text-brand-accent">Privacidad</span>
          </h1>

          <div className="prose prose-zinc max-w-none text-zinc-600 space-y-8">
            <section>
              <h2 className="text-xl font-bold text-brand-ink mb-4 uppercase tracking-tight">1. Recolección de Información</h2>
              <p>
                Radio Libre 93.9FM recolecta información mínima necesaria para mejorar su experiencia de usuario. Esto incluye datos analíticos anónimos (como el tipo de navegador y país de acceso) y cualquier información que usted proporcione voluntariamente a través de nuestros formularios de contacto o participación en programas.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-brand-ink mb-4 uppercase tracking-tight">2. Uso de la Información</h2>
              <p>
                Utilizamos la información recolectada para:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Personalizar su experiencia en nuestro sitio web.</li>
                <li>Mejorar nuestro servicio de streaming y contenido.</li>
                <li>Responder a sus consultas o mensajes de contacto.</li>
                <li>Enviar boletines informativos si usted se ha suscrito.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-brand-ink mb-4 uppercase tracking-tight">3. Protección de Datos</h2>
              <p>
                Implementamos una variedad de medidas de seguridad para mantener la seguridad de su información personal. Sus datos no serán vendidos, intercambiados ni transferidos a ninguna otra empresa sin su consentimiento.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-brand-ink mb-4 uppercase tracking-tight">4. Uso de Cookies</h2>
              <p>
                Utilizamos cookies para entender y guardar sus preferencias para futuras visitas y recopilar datos agregados sobre el tráfico y la interacción del sitio para ofrecer mejores experiencias y herramientas en el futuro.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-brand-ink mb-4 uppercase tracking-tight">5. Derechos del Usuario</h2>
              <p>
                De acuerdo con las leyes de protección de datos, usted tiene derecho a acceder, rectificar o eliminar sus datos personales de nuestra base de datos en cualquier momento. Puede contactarnos para cualquier solicitud relacionada con su privacidad.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-brand-ink mb-4 uppercase tracking-tight">6. Consentimiento</h2>
              <p>
                Al utilizar nuestro sitio, usted acepta nuestra política de privacidad.
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
