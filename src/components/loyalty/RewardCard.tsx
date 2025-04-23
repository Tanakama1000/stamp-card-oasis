
import React, { useEffect } from "react";
import { Trophy, AlertTriangle, RefreshCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

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
    if (showReward) {
      console.log("RewardCard mounted with businessId:", businessId);
      // Save reward state in localStorage
      if (businessId) {
        const rewardsData = JSON.parse(localStorage.getItem('businessRewards') || '{}');
        rewardsData[businessId] = rewardsData[businessId] || { count: 0, lastReward: Date.now() };
        rewardsData[businessId].count = (rewardsData[businessId].count || 0) + 1;
        rewardsData[businessId].lastReward = Date.now();
        localStorage.setItem('businessRewards', JSON.stringify(rewardsData));
      }
    }
  }, [businessId, showReward]);
  
  if (!showReward) return null;

  // Reset handler: call parent's onReset
  const handleReset = () => {
    if (onReset) onReset();
    // Update localStorage to reflect card reset
    if (businessId) {
      const rewardsData = JSON.parse(localStorage.getItem('businessRewards') || '{}');
      if (rewardsData[businessId]) {
        rewardsData[businessId].lastReset = Date.now();
        localStorage.setItem('businessRewards', JSON.stringify(rewardsData));
      }
    }
    
    // Optionally, show toast if you want to notify the user
    toast({
      title: "Card Reset",
      description: "Your loyalty card has been reset.",
      variant: "destructive",
      duration: 2500,
    });
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
