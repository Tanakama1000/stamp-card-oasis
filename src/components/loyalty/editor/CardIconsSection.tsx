
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
            description="This icon will appear on the final stamp"
          />
        )}
      />
    </div>
  );
};

export default CardIconsSection;
