import { HeroSection } from '@/components/hero/HeroSection';
import { Showcase3DSection } from '@/components/showcase/Showcase3DSection';
import { OffersSection } from '@/components/content/OffersSection';
import { HealthBenefits } from '@/components/content/HealthBenefits';
import { MenuSection } from '@/components/menu/MenuSection';
import { AboutSection } from '@/components/content/AboutSection';
import { LoyaltySection } from '@/components/loyalty/LoyaltySection';
import { GallerySection } from '@/components/content/GallerySection';
import { TestimonialsSection } from '@/components/content/TestimonialsSection';
import { ContactSection } from '@/components/content/ContactSection';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-fresh-bg">
      <HeroSection />
      <Showcase3DSection />
      <OffersSection />
      <HealthBenefits />
      <MenuSection />
      <AboutSection />
      <LoyaltySection />
      <GallerySection />
      <TestimonialsSection />
      <ContactSection />
    </main>
  );
}
