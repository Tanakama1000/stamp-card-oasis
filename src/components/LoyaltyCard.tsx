
import { useState, useEffect } from "react";
import { Coffee, Star, Heart, Award, Battery, Zap, Gift, Trophy, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { LoyaltyCardConfig, Reward } from "./LoyaltyCardEditor";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Confetti from 'react-confetti';
import useWindowSize from "@/hooks/useWindowSize";
import { Badge } from "@/components/ui/badge";

interface LoyaltyCardProps {
  customerName?: string;
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
  Gift,
  Trophy,
  Sparkles
};

const LoyaltyCard: React.FC<LoyaltyCardProps> = ({
  customerName = "",
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
  const [stampsCollected, setStampsCollected] = useState<number[]>([]);

  useEffect(() => {
    setStamps(currentStamps);
    
    setStampsCollected(Array.from({ length: currentStamps }, (_, i) => i));
    
    if (currentStamps > previousStamps && currentStamps < maxStamps) {
      const remaining = maxStamps - currentStamps;
      if (remaining <= 3) {
        toast({
          title: `Almost There!`,
          description: `You're only ${remaining} stamp${remaining !== 1 ? 's' : ''} away from your reward!`,
          duration: 4000,
        });
      }
      
      if (cardStyle?.rewards && cardStyle.rewards.length > 0) {
        const miniReward = cardStyle.rewards.find(r => r.stampNumber === currentStamps);
        if (miniReward) {
          setCurrentReward(miniReward);
          setShowRewardDialog(true);
          setShowConfetti(true);
          setTimeout(() => {
            setShowConfetti(false);
          }, 3000);
        }
      }
    }
    
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
        setStampsCollected(prev => [...prev, index]);
        
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
  
  const StampIcon = cardStyle?.stampIcon ? 
    STAMP_ICONS[cardStyle.stampIcon as keyof typeof STAMP_ICONS] : 
    Coffee;
    
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
          
          stampRow.push(
            <div
              key={stampIndex}
              className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 
                ${isCollected ? "text-white shadow-lg" : "border text-coffee-light"} 
                ${animationClass}
                ${isNext && stamps < maxStamps ? "hover:text-white hover:scale-110 hover:shadow-md" : ""}
                ${(isLastStamp || isMiniRewardStamp) && !isCollected ? "border-dashed" : ""}
              `}
              onClick={() => handleStampClick(stampIndex)}
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
                  ? (isCollected ? '#F97316' : '#F97316')
                  : cardStyle?.stampActiveColor || '#8B4513',
                color: isCollected 
                  ? '#FFFFFF' 
                  : cardStyle?.textColor || '#6F4E37',
                transform: isCollected ? 'scale(1)' : 'scale(1)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease',
              }}
            >
              <CurrentIcon size={24} className={isCollected ? "animate-bounce-once" : ""} />
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
        <div key={i} className="flex justify-center gap-3 my-1">
          {stampRow}
        </div>
      );
    }
    return rows;
  };

  const rewardProgress = Math.min((stamps / maxStamps) * 100, 100);
  
  const cardBgColor = cardStyle?.cardBgColor || "#FFFFFF";
  const textColor = cardStyle?.textColor || "#6F4E37";
  const businessNameColor = cardStyle?.businessNameColor || textColor;
  const cardTitleColor = cardStyle?.cardTitleColor || "#8B4513";
  const rewardTextColor = cardStyle?.rewardTextColor || textColor;
  const progressBarColor = cardStyle?.stampActiveColor || "#8B4513";
  const progressBarBgColor = cardStyle?.stampBgColor || "#F5F5DC";
  const fontFamily = cardStyle?.fontFamily || "";
  const cardTitle = cardStyle?.cardTitle || "Loyalty Card";
  
  const businessNameFontSize = cardStyle?.businessNameFontSize || "text-sm";
  const cardTitleFontSize = cardStyle?.cardTitleFontSize || "text-lg";
  const customerNameFontSize = cardStyle?.customerNameFontSize || "text-base";
  const descriptionFontSize = cardStyle?.descriptionFontSize || "text-sm";
  const progressRewardsFontSize = cardStyle?.progressRewardsFontSize || "text-sm";

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
          colors={['#F97316', '#FBBF24', '#8B4513', '#D97706']}
        />
      )}
      
      <Card 
        className="p-6 rounded-xl shadow-lg transform transition-all duration-300 hover:shadow-xl overflow-hidden relative"
        style={{ 
          backgroundColor: cardBgColor,
          fontFamily: fontFamily !== "default" ? fontFamily : 'inherit',
          ...backgroundImageStyle
        }}
      >
        {cardStyle?.useBackgroundImage && cardStyle?.backgroundImage && (
          <div 
            className="absolute inset-0 bg-black opacity-30"
            style={{ pointerEvents: 'none' }}
          ></div>
        )}
        
        <div className="flex items-center justify-between mb-6 relative z-10">
          <div className="flex items-center gap-3">
            {cardStyle?.businessLogo && (
              <Avatar className="h-12 w-12 border-2 border-white shadow-md">
                <AvatarImage src={cardStyle.businessLogo} alt="Business logo" />
                <AvatarFallback className="bg-orange text-white">{cardStyle?.businessName?.charAt(0) || "B"}</AvatarFallback>
              </Avatar>
            )}
            <div>
              {cardStyle?.businessName && (
                <h3 
                  className={`font-medium ${businessNameFontSize}`} 
                  style={{ color: businessNameColor }}
                >
                  {cardStyle.businessName}
                </h3>
              )}
              <h2 
                className={`font-bold ${cardTitleFontSize}`} 
                style={{ color: cardTitleColor }}
              >
                {cardTitle}
              </h2>
              <p 
                className={descriptionFontSize} 
                style={{ color: textColor }}
              >
                Collect {maxStamps} stamps for a free item
              </p>
            </div>
          </div>
          <div 
            className="h-14 w-14 rounded-full flex items-center justify-center text-white font-bold shadow-md transform transition-transform hover:scale-105"
            style={{ backgroundColor: progressBarColor }}
          >
            <span className="text-lg">{stamps}/{maxStamps}</span>
          </div>
        </div>

        <div className="relative h-3 rounded-full mb-6 overflow-hidden shadow-inner" style={{ backgroundColor: progressBarBgColor }}>
          <div
            className="absolute top-0 left-0 h-3 rounded-full transition-all duration-1000 ease-out"
            style={{ 
              width: `${rewardProgress}%`,
              backgroundColor: progressBarColor 
            }}
          />
          {cardStyle?.rewards && cardStyle.rewards.map((reward) => {
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
        
        {cardStyle?.rewards && cardStyle.rewards.length > 0 && (
          <div className="mb-5 p-3 bg-cream bg-opacity-80 rounded-lg relative z-10 shadow-sm">
            <h4 className={`font-medium mb-2 ${progressRewardsFontSize}`} style={{ color: textColor }}>Progress Rewards:</h4>
            <div className="flex flex-wrap gap-2">
              {cardStyle.rewards.map((reward, index) => {
                const RewardIcon = STAMP_ICONS[reward.icon as keyof typeof STAMP_ICONS] || Gift;
                const isCollected = stamps >= reward.stampNumber;
                
                return (
                  <Badge 
                    key={index}
                    className={`px-3 py-1.5 flex items-center gap-1.5 transition-all duration-300 ${
                      isCollected 
                        ? 'bg-orange hover:bg-orange-dark text-white' 
                        : 'bg-cream-light text-coffee-dark'
                    } ${isCollected ? 'shadow-sm hover:shadow' : ''}`}
                    variant={isCollected ? "default" : "outline"}
                  >
                    <RewardIcon size={14} className={isCollected ? "animate-pulse" : ""} />
                    <span className="text-xs font-medium">
                      <span className="font-bold">{reward.stampNumber}:</span> {reward.description}
                    </span>
                    {isCollected && (
                      <Sparkles size={12} className="ml-1 text-yellow-200" />
                    )}
                  </Badge>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3 relative z-10">{renderStamps()}</div>

        {customerName && (
          <div className="mt-5 text-center relative z-10">
            <h4 
              className={`font-medium ${customerNameFontSize}`} 
              style={{ color: textColor }}
            >
              {customerName}'s Card
            </h4>
          </div>
        )}

        {stamps >= maxStamps && (
          <div 
            className="mt-6 p-4 text-white text-center rounded-lg animate-pulse shadow-lg transform transition-transform hover:scale-105"
            style={{ backgroundColor: cardStyle?.stampActiveColor || "#8B4513" }}
          >
            <p className="font-bold text-lg" style={{ color: rewardTextColor }}>Congratulations! You've earned a reward!</p>
            <p className={`${descriptionFontSize} mt-1`} style={{ color: rewardTextColor }}>Show this to a staff member to claim.</p>
            <div className="flex justify-center mt-2">
              <Trophy size={32} className="text-yellow-300 animate-pulse" />
            </div>
          </div>
        )}
      </Card>
      
      <Dialog open={showCompletionDialog} onOpenChange={setShowCompletionDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">Card Completed! 🎉</DialogTitle>
            <DialogDescription className="text-center">
              Congratulations! You've collected all {maxStamps} stamps and earned a reward.
              Let's start your next loyalty card.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center my-6">
            <div className="p-6 rounded-full bg-orange/10 animate-pulse">
              <RewardIcon size={64} className="text-orange" />
            </div>
          </div>
          <DialogFooter>
            <Button
              className="w-full bg-orange hover:bg-orange-light text-white text-lg py-6"
              onClick={handleNewCard}
            >
              Start a New Card
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={showRewardDialog} onOpenChange={setShowRewardDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">Reward Unlocked! 🎉</DialogTitle>
            <DialogDescription className="text-center">
              Congratulations! You've earned a special reward at stamp #{currentReward?.stampNumber}.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center my-6 space-y-3">
            {currentReward && (
              <>
                {(() => {
                  const RewardIcon = STAMP_ICONS[currentReward.icon as keyof typeof STAMP_ICONS] || Gift;
                  return (
                    <div className="p-6 rounded-full bg-orange/10 animate-pulse">
                      <RewardIcon size={64} className="text-orange" />
                    </div>
                  );
                })()}
                <h3 className="text-xl font-semibold text-orange">{currentReward.description}</h3>
                <p className={`text-center text-coffee-light ${descriptionFontSize}`}>
                  Show this to a staff member to claim your reward.
                  Keep collecting stamps to earn more rewards!
                </p>
              </>
            )}
          </div>
          <DialogFooter>
            <Button
              className="w-full bg-orange hover:bg-orange-light text-white"
              onClick={() => setShowRewardDialog(false)}
            >
              Keep Collecting!
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <style>
        {`
          @keyframes stamp-animation {
            0% { transform: scale(1); }
            50% { transform: scale(1.5); }
            100% { transform: scale(1); }
          }
          
          .stamp-animation {
            animation: stamp-animation 0.5s ease;
          }
          
          .pulse {
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
          
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }
          
          @keyframes bounce-once {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
          }
          
          .animate-bounce-once {
            animation: bounce-once 0.5s ease-in-out;
          }
          
          .animate-scale-in {
            animation: scale-in 0.3s ease-out forwards;
          }
          
          @keyframes scale-in {
            0% { transform: scale(0.9); opacity: 0.5; }
            100% { transform: scale(1); opacity: 1; }
          }
        `}
      </style>
    </>
  );
};

export default LoyaltyCard;
