import { HeroSection } from '@/components/home/hero/HeroSection';
import { Showcase3DSection } from '@/components/home/showcase/Showcase3DSection';
import { OffersSection } from '@/components/home/sections/OffersSection';
import { HealthBenefits } from '@/components/home/sections/HealthBenefits';
import { MenuSection } from '@/components/features/menu/MenuSection';
import { AboutSection } from '@/components/home/sections/AboutSection';
import { LoyaltySection } from '@/components/home/sections/LoyaltySection';
import { GallerySection } from '@/components/home/sections/GallerySection';
import { TestimonialsSection } from '@/components/home/sections/TestimonialsSection';
import { ContactSection } from '@/components/home/sections/ContactSection';

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
