
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Lead, Property, User, PipelineStage, MarketplaceLead, Notification, Integration } from './types';
import { MARKETPLACE_LEADS, MOCK_INTEGRATIONS } from './constants';
import { supabase } from './supabaseClient';

interface StoreContextType {
  user: User | null;
  leads: Lead[];
  properties: Property[];
  marketplaceLeads: MarketplaceLead[];
  notifications: Notification[];
  integrations: Integration[];
  loading: boolean;
  login: (email: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  addLead: (lead: Lead) => Promise<void>;
  updateLead: (id: string, updates: Partial<Lead>) => Promise<void>;
  bulkUpdateLeads: (ids: string[], updates: Partial<Lead>) => Promise<void>;
  deleteLeads: (ids: string[]) => Promise<void>;
  addProperty: (property: Property) => Promise<void>;
  buyLead: (leadId: string) => Promise<void>;
  addCredits: (amount: number) => Promise<void>;
  subscribe: () => Promise<void>;
  updateProfile: (name: string, phone: string, companyName: string, bio: string) => Promise<void>;
  claimFreeLeads: () => Promise<void>;
  resetDemo: () => void;
  dismissNotification: (id: string) => void;
  toggleIntegration: (id: string, apiKey?: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [marketplaceLeads, setMarketplaceLeads] = useState<MarketplaceLead[]>(MARKETPLACE_LEADS);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [integrations, setIntegrations] = useState<Integration[]>(MOCK_INTEGRATIONS);
  const [loading, setLoading] = useState(true);

  // Fetch Data Logic
  const fetchData = async (userId: string) => {
    try {
      // Fetch Profile
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', userId).single();
      if (profile) {
        setUser({
          id: profile.id,
          name: profile.name || 'Agent',
          email: profile.email,
          role: profile.role as any,
          credits: profile.credits,
          isSubscribed: profile.is_subscribed,
          phone: profile.phone,
          avatarInitials: (profile.name || 'U').substring(0, 2).toUpperCase(),
          companyName: profile.company_name,
          bio: profile.bio,
          trialStart: Number(profile.trial_start),
          hasClaimedFreeLeads: profile.has_claimed_free_leads
        });
      }

      // Fetch Leads
      const { data: leadsData } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
      if (leadsData) {
        const mappedLeads: Lead[] = leadsData.map((l: any) => ({
          id: l.id,
          name: l.name,
          phone: l.phone,
          budget: l.budget,
          requirement: l.requirement,
          location: l.location,
          source: l.source,
          stage: l.stage,
          priority: l.priority,
          lastContact: l.last_contact,
          notes: l.notes || [],
          tags: l.tags || []
        }));
        setLeads(mappedLeads);
      }

      // Fetch Properties
      const { data: propData } = await supabase.from('properties').select('*').order('created_at', { ascending: false });
      if (propData) {
        const mappedProps: Property[] = propData.map((p: any) => ({
          id: p.id,
          title: p.title,
          price: p.price,
          location: p.location,
          category: p.category,
          type: p.type,
          bhk: p.bhk,
          areaSqFt: p.area_sqft,
          status: p.status,
          imageUrl: p.image_url,
          ownerName: p.owner_name,
          ownerPhone: p.owner_phone
        }));
        setProperties(mappedProps);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Auth Listener
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await fetchData(session.user.id);
      } else {
        setUser(null);
        setLeads([]);
        setProperties([]);
        setLoading(false);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);


  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 3000);
  };

  const dismissNotification = (id: string) => setNotifications(prev => prev.filter(n => n.id !== id));

  // Updated Login to use Supabase Auth
  const login = async (email: string, name: string) => {
    const password = "tempPassword123!"; // Hardcoded for demo simplicity.

    // 1. Try to Sign Up
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name } // metadata for the trigger
      }
    });

    if (error) {
      // 2. If User already registered, Sign In
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) {
        showNotification(signInError.message, 'error');
        return;
      }
    }

    showNotification('Welcome back!', 'success');
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    showNotification('Logged out', 'info');
  };

  const addLead = async (lead: Lead) => {
    if (!user) return;

    // Convert Frontend Model to DB Model
    const dbLead = {
      user_id: user.id,
      name: lead.name,
      phone: lead.phone,
      budget: lead.budget,
      requirement: lead.requirement,
      location: lead.location,
      source: lead.source,
      stage: lead.stage,
      priority: lead.priority,
      last_contact: lead.lastContact,
      notes: lead.notes,
      tags: lead.tags || []
    };

    const { data, error } = await supabase.from('leads').insert(dbLead).select().single();
    
    if (error) {
      showNotification('Failed to add lead', 'error');
      console.error(error);
    } else {
      // Update Local State
      const newLead: Lead = { ...lead, id: data.id };
      setLeads(prev => [newLead, ...prev]);
      showNotification('Lead added to pipeline', 'success');
    }
  };

  const updateLead = async (id: string, updates: Partial<Lead>) => {
    // Map updates to snake_case for DB
    const dbUpdates: any = {};
    if (updates.stage) dbUpdates.stage = updates.stage;
    if (updates.notes) dbUpdates.notes = updates.notes;
    if (updates.priority) dbUpdates.priority = updates.priority;
    if (updates.name) dbUpdates.name = updates.name;
    if (updates.phone) dbUpdates.phone = updates.phone;
    if (updates.budget) dbUpdates.budget = updates.budget;
    if (updates.requirement) dbUpdates.requirement = updates.requirement;
    if (updates.location) dbUpdates.location = updates.location;
    if (updates.source) dbUpdates.source = updates.source;
    if (updates.lastContact) dbUpdates.last_contact = updates.lastContact;
    if (updates.tags) dbUpdates.tags = updates.tags;

    const { error } = await supabase.from('leads').update(dbUpdates).eq('id', id);
    
    if (!error) {
      setLeads(leads.map(l => l.id === id ? { ...l, ...updates } : l));
      // Show notification if it's a content edit, not just a stage drag-drop
      if (!updates.stage) {
         showNotification('Lead updated successfully', 'success');
      }
    } else {
       showNotification('Failed to update lead', 'error');
    }
  };

  const bulkUpdateLeads = async (ids: string[], updates: Partial<Lead>) => {
    const dbUpdates: any = {};
    if (updates.stage) dbUpdates.stage = updates.stage;
    if (updates.priority) dbUpdates.priority = updates.priority;
    
    // Optimistic Update
    setLeads(prev => prev.map(l => ids.includes(l.id) ? { ...l, ...updates } : l));
    
    // DB Update
    const { error } = await supabase.from('leads').update(dbUpdates).in('id', ids);
    
    if (error) {
      showNotification('Bulk update failed', 'error');
      // Revert optimism if needed (complex, skipped for MVP)
    } else {
      showNotification(`Updated ${ids.length} leads`, 'success');
    }
  };

  const deleteLeads = async (ids: string[]) => {
    const { error } = await supabase.from('leads').delete().in('id', ids);
    if (!error) {
      setLeads(prev => prev.filter(l => !ids.includes(l.id)));
      showNotification(`Deleted ${ids.length} leads`, 'info');
    } else {
      showNotification('Failed to delete leads', 'error');
    }
  };

  const addProperty = async (property: Property) => {
    if (!user) return;

    const dbProperty = {
      user_id: user.id,
      title: property.title,
      price: property.price,
      location: property.location,
      category: property.category,
      type: property.type,
      bhk: property.bhk,
      area_sqft: property.areaSqFt,
      status: property.status,
      image_url: property.imageUrl,
      owner_name: property.ownerName,
      owner_phone: property.ownerPhone
    };

    const { data, error } = await supabase.from('properties').insert(dbProperty).select().single();

    if (!error && data) {
       const newProp: Property = { ...property, id: data.id };
       setProperties(prev => [newProp, ...prev]);
       showNotification('Property listed successfully', 'success');
    }
  };

  const buyLead = async (leadId: string) => {
    if (!user) return;
    const targetLead = marketplaceLeads.find(l => l.id === leadId);
    
    if (targetLead && user.credits >= targetLead.priceCredits) {
      // 1. Deduct Credits in DB
      const newCredits = user.credits - targetLead.priceCredits;
      const { error } = await supabase.from('profiles').update({ credits: newCredits }).eq('id', user.id);
      
      if (error) {
        showNotification('Transaction failed', 'error');
        return;
      }

      // 2. Update Local User State
      setUser({ ...user, credits: newCredits });

      // 3. Unlock in UI
      setMarketplaceLeads(marketplaceLeads.map(l => l.id === leadId ? { ...l, isLocked: false } : l));
      
      // 4. Add to Pipeline (DB)
      await addLead({
        ...targetLead,
        id: 'temp', // ID will be generated by DB
        isLocked: false,
        stage: PipelineStage.NEW,
        lastContact: 'Just now',
        notes: [],
        tags: []
      });

      showNotification('Lead Unlocked & Added!', 'success');
    } else {
      showNotification('Insufficient Credits', 'error');
    }
  };

  const addCredits = async (amount: number) => {
    if (!user) return;
    const newCredits = user.credits + amount;
    
    const { error } = await supabase.from('profiles').update({ credits: newCredits }).eq('id', user.id);
    
    if (!error) {
      setUser({ ...user, credits: newCredits });
      showNotification(`${amount} Credits added`, 'success');
    }
  };

  const subscribe = async () => {
    if (!user) return;
    const { error } = await supabase.from('profiles').update({ is_subscribed: true }).eq('id', user.id);
    if (!error) {
      setUser({ ...user, isSubscribed: true });
      showNotification('Pro Subscription Active! 🚀', 'success');
    }
  };

  const updateProfile = async (name: string, phone: string, companyName: string, bio: string) => {
    if (!user) return;
    const { error } = await supabase.from('profiles').update({
      name, phone, company_name: companyName, bio
    }).eq('id', user.id);

    if (!error) {
      setUser({ ...user, name, phone, companyName, bio, avatarInitials: name.substring(0, 2).toUpperCase() });
      showNotification('Profile updated', 'success');
    }
  };

  const claimFreeLeads = async () => {
    if (!user || user.hasClaimedFreeLeads) return;
    
    const { error } = await supabase.from('profiles').update({
      credits: user.credits + 5,
      has_claimed_free_leads: true
    }).eq('id', user.id);

    if (!error) {
       setUser({ ...user, credits: user.credits + 5, hasClaimedFreeLeads: true });
       showNotification('5 Free Credits Claimed!', 'success');
    }
  };

  const toggleIntegration = (id: string, apiKey?: string) => {
     setIntegrations(prev => prev.map(int => {
      if (int.id === id) {
        const newStatus = !int.isConnected;
        if (newStatus) {
           showNotification(`Connected to ${int.name}`, 'success');
           return { ...int, isConnected: true, apiKey: apiKey || '', lastSync: 'Just now' };
        } else {
           showNotification(`Disconnected from ${int.name}`, 'info');
           return { ...int, isConnected: false, apiKey: undefined };
        }
      }
      return int;
    }));
  };

  const resetDemo = () => {
     logout();
  };

  return (
    <StoreContext.Provider value={{ 
      user, leads, properties, marketplaceLeads, notifications, integrations, loading,
      login, logout, addLead, updateLead, bulkUpdateLeads, deleteLeads, addProperty, 
      buyLead, addCredits, subscribe, updateProfile, claimFreeLeads,
      resetDemo, dismissNotification, toggleIntegration
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
