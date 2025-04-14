
import React from "react";

interface ProgressBarProps {
  stamps: number;
  maxStamps: number;
  progressBarColor: string;
  progressBarBgColor: string;
  rewards?: { stampNumber: number; description: string; icon: string }[];
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  stamps,
  maxStamps,
  progressBarColor,
  progressBarBgColor,
  rewards = []
}) => {
  const rewardProgress = Math.min((stamps / maxStamps) * 100, 100);
  
  return (
    <div className="relative h-3 rounded-full mb-6 overflow-hidden shadow-inner" style={{ backgroundColor: progressBarBgColor }}>
      <div
        className="absolute top-0 left-0 h-3 rounded-full transition-all duration-1000 ease-out"
        style={{ 
          width: `${rewardProgress}%`,
          backgroundColor: progressBarColor 
        }}
      />
      {rewards && rewards.map((reward) => {
        const position = (reward.stampNumber / maxStamps) * 100;
        const isReached = stamps >= reward.stampNumber;
        
        return (
          <div 
            key={reward.stampNumber}
            className={`absolute top-0 w-1.5 h-3 transition-all duration-300 ${isReached ? 'bg-yellow-300' : 'bg-orange-200'}`}
            style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
            title={`${reward.description} at stamp ${reward.stampNumber}`}
          />
        );
      })}
    </div>
  );
};

export default ProgressBar;
