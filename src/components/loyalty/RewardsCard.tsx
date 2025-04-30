
import React from "react";
import { Card } from "@/components/ui/card";

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
      </div>
    </Card>
  );
};

export default RewardsCard;
