
import { supabase } from "@/integrations/supabase/client";

export class StampExpiryService {
  private static intervalId: NodeJS.Timeout | null = null;
  private static isRunning = false;

  static async expireStamps(): Promise<number> {
    try {
      console.log("🕐 Running stamp expiry check...");
      
      const { data, error } = await supabase.rpc('expire_old_stamps');
      
      if (error) {
        console.error("❌ Error expiring stamps:", error);
        throw error;
      }
      
      const expiredCount = data || 0;
      console.log(`✅ Expired ${expiredCount} stamps`);
      
      return expiredCount;
    } catch (error) {
      console.error("❌ Exception in stamp expiry:", error);
      return 0;
    }
  }

  static startAutoExpiry(intervalMinutes: number = 60): void {
    if (this.isRunning) {
      console.log("⚠️ Stamp expiry service already running");
      return;
    }

    console.log(`🚀 Starting stamp expiry service (every ${intervalMinutes} minutes)`);
    
    // Run immediately on start
    this.expireStamps();
    
    // Then run at intervals
    this.intervalId = setInterval(() => {
      this.expireStamps();
    }, intervalMinutes * 60 * 1000);
    
    this.isRunning = true;
  }

  static stopAutoExpiry(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      this.isRunning = false;
      console.log("🛑 Stopped stamp expiry service");
    }
  }

  static isServiceRunning(): boolean {
    return this.isRunning;
  }
}
