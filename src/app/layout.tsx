import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { InitialLoader } from '@/components/layout/InitialLoader';
import { ProductDetailsModal } from '@/components/features/menu/ProductDetailsModal';
import { CartDrawer } from '@/components/features/cart/CartDrawer';
import { CheckoutModal } from '@/components/features/checkout/CheckoutModal';
import { FreshSipAIAssistant } from '@/components/features/ai/FreshSipAIAssistant';
import { AuthModal } from '@/components/features/auth/AuthModal';

export const metadata: Metadata = {
  title: 'FreshSip Juice Bar — Fresh. Vibrant. Made for You.',
  description: 'Experience 3D product visualization, organic cold-pressed fruit juices, health-goal formulas, and Gemini AI powered assistant at FreshSip Juice Bar.',
  keywords: ['juice bar', 'cold pressed juice', '3D website', 'smoothies', 'detox juice', 'FreshSip AI', 'organic juice'],
  openGraph: {
    title: 'FreshSip Juice Bar — Premium 3D Commercial Digital Experience',
    description: 'Real fruit. Bold flavor. Zero boring. Order cold-pressed juices online with AI recommendations.',
    images: ['https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=1200&q=80'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-fresh-orange selection:text-white">
        <InitialLoader />
        <Navbar />
        {children}
        <Footer />
        <ProductDetailsModal />
        <CartDrawer />
        <CheckoutModal />
        <FreshSipAIAssistant />
        <AuthModal />
      </body>
    </html>
  );
}
