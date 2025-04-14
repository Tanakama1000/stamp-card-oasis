
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Palette, Save } from "lucide-react";
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
  initialConfig?: LoyaltyCardConfig;
}

const LoyaltyCardEditor: React.FC<LoyaltyCardEditorProps> = ({ 
  onCardUpdate,
  initialConfig 
}) => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  
  const defaultConfig: LoyaltyCardConfig = {
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
    backgroundOpacity: 30,
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
  };
  
  // Use initialConfig if provided, otherwise use default or local storage
  useEffect(() => {
    if (initialConfig) {
      form.reset(initialConfig);
    } else {
      // Try to load from localStorage if no initialConfig provided
      try {
        const savedConfig = localStorage.getItem('loyaltyCardStyle');
        if (savedConfig) {
          const parsedConfig = JSON.parse(savedConfig);
          form.reset(parsedConfig);
        }
      } catch (error) {
        console.error("Error loading saved config:", error);
      }
    }
  }, [initialConfig]);

  const form = useForm<LoyaltyCardConfig>({
    defaultValues: initialConfig || defaultConfig
  });

  // Watch all form values for real-time preview updates
  const formValues = useWatch({
    control: form.control
  });

  // Update preview in real-time
  useEffect(() => {
    if (formValues && onCardUpdate) {
      // Create a complete card config by ensuring all required fields have values
      const updatedConfig: LoyaltyCardConfig = {
        // Start with all required fields from defaultConfig
        ...defaultConfig,
        // Apply watched form values, but ensure required fields are never undefined
        businessName: formValues.businessName || defaultConfig.businessName,
        customerName: formValues.customerName || defaultConfig.customerName,
        maxStamps: formValues.maxStamps || defaultConfig.maxStamps,
        currentStamps: formValues.currentStamps || defaultConfig.currentStamps,
        cardBgColor: formValues.cardBgColor || defaultConfig.cardBgColor,
        stampBgColor: formValues.stampBgColor || defaultConfig.stampBgColor,
        stampActiveColor: formValues.stampActiveColor || defaultConfig.stampActiveColor,
        textColor: formValues.textColor || defaultConfig.textColor,
        businessNameColor: formValues.businessNameColor || defaultConfig.businessNameColor,
        rewardTextColor: formValues.rewardTextColor || defaultConfig.rewardTextColor,
        stampIcon: formValues.stampIcon || defaultConfig.stampIcon,
        rewardIcon: formValues.rewardIcon || defaultConfig.rewardIcon,
        rewards: formValues.rewards 
          ? [...formValues.rewards].map(reward => ({
              stampNumber: reward.stampNumber || 1,
              description: reward.description || "Reward",
              icon: reward.icon || "Gift"
            })).sort((a, b) => a.stampNumber - b.stampNumber)
          : [],
        miniRewardStampColor: formValues.miniRewardStampColor || defaultConfig.miniRewardStampColor,
        backgroundImage: formValues.backgroundImage || defaultConfig.backgroundImage,
        useBackgroundImage: formValues.useBackgroundImage ?? defaultConfig.useBackgroundImage,
        backgroundOpacity: formValues.backgroundOpacity ?? defaultConfig.backgroundOpacity,
        cardTitle: formValues.cardTitle || defaultConfig.cardTitle,
        cardTitleColor: formValues.cardTitleColor || defaultConfig.cardTitleColor,
        fontFamily: formValues.fontFamily || defaultConfig.fontFamily,
        businessNameFont: formValues.businessNameFont || defaultConfig.businessNameFont,
        cardTitleFont: formValues.cardTitleFont || defaultConfig.cardTitleFont,
        customerNameFont: formValues.customerNameFont || defaultConfig.customerNameFont,
        descriptionFont: formValues.descriptionFont || defaultConfig.descriptionFont,
        progressRewardsFont: formValues.progressRewardsFont || defaultConfig.progressRewardsFont,
        businessNameFontSize: formValues.businessNameFontSize || defaultConfig.businessNameFontSize,
        cardTitleFontSize: formValues.cardTitleFontSize || defaultConfig.cardTitleFontSize,
        customerNameFontSize: formValues.customerNameFontSize || defaultConfig.customerNameFontSize,
        descriptionFontSize: formValues.descriptionFontSize || defaultConfig.descriptionFontSize,
        progressRewardsFontSize: formValues.progressRewardsFontSize || defaultConfig.progressRewardsFontSize,
      };
      
      // Update preview with current form values
      onCardUpdate(updatedConfig);
    }
  }, [formValues, onCardUpdate]);

  const handleSubmit = (data: LoyaltyCardConfig) => {
    setIsSaving(true);
    
    const sortedRewards = [...data.rewards].sort((a, b) => a.stampNumber - b.stampNumber);
    const updatedData = {...data, rewards: sortedRewards};
    
    if (onCardUpdate) {
      onCardUpdate(updatedData);
    }
    
    // Save to localStorage
    localStorage.setItem('loyaltyCardStyle', JSON.stringify(updatedData));
    
    toast({
      title: "Card Updated",
      description: "Loyalty card configuration has been saved.",
    });
    
    // Add a small delay before removing saving indicator
    setTimeout(() => {
      setIsSaving(false);
    }, 600);
  };
  
  const handleBackgroundImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          form.setValue("backgroundImage", event.target.result as string);
          form.setValue("useBackgroundImage", true);
          
          // Trigger form update
          form.trigger(["backgroundImage", "useBackgroundImage"]);
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
            cardConfig={formValues as LoyaltyCardConfig} 
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
            <Button 
              type="submit" 
              className="w-full bg-orange hover:bg-orange-dark text-white"
              disabled={isSaving}
            >
              {isSaving ? (
                <span className="flex items-center gap-2">
                  <Save size={18} className="animate-pulse" />
                  Saving Changes...
                </span>
              ) : (
                "Save Card Configuration"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
};

export default LoyaltyCardEditor;
