'use client';

import React from 'react';
import { useFreshSipStore } from '@/lib/store';
import { Award, Gift, Sparkles, Zap, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export function LoyaltySection() {
  const user = useFreshSipStore((state) => state.user);

  const points = user?.loyaltyPoints || 680;
  const currentTier = user?.loyaltyTier || 'Zesty';

  // Calculate progress toward next tier (Super Fresh @ 1000 pts)
  const maxPoints = 1000;
  const progressPercent = Math.min(100, Math.round((points / maxPoints) * 100));

  return (
    <section id="loyalty" className="py-24 bg-gradient-to-br from-fresh-charcoal via-gray-900 to-black text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Loyalty Card */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-fresh-orange flex items-center gap-1.5">
              <Award className="w-4 h-4" /> FreshSip Club Rewards
            </span>

            <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight leading-tight">
              Earn Fresh Points With Every Sip.
            </h2>

            <p className="text-gray-300 text-base leading-relaxed">
              Earn 1 point for every ₹10 spent. Unlock exclusive discounts, free birthday smoothie blends, and secret off-menu elixirs.
            </p>

            {/* Progress Bar */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/10 space-y-4">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-gray-300">Your Current Tier: <span className="text-fresh-orange font-bold">{currentTier}</span></span>
                <span className="text-fresh-yellow font-extrabold">{points} / {maxPoints} Points</span>
              </div>

              {/* Bar */}
              <div className="w-full h-3 rounded-full bg-gray-800 overflow-hidden relative">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${progressPercent}%` }}
                  transition={{ duration: 1 }}
                  className="h-full bg-gradient-to-r from-fresh-orange via-fresh-yellow to-fresh-pink"
                />
              </div>

              <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                <span>Fresh (0 pt)</span>
                <span>Zesty (500 pt)</span>
                <span>Super Fresh (1000 pt)</span>
              </div>
            </div>
          </div>

          {/* Right Column: Tiers Grid */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Fresh Tier */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors space-y-3">
              <div className="w-9 h-9 rounded-xl bg-fresh-green/20 text-fresh-green flex items-center justify-center text-lg font-bold">
                🌱
              </div>
              <h4 className="font-display font-bold text-lg text-white">Fresh</h4>
              <span className="text-[10px] uppercase font-bold text-gray-400 block">0–499 Points</span>
              <ul className="space-y-1.5 text-xs text-gray-300">
                <li className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-fresh-green shrink-0" /> 1 pt per ₹10</li>
                <li className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-fresh-green shrink-0" /> Welcome 10% OFF</li>
              </ul>
            </div>

            {/* Zesty Tier */}
            <div className="bg-white/10 border-2 border-fresh-orange rounded-2xl p-5 shadow-glow-orange space-y-3 relative">
              <span className="absolute -top-3 right-3 bg-fresh-orange text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                Active Tier
              </span>
              <div className="w-9 h-9 rounded-xl bg-fresh-orange/20 text-fresh-orange flex items-center justify-center text-lg font-bold">
                🍊
              </div>
              <h4 className="font-display font-bold text-lg text-white">Zesty</h4>
              <span className="text-[10px] uppercase font-bold text-fresh-orange block">500–999 Points</span>
              <ul className="space-y-1.5 text-xs text-gray-300">
                <li className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-fresh-orange shrink-0" /> Free Delivery</li>
                <li className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-fresh-orange shrink-0" /> Birthday Smoothie</li>
                <li className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-fresh-orange shrink-0" /> 15% OFF Combos</li>
              </ul>
            </div>

            {/* Super Fresh Tier */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors space-y-3">
              <div className="w-9 h-9 rounded-xl bg-fresh-pink/20 text-fresh-pink flex items-center justify-center text-lg font-bold">
                👑
              </div>
              <h4 className="font-display font-bold text-lg text-white">Super Fresh</h4>
              <span className="text-[10px] uppercase font-bold text-gray-400 block">1000+ Points</span>
              <ul className="space-y-1.5 text-xs text-gray-300">
                <li className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-fresh-pink shrink-0" /> VIP Tasting Invites</li>
                <li className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-fresh-pink shrink-0" /> Secret Menu Access</li>
                <li className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-fresh-pink shrink-0" /> Double Points Days</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
