import { AboutSection } from "@/components/about-section";
import { ManualNewsSection } from "@/components/manual-news-section";
import { CTASection } from "@/components/cta-section";
import { Footer } from "@/components/footer";
import { HomeGalleryCarousel } from "@/components/home-gallery-carousel";
import { Hero } from "@/components/hero";
import { LivePlayer } from "@/components/live-player";
import { Navbar } from "@/components/navbar";
import { NewsSection } from "@/components/news-section";
import { ProgrammingSection } from "@/components/programming-section";
import { StatsSection } from "@/components/stats-section";
import { TalentNewsSection } from "@/components/talent-news-section";
import { ContactSection } from "@/components/contact-section";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="overflow-x-hidden bg-white">
        <Hero />
        <LivePlayer />
        <AboutSection />
        <ManualNewsSection />
        <ProgrammingSection />
        <TalentNewsSection />
        <NewsSection />
        <HomeGalleryCarousel />
        <StatsSection />
        <CTASection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
