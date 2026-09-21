'use client';

import React from 'react';
import { Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

const REVIEWS = [
  {
    name: 'Priya Sharma',
    role: 'Fitness Coach & Athlete',
    quote: 'The Mango Burst tastes like summer in a bottle! No artificial aftertaste, just pure, silky Alphonso goodness. My go-to post-workout drink.',
    rating: 5,
  },
  {
    name: 'Rohan Mehta',
    role: 'Software Architect',
    quote: 'Green Detox is a lifesaver during intense coding sprints. Zero jitters, super refreshing, and the aloe vera touch makes a huge difference.',
    rating: 5,
  },
  {
    name: 'Ananya Desai',
    role: 'Nutrition Specialist',
    quote: 'As a nutritionist, I am super picky about cold-pressed juices. FreshSip’s commitment to zero added sugar and true raw ingredients is top-notch.',
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-fresh-softBg relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-fresh-orange">
            Customer Love
          </span>
          <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-fresh-charcoal mt-2 tracking-tight">
            Loved by 50,000+ Sip Enthusiasts.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {REVIEWS.map((rev, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between relative"
            >
              <Quote className="w-8 h-8 text-fresh-orange/20 mb-4" />
              <p className="text-fresh-charcoal text-sm leading-relaxed italic mb-6">
                "{rev.quote}"
              </p>

              <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                <div>
                  <h4 className="font-display font-bold text-sm text-fresh-charcoal">{rev.name}</h4>
                  <span className="text-[11px] text-fresh-gray">{rev.role}</span>
                </div>

                <div className="flex items-center gap-0.5 text-amber-400">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
