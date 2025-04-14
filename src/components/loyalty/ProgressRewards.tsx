
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Gift, Sparkles } from "lucide-react";
import { STAMP_ICONS } from "./types";

interface ProgressRewardsProps {
  rewards: Array<{
    stampNumber: number;
    description: string;
    icon: string;
  }>;
  stamps: number;
  progressRewardsFont?: string;
  textColor: string;
  isMobile?: boolean;
}

const ProgressRewards: React.FC<ProgressRewardsProps> = ({
  rewards,
  stamps,
  progressRewardsFont,
  textColor,
  isMobile
}) => {
  if (rewards.length === 0) return null;
  
  return (
    <div className="mb-4 md:mb-5 p-2 md:p-3 bg-cream bg-opacity-80 rounded-lg relative z-10 shadow-sm">
      <h4 
        className={`font-medium mb-2 text-sm`} 
        style={{ 
          color: textColor,
          fontFamily: progressRewardsFont !== "default" ? progressRewardsFont : 'inherit'
        }}
      >
        Progress Rewards:
      </h4>
      <div className="flex flex-wrap gap-1 md:gap-2">
        {rewards.map((reward, index) => {
          const RewardIcon = STAMP_ICONS[reward.icon as keyof typeof STAMP_ICONS] || Gift;
          const isCollected = stamps >= reward.stampNumber;
          const iconSize = isMobile ? 12 : 14;
          
          return (
            <Badge 
              key={index}
              className={`px-2 md:px-3 py-1 md:py-1.5 flex items-center gap-1 md:gap-1.5 transition-all duration-300 ${
                isCollected 
                  ? 'bg-orange hover:bg-orange-dark text-white' 
                  : 'bg-cream-light text-coffee-dark'
              } ${isCollected ? 'shadow-sm hover:shadow' : ''}`}
              variant={isCollected ? "default" : "outline"}
            >
              <RewardIcon size={iconSize} className={isCollected ? "animate-pulse" : ""} />
              <span 
                className="text-xs font-medium"
                style={{ 
                  fontFamily: progressRewardsFont !== "default" ? progressRewardsFont : 'inherit'
                }}
              >
                <span className="font-bold">{reward.stampNumber}:</span> {isMobile ? reward.description.substring(0, 10) + (reward.description.length > 10 ? '...' : '') : reward.description}
              </span>
              {isCollected && (
                <Sparkles size={isMobile ? 10 : 12} className="ml-1 text-yellow-200" />
              )}
            </Badge>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressRewards;
