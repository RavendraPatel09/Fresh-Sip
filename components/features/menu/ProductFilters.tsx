'use client';

import React from 'react';
import { useFreshSipStore } from '@/lib/store';
import { ProductCategory, HealthGoal } from '@/types';
import { Search, Filter, RotateCcw } from 'lucide-react';

const CATEGORIES: (ProductCategory | 'All')[] = [
  'All',
  'Fruit Juices',
  'Detox',
  'Smoothies',
  'Shakes',
  'Combos',
];

const HEALTH_GOALS: HealthGoal[] = [
  'Energy',
  'Immunity',
  'Hydration',
  'Detox',
  'Digestion',
  'Fitness',
  'Refreshment',
];

const DIETARY_TAGS = ['Vegan', 'Low Sugar', 'High Vitamin C', 'Protein', 'Keto Friendly'];

export function ProductFilters() {
  const activeCategory = useFreshSipStore((state) => state.activeCategory);
  const setActiveCategory = useFreshSipStore((state) => state.setActiveCategory);
  const searchQuery = useFreshSipStore((state) => state.searchQuery);
  const setSearchQuery = useFreshSipStore((state) => state.setSearchQuery);
  const selectedHealthGoals = useFreshSipStore((state) => state.selectedHealthGoals);
  const toggleHealthGoal = useFreshSipStore((state) => state.toggleHealthGoal);
  const selectedDietaryTags = useFreshSipStore((state) => state.selectedDietaryTags);
  const toggleDietaryTag = useFreshSipStore((state) => state.toggleDietaryTag);
  const resetFilters = useFreshSipStore((state) => state.resetFilters);

  const hasActiveFilters =
    activeCategory !== 'All' ||
    searchQuery !== '' ||
    selectedHealthGoals.length > 0 ||
    selectedDietaryTags.length > 0;

  return (
    <div className="space-y-6 mb-10">
      {/* Search & Category Tabs */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                activeCategory === cat
                  ? 'bg-fresh-charcoal text-white border-fresh-charcoal shadow-md'
                  : 'bg-white text-fresh-charcoal border-gray-200 hover:border-fresh-orange'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search mango, detox, protein..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-full text-xs text-fresh-charcoal focus:outline-none focus:border-fresh-orange transition-colors"
          />
        </div>
      </div>

      {/* Health Goal Chips & Dietary Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-fresh-charcoal flex items-center gap-1 mr-2">
            <Filter className="w-3.5 h-3.5 text-fresh-orange" />
            Health Goal:
          </span>
          {HEALTH_GOALS.map((goal) => {
            const isSelected = selectedHealthGoals.includes(goal);
            return (
              <button
                key={goal}
                onClick={() => toggleHealthGoal(goal)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors border ${
                  isSelected
                    ? 'bg-fresh-green text-white border-fresh-green'
                    : 'bg-fresh-softBg text-fresh-gray border-gray-200 hover:border-fresh-green'
                }`}
              >
                {goal}
              </button>
            );
          })}
        </div>

        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="text-xs text-fresh-pink hover:underline font-semibold flex items-center gap-1 shrink-0"
          >
            <RotateCcw className="w-3 h-3" />
            Reset All Filters
          </button>
        )}
      </div>
    </div>
  );
}
