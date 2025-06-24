
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const signature = req.headers.get("stripe-signature");
  const body = await req.text();
  
  if (!signature) {
    return new Response("No signature", { status: 400 });
  }

  const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
    apiVersion: "2023-10-16",
  });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      Deno.env.get("STRIPE_WEBHOOK_SECRET") || ""
    );

    console.log(`Processing webhook event: ${event.type}`);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      
      if (session.mode === "payment" && session.metadata) {
        const { user_id, plan_type } = session.metadata;
        
        if (user_id && plan_type) {
          const planConfigs = {
            basic: {
              leads_per_month: 500,
              max_storage_packages: 15
            },
            premium: {
              leads_per_month: -1,
              max_storage_packages: 30
            }
          };

          const config = planConfigs[plan_type as keyof typeof planConfigs];
          
          if (config) {
            const { error } = await supabase
              .from('subscriptions')
              .upsert({
                user_id,
                plan_type,
                leads_per_month: config.leads_per_month,
                max_storage_packages: config.max_storage_packages,
                current_month_leads: 0,
                used_storage_packages: 0,
                status: 'active',
                stripe_customer_id: session.customer,
                stripe_session_id: session.id,
                current_period_start: new Date().toISOString(),
                current_period_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
              }, {
                onConflict: 'user_id'
              });

            if (error) {
              console.error('Error creating subscription:', error);
              return new Response(`Error: ${error.message}`, { status: 500 });
            }

            console.log(`Created subscription for user ${user_id} with plan ${plan_type}`);
          }
        }
      }

      if (session.metadata?.upgrade_type === "storage") {
        const { user_id } = session.metadata;
        
        if (user_id) {
          const { error } = await supabase.rpc('add_storage_packages', {
            user_id_param: user_id,
            additional_packages: 200
          });

          if (error) {
            console.error('Error adding storage:', error);
            return new Response(`Error: ${error.message}`, { status: 500 });
          }

          console.log(`Added storage for user ${user_id}`);
        }
      }
    }

    return new Response("OK", { status: 200, headers: corsHeaders });
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(`Webhook error: ${error.message}`, { 
      status: 400, 
      headers: corsHeaders 
    });
  }
});
