
import React from "react";
import { Trophy, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

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
  if (!showReward) return null;
  
  const handleStartNewCard = async () => {
    // If there is a business ID, record the reward redemption
    if (businessId) {
      try {
        // Get current user
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user?.id) {
          // Record the redemption in the database using RPC
          await supabase.rpc('increment_redeemed_rewards', {
            user_id_param: session.user.id,
            business_id_param: businessId
          }).then(({ data, error }) => {
            if (error) {
              console.error("Error incrementing rewards:", error);
              return;
            }
            
            // Update stamps to 0 and set redeemed_rewards to the value returned by the function
            return supabase
              .from('business_members')
              .update({ 
                stamps: 0,
                redeemed_rewards: data
              })
              .eq('business_id', businessId)
              .eq('user_id', session.user.id);
          });
          
          console.log("Card reset successfully");
        }
      } catch (error) {
        console.error("Failed to record reward redemption:", error);
      }
    }
    
    // Call the reset function provided by the parent
    if (onReset) {
      onReset();
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
