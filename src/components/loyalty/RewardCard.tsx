
import React, { useEffect } from "react";
import { Trophy, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface RewardCardProps {
  showReward: boolean;
  rewardTextColor: string;
  stampActiveColor: string;
  descriptionFont?: string;
  descriptionFontSize?: string;
  onReset?: () => void;
  businessId?: string;
}

const RewardCard: React.FC<RewardCardProps> = ({
  showReward,
  rewardTextColor,
  stampActiveColor,
  descriptionFont,
  descriptionFontSize,
  onReset,
  businessId
}) => {
  const { toast } = useToast();
  
  // Debug log to check business ID on mount and when it changes
  useEffect(() => {
    if (showReward) {
      console.log("RewardCard mounted/updated with businessId:", businessId);
    }
  }, [businessId, showReward]);
  
  if (!showReward) return null;
  
  const handleStartNewCard = async () => {
    console.log("Start New Card button clicked, businessId:", businessId);
    
    // Validate businessId exists and isn't empty
    if (!businessId || businessId.trim() === "") {
      console.error("No business ID provided or empty string");
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not identify business for this card.",
        duration: 3000,
      });
      return;
    }

    try {
      // Get current user session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user?.id) {
        console.error("No user session found");
        toast({
          variant: "destructive",
          title: "Error",
          description: "You need to be logged in to reset your card.",
          duration: 3000,
        });
        return;
      }

      console.log("Processing card reset for user:", session.user.id, "and business:", businessId);

      // First, update stamps to 0 (we'll update redeemed_rewards after the RPC call)
      const { error: updateStampsError } = await supabase
        .from('business_members')
        .update({ stamps: 0 })
        .eq('business_id', businessId)
        .eq('user_id', session.user.id);

      if (updateStampsError) {
        console.error("Error resetting stamps:", updateStampsError);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to reset your card. Please try again.",
          duration: 3000,
        });
        return;
      }

      // Record the redemption in the database using RPC
      const { data, error: rpcError } = await supabase.rpc('increment_redeemed_rewards', {
        user_id_param: session.user.id,
        business_id_param: businessId
      });

      if (rpcError) {
        console.error("Error incrementing rewards:", rpcError);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to record your reward. Please try again.",
          duration: 3000,
        });
        return;
      }

      console.log("Increment rewards RPC successful, new count:", data);

      // Update redeemed_rewards to the value returned by the function
      const { error: updateRewardsError } = await supabase
        .from('business_members')
        .update({ redeemed_rewards: data })
        .eq('business_id', businessId)
        .eq('user_id', session.user.id);

      if (updateRewardsError) {
        console.error("Error updating redeemed rewards:", updateRewardsError);
        toast({
          variant: "destructive",
          title: "Error", 
          description: "Failed to update rewards count. Please try again.",
          duration: 3000,
        });
        return;
      }

      console.log("Card reset successful in database");
      
      // Show success toast
      toast({
        title: "New Card Started!",
        description: "Your loyalty card has been reset and your reward recorded.",
        duration: 3000,
      });
      
      // Call the reset function provided by the parent AFTER successful database update
      if (onReset) {
        console.log("Calling onReset callback");
        onReset();
      } else {
        console.warn("No onReset callback provided");
      }
    } catch (error) {
      console.error("Failed to record reward redemption:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to reset your card. Please try again.",
        duration: 3000,
      });
    }
  };
  
  return (
    <div 
      className="mt-6 p-4 text-white text-center rounded-lg shadow-lg transform transition-transform"
      style={{ backgroundColor: stampActiveColor || "#8B4513" }}
    >
      <p 
        className="font-bold text-lg text-white" 
        style={{ 
          fontFamily: descriptionFont !== "default" ? descriptionFont : 'inherit' 
        }}
      >
        Congratulations! You've earned a reward!
      </p>
      <p 
        className={`${descriptionFontSize} mt-1 text-white`} 
        style={{ 
          fontFamily: descriptionFont !== "default" ? descriptionFont : 'inherit'
        }}
      >
        Show this to a staff member to claim reward, before you start a new card.
      </p>
      <div className="flex justify-center mt-2">
        <Trophy size={32} className="text-yellow-300 animate-pulse" />
      </div>
      
      {onReset && (
        <Button
          onClick={handleStartNewCard}
          className="mt-4 w-full bg-white hover:bg-gray-100 text-coffee-dark flex items-center justify-center gap-2"
          aria-label="Start a new loyalty card"
        >
          <RefreshCw size={16} />
          Start New Card
        </Button>
      )}
    </div>
  );
};

export default RewardCard;
