import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
interface StampCooldownSettingsProps {
  businessId: string;
}
const StampCooldownSettings = ({
  businessId
}: StampCooldownSettingsProps) => {
  const {
    toast
  } = useToast();
  const [cooldownMinutes, setCooldownMinutes] = useState<number>(2);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const cooldownOptions = [{
    value: 1,
    label: "1 minute"
  }, {
    value: 2,
    label: "2 minutes"
  }, {
    value: 5,
    label: "5 minutes"
  }, {
    value: 10,
    label: "10 minutes"
  }, {
    value: 15,
    label: "15 minutes"
  }, {
    value: 30,
    label: "30 minutes"
  }, {
    value: 60,
    label: "1 hour"
  }];
  useEffect(() => {
    const fetchCooldownSettings = async () => {
      try {
        const {
          data,
          error
        } = await supabase.from('businesses').select('cooldown_minutes').eq('id', businessId).single();
        if (error) throw error;
        setCooldownMinutes(data.cooldown_minutes || 2);
      } catch (error) {
        console.error('Error fetching cooldown settings:', error);
        toast({
          title: "Error",
          description: "Failed to load cooldown settings.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    if (businessId) {
      fetchCooldownSettings();
    }
  }, [businessId, toast]);
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const {
        error
      } = await supabase.from('businesses').update({
        cooldown_minutes: cooldownMinutes
      }).eq('id', businessId);
      if (error) throw error;
      toast({
        title: "Settings Updated",
        description: `Stamp collection cooldown set to ${cooldownOptions.find(opt => opt.value === cooldownMinutes)?.label}.`
      });
    } catch (error) {
      console.error('Error updating cooldown settings:', error);
      toast({
        title: "Error",
        description: "Failed to update cooldown settings.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };
  if (isLoading) {
    return <Card className="p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-10 bg-gray-200 rounded mb-4"></div>
        </div>
      </Card>;
  }
  return <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-orange" />
        <h3 className="font-semibold text-[5271ff] text-coffee-dark">Stamp Collection Cooldown</h3>
      </div>
      
      <p className="text-sm text-gray-600 mb-4">
        Set the minimum time customers must wait between stamp collections to prevent spam and ensure fair usage.
      </p>

      <div className="space-y-4">
        <div>
          <Label htmlFor="cooldown-select">Cooldown Period</Label>
          <Select value={cooldownMinutes.toString()} onValueChange={value => setCooldownMinutes(parseInt(value))}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select cooldown period" />
            </SelectTrigger>
            <SelectContent>
              {cooldownOptions.map(option => <SelectItem key={option.value} value={option.value.toString()}>
                  {option.label}
                </SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={isSaving} className="bg-orange hover:bg-orange-dark">
            {isSaving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </div>
    </Card>;
};
export default StampCooldownSettings;