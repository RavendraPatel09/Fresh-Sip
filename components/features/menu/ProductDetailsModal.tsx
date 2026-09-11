'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { useFreshSipStore } from '@/lib/store';
import { X, ShoppingBag, Star, Flame, Check, ShieldCheck, Heart } from 'lucide-react';
import { ProductSize } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

const ProductShowcaseCanvas = dynamic(() => import('@/components/three-d/ProductShowcaseCanvas'), {
  ssr: false,
});

export function ProductDetailsModal() {
  const product = useFreshSipStore((state) => state.selectedProductDetails);
  const closeProductDetails = useFreshSipStore((state) => state.closeProductDetails);
  const addToCart = useFreshSipStore((state) => state.addToCart);
  const toggleFavorite = useFreshSipStore((state) => state.toggleFavorite);
  const user = useFreshSipStore((state) => state.user);

  const [selectedSize, setSelectedSize] = useState<ProductSize>('250ml');
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const isFavorite = user?.favorites?.includes(product.id) || false;
  const currentPrice = (product.sizePrices[selectedSize] || product.price) * quantity;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative border border-gray-100 flex flex-col md:flex-row"
        >
          {/* Close Button */}
          <button
            onClick={closeProductDetails}
            className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-gray-100 hover:bg-gray-200 text-fresh-charcoal transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left Column: Interactive 3D Canvas */}
          <div className="md:w-1/2 bg-gradient-to-br from-fresh-softBg to-white p-6 flex flex-col items-center justify-center relative min-h-[350px]">
            <div className="w-full relative">
              <ProductShowcaseCanvas color={product.accentColor} fruitType={product.fruitType} />
            </div>
            <p className="text-[11px] text-gray-400 text-center mt-2">
              🖱️ Drag bottle to rotate 360° • Pinch to zoom
            </p>
          </div>

          {/* Right Column: Specifications & Purchasing Controls */}
          <div className="md:w-1/2 p-6 sm:p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-fresh-orange/10 text-fresh-orange">
                  {product.category}
                </span>
                <button
                  onClick={() => toggleFavorite(product.id)}
                  className={`p-2 rounded-full transition-colors ${
                    isFavorite ? 'bg-fresh-pink/20 text-fresh-pink' : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? 'fill-fresh-pink' : ''}`} />
                </button>
              </div>

              <h2 className="text-3xl font-display font-extrabold text-fresh-charcoal">
                {product.name}
              </h2>

              <div className="flex items-center gap-4 text-xs font-semibold">
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{product.rating}</span>
                  <span className="text-gray-400 font-normal">({product.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center gap-1 text-fresh-gray">
                  <Flame className="w-4 h-4 text-fresh-orange" />
                  <span>{product.nutrition.calories} kcal</span>
                </div>
              </div>

              <p className="text-xs text-fresh-gray leading-relaxed">
                {product.description}
              </p>

              {/* Nutrition Specs Grid */}
              <div className="grid grid-cols-3 gap-2 bg-fresh-softBg p-3 rounded-2xl border border-gray-200/50">
                <div className="text-center">
                  <span className="text-[10px] text-gray-400 block font-medium">Vitamin C</span>
                  <span className="text-xs font-bold text-fresh-charcoal">{product.nutrition.vitaminC}</span>
                </div>
                <div className="text-center">
                  <span className="text-[10px] text-gray-400 block font-medium">Sugar</span>
                  <span className="text-xs font-bold text-fresh-charcoal">{product.nutrition.sugar}</span>
                </div>
                <div className="text-center">
                  <span className="text-[10px] text-gray-400 block font-medium">Protein</span>
                  <span className="text-xs font-bold text-fresh-charcoal">{product.nutrition.protein}</span>
                </div>
              </div>

              {/* Ingredients List */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-fresh-charcoal mb-2">
                  Ingredients
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {product.ingredients.map((ing, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-md bg-gray-100 text-fresh-charcoal text-xs font-medium"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>

              {/* Size Selector */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-fresh-charcoal mb-2">
                  Select Size
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {(['250ml', '500ml', '1L'] as ProductSize[]).map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        selectedSize === size
                          ? 'bg-fresh-charcoal text-white border-fresh-charcoal shadow-sm'
                          : 'bg-white text-fresh-charcoal border-gray-200 hover:border-fresh-orange'
                      }`}
                    >
                      {size} (₹{product.sizePrices[size]})
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Picker */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-fresh-charcoal">
                  Quantity
                </span>
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 text-sm font-bold hover:bg-gray-100 text-fresh-charcoal"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 text-xs font-bold text-fresh-charcoal">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1 text-sm font-bold hover:bg-gray-100 text-fresh-charcoal"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-gray-400 block font-medium">Subtotal</span>
                <span className="text-2xl font-display font-extrabold text-fresh-charcoal">
                  ₹{currentPrice}
                </span>
              </div>

              <button
                onClick={() => {
                  addToCart(product, selectedSize, quantity);
                  closeProductDetails();
                }}
                className="px-6 py-3.5 rounded-2xl bg-fresh-orange text-white font-semibold text-xs hover:bg-fresh-charcoal shadow-glow-orange transition-all flex items-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
