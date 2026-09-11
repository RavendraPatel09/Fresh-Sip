'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { useFreshSipStore } from '@/lib/store';
import { ShoppingBag, Flame } from 'lucide-react';
import { ProductSize } from '@/types';

const ProductShowcaseCanvas = dynamic(() => import('../3d/ProductShowcaseCanvas'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] flex items-center justify-center text-gray-400 text-sm">
      Initializing 3D Bottle Shader...
    </div>
  ),
});

export function Showcase3DSection() {
  const products = useFreshSipStore((state) => state.products);
  const addToCart = useFreshSipStore((state) => state.addToCart);

  // Showcase featured product IDs
  const showcaseProducts = products.filter((p) =>
    ['mango-burst', 'green-detox', 'strawberry-dream', 'orange-glow', 'pineapple-punch', 'banana-berry'].includes(p.id)
  );

  const [selectedProductId, setSelectedProductId] = useState('mango-burst');
  const [selectedSize, setSelectedSize] = useState<ProductSize>('250ml');

  const currentProduct = showcaseProducts.find((p) => p.id === selectedProductId) || showcaseProducts[0];

  return (
    <section id="showcase" className="py-24 bg-gradient-to-b from-fresh-bg via-white to-fresh-softBg relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-xs font-bold uppercase tracking-widest text-fresh-orange"
          >
            Interactive 3D Studio
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-5xl font-display font-extrabold text-fresh-charcoal mt-2 tracking-tight"
          >
            Meet Your New Favorite.
          </motion.h2>
          <p className="text-fresh-gray mt-3 text-base">
            Rotate the bottle in 3D, inspect raw ingredients, and tailor your bottle size before ordering.
          </p>
        </div>

        {/* 3D Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-white rounded-3xl p-6 sm:p-10 shadow-glass border border-gray-100">
          {/* Left Column: Interactive 3D Canvas */}
          <div className="lg:col-span-7 relative flex flex-col items-center">
            <div className="w-full relative">
              <ProductShowcaseCanvas color={currentProduct.accentColor} fruitType={currentProduct.fruitType} />
            </div>
          </div>

          {/* Right Column: Product Details & Size Selector */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-fresh-orange/10 text-fresh-orange">
                {currentProduct.category}
              </span>
              <span className="flex items-center gap-1 text-xs text-fresh-gray font-semibold">
                <Flame className="w-3.5 h-3.5 text-fresh-pink" />
                {currentProduct.nutrition.calories} calories
              </span>
            </div>

            <h3 className="text-3xl font-display font-extrabold text-fresh-charcoal">
              {currentProduct.name}
            </h3>

            <p className="text-fresh-gray text-sm leading-relaxed">
              {currentProduct.description}
            </p>

            {/* Ingredients */}
            <div>
              <h4 className="text-xs uppercase font-extrabold text-fresh-charcoal tracking-wider mb-2">
                Raw Ingredients
              </h4>
              <div className="flex flex-wrap gap-2">
                {currentProduct.ingredients.map((ing, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-lg bg-fresh-softBg text-fresh-charcoal text-xs font-semibold border border-gray-200/60"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div>
              <h4 className="text-xs uppercase font-extrabold text-fresh-charcoal tracking-wider mb-2">
                Choose Size
              </h4>
              <div className="grid grid-cols-3 gap-3">
                {(['250ml', '500ml', '1L'] as ProductSize[]).map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    aria-label={`Select size ${size} for ₹${currentProduct.sizePrices[size]}`}
                    className={`py-2.5 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center border cursor-pointer ${
                      selectedSize === size
                        ? 'bg-fresh-charcoal text-white border-fresh-charcoal shadow-md'
                        : 'bg-white text-fresh-charcoal border-gray-200 hover:border-fresh-orange'
                    }`}
                  >
                    <span>{size}</span>
                    <span className="text-[10px] font-semibold opacity-80">
                      ₹{currentProduct.sizePrices[size]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price & Add To Cart Button */}
            <div className="pt-4 flex items-center justify-between border-t border-gray-100">
              <div>
                <span className="text-xs text-fresh-gray font-semibold block uppercase tracking-wider">Total Price</span>
                <span className="text-3xl font-display font-extrabold text-fresh-charcoal">
                  ₹{currentProduct.sizePrices[selectedSize]}
                </span>
              </div>

              <button
                onClick={() => addToCart(currentProduct, selectedSize)}
                aria-label={`Add ${currentProduct.name} ${selectedSize} to cart`}
                className="px-8 py-4 rounded-2xl bg-fresh-orange text-white font-bold text-sm hover:bg-fresh-charcoal shadow-glow-orange transition-all duration-200 flex items-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Flavor Switcher Pills */}
        <div className="mt-10 flex items-center justify-center gap-3 overflow-x-auto py-2">
          {showcaseProducts.map((prod) => (
            <button
              key={prod.id}
              onClick={() => setSelectedProductId(prod.id)}
              aria-label={`Switch flavor to ${prod.name}`}
              className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 border cursor-pointer ${
                selectedProductId === prod.id
                  ? 'bg-fresh-charcoal text-white border-fresh-charcoal shadow-md scale-105'
                  : 'bg-white text-fresh-charcoal border-gray-200 hover:border-fresh-orange'
              }`}
            >
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: prod.accentColor }}
              />
              <span>{prod.name}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
