
import React from "react";
import { FormField } from "@/components/ui/form";
import IconSelection from "./IconSelection";
import { STAMP_ICONS, REWARD_ICONS } from "./constants";
import { CardIconsSectionProps } from "./types";

const CardIconsSection: React.FC<CardIconsSectionProps> = ({ form }) => {
  return (
    <div className="space-y-4">
      <h4 className="font-medium text-coffee-dark">Card Icons</h4>
      
      <FormField
        control={form.control}
        name="stampIcon"
        render={({ field }) => (
          <IconSelection 
            icons={STAMP_ICONS}
            value={field.value}
            onChange={field.onChange}
            label="Stamp Icon"
            description="Icon displayed on each stamp"
          />
        )}
      />

      <FormField
        control={form.control}
        name="rewardIcon"
        render={({ field }) => (
          <IconSelection 
            icons={REWARD_ICONS}
            value={field.value}
            onChange={field.onChange}
            label="Final Reward Icon"
            description="This icon will appear on the final reward stamp"
          />
        )}
      />
      
      <FormField
        control={form.control}
        name="miniRewardStampColor"
        render={({ field }) => (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Mini Reward Indicator Color</label>
              <span 
                className="w-5 h-5 rounded-full" 
                style={{ backgroundColor: field.value }} 
              />
            </div>
            <input 
              type="color"
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
              className="h-8 w-full"
            />
            <p className="text-xs text-coffee-light mt-1">Color for mini reward indicators on the progress bar</p>
          </div>
        )}
      />
    </div>
  );
};

export default CardIconsSection;
