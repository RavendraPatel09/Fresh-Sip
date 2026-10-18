import fs from 'node:fs';
import path from 'node:path';
import { Product, Order, OrderStatus, LoyaltyTier, OrderAddress } from '@/frontend/shared';
import { SAMPLE_PRODUCTS } from '@/frontend/shared/data/productsData';
import { hashPassword } from '@/backend/lib/crypto';

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'customer' | 'admin';
  loyaltyPoints: number;
  loyaltyTier: LoyaltyTier;
  phone?: string;
  addresses: OrderAddress[];
  favorites: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PasswordResetRecord {
  id: string;
  email: string;
  tokenHash: string;
  expiresAt: number;
  used: boolean;
  createdAt: string;
}

export interface DatabaseSchema {
  version: number;
  users: UserRecord[];
  passwordResets: PasswordResetRecord[];
  orders: Order[];
  products: Product[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'freshsip-db.json');
const TMP_FILE = path.join(DATA_DIR, 'freshsip-db.tmp.json');

let inMemoryDb: DatabaseSchema | null = null;
let writeQueue: Promise<void> = Promise.resolve();

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

async function loadDb(): Promise<DatabaseSchema> {
  if (inMemoryDb) {
    return inMemoryDb;
  }

  ensureDataDir();

  if (fs.existsSync(DB_FILE)) {
    try {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      inMemoryDb = JSON.parse(content);
      return inMemoryDb!;
    } catch (e) {
      console.error('Failed to parse database file, re-initializing...', e);
    }
  }

  // Initial Seed
  const defaultAdminPass = process.env.ADMIN_PASSWORD || 'FreshSipAdmin2026!';
  const adminHash = await hashPassword(defaultAdminPass);

  const initialSeed: DatabaseSchema = {
    version: 1,
    users: [
      {
        id: 'usr-admin-1',
        name: 'FreshSip Admin',
        email: (process.env.ADMIN_EMAIL || 'admin@freshsip.com').toLowerCase(),
        passwordHash: adminHash,
        role: 'admin',
        loyaltyPoints: 5000,
        loyaltyTier: 'Super Fresh',
        addresses: [],
        favorites: ['mango-burst', 'green-detox'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    passwordResets: [],
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
    products: SAMPLE_PRODUCTS,
  };

  inMemoryDb = initialSeed;
  await saveDb(initialSeed);
  return inMemoryDb;
}

async function saveDb(data: DatabaseSchema): Promise<void> {
  writeQueue = writeQueue.then(async () => {
    ensureDataDir();
    const json = JSON.stringify(data, null, 2);
    await fs.promises.writeFile(TMP_FILE, json, 'utf-8');
    await fs.promises.rename(TMP_FILE, DB_FILE);
  });
  return writeQueue;
}

// ----------------- USER METHODS -----------------

export async function findUserByEmail(email: string): Promise<UserRecord | null> {
  const db = await loadDb();
  const normalized = email.trim().toLowerCase();
  return db.users.find((u) => u.email.toLowerCase() === normalized) || null;
}

export async function findUserById(id: string): Promise<UserRecord | null> {
  const db = await loadDb();
  return db.users.find((u) => u.id === id) || null;
}

export async function createUser(data: {
  name: string;
  email: string;
  passwordHash: string;
  role?: 'customer' | 'admin';
  phone?: string;
}): Promise<UserRecord> {
  const db = await loadDb();
  const normalizedEmail = data.email.trim().toLowerCase();

  const existing = db.users.find((u) => u.email.toLowerCase() === normalizedEmail);
  if (existing) {
    throw new Error('An account with this email already exists.');
  }

  const newUser: UserRecord = {
    id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    name: data.name.trim(),
    email: normalizedEmail,
    passwordHash: data.passwordHash,
    role: data.role || 'customer',
    loyaltyPoints: 100, // Welcome points
    loyaltyTier: 'Fresh',
    phone: data.phone || '',
    addresses: [],
    favorites: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.users.push(newUser);
  await saveDb(db);
  return newUser;
}

export async function updateUser(
  id: string,
  updates: Partial<Omit<UserRecord, 'id' | 'email' | 'role' | 'createdAt'>>
): Promise<UserRecord | null> {
  const db = await loadDb();
  const index = db.users.findIndex((u) => u.id === id);
  if (index === -1) return null;

  const current = db.users[index];
  const updated: UserRecord = {
    ...current,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  db.users[index] = updated;
  await saveDb(db);
  return updated;
}

export async function updatePassword(id: string, newPasswordHash: string): Promise<boolean> {
  const db = await loadDb();
  const user = db.users.find((u) => u.id === id);
  if (!user) return false;

  user.passwordHash = newPasswordHash;
  user.updatedAt = new Date().toISOString();
  await saveDb(db);
  return true;
}

// ----------------- PASSWORD RESET METHODS -----------------

export async function createPasswordReset(
  email: string,
  tokenHash: string,
  expiresAt: number
): Promise<PasswordResetRecord> {
  const db = await loadDb();
  const normalizedEmail = email.trim().toLowerCase();

  // Invalidate any existing unused tokens for this email
  db.passwordResets.forEach((pr) => {
    if (pr.email.toLowerCase() === normalizedEmail && !pr.used) {
      pr.used = true;
    }
  });

  const record: PasswordResetRecord = {
    id: `pr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    email: normalizedEmail,
    tokenHash,
    expiresAt,
    used: false,
    createdAt: new Date().toISOString(),
  };

  db.passwordResets.push(record);
  await saveDb(db);
  return record;
}

export async function findValidPasswordReset(
  email: string,
  tokenHash: string
): Promise<PasswordResetRecord | null> {
  const db = await loadDb();
  const normalizedEmail = email.trim().toLowerCase();
  const now = Date.now();

  const record = db.passwordResets.find(
    (pr) =>
      pr.email.toLowerCase() === normalizedEmail &&
      pr.tokenHash === tokenHash &&
      !pr.used &&
      pr.expiresAt > now
  );

  return record || null;
}

export async function markPasswordResetUsed(id: string): Promise<void> {
  const db = await loadDb();
  const record = db.passwordResets.find((pr) => pr.id === id);
  if (record) {
    record.used = true;
    await saveDb(db);
  }
}

// ----------------- ORDER METHODS -----------------

export async function getAllOrders(): Promise<Order[]> {
  const db = await loadDb();
  return [...db.orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getOrdersByUserId(userId: string): Promise<Order[]> {
  const db = await loadDb();
  return db.orders
    .filter((o) => o.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function createOrder(order: Order): Promise<Order> {
  const db = await loadDb();
  db.orders.unshift(order);

  // If order is linked to a user, award loyalty points (1 point per ₹10 spent)
  if (order.userId) {
    const user = db.users.find((u) => u.id === order.userId);
    if (user) {
      const earnedPoints = Math.floor(order.total / 10);
      user.loyaltyPoints += earnedPoints;
      if (user.loyaltyPoints >= 1000) {
        user.loyaltyTier = 'Super Fresh';
      } else if (user.loyaltyPoints >= 500) {
        user.loyaltyTier = 'Zesty';
      }
      user.updatedAt = new Date().toISOString();
    }
  }

  await saveDb(db);
  return order;
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order | null> {
  const db = await loadDb();
  const order = db.orders.find((o) => o.id === orderId);
  if (!order) return null;

  order.orderStatus = status;
  await saveDb(db);
  return order;
}

// ----------------- PRODUCT METHODS -----------------

export async function getAllProducts(): Promise<Product[]> {
  const db = await loadDb();
  return db.products;
}

export async function getProductById(id: string): Promise<Product | null> {
  const db = await loadDb();
  return db.products.find((p) => p.id === id) || null;
}

export async function addProduct(product: Product): Promise<Product> {
  const db = await loadDb();
  db.products.unshift(product);
  await saveDb(db);
  return product;
}

export async function updateProduct(product: Product): Promise<Product | null> {
  const db = await loadDb();
  const index = db.products.findIndex((p) => p.id === product.id);
  if (index === -1) return null;

  db.products[index] = product;
  await saveDb(db);
  return product;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const db = await loadDb();
  const initialLen = db.products.length;
  db.products = db.products.filter((p) => p.id !== id);
  if (db.products.length !== initialLen) {
    await saveDb(db);
    return true;
  }
  return false;
}
