'use client';

import React from 'react';
import { Tag, Sparkles, ArrowRight, Gift } from 'lucide-react';
import { useFreshSipStore } from '@/lib/store';

const OFFERS = [
  {
    title: 'Buy 2 Get 1 FREE',
    subtitle: 'Summer Berry & Mango Blast Special',
    code: 'FRESH3FOR2',
    badge: 'Limited Time',
    color: 'from-fresh-orange to-fresh-yellow',
  },
  {
    title: '20% OFF First Order',
    subtitle: 'Use code FRESH20 at checkout',
    code: 'FRESH20',
    badge: 'New Customers',
    color: 'from-fresh-pink to-purple-600',
  },
  {
    title: 'Weekend Smoothie Pack',
    subtitle: 'Flat ₹150 OFF on 4-pack combos',
    code: 'WEEKEND150',
    badge: 'Weekend Deal',
    color: 'from-fresh-green to-teal-600',
  },
];

export function OffersSection() {
  const applyCoupon = useFreshSipStore((state) => state.applyCoupon);
  const toggleCart = useFreshSipStore((state) => state.toggleCart);

  const handleClaim = (code: string) => {
    applyCoupon(code);
    toggleCart(true);
  };

  return (
    <section className="py-16 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-fresh-pink flex items-center gap-1">
              <Gift className="w-4 h-4" /> Exclusive Deals
            </span>
            <h2 className="text-3xl font-display font-extrabold text-fresh-charcoal mt-1">
              Summer Refresh Offers
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {OFFERS.map((offer, idx) => (
            <div
              key={idx}
              className={`rounded-3xl p-6 text-white bg-gradient-to-br ${offer.color} shadow-lg relative overflow-hidden flex flex-col justify-between hover:scale-105 transition-transform duration-300`}
            >
              <div className="space-y-3">
                <span className="px-3 py-1 rounded-full bg-white/20 text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-md">
                  {offer.badge}
                </span>
                <h3 className="text-2xl font-display font-extrabold leading-tight">
                  {offer.title}
                </h3>
                <p className="text-xs opacity-90">{offer.subtitle}</p>
              </div>

              <div className="pt-6 mt-6 border-t border-white/20 flex items-center justify-between">
                <span className="font-mono text-xs font-bold bg-white/20 px-3 py-1.5 rounded-lg border border-white/30">
                  {offer.code}
                </span>
                <button
                  onClick={() => handleClaim(offer.code)}
                  className="px-4 py-2 rounded-xl bg-white text-fresh-charcoal hover:bg-fresh-charcoal hover:text-white text-xs font-bold transition-colors flex items-center gap-1"
                >
                  <span>Apply Code</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
