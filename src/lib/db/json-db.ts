import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const supabase = createClient(supabaseUrl, supabaseKey);

export interface UserRecord {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  authProvider: 'google' | 'credentials';
  subscriptionStatus: 'none' | 'paid' | 'active';
  hasPaid: boolean;
  paymentTimestamp?: number;
  createdAt: string;
}

export interface PropertyRecord {
  id: string;
  userEmail: string;
  title: string;
  description?: string;
  type: 'sale' | 'rent' | 'short_term';
  propertyType?: 'apartment' | 'villa' | 'townhouse' | 'land' | 'building' | 'commercial' | 'office';
  listingType?: 'sale' | 'rent' | 'short_term';
  price: string;
  numericPrice?: number;
  currency?: 'USD' | 'EUR' | 'SAR' | 'AED' | 'QAR' | 'KWD' | 'EGP' | 'DZD';
  location: string;
  country?: string;
  city?: string;
  district?: string;
  address?: string;
  area?: number;
  areaUnit?: 'sqm' | 'sqft';
  bedrooms?: number;
  bathrooms?: number;
  parkingSpaces?: number;
  floorNumber?: number;
  legalStatus?: 'freehold' | 'off_plan' | 'leasehold' | 'pending_verification';
  status: 'available' | 'pending' | 'sold' | 'rented';
  amenities?: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface LeadRecord {
  id: string;
  userEmail: string;
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

export const jsonDb = {
  // --- USERS ---
  async getUsers(): Promise<UserRecord[]> {
    const { data } = await supabase.from('users').select('*');
    return data || [];
  },

  async getUserByEmail(email: string): Promise<UserRecord | undefined> {
    if (!email) return undefined;
    const { data } = await supabase.from('users').select('*').eq('email', email.toLowerCase()).single();
    return data || undefined;
  },

  async addUser(user: UserRecord) {
    await supabase.from('users').insert([user]);
  },

  // --- PROPERTIES ---
  async getProperties(email?: string): Promise<PropertyRecord[]> {
    let query = supabase.from('properties').select('*');
    if (email) {
      query = query.eq('user_email', email.toLowerCase());
    }
    const { data, error } = await query;
    if (error) {
      console.error("[Supabase Error]:", error);
      return [];
    }

    // تحويل الأعمدة لتطابق واجهة الموقع
    return (data || []).map((p: any) => ({
      id: p.id,
      userEmail: p.user_email,
      title: p.title,
      type: p.listing_type || 'sale',
      listingType: p.listing_type || 'sale',
      propertyType: p.property_type || 'apartment',
      price: p.price || '0',
      location: p.location || '',
      status: p.status || 'available',
      createdAt: p.created_at,
    }));
  },

  async addProperty(property: Omit<PropertyRecord, 'id' | 'createdAt'> & { userEmail: string }) {
    const { data, error } = await supabase
      .from('properties')
      .insert([
        {
          user_email: property.userEmail,
          title: property.title,
          listing_type: property.type || property.listingType || 'sale',
          property_type: property.propertyType || 'apartment',
          price: property.price,
          location: property.location,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("[Supabase Insert Error]:", error);
      throw error;
    }
    return data;
  },

  async deleteProperty(id: string): Promise<boolean> {
    const { error } = await supabase.from('properties').delete().eq('id', id);
    return !error;
  },

  // --- LEADS ---
  async getLeads(email?: string): Promise<LeadRecord[]> {
    let query = supabase.from('leads').select('*');
    if (email) {
      query = query.eq('user_email', email.toLowerCase());
    }
    const { data } = await query;
    return data || [];
  },

  async addLead(lead: Omit<LeadRecord, 'id' | 'createdAt'> & { userEmail: string }) {
    const { data } = await supabase.from('leads').insert([{
      user_email: lead.userEmail,
      name: lead.name,
      phone: lead.phone,
      source: lead.source,
      status: lead.status
    }]).select().single();
    return data;
  }
};