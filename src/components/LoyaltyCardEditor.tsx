
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Palette, Edit, Eye, Upload, Coffee, Star, Heart, Award, Battery, Zap, Gift, Plus, Trash2, Image } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import LoyaltyCard from "@/components/LoyaltyCard";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";

interface LoyaltyCardEditorProps {
  onCardUpdate?: (cardConfig: LoyaltyCardConfig) => void;
}

export interface Reward {
  stampNumber: number;
  description: string;
  icon: string;
}

export interface LoyaltyCardConfig {
  businessName: string;
  customerName: string;
  maxStamps: number;
  currentStamps: number;
  cardBgColor: string;
  stampBgColor: string;
  stampActiveColor: string;
  textColor: string;
  businessLogo?: string;
  businessName?: string;
  businessNameColor?: string;
  rewardTextColor?: string;
  stampIcon: string;
  rewardIcon?: string;
  rewards: Reward[];
  miniRewardStampColor?: string;
  backgroundImage?: string;
  useBackgroundImage?: boolean;
}

const STAMP_ICONS = [
  { name: "Coffee", icon: Coffee },
  { name: "Star", icon: Star },
  { name: "Heart", icon: Heart },
  { name: "Award", icon: Award },
  { name: "Battery", icon: Battery },
  { name: "Zap", icon: Zap },
  { name: "Gift", icon: Gift },
];

const REWARD_ICONS = [
  { name: "Gift", icon: Gift },
  { name: "Award", icon: Award },
  { name: "Star", icon: Star },
];

const COLOR_PRESETS = {
  cardBg: ["#FFFFFF", "#F5F5DC", "#FEF9D7", "#E7F0FD", "#FFDEE2", "#E5DEFF"],
  stampBg: ["#F5F5DC", "#FFFDD0", "#FFFFFF", "#F6F6F7", "#F1F0FB", "#C8C8C9"],
  stampActive: ["#8B4513", "#D2691E", "#FF8C00", "#A67B5B", "#9b87f5", "#F97316"],
  text: ["#6F4E37", "#222222", "#000000", "#403E43", "#1A1F2C", "#8B5CF6"],
  miniReward: ["#D3D3D3", "#C0C0C0", "#A9A9A9", "#E5E4E2", "#CCCCCC", "#D8D8D8"],
};

