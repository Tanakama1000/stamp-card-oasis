
import React, { useEffect } from "react";
import { Trophy, RefreshCw, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  const [error, setError] = React.useState<string | null>(null);
  const [processing, setProcessing] = React.useState(false);
  
  useEffect(() => {
    if (showReward) {
      console.log("RewardCard mounted with businessId:", businessId);
    }
  }, [businessId, showReward]);
  
  if (!showReward) return null;

  const handleManualReset = async () => {
    try {
      setError(null);
      setProcessing(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      if (userId && businessId) {
        // For authenticated users with business ID
        const { data: membership, error: membershipError } = await supabase
          .from('business_members')
          .select('id, stamps, redeemed_rewards')
          .eq('business_id', businessId)
          .eq('user_id', userId)
          .single();

        if (membershipError) {
          console.error("Error fetching membership:", membershipError);
          // Continue with local storage if DB fetch fails
        } else {
          // Update database if membership exists
          const { error: updateError } = await supabase
            .from('business_members')
            .update({ 
              stamps: 0,
              redeemed_rewards: (membership.redeemed_rewards || 0) + 1
            })
            .eq('id', membership.id);

          if (updateError) {
            console.error("Error updating membership:", updateError);
            // Continue with local storage if DB update fails
          }
        }
      }
      
      // Always update local storage as fallback
      try {
        const savedMemberships = localStorage.getItem('memberships') || '[]';
        const memberships = JSON.parse(savedMemberships);
        
        if (businessId) {
          const membershipIndex = memberships.findIndex((m: any) => m.businessId === businessId);
          if (membershipIndex !== -1) {
            memberships[membershipIndex].stamps = 0;
            memberships[membershipIndex].redeemedRewards = (memberships[membershipIndex].redeemedRewards || 0) + 1;
          }
        }
        
        localStorage.setItem('memberships', JSON.stringify(memberships));
      } catch (e) {
        console.error("Error updating localStorage:", e);
      }

      toast({
        title: "Card Reset Successfully",
        description: "Your loyalty card has been reset and your reward has been recorded.",
        duration: 3000,
      });

      // Make sure to call the onReset callback to update parent components
      if (onReset) {
        onReset();
      }
    } catch (error) {
      console.error("Reset error:", error);
      toast({
        variant: "destructive",
        title: "Reset Failed",
        description: "Could not reset your card. Please try again.",
        duration: 3000,
      });
    } finally {
      setProcessing(false);
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

      {error && (
        <Alert variant="destructive" className="mt-4 mb-2 bg-red-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="flex flex-col gap-2 mt-4">
        <Button
          onClick={handleManualReset}
          disabled={processing}
          className="w-full bg-white hover:bg-gray-100 text-coffee-dark flex items-center justify-center gap-2"
          aria-label="Reset card and record reward"
        >
          <RefreshCw size={16} className={processing ? "animate-spin" : ""} />
          {processing ? "Processing..." : "Reset Card & Record Reward"}
        </Button>
      </div>
    </div>
  );
};

export default RewardCard;
