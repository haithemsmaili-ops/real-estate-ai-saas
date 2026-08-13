import fs from 'fs';
import path from 'path';
import os from 'os';

// Determine if running in Vercel / Production Serverless
const isServerless = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';

// Helper to determine active database directory (using temp folder on Vercel)
const getDbDir = () => {
  if (isServerless) {
    return path.join(os.tmpdir(), 'propai-db');
  }
  return path.join(process.cwd(), 'src', 'lib', 'db', 'data');
};

const SOURCE_DIR = path.join(process.cwd(), 'src', 'lib', 'db', 'data');

export interface UserRecord {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string; // stored hashed
  authProvider: 'google' | 'credentials';
  subscriptionStatus: 'none' | 'paid' | 'active';
  hasPaid: boolean;
  paymentTimestamp?: number;
  createdAt: string;
}

export interface PropertyRecord {
  id: string;
  title: string;
  type: 'sale' | 'rent';
  price: string;
  location: string;
  status: 'available' | 'sold' | 'rented';
  createdAt: string;
}

export interface LeadRecord {
  id: string;
  tenantId: string;
  name: string;
  email?: string;
  phone?: string;
  source: string;
  status: 'new' | 'pending' | 'qualified' | 'converted';
  intentScore: number;
  locale: string;
  createdAt: string;
}

const seedLeads: LeadRecord[] = [
  {
    id: "lead_1",
    tenantId: "demo",
    name: "Ahmed Al-Rashid",
    phone: "+971501234567",
    source: "whatsapp",
    status: "qualified",
    intentScore: 87,
    locale: "ar",
    createdAt: new Date("2026-07-26").toISOString()
  },
  {
    id: "lead_2",
    tenantId: "demo",
    name: "Sarah Mitchell",
    email: "sarah.m@email.com",
    source: "email",
    status: "pending",
    intentScore: 62,
    locale: "en",
    createdAt: new Date("2026-07-25").toISOString()
  },
  {
    id: "lead_3",
    tenantId: "demo",
    name: "James Chen",
    phone: "+14165551234",
    source: "sms",
    status: "new",
    intentScore: 45,
    locale: "en",
    createdAt: new Date("2026-07-24").toISOString()
  },
  {
    id: "lead_4",
    tenantId: "demo",
    name: "Fatima Hassan",
    phone: "+966501112233",
    source: "whatsapp",
    status: "converted",
    intentScore: 95,
    locale: "ar",
    createdAt: new Date("2026-07-23").toISOString()
  }
];

const seedProperties: PropertyRecord[] = [
  {
    id: "prop_1",
    title: "فيلا فاخرة مع مسبح في المرادية",
    type: "sale",
    price: "45,000,000 دج",
    location: "المرادية، الجزائر",
    status: "available",
    createdAt: new Date("2026-08-01").toISOString()
  },
  {
    id: "prop_2",
    title: "شقة حديثة F3 مطلة على البحر",
    type: "rent",
    price: "85,000 دج / شهرياً",
    location: "عين بنيان، الجزائر",
    status: "available",
    createdAt: new Date("2026-08-05").toISOString()
  },
  {
    id: "prop_3",
    title: "مكتب تجاري مجهز بالكامل",
    type: "rent",
    price: "150,000 دج / شهرياً",
    location: "باب الزوار، الجزائر",
    status: "rented",
    createdAt: new Date("2026-08-10").toISOString()
  }
];

// In-memory state cache as a absolute fallback
const inMemoryCache: Record<string, any[]> = {
  'users.json': [],
  'properties.json': seedProperties,
  'leads.json': seedLeads
};

// Safe DB reader
function readDbFile<T>(filename: string, defaultSeed: T[]): T[] {
  const dbDir = getDbDir();
  const filePath = path.join(dbDir, filename);

  // 1. Try reading from active target directory (/tmp or local)
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(content);
      inMemoryCache[filename] = data;
      return data;
    }
  } catch (e) {
    console.warn(`[DB] Read warning for ${filePath}:`, e);
  }

  // 2. Fallback to reading source static directory (read-only safe)
  try {
    const sourcePath = path.join(SOURCE_DIR, filename);
    if (fs.existsSync(sourcePath)) {
      const content = fs.readFileSync(sourcePath, 'utf-8');
      const data = JSON.parse(content);
      inMemoryCache[filename] = data;
      return data;
    }
  } catch (e) {
    console.warn(`[DB] Source template read warning for ${filename}:`, e);
  }

  // 3. Fallback to in-memory cache or default seeds
  return (inMemoryCache[filename] as T[]) || defaultSeed;
}

// Safe DB writer
function writeDbFile<T>(filename: string, data: T[]) {
  // Always update memory cache first
  inMemoryCache[filename] = data;

  try {
    const dbDir = getDbDir();
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }
    const filePath = path.join(dbDir, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.warn(`[DB] EROFS / Write ignored safely on ${filename}. Falling back to memory:`, e);
  }
}

export const jsonDb = {
  // --- USERS ---
  getUsers(): UserRecord[] {
    return readDbFile<UserRecord>('users.json', []);
  },

  saveUsers(users: UserRecord[]) {
    writeDbFile('users.json', users);
  },

  getUserByEmail(email: string): UserRecord | undefined {
    return this.getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
  },

  addUser(user: UserRecord) {
    const users = this.getUsers();
    users.push(user);
    this.saveUsers(users);
  },

  updateUser(email: string, updates: Partial<UserRecord>): UserRecord | undefined {
    const users = this.getUsers();
    const idx = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
    if (idx === -1) return undefined;

    users[idx] = { ...users[idx], ...updates };
    this.saveUsers(users);
    return users[idx];
  },

  // --- PROPERTIES ---
  getProperties(): PropertyRecord[] {
    return readDbFile<PropertyRecord>('properties.json', seedProperties);
  },

  saveProperties(properties: PropertyRecord[]) {
    writeDbFile('properties.json', properties);
  },

  addProperty(property: PropertyRecord) {
    const properties = this.getProperties();
    properties.push(property);
    this.saveProperties(properties);
  },

  updateProperty(id: string, updates: Partial<PropertyRecord>): PropertyRecord | undefined {
    const properties = this.getProperties();
    const idx = properties.findIndex(p => p.id === id);
    if (idx === -1) return undefined;

    properties[idx] = { ...properties[idx], ...updates };
    this.saveProperties(properties);
    return properties[idx];
  },

  // --- LEADS ---
  getLeads(): LeadRecord[] {
    return readDbFile<LeadRecord>('leads.json', seedLeads);
  },

  saveLeads(leads: LeadRecord[]) {
    writeDbFile('leads.json', leads);
  },

  addLead(lead: LeadRecord) {
    const leads = this.getLeads();
    leads.push(lead);
    this.saveLeads(leads);
  }
};