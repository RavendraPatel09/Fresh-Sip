'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function InitialLoader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.4 } }}
          className="fixed inset-0 z-[10000] bg-[#FFFDF8] flex flex-col items-center justify-center pointer-events-none"
        >
          <div className="relative flex flex-col items-center">
            {/* Animated Liquid Droplet */}
            <motion.div
              initial={{ y: -40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="w-12 h-12 rounded-t-full rounded-b-[40%] bg-gradient-to-br from-fresh-orange to-fresh-yellow shadow-glow-orange flex items-center justify-center text-xl mb-4"
            >
              🍊
            </motion.div>

            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-3xl font-display font-extrabold tracking-tight text-fresh-charcoal"
            >
              Fresh<span className="text-fresh-orange">Sip</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs uppercase tracking-widest text-fresh-gray mt-2 font-medium"
            >
              Fresh. Vibrant. Made for You.
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
