'use client';

import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, Check } from 'lucide-react';

export function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (contactForm.email) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setContactForm({ name: '', email: '', message: '' });
      }, 4000);
    }
  };

  return (
    <section id="contact" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Store Info & Interactive Map Mockup */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-fresh-orange">
              Store Locator & Contact
            </span>
            <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-fresh-charcoal tracking-tight">
              Visit FreshSip Flagship.
            </h2>
            <p className="text-fresh-gray text-sm leading-relaxed">
              Step into our modern juice laboratory to sample raw cold-pressed flights, talk with our juice sommeliers, or pick up your online order.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-fresh-orange shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-sm text-fresh-charcoal">Location</h4>
                  <p className="text-xs text-fresh-gray">108 Ocean Drive, Juice District, Bandra West, Mumbai 400050</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-fresh-orange shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-sm text-fresh-charcoal">Phone & Support</h4>
                  <p className="text-xs text-fresh-gray">+91 98765 43210 (Direct Order Hotline)</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-fresh-green shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-sm text-fresh-charcoal">Operating Hours</h4>
                  <p className="text-xs text-fresh-gray">Monday – Sunday: 7:00 AM – 11:00 PM IST</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-6 bg-fresh-softBg rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-sm">
            <h3 className="text-2xl font-display font-extrabold text-fresh-charcoal mb-4">
              Send Us a Message
            </h3>

            {submitted ? (
              <div className="p-6 bg-fresh-green/10 text-fresh-green rounded-2xl text-center space-y-2">
                <Check className="w-8 h-8 mx-auto" />
                <h4 className="font-bold text-sm">Message Sent Successfully!</h4>
                <p className="text-xs">Thank you! Our team will respond within 2 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-fresh-charcoal block mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Jane Doe"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    className="w-full px-4 py-3 bg-white rounded-xl text-xs text-fresh-charcoal border border-gray-200 focus:outline-none focus:border-fresh-orange"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-fresh-charcoal block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="jane@example.com"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="w-full px-4 py-3 bg-white rounded-xl text-xs text-fresh-charcoal border border-gray-200 focus:outline-none focus:border-fresh-orange"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-fresh-charcoal block mb-1">Message</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Ask about bulk catering, franchise opportunities, or feedback..."
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    className="w-full px-4 py-3 bg-white rounded-xl text-xs text-fresh-charcoal border border-gray-200 focus:outline-none focus:border-fresh-orange resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-fresh-orange text-white font-semibold text-xs hover:bg-fresh-charcoal shadow-glow-orange transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
