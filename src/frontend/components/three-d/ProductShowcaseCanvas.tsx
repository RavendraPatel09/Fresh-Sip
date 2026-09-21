'use client';

import React from 'react';

interface ProductShowcaseCanvasProps {
  color?: string;
  fruitType?: string;
  enableOrbit?: boolean;
  image?: string;
  name?: string;
  productId?: string;
}

export default function ProductShowcaseCanvas({
  image = '/mango-burst.jpg',
  name = 'FreshSip Juice Product',
  productId,
}: ProductShowcaseCanvasProps) {
  // Mapping table to guarantee the exact corresponding image for each product ID
  const productImageMap: Record<string, string> = {
    'mango-burst': '/mango-burst.jpg',
    'orange-glow': '/orange-glow.jpg',
    'watermelon-splash': '/watermelon-splash.jpg',
    'pineapple-punch': '/pineapple-punch.jpg',
    'apple-fresh': '/apple-fresh.jpg',
    'green-detox': '/green-detox.jpg',
    'cucumber-mint': '/cucumber-mint.jpg',
    'lemon-ginger': '/lemon-ginger.jpg',
    'spinach-glow': '/spinach-glow.jpg',
    'strawberry-dream': '/strawberry-dream.jpg',
    'banana-berry': '/banana-berry.jpg',
    'tropical-mix': '/tropical-mix.jpg',
    'chocolate-shake': '/chocolate-shake.jpg',
    'vanilla-shake': '/vanilla-shake.jpg',
    'mango-cream': '/mango-burst.jpg',
    'mango-shake': '/mango-burst.jpg',
    'strawberry-shake': '/strawberry-dream.jpg',
  };

  const activeImage = (productId && productImageMap[productId]) || image || '/mango-burst.jpg';

  return (
    <div className="w-full h-[400px] md:h-[480px] relative flex items-center justify-center p-2 cursor-default select-none">
      <div className="relative w-full h-full max-w-[540px] max-h-[440px] flex items-center justify-center">
        <img
          key={activeImage}
          src={activeImage}
          alt={name}
          className="w-full h-full object-contain filter drop-shadow-[0_20px_35px_rgba(234,88,12,0.18)] transition-all duration-500 ease-in-out cursor-default select-none"
        />
      </div>
    </div>
  );
}
