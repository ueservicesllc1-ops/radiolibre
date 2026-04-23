"use client";

import { useEffect, useState } from "react";
import { FaPhoneAlt } from "react-icons/fa";
import { SiFacebook, SiInstagram, SiTiktok, SiYoutube } from "react-icons/si";
import { defaultSocialLinks, getSocialLinks } from "@/lib/cms";
import type { SocialLinks } from "@/types/cms";

export function SocialHeroButtons() {
  const [links, setLinks] = useState<SocialLinks>(defaultSocialLinks);

  useEffect(() => {
    getSocialLinks().then(setLinks).catch(() => setLinks(defaultSocialLinks));
  }, []);

  return (
    <div className="absolute bottom-6 right-6 z-20 flex items-center gap-2 sm:bottom-8 sm:right-8">
      <a
        href={links.facebook}
        target="_blank"
        rel="noreferrer"
        aria-label="Facebook"
        className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/35 bg-black/45 text-white transition hover:border-brand-accent hover:text-brand-accent"
      >
        <SiFacebook size={18} />
      </a>
      <a
        href={links.instagram}
        target="_blank"
        rel="noreferrer"
        aria-label="Instagram"
        className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/35 bg-black/45 text-white transition hover:border-brand-accent hover:text-brand-accent"
      >
        <SiInstagram size={18} />
      </a>
      <a
        href={links.youtube}
        target="_blank"
        rel="noreferrer"
        aria-label="YouTube"
        className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/35 bg-black/45 text-white transition hover:border-brand-accent hover:text-brand-accent"
      >
        <SiYoutube size={18} />
      </a>
      <a
        href={links.tiktok}
        target="_blank"
        rel="noreferrer"
        aria-label="TikTok"
        className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/35 bg-black/45 text-white transition hover:border-brand-accent hover:text-brand-accent"
      >
        <SiTiktok size={18} />
      </a>
      <a
        href={`tel:${links.phone}`}
        aria-label="Llamar a Radio Libre"
        className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/35 bg-black/45 text-white transition hover:border-brand-accent hover:text-brand-accent"
      >
        <FaPhoneAlt size={18} />
      </a>
    </div>
  );
}
