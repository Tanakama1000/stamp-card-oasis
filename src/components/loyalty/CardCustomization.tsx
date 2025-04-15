
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  Check, 
  Palette, 
  Layout, 
  Image as ImageIcon, 
  Type, 
  Award, 
  Star, 
  Heart, 
  Coffee, 
  Battery, 
  Zap, 
  Gift, 
  Trophy, 
  Sparkles,
  RefreshCw,
  Circle,
  Cake,
  Pizza,
  IceCream,
  Flower,
  Diamond,
  Bell,
  Medal,
  ThumbsUp
} from "lucide-react";
import { LoyaltyCardConfig } from "./types/LoyaltyCardConfig";
import { STAMP_ICONS } from "./types";
import LoyaltyCard from "../LoyaltyCard";
import FileUpload from "./FileUpload";
import { supabase } from "@/integrations/supabase/client";

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
          setConfig(data.config as LoyaltyCardConfig);
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
      const { data, error } = await supabase
        .from('loyalty_card_configs')
        .upsert({
          business_id: businessData.id,
          config: config as any
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
      stampIcon: "Gift",
      lastStampText: "FREE",
      lastStampTextColor: "#FFFFFF",
      lastStampBorderColor: "#F97316",
      rewardText: "Collect 10 stamps for a free item",
      rewards: []
    });
    
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

  useEffect(() => {
    if (config.rewardText && config.rewardText.includes("stamps for")) {
      handleChange('rewardText', `Collect ${config.maxStamps} stamps for a free item`);
    }
  }, [config.maxStamps]);

  const countWords = (text: string): number => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
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
                  <Label htmlFor="rewardText">Reward Text</Label>
                  <Input 
                    id="rewardText"
                    value={config.rewardText || `Collect ${config.maxStamps} stamps for a free item`}
                    onChange={(e) => handleChange('rewardText', e.target.value)}
                    placeholder={`Collect ${config.maxStamps} stamps for a free item`} 
                  />
                </div>
                
                <div>
                  <Label>Business Logo</Label>
                  {config.businessLogo && (
                    <div className="mb-2 mt-1 p-2 border rounded-md">
                      <img 
                        src={config.businessLogo} 
                        alt="Business Logo" 
                        className="h-12 object-contain mx-auto" 
                      />
                    </div>
                  )}
                  <FileUpload 
                    onFileUploaded={handleLogoUpload}
                    label="Upload Logo"
                    accept="image/*"
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
                  <div className="space-y-2">
                    <Label>Card Background Image</Label>
                    {config.backgroundImage && (
                      <div className="mb-2 mt-1 p-2 border rounded-md">
                        <img 
                          src={config.backgroundImage} 
                          alt="Background" 
                          className="h-24 w-full object-cover rounded" 
                        />
                      </div>
                    )}
                    <FileUpload
                      onFileUploaded={handleBackgroundUpload}
                      label="Upload Background"
                      accept="image/*"
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
                      handleChange('lastStampBorderColor', '#F97316');
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
                      handleChange('lastStampBorderColor', '#2563EB');
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
                      handleChange('lastStampBorderColor', '#10B981');
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
                      handleChange('lastStampBorderColor', '#8B5CF6');
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
                      handleChange('lastStampBorderColor', '#F97316');
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
                      handleChange('lastStampBorderColor', '#60A5FA');
                    }}
                  >
                    <div className="w-3 h-3 rounded-full bg-gray-800"></div>
                    Dark
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex items-center gap-1 bg-red-50 text-red-800 border-red-200"
                    onClick={() => {
                      handleChange('cardBgColor', '#FEF2F2');
                      handleChange('textColor', '#991B1B');
                      handleChange('businessNameColor', '#7F1D1D');
                      handleChange('cardTitleColor', '#EF4444');
                      handleChange('stampBgColor', '#FEE2E2');
                      handleChange('stampActiveColor', '#EF4444');
                      handleChange('rewardTextColor', '#991B1B');
                      handleChange('lastStampBorderColor', '#EF4444');
                    }}
                  >
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    Red
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex items-center gap-1 bg-pink-50 text-pink-800 border-pink-200"
                    onClick={() => {
                      handleChange('cardBgColor', '#FDF2F8');
                      handleChange('textColor', '#9D174D');
                      handleChange('businessNameColor', '#831843');
                      handleChange('cardTitleColor', '#EC4899');
                      handleChange('stampBgColor', '#FCE7F3');
                      handleChange('stampActiveColor', '#EC4899');
                      handleChange('rewardTextColor', '#9D174D');
                      handleChange('lastStampBorderColor', '#EC4899');
                    }}
                  >
                    <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                    Pink
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex items-center gap-1 bg-amber-50 text-amber-800 border-amber-200"
                    onClick={() => {
                      handleChange('cardBgColor', '#FFFBEB');
                      handleChange('textColor', '#92400E');
                      handleChange('businessNameColor', '#78350F');
                      handleChange('cardTitleColor', '#F59E0B');
                      handleChange('stampBgColor', '#FEF3C7');
                      handleChange('stampActiveColor', '#F59E0B');
                      handleChange('rewardTextColor', '#92400E');
                      handleChange('lastStampBorderColor', '#F59E0B');
                    }}
                  >
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    Amber
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex items-center gap-1 bg-teal-50 text-teal-800 border-teal-200"
                    onClick={() => {
                      handleChange('cardBgColor', '#F0FDFA');
                      handleChange('textColor', '#115E59');
                      handleChange('businessNameColor', '#134E4A');
                      handleChange('cardTitleColor', '#14B8A6');
                      handleChange('stampBgColor', '#CCFBF1');
                      handleChange('stampActiveColor', '#14B8A6');
                      handleChange('rewardTextColor', '#115E59');
                      handleChange('lastStampBorderColor', '#14B8A6');
                    }}
                  >
                    <div className="w-3 h-3 rounded-full bg-teal-500"></div>
                    Teal
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
              
              <div className="mt-6">
                <Label htmlFor="lastStampText">Last Stamp Text</Label>
                <Input 
                  id="lastStampText"
                  value={config.lastStampText || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (countWords(value) <= 4 || value === '') {
                      handleChange('lastStampText', value);
                    } else {
                      toast({
                        title: "Too many words",
                        description: "Last stamp text cannot exceed 4 words",
                        variant: "destructive"
                      });
                    }
                  }}
                  placeholder="FREE" 
                  className="mb-2"
                />
                <p className="text-sm text-gray-500 mb-4">Text for the last stamp (maximum 4 words)</p>
                
                <div>
                  <Label htmlFor="lastStampTextColor">Last Stamp Text Color</Label>
                  <div className="flex gap-2 items-center">
                    <Input 
                      id="lastStampTextColor"
                      type="color"
                      className="w-12 h-8 p-1"
                      value={config.lastStampTextColor || '#FFFFFF'}
                      onChange={(e) => handleChange('lastStampTextColor', e.target.value)}
                    />
                    <Input 
                      value={config.lastStampTextColor || '#FFFFFF'}
                      onChange={(e) => handleChange('lastStampTextColor', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <Label htmlFor="lastStampBorderColor">Last Stamp Border Color</Label>
                  <div className="flex gap-2 items-center">
                    <Input 
                      id="lastStampBorderColor"
                      type="color"
                      className="w-12 h-8 p-1"
                      value={config.lastStampBorderColor || '#F97316'}
                      onChange={(e) => handleChange('lastStampBorderColor', e.target.value)}
                    />
                    <Input 
                      value={config.lastStampBorderColor || '#F97316'}
                      onChange={(e) => handleChange('lastStampBorderColor', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
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
                key={`preview-${rewardsVersion}-${config.maxStamps}-${config.lastStampText || "FREE"}`}
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
