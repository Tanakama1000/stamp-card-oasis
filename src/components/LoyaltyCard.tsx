import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Confetti from 'react-confetti';
import useWindowSize from "@/hooks/useWindowSize";
import { LoyaltyCardConfig } from "./loyalty/types/LoyaltyCardConfig";

import StampGrid from "./loyalty/StampGrid";
import ProgressBar from "./loyalty/ProgressBar";
import ProgressRewards from "./loyalty/ProgressRewards";
import CardHeader from "./loyalty/CardHeader";
import RewardCard from "./loyalty/RewardCard";
import CardDialogs from "./loyalty/CardDialogs";
import CardAnimations from "./loyalty/CardAnimations";
import CustomerName from "./loyalty/CustomerName";
import RewardsCard from "./loyalty/RewardsCard";
import { LoyaltyCardProps } from "./loyalty/types";
import { useIsMobile } from "@/hooks/use-mobile";

const LoyaltyCard: React.FC<LoyaltyCardProps> = ({
  customerName = "",
  maxStamps = 10,
  currentStamps = 0,
  onStampCollected,
  cardStyle,
  onReset,
  isMobile: propIsMobile,
  businessId,
}) => {
  const { toast } = useToast();
  const { width, height } = useWindowSize();
  const deviceIsMobile = useIsMobile();
  const isMobile = propIsMobile !== undefined ? propIsMobile : deviceIsMobile;
  
  const [stamps, setStamps] = useState<number>(currentStamps);
  const [animatingStamp, setAnimatingStamp] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [showRewardDialog, setShowRewardDialog] = useState<boolean>(false);
  const [previousStamps, setPreviousStamps] = useState<number>(currentStamps);
  const [currentReward, setCurrentReward] = useState<{stampNumber: number, description: string, icon: string} | null>(null);
  const [stampsCollected, setStampsCollected] = useState<number[]>([]);

  const handleNewCard = () => {
    setStamps(0);
    setShowConfetti(false);
    setShowRewardDialog(false);
    setPreviousStamps(0);
    setCurrentReward(null);
    setAnimatingStamp(null);
    setStampsCollected([]);
    if (onReset) {
      onReset();
    }
  };

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
        setShowConfetti(false);
      }, 5000);
    }
    
    setPreviousStamps(currentStamps);
  }, [currentStamps, maxStamps, previousStamps, toast, cardStyle]);

  const handleStampClick = (index: number) => {
    return;
  };
  
  const cardBgColor = cardStyle?.cardBgColor || "#FFFFFF";
  const textColor = cardStyle?.textColor || "#6F4E37";
  const businessNameColor = cardStyle?.businessNameColor || textColor;
  const cardTitleColor = cardStyle?.cardTitleColor || "#8B4513";
  const rewardTextColor = cardStyle?.rewardTextColor || textColor;
  const progressBarColor = cardStyle?.stampActiveColor || "#8B4513";
  const progressBarBgColor = cardStyle?.stampBgColor || "#F5F5DC";
  
  const fontFamily = cardStyle?.fontFamily || "";
  const businessNameFont = cardStyle?.businessNameFont || fontFamily;
  const cardTitleFont = cardStyle?.cardTitleFont || fontFamily;
  const customerNameFont = cardStyle?.customerNameFont || fontFamily;
  const descriptionFont = cardStyle?.descriptionFont || fontFamily;
  const progressRewardsFont = cardStyle?.progressRewardsFont || fontFamily;
  
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

  const cardPadding = isMobile ? "p-4" : "p-6";

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
        className={`${cardPadding} rounded-xl shadow-lg transform transition-all duration-300 hover:shadow-xl overflow-hidden relative`}
        style={{ 
          backgroundColor: cardBgColor,
          ...backgroundImageStyle
        }}
      >
        {cardStyle?.useBackgroundImage && cardStyle?.backgroundImage && (
          <div 
            className="absolute inset-0 bg-black opacity-30"
            style={{ pointerEvents: 'none' }}
          ></div>
        )}
        
        <CardHeader 
          businessLogo={cardStyle?.businessLogo}
          businessName={cardStyle?.businessName}
          businessNameColor={businessNameColor}
          businessNameFont={businessNameFont}
          businessNameFontSize={businessNameFontSize}
          cardTitle={cardTitle}
          cardTitleColor={cardTitleColor}
          cardTitleFont={cardTitleFont}
          cardTitleFontSize={cardTitleFontSize}
          descriptionFont={descriptionFont}
          descriptionFontSize={descriptionFontSize}
          textColor={textColor}
          maxStamps={maxStamps}
          stamps={stamps}
          progressBarColor={progressBarColor}
          isMobile={isMobile}
          rewardText={cardStyle?.rewardText}
        />

        <ProgressBar
          stamps={stamps}
          maxStamps={maxStamps}
          progressBarColor={progressBarColor}
          progressBarBgColor={progressBarBgColor}
          rewards={cardStyle?.rewards}
        />
        
        {cardStyle?.rewards && cardStyle.rewards.length > 0 && (
          <ProgressRewards
            rewards={cardStyle.rewards}
            stamps={stamps}
            progressRewardsFont={progressRewardsFont}
            textColor={textColor}
            isMobile={isMobile}
          />
        )}

        <StampGrid 
          maxStamps={maxStamps}
          stamps={stamps}
          cardStyle={cardStyle}
          onStampClick={handleStampClick}
          animatingStamp={animatingStamp}
          stampsCollected={stampsCollected}
        />

        <CustomerName 
          customerName={customerName}
          textColor={textColor}
          customerNameFont={customerNameFont}
          customerNameFontSize={customerNameFontSize}
        />

        <RewardCard 
          showReward={stamps >= maxStamps}
          rewardTextColor={rewardTextColor}
          stampActiveColor={cardStyle?.stampActiveColor || "#8B4513"}
          descriptionFont={descriptionFont}
          descriptionFontSize={descriptionFontSize}
          onReset={handleNewCard}
          businessId={businessId}
        />
      </Card>
      
      <CardDialogs 
        showCompletionDialog={false}
        setShowCompletionDialog={() => {}}
        showRewardDialog={showRewardDialog}
        setShowRewardDialog={setShowRewardDialog}
        currentReward={currentReward}
        maxStamps={maxStamps}
        handleNewCard={handleNewCard}
        descriptionFont={descriptionFont}
        descriptionFontSize={descriptionFontSize}
      />

      <CardAnimations />
    </>
  );
};

export default LoyaltyCard;
