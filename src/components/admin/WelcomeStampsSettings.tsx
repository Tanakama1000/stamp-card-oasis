
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Gift } from "lucide-react";

interface WelcomeStampsSettingsProps {
  businessId: string;
}

const WelcomeStampsSettings: React.FC<WelcomeStampsSettingsProps> = ({ businessId }) => {
  const [welcomeStamps, setWelcomeStamps] = useState<number>(0);
  const [welcomeStampsEnabled, setWelcomeStampsEnabled] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchWelcomeStampsSettings();
  }, [businessId]);

  const fetchWelcomeStampsSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('welcome_stamps, welcome_stamps_enabled')
        .eq('id', businessId)
        .single();

      if (error) throw error;
      setWelcomeStamps(data.welcome_stamps || 0);
      setWelcomeStampsEnabled(data.welcome_stamps_enabled || false);
    } catch (error) {
      console.error('Error fetching welcome stamps settings:', error);
      toast({
        title: "Error",
        description: "Failed to load welcome stamps settings.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('businesses')
        .update({ 
          welcome_stamps: welcomeStamps,
          welcome_stamps_enabled: welcomeStampsEnabled 
        })
        .eq('id', businessId);

      if (error) throw error;

      toast({
        title: "Settings Saved",
        description: "Welcome stamps settings have been updated successfully."
      });
    } catch (error) {
      console.error('Error saving welcome stamps settings:', error);
      toast({
        title: "Error",
        description: "Failed to save welcome stamps settings.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div>Loading welcome stamps settings...</div>;
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Gift className="h-5 w-5 text-orange-500" />
          <h3 className="text-lg font-semibold text-coffee-dark">Welcome Stamps</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="welcomeStampsEnabled">Enable Welcome Stamps</Label>
              <p className="text-sm text-gray-500">
                Automatically award stamps to new customers when they join
              </p>
            </div>
            <Switch
              id="welcomeStampsEnabled"
              checked={welcomeStampsEnabled}
              onCheckedChange={setWelcomeStampsEnabled}
            />
          </div>

          {welcomeStampsEnabled && (
            <div>
              <Label htmlFor="welcomeStamps">Number of Welcome Stamps</Label>
              <Input
                id="welcomeStamps"
                type="number"
                min="0"
                max="10"
                value={welcomeStamps}
                onChange={(e) => setWelcomeStamps(parseInt(e.target.value) || 0)}
                className="mt-1"
                placeholder="Enter number of stamps"
              />
              <p className="text-sm text-gray-500 mt-1">
                Set how many stamps new customers receive when they join your program
              </p>
            </div>
          )}

          <Button 
            onClick={handleSave} 
            disabled={saving}
            className="w-full sm:w-auto"
          >
            {saving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default WelcomeStampsSettings;
