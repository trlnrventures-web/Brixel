
import { Lead, LeadPriority, MarketplaceLead, PipelineStage, Property, PropertyStatus, PropertyType, PropertyCategory, Integration } from './types';

export const MOCK_LEADS: Lead[] = [
  {
    id: 'L001',
    name: 'Rahul Sharma',
    phone: '+91 98765 43210',
    budget: '₹1.2 Cr - ₹1.5 Cr',
    requirement: '2BHK',
    location: 'Kandivali East, Mumbai',
    source: 'MagicBricks',
    stage: PipelineStage.NEW,
    priority: LeadPriority.HOT,
    lastContact: '2 hours ago',
    notes: []
  },
  {
    id: 'L002',
    name: 'Priya Verma',
    phone: '+91 99887 76655',
    budget: '₹85 L - ₹95 L',
    requirement: '1BHK',
    location: 'Baner, Pune',
    source: 'Facebook',
    stage: PipelineStage.CONTACTED,
    priority: LeadPriority.WARM,
    lastContact: 'Yesterday',
    notes: []
  },
  {
    id: 'L003',
    name: 'Vikram Singh',
    phone: '+91 88776 65544',
    budget: '₹3.5 Cr',
    requirement: '4BHK Villa',
    location: 'Whitefield, Bangalore',
    source: 'Referral',
    stage: PipelineStage.VISIT_SCHEDULED,
    priority: LeadPriority.HOT,
    lastContact: '1 day ago',
    notes: []
  },
  {
    id: 'L004',
    name: 'Anita Desai',
    phone: '+91 77665 54433',
    budget: '₹60 L',
    requirement: 'Commercial Shop',
    location: 'Noida Sec 62',
    source: 'Housing.com',
    stage: PipelineStage.NEGOTIATION,
    priority: LeadPriority.WARM,
    lastContact: '3 days ago',
    notes: []
  },
  {
    id: 'L005',
    name: 'Suresh Reddy',
    phone: '+91 91234 56789',
    budget: '₹2.1 Cr',
    requirement: '3BHK',
    location: 'Gachibowli, Hyderabad',
    source: 'Google Ads',
    stage: PipelineStage.NEW,
    priority: LeadPriority.COLD,
    lastContact: '5 days ago',
    notes: []
  }
];

export const MOCK_PROPERTIES: Property[] = [
  {
    id: 'P001',
    title: 'Luxury 3BHK with Sea View',
    price: '₹2.5 Cr',
    location: 'Worli, Mumbai',
    category: PropertyCategory.RESALE,
    type: PropertyType.FLAT,
    bhk: 3,
    areaSqFt: 1450,
    status: PropertyStatus.AVAILABLE,
    imageUrl: 'https://picsum.photos/400/300',
    ownerName: 'Mr. Mehta',
    ownerPhone: '9999999999'
  },
  {
    id: 'P002',
    title: 'Spacious Villa in Gated Society',
    price: '₹4.2 Cr',
    location: 'Sarjapur, Bangalore',
    category: PropertyCategory.RESALE,
    type: PropertyType.VILLA,
    bhk: 4,
    areaSqFt: 3200,
    status: PropertyStatus.AVAILABLE,
    imageUrl: 'https://picsum.photos/401/300',
    ownerName: 'Mrs. Rao',
    ownerPhone: '9999999999'
  },
  {
    id: 'P003',
    title: 'Ready to Move Office Space',
    price: '₹85 L',
    location: 'Viman Nagar, Pune',
    category: PropertyCategory.RENTAL,
    type: PropertyType.COMMERCIAL,
    areaSqFt: 600,
    status: PropertyStatus.RENTED,
    imageUrl: 'https://picsum.photos/402/300',
    ownerName: 'Mr. Patil',
    ownerPhone: '9999999999'
  },
  {
    id: 'P004',
    title: 'Corner Plot Near Highway',
    price: '₹1.1 Cr',
    location: 'Sector 18, Gurgaon',
    category: PropertyCategory.RESALE,
    type: PropertyType.PLOT,
    areaSqFt: 2400,
    status: PropertyStatus.SOLD,
    imageUrl: 'https://picsum.photos/403/300',
    ownerName: 'Mr. Singh',
    ownerPhone: '9999999999'
  },
  {
    id: 'P005',
    title: 'Skyline Towers New Launch',
    price: '₹1.8 Cr',
    location: 'Powai, Mumbai',
    category: PropertyCategory.NEW,
    type: PropertyType.FLAT,
    bhk: 2,
    areaSqFt: 1100,
    status: PropertyStatus.AVAILABLE,
    imageUrl: 'https://picsum.photos/404/300',
    ownerName: 'Skyline Builders',
    ownerPhone: '9999999999'
  }
];

