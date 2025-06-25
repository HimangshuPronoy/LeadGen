
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { planType } = await req.json();
    
    if (!planType || !['basic', 'premium'].includes(planType)) {
      throw new Error('Invalid plan type. Must be "basic" or "premium"');
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }
    
    const token = authHeader.replace("Bearer ", "");
    
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const { data, error: authError } = await supabaseClient.auth.getUser(token);
    if (authError) {
      console.error('Auth error:', authError);
      throw new Error(`Authentication failed: ${authError.message}`);
    }
    
    const user = data.user;
    if (!user?.email) {
      throw new Error("User not authenticated or email not available");
    }

    console.log('User authenticated for payment:', user.id, user.email);

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Check for existing customer
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      console.log('Found existing customer:', customerId);
    } else {
      console.log('No existing customer found, will create new one');
    }

    // Create line items with proper pricing
    const lineItems = [];
    if (planType === 'basic') {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: { 
            name: "1000 Credits Pack",
            description: "Generate up to 1000 leads (1 credit = 1 lead), includes 15 storage packages"
          },
          unit_amount: 4900, // $49.00
        },
        quantity: 1,
      });
    } else if (planType === 'premium') {
      // Use preset Stripe Price ID for 3000 Credit Pack if configured, else fallback to inline price data
      const premiumPriceId = Deno.env.get("STRIPE_PREMIUM_CREDIT_PRICE_ID");
      if (premiumPriceId) {
        lineItems.push({
          price: premiumPriceId,
          quantity: 1,
        });
      } else {
        lineItems.push({
          price_data: {
            currency: "usd",
            product_data: {
              name: "3000 Credits Pack",
              description: "Generate up to 3000 leads (1 credit = 1 lead), includes 30 storage packages"
            },
            unit_amount: 6900, // $69.00
          },
          quantity: 1,
        });
      }
    }

    // Get the origin from the request headers
    const origin = req.headers.get("origin") || "http://localhost:8080";
    
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: lineItems,
      mode: "payment",
      success_url: `${origin}/dashboard?payment=success&plan=${planType}`,
      cancel_url: `${origin}/pricing?payment=cancelled`,
      metadata: {
        user_id: user.id,
        plan_type: planType,
      },
      // Add these properties to ensure proper redirect behavior
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
    });

    console.log('Stripe session created:', session.id);

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error('Payment creation error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
