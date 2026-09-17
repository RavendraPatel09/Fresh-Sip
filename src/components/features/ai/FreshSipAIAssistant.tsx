'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useFreshSipStore } from '@/lib/store';
import { X, Send, Bot, Sparkles, ShoppingBag, ArrowRight, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const QUICK_PROMPTS = [
  'Suggest a juice for workout recovery',
  'Which juices have the least sugar?',
  'What is inside Mango Burst?',
  'Add 2 Mango Bursts to my cart',
];

export function FreshSipAIAssistant() {
  const isAIOpen = useFreshSipStore((state) => state.isAIOpen);
  const toggleAI = useFreshSipStore((state) => state.toggleAI);
  const addToCart = useFreshSipStore((state) => state.addToCart);
  const products = useFreshSipStore((state) => state.products);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<
    Array<{ id: string; sender: 'user' | 'assistant'; text: string; timestamp: string }>
  >([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: "Hello! I am FreshSip AI 🍊, your personal juice sommelier and health assistant. Ask me anything about our ingredients, nutrition, health recommendations, or ask me to add juices directly to your cart!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg = {
      id: `usr-${Date.now()}`,
      sender: 'user' as const,
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const historyForAPI = messages.map((m) => ({ sender: m.sender, text: m.text }));

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query, history: historyForAPI }),
      });

      const data = await res.json();
      let responseText = data.text || "I'm having trouble retrieving details right now. Please try asking again!";

      // Check for structured cart action marker [ACTION: ...]
      const actionMatch = responseText.match(/\[ACTION:\s*({.*?})\]/);
      if (actionMatch) {
        try {
          const actionObj = JSON.parse(actionMatch[1]);
          if (actionObj.type === 'ADD_TO_CART' && actionObj.productId) {
            const targetProd = products.find((p) => p.id === actionObj.productId) || products[0];
            addToCart(targetProd, actionObj.size || '250ml', actionObj.quantity || 1);
          }
        } catch (e) {
          console.error('Failed to parse AI action payload', e);
        }
        // Remove action tag from display text
        responseText = responseText.replace(/\[ACTION:.*?\]/, '').trim();
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          text: responseText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'assistant',
          text: "FreshSip AI is taking a quick break. You can still explore our menu and filter by health goals!",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isAIOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9500] flex justify-end bg-black/50 backdrop-blur-xs">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 250 }}
          className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-gray-100"
        >
          {/* Header */}
          <div className="p-4 sm:p-6 bg-gradient-to-r from-fresh-orange to-fresh-yellow text-white flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-xl shadow-inner">
                🤖
              </div>
              <div>
                <h3 className="font-display font-bold text-lg leading-tight flex items-center gap-1.5">
                  FreshSip AI
                  <Sparkles className="w-4 h-4 text-white animate-pulse" />
                </h3>
                <p className="text-xs text-white/90">Powered by Google Gemini 1.5</p>
              </div>
            </div>
            <button
              onClick={() => toggleAI(false)}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-fresh-softBg/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-fresh-orange/20 flex items-center justify-center text-sm shrink-0 mt-1">
                    🍊
                  </div>
                )}

                <div
                  className={`max-w-[82%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-fresh-charcoal text-white rounded-br-none'
                      : 'bg-white text-fresh-charcoal border border-gray-200/80 rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                  <span
                    className={`text-[10px] block mt-1.5 text-right font-medium ${
                      msg.sender === 'user' ? 'text-gray-400' : 'text-gray-400'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-fresh-charcoal text-white flex items-center justify-center text-xs shrink-0 mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-fresh-orange/20 flex items-center justify-center text-sm shrink-0">
                  🍊
                </div>
                <div className="bg-white p-3 rounded-2xl border border-gray-200 text-xs text-fresh-gray flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-fresh-orange animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-fresh-yellow animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 rounded-full bg-fresh-pink animate-bounce [animation-delay:0.4s]" />
                  <span>Formulating response...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Pills */}
          <div className="px-4 py-2 bg-white border-t border-gray-100 flex gap-2 overflow-x-auto scrollbar-none">
            {QUICK_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                className="px-3 py-1.5 rounded-full bg-fresh-softBg hover:bg-fresh-orange/10 text-fresh-charcoal hover:text-fresh-orange text-[11px] font-medium whitespace-nowrap transition-colors border border-gray-200 shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-4 bg-white border-t border-gray-100 flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask about juices, calories, workout goals..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 px-4 py-3 bg-fresh-softBg rounded-2xl text-xs sm:text-sm text-fresh-charcoal focus:outline-none focus:ring-2 focus:ring-fresh-orange/40"
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className="p-3 rounded-2xl bg-fresh-orange text-white hover:bg-fresh-charcoal disabled:opacity-40 transition-colors shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
