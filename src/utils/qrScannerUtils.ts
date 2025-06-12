
import { supabase } from "@/integrations/supabase/client";

export function uuidToNumericId(uuid: string): string {
  let num = 0;
  for (let i = 0; i < uuid.length; i++) {
    num = ((num << 5) - num) + uuid.charCodeAt(i);
    num = num & num;
  }
  num = Math.abs(num) % 1_000_000_0000;
  return num.toString().padStart(10, "0");
}

export const validateBusinessExists = async (idFromQR: string, useNumericId: boolean = false): Promise<null | { id: string }> => {
  try {
    console.log(`🔍 Validating business ID: ${idFromQR} (numeric: ${useNumericId})`);
    
    if (useNumericId) {
      const { data, error } = await supabase.from('businesses').select('id');
      if (error) {
        console.error("❌ Error fetching businesses for numeric ID validation:", error);
        return null;
      }
      if (!data) {
        console.log("❌ No businesses found in database");
        return null;
      }
      const found = data.find((b: { id: string }) => uuidToNumericId(b.id) === idFromQR);
      console.log(`🔍 Found business with numeric ID: ${found ? 'YES' : 'NO'}`);
      return found ? found : null;
    } else {
      const { data, error } = await supabase
        .from('businesses')
        .select('id')
        .eq('id', idFromQR)
        .single();
      
      if (error) {
        console.error("❌ Error validating business ID:", error);
        return null;
      }
      console.log(`✅ Business found with UUID: ${data ? 'YES' : 'NO'}`);
      return data;
    }
  } catch (error) {
    console.error("❌ Exception during business validation:", error);
    return null;
  }
};

export const checkCooldownPeriod = async (businessId: string, userId: string | null): Promise<{ allowed: boolean; remainingMinutes?: number }> => {
  try {
    // Get business cooldown setting
    const { data: businessData, error: businessError } = await supabase
      .from('businesses')
      .select('cooldown_minutes')
      .eq('id', businessId)
      .single();

    if (businessError) {
      console.error('Error fetching business cooldown settings:', businessError);
      return { allowed: true }; // Allow if we can't check
    }

    const cooldownMinutes = businessData?.cooldown_minutes || 2;

    // Check last scan time for this user at this business
    let query = supabase
      .from('stamp_records')
      .select('created_at')
      .eq('business_id', businessId)
      .order('created_at', { ascending: false })
      .limit(1);

    if (userId) {
      // For authenticated users, check via business_members
      const { data: memberData, error: memberError } = await supabase
        .from('business_members')
        .select('id')
        .eq('business_id', businessId)
        .eq('user_id', userId)
        .single();

      if (memberError || !memberData) {
        return { allowed: true }; // New member, allow
      }

      query = query.eq('business_member_id', memberData.id);
    } else {
      // For anonymous users, we can't track individual cooldowns reliably
      // Allow the scan but log a warning
      console.log('⚠️ Anonymous user scan - cooldown cannot be enforced');
      return { allowed: true };
    }

    const { data: lastScanData, error: scanError } = await query;

    if (scanError) {
      console.error('Error checking last scan:', scanError);
      return { allowed: true }; // Allow if we can't check
    }

    if (!lastScanData || lastScanData.length === 0) {
      return { allowed: true }; // No previous scans, allow
    }

    const lastScanTime = new Date(lastScanData[0].created_at);
    const now = new Date();
    const timeDifferenceMinutes = (now.getTime() - lastScanTime.getTime()) / (1000 * 60);

    if (timeDifferenceMinutes < cooldownMinutes) {
      const remainingMinutes = Math.ceil(cooldownMinutes - timeDifferenceMinutes);
      return { allowed: false, remainingMinutes };
    }

    return { allowed: true };
  } catch (error) {
    console.error('Error checking cooldown period:', error);
    return { allowed: true }; // Allow if there's an error
  }
};
