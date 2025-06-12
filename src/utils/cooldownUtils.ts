
import { supabase } from "@/integrations/supabase/client";

export interface CooldownInfo {
  isInCooldown: boolean;
  remainingSeconds: number;
  lastScanTime: Date | null;
}

export const checkScanCooldown = async (businessId: string, cooldownMinutes: number): Promise<CooldownInfo> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;

    let lastScanTime: Date | null = null;

    if (userId) {
      // For authenticated users, check the database for the last scan time
      const { data: membershipData, error } = await supabase
        .from('business_members')
        .select('*')
        .eq('business_id', businessId)
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error checking scan cooldown:', error);
        // Fail open - allow scanning if there's an error
        return { isInCooldown: false, remainingSeconds: 0, lastScanTime: null };
      }

      if (membershipData) {
        // Get the most recent stamp record for this member
        const { data: stampData, error: stampError } = await supabase
          .from('stamp_records')
          .select('created_at')
          .eq('business_member_id', membershipData.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (!stampError && stampData) {
          lastScanTime = new Date(stampData.created_at);
        }
      }
    } else {
      // For anonymous users, check localStorage
      const lastScanTimestamp = localStorage.getItem(`lastScan_${businessId}`);
      if (lastScanTimestamp) {
        lastScanTime = new Date(parseInt(lastScanTimestamp));
      }
    }

    if (!lastScanTime) {
      // No previous scan found, not in cooldown
      return { isInCooldown: false, remainingSeconds: 0, lastScanTime: null };
    }

    const now = new Date();
    const timeDifferenceMs = now.getTime() - lastScanTime.getTime();
    const cooldownMs = cooldownMinutes * 60 * 1000;
    const remainingMs = cooldownMs - timeDifferenceMs;

    if (remainingMs > 0) {
      return {
        isInCooldown: true,
        remainingSeconds: Math.ceil(remainingMs / 1000),
        lastScanTime
      };
    }

    return { isInCooldown: false, remainingSeconds: 0, lastScanTime };
  } catch (error) {
    console.error('Error in checkScanCooldown:', error);
    // Fail open - allow scanning if there's an error
    return { isInCooldown: false, remainingSeconds: 0, lastScanTime: null };
  }
};

export const recordScanTimestamp = async (businessId: string): Promise<void> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;

    if (!userId) {
      // For anonymous users, store in localStorage
      localStorage.setItem(`lastScan_${businessId}`, Date.now().toString());
    }
    // For authenticated users, the timestamp is automatically recorded in stamp_records
    // when the stamp is collected, so no additional action needed here
  } catch (error) {
    console.error('Error recording scan timestamp:', error);
  }
};

export const formatCooldownTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes > 0) {
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  return `0:${remainingSeconds.toString().padStart(2, '0')}`;
};
