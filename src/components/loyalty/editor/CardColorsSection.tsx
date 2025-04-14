
import React from "react";
import { FormField } from "@/components/ui/form";
import { CardColorsSectionProps } from "./types";
import ColorSelection from "./ColorSelection";

const CardColorsSection: React.FC<CardColorsSectionProps> = ({ form }) => {
  return (
    <div className="space-y-4">
      <h4 className="text-md font-medium text-coffee-dark">Card Colors</h4>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="cardBgColor"
          render={({ field }) => (
            <ColorSelection
              label="Card Background"
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />

        <FormField
          control={form.control}
          name="textColor"
          render={({ field }) => (
            <ColorSelection
              label="Default Text"
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        
        <FormField
          control={form.control}
          name="stampBgColor"
          render={({ field }) => (
            <ColorSelection
              label="Stamp Background"
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />

        <FormField
          control={form.control}
          name="stampActiveColor"
          render={({ field }) => (
            <ColorSelection
              label="Stamp Active"
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        
        <FormField
          control={form.control}
          name="businessNameColor"
          render={({ field }) => (
            <ColorSelection
              label="Business Name Color"
              value={field.value || "#6F4E37"}
              onChange={field.onChange}
            />
          )}
        />
        
        <FormField
          control={form.control}
          name="cardTitleColor"
          render={({ field }) => (
            <ColorSelection
              label="Card Title Color"
              value={field.value || "#8B4513"}
              onChange={field.onChange}
            />
          )}
        />
        
        <FormField
          control={form.control}
          name="rewardTextColor"
          render={({ field }) => (
            <ColorSelection
              label="Description Text Color"
              value={field.value || "#6F4E37"}
              onChange={field.onChange}
            />
          )}
        />
      </div>
    </div>
  );
};

export default CardColorsSection;
