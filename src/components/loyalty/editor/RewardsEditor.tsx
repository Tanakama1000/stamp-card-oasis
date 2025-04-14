
import React from "react";
import { Button } from "@/components/ui/button";
import { FormItem } from "@/components/ui/form";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import RewardItem from "./RewardItem";
import { RewardsEditorProps } from "./types";

const RewardsEditor: React.FC<RewardsEditorProps> = ({ rewards, maxStamps, onChange }) => {
  const { toast } = useToast();

  const addReward = () => {
    let nextStampNumber = 1;
    while (nextStampNumber < maxStamps) {
      if (!rewards.some(r => r.stampNumber === nextStampNumber)) {
        break;
      }
      nextStampNumber++;
    }
    
    if (nextStampNumber >= maxStamps) {
      toast({
        title: "Cannot Add More Rewards",
        description: "You've reached the maximum number of stamps for rewards.",
        variant: "destructive",
      });
      return;
    }
    
    const newReward = {
      stampNumber: nextStampNumber,
      description: "Free Item",
      icon: "Gift"
    };
    
    const updatedRewards = [...rewards, newReward];
    onChange(updatedRewards);
  };
  
  const removeReward = (index: number) => {
    const updatedRewards = rewards.filter((_, i) => i !== index);
    onChange(updatedRewards);
  };

  return (
    <FormItem>
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-coffee-dark">Progress Rewards</h4>
        <Button 
          type="button"
          variant="outline" 
          size="sm"
          onClick={addReward}
          className="flex items-center gap-1"
        >
          <Plus size={16} />
          Add Reward
        </Button>
      </div>
      
      <div className="space-y-2">
        {rewards && rewards.length > 0 ? (
          rewards.map((reward, index) => (
            <RewardItem 
              key={index}
              reward={reward}
              index={index}
              maxStamps={maxStamps}
              rewards={rewards}
              onChange={onChange}
              onRemove={removeReward}
            />
          ))
        ) : (
          <div className="text-center p-4 border border-dashed border-coffee-light rounded-md">
            <p className="text-sm text-coffee-light">No rewards added yet. Add a reward to offer progress-based incentives.</p>
          </div>
        )}
      </div>
    </FormItem>
  );
};

export default RewardsEditor;
