
export enum PipelineStage {
  NEW = 'New Inquiry',
  CONTACTED = 'Contacted',
  VISIT_SCHEDULED = 'Site Visit',
  NEGOTIATION = 'Negotiation',
  CLOSED = 'Closed',
  LOST = 'Lost'
}

export enum LeadPriority {
  HOT = 'Hot',
  WARM = 'Warm',
  COLD = 'Cold'
}

export interface Note {
  id: string;
  text: string;
  date: string;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  budget: string;
  requirement: string;
  location: string;
  source: string;
  stage: PipelineStage;
  priority: LeadPriority;
  lastContact: string;
  notes: Note[];
  tags?: string[];
  isLocked?: boolean;
  matchScore?: number;
}

export enum PropertyCategory {
  NEW = 'New Project',
  RESALE = 'Resale',
  RENTAL = 'Rental'
}

export enum PropertyType {
  FLAT = 'Flat',
  VILLA = 'Villa',
  PLOT = 'Plot',
  COMMERCIAL = 'Commercial'
}

export enum PropertyStatus {
  AVAILABLE = 'Available',
  SOLD = 'Sold',
  RENTED = 'Rented'
}

export interface Property {
  id: string;
  title: string;
  price: string;
  location: string;
  category: PropertyCategory;
  type: PropertyType;
  bhk?: number;
  areaSqFt: number;
  status: PropertyStatus;
  imageUrl: string;
  ownerName: string;
  ownerPhone: string;
}

export interface MarketplaceLead extends Lead {
  priceCredits: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Agent' | 'Admin';
  credits: number;
  isSubscribed: boolean;
  phone: string;
  avatarInitials: string;
  companyName?: string;
  bio?: string;
  trialStart: number; // Timestamp
  subscriptionEnd?: number; // Timestamp
  hasClaimedFreeLeads: boolean;
}

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export interface Integration {
  id: string;
  name: string;
  icon: string; // Lucide icon name or image url
  provider: 'meta' | 'google' | 'housing' | '99acres' | 'magicbricks' | 'olx' | 'webhook';
  isConnected: boolean;
  lastSync?: string;
  apiKey?: string;
  description: string;
}
