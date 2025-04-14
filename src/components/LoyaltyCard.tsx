
import { useState, useEffect } from "react";
import { Coffee, Star, Heart, Award, Battery, Zap, Gift } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { LoyaltyCardConfig, Reward } from "./LoyaltyCardEditor";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Confetti from 'react-confetti';
import useWindowSize from "@/hooks/useWindowSize";

interface LoyaltyCardProps {
  customerName: string;
  maxStamps: number;
  currentStamps: number;
  onStampCollected?: () => void;
  cardStyle?: LoyaltyCardConfig;
  onReset?: () => void;
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
  onReset,
}) => {
  const { toast } = useToast();
  const { width, height } = useWindowSize();
  const [stamps, setStamps] = useState<number>(currentStamps);
  const [animatingStamp, setAnimatingStamp] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [showCompletionDialog, setShowCompletionDialog] = useState<boolean>(false);
  const [previousStamps, setPreviousStamps] = useState<number>(currentStamps);
  const [showRewardDialog, setShowRewardDialog] = useState<boolean>(false);
  const [currentReward, setCurrentReward] = useState<Reward | null>(null);

  useEffect(() => {
    setStamps(currentStamps);
    
    // Check if stamps increased and we're getting closer to reward
    if (currentStamps > previousStamps && currentStamps < maxStamps) {
      const remaining = maxStamps - currentStamps;
      if (remaining <= 3) { // Show notification when 3 or fewer stamps are remaining
        toast({
          title: `Almost There!`,
          description: `You're only ${remaining} stamp${remaining !== 1 ? 's' : ''} away from your reward!`,
          duration: 4000,
        });
      }
      
      // Check if the current stamp count triggers a mini-reward
      if (cardStyle?.rewards && cardStyle.rewards.length > 0) {
        const miniReward = cardStyle.rewards.find(r => r.stampNumber === currentStamps);
        if (miniReward) {
          setCurrentReward(miniReward);
          setShowRewardDialog(true);
          // Show a small confetti for mini rewards as well
          setShowConfetti(true);
          setTimeout(() => {
            setShowConfetti(false);
          }, 3000);
        }
      }
    }
    
    // Check if card just completed
    if (currentStamps === maxStamps && previousStamps < maxStamps) {
      setShowConfetti(true);
      setTimeout(() => {
        setShowCompletionDialog(true);
      }, 1000);
      setTimeout(() => {
        setShowConfetti(false);
      }, 5000);
    }
    
    setPreviousStamps(currentStamps);
  }, [currentStamps, maxStamps, previousStamps, toast, cardStyle]);

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
  
  const handleNewCard = () => {
    setShowCompletionDialog(false);
    if (onReset) {
      onReset();
    }
  };
  
  // Select the stamp icon component based on cardStyle or default to Coffee
  const StampIcon = cardStyle?.stampIcon ? 
    STAMP_ICONS[cardStyle.stampIcon as keyof typeof STAMP_ICONS] : 
    Coffee;
    
  // Select the reward icon component
  const RewardIcon = cardStyle?.rewardIcon ? 
    STAMP_ICONS[cardStyle.rewardIcon as keyof typeof STAMP_ICONS] : 
    Gift;

  const renderStamps = () => {
    const rows = [];
    const stampsPerRow = 5;
    const rowCount = Math.ceil(maxStamps / stampsPerRow);
    const miniRewards = cardStyle?.rewards || [];

    for (let i = 0; i < rowCount; i++) {
      const stampRow = [];
      for (let j = 0; j < stampsPerRow; j++) {
        const stampIndex = i * stampsPerRow + j;
        if (stampIndex < maxStamps) {
          // Determine if this is the last stamp (which will show the reward icon)
          const isLastStamp = stampIndex === maxStamps - 1;
          
          // Check if this is a mini-reward stamp
          const miniReward = miniRewards.find(r => r.stampNumber === stampIndex + 1);
          const isMiniRewardStamp = !!miniReward;
          
          // Choose the proper icon for the stamp
          let CurrentIcon;
          if (isLastStamp) {
            CurrentIcon = RewardIcon;
          } else if (isMiniRewardStamp) {
            CurrentIcon = STAMP_ICONS[miniReward.icon as keyof typeof STAMP_ICONS] || StampIcon;
          } else {
            CurrentIcon = StampIcon;
          }
          
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
                ${
                  (isLastStamp || isMiniRewardStamp) && stampIndex >= stamps
                    ? "border-dashed"
                    : ""
                }
              `}
              onClick={() => handleStampClick(stampIndex)}
              title={
                isLastStamp ? "Reward stamp" : 
                (isMiniRewardStamp ? `Mini reward: ${miniReward.description}` : 
                (stampIndex < stamps ? "Collected" : 
                stampIndex === stamps ? "Collect stamp" : "Future stamp"))
              }
              style={{
                backgroundColor: stampIndex < stamps 
                  ? (isMiniRewardStamp ? 
                      '#F97316' : // Special color for mini rewards
                      cardStyle?.stampActiveColor || '#8B4513')
                  : (isMiniRewardStamp && cardStyle?.miniRewardStampColor ? 
                      cardStyle.miniRewardStampColor : 
                      cardStyle?.stampBgColor || '#F5F5DC'),
                borderColor: (isLastStamp || isMiniRewardStamp)
                  ? (stampIndex < stamps ? '#F97316' : '#F97316')
                  : cardStyle?.stampActiveColor || '#8B4513',
                color: stampIndex < stamps 
                  ? '#FFFFFF' 
                  : cardStyle?.textColor || '#6F4E37',
              }}
            >
              <CurrentIcon size={24} />
              {isMiniRewardStamp && (
                <span className="absolute -top-1 -right-1 bg-orange text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {stampIndex + 1}
                </span>
              )}
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
  const businessNameColor = cardStyle?.businessNameColor || textColor;
  const rewardTextColor = cardStyle?.rewardTextColor || textColor;
  const progressBarColor = cardStyle?.stampActiveColor || "#8B4513";
  const progressBarBgColor = cardStyle?.stampBgColor || "#F5F5DC";

  // Background image styles
  const backgroundImageStyle = cardStyle?.useBackgroundImage && cardStyle?.backgroundImage ? {
    backgroundImage: `url(${cardStyle.backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  } : {};

  return (
    <>
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={200}
          gravity={0.3}
        />
      )}
      
      <Card 
        className="p-6 card-shadow overflow-hidden relative"
        style={{ 
          backgroundColor: cardBgColor,
          ...backgroundImageStyle
        }}
      >
        {/* Overlay for image background to ensure text readability */}
        {cardStyle?.useBackgroundImage && cardStyle?.backgroundImage && (
          <div 
            className="absolute inset-0 bg-black opacity-30"
            style={{ pointerEvents: 'none' }}
          ></div>
        )}
        
        <div className="flex items-center justify-between mb-6 relative z-10">
          <div className="flex items-center gap-3">
            {cardStyle?.businessLogo && (
              <Avatar className="h-10 w-10">
                <AvatarImage src={cardStyle.businessLogo} alt="Business logo" />
                <AvatarFallback>{cardStyle?.businessName?.charAt(0) || "B"}</AvatarFallback>
              </Avatar>
            )}
            <div>
              {cardStyle?.businessName && (
                <h3 className="font-medium" style={{ color: businessNameColor }}>{cardStyle.businessName}</h3>
              )}
              <h4 className="font-medium" style={{ color: textColor }}>{customerName}'s Card</h4>
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
        
        {/* Mini-rewards summary section */}
        {cardStyle?.rewards && cardStyle.rewards.length > 0 && (
          <div className="mb-4 p-3 bg-cream bg-opacity-80 rounded-lg relative z-10">
            <h4 className="text-sm font-medium mb-2" style={{ color: textColor }}>Progress Rewards:</h4>
            <div className="flex flex-wrap gap-2">
              {cardStyle.rewards.map((reward, index) => {
                const RewardIcon = STAMP_ICONS[reward.icon as keyof typeof STAMP_ICONS] || Gift;
                return (
                  <div 
                    key={index}
                    className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 ${
                      stamps >= reward.stampNumber 
                        ? 'bg-orange text-white' 
                        : 'bg-cream-light text-coffee-dark'
                    }`}
                  >
                    <RewardIcon size={12} />
                    <span>Stamp {reward.stampNumber}: {reward.description}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3 relative z-10">{renderStamps()}</div>

        {stamps >= maxStamps && (
          <div 
            className="mt-6 p-3 text-white text-center rounded-lg animate-pulse relative z-10"
            style={{ backgroundColor: cardStyle?.stampActiveColor || "#8B4513" }}
          >
            <p className="font-bold" style={{ color: rewardTextColor }}>Congratulations! You've earned a reward!</p>
            <p className="text-sm" style={{ color: rewardTextColor }}>Show this to a staff member to claim.</p>
          </div>
        )}
      </Card>
      
      {/* Dialog for main reward (complete card) */}
      <Dialog open={showCompletionDialog} onOpenChange={setShowCompletionDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">Card Completed! 🎉</DialogTitle>
            <DialogDescription className="text-center">
              Congratulations! You've collected all stamps and earned a reward.
              Let's start your next loyalty card.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center my-4">
            <RewardIcon size={48} className="text-orange" />
          </div>
          <DialogFooter>
            <Button
              className="w-full bg-orange hover:bg-orange-light"
              onClick={handleNewCard}
            >
              Start a New Card
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialog for mini rewards */}
      <Dialog open={showRewardDialog} onOpenChange={setShowRewardDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">Reward Unlocked! 🎉</DialogTitle>
            <DialogDescription className="text-center">
              Congratulations! You've earned a special reward at stamp #{currentReward?.stampNumber}.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center my-4 space-y-3">
            {currentReward && (
              <>
                {(() => {
                  const RewardIcon = STAMP_ICONS[currentReward.icon as keyof typeof STAMP_ICONS] || Gift;
                  return <RewardIcon size={48} className="text-orange" />;
                })()}
                <h3 className="text-xl font-semibold text-orange">{currentReward.description}</h3>
                <p className="text-sm text-center text-coffee-light">
                  Show this to a staff member to claim your reward.
                  Keep collecting stamps to earn more rewards!
                </p>
              </>
            )}
          </div>
          <DialogFooter>
            <Button
              className="w-full bg-orange hover:bg-orange-light"
              onClick={() => setShowRewardDialog(false)}
            >
              Keep Collecting!
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LoyaltyCard;
