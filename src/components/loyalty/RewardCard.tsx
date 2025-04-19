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
  
  useEffect(() => {
    if (showReward) {
      console.log("RewardCard mounted/updated with businessId:", businessId);
    }
  }, [businessId, showReward]);
  
  if (!showReward) return null;
  
  const handleStartNewCard = async () => {
    console.log("Start New Card button clicked, businessId:", businessId);
    
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

      const { error: updateError } = await supabase
        .from('business_members')
        .update({ 
          stamps: 0,
          redeemed_rewards: data
        })
        .eq('business_id', businessId)
        .eq('user_id', session.user.id);

      if (updateError) {
        console.error("Error updating business member:", updateError);
        toast({
          variant: "destructive",
          title: "Error", 
          description: "Failed to reset your card. Please try again.",
          duration: 3000,
        });
        return;
      }

      console.log("Card reset successful in database");
      
      toast({
        title: "New Card Started!",
        description: "Your loyalty card has been reset and your reward recorded.",
        duration: 3000,
      });
      
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
        Show this to a staff member to claim your reward.
      </p>
      <div className="flex justify-center mt-2">
        <Trophy size={32} className="text-yellow-300 animate-pulse" />
      </div>
      
      <Button
        onClick={handleStartNewCard}
        className="mt-4 w-full bg-white hover:bg-gray-100 text-coffee-dark flex items-center justify-center gap-2"
        aria-label="Start a new loyalty card"
      >
        <RefreshCw size={16} />
        Start New Card
      </Button>
    </div>
  );
};

export default RewardCard;
