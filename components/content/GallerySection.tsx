'use client';

import React from 'react';
import Image from 'next/image';
import { Camera } from 'lucide-react';
import { motion } from 'framer-motion';

const GALLERY_IMAGES = [
  {
    src: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='800' viewBox='0 0 800 800'><rect width='800' height='800' fill='%23FFF8EE'/><circle cx='400' cy='400' r='260' fill='%23FF9F1C' opacity='0.3'/><text x='50%' y='45%' dominant-baseline='middle' text-anchor='middle' font-size='160'>🥭</text><text x='50%' y='70%' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-weight='800' font-size='36' fill='%23FF9F1C'>Mango Harvest</text></svg>",
    title: 'Mango Harvest',
    caption: 'Fresh Alphonso mangoes ready for pressing',
  },
  {
    src: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='800' viewBox='0 0 800 800'><rect width='800' height='800' fill='%23FFF3E0'/><circle cx='400' cy='400' r='260' fill='%23FF70A6' opacity='0.3'/><text x='50%' y='45%' dominant-baseline='middle' text-anchor='middle' font-size='160'>🍊</text><text x='50%' y='70%' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-weight='800' font-size='36' fill='%23FF70A6'>Valencia Oranges</text></svg>",
    title: 'Valencia Oranges',
    caption: 'Cold pressing citrus elixirs',
  },
  {
    src: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='800' viewBox='0 0 800 800'><rect width='800' height='800' fill='%23FFEBEE'/><circle cx='400' cy='400' r='260' fill='%23FF4D6D' opacity='0.3'/><text x='50%' y='45%' dominant-baseline='middle' text-anchor='middle' font-size='160'>🍉</text><text x='50%' y='70%' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-weight='800' font-size='36' fill='%23FF4D6D'>Watermelon Chilling</text></svg>",
    title: 'Watermelon Chilling',
    caption: 'Ruby watermelon infused with basil',
  },
  {
    src: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='800' viewBox='0 0 800 800'><rect width='800' height='800' fill='%23E8F5E9'/><circle cx='400' cy='400' r='260' fill='%2338B000' opacity='0.3'/><text x='50%' y='45%' dominant-baseline='middle' text-anchor='middle' font-size='160'>🥬</text><text x='50%' y='70%' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-weight='800' font-size='36' fill='%2338B000'>Green Detox Press</text></svg>",
    title: 'Green Detox Press',
    caption: 'Organic kale & celery chlorophyll extraction',
  },
];

export function GallerySection() {
  return (
    <section className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-fresh-orange flex items-center justify-center gap-1">
            <Camera className="w-4 h-4" /> Craftsmanship Gallery
          </span>
          <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-fresh-charcoal mt-2 tracking-tight">
            Inside the Juice Lab.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {GALLERY_IMAGES.map((img, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group relative h-80 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer"
            >
              <Image
                src={img.src}
                alt={img.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <h4 className="font-display font-bold text-lg">{img.title}</h4>
                <p className="text-xs text-gray-300 mt-1">{img.caption}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
