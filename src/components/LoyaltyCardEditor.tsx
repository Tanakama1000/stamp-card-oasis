
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Palette, Edit, Eye, Upload, Coffee, Star, Heart, Award, Battery, Zap, Gift } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import LoyaltyCard from "@/components/LoyaltyCard";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

interface LoyaltyCardEditorProps {
  onCardUpdate?: (cardConfig: LoyaltyCardConfig) => void;
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
  stampIcon: string;
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

const COLOR_PRESETS = {
  cardBg: ["#FFFFFF", "#F5F5DC", "#FEF9D7", "#E7F0FD", "#FFDEE2", "#E5DEFF"],
  stampBg: ["#F5F5DC", "#FFFDD0", "#FFFFFF", "#F6F6F7", "#F1F0FB", "#C8C8C9"],
  stampActive: ["#8B4513", "#D2691E", "#FF8C00", "#A67B5B", "#9b87f5", "#F97316"],
  text: ["#6F4E37", "#222222", "#000000", "#403E43", "#1A1F2C", "#8B5CF6"],
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
    stampIcon: "Coffee"
  });

  const form = useForm<LoyaltyCardConfig>({
    defaultValues: cardConfig
  });

  const handleSubmit = (data: LoyaltyCardConfig) => {
    setCardConfig(data);
    if (onCardUpdate) {
      onCardUpdate(data);
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
