"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Trophy, Flame, ThumbsUp, Sparkles, Check } from "lucide-react";
import { getRanking, defaultRanking, voteRankingSong } from "@/lib/cms";
import type { RankingSong } from "@/types/cms";

export default function AppRankingPage() {
  const [ranking, setRanking] = useState<RankingSong[]>([]);
  const [loading, setLoading] = useState(true);
  const [votedIds, setVotedIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    getRanking()
      .then(setRanking)
      .catch(() => setRanking(defaultRanking))
      .finally(() => setLoading(false));

    // Load local voted state
    try {
      const saved = localStorage.getItem("radiolibre_votes");
      if (saved) setVotedIds(JSON.parse(saved));
    } catch {}
  }, []);

  async function handleVote(songId: string) {
    if (votedIds[songId]) return;

    // Optimistic UI update
    setRanking((prev) =>
      prev.map((s) => (s.id === songId ? { ...s, votes: (s.votes || 0) + 1 } : s))
    );

    const nextVoted = { ...votedIds, [songId]: true };
    setVotedIds(nextVoted);
    try {
      localStorage.setItem("radiolibre_votes", JSON.stringify(nextVoted));
      await voteRankingSong(songId);
    } catch {}
  }

  return (
    <div className="flex flex-col px-4 pt-3 pb-8">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-5">
        <Link
          href="/app"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 border border-white/10 text-zinc-300 hover:text-white transition active:scale-95"
          aria-label="Regresar"
        >
          <ChevronLeft size={20} />
        </Link>

        <div className="text-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-brand-accent">
            Top Musical
          </p>
          <h1 className="text-base font-black text-white tracking-tight uppercase">
            Ranking de la Semana
          </h1>
        </div>

        <div className="w-10" />
      </div>

      {/* Hero Badge Banner */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-500/10 via-[#181820] to-[#121215] border border-amber-500/20 mb-6 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-brand-accent bg-brand-accent/10 px-2 py-0.5 rounded-full border border-brand-accent/20">
            Top 10 Oficial
          </span>
          <h2 className="text-base font-black text-white uppercase mt-1">
            Los Éxitos Más Escuchados
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Vota por tu canción favorita para mantenerla en el puesto #1.
          </p>
        </div>
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-accent text-brand-night shadow-lg shadow-brand-accent/30">
          <Trophy size={24} />
        </div>
      </div>

      {/* Songs List */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-20 rounded-3xl bg-zinc-900 animate-pulse border border-white/5" />
          ))}
        </div>
      ) : ranking.length === 0 ? (
        <div className="p-10 text-center rounded-3xl bg-[#141418] border border-dashed border-white/10">
          <p className="text-sm font-bold text-zinc-400">No hay canciones en el ranking por ahora.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {ranking.map((song) => {
            const isFirst = song.position === 1;
            const isSecond = song.position === 2;
            const isThird = song.position === 3;
            const hasVoted = Boolean(votedIds[song.id]);

            return (
              <div
                key={song.id}
                className={`p-3.5 rounded-3xl border transition flex items-center justify-between gap-3 ${
                  isFirst
                    ? "bg-gradient-to-r from-yellow-500/10 to-[#141418] border-brand-accent/40 shadow-lg shadow-brand-accent/5"
                    : "bg-[#141418] border-white/5 hover:border-white/15"
                }`}
              >
                {/* Left: Position Badge & Album Cover */}
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-sm font-black shadow-md ${
                      isFirst
                        ? "bg-gradient-to-br from-yellow-400 to-amber-500 text-black shadow-yellow-500/30"
                        : isSecond
                        ? "bg-gradient-to-br from-zinc-300 to-zinc-500 text-black"
                        : isThird
                        ? "bg-gradient-to-br from-amber-700 to-amber-900 text-white"
                        : "bg-white/5 text-zinc-400 border border-white/10"
                    }`}
                  >
                    #{song.position}
                  </div>

                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-zinc-900 border border-white/10 shadow-sm">
                    <Image
                      src={song.coverUrl || defaultRanking[0]?.coverUrl || "/icon.png"}
                      alt={song.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-sm font-black text-white truncate leading-snug">
                      {song.title}
                    </h3>
                    <p className="text-xs font-semibold text-zinc-400 truncate">
                      {song.artist}
                    </p>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-brand-accent mt-0.5">
                      <Flame size={12} />
                      <span>{song.votes || 100} votos</span>
                    </div>
                  </div>
                </div>

                {/* Right: Vote Button */}
                <button
                  type="button"
                  onClick={() => handleVote(song.id)}
                  disabled={hasVoted}
                  className={`flex h-10 px-3.5 items-center gap-1.5 rounded-xl font-bold text-xs uppercase tracking-wider transition active:scale-95 shrink-0 ${
                    hasVoted
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default"
                      : "bg-brand-accent text-brand-night hover:bg-yellow-400 shadow-md shadow-brand-accent/20"
                  }`}
                >
                  {hasVoted ? (
                    <>
                      <Check size={14} />
                      <span>Votado</span>
                    </>
                  ) : (
                    <>
                      <ThumbsUp size={14} />
                      <span>Votar</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
