import Image from "next/image";
import { SectionTitle } from "@/components/section-title";
import { hosts } from "@/data/radio-data";

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

export function HostsSection() {
  return (
    <section id="locutores" className="bg-zinc-100 px-4 py-14">
      <div className="section-shell">
        <SectionTitle
          eyebrow="Nuestros"
          title="Locutores"
          description="Voces profesionales que conectan con tu audiencia cada dia."
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {hosts.map((host) => (
            <article
              key={host.id}
              className="group overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition hover:border-brand-accent/60"
            >
              <div className="relative h-36 overflow-hidden">
                <Image
                  src={host.avatar}
                  alt={host.name}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
              </div>
              <div className="p-4">
                <h3 className="text-sm font-extrabold text-brand-ink">{host.name}</h3>
                <p className="mt-1 text-[11px] text-brand-ink/60">{host.role}</p>
                <div className="mt-3 flex gap-2 text-zinc-500">
                  {host.socials.instagram ? (
                    <a
                      href={host.socials.instagram}
                      className="rounded-full border border-zinc-300 p-1.5 transition hover:border-brand-accent hover:text-brand-accent"
                      aria-label={`Instagram de ${host.name}`}
                    >
                      <InstagramIcon />
                    </a>
                  ) : null}
                  {host.socials.x ? (
                    <a
                      href={host.socials.x}
                      className="rounded-full border border-zinc-300 p-1.5 transition hover:border-brand-accent hover:text-brand-accent"
                      aria-label={`X de ${host.name}`}
                    >
                      <XIcon />
                    </a>
                  ) : null}
                  {host.socials.youtube ? (
                    <a
                      href={host.socials.youtube}
                      className="rounded-full border border-zinc-300 p-1.5 transition hover:border-brand-accent hover:text-brand-accent"
                      aria-label={`YouTube de ${host.name}`}
                    >
                      <YoutubeIcon />
                    </a>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
