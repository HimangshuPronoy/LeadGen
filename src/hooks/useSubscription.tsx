
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

interface Subscription {
  id: string;
  plan_type: 'basic' | 'premium';
  leads_per_month: number;
  max_storage_packages: number;
  current_month_leads: number;
  used_storage_packages: number;
  status: string;
}

interface SubscriptionContextType {
  subscription: Subscription | null;
  loading: boolean;
  canGenerateLeads: boolean;
  canSavePackage: boolean;
  refreshSubscription: () => Promise<void>;
  createPayment: (planType: 'basic' | 'premium') => Promise<void>;
  createStorageUpgrade: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchSubscription = async () => {
    if (!user) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching subscription for user:', user.id);
      
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Subscription fetch error:', error);
        return;
      }

      if (data) {
        console.log('Found subscription:', data);
        const typedSubscription: Subscription = {
          id: data.id,
          plan_type: data.plan_type as 'basic' | 'premium',
          leads_per_month: data.leads_per_month,
          max_storage_packages: data.max_storage_packages,
          current_month_leads: data.current_month_leads || 0,
          used_storage_packages: data.used_storage_packages || 0,
          status: data.status
        };
        setSubscription(typedSubscription);
      } else {
        console.log('No active subscription found');
        setSubscription(null);
      }
    } catch (error) {
      console.error('Subscription error:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshSubscription = async () => {
    setLoading(true);
    await fetchSubscription();
  };

  const createPayment = async (planType: 'basic' | 'premium') => {
    try {
      console.log('Creating payment for plan:', planType);
      
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: { planType }
      });

      if (error) {
        console.error('Payment creation error:', error);
        throw error;
      }

      if (data?.url) {
        console.log('Redirecting to Stripe checkout:', data.url);
        // Use window.location.href for proper redirect
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        variant: "destructive",
        title: "Payment Error",
        description: error.message || "Failed to create payment session",
      });
      throw error;
    }
  };

  const createStorageUpgrade = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('create-storage-upgrade');

      if (error) throw error;

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Storage Upgrade Error", 
        description: error.message,
      });
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, [user]);

  const canGenerateLeads = subscription ? 
    (subscription.plan_type === 'premium' || subscription.current_month_leads < subscription.leads_per_month) : 
    false;

  const canSavePackage = subscription ? 
    subscription.used_storage_packages < subscription.max_storage_packages : 
    false;

  return (
    <SubscriptionContext.Provider value={{
      subscription,
      loading,
      canGenerateLeads,
      canSavePackage,
      refreshSubscription,
      createPayment,
      createStorageUpgrade
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};
