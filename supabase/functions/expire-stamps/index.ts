
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ExpiryRule {
  dayOfWeek: number; // -1 for everyday, 0-6 for specific days (0 = Sunday)
  expiryDays: number;
  notificationDays: number;
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

    const currentDay = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
    let totalExpiredCount = 0;

    // Get businesses with day-specific expiry rules
    const { data: businesses, error: businessError } = await supabaseClient
      .from('businesses')
      .select('id, name, expiry_day_rules')
      .eq('is_active', true)
      .not('expiry_day_rules', 'is', null);

    if (businessError) {
      console.error('Error fetching businesses:', businessError);
      throw businessError;
    }

    for (const business of businesses || []) {
      if (targetBusinessId && business.id !== targetBusinessId) {
        continue;
      }

      const expiryRules: ExpiryRule[] = business.expiry_day_rules || [];
      
      // Find applicable expiry rules for today
      const applicableRules = expiryRules.filter(rule => 
        rule.dayOfWeek === -1 || rule.dayOfWeek === currentDay
      );

      if (applicableRules.length === 0) {
        console.log(`No expiry rules apply for business ${business.name} on day ${currentDay}`);
        continue;
      }

      for (const rule of applicableRules) {
        if (rule.expiryDays <= 0) {
          continue; // Skip rules with no expiry
        }

        console.log(`Processing expiry rule for business ${business.name}: ${rule.expiryDays} days on ${rule.dayOfWeek === -1 ? 'everyday' : `day ${rule.dayOfWeek}`}`);

        // Find members with expired stamps for this business and rule
        const { data: expiredStampData, error: stampError } = await supabaseClient
          .from('stamp_records')
          .select(`
            id,
            business_member_id,
            business_members!inner(id, customer_name, stamps)
          `)
          .eq('business_id', business.id)
          .eq('is_expired', false)
          .lt('created_at', new Date(Date.now() - rule.expiryDays * 24 * 60 * 60 * 1000).toISOString());

        if (stampError) {
          console.error('Error fetching expired stamps:', stampError);
          continue;
        }

        if (!expiredStampData || expiredStampData.length === 0) {
          console.log(`No expired stamps found for business ${business.name} with rule ${rule.expiryDays} days`);
          continue;
        }

        // Group by member
        const memberStamps = new Map();
        for (const stamp of expiredStampData) {
          const memberId = stamp.business_member_id;
          if (!memberStamps.has(memberId)) {
            memberStamps.set(memberId, {
              member: stamp.business_members,
              stampIds: []
            });
          }
          memberStamps.get(memberId).stampIds.push(stamp.id);
        }

        // Process each member's expired stamps
        for (const [memberId, data] of memberStamps) {
          const { member, stampIds } = data;
          const expiredCount = stampIds.length;

          if (expiredCount === 0) continue;

          // Mark stamps as expired
          const { error: updateStampsError } = await supabaseClient
            .from('stamp_records')
            .update({ is_expired: true, expired_at: new Date().toISOString() })
            .in('id', stampIds);

          if (updateStampsError) {
            console.error('Error marking stamps as expired:', updateStampsError);
            continue;
          }

          // Update member's stamp count
          const newStampCount = Math.max(0, (member.stamps || 0) - expiredCount);
          const { error: updateMemberError } = await supabaseClient
            .from('business_members')
            .update({ stamps: newStampCount })
            .eq('id', memberId);

          if (updateMemberError) {
            console.error('Error updating member stamp count:', updateMemberError);
            continue;
          }

          // Log the expiry
          const { error: logError } = await supabaseClient
            .from('expired_stamps_log')
            .insert({
              business_id: business.id,
              business_member_id: memberId,
              customer_name: member.customer_name,
              stamps_expired: expiredCount
            });

          if (logError) {
            console.error('Error logging expired stamps:', logError);
          }

          totalExpiredCount += expiredCount;
          console.log(`Expired ${expiredCount} stamps for member ${member.customer_name} in business ${business.name}`);
        }
      }
    }

    // Update last expiry run timestamp
    if (!targetBusinessId) {
      // For scheduled runs, update all businesses with expiry rules
      const businessesToUpdate = businesses?.filter(b => 
        (b.expiry_day_rules || []).some((rule: ExpiryRule) => rule.expiryDays > 0)
      ).map(b => b.id) || [];

      if (businessesToUpdate.length > 0) {
        const { error: updateError } = await supabaseClient
          .from('businesses')
          .update({ last_expiry_run: new Date().toISOString() })
          .in('id', businessesToUpdate);

        if (updateError) {
          console.error('Error updating last expiry run:', updateError);
        }
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

    console.log(`Total expired stamps: ${totalExpiredCount}`);

    const response = {
      success: true,
      expiredCount: totalExpiredCount,
      message: `Successfully expired ${totalExpiredCount} stamps`,
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
