
import React from "react";
import { Card } from "@/components/ui/card";
import { Trophy } from "lucide-react";

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
  textColor = "#5271FF",
  accentColor = "#EBF0FF"
}) => {
  return (
    <Card className="overflow-hidden">
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
        <div className="text-5xl font-bold mb-2" style={{ color: textColor }}>
          {rewardsCount}
        </div>
        
        {rewardsCount === 0 ? (
          <p className="text-gray-600 mb-4">You have no rewards available yet.</p>
        ) : (
          <p className="text-gray-600 mb-4">Active rewards available to use.</p>
        )}
        
        <div className="border-t border-gray-100 pt-4">
          <p className="text-sm text-gray-500">
            Total stamps collected: <span className="font-medium">{totalStamps}</span>
          </p>
        </div>
      </div>
    </Card>
  );
};

export default RewardsCard;
