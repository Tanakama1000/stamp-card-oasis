
import React from "react";
import { FormField } from "@/components/ui/form";
import ColorSelection from "./ColorSelection";
import { COLOR_PRESETS } from "./constants";
import { CardColorsSectionProps } from "./types";

const CardColorsSection: React.FC<CardColorsSectionProps> = ({ form }) => {
  return (
    <div className="space-y-4">
      <h4 className="font-medium text-coffee-dark">Card Colors</h4>
      
      <FormField
        control={form.control}
        name="cardBgColor"
        render={({ field }) => (
          <ColorSelection 
            value={field.value}
            onChange={(val) => field.onChange(val)}
            label="Card Background"
            presets={COLOR_PRESETS.cardBg}
          />
        )}
      />
      
      <FormField
        control={form.control}
        name="stampBgColor"
        render={({ field }) => (
          <ColorSelection 
            value={field.value}
            onChange={(val) => field.onChange(val)}
            label="Empty Stamp Background"
            presets={COLOR_PRESETS.stampBg}
          />
        )}
      />
      
      <FormField
        control={form.control}
        name="stampActiveColor"
        render={({ field }) => (
          <ColorSelection 
            value={field.value}
            onChange={(val) => field.onChange(val)}
            label="Active Stamp Color"
            presets={COLOR_PRESETS.stampActive}
          />
        )}
      />

      <FormField
        control={form.control}
        name="miniRewardStampColor"
        render={({ field }) => (
          <ColorSelection 
            value={field.value}
            onChange={(val) => field.onChange(val)}
            label="Mini-Reward Stamp Color (before activation)"
            presets={COLOR_PRESETS.miniReward}
          />
        )}
      />
    </div>
  );
};

export default CardColorsSection;
