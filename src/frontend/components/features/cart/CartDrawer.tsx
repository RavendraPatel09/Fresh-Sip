'use client';

import React, { useState } from 'react';
import { useFreshSipStore } from '@/lib/store';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function CartDrawer() {
  const isCartOpen = useFreshSipStore((state) => state.isCartOpen);
  const toggleCart = useFreshSipStore((state) => state.toggleCart);
  const cart = useFreshSipStore((state) => state.cart);
  const updateQuantity = useFreshSipStore((state) => state.updateQuantity);
  const removeFromCart = useFreshSipStore((state) => state.removeFromCart);
  const toggleCheckout = useFreshSipStore((state) => state.toggleCheckout);
  const couponCode = useFreshSipStore((state) => state.couponCode);
  const discountPercentage = useFreshSipStore((state) => state.discountPercentage);
  const applyCoupon = useFreshSipStore((state) => state.applyCoupon);

  const [inputCoupon, setInputCoupon] = useState('');
  const [couponError, setCouponError] = useState(false);

  if (!isCartOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.itemTotal, 0);
  const discountAmount = Math.round((subtotal * discountPercentage) / 100);
  const deliveryFee = subtotal > 500 || subtotal === 0 ? 0 : 40;
  const total = Math.max(0, subtotal - discountAmount + deliveryFee);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const success = applyCoupon(inputCoupon);
    if (success) {
      setCouponError(false);
      setInputCoupon('');
    } else {
      setCouponError(true);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9600] flex justify-end bg-black/50 backdrop-blur-xs">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 250 }}
          className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-gray-100"
        >
          {/* Header */}
          <div className="p-4 sm:p-6 bg-fresh-softBg border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-fresh-orange" />
              <h3 className="font-display font-extrabold text-lg text-fresh-charcoal">
                Your Fresh Cart ({cart.reduce((sum, i) => sum + i.quantity, 0)})
              </h3>
            </div>
            <button
              onClick={() => toggleCart(false)}
              className="p-2 rounded-full hover:bg-gray-200 text-fresh-charcoal transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
            {cart.length > 0 ? (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-fresh-softBg rounded-2xl p-4 border border-gray-200/70 flex gap-4 items-center justify-between"
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden relative shrink-0 bg-white border border-gray-100">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-fresh-charcoal truncate">
                      {item.product.name}
                    </h4>
                    <span className="text-[11px] font-semibold text-fresh-orange block">
                      Size: {item.selectedSize}
                    </span>
                    <span className="text-xs font-extrabold text-fresh-charcoal mt-1 block">
                      ₹{item.itemTotal}
                    </span>
                  </div>

                  {/* Quantity Actions */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center border border-gray-300 rounded-lg bg-white">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-1 hover:bg-gray-100 text-fresh-charcoal"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-bold text-fresh-charcoal">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-1 hover:bg-gray-100 text-fresh-charcoal"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-1.5 text-gray-400 hover:text-fresh-pink transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16">
                <div className="text-4xl mb-2">🍹</div>
                <h4 className="text-base font-bold text-fresh-charcoal">Your cart is empty</h4>
                <p className="text-xs text-fresh-gray mt-1">
                  Add some freshly cold-pressed juice or artisanal smoothies to get started!
                </p>
              </div>
            )}
          </div>

          {/* Footer & Checkout Action */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-6 bg-white border-t border-gray-200 space-y-4">
              {/* Promo Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Coupon (e.g. FRESH20)"
                    value={inputCoupon}
                    onChange={(e) => setInputCoupon(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-fresh-softBg rounded-xl text-xs uppercase font-bold text-fresh-charcoal border border-gray-200 focus:outline-none focus:border-fresh-orange"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-fresh-charcoal text-white rounded-xl text-xs font-semibold hover:bg-fresh-orange transition-colors"
                >
                  Apply
                </button>
              </form>

              {couponCode && (
                <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-fresh-green/10 text-fresh-green text-xs font-semibold">
                  <span className="flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Code {couponCode} applied ({discountPercentage}% OFF)
                  </span>
                  <span>-₹{discountAmount}</span>
                </div>
              )}

              {couponError && (
                <p className="text-[11px] text-fresh-pink font-semibold">
                  Invalid coupon code. Try FRESH20 for 20% OFF!
                </p>
              )}

              {/* Price Calculation Breakdown */}
              <div className="space-y-1.5 text-xs text-fresh-gray pt-2 border-t border-gray-100">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-fresh-charcoal">₹{subtotal}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-fresh-pink">
                    <span>Discount ({discountPercentage}%)</span>
                    <span className="font-bold">-₹{discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="font-bold text-fresh-charcoal">
                    {deliveryFee === 0 ? 'FREE (Orders > ₹500)' : `₹${deliveryFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-fresh-charcoal pt-2 border-t border-gray-200">
                  <span>Total Amount</span>
                  <span className="text-fresh-orange text-xl">₹{total}</span>
                </div>
              </div>

              {/* Proceed to Checkout Button */}
              <button
                onClick={() => {
                  toggleCart(false);
                  toggleCheckout(true);
                }}
                className="w-full py-4 rounded-2xl bg-fresh-orange text-white font-semibold text-sm hover:bg-fresh-charcoal shadow-glow-orange transition-all flex items-center justify-center gap-2 group"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
