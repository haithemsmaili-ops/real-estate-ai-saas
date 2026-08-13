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
  userEmail: string; // ربط العقار ببريد المستخدم
  title: string;
  type: 'sale' | 'rent';
  price: string;
  location: string;
  status: 'available' | 'sold' | 'rented';
  createdAt: string;
}

export interface LeadRecord {
  id: string;
  userEmail: string; // ربط العميل ببريد المستخدم
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

// In-memory state cache as an absolute fallback
const inMemoryCache: Record<string, any[]> = {
  'users.json': [],
  'properties.json': [],
  'leads.json': []
};

// Safe DB reader
function readDbFile<T>(filename: string, defaultSeed: T[] = []): T[] {
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

  // 2. Fallback to reading source static directory
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

  // 3. Fallback to in-memory cache or empty default
  return (inMemoryCache[filename] as T[]) || defaultSeed;
}

// Safe DB writer
function writeDbFile<T>(filename: string, data: T[]) {
  inMemoryCache[filename] = data;

  try {
    const dbDir = getDbDir();
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }
    const filePath = path.join(dbDir, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.warn(`[DB] Write ignored safely on ${filename}. Falling back to memory:`, e);
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
    if (!email) return undefined;
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
  getProperties(email?: string): PropertyRecord[] {
    const properties = readDbFile<PropertyRecord>('properties.json', []);
    if (!email) return properties;
    return properties.filter(p => p.userEmail?.toLowerCase() === email.toLowerCase());
  },

  saveProperties(properties: PropertyRecord[]) {
    writeDbFile('properties.json', properties);
  },

  addProperty(property: Omit<PropertyRecord, 'id' | 'createdAt'> & { userEmail: string }) {
    const properties = readDbFile<PropertyRecord>('properties.json', []);
    const newProperty: PropertyRecord = {
      ...property,
      id: 'prop_' + Date.now(),
      createdAt: new Date().toISOString()
    };
    properties.push(newProperty);
    this.saveProperties(properties);
    return newProperty;
  },

  updateProperty(id: string, updates: Partial<PropertyRecord>): PropertyRecord | undefined {
    const properties = readDbFile<PropertyRecord>('properties.json', []);
    const idx = properties.findIndex(p => p.id === id);
    if (idx === -1) return undefined;

    properties[idx] = { ...properties[idx], ...updates };
    this.saveProperties(properties);
    return properties[idx];
  },

  // --- LEADS ---
  getLeads(email?: string): LeadRecord[] {
    const leads = readDbFile<LeadRecord>('leads.json', []);
    if (!email) return leads;
    return leads.filter(l => l.userEmail?.toLowerCase() === email.toLowerCase());
  },

  saveLeads(leads: LeadRecord[]) {
    writeDbFile('leads.json', leads);
  },

  addLead(lead: Omit<LeadRecord, 'id' | 'createdAt'> & { userEmail: string }) {
    const leads = readDbFile<LeadRecord>('leads.json', []);
    const newLead: LeadRecord = {
      ...lead,
      id: 'lead_' + Date.now(),
      createdAt: new Date().toISOString()
    };
    leads.push(newLead);
    this.saveLeads(leads);
    return newLead;
  }
};