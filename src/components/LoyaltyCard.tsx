
import { useState, useEffect } from "react";
import { Coffee, Star, Heart, Award, Battery, Zap, Gift } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { LoyaltyCardConfig } from "./LoyaltyCardEditor";

interface LoyaltyCardProps {
  customerName: string;
  maxStamps: number;
  currentStamps: number;
  onStampCollected?: () => void;
  cardStyle?: LoyaltyCardConfig;
}

const STAMP_ICONS = {
  Coffee,
  Star,
  Heart,
  Award,
  Battery,
  Zap,
  Gift
};

const LoyaltyCard: React.FC<LoyaltyCardProps> = ({
  customerName,
  maxStamps = 10,
  currentStamps = 0,
  onStampCollected,
  cardStyle,
}) => {
  const [stamps, setStamps] = useState<number>(currentStamps);
  const [animatingStamp, setAnimatingStamp] = useState<number | null>(null);

  useEffect(() => {
    setStamps(currentStamps);
  }, [currentStamps]);

  const handleStampClick = (index: number) => {
    if (index === stamps && stamps < maxStamps) {
      setAnimatingStamp(index);
      setTimeout(() => {
        setAnimatingStamp(null);
        setStamps(stamps + 1);
        if (onStampCollected) {
          onStampCollected();
        }
      }, 500);
    }
  };
  
  // Select the stamp icon component based on cardStyle or default to Coffee
  const StampIcon = cardStyle?.stampIcon ? 
    STAMP_ICONS[cardStyle.stampIcon as keyof typeof STAMP_ICONS] : 
    Coffee;

  const renderStamps = () => {
    const rows = [];
    const stampsPerRow = 5;
    const rowCount = Math.ceil(maxStamps / stampsPerRow);

    for (let i = 0; i < rowCount; i++) {
      const stampRow = [];
      for (let j = 0; j < stampsPerRow; j++) {
        const stampIndex = i * stampsPerRow + j;
        if (stampIndex < maxStamps) {
          stampRow.push(
            <div
              key={stampIndex}
              className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center cursor-pointer transition-all stamp-shadow
                ${
                  stampIndex < stamps
                    ? "text-white"
                    : "border text-coffee-light"
                }
                ${
                  stampIndex === animatingStamp
                    ? "stamp-animation"
                    : ""
                }
                ${
                  stampIndex === stamps && stamps < maxStamps
                    ? "hover:text-white pulse"
                    : ""
                }
              `}
              onClick={() => handleStampClick(stampIndex)}
              title={stampIndex < stamps ? "Collected" : stampIndex === stamps ? "Collect stamp" : "Future stamp"}
              style={{
                backgroundColor: stampIndex < stamps 
                  ? cardStyle?.stampActiveColor || '#8B4513' 
                  : cardStyle?.stampBgColor || '#F5F5DC',
                borderColor: cardStyle?.stampActiveColor || '#8B4513',
                color: stampIndex < stamps 
                  ? '#FFFFFF' 
                  : cardStyle?.textColor || '#6F4E37',
              }}
            >
              <StampIcon size={24} />
            </div>
          );
        }
      }
      rows.push(
        <div key={i} className="flex justify-center gap-3">
          {stampRow}
        </div>
      );
    }
    return rows;
  };

  const rewardProgress = Math.min((stamps / maxStamps) * 100, 100);
  
  // Define styles based on cardStyle prop or fallback to defaults
  const cardBgColor = cardStyle?.cardBgColor || "#FFFFFF";
  const textColor = cardStyle?.textColor || "#6F4E37";
  const progressBarColor = cardStyle?.stampActiveColor || "#8B4513";
  const progressBarBgColor = cardStyle?.stampBgColor || "#F5F5DC";

  return (
    <Card 
      className="p-6 card-shadow overflow-hidden"
      style={{ backgroundColor: cardBgColor }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {cardStyle?.businessLogo && (
            <Avatar className="h-10 w-10">
              <AvatarImage src={cardStyle.businessLogo} alt="Business logo" />
              <AvatarFallback>{cardStyle.businessName?.charAt(0) || "B"}</AvatarFallback>
            </Avatar>
          )}
          <div>
            <h3 className="font-medium" style={{ color: textColor }}>{customerName}'s Card</h3>
            <p className="text-sm" style={{ color: textColor }}>
              Collect {maxStamps} stamps for a free item
            </p>
          </div>
        </div>
        <div 
          className="h-12 w-12 rounded-full flex items-center justify-center text-white font-bold"
          style={{ backgroundColor: progressBarColor }}
        >
          {stamps}/{maxStamps}
        </div>
      </div>

      <div className="relative h-2 rounded-full mb-6" style={{ backgroundColor: progressBarBgColor }}>
        <div
          className="absolute top-0 left-0 h-2 rounded-full transition-all duration-500"
          style={{ 
            width: `${rewardProgress}%`,
            backgroundColor: progressBarColor
          }}
        />
      </div>

      <div className="flex flex-col gap-3">{renderStamps()}</div>

      {stamps >= maxStamps && (
        <div 
          className="mt-6 p-3 text-white text-center rounded-lg animate-pulse"
          style={{ backgroundColor: cardStyle?.stampActiveColor || "#8B4513" }}
        >
          <p className="font-bold">Congratulations! You've earned a reward!</p>
          <p className="text-sm">Show this to a staff member to claim.</p>
        </div>
      )}
    </Card>
  );
};

export default LoyaltyCard;
