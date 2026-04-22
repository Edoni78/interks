import { Hero } from '../components/landing/Hero';
import {
  LandingBuiltForSection,
  LandingExampleCardSection,
  LandingFinalCtaSection,
  LandingHowSection,
  LandingProblemSection,
  LandingRepetitionSection,
  LandingScienceSection,
  LandingSolutionSection,
} from '../components/landing/FlashcardLanding';
import { Footer } from '../components/layout/Footer';
import { Navbar } from '../components/layout/Navbar';

export default function Landing() {
  return (
    <div id="top" className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <LandingProblemSection />
        <LandingSolutionSection />
        <LandingHowSection />
        <LandingScienceSection />
        <LandingExampleCardSection />
        <LandingBuiltForSection />
        <LandingRepetitionSection />
        <LandingFinalCtaSection />
      </main>
      <Footer />
    </div>
  );
}
