
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
    const stampsPerRow = isMobile ? 3 : 5;
    const rowCount = Math.ceil(maxStamps / stampsPerRow);
    const miniRewards = cardStyle?.rewards || [];

    // Use custom last stamp icon or default to Gift
    const RewardIcon = cardStyle?.lastStampIcon ? 
      STAMP_ICONS[cardStyle.lastStampIcon as keyof typeof STAMP_ICONS] : 
      STAMP_ICONS.Gift;
      
    const StampIcon = cardStyle?.stampIcon ? 
      STAMP_ICONS[cardStyle.stampIcon as keyof typeof STAMP_ICONS] : 
      STAMP_ICONS.Coffee;

    const rows = [];

    for (let i = 0; i < rowCount; i++) {
      const stampRow = [];
      for (let j = 0; j < stampsPerRow; j++) {
        const stampIndex = i * stampsPerRow + j;
        if (stampIndex < maxStamps) {
          const isLastStamp = stampIndex === maxStamps - 1;
          const miniReward = miniRewards.find(r => r.stampNumber === stampIndex + 1);
          const isMiniRewardStamp = !!miniReward;
          
          let CurrentIcon;
          if (isLastStamp) {
            CurrentIcon = RewardIcon;
          } else if (isMiniRewardStamp) {
            CurrentIcon = STAMP_ICONS[miniReward.icon as keyof typeof STAMP_ICONS] || StampIcon;
          } else {
            CurrentIcon = StampIcon;
          }
          
          const isCollected = stampIndex < stamps;
          const isNext = stampIndex === stamps;

          let animationClass = "";
          if (stampIndex === animatingStamp) {
            animationClass = "stamp-animation";
          } else if (isNext) {
            animationClass = "pulse";
          } else if (isCollected && stampsCollected.includes(stampIndex)) {
            animationClass = "animate-scale-in";
          }
          
          const stampSize = isMobile ? "w-14 h-14" : "w-14 h-14 md:w-16 md:h-16";
          const iconSize = isMobile ? 24 : 24;
          
          stampRow.push(
            <div
              key={stampIndex}
              className={`${stampSize} rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 
                ${isCollected ? "text-white shadow-lg" : "border text-coffee-light"} 
                ${animationClass}
                ${isNext && stamps < maxStamps ? "hover:text-white hover:scale-110 hover:shadow-md" : ""}
                ${(isLastStamp || isMiniRewardStamp) && !isCollected ? "border-dashed" : ""}
              `}
              onClick={() => onStampClick(stampIndex)}
              title={
                isLastStamp ? "Reward stamp" : 
                (isMiniRewardStamp ? `Mini reward: ${miniReward.description}` : 
                (isCollected ? "Collected" : 
                isNext ? "Collect stamp" : "Future stamp"))
              }
              style={{
                backgroundColor: isCollected 
                  ? (isMiniRewardStamp ? '#F97316' : cardStyle?.stampActiveColor || '#8B4513')
                  : (isMiniRewardStamp && cardStyle?.miniRewardStampColor ? 
                      cardStyle.miniRewardStampColor : 
                      cardStyle?.stampBgColor || '#F5F5DC'),
                borderColor: (isLastStamp || isMiniRewardStamp)
                  ? (isCollected ? cardStyle?.lastStampColor || '#F97316' : cardStyle?.lastStampColor || '#F97316')
                  : cardStyle?.stampActiveColor || '#8B4513',
                color: isCollected 
                  ? '#FFFFFF' 
                  : cardStyle?.textColor || '#6F4E37',
                transform: isCollected ? 'scale(1)' : 'scale(1)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease',
              }}
            >
              <CurrentIcon size={iconSize} className={isCollected ? "animate-bounce-once" : ""} />
              {isMiniRewardStamp && (
                <span className="absolute -top-1 -right-1 bg-orange text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow-sm">
                  {stampIndex + 1}
                </span>
              )}
            </div>
          );
        }
      }
      rows.push(
        <div key={i} className="flex justify-center gap-3 my-2">
          {stampRow}
        </div>
      );
    }
    return rows;
  };

  return <div className="flex flex-col gap-2 relative z-10">{renderStamps()}</div>;
};

export default StampGrid;
