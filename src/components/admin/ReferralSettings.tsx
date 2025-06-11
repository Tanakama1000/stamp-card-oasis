
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Users, Gift, Share2, TrendingUp } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface ReferralSettingsProps {
  businessId: string;
}

interface ReferralData {
  referral_enabled: boolean;
  referral_bonus_points: number;
  referral_referee_bonus_points: number;
}

const ReferralSettings: React.FC<ReferralSettingsProps> = ({ businessId }) => {
  const [settings, setSettings] = useState<ReferralData>({
    referral_enabled: false,
    referral_bonus_points: 1,
    referral_referee_bonus_points: 3
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, [businessId]);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('referral_enabled, referral_bonus_points, referral_referee_bonus_points')
        .eq('id', businessId)
        .single();

      if (error) throw error;
      
      setSettings({
        referral_enabled: data.referral_enabled || false,
        referral_bonus_points: data.referral_bonus_points || 1,
        referral_referee_bonus_points: data.referral_referee_bonus_points || 3
      });
    } catch (error) {
      console.error('Error fetching referral settings:', error);
      toast({
        title: "Error",
        description: "Failed to load referral settings.",
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
          referral_enabled: settings.referral_enabled,
          referral_bonus_points: settings.referral_bonus_points,
          referral_referee_bonus_points: settings.referral_referee_bonus_points
        })
        .eq('id', businessId);

      if (error) throw error;

      toast({
        title: "Settings Saved",
        description: "Referral program settings have been updated successfully."
      });
    } catch (error) {
      console.error('Error saving referral settings:', error);
      toast({
        title: "Error",
        description: "Failed to save referral settings.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (key: keyof ReferralData, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return <div>Loading referral settings...</div>;
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-coffee-dark">Refer-a-Friend Bonus Program</h3>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="referral-enabled">Enable Referral Program</Label>
            <p className="text-sm text-gray-600">
              Allow customers to earn bonus stamps by referring friends
            </p>
          </div>
          <Switch
            id="referral-enabled"
            checked={settings.referral_enabled}
            onCheckedChange={(checked) => updateSetting('referral_enabled', checked)}
          />
        </div>

        {settings.referral_enabled && (
          <>
            <Separator />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Gift className="h-4 w-4 text-green-500" />
                  <Label htmlFor="referrer-bonus">Referrer Bonus (Existing Customer)</Label>
                </div>
                <div className="space-y-2">
                  <Input
                    id="referrer-bonus"
                    type="number"
                    min="1"
                    max="10"
                    value={settings.referral_bonus_points}
                    onChange={(e) => updateSetting('referral_bonus_points', parseInt(e.target.value) || 1)}
                  />
                  <p className="text-xs text-gray-500">
                    Stamps awarded to existing customers when their referral gets their first stamp
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Share2 className="h-4 w-4 text-purple-500" />
                  <Label htmlFor="referee-bonus">Referee Bonus (New Customer)</Label>
                </div>
                <div className="space-y-2">
                  <Input
                    id="referee-bonus"
                    type="number"
                    min="1"
                    max="10"
                    value={settings.referral_referee_bonus_points}
                    onChange={(e) => updateSetting('referral_referee_bonus_points', parseInt(e.target.value) || 1)}
                  />
                  <p className="text-xs text-gray-500">
                    Bonus stamps awarded to new customers when they get their first stamp
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="space-y-2">
                  <h4 className="font-medium text-blue-900">How It Works</h4>
                  <div className="text-sm text-blue-800 space-y-1">
                    <p>1. Every customer automatically gets a unique referral code</p>
                    <p>2. New customers can enter a referral code when joining</p>
                    <p>3. When the new customer gets their first stamp:</p>
                    <p className="ml-4">• Referrer gets +{settings.referral_bonus_points} stamp{settings.referral_bonus_points !== 1 ? 's' : ''}</p>
                    <p className="ml-4">• New customer gets +{settings.referral_referee_bonus_points} bonus stamp{settings.referral_referee_bonus_points !== 1 ? 's' : ''}</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        <Button 
          onClick={handleSave} 
          disabled={saving}
          className="w-full sm:w-auto"
        >
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </Card>
  );
};

export default ReferralSettings;
