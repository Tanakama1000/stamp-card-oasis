
import React from "react";
import { Trophy } from "lucide-react";

interface RewardCardProps {
  showReward: boolean;
  rewardTextColor: string;
  stampActiveColor: string;
  descriptionFont?: string;
  descriptionFontSize?: string;
}

const RewardCard: React.FC<RewardCardProps> = ({
  showReward,
  rewardTextColor,
  stampActiveColor,
  descriptionFont,
  descriptionFontSize
}) => {
  if (!showReward) return null;
  
  return (
    <div 
      className="mt-6 p-4 text-white text-center rounded-lg animate-pulse shadow-lg transform transition-transform hover:scale-105"
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
    </div>
  );
};

export default RewardCard;
