"use client";

import { useState } from "react";
import { AudioProvider } from "@/context/audio-context";
import { AppHeader } from "@/components/app/app-header";
import { AppBottomNav } from "@/components/app/app-bottom-nav";
import { AppMiniPlayer } from "@/components/app/app-mini-player";
import { AppMoreDrawer } from "@/components/app/app-more-drawer";

export function AppClientShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <AudioProvider>
      <div className="min-h-screen bg-[#050507] text-white flex justify-center selection:bg-brand-accent selection:text-brand-night">
        {/* Mobile Viewport Frame (Centered on Desktop, Full Width on Mobile) */}
        <div className="w-full max-w-md min-h-screen bg-[#0a0a0d] text-white flex flex-col relative shadow-[0_0_100px_rgba(0,0,0,0.9)] border-x border-white/5 overflow-x-hidden">
          {/* Header */}
          <AppHeader onOpenMenu={() => setIsMenuOpen(true)} />

          {/* Main Content */}
          <main className="flex-1 flex flex-col pb-36">
            {children}
          </main>

          {/* Persistent Mini Player Bar */}
          <AppMiniPlayer />

          {/* Persistent Fixed Bottom Navigation */}
          <AppBottomNav
            onOpenMenu={() => setIsMenuOpen((prev) => !prev)}
            isMenuOpen={isMenuOpen}
          />

          {/* More Options Drawer Modal */}
          <AppMoreDrawer
            isOpen={isMenuOpen}
            onClose={() => setIsMenuOpen(false)}
          />
        </div>
      </div>
    </AudioProvider>
  );
}
