import { navLinks } from "@/data/radio-data";

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
      <path d="M7.2 2h9.6A5.2 5.2 0 0 1 22 7.2v9.6a5.2 5.2 0 0 1-5.2 5.2H7.2A5.2 5.2 0 0 1 2 16.8V7.2A5.2 5.2 0 0 1 7.2 2zm0 1.8A3.4 3.4 0 0 0 3.8 7.2v9.6a3.4 3.4 0 0 0 3.4 3.4h9.6a3.4 3.4 0 0 0 3.4-3.4V7.2a3.4 3.4 0 0 0-3.4-3.4H7.2zm10.4 1.4a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 1.8A3.2 3.2 0 1 0 12 15.2 3.2 3.2 0 0 0 12 8.8z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
      <path d="M18.9 2H22l-6.77 7.75L23 22h-6.1l-4.77-6.22L6.68 22H3.56l7.24-8.28L1 2h6.25l4.3 5.69L18.9 2zm-1.06 18h1.69L6.35 3.9H4.52z" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
      <path d="M21.6 7.2a2.8 2.8 0 0 0-2-2C17.9 4.7 12 4.7 12 4.7s-5.9 0-7.6.5a2.8 2.8 0 0 0-2 2A29.8 29.8 0 0 0 2 12a29.8 29.8 0 0 0 .4 4.8 2.8 2.8 0 0 0 2 2c1.7.5 7.6.5 7.6.5s5.9 0 7.6-.5a2.8 2.8 0 0 0 2-2A29.8 29.8 0 0 0 22 12a29.8 29.8 0 0 0-.4-4.8zM10 15.6V8.4L16 12l-6 3.6z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="bg-black px-4 py-12 text-white">
      <div className="section-shell grid gap-8 md:grid-cols-4">
        <div>
          <h3 className="text-2xl font-extrabold">
            RADIO <span className="text-brand-accent">LIBRE</span>
          </h3>
          <p className="mt-3 max-w-sm text-xs text-white/65">
            Radio online y local con una propuesta editorial actual, entretenimiento y conexion
            real con la audiencia.
          </p>
          <div className="mt-4 flex gap-2">
            <a href="#" className="rounded-full border border-white/20 p-2 hover:text-brand-accent">
              <InstagramIcon />
            </a>
            <a href="#" className="rounded-full border border-white/20 p-2 hover:text-brand-accent">
              <XIcon />
            </a>
            <a href="#" className="rounded-full border border-white/20 p-2 hover:text-brand-accent">
              <YoutubeIcon />
            </a>
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/75">
            Links rapidos
          </p>
          <div className="mt-4 grid gap-2 text-xs text-white/70">
            {navLinks.map((link) => (
              <a key={link.label} href={link.href} className="transition hover:text-brand-accent">
                {link.label}
              </a>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/75">Programas</p>
          <div className="mt-4 grid gap-2 text-xs text-white/70">
            <p>Amanecer Libre</p>
            <p>El Despertador Libre</p>
            <p>La Manana en Libre</p>
            <p>Tarde Libre</p>
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/75">Newsletter</p>
          <p className="mt-4 text-xs text-white/70">Suscribete y recibe novedades.</p>
          <div className="mt-3 flex gap-2">
            <input
              type="email"
              placeholder="Tu correo"
              className="w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-xs outline-none placeholder:text-white/45 focus:border-brand-accent"
            />
            <button
              type="button"
              className="rounded-md bg-brand-accent px-3 py-2 text-[10px] font-bold uppercase text-brand-night"
            >
              Enviar
            </button>
          </div>
        </div>
      </div>
      <div className="section-shell mt-8 border-t border-white/10 pt-5 text-[10px] text-white/45">
        © {new Date().getFullYear()} Radio Libre. Todos los derechos reservados.
      </div>
    </footer>
  );
}
