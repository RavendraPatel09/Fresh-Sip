import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, CartItem, ProductSize, Order, OrderStatus, UserProfile, HealthGoal, ProductCategory, LoyaltyTier } from '@/types';
import { SAMPLE_PRODUCTS } from '@/lib/data/productsData';

interface FreshSipState {
  // Products
  products: Product[];
  activeCategory: ProductCategory | 'All';
  searchQuery: string;
  selectedHealthGoals: HealthGoal[];
  selectedDietaryTags: string[];
  selectedProductDetails: Product | null;
  
  // Cart
  cart: CartItem[];
  isCartOpen: boolean;
  couponCode: string | null;
  discountPercentage: number;

  // Checkout & Orders
  isCheckoutOpen: boolean;
  orders: Order[];
  currentOrderConfirmation: Order | null;

  // AI Drawer
  isAIOpen: boolean;

  // Auth & Profile
  isAuthOpen: boolean;
  user: UserProfile | null;

  // Actions - Products & Filters
  setActiveCategory: (category: ProductCategory | 'All') => void;
  setSearchQuery: (query: string) => void;
  toggleHealthGoal: (goal: HealthGoal) => void;
  toggleDietaryTag: (tag: string) => void;
  resetFilters: () => void;
  openProductDetails: (product: Product) => void;
  closeProductDetails: () => void;
  
  // Admin Product Actions
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;

