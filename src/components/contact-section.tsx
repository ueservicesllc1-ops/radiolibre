"use client";

import { useState } from "react";
import { Send, CheckCircle2, AlertCircle, Phone, Mail, MapPin } from "lucide-react";
import { saveContactMessage } from "@/lib/cms";

export function ContactSection() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await saveContactMessage(form);
      setSuccess(true);
      setForm({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError("No se pudo enviar el mensaje. Por favor intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="contacto" className="bg-zinc-50 px-4 py-24">
      <div className="section-shell">
        <div className="grid gap-16 lg:grid-cols-2">
          {/* Info Side */}
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-brand-accent mb-4">Contacto</p>
            <h2 className="text-4xl md:text-5xl font-black text-brand-ink uppercase leading-none mb-8">
              Ponte en <span className="text-brand-accent">Contacto</span>
            </h2>
            <p className="text-zinc-600 mb-12 max-w-md">
              ¿Tienes una denuncia, una sugerencia o quieres anunciar con nosotros? Envíanos un mensaje y te responderemos lo antes posible.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-brand-accent/10 p-4 text-brand-accent">
                  <Phone size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">Teléfono</p>
                  <p className="font-bold text-brand-ink">+593 98 600 1315</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-brand-accent/10 p-4 text-brand-accent">
                  <Mail size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">Email</p>
                  <p className="font-bold text-brand-ink">radiolibre93.9@hotmail.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-brand-accent/10 p-4 text-brand-accent">
                  <MapPin size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">Ubicación</p>
                  <p className="font-bold text-brand-ink">Flores 0203 e/ G. Barona y Malecón</p>
                  <p className="text-sm text-zinc-500">Babahoyo, Ecuador</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="relative">
            <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 md:p-10 rounded-3xl shadow-xl shadow-zinc-200/50 border border-zinc-100 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Nombre</label>
                  <input
                    required
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 text-sm outline-none focus:border-brand-accent transition"
                    placeholder="Tu nombre"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Email</label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 text-sm outline-none focus:border-brand-accent transition"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Asunto</label>
                <input
                  required
                  type="text"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 text-sm outline-none focus:border-brand-accent transition"
                  placeholder="¿En qué podemos ayudarte?"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Mensaje</label>
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 text-sm outline-none focus:border-brand-accent transition resize-none"
                  placeholder="Escribe tu mensaje aquí..."
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-600 text-sm font-medium animate-in fade-in slide-in-from-top-1">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              {success && (
                <div className="flex items-center gap-2 text-green-600 text-sm font-bold animate-in fade-in slide-in-from-top-1">
                  <CheckCircle2 size={16} />
                  ¡Mensaje enviado con éxito!
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand-night py-4 font-black uppercase tracking-widest text-brand-accent transition hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:hover:scale-100"
              >
                {loading ? "Enviando..." : "Enviar Mensaje"}
                {!loading && <Send size={18} />}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
