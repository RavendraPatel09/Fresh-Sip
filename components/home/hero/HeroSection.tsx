'use client';

import React, { useRef, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { HeroTextOverlay } from './HeroTextOverlay';
import { useFreshSipStore } from '@/lib/store';

const HeroVideoScrubber = dynamic(() => import('./HeroVideoScrubber'), {
  ssr: false,
});
const HeroCanvas = dynamic(() => import('../3d/HeroCanvas'), {
  ssr: false,
});

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hasVideo, setHasVideo] = useState(false);
  const toggleAI = useFreshSipStore((state) => state.toggleAI);

  useEffect(() => {
    // Check if MP4 scroll-to-blend video exists in public directory
    fetch('/freshsip-blend-hero.mp4', { method: 'HEAD' })
      .then((res) => {
        if (res.ok) setHasVideo(true);
      })
      .catch(() => setHasVideo(false));
  }, []);

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
        {/* Scroll-to-Blend Visual Background */}
        <div className="absolute inset-0">
          {hasVideo ? (
            <HeroVideoScrubber scrollProgress={scrollProgress} />
          ) : (
            <HeroCanvas scrollProgress={scrollProgress} accentColor="#FF9F1C" />
          )}
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
