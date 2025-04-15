
import React from "react";
import { STAMP_ICONS } from "./types";
import { useIsMobile } from "@/hooks/use-mobile";

interface StampGridProps {
  maxStamps: number;
  stamps: number;
  cardStyle?: any;
  onStampClick: (index: number) => void;
  animatingStamp: number | null;
  stampsCollected: number[];
}

const StampGrid: React.FC<StampGridProps> = ({
  maxStamps,
  stamps,
  cardStyle,
  onStampClick,
  animatingStamp,
  stampsCollected
}) => {
  const isMobile = useIsMobile();
  
  const renderStamps = () => {
    const stampsPerRow = isMobile ? 3 : 5; // Reduce stamps per row on mobile
    const rowCount = Math.ceil(maxStamps / stampsPerRow);
    const miniRewards = cardStyle?.rewards || [];

    // Determine stamp icon to use
    const StampIcon = cardStyle?.stampIcon ? 
      STAMP_ICONS[cardStyle.stampIcon as keyof typeof STAMP_ICONS] : 
      STAMP_ICONS.Coffee;
    
    // Prepare rows array
    const rows = [];

    for (let i = 0; i < rowCount; i++) {
      const stampRow = [];
      
      for (let j = 0; j < stampsPerRow; j++) {
        const stampIndex = i * stampsPerRow + j;
        
        // Skip if we've reached maximum stamps
        if (stampIndex >= maxStamps) continue;
        
        // Determine stamp properties
        const isLastStamp = stampIndex === maxStamps - 1;
        const isCollected = stampIndex < stamps;
        const isNext = stampIndex === stamps;
        
        // Find mini reward if any
        const miniReward = miniRewards.find(r => r.stampNumber === stampIndex + 1);
        const isMiniRewardStamp = !!miniReward;
        
        // Choose icon based on stamp type
        const CurrentIcon = isMiniRewardStamp 
          ? STAMP_ICONS[miniReward.icon as keyof typeof STAMP_ICONS] || StampIcon
          : StampIcon;
        
        // Animation classes
        let animationClass = "";
        if (stampIndex === animatingStamp) {
          animationClass = "stamp-animation";
        } else if (isNext) {
          animationClass = "pulse";
        } else if (isCollected && stampsCollected.includes(stampIndex)) {
          animationClass = "animate-scale-in";
        }
        
        // Size based on device
        const stampSize = isMobile ? "w-14 h-14" : "w-14 h-14 md:w-16 md:h-16";
        const iconSize = isMobile ? 24 : 24;
        
        // Border color logic
        const getBorderColor = () => {
          if (isLastStamp) return cardStyle?.lastStampBorderColor || '#F97316';
          if (isMiniRewardStamp) return '#F97316';
          return cardStyle?.stampActiveColor || '#8B4513';
        };

        // Background color logic
        const getBackgroundColor = () => {
          if (isCollected) {
            return isMiniRewardStamp 
              ? '#F97316' 
              : cardStyle?.stampActiveColor || '#8B4513';
          }
          
          return isMiniRewardStamp && cardStyle?.miniRewardStampColor 
            ? cardStyle.miniRewardStampColor 
            : cardStyle?.stampBgColor || '#F5F5DC';
        };
        
        const borderColor = getBorderColor();
        const backgroundColor = getBackgroundColor();
        
        // Tooltip text
        const getTooltipText = () => {
          if (isLastStamp) return "Reward stamp";
          if (isMiniRewardStamp) return `Mini reward: ${miniReward.description}`;
          if (isCollected) return "Collected";
          if (isNext) return "Collect stamp";
          return "Future stamp";
        };
        
        stampRow.push(
          <div
            key={stampIndex}
            className={`${stampSize} rounded-full flex items-center justify-center transition-all duration-300 
              ${isCollected ? "text-white shadow-lg" : "border text-coffee-light"} 
              ${animationClass}
              ${isNext && stamps < maxStamps ? "hover:scale-105" : ""}
              ${(isLastStamp || isMiniRewardStamp) && !isCollected ? "border-dashed" : ""}
              ${isLastStamp ? "relative" : ""}
            `}
            onClick={() => onStampClick(stampIndex)}
            title={getTooltipText()}
            style={{
              backgroundColor,
              borderColor,
              color: isCollected ? '#FFFFFF' : cardStyle?.textColor || '#6F4E37',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease',
            }}
          >
            {isLastStamp ? (
              <div className="flex flex-col items-center justify-center w-full h-full">
                {cardStyle?.lastStampText && !isCollected ? (
                  <span 
                    className="text-center font-bold text-xs md:text-sm uppercase"
                    style={{ 
                      color: cardStyle?.lastStampTextColor || '#FFFFFF',
                      lineHeight: "1",
                      maxWidth: "100%",
                      wordBreak: "break-word"
                    }}
                  >
                    {cardStyle.lastStampText}
                  </span>
                ) : (
                  <CurrentIcon size={iconSize} className={isCollected ? "animate-bounce-once" : ""} />
                )}
              </div>
            ) : (
              <CurrentIcon size={iconSize} className={isCollected ? "animate-bounce-once" : ""} />
            )}
            
            {isMiniRewardStamp && (
              <span 
                className="absolute -top-1 -right-1 bg-orange text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow-sm"
                aria-label={`Stamp ${stampIndex + 1}`}
              >
                {stampIndex + 1}
              </span>
            )}
          </div>
        );
      }
      
      if (stampRow.length > 0) {
        rows.push(
          <div key={i} className="flex justify-center gap-3 my-2">
            {stampRow}
          </div>
        );
      }
    }
    
    return rows;
  };

  return (
    <div className="flex flex-col gap-2 relative z-10" role="group" aria-label="Loyalty card stamps">
      {renderStamps()}
    </div>
  );
};

export default StampGrid;
