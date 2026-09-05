'use client';

import React from 'react';
import Image from 'next/image';
import { Star, ShoppingBag, Eye, Heart, Flame } from 'lucide-react';
import { Product } from '@/types';
import { useFreshSipStore } from '@/lib/store';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addToCart = useFreshSipStore((state) => state.addToCart);
  const openProductDetails = useFreshSipStore((state) => state.openProductDetails);
  const toggleFavorite = useFreshSipStore((state) => state.toggleFavorite);
  const user = useFreshSipStore((state) => state.user);

  const isFavorite = user?.favorites?.includes(product.id) || false;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group bg-white rounded-3xl p-5 shadow-sm hover:shadow-glass hover:scale-[1.02] border border-gray-100/90 hover:border-fresh-orange/40 transition-all duration-300 flex flex-col justify-between h-full relative overflow-hidden"
    >
      <div className="flex flex-col flex-1">
        {/* Top Badges */}
        <div className="flex items-center justify-between z-10">
          <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-fresh-softBg text-fresh-charcoal border border-gray-200/80 uppercase tracking-wider">
            {product.category}
          </span>
          <button
            onClick={() => toggleFavorite(product.id)}
            aria-label={`Add ${product.name} to favorites`}
            className={`p-2 rounded-full backdrop-blur-md transition-colors cursor-pointer ${
              isFavorite ? 'bg-fresh-pink/20 text-fresh-pink' : 'bg-gray-100/80 text-gray-400 hover:text-fresh-pink'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-fresh-pink' : ''}`} />
          </button>
        </div>

        {/* Product Image & Hover Visual */}
        <div
          onClick={() => openProductDetails(product)}
          className="relative w-full h-48 my-4 rounded-2xl overflow-hidden cursor-pointer bg-fresh-softBg flex items-center justify-center group-hover:scale-[1.03] transition-transform duration-300"
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Dynamic Color Accent Overlay */}
          <div
            className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity"
            style={{ backgroundColor: product.accentColor }}
          />

          {/* Hover Quick View Badge */}
          <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="px-4 py-2 rounded-full bg-white text-fresh-charcoal text-xs font-bold shadow-lg flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-fresh-orange" />
              3D View & Specs
            </span>
          </div>
        </div>

        {/* Product Information */}
        <div className="space-y-2 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{product.rating}</span>
                <span className="text-gray-400 text-[10px] font-normal">({product.reviewCount})</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-fresh-gray font-semibold">
                <Flame className="w-3.5 h-3.5 text-fresh-orange" />
                <span>{product.nutrition.calories} kcal</span>
              </div>
            </div>

            <h3
              onClick={() => openProductDetails(product)}
              className="text-lg font-display font-extrabold text-fresh-charcoal hover:text-fresh-orange transition-colors cursor-pointer"
            >
              {product.name}
            </h3>

            <p className="text-xs text-fresh-gray line-clamp-2 leading-relaxed mt-1">
              {product.description}
            </p>
          </div>

          {/* Health Tags */}
          <div className="flex flex-wrap gap-1.5 pt-2">
            {product.healthBenefits.slice(0, 2).map((benefit, idx) => (
              <span
                key={idx}
                className="px-2.5 py-0.5 rounded-md bg-fresh-green/10 text-fresh-green text-[10px] font-bold"
              >
                {benefit}
              </span>
            ))}
            {product.tags[0] && (
              <span className="px-2.5 py-0.5 rounded-md bg-fresh-orange/10 text-fresh-orange text-[10px] font-bold">
                {product.tags[0]}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card Footer Pushed to Bottom */}
      <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider block">From</span>
          <span className="text-xl font-display font-extrabold text-fresh-charcoal">
            ₹{product.price}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => openProductDetails(product)}
            className="p-2.5 rounded-xl bg-gray-100 text-fresh-charcoal hover:bg-gray-200 text-xs font-bold transition-colors cursor-pointer"
            title="View Product Specs"
            aria-label={`View specs for ${product.name}`}
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => addToCart(product, '250ml')}
            aria-label={`Add ${product.name} to cart`}
            className="px-4 py-2.5 rounded-xl bg-fresh-charcoal text-white hover:bg-fresh-orange font-bold text-xs transition-all duration-200 flex items-center gap-1.5 shadow-sm hover:shadow-glow-orange cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
