
import React from "react";
import { Trophy, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RewardCardProps {
  showReward: boolean;
  rewardTextColor: string;
  stampActiveColor: string;
  descriptionFont?: string;
  descriptionFontSize?: string;
  onReset?: () => void;
}

const RewardCard: React.FC<RewardCardProps> = ({
  showReward,
  rewardTextColor,
  stampActiveColor,
  descriptionFont,
  descriptionFontSize,
  onReset
}) => {
  if (!showReward) return null;
  
  return (
    <div 
      className="mt-6 p-4 text-white text-center rounded-lg shadow-lg transform transition-transform"
      style={{ backgroundColor: stampActiveColor || "#8B4513" }}
    >
      <p 
        className="font-bold text-lg" 
        style={{ 
          color: rewardTextColor,
          fontFamily: descriptionFont !== "default" ? descriptionFont : 'inherit' 
        }}
      >
        Congratulations! You've earned a reward!
      </p>
      <p 
        className={`${descriptionFontSize} mt-1`} 
        style={{ 
          color: rewardTextColor,
          fontFamily: descriptionFont !== "default" ? descriptionFont : 'inherit'
        }}
      >
        Show this to a staff member to claim.
      </p>
      <div className="flex justify-center mt-2">
        <Trophy size={32} className="text-yellow-300 animate-pulse" />
      </div>
      
      {onReset && (
        <Button
          onClick={onReset}
          className="mt-4 w-full bg-white hover:bg-gray-100 text-coffee-dark flex items-center justify-center gap-2"
        >
          <RefreshCw size={16} />
          Start New Card
        </Button>
      )}
    </div>
  );
};

export default RewardCard;