const LoyaltyCardEditor: React.FC<LoyaltyCardEditorProps> = ({ onCardUpdate }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("edit");
  
  const [cardConfig, setCardConfig] = useState<LoyaltyCardConfig>({
    businessName: "Coffee Oasis",
    customerName: "Coffee Lover",
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
    useBackgroundImage: false
  });

  const form = useForm<LoyaltyCardConfig>({
    defaultValues: cardConfig
  });

  const handleSubmit = (data: LoyaltyCardConfig) => {
    // Sort rewards by stampNumber
    const sortedRewards = [...data.rewards].sort((a, b) => a.stampNumber - b.stampNumber);
    const updatedData = {...data, rewards: sortedRewards};
    
    setCardConfig(updatedData);
    if (onCardUpdate) {
      onCardUpdate(updatedData);
    }
    toast({
      title: "Card Updated",
      description: "Loyalty card configuration has been updated.",
    });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const newConfig = { ...cardConfig, businessLogo: event.target.result as string };
          setCardConfig(newConfig);
          form.setValue("businessLogo", event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
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
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const addReward = () => {
    const maxStamps = form.getValues("maxStamps");
    const currentRewards = form.getValues("rewards") || [];
    
    // Find the next available stamp number
    const usedStampNumbers = currentRewards.map(r => r.stampNumber);
    let nextStampNumber = 1;
    while (usedStampNumbers.includes(nextStampNumber) && nextStampNumber < maxStamps) {
      nextStampNumber++;
    }
    
    // If all stamps are used, don't add more
    if (nextStampNumber >= maxStamps) {
      toast({
        title: "Cannot Add More Rewards",
        description: "You've reached the maximum number of stamps for rewards.",
        variant: "destructive",
      });
      return;
    }
    
    const newReward: Reward = {
      stampNumber: nextStampNumber,
      description: "Free Item",
      icon: "Gift"
    };
    
    const updatedRewards = [...currentRewards, newReward];
    form.setValue("rewards", updatedRewards);
  };
  
  const removeReward = (index: number) => {
    const currentRewards = form.getValues("rewards") || [];
    const updatedRewards = currentRewards.filter((_, i) => i !== index);
    form.setValue("rewards", updatedRewards);
  };

  return (
    <Card className="p-6 bg-white card-shadow">
      <h3 className="text-xl font-semibold text-coffee-dark mb-4 flex items-center gap-2">
        <Palette size={24} className="text-orange" />
        Loyalty Card Editor
      </h3>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="edit" className="flex items-center gap-2">
            <Edit size={18} />
            Edit
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <Eye size={18} />
            Preview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="edit">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="businessName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter business name" 
                        {...field} 
                        className="border-coffee-light"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="customerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Default Customer Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter default customer name" 
                        {...field} 
                        className="border-coffee-light"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="maxStamps"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stamps Required</FormLabel>
                      <FormControl>
                        <Select 
                          value={field.value.toString()} 
                          onValueChange={(val) => field.onChange(parseInt(val))}
                        >
                          <SelectTrigger className="border-coffee-light">
                            <SelectValue placeholder="Select stamps required" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="5">5 Stamps</SelectItem>
                            <SelectItem value="8">8 Stamps</SelectItem>
                            <SelectItem value="10">10 Stamps</SelectItem>
                            <SelectItem value="12">12 Stamps</SelectItem>
                            <SelectItem value="15">15 Stamps</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="currentStamps"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Demo Stamps</FormLabel>
                      <FormControl>
                        <Select 
                          value={field.value.toString()} 
                          onValueChange={(val) => field.onChange(parseInt(val))}
                        >
                          <SelectTrigger className="border-coffee-light">
                            <SelectValue placeholder="Select demo stamps" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">0 Stamps</SelectItem>
                            <SelectItem value="3">3 Stamps</SelectItem>
                            <SelectItem value="5">5 Stamps</SelectItem>
                            <SelectItem value="8">8 Stamps</SelectItem>
                            <SelectItem value="10">10 Stamps</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Business Logo Upload */}
              <FormField
                control={form.control}
                name="businessLogo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Logo</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <Input 
                            type="file" 
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                          />
                          <div className="border border-dashed border-coffee-light rounded-md p-4 text-center flex items-center justify-center">
                            <Upload size={18} className="mr-2" />
                            <span>Upload Logo</span>
                          </div>
                        </div>
                        {cardConfig.businessLogo && (
                          <div className="h-12 w-12 bg-cream rounded-md flex items-center justify-center overflow-hidden">
                            <img 
                              src={cardConfig.businessLogo} 
                              alt="Business logo" 
                              className="max-h-full max-w-full object-contain" 
                            />
                          </div>
                        )}
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
              
              {/* Card Background Image Upload */}
              <FormField
                control={form.control}
                name="backgroundImage"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Card Background Image</FormLabel>
                    <FormControl>
                      <div className="flex flex-col gap-2">
                        <div className="relative flex-1">
                          <Input 
                            type="file" 
                            accept="image/*"
                            onChange={handleBackgroundImageUpload}
                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                          />
                          <div className="border border-dashed border-coffee-light rounded-md p-4 text-center flex items-center justify-center">
                            <Image size={18} className="mr-2" />
                            <span>Upload Background Image</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={form.watch("useBackgroundImage")}
                            onCheckedChange={(checked) => {
                              form.setValue("useBackgroundImage", checked);
                            }}
                            id="use-bg-image"
                          />
                          <label htmlFor="use-bg-image" className="text-sm cursor-pointer">
                            Use background image
                          </label>
                        </div>
                        
                        {cardConfig.backgroundImage && (
                          <div className="h-16 bg-cream rounded-md flex items-center justify-center overflow-hidden">
                            <img 
                              src={cardConfig.backgroundImage} 
                              alt="Card background" 
                              className="max-h-full w-full object-cover" 
                            />
                          </div>
                        )}
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Custom Rewards Section */}
              <div className="space-y-4 border-t border-cream pt-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-coffee-dark">Progress Rewards</h4>
                  <Button 
                    type="button"
                    variant="outline" 
                    size="sm"
                    onClick={addReward}
                    className="flex items-center gap-1"
                  >
                    <Plus size={16} />
                    Add Reward
                  </Button>
                </div>
                
                <FormField
                  control={form.control}
                  name="rewards"
                  render={({ field }) => (
                    <FormItem>
                      <div className="space-y-2">
                        {field.value && field.value.length > 0 ? (
                          field.value.map((reward, index) => (
                            <div key={index} className="flex gap-2 items-end border border-cream rounded-md p-3">
                              <div className="flex-1 space-y-2">
                                <div>
                                  <label className="text-sm font-medium">Stamp Number</label>
                                  <Select
                                    value={reward.stampNumber.toString()}
                                    onValueChange={(val) => {
                                      const newRewards = [...field.value];
                                      newRewards[index] = {
                                        ...newRewards[index],
                                        stampNumber: parseInt(val)
                                      };
                                      field.onChange(newRewards);
                                    }}
                                  >
                                    <SelectTrigger className="border-coffee-light">
                                      <SelectValue placeholder="Select stamp" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {[...Array(form.getValues("maxStamps"))].map((_, i) => (
                                        <SelectItem 
                                          key={i} 
                                          value={(i + 1).toString()}
                                          disabled={field.value.some((r, idx) => 
                                            idx !== index && r.stampNumber === i + 1
                                          )}
                                        >
                                          Stamp {i + 1}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                
                                <div>
                                  <label className="text-sm font-medium">Reward Description</label>
                                  <Input
                                    placeholder="e.g., Free Cookie"
                                    value={reward.description}
                                    onChange={(e) => {
                                      const newRewards = [...field.value];
                                      newRewards[index] = {
                                        ...newRewards[index],
                                        description: e.target.value
                                      };
                                      field.onChange(newRewards);
                                    }}
                                    className="border-coffee-light"
                                  />
                                </div>
                                
                                <div>
                                  <label className="text-sm font-medium">Reward Icon</label>
                                  <div className="grid grid-cols-4 gap-2">
                                    {STAMP_ICONS.map((stampIcon) => {
                                      const Icon = stampIcon.icon;
                                      return (
                                        <div 
                                          key={stampIcon.name}
                                          onClick={() => {
                                            const newRewards = [...field.value];
                                            newRewards[index] = {
                                              ...newRewards[index],
                                              icon: stampIcon.name
                                            };
                                            field.onChange(newRewards);
                                          }}
                                          className={`p-2 rounded-md cursor-pointer flex flex-col items-center justify-center gap-1 text-xs transition-all ${
                                            reward.icon === stampIcon.name 
                                              ? 'bg-orange text-white' 
                                              : 'bg-cream hover:bg-cream-light'
                                          }`}
                                        >
                                          <Icon size={16} />
                                          <span>{stampIcon.name}</span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeReward(index)}
                                className="text-red-500 hover:bg-red-50 hover:text-red-600"
                              >
                                <Trash2 size={18} />
                              </Button>
                            </div>
                          ))
                        ) : (
                          <div className="text-center p-4 border border-dashed border-coffee-light rounded-md">
                            <p className="text-sm text-coffee-light">No rewards added yet. Add a reward to offer progress-based incentives.</p>
                          </div>
                        )}
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              {/* Icons Selection */}
              <div className="space-y-4 border-t border-cream pt-4 mt-4">
                <h4 className="font-medium text-coffee-dark">Card Icons</h4>
                
                {/* Stamp Icon Selection */}
                <FormField
                  control={form.control}
                  name="stampIcon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stamp Icon</FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-4 gap-2">
                          {STAMP_ICONS.map((stampIcon) => {
                            const Icon = stampIcon.icon;
                            return (
                              <div 
                                key={stampIcon.name}
                                onClick={() => field.onChange(stampIcon.name)}
                                className={`p-3 rounded-md cursor-pointer flex flex-col items-center justify-center gap-1 text-xs transition-all ${
                                  field.value === stampIcon.name 
                                    ? 'bg-orange text-white' 
                                    : 'bg-cream hover:bg-cream-light'
                                }`}
                              >
                                <Icon size={18} />
                                <span>{stampIcon.name}</span>
                              </div>
                            );
                          })}
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Reward Icon Selection */}
                <FormField
                  control={form.control}
                  name="rewardIcon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Final Reward Icon</FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-3 gap-2">
                          {REWARD_ICONS.map((rewardIcon) => {
                            const Icon = rewardIcon.icon;
                            return (
                              <div 
                                key={rewardIcon.name}
                                onClick={() => field.onChange(rewardIcon.name)}
                                className={`p-3 rounded-md cursor-pointer flex flex-col items-center justify-center gap-1 text-xs transition-all ${
                                  field.value === rewardIcon.name 
                                    ? 'bg-orange text-white' 
                                    : 'bg-cream hover:bg-cream-light'
                                }`}
                              >
                                <Icon size={18} />
                                <span>{rewardIcon.name}</span>
                              </div>
                            );
                          })}
                        </div>
                      </FormControl>
                      <p className="text-xs text-coffee-light mt-1">This icon will appear on the final stamp</p>
                    </FormItem>
                  )}
                />
              </div>

              {/* Color Pickers Section */}
              <div className="space-y-4 border-t border-cream pt-4 mt-4">
                <h4 className="font-medium text-coffee-dark">Card Colors</h4>
                
                <FormField
                  control={form.control}
                  name="cardBgColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center justify-between">
                        Card Background
                        <span 
                          className="w-5 h-5 rounded-full" 
                          style={{ backgroundColor: field.value }} 
                        />
                      </FormLabel>
                      <FormControl>
                        <div>
                          <div className="flex gap-2 mb-2">
                            {COLOR_PRESETS.cardBg.map(color => (
                              <div
                                key={color}
                                className={`w-6 h-6 rounded-full cursor-pointer transition-all ${
                                  field.value === color ? 'ring-2 ring-offset-1 ring-orange' : ''
                                }`}
                                style={{ backgroundColor: color }}
                                onClick={() => field.onChange(color)}
                              />
                            ))}
                          </div>
                          <Input 
                            type="color"
                            {...field}
                            className="h-8 w-full"
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="stampBgColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center justify-between">
                        Empty Stamp Background
                        <span 
                          className="w-5 h-5 rounded-full" 
                          style={{ backgroundColor: field.value }} 
                        />
                      </FormLabel>
                      <FormControl>
                        <div>
                          <div className="flex gap-2 mb-2">
                            {COLOR_PRESETS.stampBg.map(color => (
                              <div
                                key={color}
                                className={`w-6 h-6 rounded-full cursor-pointer transition-all ${
                                  field.value === color ? 'ring-2 ring-offset-1 ring-orange' : ''
                                }`}
                                style={{ backgroundColor: color }}
                                onClick={() => field.onChange(color)}
                              />
                            ))}
                          </div>
                          <Input 
                            type="color"
                            {...field}
                            className="h-8 w-full"
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="stampActiveColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center justify-between">
                        Active Stamp Color
                        <span 
                          className="w-5 h-5 rounded-full" 
                          style={{ backgroundColor: field.value }} 
                        />
                      </FormLabel>
                      <FormControl>
                        <div>
                          <div className="flex gap-2 mb-2">
                            {COLOR_PRESETS.stampActive.map(color => (
                              <div
                                key={color}
                                className={`w-6 h-6 rounded-full cursor-pointer transition-all ${
                                  field.value === color ? 'ring-2 ring-offset-1 ring-orange' : ''
                                }`}
                                style={{ backgroundColor: color }}
                                onClick={() => field.onChange(color)}
                              />
                            ))}
                          </div>
                          <Input 
                            type="color"
                            {...field}
                            className="h-8 w-full"
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="miniRewardStampColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center justify-between">
                        Mini-Reward Stamp Color (before activation)
                        <span 
                          className="w-5 h-5 rounded-full" 
                          style={{ backgroundColor: field.value }} 
                        />
                      </FormLabel>
                      <FormControl>
                        <div>
                          <div className="flex gap-2 mb-2">
                            {COLOR_PRESETS.miniReward.map(color => (
                              <div
                                key={color}
                                className={`w-6 h-6 rounded-full cursor-pointer transition-all ${
                                  field.value === color ? 'ring-2 ring-offset-1 ring-orange' : ''
                                }`}
                                style={{ backgroundColor: color }}
                                onClick={() => field.onChange(color)}
                              />
                            ))}
                          </div>
                          <Input 
                            type="color"
                            {...field}
                            className="h-8 w-full"
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="textColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center justify-between">
                        Text Color
                        <span 
                          className="w-5 h-5 rounded-full" 
                          style={{ backgroundColor: field.value }} 
                        />
                      </FormLabel>
                      <FormControl>
                        <div>
                          <div className="flex gap-2 mb-2">
                            {COLOR_PRESETS.text.map(color => (
                              <div
                                key={color}
                                className={`w-6 h-6 rounded-full cursor-pointer transition-all ${
                                  field.value === color ? 'ring-2 ring-offset-1 ring-orange' : ''
                                }`}
                                style={{ backgroundColor: color }}
                                onClick={() => field.onChange(color)}
                              />
                            ))}
                          </div>
                          <Input 
                            type="color"
                            {...field}
                            className="h-8 w-full"
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="businessNameColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center justify-between">
                        Business Name Color
                        <span 
                          className="w-5 h-5 rounded-full" 
                          style={{ backgroundColor: field.value }} 
                        />
                      </FormLabel>
                      <FormControl>
                        <div>
                          <div className="flex gap-2 mb-2">
                            {COLOR_PRESETS.text.map(color => (
                              <div
                                key={color}
                                className={`w-6 h-6 rounded-full cursor-pointer transition-all ${
                                  field.value === color ? 'ring-2 ring-offset-1 ring-orange' : ''
                                }`}
                                style={{ backgroundColor: color }}
                                onClick={() => field.onChange(color)}
                              />
                            ))}
                          </div>
                          <Input 
                            type="color"
                            {...field}
                            className="h-8 w-full"
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="rewardTextColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center justify-between">
                        Reward Text Color
                        <span 
                          className="w-5 h-5 rounded-full" 
                          style={{ backgroundColor: field.value }} 
                        />
                      </FormLabel>
                      <FormControl>
                        <div>
                          <div className="flex gap-2 mb-2">
                            {COLOR_PRESETS.text.map(color => (
                              <div
                                key={color}
                                className={`w-6 h-6 rounded-full cursor-pointer transition-all ${
                                  field.value === color ? 'ring-2 ring-offset-1 ring-orange' : ''
                                }`}
                                style={{ backgroundColor: color }}
                                onClick={() => field.onChange(color)}
                              />
                            ))}
                          </div>
                          <Input 
                            type="color"
                            {...field}
                            className="h-8 w-full"
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <Button 
                type="submit"
                className="bg-orange hover:bg-orange-light transition-colors w-full mt-2"
              >
                Update Card
              </Button>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="preview">
          <div className="flex flex-col gap-4">
            <div className="bg-cream-light p-4 rounded-lg">
              <p className="text-sm text-coffee-light mb-2">Card Preview</p>
              <LoyaltyCard
                customerName={cardConfig.customerName}
                maxStamps={cardConfig.maxStamps}
                currentStamps={cardConfig.currentStamps}
                cardStyle={cardConfig}
                onStampCollected={() => {}}
              />
            </div>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full">
                  Full Screen Preview
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[90vh]">
                <SheetHeader>
                  <SheetTitle>Card Preview</SheetTitle>
                </SheetHeader>
                <div className="flex items-center justify-center h-full">
                  <div className="max-w-md w-full">
                    <LoyaltyCard
                      customerName={cardConfig.customerName}
                      maxStamps={cardConfig.maxStamps}
                      currentStamps={cardConfig.currentStamps}
                      cardStyle={cardConfig}
                      onStampCollected={() => {}}
                    />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default LoyaltyCardEditor;
