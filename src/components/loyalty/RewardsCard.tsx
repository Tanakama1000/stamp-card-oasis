
import React from "react";
import { Card } from "@/components/ui/card";
import { Trophy, Badge } from "lucide-react";

interface RewardsCardProps {
  rewardsCount?: number;
  totalEarned?: number;
  totalStamps?: number;
  textColor?: string;
  accentColor?: string;
}

const RewardsCard: React.FC<RewardsCardProps> = ({
  rewardsCount = 0,
  totalEarned = 0,
  totalStamps = 0,
  textColor = "#0EA5E9",
  accentColor = "#EBF0FF"
}) => {
  return (
    <Card className="overflow-hidden shadow-md">
      <div 
        className="p-4 flex items-center gap-2"
        style={{ backgroundColor: accentColor }}
      >
        <Trophy size={20} style={{ color: textColor }} />
        <h3 
          className="text-lg font-semibold" 
          style={{ color: textColor }}
        >
          Your Rewards
        </h3>
      </div>

      <div className="p-6 text-center">
        <div 
          className="text-6xl font-bold mb-4" 
          style={{ color: textColor }}
        >
          {totalStamps}
        </div>
        
        <div className="text-gray-600 mb-6 text-lg">
          Total stamps collected
        </div>
        
        <div className="border-t border-gray-100 pt-4">
          {rewardsCount > 0 && (
            <div className="flex items-center justify-center gap-2 mb-2">
              <Badge className="text-white" size={16} style={{ color: textColor }} />
              <p className="text-sm font-medium" style={{ color: textColor }}>
                {rewardsCount} {rewardsCount === 1 ? 'reward' : 'rewards'} available
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default RewardsCard;
