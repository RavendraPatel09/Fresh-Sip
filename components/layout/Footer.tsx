'use client';

import React from 'react';
import Link from 'next/link';
import { Instagram, Twitter, Facebook, Mail, Clock, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-fresh-charcoal text-white pt-16 pb-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-gray-800">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-fresh-orange to-fresh-yellow flex items-center justify-center text-lg">
                🍊
              </div>
              <span className="font-display text-2xl font-extrabold text-white tracking-tight">
                Fresh<span className="text-fresh-orange">Sip</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Crafting cold-pressed organic elixirs, vibrant fruit smoothies, and functional wellness shots daily. 100% real fruit, zero preservatives.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-gray-300 hover:text-white hover:bg-fresh-orange transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-gray-300 hover:text-white hover:bg-fresh-orange transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-gray-300 hover:text-white hover:bg-fresh-orange transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-white text-base mb-4">Explore Menu</h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li><Link href="#menu" className="hover:text-fresh-orange transition-colors">Fruit Juices</Link></li>
              <li><Link href="#menu" className="hover:text-fresh-orange transition-colors">Detox Cleanse</Link></li>
              <li><Link href="#menu" className="hover:text-fresh-orange transition-colors">Protein Smoothies</Link></li>
              <li><Link href="#menu" className="hover:text-fresh-orange transition-colors">Artisanal Shakes</Link></li>
              <li><Link href="#menu" className="hover:text-fresh-orange transition-colors">Super Saver Combos</Link></li>
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h4 className="font-display font-semibold text-white text-base mb-4">Customer Care</h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li><Link href="#loyalty" className="hover:text-fresh-orange transition-colors">FreshSip Rewards</Link></li>
              <li><Link href="#contact" className="hover:text-fresh-orange transition-colors">Track Order</Link></li>
              <li><Link href="#benefits" className="hover:text-fresh-orange transition-colors">Nutrition Calculator</Link></li>
              <li><Link href="#contact" className="hover:text-fresh-orange transition-colors">Store Locator</Link></li>
              <li><Link href="/admin" className="hover:text-fresh-orange transition-colors text-fresh-orange">Admin Dashboard</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-3 text-sm text-gray-400">
            <h4 className="font-display font-semibold text-white text-base mb-4">Visit Our Store</h4>
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-fresh-orange shrink-0" />
              <span>hello@freshsip.com</span>
            </div>
            <div className="flex items-center gap-2.5 pt-1">
              <Clock className="w-4 h-4 text-fresh-green shrink-0" />
              <span className="text-xs text-gray-300">Open Daily: 7:00 AM – 11:00 PM</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} FreshSip Juice Bar Inc. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-fresh-pink fill-fresh-pink inline" />
            <span>for healthy sip lovers.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
