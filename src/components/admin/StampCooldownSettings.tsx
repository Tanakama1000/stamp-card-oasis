
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Clock } from "lucide-react";

interface StampCooldownSettingsProps {
  businessId: string;
}

const StampCooldownSettings = ({ businessId }: StampCooldownSettingsProps) => {
  const { toast } = useToast();
  const [cooldownMinutes, setCooldownMinutes] = useState<number>(2);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const cooldownOptions = [
    { value: 1, label: "1 minute" },
    { value: 2, label: "2 minutes" },
    { value: 5, label: "5 minutes" },
    { value: 10, label: "10 minutes" },
    { value: 15, label: "15 minutes" },
    { value: 30, label: "30 minutes" },
    { value: 60, label: "1 hour" },
  ];

  useEffect(() => {
    const fetchCooldownSettings = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('businesses')
          .select('cooldown_minutes')
          .eq('id', businessId)
          .single();

        if (error) throw error;

        if (data) {
          setCooldownMinutes(data.cooldown_minutes || 2);
        }
      } catch (error) {
        console.error('Error fetching cooldown settings:', error);
        toast({
          title: "Error",
          description: "Could not load cooldown settings.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCooldownSettings();
  }, [businessId, toast]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('businesses')
        .update({ cooldown_minutes: cooldownMinutes })
        .eq('id', businessId);

      if (error) throw error;

      toast({
        title: "Settings Updated",
        description: `Stamp cooldown set to ${cooldownOptions.find(opt => opt.value === cooldownMinutes)?.label || cooldownMinutes + ' minutes'}.`
      });
    } catch (error) {
      console.error('Error saving cooldown settings:', error);
      toast({
        title: "Error",
        description: "Could not save cooldown settings. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-6 bg-white card-shadow">
        <div className="flex items-center gap-2 mb-4">
          <Clock size={20} className="text-orange" />
          <h3 className="text-lg font-semibold text-coffee-dark">Stamp Cooldown Period</h3>
        </div>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-10 bg-gray-200 rounded w-1/2"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-white card-shadow">
      <div className="flex items-center gap-2 mb-4">
        <Clock size={20} className="text-orange" />
        <h3 className="text-lg font-semibold text-coffee-dark">Stamp Cooldown Period</h3>
      </div>
      
      <p className="text-coffee-light text-sm mb-4">
        Set how long customers must wait between stamp collections at your business. This prevents abuse while maintaining a good experience.
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-coffee-dark mb-2">
            Cooldown between stamp scans:
          </label>
          <Select
            value={cooldownMinutes.toString()}
            onValueChange={(value) => setCooldownMinutes(parseInt(value))}
          >
            <SelectTrigger className="w-full max-w-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {cooldownOptions.map((option) => (
                <SelectItem key={option.value} value={option.value.toString()}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-coffee-light mt-1">
            Customers must wait this long before they can scan and collect another stamp
          </p>
        </div>

        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-orange hover:bg-orange-light transition-colors"
        >
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </Card>
  );
};

export default StampCooldownSettings;
