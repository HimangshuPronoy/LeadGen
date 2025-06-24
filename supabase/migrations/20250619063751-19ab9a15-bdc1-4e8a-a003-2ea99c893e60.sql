
-- Create a subscriptions table to track user plans and usage
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('basic', 'premium')),
  leads_per_month INTEGER NOT NULL,
  max_storage_packages INTEGER NOT NULL,
  current_month_leads INTEGER DEFAULT 0,
  used_storage_packages INTEGER DEFAULT 0,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired')),
  current_period_start TIMESTAMPTZ DEFAULT NOW(),
  current_period_end TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '1 month'),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add RLS policies for subscriptions
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own subscription" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscription" ON public.subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Edge functions can manage subscriptions" ON public.subscriptions
  FOR ALL USING (true);

-- Create a lead_packages table to track saved lead groups
CREATE TABLE public.lead_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  package_name TEXT NOT NULL,
  search_query TEXT NOT NULL,
  lead_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add RLS policies for lead_packages
ALTER TABLE public.lead_packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own lead packages" ON public.lead_packages
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own lead packages" ON public.lead_packages
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own lead packages" ON public.lead_packages
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own lead packages" ON public.lead_packages
  FOR DELETE USING (auth.uid() = user_id);

-- Update leads table to reference lead packages
ALTER TABLE public.leads ADD COLUMN package_id UUID REFERENCES public.lead_packages(id) ON DELETE SET NULL;

-- Create storage_upgrades table for tracking additional storage purchases
CREATE TABLE public.storage_upgrades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  additional_packages INTEGER DEFAULT 200,
  stripe_payment_intent_id TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '1 year')
);

-- Add RLS policies for storage_upgrades
ALTER TABLE public.storage_upgrades ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own storage upgrades" ON public.storage_upgrades
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Edge functions can manage storage upgrades" ON public.storage_upgrades
  FOR ALL USING (true);

-- Function to reset monthly lead count
CREATE OR REPLACE FUNCTION reset_monthly_leads()
RETURNS void AS $$
BEGIN
  UPDATE public.subscriptions 
  SET 
    current_month_leads = 0,
    current_period_start = NOW(),
    current_period_end = NOW() + INTERVAL '1 month'
  WHERE current_period_end < NOW();
END;
$$ LANGUAGE plpgsql;
