
import React from "react";
import { Card } from "@/components/ui/card";

interface RewardsCardProps {
  totalStamps?: number;
  textColor?: string;
  accentColor?: string;
}

const RewardsCard: React.FC<RewardsCardProps> = ({
  totalStamps = 0,
  textColor = "#0EA5E9",
  accentColor = "#EBF0FF"
}) => {
  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl border-0 h-full">
      <div className="p-6 text-center flex flex-col h-full">
        <div className="mb-6 w-12 h-12 mx-auto rounded-full flex items-center justify-center" style={{ backgroundColor: accentColor }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={textColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" />
            <path d="M4 6v12c0 1.1.9 2 2 2h14v-4" />
            <path d="M18 12a2 2 0 0 0 0 4h2v-4z" />
          </svg>
        </div>
        
        <div 
          className="text-5xl font-bold mb-2" 
          style={{ color: textColor }}
        >
          {totalStamps}
        </div>
        
        <div className="text-gray-600 mb-4 text-lg font-medium">
          Total stamps collected
        </div>
      </div>
    </Card>
  );
};

export default RewardsCard;