export const MARKETPLACE_LEADS: MarketplaceLead[] = [
  {
    id: 'M001',
    name: 'Amit *****',
    phone: '+91 9**** *****',
    budget: '₹1.8 Cr',
    requirement: '3BHK',
    location: 'Powai, Mumbai',
    source: 'Housing Premium',
    stage: PipelineStage.NEW,
    priority: LeadPriority.HOT,
    lastContact: 'Just now',
    priceCredits: 2,
    matchScore: 95,
    isLocked: true,
    notes: []
  },
  {
    id: 'M002',
    name: 'Sneha *****',
    phone: '+91 8**** *****',
    budget: '₹75 L',
    requirement: '2BHK',
    location: 'Thane West',
    source: '99Acres',
    stage: PipelineStage.NEW,
    priority: LeadPriority.WARM,
    lastContact: '1 hour ago',
    priceCredits: 1,
    matchScore: 88,
    isLocked: true,
    notes: []
  },
  {
    id: 'M003',
    name: 'Raj *****',
    phone: '+91 7**** *****',
    budget: '₹3.0 Cr',
    requirement: 'Penthouse',
    location: 'Koramangala, Bangalore',
    source: 'Direct Inquiry',
    stage: PipelineStage.NEW,
    priority: LeadPriority.HOT,
    lastContact: '30 mins ago',
    priceCredits: 3,
    matchScore: 92,
    isLocked: true,
    notes: []
  }
];

export const CHART_DATA = [
  { name: 'Mon', value: 12 },
  { name: 'Tue', value: 19 },
  { name: 'Wed', value: 15 },
  { name: 'Thu', value: 25 },
  { name: 'Fri', value: 22 },
  { name: 'Sat', value: 30 },
  { name: 'Sun', value: 18 },
];

export const LOCALITY_HEATMAP = [
  { name: 'Bandra', demand: 85, supply: 40 },
  { name: 'Andheri', demand: 70, supply: 65 },
  { name: 'Juhu', demand: 90, supply: 30 },
  { name: 'Powai', demand: 60, supply: 50 },
  { name: 'Malad', demand: 50, supply: 70 },
  { name: 'Thane', demand: 45, supply: 80 },
];

export const MOCK_INTEGRATIONS: Integration[] = [
  {
    id: 'int_1',
    name: 'Facebook Ads',
    icon: 'Facebook',
    provider: 'meta',
    isConnected: false,
    description: 'Sync Lead Ads directly to Pipeline.'
  },
  {
    id: 'int_2',
    name: 'Google Ads',
    icon: 'Chrome',
    provider: 'google',
    isConnected: false,
    description: 'Capture form submissions from Search.'
  },
  {
    id: 'int_3',
    name: '99Acres',
    icon: 'Building2',
    provider: '99acres',
    isConnected: false,
    description: 'Import owner and buyer leads.'
  },
  {
    id: 'int_4',
    name: 'Housing.com',
    icon: 'Home',
    provider: 'housing',
    isConnected: false,
    description: 'Sync leads from your listings.'
  },
  {
    id: 'int_5',
    name: 'MagicBricks',
    icon: 'BrickWall',
    provider: 'magicbricks',
    isConnected: false,
    description: 'Connect premium account leads.'
  },
  {
    id: 'int_6',
    name: 'OLX Real Estate',
    icon: 'ShoppingBag',
    provider: 'olx',
    isConnected: false,
    description: 'Capture chat inquiries as leads.'
  },
  {
    id: 'int_7',
    name: 'Custom Webhook',
    icon: 'Webhook',
    provider: 'webhook',
    isConnected: true,
    description: 'Universal API for your website.'
  }
];