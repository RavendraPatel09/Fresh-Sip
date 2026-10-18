'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useFreshSipStore } from '@/frontend/state';
import {
  X,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Award,
  LogOut,
  Package,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  KeyRound,
  Edit2,
  RefreshCw,
  Phone,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function AuthModal() {
  const isAuthOpen = useFreshSipStore((state) => state.isAuthOpen);
  const toggleAuth = useFreshSipStore((state) => state.toggleAuth);
  const user = useFreshSipStore((state) => state.user);
  const setUser = useFreshSipStore((state) => state.setUser);
  const logout = useFreshSipStore((state) => state.logout);
  const refreshSession = useFreshSipStore((state) => state.refreshSession);
  const orders = useFreshSipStore((state) => state.orders);

  type AuthTab = 'login' | 'signup' | 'forgot' | 'reset' | 'profile' | 'change_password' | 'edit_profile';
  const [tab, setTab] = useState<AuthTab>('login');

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Status & loading states
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [devResetUrl, setDevResetUrl] = useState<string | null>(null);

  // Sync session on mount & check for URL reset tokens
  useEffect(() => {
    refreshSession();

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlToken = params.get('resetToken');
      const urlEmail = params.get('email');
      if (urlToken && urlEmail) {
        setResetToken(urlToken);
        setEmail(urlEmail);
        setTab('reset');
        toggleAuth(true);
      }
    }
  }, [refreshSession, toggleAuth]);

  // When user signs in or out, update the active tab
  useEffect(() => {
    if (user) {
      if (tab !== 'change_password' && tab !== 'edit_profile') {
        setTab('profile');
      }
      setName(user.name);
      setEmail(user.email);
      setPhone(user.phone || '');
    } else if (tab === 'profile' || tab === 'change_password' || tab === 'edit_profile') {
      setTab('login');
    }
  }, [user, tab]);

  // Reset errors when switching tabs
  const switchTab = (newTab: AuthTab) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setDevResetUrl(null);
    setTab(newTab);
  };

  if (!isAuthOpen) return null;

  // 1. Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email.trim() || !password) {
      setErrorMsg('Please enter both your email and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password, rememberMe }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || 'Failed to sign in. Please verify your credentials.');
        return;
      }

      setUser(data.user);
      setSuccessMsg(data.message || 'Logged in successfully!');
      setPassword('');
      setTab('profile');
    } catch {
      setErrorMsg('Network error. Unable to reach server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Handle Sign Up
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!name.trim() || name.trim().length < 2) {
      setErrorMsg('Please enter your full name (minimum 2 characters).');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
          confirmPassword,
          phone: phone.trim(),
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || 'Registration failed.');
        return;
      }

      setUser(data.user);
      setSuccessMsg('Welcome to FreshSip! Your account is active.');
      setPassword('');
      setConfirmPassword('');
      setTab('profile');
    } catch {
      setErrorMsg('Network error. Unable to connect to server.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Handle Forgot Password
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setDevResetUrl(null);

    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || 'Failed to request password reset.');
        return;
      }

      setSuccessMsg(data.message);
      if (data.devResetLink) {
        setDevResetUrl(data.devResetLink);
      }
    } catch {
      setErrorMsg('Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // 4. Handle Reset Password Execution
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (password.length < 8) {
      setErrorMsg('New password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          token: resetToken.trim(),
          newPassword: password,
          confirmPassword,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || 'Failed to reset password.');
        return;
      }

      setSuccessMsg(data.message);
      setPassword('');
      setConfirmPassword('');
      setTimeout(() => switchTab('login'), 2500);
    } catch {
      setErrorMsg('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // 5. Handle Update Profile
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    setLoading(true);
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), phone: phone.trim() }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || 'Failed to update profile.');
        return;
      }

      setUser(data.user);
      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => setTab('profile'), 1500);
    } catch {
      setErrorMsg('Failed to connect to server.');
    } finally {
      setLoading(false);
    }
  };

  // 6. Handle Change Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!currentPassword || !password || !confirmPassword) {
      setErrorMsg('Please complete all password fields.');
      return;
    }
    if (password.length < 8) {
      setErrorMsg('New password must be at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('New password and confirmation do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newPassword: password,
          confirmPassword,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || 'Failed to change password.');
        return;
      }

      setSuccessMsg('Password changed successfully!');
      setCurrentPassword('');
      setPassword('');
      setConfirmPassword('');
      setTimeout(() => setTab('profile'), 1800);
    } catch {
      setErrorMsg('Network error while updating password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9700] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-white rounded-3xl max-w-md w-full shadow-2xl relative border border-gray-100 p-6 sm:p-8 max-h-[92vh] overflow-y-auto"
        >
          {/* Close button */}
          <button
            onClick={() => toggleAuth(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-fresh-charcoal transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Feedback messages */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-2xl bg-green-50 border border-green-200 text-fresh-green text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* TAB: PROFILE VIEW */}
          {tab === 'profile' && user && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-fresh-orange to-fresh-pink flex items-center justify-center text-2xl text-white font-bold shadow-md shrink-0">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-extrabold text-lg text-fresh-charcoal truncate">
                      {user.name}
                    </h3>
                    {user.role === 'admin' && (
                      <span className="px-2 py-0.5 rounded-full bg-fresh-charcoal text-white text-[10px] font-extrabold uppercase">
                        Admin
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-fresh-gray truncate">{user.email}</p>
                  <span className="inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 rounded-full bg-fresh-orange/10 text-fresh-orange text-[10px] font-extrabold">
                    <Award className="w-3 h-3" /> Tier: {user.loyaltyTier} ({user.loyaltyPoints} pts)
                  </span>
                </div>
              </div>

              {/* Admin Studio Quick Link if user is Admin */}
              {user.role === 'admin' && (
                <div className="p-3 bg-fresh-softBg rounded-2xl border border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">⚙️</span>
                    <div>
                      <h4 className="font-bold text-xs text-fresh-charcoal">Admin Studio</h4>
                      <p className="text-[10px] text-fresh-gray">Manage catalog, orders & analytics</p>
                    </div>
                  </div>
                  <Link
                    href="/admin"
                    onClick={() => toggleAuth(false)}
                    className="px-3 py-1.5 rounded-xl bg-fresh-charcoal text-white text-xs font-bold hover:bg-fresh-orange transition-colors flex items-center gap-1"
                  >
                    <span>Launch</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              )}

              {/* Profile Action Buttons */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => switchTab('edit_profile')}
                  className="py-2.5 px-3 rounded-xl border border-gray-200 hover:border-fresh-orange text-fresh-charcoal font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5 text-fresh-orange" />
                  <span>Edit Profile</span>
                </button>
                <button
                  onClick={() => switchTab('change_password')}
                  className="py-2.5 px-3 rounded-xl border border-gray-200 hover:border-fresh-orange text-fresh-charcoal font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <KeyRound className="w-3.5 h-3.5 text-fresh-orange" />
                  <span>Security</span>
                </button>
              </div>

              {/* Recent Orders */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-fresh-charcoal flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-fresh-orange" /> Recent Orders ({orders.length})
                </h4>

                <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
                  {orders.length > 0 ? (
                    orders.map((ord) => (
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
                    ))
                  ) : (
                    <p className="text-xs text-fresh-gray py-2 text-center">No orders yet.</p>
                  )}
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={logout}
                className="w-full py-3 rounded-2xl bg-fresh-pink/10 hover:bg-fresh-pink/20 text-fresh-pink font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          )}

          {/* TAB: EDIT PROFILE */}
          {tab === 'edit_profile' && (
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <h3 className="font-display font-extrabold text-lg text-fresh-charcoal">Edit Profile</h3>
                <button
                  type="button"
                  onClick={() => switchTab('profile')}
                  className="text-xs text-fresh-gray hover:text-fresh-charcoal font-semibold"
                >
                  Cancel
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-bold text-fresh-charcoal block mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-fresh-softBg rounded-xl text-xs font-medium border border-gray-200 focus:outline-none focus:border-fresh-orange"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-fresh-charcoal block mb-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-10 pr-4 py-2.5 bg-fresh-softBg rounded-xl text-xs font-medium border border-gray-200 focus:outline-none focus:border-fresh-orange"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-fresh-orange text-white font-semibold text-xs hover:bg-fresh-charcoal transition-colors disabled:opacity-50"
              >
                {loading ? 'Saving Changes...' : 'Save Profile'}
              </button>
            </form>
          )}

          {/* TAB: CHANGE PASSWORD */}
          {tab === 'change_password' && (
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <h3 className="font-display font-extrabold text-lg text-fresh-charcoal">Change Password</h3>
                <button
                  type="button"
                  onClick={() => switchTab('profile')}
                  className="text-xs text-fresh-gray hover:text-fresh-charcoal font-semibold"
                >
                  Cancel
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-bold text-fresh-charcoal block mb-1">Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    placeholder="Enter current password"
                    className="w-full px-4 py-2.5 bg-fresh-softBg rounded-xl text-xs font-medium border border-gray-200 focus:outline-none focus:border-fresh-orange"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-fresh-charcoal block mb-1">New Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Minimum 8 characters"
                    className="w-full px-4 py-2.5 bg-fresh-softBg rounded-xl text-xs font-medium border border-gray-200 focus:outline-none focus:border-fresh-orange"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-fresh-charcoal block mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Re-enter new password"
                    className="w-full px-4 py-2.5 bg-fresh-softBg rounded-xl text-xs font-medium border border-gray-200 focus:outline-none focus:border-fresh-orange"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-fresh-charcoal text-white font-semibold text-xs hover:bg-fresh-orange transition-colors disabled:opacity-50"
              >
                {loading ? 'Updating Password...' : 'Update Password Securely'}
              </button>
            </form>
          )}

          {/* TAB: SIGN IN */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-fresh-orange/10 text-fresh-orange flex items-center justify-center text-xl mx-auto mb-2">
                  🍊
                </div>
                <h3 className="font-display font-extrabold text-2xl text-fresh-charcoal">
                  Welcome to FreshSip
                </h3>
                <p className="text-xs text-fresh-gray">
                  Sign in to track orders, save favorites, and earn juicy loyalty points.
                </p>
              </div>

              <div className="space-y-3">
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-fresh-softBg rounded-xl text-xs font-medium border border-gray-200 focus:outline-none focus:border-fresh-orange"
                  />
                </div>

                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-10 py-3 bg-fresh-softBg rounded-xl text-xs font-medium border border-gray-200 focus:outline-none focus:border-fresh-orange"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-fresh-charcoal"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <div className="flex items-center justify-between text-[11px] text-fresh-gray pt-1">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="accent-fresh-orange rounded"
                    />
                    <span>Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => switchTab('forgot')}
                    className="text-fresh-orange font-semibold hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-fresh-orange text-white font-semibold text-xs hover:bg-fresh-charcoal shadow-glow-orange transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : null}
                <span>{loading ? 'Verifying...' : 'Sign In & Unlock Rewards'}</span>
              </button>

              <div className="text-center text-xs text-fresh-gray pt-2 border-t border-gray-100">
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={() => switchTab('signup')}
                  className="font-bold text-fresh-orange hover:underline cursor-pointer"
                >
                  Sign Up
                </button>
              </div>
            </form>
          )}

          {/* TAB: SIGN UP */}
          {tab === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-fresh-green/10 text-fresh-green flex items-center justify-center text-xl mx-auto mb-1">
                  🌱
                </div>
                <h3 className="font-display font-extrabold text-2xl text-fresh-charcoal">
                  Create FreshSip Account
                </h3>
                <p className="text-xs text-fresh-gray">
                  Join today and get 100 bonus loyalty reward points immediately.
                </p>
              </div>

              <div className="space-y-2.5">
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-fresh-softBg rounded-xl text-xs font-medium border border-gray-200 focus:outline-none focus:border-fresh-orange"
                  />
                </div>

                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-fresh-softBg rounded-xl text-xs font-medium border border-gray-200 focus:outline-none focus:border-fresh-orange"
                  />
                </div>

                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    placeholder="Phone (optional)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-fresh-softBg rounded-xl text-xs font-medium border border-gray-200 focus:outline-none focus:border-fresh-orange"
                  />
                </div>

                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password (minimum 8 characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-10 py-2.5 bg-fresh-softBg rounded-xl text-xs font-medium border border-gray-200 focus:outline-none focus:border-fresh-orange"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-fresh-charcoal"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <div className="relative">
                  <ShieldCheck className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-fresh-softBg rounded-xl text-xs font-medium border border-gray-200 focus:outline-none focus:border-fresh-orange"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-fresh-green text-white font-semibold text-xs hover:bg-fresh-charcoal shadow-glow-green transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : null}
                <span>{loading ? 'Creating Account...' : 'Complete Sign Up'}</span>
              </button>

              <div className="text-center text-xs text-fresh-gray pt-2 border-t border-gray-100">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => switchTab('login')}
                  className="font-bold text-fresh-orange hover:underline cursor-pointer"
                >
                  Sign In
                </button>
              </div>
            </form>
          )}

          {/* TAB: FORGOT PASSWORD */}
          {tab === 'forgot' && (
            <form onSubmit={handleForgotPassword} className="space-y-5">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-fresh-yellow/20 text-amber-600 flex items-center justify-center text-xl mx-auto mb-2">
                  🔐
                </div>
                <h3 className="font-display font-extrabold text-2xl text-fresh-charcoal">
                  Forgot Password
                </h3>
                <p className="text-xs text-fresh-gray">
                  Enter your account email and we will send you a secure password reset link.
                </p>
              </div>

              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="Enter your registered email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-fresh-softBg rounded-xl text-xs font-medium border border-gray-200 focus:outline-none focus:border-fresh-orange"
                />
              </div>

              {/* Dev helper preview if available */}
              {devResetUrl && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs space-y-1">
                  <span className="font-bold text-amber-800 block">Development Reset Link:</span>
                  <a
                    href={devResetUrl}
                    onClick={() => {
                      const params = new URL(devResetUrl).searchParams;
                      setResetToken(params.get('resetToken') || '');
                      setTab('reset');
                    }}
                    className="text-fresh-orange underline break-all block"
                  >
                    Click to Open Reset Screen
                  </a>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-fresh-orange text-white font-semibold text-xs hover:bg-fresh-charcoal shadow-glow-orange transition-all disabled:opacity-50"
              >
                {loading ? 'Submitting Request...' : 'Send Password Reset Link'}
              </button>

              <div className="text-center text-xs text-fresh-gray pt-2 border-t border-gray-100">
                Remember your password?{' '}
                <button
                  type="button"
                  onClick={() => switchTab('login')}
                  className="font-bold text-fresh-orange hover:underline cursor-pointer"
                >
                  Back to Sign In
                </button>
              </div>
            </form>
          )}

          {/* TAB: RESET PASSWORD */}
          {tab === 'reset' && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-fresh-green/10 text-fresh-green flex items-center justify-center text-xl mx-auto mb-2">
                  ✨
                </div>
                <h3 className="font-display font-extrabold text-2xl text-fresh-charcoal">
                  Create New Password
                </h3>
                <p className="text-xs text-fresh-gray">
                  Set a new secure password for <strong className="text-fresh-charcoal">{email}</strong>.
                </p>
              </div>

              <div className="space-y-3">
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="New Password (min 8 chars)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-10 py-3 bg-fresh-softBg rounded-xl text-xs font-medium border border-gray-200 focus:outline-none focus:border-fresh-orange"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-fresh-charcoal"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <div className="relative">
                  <ShieldCheck className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-fresh-softBg rounded-xl text-xs font-medium border border-gray-200 focus:outline-none focus:border-fresh-orange"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-fresh-charcoal text-white font-semibold text-xs hover:bg-fresh-orange transition-all disabled:opacity-50"
              >
                {loading ? 'Updating Password...' : 'Save New Password & Log In'}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
