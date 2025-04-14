
import { useState, useEffect } from "react";
import { Coffee, Star, Heart, Award, Battery, Zap, Gift } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { LoyaltyCardConfig } from "./LoyaltyCardEditor";
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
  }, [currentStamps, maxStamps, previousStamps, toast]);

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

    for (let i = 0; i < rowCount; i++) {
      const stampRow = [];
      for (let j = 0; j < stampsPerRow; j++) {
        const stampIndex = i * stampsPerRow + j;
        if (stampIndex < maxStamps) {
          // Determine if this is the last stamp (which will show the reward icon)
          const isLastStamp = stampIndex === maxStamps - 1;
          const CurrentIcon = isLastStamp ? RewardIcon : StampIcon;
          
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
                  isLastStamp && stampIndex >= stamps
                    ? "border-dashed"
                    : ""
                }
              `}
              onClick={() => handleStampClick(stampIndex)}
              title={isLastStamp ? "Reward stamp" : (stampIndex < stamps ? "Collected" : stampIndex === stamps ? "Collect stamp" : "Future stamp")}
              style={{
                backgroundColor: stampIndex < stamps 
                  ? cardStyle?.stampActiveColor || '#8B4513' 
                  : cardStyle?.stampBgColor || '#F5F5DC',
                borderColor: isLastStamp 
                  ? (stampIndex < stamps ? cardStyle?.stampActiveColor || '#8B4513' : '#F97316')
                  : cardStyle?.stampActiveColor || '#8B4513',
                color: stampIndex < stamps 
                  ? '#FFFFFF' 
                  : cardStyle?.textColor || '#6F4E37',
              }}
            >
              <CurrentIcon size={24} />
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
    </>
  );
};

export default LoyaltyCard;
