'use client';

import React, { useState } from 'react';
import { useFreshSipStore } from '@/lib/store';
import { X, User, Mail, Award, LogOut, Package, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function AuthModal() {
  const isAuthOpen = useFreshSipStore((state) => state.isAuthOpen);
  const toggleAuth = useFreshSipStore((state) => state.toggleAuth);
  const user = useFreshSipStore((state) => state.user);
  const login = useFreshSipStore((state) => state.login);
  const logout = useFreshSipStore((state) => state.logout);
  const orders = useFreshSipStore((state) => state.orders);

  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');

  if (!isAuthOpen) return null;

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      login(nameInput.trim() || 'Alex Morgan', emailInput.trim());
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9700] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-3xl max-w-md w-full shadow-2xl relative border border-gray-100 p-6 sm:p-8"
        >
          <button
            onClick={() => toggleAuth(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-fresh-charcoal"
          >
            <X className="w-5 h-5" />
          </button>

          {user ? (
            /* USER PROFILE VIEW */
            <div className="space-y-6">
              <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-fresh-orange to-fresh-pink flex items-center justify-center text-2xl text-white font-bold shadow-md">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-display font-extrabold text-lg text-fresh-charcoal">
                    {user.name}
                  </h3>
                  <p className="text-xs text-fresh-gray">{user.email}</p>
                  <span className="inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 rounded-full bg-fresh-orange/10 text-fresh-orange text-[10px] font-extrabold">
                    <Award className="w-3 h-3" /> Tier: {user.loyaltyTier} ({user.loyaltyPoints} pts)
                  </span>
                </div>
              </div>

              {/* Order History */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-fresh-charcoal flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-fresh-orange" /> Recent Orders ({orders.length})
                </h4>

                <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                  {orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="bg-fresh-softBg p-3 rounded-xl text-xs flex justify-between items-center"
                    >
                      <div>
                        <span className="font-bold text-fresh-charcoal block">{ord.id}</span>
                        <span className="text-[10px] text-gray-400">
                          {new Date(ord.createdAt).toLocaleDateString()} • {ord.items.length} items
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-extrabold text-fresh-charcoal block">₹{ord.total}</span>
                        <span className="text-[10px] text-fresh-green font-semibold">
                          {ord.orderStatus}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={logout}
                className="w-full py-3 rounded-2xl bg-fresh-pink/10 hover:bg-fresh-pink/20 text-fresh-pink font-semibold text-xs transition-colors flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          ) : (
            /* SIGN IN FORM */
            <form onSubmit={handleSignIn} className="space-y-6">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-fresh-orange/10 text-fresh-orange flex items-center justify-center text-xl mx-auto mb-2">
                  🍊
                </div>
                <h3 className="font-display font-extrabold text-2xl text-fresh-charcoal">
                  Welcome to FreshSip
                </h3>
                <p className="text-xs text-fresh-gray">
                  Sign in to earn rewards, track orders, and save your favorite juice blends.
                </p>
              </div>

              <div className="space-y-3">
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-fresh-softBg rounded-xl text-xs font-medium border border-gray-200 focus:outline-none focus:border-fresh-orange"
                  />
                </div>

                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-fresh-softBg rounded-xl text-xs font-medium border border-gray-200 focus:outline-none focus:border-fresh-orange"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-fresh-orange text-white font-semibold text-xs hover:bg-fresh-charcoal shadow-glow-orange transition-colors"
              >
                Sign In & Unlock Rewards
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
