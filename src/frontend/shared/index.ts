export type ProductCategory = 
  | 'Fruit Juices'
  | 'Detox'
  | 'Smoothies'
  | 'Shakes'
  | 'Combos';

export type HealthGoal = 
  | 'Energy'
  | 'Immunity'
  | 'Hydration'
  | 'Detox'
  | 'Digestion'
  | 'Fitness'
  | 'Refreshment';

export type ProductSize = '250ml' | '500ml' | '1L';

export interface NutritionInfo {
  calories: number;
  vitaminC: string; // e.g. "120% DV"
  sugar: string;    // e.g. "18g (Natural)"
  protein: string;  // e.g. "2g"
  carbs: string;    // e.g. "24g"
  fiber: string;    // e.g. "3g"
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: ProductCategory;
  price: number; // Base price for 250ml in INR
  sizePrices: Record<ProductSize, number>;
  ingredients: string[];
  nutrition: NutritionInfo;
  healthBenefits: HealthGoal[];
  tags: string[];
  rating: number;
  reviewCount: number;
  image: string;
  accentColor: string; // Hex color for liquid/gradients
  fruitType: 'mango' | 'orange' | 'strawberry' | 'lemon' | 'watermelon' | 'green' | 'berry' | 'pineapple';
  available: boolean;
  stock: number;
  featured?: boolean;
}

export interface CartItem {
  id: string; // unique cart item id (product.id + size)
  product: Product;
  selectedSize: ProductSize;
  quantity: number;
  itemTotal: number;
}

export type OrderStatus = 
  | 'Pending'
  | 'Confirmed'
  | 'Preparing'
  | 'Ready'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export interface OrderAddress {
  fullName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
}

export interface Order {
  id: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  paymentStatus: 'Paid' | 'Pending' | 'Failed';
  paymentMethod: 'Stripe' | 'Razorpay' | 'Cash on Delivery';
  orderStatus: OrderStatus;
  address: OrderAddress;
  createdAt: string;
  estimatedDeliveryTime: string;
}

export type LoyaltyTier = 'Fresh' | 'Zesty' | 'Super Fresh';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  loyaltyPoints: number;
  loyaltyTier: LoyaltyTier;
  addresses: OrderAddress[];
  favorites: string[]; // product IDs
}

export interface AIMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  recommendedProducts?: Product[];
  action?: {
    type: 'ADD_TO_CART' | 'FILTER_CATEGORY' | 'VIEW_PRODUCT';
    payload?: any;
  };
}
