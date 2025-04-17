
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Gift } from "lucide-react";
import { STAMP_ICONS } from "./types";

interface Reward {
  stampNumber: number;
  description: string;
  icon: string;
}

interface CardDialogsProps {
  showCompletionDialog: boolean;
  setShowCompletionDialog: React.Dispatch<React.SetStateAction<boolean>>;
  showRewardDialog: boolean;
  setShowRewardDialog: React.Dispatch<React.SetStateAction<boolean>>;
  currentReward: Reward | null;
  maxStamps: number;
  handleNewCard: () => void;
  descriptionFont?: string;
  descriptionFontSize?: string;
}

const CardDialogs: React.FC<CardDialogsProps> = ({
  showCompletionDialog,
  setShowCompletionDialog,
  showRewardDialog,
  setShowRewardDialog,
  currentReward,
  maxStamps,
  handleNewCard,
  descriptionFont,
  descriptionFontSize
}) => {
  const RewardIcon = currentReward?.icon 
    ? STAMP_ICONS[currentReward.icon as keyof typeof STAMP_ICONS] || Gift
    : Gift;

  return (
    <>
      <Dialog open={showCompletionDialog} onOpenChange={setShowCompletionDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">Card Completed! 🎉</DialogTitle>
            <DialogDescription className="text-center">
              Congratulations! You've collected all {maxStamps} stamps and earned a reward.
              Show this to a staff member to claim reward, before you start a new card.
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
                <p 
                  className={`text-center text-coffee-light ${descriptionFontSize}`}
                  style={{ 
                    fontFamily: descriptionFont !== "default" ? descriptionFont : 'inherit'
                  }}
                >
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
    </>
  );
};

export default CardDialogs;
