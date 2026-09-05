'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, Bot, Search, User, Menu as MenuIcon, X, Award } from 'lucide-react';
import { useFreshSipStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const cart = useFreshSipStore((state) => state.cart);
  const toggleCart = useFreshSipStore((state) => state.toggleCart);
  const toggleAI = useFreshSipStore((state) => state.toggleAI);
  const toggleAuth = useFreshSipStore((state) => state.toggleAuth);
  const user = useFreshSipStore((state) => state.user);
  const searchQuery = useFreshSipStore((state) => state.searchQuery);
  const setSearchQuery = useFreshSipStore((state) => state.setSearchQuery);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'py-3 bg-white/85 backdrop-blur-md shadow-glass border-b border-gray-100/80'
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-fresh-orange to-fresh-yellow flex items-center justify-center text-xl shadow-glow-orange group-hover:scale-105 transition-transform duration-200">
            🍊
          </div>
          <span className="font-display text-2xl font-extrabold tracking-tight text-fresh-charcoal">
            Fresh<span className="text-fresh-orange">Sip</span>
          </span>
        </Link>

        {/* Center Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-fresh-charcoal/90">
          <Link href="#home" className="hover:text-fresh-orange transition-colors">
            Home
          </Link>
          <Link href="#showcase" className="hover:text-fresh-orange transition-colors">
            3D Experience
          </Link>
          <Link href="#menu" className="hover:text-fresh-orange transition-colors">
            Menu
          </Link>
          <Link href="#benefits" className="hover:text-fresh-orange transition-colors">
            Benefits
          </Link>
          <Link href="#loyalty" className="hover:text-fresh-orange transition-colors flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-fresh-orange" />
            Rewards
          </Link>
          <Link href="#about" className="hover:text-fresh-orange transition-colors">
            About
          </Link>
        </nav>

        {/* Right Desktop Controls */}
        <div className="flex items-center gap-3">
          {/* Search Trigger / Input */}
          <div className="relative">
            {isSearchOpen ? (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 220, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="flex items-center bg-gray-100/90 rounded-full px-3 py-1.5 border border-gray-200"
              >
                <Search className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
                <input
                  type="text"
                  placeholder="Search mango, detox..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-xs w-full focus:outline-none text-fresh-charcoal font-medium"
                  autoFocus
                />
                <button
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchQuery('');
                  }}
                  className="text-gray-400 hover:text-fresh-charcoal ml-1"
                  aria-label="Close Search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            ) : (
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2.5 rounded-full hover:bg-gray-100/80 text-fresh-charcoal transition-colors cursor-pointer"
                title="Search Juices"
                aria-label="Search Juices"
              >
                <Search className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* User Profile */}
          <button
            onClick={() => toggleAuth()}
            className="p-2.5 rounded-full hover:bg-gray-100/80 text-fresh-charcoal transition-colors relative cursor-pointer"
            title={user ? `Profile: ${user.name}` : 'Sign In'}
            aria-label={user ? `Profile: ${user.name}` : 'Sign In'}
          >
            <User className="w-5 h-5" />
            {user && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-fresh-green ring-2 ring-white" />
            )}
          </button>

          {/* Cart Drawer Trigger */}
          <button
            onClick={() => toggleCart()}
            className="relative p-2.5 rounded-full bg-fresh-charcoal text-white hover:bg-fresh-orange transition-all duration-200 shadow-sm hover:scale-105 cursor-pointer"
            title="Shopping Cart"
            aria-label={`Shopping Cart with ${cartCount} items`}
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-fresh-orange text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white"
              >
                {cartCount}
              </motion.span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2.5 text-fresh-charcoal hover:bg-gray-100 rounded-xl cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Animated Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/98 backdrop-blur-xl border-b border-gray-200 px-6 py-6"
          >
            <div className="flex flex-col gap-4 text-base font-semibold text-fresh-charcoal">
              <Link
                href="#home"
                onClick={() => setIsMobileMenuOpen(false)}
                className="hover:text-fresh-orange py-1"
              >
                Home
              </Link>
              <Link
                href="#showcase"
                onClick={() => setIsMobileMenuOpen(false)}
                className="hover:text-fresh-orange py-1"
              >
                3D Experience
              </Link>
              <Link
                href="#menu"
                onClick={() => setIsMobileMenuOpen(false)}
                className="hover:text-fresh-orange py-1"
              >
                Menu
              </Link>
              <Link
                href="#benefits"
                onClick={() => setIsMobileMenuOpen(false)}
                className="hover:text-fresh-orange py-1"
              >
                Benefits
              </Link>
              <Link
                href="#loyalty"
                onClick={() => setIsMobileMenuOpen(false)}
                className="hover:text-fresh-orange py-1 flex items-center gap-2"
              >
                <Award className="w-4 h-4 text-fresh-orange" />
                Rewards
              </Link>
              <Link
                href="#about"
                onClick={() => setIsMobileMenuOpen(false)}
                className="hover:text-fresh-orange py-1"
              >
                About
              </Link>
              <Link
                href="#contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="hover:text-fresh-orange py-1"
              >
                Contact
              </Link>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    toggleAI();
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-fresh-orange/10 text-fresh-orange font-bold text-sm"
                >
                  <Bot className="w-4 h-4" />
                  Ask FreshSip AI
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    toggleAuth();
                  }}
                  className="text-sm font-bold text-fresh-charcoal hover:underline"
                >
                  {user ? user.name : 'Sign In'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
