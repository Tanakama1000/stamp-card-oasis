import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Check, Palette, Layout, Award, RefreshCw } from "lucide-react";
import { LoyaltyCardConfig } from "./types/LoyaltyCardConfig";
import LoyaltyCard from "../LoyaltyCard";
import { supabase } from "@/integrations/supabase/client";
import { GeneralSettings } from "./customization/GeneralSettings";
import { ColorSettings } from "./customization/ColorSettings";
import { StampSettings } from "./customization/StampSettings";
import { Slider } from "@/components/ui/slider";

interface CardCustomizationProps {
  onSave: (config: LoyaltyCardConfig) => void;
  initialConfig?: LoyaltyCardConfig;
}

export default function CardCustomization({ onSave, initialConfig }: CardCustomizationProps) {
  const { toast } = useToast();
  const [previewStamps, setPreviewStamps] = useState(3);
  const [isLoading, setIsLoading] = useState(true);
  const [config, setConfig] = useState<LoyaltyCardConfig>(initialConfig || {
    businessName: "Coffee Shop",
    cardTitle: "Loyalty Card",
    maxStamps: 10,
    cardBgColor: "#FFFFFF",
    stampBgColor: "#F5F5DC",
    stampActiveColor: "#8B4513",
    textColor: "#6F4E37",
    businessNameColor: "#6F4E37",
    cardTitleColor: "#8B4513",
    rewardTextColor: "#6F4E37",
    stampIcon: "Gift",
    lastStampText: "FREE",
    lastStampTextColor: "#FFFFFF",
    lastStampBorderColor: "#F97316",
    rewardText: "Collect 10 stamps for a free item",
    rewards: []
  });
  const [rewardsVersion, setRewardsVersion] = useState(0);

  useEffect(() => {
    const loadCardConfig = async () => {
      const businessData = JSON.parse(localStorage.getItem('businessData') || 'null');
      
      if (!businessData || !businessData.id) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('loyalty_card_configs')
          .select('config')
          .eq('business_id', businessData.id)
          .single();

        if (error) {
          console.warn('No existing card configuration found:', error);
          setIsLoading(false);
          return;
        }

        if (data?.config) {
          const loadedConfig = data.config as LoyaltyCardConfig;
          
          if (!loadedConfig.rewardText) {
            loadedConfig.rewardText = `Collect ${loadedConfig.maxStamps} stamps for a free item`;
          }
          
          setConfig(loadedConfig);
          localStorage.setItem('loyaltyCardConfig', JSON.stringify(loadedConfig));
        }
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading card configuration:', err);
        setIsLoading(false);
      }
    };

    loadCardConfig();
  }, []);

  const handleChange = (field: keyof LoyaltyCardConfig, value: any) => {
    setConfig(prev => {
      const updated = { ...prev, [field]: value };
      localStorage.setItem('loyaltyCardConfig', JSON.stringify(updated));
      if (field === 'rewards') {
        setRewardsVersion(v => v + 1);
      }
      return updated;
    });
  };

  const handleSave = async () => {
    const businessData = JSON.parse(localStorage.getItem('businessData') || 'null');
    
    if (!businessData || !businessData.id) {
      toast({
        title: "Error",
        description: "No business found. Please create a business first.",
        variant: "destructive"
      });
      return;
    }

    try {
      const configForStorage: Record<string, any> = { ...config };
      
      const { data, error } = await supabase
        .from('loyalty_card_configs')
        .upsert({
          business_id: businessData.id,
          config: configForStorage
        }, {
          onConflict: 'business_id'
        });

      if (error) throw error;

      if (onSave) onSave(config);
      localStorage.setItem('loyaltyCardConfig', JSON.stringify(config));

      toast({
        title: "Card settings saved",
        description: "Your loyalty card customization has been saved to Supabase."
      });
    } catch (err) {
      console.error('Error saving card configuration:', err);
      toast({
        title: "Error",
        description: "Could not save card configuration to Supabase.",
        variant: "destructive"
      });
    }
  };

  const resetToDefaults = () => {
    const defaultConfig: LoyaltyCardConfig = {
      businessName: "Coffee Shop",
      cardTitle: "Loyalty Card",
      maxStamps: 10,
      cardBgColor: "#FFFFFF",
      stampBgColor: "#F5F5DC",
      stampActiveColor: "#8B4513",
      textColor: "#6F4E37",
      businessNameColor: "#6F4E37",
      cardTitleColor: "#8B4513",
      rewardTextColor: "#6F4E37",
      stampIcon: "Gift",
      lastStampText: "FREE",
      lastStampTextColor: "#FFFFFF",
      lastStampBorderColor: "#F97316",
      rewardText: "Collect 10 stamps for a free item",
      rewards: []
    };
    
    setConfig(defaultConfig);
    localStorage.setItem('loyaltyCardConfig', JSON.stringify(defaultConfig));
    setRewardsVersion(v => v + 1);
    
    toast({
      title: "Reset complete",
      description: "Card settings have been reset to defaults"
    });
  };

  const handleLogoUpload = (dataUrl: string) => {
    handleChange('businessLogo', dataUrl);
    toast({
      title: "Logo uploaded",
      description: "Business logo has been updated"
    });
  };

  const handleBackgroundUpload = (dataUrl: string) => {
    handleChange('backgroundImage', dataUrl);
    handleChange('useBackgroundImage', true);
    toast({
      title: "Background uploaded",
      description: "Card background image has been updated"
    });
  };

  const handleCardReset = () => {
    setPreviewStamps(0);
    toast({
      title: "Card Reset",
      description: "Card has been reset to 0 stamps"
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p>Loading card configuration...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-6">
        <Card className="p-4">
          <h2 className="text-xl font-semibold text-coffee-dark mb-4">Loyalty Card Editor</h2>
          
          <Tabs defaultValue="general">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="general" className="flex items-center gap-2">
                <Layout size={16} />
                <span>General</span>
              </TabsTrigger>
              <TabsTrigger value="colors" className="flex items-center gap-2">
                <Palette size={16} />
                <span>Colors</span>
              </TabsTrigger>
              <TabsTrigger value="stamps" className="flex items-center gap-2">
                <Award size={16} />
                <span>Stamps</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="general">
              <GeneralSettings 
                config={config}
                onChange={handleChange}
                onLogoUpload={handleLogoUpload}
                onBackgroundUpload={handleBackgroundUpload}
              />
            </TabsContent>
            
            <TabsContent value="colors">
              <ColorSettings 
                config={config}
                onChange={handleChange}
              />
            </TabsContent>
            
            <TabsContent value="stamps">
              <StampSettings 
                config={config}
                onChange={handleChange}
              />
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={resetToDefaults} className="flex items-center gap-1">
              <RefreshCw size={16} />
              Reset to Defaults
            </Button>
            
            <Button onClick={handleSave} className="flex items-center gap-1">
              <Check size={16} />
              Save Changes
            </Button>
          </div>
        </Card>
      </div>
      
      <div className="space-y-6">
        <Card className="p-4">
          <h2 className="text-xl font-semibold text-coffee-dark mb-4">Card Preview</h2>
          
          <div className="space-y-4">
            <div>
              <Slider
                min={0}
                max={config.maxStamps}
                step={1}
                value={[previewStamps]}
                onValueChange={(value) => setPreviewStamps(value[0])}
                className="flex-1"
              />
              <span className="w-12 text-center font-medium">{previewStamps}</span>
            </div>
            
            <div className="mt-4">
              <LoyaltyCard 
                key={`preview-${rewardsVersion}-${config.maxStamps}-${config.lastStampText || "FREE"}`}
                customerName="John Doe"
                maxStamps={config.maxStamps}
                currentStamps={previewStamps}
                cardStyle={config}
                onReset={handleCardReset}
                businessId="preview"
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
