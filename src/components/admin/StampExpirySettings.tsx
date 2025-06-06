
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Clock, AlertCircle, Bell } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface StampExpirySettingsProps {
  businessId: string;
}

const StampExpirySettings: React.FC<StampExpirySettingsProps> = ({ businessId }) => {
  const [expiryDays, setExpiryDays] = useState<number>(0);
  const [notificationDays, setNotificationDays] = useState<number>(3);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchExpirySettings();
  }, [businessId]);

  const fetchExpirySettings = async () => {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('stamp_expiry_days, notification_days')
        .eq('id', businessId)
        .single();

      if (error) throw error;
      
      if (data) {
        setExpiryDays(data.stamp_expiry_days || 0);
        setNotificationDays(data.notification_days || 3);
      }
    } catch (error) {
      console.error('Error fetching expiry settings:', error);
      toast({
        title: "Error",
        description: "Failed to load stamp expiry settings.",
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
          stamp_expiry_days: expiryDays,
          notification_days: notificationDays
        })
        .eq('id', businessId);

      if (error) throw error;

      toast({
        title: "Settings Saved",
        description: "Stamp expiry settings have been updated successfully."
      });
    } catch (error) {
      console.error('Error saving expiry settings:', error);
      toast({
        title: "Error",
        description: "Failed to save stamp expiry settings.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div>Loading stamp expiry settings...</div>;
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-coffee-medium" />
          <h3 className="text-lg font-semibold text-coffee-dark">Stamp Expiry Settings</h3>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="expiryDays">Stamp Expiry Period (Days)</Label>
              <Input
                id="expiryDays"
                type="number"
                min="0"
                value={expiryDays}
                onChange={(e) => setExpiryDays(parseInt(e.target.value) || 0)}
                className="mt-1"
                placeholder="0 = Never expire"
              />
              <p className="text-sm text-gray-500 mt-1">
                Set to 0 for stamps that never expire. Changes only affect new stamps.
              </p>
            </div>

            <div>
              <Label htmlFor="notificationDays">Notification Warning (Days Before)</Label>
              <Input
                id="notificationDays"
                type="number"
                min="1"
                max={Math.max(1, expiryDays - 1)}
                value={notificationDays}
                onChange={(e) => setNotificationDays(parseInt(e.target.value) || 3)}
                className="mt-1"
                placeholder="3"
                disabled={expiryDays === 0}
              />
              <p className="text-sm text-gray-500 mt-1">
                How many days before expiry to notify customers.
              </p>
            </div>
          </div>

          {expiryDays > 0 && (
            <Alert>
              <Bell className="h-4 w-4" />
              <AlertDescription>
                Stamps will expire after {expiryDays} days. Customers will be notified {notificationDays} days before their stamps expire.
              </AlertDescription>
            </Alert>
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

export default StampExpirySettings;
