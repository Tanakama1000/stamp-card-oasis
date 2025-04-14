
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Palette, Edit, Eye } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import LoyaltyCard from "@/components/LoyaltyCard";

interface LoyaltyCardEditorProps {
  onCardUpdate?: (cardConfig: LoyaltyCardConfig) => void;
}

export interface LoyaltyCardConfig {
  businessName: string;
  customerName: string;
  maxStamps: number;
  currentStamps: number;
}

const LoyaltyCardEditor: React.FC<LoyaltyCardEditorProps> = ({ onCardUpdate }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("edit");
  
  const [cardConfig, setCardConfig] = useState<LoyaltyCardConfig>({
    businessName: "Coffee Oasis",
    customerName: "Coffee Lover",
    maxStamps: 10,
    currentStamps: 3
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
                onStampCollected={() => {}}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default LoyaltyCardEditor;
