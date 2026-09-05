'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useFreshSipStore } from '@/lib/store';
import {
  Package,
  ShoppingBag,
  TrendingUp,
  Users,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  Search,
  ArrowLeft,
  AlertTriangle,
} from 'lucide-react';
import { OrderStatus, Product } from '@/types';

export default function AdminDashboard() {
  const products = useFreshSipStore((state) => state.products);
  const orders = useFreshSipStore((state) => state.orders);
  const addProduct = useFreshSipStore((state) => state.addProduct);
  const deleteProduct = useFreshSipStore((state) => state.deleteProduct);
  const updateOrderStatus = useFreshSipStore((state) => state.updateOrderStatus);

  const [activeTab, setActiveTab] = useState<'analytics' | 'products' | 'orders' | 'inventory'>('analytics');
  const [orderSearch, setOrderSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');

  // Stats Calculations
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;
  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
  const activeProducts = products.filter((p) => p.available).length;

  const STATUS_COLORS: Record<OrderStatus, string> = {
    Pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    Confirmed: 'bg-blue-100 text-blue-800 border-blue-300',
    Preparing: 'bg-purple-100 text-purple-800 border-purple-300',
    Ready: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    'Out for Delivery': 'bg-amber-100 text-amber-800 border-amber-300',
    Delivered: 'bg-green-100 text-green-800 border-green-300',
    Cancelled: 'bg-red-100 text-red-800 border-red-300',
  };

  const ALL_STATUSES: OrderStatus[] = [
    'Pending',
    'Confirmed',
    'Preparing',
    'Ready',
    'Out for Delivery',
    'Delivered',
    'Cancelled',
  ];

  return (
    <div className="min-h-screen bg-fresh-softBg text-fresh-charcoal">
      {/* Top Admin Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="p-2 rounded-xl bg-fresh-softBg hover:bg-gray-200 text-fresh-charcoal transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Exit to Store</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-xl">🍊</span>
            <h1 className="font-display font-extrabold text-xl tracking-tight">
              FreshSip <span className="text-fresh-orange">Admin Studio</span>
            </h1>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex items-center gap-2 bg-fresh-softBg p-1.5 rounded-2xl border border-gray-200">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'analytics'
                ? 'bg-fresh-charcoal text-white shadow-sm'
                : 'text-fresh-gray hover:text-fresh-charcoal'
            }`}
          >
            Analytics
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'orders'
                ? 'bg-fresh-charcoal text-white shadow-sm'
                : 'text-fresh-gray hover:text-fresh-charcoal'
            }`}
          >
            Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'products'
                ? 'bg-fresh-charcoal text-white shadow-sm'
                : 'text-fresh-gray hover:text-fresh-charcoal'
            }`}
          >
            Products ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'inventory'
                ? 'bg-fresh-charcoal text-white shadow-sm'
                : 'text-fresh-gray hover:text-fresh-charcoal'
            }`}
          >
            Inventory
          </button>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto p-6 space-y-8">
        {/* STATS OVERVIEW CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs text-fresh-gray font-medium block">Total Revenue</span>
              <span className="text-3xl font-display font-extrabold text-fresh-charcoal mt-1 block">
                ₹{totalRevenue}
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-fresh-green/10 text-fresh-green flex items-center justify-center text-xl font-bold">
              ₹
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs text-fresh-gray font-medium block">Total Orders</span>
              <span className="text-3xl font-display font-extrabold text-fresh-charcoal mt-1 block">
                {totalOrders}
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-fresh-orange/10 text-fresh-orange flex items-center justify-center text-xl font-bold">
              <ShoppingBag className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs text-fresh-gray font-medium block">Avg. Order Value</span>
              <span className="text-3xl font-display font-extrabold text-fresh-charcoal mt-1 block">
                ₹{avgOrderValue}
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-fresh-yellow/20 text-amber-600 flex items-center justify-center text-xl font-bold">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs text-fresh-gray font-medium block">Active Juices</span>
              <span className="text-3xl font-display font-extrabold text-fresh-charcoal mt-1 block">
                {activeProducts}
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-fresh-pink/10 text-fresh-pink flex items-center justify-center text-xl font-bold">
              <Package className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* TAB 1: ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
              <h3 className="font-display font-extrabold text-xl text-fresh-charcoal">
                Weekly Revenue Progression
              </h3>
              <div className="h-64 flex items-end justify-between gap-4 pt-8 px-4 border-b border-gray-200 pb-2">
                {[
                  { day: 'Mon', val: 3200 },
                  { day: 'Tue', val: 4500 },
                  { day: 'Wed', val: 5100 },
                  { day: 'Thu', val: 4800 },
                  { day: 'Fri', val: 6800 },
                  { day: 'Sat', val: 9200 },
                  { day: 'Sun', val: 11400 },
                ].map((item, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                    <div
                      className="w-full rounded-t-xl bg-gradient-to-t from-fresh-orange to-fresh-yellow hover:opacity-90 transition-all"
                      style={{ height: `${(item.val / 12000) * 100}%` }}
                    />
                    <span className="text-xs font-bold text-fresh-gray">{item.day}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-4 bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-4">
              <h3 className="font-display font-extrabold text-xl text-fresh-charcoal">
                Top Selling Juices
              </h3>
              <div className="space-y-3">
                {products.slice(0, 5).map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-3 rounded-2xl bg-fresh-softBg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden relative bg-white">
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-fresh-charcoal">{p.name}</h4>
                        <span className="text-[10px] text-fresh-gray">{p.category}</span>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold text-fresh-orange">₹{p.price}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <h3 className="font-display font-extrabold text-xl text-fresh-charcoal">
                Customer Orders ({orders.length})
              </h3>
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter order ID or customer..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-fresh-softBg rounded-xl text-xs text-fresh-charcoal focus:outline-none"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="pb-3">Order ID</th>
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">Items</th>
                    <th className="pb-3">Total</th>
                    <th className="pb-3">Payment</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders
                    .filter((o) =>
                      o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
                      o.customerName.toLowerCase().includes(orderSearch.toLowerCase())
                    )
                    .map((ord) => (
                      <tr key={ord.id} className="hover:bg-fresh-softBg/50 transition-colors">
                        <td className="py-4 font-mono font-bold text-fresh-charcoal">{ord.id}</td>
                        <td className="py-4 font-semibold text-fresh-charcoal">
                          {ord.customerName}
                          <span className="text-[10px] text-gray-400 block">{ord.customerEmail}</span>
                        </td>
                        <td className="py-4 text-fresh-gray">
                          {ord.items.map((i) => `${i.quantity}x ${i.product.name}`).join(', ')}
                        </td>
                        <td className="py-4 font-extrabold text-fresh-charcoal">₹{ord.total}</td>
                        <td className="py-4 font-medium text-fresh-gray">{ord.paymentMethod}</td>
                        <td className="py-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${STATUS_COLORS[ord.orderStatus]}`}>
                            {ord.orderStatus}
                          </span>
                        </td>
                        <td className="py-4">
                          <select
                            value={ord.orderStatus}
                            onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                            className="px-2 py-1 bg-white border border-gray-200 rounded-lg text-xs font-semibold focus:outline-none"
                          >
                            {ALL_STATUSES.map((st) => (
                              <option key={st} value={st}>
                                {st}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: PRODUCTS MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <h3 className="font-display font-extrabold text-xl text-fresh-charcoal">
                Juice Menu Catalog ({products.length})
              </h3>
              <button className="px-5 py-2.5 rounded-xl bg-fresh-orange text-white text-xs font-bold flex items-center gap-1.5 shadow-sm">
                <Plus className="w-4 h-4" />
                <span>Add New Juice</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((prod) => (
                <div key={prod.id} className="bg-fresh-softBg rounded-2xl p-4 border border-gray-200 flex justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-xl overflow-hidden relative bg-white border border-gray-100 shrink-0">
                      <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-fresh-charcoal">{prod.name}</h4>
                      <span className="text-[10px] text-fresh-orange font-bold">{prod.category}</span>
                      <span className="text-xs font-extrabold text-fresh-charcoal block mt-0.5">₹{prod.price}</span>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between items-end">
                    <button
                      onClick={() => deleteProduct(prod.id)}
                      className="p-1.5 text-gray-400 hover:text-fresh-pink transition-colors"
                      title="Delete Product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <span className="px-2 py-0.5 rounded-md bg-fresh-green/10 text-fresh-green text-[10px] font-bold">
                      {prod.stock} in stock
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: INVENTORY TRACKER */}
        {activeTab === 'inventory' && (
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 space-y-6">
            <h3 className="font-display font-extrabold text-xl text-fresh-charcoal">
              Fruit & Bottle Raw Inventory
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { name: 'Alphonso Mangoes', stock: '240 kg', status: 'Healthy' },
                { name: 'Valencia Oranges', stock: '180 kg', status: 'Healthy' },
                { name: 'Glass Bottles (250ml)', stock: '450 units', status: 'Healthy' },
                { name: 'Organic Kale & Spinach', stock: '15 kg', status: 'Low Stock' },
              ].map((inv, idx) => (
                <div key={idx} className="bg-fresh-softBg p-4 rounded-2xl border border-gray-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-fresh-charcoal">{inv.name}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        inv.status === 'Low Stock'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {inv.status}
                    </span>
                  </div>
                  <span className="text-xl font-extrabold text-fresh-charcoal block">{inv.stock}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
