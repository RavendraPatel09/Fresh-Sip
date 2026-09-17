'use client';

import React from 'react';
import Image from 'next/image';
import { Leaf, ShieldCheck, Heart, Sparkles, RefreshCw } from 'lucide-react';

export function AboutSection() {
  return (
    <section id="about" className="py-24 bg-fresh-softBg relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column Image Collage */}
          <div className="lg:col-span-6 relative">
            <div className="relative w-full h-[420px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <Image
                src="/brand-story-real.jpg"
                alt="Fresh Fruit Cold Pressing"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Right Column Brand Story */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-fresh-orange">
              Our Brand Story
            </span>

            <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-fresh-charcoal tracking-tight">
              From Fresh Fruit to Your Favorite Sip.
            </h2>

            <p className="text-fresh-gray text-base leading-relaxed">
              Founded in 2024, FreshSip set out to revolutionize the modern beverage industry. We believe that true nutrition requires zero compromise: no concentrates, no artificial sweeteners, and zero pasteurization heat damage.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <RefreshCw className="w-5 h-5 text-fresh-orange shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs text-fresh-charcoal">Cold-Pressed Daily</h4>
                  <p className="text-[11px] text-fresh-gray mt-0.5">Hydraulic pressing retains 98% of natural vitamins & live enzymes.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <ShieldCheck className="w-5 h-5 text-fresh-green shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs text-fresh-charcoal">Zero Added Sugar</h4>
                  <p className="text-[11px] text-fresh-gray mt-0.5">Sweetened strictly by sun-ripened Alphonso mangoes & berries.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
