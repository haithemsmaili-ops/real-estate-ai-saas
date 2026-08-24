import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseKey);

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
  tenantId?: string;
  name: string;
  email?: string;
  phone?: string;
  source: string;
  status: 'new' | 'pending' | 'qualified' | 'converted';
  intentScore?: number;
  locale?: string;
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
    if (!data) return undefined;
    return {
      ...data,
      firstName: data.first_name || data.firstName,
      lastName: data.last_name || data.lastName,
      subscriptionStatus: data.subscription_status || data.subscriptionStatus || 'none',
      hasPaid: data.has_paid ?? data.hasPaid ?? false,
      paymentTimestamp: data.payment_timestamp || data.paymentTimestamp,
    };
  },

  async addUser(user: UserRecord) {
    await supabase.from('users').insert([{
      id: user.id,
      first_name: user.firstName,
      last_name: user.lastName,
      email: user.email.toLowerCase(),
      password: user.password,
      auth_provider: user.authProvider,
      subscription_status: user.subscriptionStatus,
      has_paid: user.hasPaid,
      created_at: user.createdAt,
    }]);
  },

  async updateUserPayment(email: string, hasPaid: boolean = true, paymentTimestamp: number = Date.now(), subscriptionStatus: string = 'paid') {
    const { data, error } = await supabase
      .from('users')
      .update({
        has_paid: hasPaid,
        payment_timestamp: paymentTimestamp,
        subscription_status: subscriptionStatus,
      })
      .eq('email', email.toLowerCase())
      .select()
      .single();

    if (error) {
      console.error('Error updating user payment in Supabase:', error);
      return null;
    }

    return {
      ...data,
      hasPaid: data.has_paid,
      paymentTimestamp: data.payment_timestamp,
      subscriptionStatus: data.subscription_status,
    };
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

    return (data || []).map((p: any) => ({
      id: p.id,
      userEmail: p.user_email,
      title: p.title,
      description: p.description || '',
      type: p.listing_type || 'sale',
      listingType: p.listing_type || 'sale',
      propertyType: p.property_type || 'apartment',
      price: p.price || String(p.numeric_price || '0'),
      numericPrice: p.numeric_price ? Number(p.numeric_price) : undefined,
      currency: p.currency || 'USD',
      location: p.location || '',
      city: p.city || '',
      district: p.district || '',
      country: p.country || '',
      bedrooms: p.bedrooms ? Number(p.bedrooms) : undefined,
      bathrooms: p.bathrooms ? Number(p.bathrooms) : undefined,
      area: p.area ? Number(p.area) : undefined,
      areaUnit: p.area_unit || 'sqm',
      status: p.status || 'available',
      createdAt: p.created_at,
    }));
  },

  async addProperty(property: any) {
    const propertyPayload: any = {
      user_email: (property.userEmail || property.user_email || '').toLowerCase(),
      title: property.title || '',
      description: property.description || '',
      listing_type: property.type || property.listingType || property.listing_type || 'sale',
      property_type: property.propertyType || property.property_type || 'apartment',
      price: String(property.price || property.numericPrice || '0'),
      currency: property.currency || 'USD',
      location: property.location || [property.district, property.city, property.country].filter(Boolean).join(', ') || 'N/A',
      status: property.status || 'available',
    };

    if (property.numericPrice || property.price) propertyPayload.numeric_price = Number(property.numericPrice || property.price || 0);
    if (property.city) propertyPayload.city = property.city;
    if (property.district) propertyPayload.district = property.district;
    if (property.country) propertyPayload.country = property.country;
    if (property.area) propertyPayload.area = Number(property.area);
    if (property.areaUnit) propertyPayload.area_unit = property.areaUnit;
    if (property.bedrooms) propertyPayload.bedrooms = Number(property.bedrooms);
    if (property.bathrooms) propertyPayload.bathrooms = Number(property.bathrooms);

    const { data, error } = await supabase
      .from('properties')
      .insert([propertyPayload])
      .select()
      .single();

    if (error) {
      console.error("[Supabase Insert Error]:", error);
      return null;
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