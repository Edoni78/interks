import { CTASection } from '../components/landing/CTASection';
import { Features } from '../components/landing/Features';
import { Hero } from '../components/landing/Hero';
import { HowItWorks } from '../components/landing/HowItWorks';
import { LevelsSection } from '../components/landing/LevelsSection';
import { StatsStrip } from '../components/landing/StatsStrip';
import { TracksSection } from '../components/landing/TracksSection';
import { Footer } from '../components/layout/Footer';
import { Navbar } from '../components/layout/Navbar';

export default function Landing() {
  return (
    <div id="top" className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <StatsStrip />
        <Features />
        <LevelsSection />
        <TracksSection />
        <HowItWorks />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
