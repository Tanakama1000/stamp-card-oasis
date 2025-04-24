import React, { useEffect } from "react";
import { Trophy, AlertTriangle, RefreshCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
  const { toast } = useToast();
  const [error, setError] = React.useState<string | null>(null);
  
  useEffect(() => {
    const updateRewardStats = async () => {
      if (!showReward || !businessId) return;

      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      try {
        // Check if membership exists
        const { data: existingMembership, error: fetchError } = await supabase
          .from('business_members')
          .select('*')
          .eq('business_id', businessId)
          .eq(userId ? 'user_id' : 'is_anonymous', userId || true)
          .maybeSingle();

        if (fetchError) throw fetchError;

        if (existingMembership) {
          // Update existing membership
          const { error: updateError } = await supabase
            .from('business_members')
            .update({
              total_rewards_earned: (existingMembership.total_rewards_earned || 0) + 1,
            })
            .eq('id', existingMembership.id);

          if (updateError) throw updateError;
        } else {
          // Create new membership
          const { error: insertError } = await supabase
            .from('business_members')
            .insert({
              business_id: businessId,
              user_id: userId,
              is_anonymous: !userId,
              total_rewards_earned: 1,
              stamps: 0,
            });

          if (insertError) throw insertError;
        }
      } catch (error) {
        console.error('Error updating reward stats:', error);
        setError('Failed to update reward statistics');
      }
    };

    updateRewardStats();
  }, [showReward, businessId]);

  // Reset handler
  const handleReset = async () => {
    if (!businessId) {
      console.error('No business ID provided');
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      // Update redeemed rewards count in database
      const { error: updateError } = await supabase
        .from('business_members')
        .update({
          stamps: 0,
          redeemed_rewards: supabase.sql`redeemed_rewards + 1`
        })
        .eq('business_id', businessId)
        .eq(userId ? 'user_id' : 'is_anonymous', userId || true);

      if (updateError) throw updateError;

      if (onReset) onReset();
      
      toast({
        title: "Card Reset",
        description: "Your loyalty card has been reset and your reward has been redeemed.",
        variant: "default",
        duration: 2500,
      });
    } catch (error) {
      console.error('Error resetting card:', error);
      setError('Failed to reset card');
      toast({
        title: "Error",
        description: "Failed to reset card. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!showReward) return null;

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
      <div className="flex justify-center mt-2 mb-4">
        <Trophy size={32} className="text-yellow-300 animate-pulse" />
      </div>

      {error && (
        <Alert variant="destructive" className="mt-4 mb-2 bg-red-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Reset Button */}
      <div className="flex justify-center">
        <Button
          variant="destructive"
          className="rounded-full font-bold px-6 py-2 flex items-center gap-2 text-base"
          onClick={handleReset}
          aria-label="Reset card"
        >
          <RefreshCcw size={18} className="mr-1" />
          Reset Card
        </Button>
      </div>
    </div>
  );
};

export default RewardCard;
