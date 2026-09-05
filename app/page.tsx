import { HeroSection } from '@/components/hero/HeroSection';
import { Showcase3DSection } from '@/components/sections/Showcase3DSection';
import { OffersSection } from '@/components/sections/OffersSection';
import { HealthBenefits } from '@/components/sections/HealthBenefits';
import { MenuSection } from '@/components/menu/MenuSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { LoyaltySection } from '@/components/loyalty/LoyaltySection';
import { GallerySection } from '@/components/sections/GallerySection';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { ContactSection } from '@/components/sections/ContactSection';

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
