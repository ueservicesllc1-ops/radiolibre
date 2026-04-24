"use client";

import { motion } from "framer-motion";
import { stats } from "@/data/radio-data";

export function StatsSection() {
  return (
    <section className="relative overflow-hidden bg-black px-4 py-8 text-white">
      <div className="pointer-events-none absolute inset-0 soft-grid opacity-20" />
      <div className="section-shell relative grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((item, index) => (
          <motion.article
            key={item.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08 }}
            className="rounded-lg border border-white/10 bg-white/[0.03] p-4 text-center"
          >
            <p className="text-3xl font-extrabold text-brand-accent">{item.value}</p>
            <p className="mt-2 text-[11px] uppercase tracking-[0.17em] text-white/70">{item.label}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
