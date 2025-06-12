
import { supabase } from "@/integrations/supabase/client";

export class StampProcessor {
  static async processAuthenticatedUser(
    businessId: string, 
    userId: string, 
    stampsToAward: number
  ): Promise<{ success: boolean; message: string; totalStamps?: number }> {
    try {
      console.log("🔄 Processing authenticated user scan...");
      
      // First, check existing membership
      const { data: existingMembership, error: fetchError } = await supabase
        .from('business_members')
        .select('id, stamps, total_stamps_collected')
        .eq('business_id', businessId)
        .eq('user_id', userId)
        .maybeSingle();
      
      if (fetchError) {
        console.error("❌ Error fetching membership:", fetchError);
        throw new Error(`Database error: ${fetchError.message}`);
      }

      console.log("📊 Existing membership:", existingMembership);

      let newStampCount = stampsToAward;
      let memberId;
      
      if (existingMembership) {
        // Update existing membership
        const updatedStamps = (existingMembership.stamps || 0) + stampsToAward;
        const updatedTotalStamps = (existingMembership.total_stamps_collected || 0) + stampsToAward;
        console.log(`🔄 Updating stamps from ${existingMembership.stamps} to ${updatedStamps} (+${stampsToAward})`);
        console.log(`🔄 Updating total stamps from ${existingMembership.total_stamps_collected} to ${updatedTotalStamps}`);
        
        const { error: updateError } = await supabase
          .from('business_members')
          .update({ 
            stamps: updatedStamps,
            total_stamps_collected: updatedTotalStamps
          })
          .eq('id', existingMembership.id);
          
        if (updateError) {
          console.error("❌ Error updating stamps:", updateError);
          throw new Error(`Failed to update stamps: ${updateError.message}`);
        }
        
        newStampCount = updatedStamps;
        memberId = existingMembership.id;
        console.log("✅ Successfully updated existing membership");
      } else {
        // Create new membership
        console.log("🆕 Creating new membership...");
        const { data: newMembership, error: insertError } = await supabase
          .from('business_members')
          .insert({
            business_id: businessId,
            user_id: userId,
            stamps: stampsToAward,
            total_stamps_collected: stampsToAward,
            is_anonymous: false,
          })
          .select('id')
          .single();
          
        if (insertError) {
          console.error("❌ Error creating membership:", insertError);
          throw new Error(`Failed to create membership: ${insertError.message}`);
        }
        
        if (newMembership) {
          memberId = newMembership.id;
          console.log("✅ Successfully created new membership:", memberId);
        } else {
          throw new Error("Failed to create membership - no data returned");
        }
      }

      // Verify the operation was successful by checking the database
      const { data: verifyData, error: verifyError } = await supabase
        .from('business_members')
        .select('stamps, total_stamps_collected')
        .eq('id', memberId)
        .single();

      if (verifyError) {
        console.error("❌ Error verifying stamp update:", verifyError);
        throw new Error("Could not verify stamp was recorded");
      }

      console.log("✅ Verification successful. Current stamps:", verifyData);

      return {
        success: true,
        message: `Successfully scanned! ${stampsToAward} stamp(s) added to your loyalty card. Total: ${verifyData.stamps}`,
        totalStamps: verifyData.stamps
      };
    } catch (error) {
      console.error("❌ Database operation failed:", error);
      return {
        success: false,
        message: `Database error: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`
      };
    }
  }
}
