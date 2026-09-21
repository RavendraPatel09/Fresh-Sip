import { HeroSection } from '@/frontend/components/home/hero/HeroSection';
import { Showcase3DSection } from '@/frontend/components/home/showcase/Showcase3DSection';
import { OffersSection } from '@/frontend/components/home/sections/OffersSection';
import { HealthBenefits } from '@/frontend/components/home/sections/HealthBenefits';
import { MenuSection } from '@/frontend/components/features/menu/MenuSection';
import { AboutSection } from '@/frontend/components/home/sections/AboutSection';
import { LoyaltySection } from '@/frontend/components/home/sections/LoyaltySection';
import { GallerySection } from '@/frontend/components/home/sections/GallerySection';
import { TestimonialsSection } from '@/frontend/components/home/sections/TestimonialsSection';
import { ContactSection } from '@/frontend/components/home/sections/ContactSection';

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
