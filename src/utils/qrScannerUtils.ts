
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

// Client-side cooldown mechanism for anonymous users
const getAnonymousCooldownKey = (businessId: string) => `cooldown_${businessId}`;

const checkAnonymousCooldown = (businessId: string, cooldownMinutes: number): { allowed: boolean; remainingMinutes?: number } => {
  const cooldownKey = getAnonymousCooldownKey(businessId);
  const lastScanTime = localStorage.getItem(cooldownKey);
  
  if (!lastScanTime) {
    console.log('✅ Anonymous user - no previous scan found');
    return { allowed: true };
  }
  
  const lastScan = new Date(lastScanTime);
  const now = new Date();
  const timeDifferenceMinutes = (now.getTime() - lastScan.getTime()) / (1000 * 60);
  
  console.log(`⏰ Anonymous cooldown check: Last scan ${timeDifferenceMinutes.toFixed(2)} minutes ago`);
  
  if (timeDifferenceMinutes < cooldownMinutes) {
    const remainingMinutes = Math.ceil(cooldownMinutes - timeDifferenceMinutes);
    console.log(`🚫 Anonymous cooldown active - ${remainingMinutes} minutes remaining`);
    return { allowed: false, remainingMinutes };
  }
  
  console.log('✅ Anonymous cooldown period has passed');
  return { allowed: true };
};

const setAnonymousCooldown = (businessId: string) => {
  const cooldownKey = getAnonymousCooldownKey(businessId);
  localStorage.setItem(cooldownKey, new Date().toISOString());
  console.log('💾 Anonymous cooldown timestamp saved');
};

export const checkCooldownPeriod = async (businessId: string, userId: string | null): Promise<{ allowed: boolean; remainingMinutes?: number }> => {
  try {
    console.log(`🔍 Checking cooldown for business ${businessId}, user ${userId || 'anonymous'}`);
    
    // Get business cooldown setting - fail if we can't get it
    const { data: businessData, error: businessError } = await supabase
      .from('businesses')
      .select('cooldown_minutes')
      .eq('id', businessId)
      .single();

    if (businessError) {
      console.error('❌ Error fetching business cooldown settings:', businessError);
      return { allowed: false }; // Fail closed - don't allow if we can't check
    }

    if (!businessData) {
      console.error('❌ No business data found');
      return { allowed: false }; // Fail closed
    }

    const cooldownMinutes = businessData.cooldown_minutes || 2;
    console.log(`⏰ Business cooldown period: ${cooldownMinutes} minutes`);

    // For anonymous users, use client-side cooldown mechanism
    if (!userId) {
      console.log('👤 Anonymous user - checking client-side cooldown');
      const result = checkAnonymousCooldown(businessId, cooldownMinutes);
      if (result.allowed) {
        setAnonymousCooldown(businessId);
      }
      return result;
    }

    // For authenticated users, check via business_members and stamp_records
    console.log('👤 Authenticated user - checking database cooldown');
    
    const { data: memberData, error: memberError } = await supabase
      .from('business_members')
      .select('id')
      .eq('business_id', businessId)
      .eq('user_id', userId)
      .maybeSingle(); // Use maybeSingle to handle no results gracefully

    if (memberError) {
      console.error('❌ Error fetching member data:', memberError);
      return { allowed: false }; // Fail closed on database errors
    }

    if (!memberData) {
      console.log('✅ New authenticated user - allowing first scan');
      return { allowed: true }; // New member, allow first scan
    }

    console.log(`📋 Found member record: ${memberData.id}`);

    // Check last scan time for this member
    const { data: lastScanData, error: scanError } = await supabase
      .from('stamp_records')
      .select('created_at')
      .eq('business_member_id', memberData.id)
      .eq('business_id', businessId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(); // Use maybeSingle to handle no results gracefully

    if (scanError) {
      console.error('❌ Error checking last scan:', scanError);
      return { allowed: false }; // Fail closed on database errors
    }

    if (!lastScanData) {
      console.log('✅ No previous scans found for member - allowing scan');
      return { allowed: true };
    }

    const lastScanTime = new Date(lastScanData.created_at);
    const now = new Date();
    const timeDifferenceMinutes = (now.getTime() - lastScanTime.getTime()) / (1000 * 60);

    console.log(`⏰ Last scan: ${lastScanTime.toISOString()}`);
    console.log(`⏰ Time difference: ${timeDifferenceMinutes.toFixed(2)} minutes`);
    console.log(`⏰ Required cooldown: ${cooldownMinutes} minutes`);

    if (timeDifferenceMinutes < cooldownMinutes) {
      const remainingMinutes = Math.ceil(cooldownMinutes - timeDifferenceMinutes);
      console.log(`🚫 Authenticated cooldown active - ${remainingMinutes} minutes remaining`);
      return { allowed: false, remainingMinutes };
    }

    console.log('✅ Authenticated cooldown period has passed - allowing scan');
    return { allowed: true };
  } catch (error) {
    console.error('❌ Exception in cooldown check:', error);
    return { allowed: false }; // Fail closed on any exception
  }
};

// Export the anonymous cooldown functions for use in other components
export { checkAnonymousCooldown, setAnonymousCooldown };
