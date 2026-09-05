'use client';

import React, { useRef, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { HeroTextOverlay } from './HeroTextOverlay';
import { useFreshSipStore } from '@/lib/store';

// Dynamic import for Three.js canvas to optimize SSR
const HeroCanvas = dynamic(() => import('../3d/HeroCanvas'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center text-fresh-gray text-sm">
      Loading 3D Commercial Experience...
    </div>
  ),
});

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const toggleAI = useFreshSipStore((state) => state.toggleAI);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalScrollable = rect.height - windowHeight;
      const currentScroll = -rect.top;

      if (totalScrollable > 0) {
        const progress = Math.min(1, Math.max(0, currentScroll / totalScrollable));
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToMenu = () => {
    const menuElement = document.getElementById('menu');
    if (menuElement) {
      menuElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" ref={containerRef} className="relative h-[380vh] w-full bg-fresh-bg">
      {/* Sticky 100vh Viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* 3D Canvas Background */}
        <div className="absolute inset-0">
          <HeroCanvas scrollProgress={scrollProgress} accentColor="#FF9F1C" />
        </div>

        {/* Cinematic Foreground Typography */}
        <HeroTextOverlay
          scrollProgress={scrollProgress}
          onExploreClick={scrollToMenu}
          onAIClick={() => toggleAI(true)}
        />
      </div>
    </section>
  );
}
