
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { 
  Check, 
  Palette, 
  Layout, 
  Image as ImageIcon, 
  Type, 
  Gift, 
  Star, 
  Heart, 
  Award, 
  Coffee, 
  Battery, 
  Zap, 
  Trophy, 
  Sparkles,
  RefreshCw
} from "lucide-react";
import { LoyaltyCardConfig } from "./types/LoyaltyCardConfig";
import { STAMP_ICONS } from "./types";
import LoyaltyCard from "../LoyaltyCard";
import { Reward } from "./types";

interface CardCustomizationProps {
  onSave: (config: LoyaltyCardConfig) => void;
  initialConfig?: LoyaltyCardConfig;
}

export default function CardCustomization({ onSave, initialConfig }: CardCustomizationProps) {
  const { toast } = useToast();
  const [previewStamps, setPreviewStamps] = useState(3);
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
    stampIcon: "Coffee",
    rewards: []
  });

  const [reward, setReward] = useState<Reward>({
    stampNumber: 5,
    description: "Free Coffee",
    icon: "Coffee"
  });

  useEffect(() => {
    // Load saved configuration from localStorage if available
    const savedConfig = localStorage.getItem('loyaltyCardConfig');
    if (savedConfig && !initialConfig) {
      try {
        const parsedConfig = JSON.parse(savedConfig);
        setConfig(parsedConfig);
      } catch (e) {
        console.error("Error parsing saved config:", e);
      }
    }
  }, [initialConfig]);

  const handleChange = (field: keyof LoyaltyCardConfig, value: any) => {
    setConfig(prev => {
      const updated = { ...prev, [field]: value };
      localStorage.setItem('loyaltyCardConfig', JSON.stringify(updated));
      return updated;
    });
  };

  const handleSave = () => {
    onSave(config);
    toast({
      title: "Card settings saved",
      description: "Your loyalty card customization has been saved."
    });
  };

  const addReward = () => {
    if (!config.rewards) {
      config.rewards = [];
    }
    
    // Check if this stamp already has a reward
    const existingRewardIndex = config.rewards.findIndex(r => r.stampNumber === reward.stampNumber);
    
    if (existingRewardIndex >= 0) {
      const updatedRewards = [...config.rewards];
      updatedRewards[existingRewardIndex] = { ...reward };
      
      handleChange('rewards', updatedRewards);
    } else {
      handleChange('rewards', [...config.rewards, { ...reward }]);
    }
    
    toast({
      title: "Reward added",
      description: `Reward added for stamp #${reward.stampNumber}`
    });
  };

  const removeReward = (stampNumber: number) => {
    if (config.rewards) {
      const updatedRewards = config.rewards.filter(r => r.stampNumber !== stampNumber);
      handleChange('rewards', updatedRewards);
      
      toast({
        title: "Reward removed",
        description: `Reward for stamp #${stampNumber} has been removed`
      });
    }
  };

  const resetToDefaults = () => {
    setConfig({
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
      stampIcon: "Coffee",
      rewards: []
    });
    
    toast({
      title: "Reset complete",
      description: "Card settings have been reset to defaults"
    });
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-6">
        <Card className="p-4">
          <h2 className="text-xl font-semibold text-coffee-dark mb-4">Loyalty Card Editor</h2>
          
          <Tabs defaultValue="general">
            <TabsList className="grid grid-cols-4 mb-4">
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
              <TabsTrigger value="rewards" className="flex items-center gap-2">
                <Gift size={16} />
                <span>Rewards</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input 
                    id="businessName"
                    value={config.businessName}
                    onChange={(e) => handleChange('businessName', e.target.value)}
                    placeholder="Your Business Name" 
                  />
                </div>
                
                <div>
                  <Label htmlFor="cardTitle">Card Title</Label>
                  <Input 
                    id="cardTitle"
                    value={config.cardTitle}
                    onChange={(e) => handleChange('cardTitle', e.target.value)}
                    placeholder="Loyalty Card" 
                  />
                </div>
                
                <div>
                  <Label htmlFor="businessLogo">Business Logo URL</Label>
                  <Input 
                    id="businessLogo"
                    value={config.businessLogo || ''}
                    onChange={(e) => handleChange('businessLogo', e.target.value)}
                    placeholder="https://example.com/logo.png" 
                  />
                </div>
                
                <div>
                  <Label htmlFor="maxStamps">Maximum Stamps</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      id="maxStamps"
                      min={5}
                      max={20}
                      step={1}
                      value={[config.maxStamps]}
                      onValueChange={(value) => handleChange('maxStamps', value[0])}
                      className="flex-1"
                    />
                    <span className="w-12 text-center font-medium">{config.maxStamps}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Label htmlFor="useBackgroundImage">Use Background Image</Label>
                  <Switch
                    id="useBackgroundImage"
                    checked={config.useBackgroundImage || false}
                    onCheckedChange={(checked) => handleChange('useBackgroundImage', checked)}
                  />
                </div>
                
                {config.useBackgroundImage && (
                  <div>
                    <Label htmlFor="backgroundImage">Background Image URL</Label>
                    <Input 
                      id="backgroundImage"
                      value={config.backgroundImage || ''}
                      onChange={(e) => handleChange('backgroundImage', e.target.value)}
                      placeholder="https://example.com/background.jpg" 
                    />
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="colors" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cardBgColor">Card Background</Label>
                  <div className="flex gap-2 items-center">
                    <Input 
                      id="cardBgColor"
                      type="color"
                      className="w-12 h-8 p-1"
                      value={config.cardBgColor}
                      onChange={(e) => handleChange('cardBgColor', e.target.value)}
                    />
                    <Input 
                      value={config.cardBgColor}
                      onChange={(e) => handleChange('cardBgColor', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="textColor">Default Text Color</Label>
                  <div className="flex gap-2 items-center">
                    <Input 
                      id="textColor"
                      type="color"
                      className="w-12 h-8 p-1"
                      value={config.textColor}
                      onChange={(e) => handleChange('textColor', e.target.value)}
                    />
                    <Input 
                      value={config.textColor}
                      onChange={(e) => handleChange('textColor', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="businessNameColor">Business Name Color</Label>
                  <div className="flex gap-2 items-center">
                    <Input 
                      id="businessNameColor"
                      type="color"
                      className="w-12 h-8 p-1"
                      value={config.businessNameColor}
                      onChange={(e) => handleChange('businessNameColor', e.target.value)}
                    />
                    <Input 
                      value={config.businessNameColor}
                      onChange={(e) => handleChange('businessNameColor', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="cardTitleColor">Card Title Color</Label>
                  <div className="flex gap-2 items-center">
                    <Input 
                      id="cardTitleColor"
                      type="color"
                      className="w-12 h-8 p-1"
                      value={config.cardTitleColor}
                      onChange={(e) => handleChange('cardTitleColor', e.target.value)}
                    />
                    <Input 
                      value={config.cardTitleColor}
                      onChange={(e) => handleChange('cardTitleColor', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="stampBgColor">Stamp Background</Label>
                  <div className="flex gap-2 items-center">
                    <Input 
                      id="stampBgColor"
                      type="color"
                      className="w-12 h-8 p-1"
                      value={config.stampBgColor}
                      onChange={(e) => handleChange('stampBgColor', e.target.value)}
                    />
                    <Input 
                      value={config.stampBgColor}
                      onChange={(e) => handleChange('stampBgColor', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="stampActiveColor">Active Stamp Color</Label>
                  <div className="flex gap-2 items-center">
                    <Input 
                      id="stampActiveColor"
                      type="color"
                      className="w-12 h-8 p-1"
                      value={config.stampActiveColor}
                      onChange={(e) => handleChange('stampActiveColor', e.target.value)}
                    />
                    <Input 
                      value={config.stampActiveColor}
                      onChange={(e) => handleChange('stampActiveColor', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="rewardTextColor">Reward Text Color</Label>
                  <div className="flex gap-2 items-center">
                    <Input 
                      id="rewardTextColor"
                      type="color"
                      className="w-12 h-8 p-1"
                      value={config.rewardTextColor}
                      onChange={(e) => handleChange('rewardTextColor', e.target.value)}
                    />
                    <Input 
                      value={config.rewardTextColor}
                      onChange={(e) => handleChange('rewardTextColor', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <h3 className="text-sm font-medium mb-2">Color Presets</h3>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex items-center gap-1 bg-white text-coffee-dark border-coffee-light"
                    onClick={() => {
                      handleChange('cardBgColor', '#FFFFFF');
                      handleChange('textColor', '#6F4E37');
                      handleChange('businessNameColor', '#6F4E37');
                      handleChange('cardTitleColor', '#8B4513');
                      handleChange('stampBgColor', '#F5F5DC');
                      handleChange('stampActiveColor', '#8B4513');
                      handleChange('rewardTextColor', '#6F4E37');
                    }}
                  >
                    <div className="w-3 h-3 rounded-full bg-white border"></div>
                    Classic
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex items-center gap-1 bg-blue-50 text-blue-800 border-blue-200"
                    onClick={() => {
                      handleChange('cardBgColor', '#EFF6FF');
                      handleChange('textColor', '#1E40AF');
                      handleChange('businessNameColor', '#1E3A8A');
                      handleChange('cardTitleColor', '#2563EB');
                      handleChange('stampBgColor', '#BFDBFE');
                      handleChange('stampActiveColor', '#3B82F6');
                      handleChange('rewardTextColor', '#1E40AF');
                    }}
                  >
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    Blue
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex items-center gap-1 bg-green-50 text-green-800 border-green-200"
                    onClick={() => {
                      handleChange('cardBgColor', '#ECFDF5');
                      handleChange('textColor', '#065F46');
                      handleChange('businessNameColor', '#064E3B');
                      handleChange('cardTitleColor', '#10B981');
                      handleChange('stampBgColor', '#A7F3D0');
                      handleChange('stampActiveColor', '#10B981');
                      handleChange('rewardTextColor', '#065F46');
                    }}
                  >
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    Green
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex items-center gap-1 bg-purple-50 text-purple-800 border-purple-200"
                    onClick={() => {
                      handleChange('cardBgColor', '#F5F3FF');
                      handleChange('textColor', '#5B21B6');
                      handleChange('businessNameColor', '#4C1D95');
                      handleChange('cardTitleColor', '#8B5CF6');
                      handleChange('stampBgColor', '#DDD6FE');
                      handleChange('stampActiveColor', '#8B5CF6');
                      handleChange('rewardTextColor', '#5B21B6');
                    }}
                  >
                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                    Purple
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex items-center gap-1 bg-orange-50 text-orange-800 border-orange-200"
                    onClick={() => {
                      handleChange('cardBgColor', '#FFF7ED');
                      handleChange('textColor', '#9A3412');
                      handleChange('businessNameColor', '#7C2D12');
                      handleChange('cardTitleColor', '#F97316');
                      handleChange('stampBgColor', '#FFEDD5');
                      handleChange('stampActiveColor', '#F97316');
                      handleChange('rewardTextColor', '#9A3412');
                    }}
                  >
                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                    Orange
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex items-center gap-1 bg-gray-900 text-gray-200 border-gray-700"
                    onClick={() => {
                      handleChange('cardBgColor', '#1F2937');
                      handleChange('textColor', '#F3F4F6');
                      handleChange('businessNameColor', '#F9FAFB');
                      handleChange('cardTitleColor', '#60A5FA');
                      handleChange('stampBgColor', '#374151');
                      handleChange('stampActiveColor', '#60A5FA');
                      handleChange('rewardTextColor', '#F3F4F6');
                    }}
                  >
                    <div className="w-3 h-3 rounded-full bg-gray-800"></div>
                    Dark
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="stamps" className="space-y-4">
              <div>
                <Label>Stamp Icon</Label>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {Object.keys(STAMP_ICONS).map((iconName) => {
                    const IconComponent = STAMP_ICONS[iconName as keyof typeof STAMP_ICONS];
                    return (
                      <Button
                        key={iconName}
                        type="button"
                        variant={config.stampIcon === iconName ? "default" : "outline"}
                        className={`flex flex-col items-center justify-center p-2 h-16 ${
                          config.stampIcon === iconName ? 'bg-orange text-white' : ''
                        }`}
                        onClick={() => handleChange('stampIcon', iconName)}
                      >
                        <IconComponent size={20} />
                        <span className="text-xs mt-1">{iconName}</span>
                      </Button>
                    );
                  })}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="rewards" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="rewardStampNumber">Stamp Number</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      id="rewardStampNumber"
                      min={1}
                      max={config.maxStamps}
                      step={1}
                      value={[reward.stampNumber]}
                      onValueChange={(value) => setReward(prev => ({ ...prev, stampNumber: value[0] }))}
                      className="flex-1"
                    />
                    <span className="w-12 text-center font-medium">{reward.stampNumber}</span>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="rewardDescription">Reward Description</Label>
                  <Input 
                    id="rewardDescription"
                    value={reward.description}
                    onChange={(e) => setReward(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Free Coffee" 
                  />
                </div>
                
                <div>
                  <Label>Reward Icon</Label>
                  <div className="grid grid-cols-5 gap-2 mt-2">
                    {Object.keys(STAMP_ICONS).map((iconName) => {
                      const IconComponent = STAMP_ICONS[iconName as keyof typeof STAMP_ICONS];
                      return (
                        <Button
                          key={iconName}
                          type="button"
                          variant={reward.icon === iconName ? "default" : "outline"}
                          className={`flex flex-col items-center justify-center p-2 h-16 ${
                            reward.icon === iconName ? 'bg-orange text-white' : ''
                          }`}
                          onClick={() => setReward(prev => ({ ...prev, icon: iconName }))}
                        >
                          <IconComponent size={20} />
                          <span className="text-xs mt-1 truncate w-full">{iconName}</span>
                        </Button>
                      );
                    })}
                  </div>
                </div>
                
                <Button onClick={addReward} className="w-full">
                  Add Reward to Stamp #{reward.stampNumber}
                </Button>
                
                {(config.rewards && config.rewards.length > 0) ? (
                  <div>
                    <h3 className="text-sm font-medium mb-2">Current Rewards</h3>
                    <div className="space-y-2">
                      {config.rewards.map((currentReward, index) => {
                        const RewardIcon = STAMP_ICONS[currentReward.icon as keyof typeof STAMP_ICONS] || Gift;
                        
                        return (
                          <div 
                            key={index} 
                            className="flex items-center justify-between p-2 border rounded-md"
                          >
                            <div className="flex items-center gap-2">
                              <div className="bg-orange rounded-full p-1 text-white">
                                <RewardIcon size={16} />
                              </div>
                              <div>
                                <div className="text-sm font-medium">Stamp #{currentReward.stampNumber}</div>
                                <div className="text-xs text-coffee-light">{currentReward.description}</div>
                              </div>
                            </div>
                            
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => removeReward(currentReward.stampNumber)}
                              className="h-8 w-8 p-0"
                            >
                              <span className="sr-only">Remove</span>
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : null}
              </div>
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
              <Label htmlFor="previewStamps">Preview Stamps</Label>
              <div className="flex items-center gap-4">
                <Slider
                  id="previewStamps"
                  min={0}
                  max={config.maxStamps}
                  step={1}
                  value={[previewStamps]}
                  onValueChange={(value) => setPreviewStamps(value[0])}
                  className="flex-1"
                />
                <span className="w-12 text-center font-medium">{previewStamps}</span>
              </div>
            </div>
            
            <div className="mt-4">
              <LoyaltyCard 
                customerName="John Doe"
                maxStamps={config.maxStamps}
                currentStamps={previewStamps}
                cardStyle={config}
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
