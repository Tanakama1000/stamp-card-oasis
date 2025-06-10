
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Parse request body to check if this is a manual or scheduled run
    let requestData = {};
    try {
      const body = await req.text();
      if (body) {
        requestData = JSON.parse(body);
      }
    } catch (error) {
      console.log('No request body or invalid JSON, proceeding with default behavior');
    }

    const isManual = requestData.manual || false;
    const targetBusinessId = requestData.businessId || null;

    console.log(`Starting stamp expiry check... (${isManual ? 'manual' : 'scheduled'})`);
    
    if (targetBusinessId) {
      console.log(`Targeting specific business: ${targetBusinessId}`);
    }

    // Call the expire_old_stamps function
    const { data, error } = await supabaseClient.rpc('expire_old_stamps')

    if (error) {
      console.error('Error expiring stamps:', error)
      throw error
    }

    const expiredCount = data || 0
    console.log(`Expired ${expiredCount} stamps`)

    // Update last expiry run timestamp for businesses that had expiry enabled
    if (!targetBusinessId) {
      // For scheduled runs, update all businesses with expiry enabled
      const { error: updateError } = await supabaseClient
        .from('businesses')
        .update({ last_expiry_run: new Date().toISOString() })
        .gt('stamp_expiry_days', 0)
        .eq('is_active', true);

      if (updateError) {
        console.error('Error updating last expiry run:', updateError);
      }
    } else {
      // For manual runs, update the specific business
      const { error: updateError } = await supabaseClient
        .from('businesses')
        .update({ last_expiry_run: new Date().toISOString() })
        .eq('id', targetBusinessId);

      if (updateError) {
        console.error('Error updating last expiry run for business:', updateError);
      }
    }

    const response = {
      success: true,
      expiredCount,
      message: `Successfully expired ${expiredCount} stamps`,
      isManual,
      timestamp: new Date().toISOString()
    };

    return new Response(
      JSON.stringify(response),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error in expire-stamps function:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
