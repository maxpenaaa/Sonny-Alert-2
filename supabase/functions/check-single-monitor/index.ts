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
    const { monitorId, userId } = await req.json();

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const authHeader = req.headers.get('Authorization');
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabaseClient.auth.getUser(token);
      
      if (!user || user.id !== userId) {
        return new Response(
          JSON.stringify({ error: 'Unauthorized' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
        );
      }
    }

    const { data: monitor, error: fetchError } = await supabaseClient
      .from('monitors')
      .select('*')
      .eq('id', monitorId)
      .eq('user_id', userId)
      .single();

    if (fetchError) throw fetchError;

    const scrapeResponse = await fetch(
      `${Deno.env.get('SUPABASE_URL')}/functions/v1/scrape-product`,
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

    const updateData: any = {
      stock_status: newStatus,
      last_checked_at: new Date().toISOString(),
    };

    if (monitor.stock_status !== newStatus) {
      updateData.last_status_change = new Date().toISOString();
    }

    const { error: updateError } = await supabaseClient
      .from('monitors')
      .update(updateData)
      .eq('id', monitorId);

    if (updateError) throw updateError;

    return new Response(
      JSON.stringify({ 
        success: true, 
        previousStatus: monitor.stock_status,
        newStatus,
        changed: monitor.stock_status !== newStatus
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
