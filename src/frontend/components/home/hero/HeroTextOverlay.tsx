'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';

interface HeroTextOverlayProps {
  scrollProgress: number;
  onExploreClick: () => void;
  onAIClick: () => void;
}

export function HeroTextOverlay({ scrollProgress, onExploreClick, onAIClick }: HeroTextOverlayProps) {
  let headlineText = 'Freshness You Can Feel.';
  let subtextText = 'Real fruit. Bold flavor. Zero boring.';

  if (scrollProgress < 0.25) {
    headlineText = 'Freshness Starts Here.';
    subtextText = 'Pure cold-pressed organic ingredients flowing into life.';
  } else if (scrollProgress >= 0.25 && scrollProgress < 0.6) {
    headlineText = 'Made From Nature’s Finest.';
    subtextText = 'No added sugar. No preservatives. 100% cold-pressed vibrancy.';
  } else if (scrollProgress >= 0.6) {
    headlineText = 'Pick Your Flavor.';
    subtextText = 'Velvety mangoes, crisp greens & antioxidant berries crafted for you.';
  }

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 md:p-12 z-20">
      {/* Top Banner Tag */}
      <div className="pt-20 flex justify-center md:justify-start pointer-events-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-md border border-fresh-orange/30 shadow-sm"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-fresh-green animate-ping" />
          <span className="text-xs font-bold text-fresh-charcoal tracking-wide uppercase">
            100% Organic Cold-Pressed Elixirs
          </span>
        </motion.div>
      </div>

      {/* Main Center Typography */}
      <div className="max-w-3xl mx-auto text-center pointer-events-auto space-y-6 my-auto">
        <motion.h1
          key={headlineText}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl sm:text-6xl md:text-7xl font-display font-extrabold text-fresh-charcoal leading-tight tracking-tight"
        >
          {headlineText.split(' ').map((word, idx) =>
            word.toLowerCase().includes('freshness') || word.toLowerCase().includes('flavor') ? (
              <span
                key={idx}
                className="text-transparent bg-clip-text bg-gradient-to-r from-fresh-orange via-amber-500 to-fresh-pink"
              >
                {word}{' '}
              </span>
            ) : (
              word + ' '
            )
          )}
        </motion.h1>

        <motion.p
          key={subtextText}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="text-base sm:text-xl text-fresh-charcoal/80 max-w-xl mx-auto font-medium"
        >
          {subtextText}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
        >
          <button
            onClick={onExploreClick}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-fresh-charcoal text-white font-bold text-sm hover:bg-fresh-orange shadow-lg hover:shadow-glow-orange transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>Explore the Menu</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={onAIClick}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/90 backdrop-blur-md border border-fresh-orange/40 text-fresh-charcoal font-bold text-sm hover:bg-white shadow-sm transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-fresh-orange animate-pulse" />
            <span>Ask FreshSip AI</span>
          </button>
        </motion.div>
      </div>

      {/* Bottom Scroll Progress Indicator */}
      <div className="flex flex-col items-center pb-8 pointer-events-auto">
        <span className="text-[11px] font-bold text-fresh-gray tracking-widest uppercase mb-2">
          Scroll to blend
        </span>
        <div className="w-32 h-1.5 rounded-full bg-gray-200 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-fresh-orange to-fresh-pink transition-all duration-75"
            style={{ width: `${Math.max(5, scrollProgress * 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
