import Image from "next/image";
import { hosts } from "@/data/radio-data";

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-hidden="true">
      <path d="M7.2 2h9.6A5.2 5.2 0 0 1 22 7.2v9.6a5.2 5.2 0 0 1-5.2 5.2H7.2A5.2 5.2 0 0 1 2 16.8V7.2A5.2 5.2 0 0 1 7.2 2zm0 1.8A3.4 3.4 0 0 0 3.8 7.2v9.6a3.4 3.4 0 0 0 3.4 3.4h9.6a3.4 3.4 0 0 0 3.4-3.4V7.2a3.4 3.4 0 0 0-3.4-3.4H7.2zm10.4 1.4a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 1.8A3.2 3.2 0 1 0 12 15.2 3.2 3.2 0 0 0 12 8.8z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-hidden="true">
      <path d="M18.9 2H22l-6.77 7.75L23 22h-6.1l-4.77-6.22L6.68 22H3.56l7.24-8.28L1 2h6.25l4.3 5.69L18.9 2zm-1.06 18h1.69L6.35 3.9H4.52z" />
    </svg>
  );
}

export function TalentNewsSection() {
  return (
    <section className="bg-zinc-100 px-4 py-14">
      <div className="section-shell">
        <div id="locutores">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent">Nuestros</p>
          <h2 className="mt-2 text-4xl font-extrabold uppercase leading-none text-brand-ink">
            Locutores
          </h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {hosts.map((host) => (
              <article key={host.id} className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
                <div className="relative h-40">
                  <Image src={host.avatar} alt={host.name} fill className="object-cover" />
                </div>
                <div className="p-3">
                  <p className="text-xs font-bold text-brand-ink">{host.name}</p>
                  <p className="mt-1 text-[10px] text-zinc-500">{host.role}</p>
                  <div className="mt-2 flex gap-1.5 text-zinc-500">
                    <span className="rounded-full border border-zinc-300 p-1">
                      <InstagramIcon />
                    </span>
                    <span className="rounded-full border border-zinc-300 p-1">
                      <XIcon />
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
