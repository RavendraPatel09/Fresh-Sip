'use client';

import React from 'react';
import { useFreshSipStore } from '@/lib/store';
import { ProductCard } from './ProductCard';
import { ProductFilters } from './ProductFilters';
import { motion } from 'framer-motion';

export function MenuSection() {
  const products = useFreshSipStore((state) => state.products);
  const activeCategory = useFreshSipStore((state) => state.activeCategory);
  const searchQuery = useFreshSipStore((state) => state.searchQuery);
  const selectedHealthGoals = useFreshSipStore((state) => state.selectedHealthGoals);
  const resetFilters = useFreshSipStore((state) => state.resetFilters);

  // Filter products based on active filters
  const filteredProducts = products.filter((product) => {
    // Category match
    if (activeCategory !== 'All' && product.category !== activeCategory) {
      return false;
    }

    // Search query match
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchName = product.name.toLowerCase().includes(q);
      const matchCategory = product.category.toLowerCase().includes(q);
      const matchIngredient = product.ingredients.some((ing) => ing.toLowerCase().includes(q));
      const matchTag = product.tags.some((tag) => tag.toLowerCase().includes(q));

      if (!matchName && !matchCategory && !matchIngredient && !matchTag) {
        return false;
      }
    }

    // Health Goal match
    if (selectedHealthGoals.length > 0) {
      const hasGoal = selectedHealthGoals.some((goal) => product.healthBenefits.includes(goal));
      if (!hasGoal) return false;
    }

    return true;
  });

  return (
    <section id="menu" className="py-24 bg-fresh-softBg relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-xs font-bold uppercase tracking-widest text-fresh-orange"
          >
            Freshly Blended Menu
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-5xl font-display font-extrabold text-fresh-charcoal mt-2 tracking-tight"
          >
            Sip Pure Perfection.
          </motion.h2>
          <p className="text-fresh-gray mt-3 text-base">
            Explore our artisanal lineup of fruit juices, alkalizing detox cleanses, protein smoothies, and handcrafted shakes.
          </p>
        </div>

        {/* Filters */}
        <ProductFilters />

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 p-8">
            <div className="text-4xl mb-3">🍊</div>
            <h3 className="text-xl font-display font-bold text-fresh-charcoal">
              No matching juices found
            </h3>
            <p className="text-fresh-gray text-xs mt-1 max-w-md mx-auto">
              We couldn’t find any juices matching your active filters or search term. Try resetting your filters to explore all flavors.
            </p>
            <button
              onClick={resetFilters}
              className="mt-4 px-6 py-2.5 rounded-full bg-fresh-orange text-white text-xs font-semibold hover:bg-fresh-charcoal transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
