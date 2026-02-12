import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders, status: 200 });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    const { data: monitors, error: fetchError } = await supabaseClient
      .from('monitors')
      .select('*')
      .in('stock_status', ['sold_out', 'checking']);

    if (fetchError) throw fetchError;

    const updates = [];

    for (const monitor of monitors || []) {
      try {
        const scrapeResponse = await fetch(
          `${Deno.env.get('SUPABASE_URL')}/functions/v1/supabase-functions-scrape-product`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
            },
            body: JSON.stringify({ url: monitor.product_url }),
          }
        );

        const productData = await scrapeResponse.json();
        const newStatus = productData.inStock ? 'in_stock' : 'sold_out';

        if (monitor.stock_status !== newStatus) {
          if (newStatus === 'in_stock') {
            const { data: userData } = await supabaseClient
              .from('users')
              .select('email')
              .eq('id', monitor.user_id)
              .single();

            if (userData?.email) {
              console.log(`Alert: ${monitor.product_name} is back in stock for ${userData.email}`);
            }
          }

          updates.push({
            id: monitor.id,
            stock_status: newStatus,
            last_status_change: new Date().toISOString(),
            last_checked_at: new Date().toISOString(),
          });
        } else {
          updates.push({
            id: monitor.id,
            last_checked_at: new Date().toISOString(),
          });
        }
      } catch (error) {
        console.error(`Error checking monitor ${monitor.id}:`, error);
      }
    }

    for (const update of updates) {
      await supabaseClient
        .from('monitors')
        .update(update)
        .eq('id', update.id);
    }

    return new Response(
      JSON.stringify({ checked: monitors?.length || 0, updated: updates.length }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