  // Actions - Cart
  addToCart: (product: Product, size?: ProductSize, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  clearCart: () => void;
  toggleCart: (open?: boolean) => void;
  applyCoupon: (code: string) => boolean;

  // Actions - UI Drawers & Modals
  toggleAI: (open?: boolean) => void;
  toggleCheckout: (open?: boolean) => void;
  toggleAuth: (open?: boolean) => void;

  // Actions - Checkout & Orders
  placeOrder: (
    customerInfo: { name: string; email: string; phone: string; address: string; city: string; state: string; zip: string },
    paymentMethod: 'Stripe' | 'Razorpay' | 'Cash on Delivery'
  ) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;

  // Actions - User & Auth
  login: (name: string, email: string) => void;
  logout: () => void;
  toggleFavorite: (productId: string) => void;
}

export const useFreshSipStore = create<FreshSipState>()(
  persist(
    (set, get) => ({
      // Products Seed
      products: SAMPLE_PRODUCTS,
      activeCategory: 'All',
      searchQuery: '',
      selectedHealthGoals: [],
      selectedDietaryTags: [],
      selectedProductDetails: null,

      // Cart
      cart: [],
      isCartOpen: false,
      couponCode: null,
      discountPercentage: 0,

      // Checkout & Orders
      isCheckoutOpen: false,
      orders: [
        {
          id: 'ORD-9821',
          customerName: 'Sarah Jenkins',
          customerEmail: 'sarah.j@example.com',
          items: [
            {
              id: 'mango-burst-500ml',
              product: SAMPLE_PRODUCTS[0],
              selectedSize: '500ml',
              quantity: 2,
              itemTotal: 498,
            },
          ],
          subtotal: 498,
          discount: 50,
          deliveryFee: 40,
          total: 488,
          paymentStatus: 'Paid',
          paymentMethod: 'Razorpay',
          orderStatus: 'Out for Delivery',
          address: {
            fullName: 'Sarah Jenkins',
            street: '42 Palm Tree Boulevard, Apt 4B',
            city: 'Mumbai',
            state: 'Maharashtra',
            zipCode: '400050',
            phone: '+91 98765 43210',
          },
          createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
          estimatedDeliveryTime: '25 mins',
        },
      ],
      currentOrderConfirmation: null,

      // UI
      isAIOpen: false,
      isAuthOpen: false,
      user: {
        id: 'usr-1',
        name: 'Alex Morgan',
        email: 'alex@freshsip.com',
        loyaltyPoints: 680,
        loyaltyTier: 'Zesty',
        addresses: [],
        favorites: ['mango-burst', 'green-detox'],
      },

      // Product Actions
      setActiveCategory: (category) => set({ activeCategory: category }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      toggleHealthGoal: (goal) =>
        set((state) => {
          const exists = state.selectedHealthGoals.includes(goal);
          return {
            selectedHealthGoals: exists
              ? state.selectedHealthGoals.filter((g) => g !== goal)
              : [...state.selectedHealthGoals, goal],
          };
        }),
      toggleDietaryTag: (tag) =>
        set((state) => {
          const exists = state.selectedDietaryTags.includes(tag);
          return {
            selectedDietaryTags: exists
              ? state.selectedDietaryTags.filter((t) => t !== tag)
              : [...state.selectedDietaryTags, tag],
          };
        }),
      resetFilters: () =>
        set({ activeCategory: 'All', searchQuery: '', selectedHealthGoals: [], selectedDietaryTags: [] }),
      openProductDetails: (product) => set({ selectedProductDetails: product }),
      closeProductDetails: () => set({ selectedProductDetails: null }),

      // Admin CRUD
      addProduct: (newProd) => set((state) => ({ products: [newProd, ...state.products] })),
      updateProduct: (updated) =>
        set((state) => ({
          products: state.products.map((p) => (p.id === updated.id ? updated : p)),
        })),
      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        })),

      // Cart Actions
      addToCart: (product, size = '250ml', quantity = 1) =>
        set((state) => {
          const cartItemId = `${product.id}-${size}`;
          const existingIndex = state.cart.findIndex((item) => item.id === cartItemId);
          const price = product.sizePrices[size] || product.price;

          if (existingIndex > -1) {
            const updatedCart = [...state.cart];
            const item = updatedCart[existingIndex];
            const newQty = item.quantity + quantity;
            updatedCart[existingIndex] = {
              ...item,
              quantity: newQty,
              itemTotal: price * newQty,
            };
            return { cart: updatedCart, isCartOpen: true };
          } else {
            const newItem: CartItem = {
              id: cartItemId,
              product,
              selectedSize: size,
              quantity,
              itemTotal: price * quantity,
            };
            return { cart: [...state.cart, newItem], isCartOpen: true };
          }
        }),

      removeFromCart: (cartItemId) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== cartItemId),
        })),

      updateQuantity: (cartItemId, delta) =>
        set((state) => {
          const updatedCart = state.cart
            .map((item) => {
              if (item.id === cartItemId) {
                const newQty = item.quantity + delta;
                if (newQty <= 0) return null;
                const unitPrice = item.product.sizePrices[item.selectedSize] || item.product.price;
                return {
                  ...item,
                  quantity: newQty,
                  itemTotal: unitPrice * newQty,
                };
              }
              return item;
            })
            .filter((item): item is CartItem => item !== null);

          return { cart: updatedCart };
        }),

      clearCart: () => set({ cart: [], couponCode: null, discountPercentage: 0 }),
      toggleCart: (open) => set((state) => ({ isCartOpen: open ?? !state.isCartOpen })),

      applyCoupon: (code) => {
        const cleanCode = code.trim().toUpperCase();
        if (cleanCode === 'FRESH20' || cleanCode === 'SUMMER20') {
          set({ couponCode: cleanCode, discountPercentage: 20 });
          return true;
        } else if (cleanCode === 'ZESTY10') {
          set({ couponCode: cleanCode, discountPercentage: 10 });
          return true;
        }
        return false;
      },

      // UI Actions
      toggleAI: (open) => set((state) => ({ isAIOpen: open ?? !state.isAIOpen })),
      toggleCheckout: (open) => set((state) => ({ isCheckoutOpen: open ?? !state.isCheckoutOpen })),
      toggleAuth: (open) => set((state) => ({ isAuthOpen: open ?? !state.isAuthOpen })),

      // Orders
      placeOrder: (customerInfo, paymentMethod) => {
        const state = get();
        const subtotal = state.cart.reduce((sum, item) => sum + item.itemTotal, 0);
        const discount = Math.round((subtotal * state.discountPercentage) / 100);
        const deliveryFee = subtotal > 500 ? 0 : 40;
        const total = Math.max(0, subtotal - discount + deliveryFee);

        const newOrder: Order = {
          id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
          userId: state.user?.id,
          customerName: customerInfo.name,
          customerEmail: customerInfo.email,
          items: [...state.cart],
          subtotal,
          discount,
          deliveryFee,
          total,
          paymentStatus: 'Paid',
          paymentMethod,
          orderStatus: 'Confirmed',
          address: {
            fullName: customerInfo.name,
            street: customerInfo.address,
            city: customerInfo.city,
            state: customerInfo.state,
            zipCode: customerInfo.zip,
            phone: customerInfo.phone,
          },
          createdAt: new Date().toISOString(),
          estimatedDeliveryTime: '30-40 mins',
        };

        // Calculate earned loyalty points (1 point per ₹10 spent)
        const pointsEarned = Math.floor(total / 10);
        let updatedUser = state.user;
        if (updatedUser) {
          const newPoints = updatedUser.loyaltyPoints + pointsEarned;
          let tier: LoyaltyTier = 'Fresh';
          if (newPoints >= 1000) tier = 'Super Fresh';
          else if (newPoints >= 500) tier = 'Zesty';

          updatedUser = {
            ...updatedUser,
            loyaltyPoints: newPoints,
            loyaltyTier: tier,
          };
        }

        set({
          orders: [newOrder, ...state.orders],
          currentOrderConfirmation: newOrder,
          cart: [],
          couponCode: null,
          discountPercentage: 0,
          isCheckoutOpen: false,
          user: updatedUser,
        });

        return newOrder;
      },

      updateOrderStatus: (orderId, status) =>
        set((state) => ({
          orders: state.orders.map((o) => (o.id === orderId ? { ...o, orderStatus: status } : o)),
        })),

      // Auth & Profile
      login: (name, email) =>
        set({
          user: {
            id: `usr-${Date.now()}`,
            name,
            email,
            loyaltyPoints: 100,
            loyaltyTier: 'Fresh',
            addresses: [],
            favorites: [],
          },
          isAuthOpen: false,
        }),
      logout: () => set({ user: null, isAuthOpen: false }),

      toggleFavorite: (productId) =>
        set((state) => {
          if (!state.user) return state;
          const favs = state.user.favorites || [];
          const isFav = favs.includes(productId);
          return {
            user: {
              ...state.user,
              favorites: isFav ? favs.filter((id) => id !== productId) : [...favs, productId],
            },
          };
        }),
    }),
    {
      name: 'freshsip-store',
      partialize: (state) => ({
        cart: state.cart,
        user: state.user,
        orders: state.orders,
      }),
    }
  )
);
