
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Palette } from "lucide-react";
import { Form } from "@/components/ui/form";
import { useForm, useWatch } from "react-hook-form";
import { FormField } from "@/components/ui/form";
import { LoyaltyCardConfig } from "@/components/loyalty/editor/types";
import { Reward } from "@/components/loyalty/types";

import TypographyEditor from "@/components/loyalty/editor/TypographyEditor";
import RewardsEditor from "@/components/loyalty/editor/RewardsEditor";
import BusinessInfoSection from "@/components/loyalty/editor/BusinessInfoSection";
import BackgroundImageSection from "@/components/loyalty/editor/BackgroundImageSection";
import StampConfigSection from "@/components/loyalty/editor/StampConfigSection";
import CardIconsSection from "@/components/loyalty/editor/CardIconsSection";
import CardColorsSection from "@/components/loyalty/editor/CardColorsSection";

interface LoyaltyCardEditorProps {
  onCardUpdate?: (cardConfig: LoyaltyCardConfig) => void;
}

const LoyaltyCardEditor: React.FC<LoyaltyCardEditorProps> = ({ onCardUpdate }) => {
  const { toast } = useToast();
  
  const [cardConfig, setCardConfig] = useState<LoyaltyCardConfig>({
    businessName: "Coffee Oasis",
    customerName: "",
    maxStamps: 10,
    currentStamps: 3,
    cardBgColor: "#FFFFFF",
    stampBgColor: "#F5F5DC",
    stampActiveColor: "#8B4513",
    textColor: "#6F4E37",
    businessLogo: "",
    businessNameColor: "#6F4E37",
    rewardTextColor: "#6F4E37",
    stampIcon: "Coffee",
    rewardIcon: "Gift",
    rewards: [],
    miniRewardStampColor: "#C0C0C0",
    backgroundImage: "",
    useBackgroundImage: false,
    cardTitle: "Loyalty Card",
    cardTitleColor: "#8B4513",
    fontFamily: "",
    businessNameFont: "",
    cardTitleFont: "",
    customerNameFont: "",
    descriptionFont: "",
    progressRewardsFont: "",
    businessNameFontSize: "text-sm",
    cardTitleFontSize: "text-lg",
    customerNameFontSize: "text-base",
    descriptionFontSize: "text-sm",
    progressRewardsFontSize: "text-sm",
  });

  const form = useForm<LoyaltyCardConfig>({
    defaultValues: cardConfig
  });

  // Watch all form values for real-time preview updates
  const formValues = useWatch({
    control: form.control
  });

  // Update preview in real-time
  useEffect(() => {
    if (formValues && onCardUpdate) {
      // Create a complete card config by merging form values with defaults
      const updatedConfig: LoyaltyCardConfig = {
        ...cardConfig,  // Start with current config to ensure all required fields
        ...formValues as Partial<LoyaltyCardConfig>, // Apply watched form values
        // Ensure rewards are properly sorted and have all required properties
        rewards: formValues.rewards 
          ? [...formValues.rewards].map(reward => ({
              stampNumber: reward.stampNumber || 1,
              description: reward.description || "Reward",
              icon: reward.icon || "Gift"
            })).sort((a, b) => a.stampNumber - b.stampNumber)
          : cardConfig.rewards
      };
      
      // Update preview with current form values
      setCardConfig(updatedConfig);
      onCardUpdate(updatedConfig);
    }
  }, [formValues, onCardUpdate, cardConfig]);

  const handleSubmit = (data: LoyaltyCardConfig) => {
    const sortedRewards = [...data.rewards].sort((a, b) => a.stampNumber - b.stampNumber);
    const updatedData = {...data, rewards: sortedRewards};
    
    setCardConfig(updatedData);
    if (onCardUpdate) {
      onCardUpdate(updatedData);
    }
    
    // Save to localStorage
    localStorage.setItem('loyaltyCardStyle', JSON.stringify(updatedData));
    
    toast({
      title: "Card Updated",
      description: "Loyalty card configuration has been saved.",
    });
  };
  
  const handleBackgroundImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const newConfig = { 
            ...cardConfig, 
            backgroundImage: event.target.result as string,
            useBackgroundImage: true 
          };
          setCardConfig(newConfig);
          form.setValue("backgroundImage", event.target.result as string);
          form.setValue("useBackgroundImage", true);
          
          // Update preview immediately when background image changes
          if (onCardUpdate) {
            onCardUpdate(newConfig);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card className="p-6 bg-white card-shadow">
      <h3 className="text-xl font-semibold text-coffee-dark mb-4 flex items-center gap-2">
        <Palette size={24} className="text-orange" />
        Loyalty Card Editor
      </h3>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <BusinessInfoSection form={form} />
          
          <div className="space-y-4 border-t border-cream pt-4 mt-4">
            <TypographyEditor form={form} />
          </div>

          <StampConfigSection form={form} />
          
          <BackgroundImageSection 
            form={form} 
            cardConfig={cardConfig} 
            handleBackgroundImageUpload={handleBackgroundImageUpload} 
          />
          
          <div className="space-y-4 border-t border-cream pt-4">
            <FormField
              control={form.control}
              name="rewards"
              render={({ field }) => (
                <RewardsEditor 
                  rewards={field.value || []} 
                  maxStamps={form.getValues("maxStamps")}
                  onChange={(rewards) => {
                    field.onChange(rewards);
                    // Force reload of rewards when they change
                    form.trigger("rewards");
                  }}
                />
              )}
            />
          </div>

          <div className="space-y-4 border-t border-cream pt-4 mt-4">
            <CardIconsSection form={form} />
          </div>

          <div className="space-y-4 border-t border-cream pt-4 mt-4">
            <CardColorsSection form={form} />
          </div>
          
          <div className="border-t border-cream pt-6 mt-2">
            <Button type="submit" className="w-full bg-orange hover:bg-orange-dark text-white">
              Save Card Configuration
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
};

export default LoyaltyCardEditor;
