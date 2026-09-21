'use client';

import React, { useState } from 'react';
import { useFreshSipStore } from '@/lib/store';
import { HealthGoal } from '@/types';
import { Zap, Shield, Droplets, Leaf, Activity, Dumbbell, Sparkles, ArrowRight, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const HEALTH_GOAL_CONFIG: Array<{
  id: HealthGoal;
  label: string;
  icon: any;
  color: string;
  description: string;
}> = [
  {
    id: 'Energy',
    label: 'Energy Boost',
    icon: Zap,
    color: '#FF9F1C',
    description: 'Natural fruit sugars and B-complex vitamins for sustained, jitter-free vitality.',
  },
  {
    id: 'Immunity',
    label: 'Immunity Guard',
    icon: Shield,
    color: '#FF70A6',
    description: 'High-dose Vitamin C, ginger root, and turmeric to fortify immune defense.',
  },
  {
    id: 'Hydration',
    label: 'Cellular Hydration',
    icon: Droplets,
    color: '#4CC9F0',
    description: 'Electrolyte-rich coconut water and raw watermelon to restore fluid balance.',
  },
  {
    id: 'Detox',
    label: 'Deep Cleansing',
    icon: Leaf,
    color: '#38B000',
    description: 'Chlorophyll-dense leafy greens and alkalizing lemon to flush out toxins.',
  },
  {
    id: 'Digestion',
    label: 'Gut Health',
    icon: Activity,
    color: '#FFB703',
    description: 'Active bromelain enzymes, chia fiber, and probiotic aloe vera gel.',
  },
  {
    id: 'Fitness',
    label: 'Muscle Recovery',
    icon: Dumbbell,
    color: '#7209B7',
    description: 'Plant-based pea protein, potassium-rich banana, and tart cherry extracts.',
  },
];

export function HealthBenefits() {
  const [selectedGoal, setSelectedGoal] = useState<HealthGoal>('Immunity');
  const products = useFreshSipStore((state) => state.products);
  const addToCart = useFreshSipStore((state) => state.addToCart);
  const openProductDetails = useFreshSipStore((state) => state.openProductDetails);

  const activeConfig = HEALTH_GOAL_CONFIG.find((g) => g.id === selectedGoal) || HEALTH_GOAL_CONFIG[0];
  const recommendedJuices = products.filter((p) => p.healthBenefits.includes(selectedGoal));

  return (
    <section id="benefits" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-fresh-green">
            Tailored Wellness
          </span>
          <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-fresh-charcoal mt-2 tracking-tight">
            Drink With Purpose.
          </h2>
          <p className="text-fresh-gray mt-3 text-base">
            Select your health goal below to discover targeted cold-pressed formulas engineered for your body’s needs.
          </p>
        </div>

        {/* Goal Selector Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-12">
          {HEALTH_GOAL_CONFIG.map((goal) => {
            const Icon = goal.icon;
            const isSelected = selectedGoal === goal.id;
            return (
              <button
                key={goal.id}
                onClick={() => setSelectedGoal(goal.id)}
                className={`p-4 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between ${
                  isSelected
                    ? 'bg-fresh-charcoal text-white border-fresh-charcoal shadow-lg scale-105'
                    : 'bg-fresh-softBg text-fresh-charcoal border-gray-200 hover:border-fresh-orange'
                }`}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                  style={{
                    backgroundColor: isSelected ? goal.color : 'rgba(0,0,0,0.05)',
                    color: isSelected ? '#FFFFFF' : goal.color,
                  }}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold font-display tracking-tight block">
                  {goal.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Goal Banner & Recommended Juices */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedGoal}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-8"
          >
            {/* Banner */}
            <div
              className="rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-glass relative overflow-hidden"
              style={{ backgroundColor: activeConfig.color }}
            >
              <div className="space-y-2 relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-bold backdrop-blur-md">
                  <Sparkles className="w-3.5 h-3.5" />
                  Target Goal
                </div>
                <h3 className="text-2xl sm:text-4xl font-display font-extrabold">
                  {activeConfig.label}
                </h3>
                <p className="text-sm opacity-90 max-w-xl">
                  {activeConfig.description}
                </p>
              </div>

              <div className="shrink-0 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center">
                <span className="text-[11px] uppercase tracking-wider font-bold block opacity-80">
                  Recommended Juices
                </span>
                <span className="text-3xl font-extrabold">{recommendedJuices.length} Products</span>
              </div>
            </div>

            {/* Recommended Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendedJuices.map((juice) => (
                <div
                  key={juice.id}
                  className="bg-fresh-softBg rounded-2xl p-5 border border-gray-200/60 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-fresh-orange">{juice.category}</span>
                      <span className="text-xs font-bold text-fresh-charcoal">₹{juice.price}</span>
                    </div>

                    <h4
                      onClick={() => openProductDetails(juice)}
                      className="text-lg font-bold text-fresh-charcoal hover:text-fresh-orange cursor-pointer"
                    >
                      {juice.name}
                    </h4>

                    <p className="text-xs text-fresh-gray line-clamp-2">
                      {juice.description}
                    </p>

                    <div className="text-[11px] text-gray-500 font-medium">
                      🧪 <span className="font-semibold text-fresh-charcoal">{juice.ingredients.join(', ')}</span>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-gray-200/60 flex items-center justify-between">
                    <span className="text-xs text-fresh-green font-bold">
                      {juice.nutrition.vitaminC} Vit-C
                    </span>
                    <button
                      onClick={() => addToCart(juice, '250ml')}
                      className="px-4 py-2 rounded-xl bg-fresh-charcoal text-white hover:bg-fresh-orange text-xs font-semibold transition-colors flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
