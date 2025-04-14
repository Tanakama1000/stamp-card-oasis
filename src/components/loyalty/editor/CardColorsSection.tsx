
import React, { useState } from "react";
import { FormField } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CardColorsSectionProps } from "./types";
import ColorSelection from "./ColorSelection";
import { COLOR_PRESETS } from "./constants";

const CardColorsSection: React.FC<CardColorsSectionProps> = ({ form }) => {
  const [activeTab, setActiveTab] = useState("card");
  
  return (
    <div className="space-y-4">
      <h4 className="text-md font-medium text-coffee-dark">Card Colors</h4>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="card">Card</TabsTrigger>
          <TabsTrigger value="stamps">Stamps</TabsTrigger>
          <TabsTrigger value="text">Text</TabsTrigger>
        </TabsList>
        
        <TabsContent value="card" className="space-y-4">
          <FormField
            control={form.control}
            name="cardBgColor"
            render={({ field }) => (
              <ColorSelection
                label="Card Background"
                value={field.value}
                onChange={field.onChange}
                presets={COLOR_PRESETS.cardBg}
              />
            )}
          />
        </TabsContent>
        
        <TabsContent value="stamps" className="space-y-4">
          <FormField
            control={form.control}
            name="stampBgColor"
            render={({ field }) => (
              <ColorSelection
                label="Stamp Background"
                value={field.value}
                onChange={field.onChange}
                presets={COLOR_PRESETS.stampBg}
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
                presets={COLOR_PRESETS.stampActive}
              />
            )}
          />
          
          <FormField
            control={form.control}
            name="miniRewardStampColor"
            render={({ field }) => (
              <ColorSelection
                label="Mini Reward Indicator"
                value={field.value || "#C0C0C0"}
                onChange={field.onChange}
                presets={COLOR_PRESETS.miniReward}
              />
            )}
          />
        </TabsContent>
        
        <TabsContent value="text" className="space-y-4">
          <FormField
            control={form.control}
            name="textColor"
            render={({ field }) => (
              <ColorSelection
                label="Default Text"
                value={field.value}
                onChange={field.onChange}
                presets={COLOR_PRESETS.text}
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
                presets={COLOR_PRESETS.text}
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
                presets={COLOR_PRESETS.text}
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
                presets={COLOR_PRESETS.text}
              />
            )}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CardColorsSection;
