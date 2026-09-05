'use client';

import React, { useState } from 'react';
import { useFreshSipStore } from '@/lib/store';
import { X, CheckCircle, CreditCard, MapPin, User, ShieldCheck, ArrowRight, Sparkles, Truck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Order } from '@/types';

export function CheckoutModal() {
  const isCheckoutOpen = useFreshSipStore((state) => state.isCheckoutOpen);
  const toggleCheckout = useFreshSipStore((state) => state.toggleCheckout);
  const cart = useFreshSipStore((state) => state.cart);
  const user = useFreshSipStore((state) => state.user);
  const discountPercentage = useFreshSipStore((state) => state.discountPercentage);
  const placeOrder = useFreshSipStore((state) => state.placeOrder);

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [paymentMethod, setPaymentMethod] = useState<'Razorpay' | 'Stripe' | 'Cash on Delivery'>('Razorpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Form Fields
  const [formData, setFormData] = useState({
    name: user?.name || 'Alex Morgan',
    email: user?.email || 'alex@freshsip.com',
    phone: '+91 98765 43210',
    address: '42 Ocean Drive, Apt 4B',
    city: 'Mumbai',
    state: 'Maharashtra',
    zip: '400050',
  });

  if (!isCheckoutOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.itemTotal, 0);
  const discountAmount = Math.round((subtotal * discountPercentage) / 100);
  const deliveryFee = subtotal > 500 ? 0 : 40;
  const total = Math.max(0, subtotal - discountAmount + deliveryFee);

  const handlePayAndConfirm = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const newOrder = placeOrder(formData, paymentMethod);
      setIsProcessing(false);
      setCompletedOrder(newOrder);

      // Trigger Confetti Celebration
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });
    }, 1800);
  };

  const handleClose = () => {
    setCompletedOrder(null);
    setStep(1);
    toggleCheckout(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9800] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative border border-gray-100 p-6 sm:p-8"
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-fresh-charcoal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* CONFIRMATION SCREEN */}
          {completedOrder ? (
            <div className="text-center py-6 space-y-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-fresh-green to-emerald-400 flex items-center justify-center text-4xl mx-auto shadow-glow-green text-white">
                🍊
              </div>

              <div className="space-y-2">
                <span className="px-4 py-1.5 rounded-full bg-fresh-green/10 text-fresh-green text-xs font-extrabold uppercase tracking-wide">
                  Order Confirmed!
                </span>
                <h2 className="text-3xl font-display font-extrabold text-fresh-charcoal pt-2">
                  Your Freshness is On The Way!
                </h2>
                <p className="text-xs text-fresh-gray max-w-md mx-auto">
                  We are cold-pressing your items. Order ID: <span className="font-mono font-bold text-fresh-charcoal">{completedOrder.id}</span>
                </p>
              </div>

              {/* Order Info Summary Box */}
              <div className="bg-fresh-softBg rounded-2xl p-5 border border-gray-200 text-left space-y-3 text-xs">
                <div className="flex justify-between border-b border-gray-200 pb-2 font-bold text-fresh-charcoal">
                  <span>Estimated Delivery</span>
                  <span className="text-fresh-orange flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5" /> 30-40 minutes
                  </span>
                </div>
                <div className="space-y-1 text-fresh-gray">
                  {completedOrder.items.map((it) => (
                    <div key={it.id} className="flex justify-between">
                      <span>{it.quantity}x {it.product.name} ({it.selectedSize})</span>
                      <span className="font-semibold text-fresh-charcoal">₹{it.itemTotal}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200 font-extrabold text-fresh-charcoal text-sm">
                  <span>Total Paid ({completedOrder.paymentMethod})</span>
                  <span className="text-fresh-orange">₹{completedOrder.total}</span>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="w-full py-4 rounded-2xl bg-fresh-charcoal text-white font-semibold text-xs hover:bg-fresh-orange shadow-lg transition-colors"
              >
                Back to FreshSip Home
              </button>
            </div>
          ) : (
            /* CHECKOUT STEPS */
            <div className="space-y-6">
              {/* Stepper Header */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <h3 className="font-display font-extrabold text-xl text-fresh-charcoal">
                  FreshSip Checkout
                </h3>
                <span className="text-xs font-bold text-fresh-orange uppercase tracking-wider">
                  Step {step} of 3
                </span>
              </div>

              {/* STEP 1: CUSTOMER & ADDRESS */}
              {step === 1 && (
                <div className="space-y-4">
                  <h4 className="text-xs uppercase font-bold tracking-wider text-fresh-charcoal flex items-center gap-1.5">
                    <User className="w-4 h-4 text-fresh-orange" /> Delivery Information
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="px-4 py-3 bg-fresh-softBg rounded-xl text-xs font-medium border border-gray-200 focus:outline-none focus:border-fresh-orange"
                    />
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="px-4 py-3 bg-fresh-softBg rounded-xl text-xs font-medium border border-gray-200 focus:outline-none focus:border-fresh-orange"
                    />
                  </div>

                  <input
                    type="text"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-fresh-softBg rounded-xl text-xs font-medium border border-gray-200 focus:outline-none focus:border-fresh-orange"
                  />

                  <input
                    type="text"
                    placeholder="Street Address, Building, Apartment"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-3 bg-fresh-softBg rounded-xl text-xs font-medium border border-gray-200 focus:outline-none focus:border-fresh-orange"
                  />

                  <div className="grid grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="City"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="px-4 py-3 bg-fresh-softBg rounded-xl text-xs font-medium border border-gray-200 focus:outline-none focus:border-fresh-orange"
                    />
                    <input
                      type="text"
                      placeholder="State"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="px-4 py-3 bg-fresh-softBg rounded-xl text-xs font-medium border border-gray-200 focus:outline-none focus:border-fresh-orange"
                    />
                    <input
                      type="text"
                      placeholder="Zipcode"
                      value={formData.zip}
                      onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                      className="px-4 py-3 bg-fresh-softBg rounded-xl text-xs font-medium border border-gray-200 focus:outline-none focus:border-fresh-orange"
                    />
                  </div>

                  <button
                    onClick={() => setStep(2)}
                    className="w-full py-4 rounded-2xl bg-fresh-charcoal text-white font-semibold text-xs hover:bg-fresh-orange transition-colors flex items-center justify-center gap-2 mt-4"
                  >
                    <span>Continue to Order Summary</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* STEP 2: SUMMARY */}
              {step === 2 && (
                <div className="space-y-4">
                  <h4 className="text-xs uppercase font-bold tracking-wider text-fresh-charcoal">
                    Order Summary ({cart.length} Items)
                  </h4>

                  <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center bg-fresh-softBg p-3 rounded-xl text-xs"
                      >
                        <div>
                          <span className="font-bold text-fresh-charcoal">
                            {item.quantity}x {item.product.name}
                          </span>
                          <span className="text-[10px] text-gray-400 block">
                            Size: {item.selectedSize}
                          </span>
                        </div>
                        <span className="font-extrabold text-fresh-charcoal">₹{item.itemTotal}</span>
                      </div>
                    ))}
                  </div>

                  <div className="bg-gray-50 p-4 rounded-2xl space-y-1.5 text-xs text-fresh-gray">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-bold text-fresh-charcoal">₹{subtotal}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-fresh-pink">
                        <span>Discount</span>
                        <span className="font-bold">-₹{discountAmount}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Delivery</span>
                      <span className="font-bold text-fresh-charcoal">
                        {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm font-extrabold text-fresh-charcoal pt-2 border-t border-gray-200">
                      <span>Total</span>
                      <span className="text-fresh-orange text-lg">₹{total}</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setStep(1)}
                      className="w-1/3 py-3.5 rounded-2xl bg-gray-100 text-fresh-charcoal font-semibold text-xs hover:bg-gray-200"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setStep(3)}
                      className="w-2/3 py-3.5 rounded-2xl bg-fresh-charcoal text-white font-semibold text-xs hover:bg-fresh-orange transition-colors flex items-center justify-center gap-2"
                    >
                      <span>Proceed to Payment</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: PAYMENT & CONFIRMATION */}
              {step === 3 && (
                <div className="space-y-4">
                  <h4 className="text-xs uppercase font-bold tracking-wider text-fresh-charcoal flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-fresh-orange" /> Choose Payment Gateway
                  </h4>

                  <div className="space-y-2">
                    {(['Razorpay', 'Stripe', 'Cash on Delivery'] as const).map((method) => (
                      <label
                        key={method}
                        onClick={() => setPaymentMethod(method)}
                        className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                          paymentMethod === method
                            ? 'bg-fresh-orange/10 border-fresh-orange text-fresh-charcoal font-bold'
                            : 'bg-fresh-softBg border-gray-200 text-fresh-gray hover:border-fresh-orange'
                        }`}
                      >
                        <div className="flex items-center gap-3 text-xs">
                          <CreditCard className="w-4 h-4 text-fresh-orange" />
                          <span>{method}</span>
                        </div>
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === method}
                          onChange={() => setPaymentMethod(method)}
                          className="accent-fresh-orange"
                        />
                      </label>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-gray-400 block font-medium">Final Amount</span>
                      <span className="text-2xl font-extrabold text-fresh-orange">₹{total}</span>
                    </div>

                    <button
                      onClick={handlePayAndConfirm}
                      disabled={isProcessing}
                      className="px-8 py-4 rounded-2xl bg-fresh-orange text-white font-semibold text-xs hover:bg-fresh-charcoal shadow-glow-orange disabled:opacity-50 transition-all flex items-center gap-2"
                    >
                      {isProcessing ? (
                        <span>Securing Payment...</span>
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4" />
                          <span>Pay & Place Order</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
