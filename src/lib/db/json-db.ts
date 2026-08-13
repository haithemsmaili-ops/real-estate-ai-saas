import fs from 'fs';
import path from 'path';

// Define the absolute path to the db files
const DB_DIR = path.join(process.cwd(), 'src', 'lib', 'db', 'data');

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

const seedLeads = [
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

const seedProperties = [
  {
    id: "prop_1",
    title: "فيلا فاخرة مع مسبح في المرادية",
    type: "sale" as const,
    price: "45,000,000 دج",
    location: "المرادية، الجزائر",
    status: "available" as const,
    createdAt: new Date("2026-08-01").toISOString()
  },
  {
    id: "prop_2",
    title: "شقة حديثة F3 مطلة على البحر",
    type: "rent" as const,
    price: "85,000 دج / شهرياً",
    location: "عين بنيان، الجزائر",
    status: "available" as const,
    createdAt: new Date("2026-08-05").toISOString()
  },
  {
    id: "prop_3",
    title: "مكتب تجاري مجهز بالكامل",
    type: "rent" as const,
    price: "150,000 دج / شهرياً",
    location: "باب الزوار، الجزائر",
    status: "rented" as const,
    createdAt: new Date("2026-08-10").toISOString()
  }
];

// Ensure the database directory and files exist
function ensureDbInitialized() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  const files = [
    { name: 'users.json', seed: [] },
    { name: 'properties.json', seed: seedProperties },
    { name: 'leads.json', seed: seedLeads }
  ];

  files.forEach((file) => {
    const filePath = path.join(DB_DIR, file.name);
    let shouldWriteSeed = false;

    if (!fs.existsSync(filePath)) {
      shouldWriteSeed = true;
    } else {
      try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const parsed = JSON.parse(content);
        if (!Array.isArray(parsed) || parsed.length === 0) {
          shouldWriteSeed = true;
        }
      } catch (e) {
        shouldWriteSeed = true;
      }
    }

    if (shouldWriteSeed) {
      fs.writeFileSync(filePath, JSON.stringify(file.seed, null, 2), 'utf-8');
    }
  });
}

// Initialize database
ensureDbInitialized();

export const jsonDb = {
  // --- USERS ---
  getUsers(): UserRecord[] {
    ensureDbInitialized();
    const content = fs.readFileSync(path.join(DB_DIR, 'users.json'), 'utf-8');
    return JSON.parse(content);
  },

  saveUsers(users: UserRecord[]) {
    ensureDbInitialized();
    fs.writeFileSync(path.join(DB_DIR, 'users.json'), JSON.stringify(users, null, 2), 'utf-8');
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
    ensureDbInitialized();
    const content = fs.readFileSync(path.join(DB_DIR, 'properties.json'), 'utf-8');
    return JSON.parse(content);
  },

  saveProperties(properties: PropertyRecord[]) {
    ensureDbInitialized();
    fs.writeFileSync(path.join(DB_DIR, 'properties.json'), JSON.stringify(properties, null, 2), 'utf-8');
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
    ensureDbInitialized();
    const content = fs.readFileSync(path.join(DB_DIR, 'leads.json'), 'utf-8');
    return JSON.parse(content);
  },

  saveLeads(leads: LeadRecord[]) {
    ensureDbInitialized();
    fs.writeFileSync(path.join(DB_DIR, 'leads.json'), JSON.stringify(leads, null, 2), 'utf-8');
  },

  addLead(lead: LeadRecord) {
    const leads = this.getLeads();
    leads.push(lead);
    this.saveLeads(leads);
  }
};
