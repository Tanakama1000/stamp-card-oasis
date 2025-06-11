
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Clock, AlertCircle, Bell, Play, RefreshCw, Plus, Trash2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface StampExpirySettingsProps {
  businessId: string;
}

interface ExpiryRule {
  dayOfWeek: number; // -1 for everyday, 0-6 for specific days (0 = Sunday)
  expiryDays: number;
  notificationDays: number;
}

const DAYS_OF_WEEK = [
  { value: -1, label: "Everyday" },
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
];

const StampExpirySettings: React.FC<StampExpirySettingsProps> = ({ businessId }) => {
  const [expiryRules, setExpiryRules] = useState<ExpiryRule[]>([]);
  const [lastExpiryRun, setLastExpiryRun] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [runningExpiry, setRunningExpiry] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchExpirySettings();
  }, [businessId]);

  const fetchExpirySettings = async () => {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('expiry_day_rules, last_expiry_run')
        .eq('id', businessId)
        .single();

      if (error) throw error;
      
      if (data) {
        const rules = data.expiry_day_rules || [];
        setExpiryRules(rules.length > 0 ? rules : [{ dayOfWeek: -1, expiryDays: 0, notificationDays: 3 }]);
        setLastExpiryRun(data.last_expiry_run);
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

  const addExpiryRule = () => {
    setExpiryRules([...expiryRules, { dayOfWeek: -1, expiryDays: 0, notificationDays: 3 }]);
  };

  const removeExpiryRule = (index: number) => {
    if (expiryRules.length > 1) {
      setExpiryRules(expiryRules.filter((_, i) => i !== index));
    }
  };

  const updateExpiryRule = (index: number, field: keyof ExpiryRule, value: number) => {
    const updatedRules = [...expiryRules];
    updatedRules[index] = { ...updatedRules[index], [field]: value };
    setExpiryRules(updatedRules);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('businesses')
        .update({ expiry_day_rules: expiryRules })
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

  const handleRunExpiryNow = async () => {
    setRunningExpiry(true);
    try {
      const { data, error } = await supabase.functions.invoke('expire-stamps', {
        body: { manual: true, businessId }
      });

      if (error) throw error;

      // Update the last expiry run time
      await supabase
        .from('businesses')
        .update({ last_expiry_run: new Date().toISOString() })
        .eq('id', businessId);

      // Refresh the data
      await fetchExpirySettings();

      toast({
        title: "Expiry Check Complete",
        description: data?.message || `Successfully expired ${data?.expiredCount || 0} stamps.`
      });
    } catch (error) {
      console.error('Error running expiry check:', error);
      toast({
        title: "Error",
        description: "Failed to run expiry check. Please try again.",
        variant: "destructive"
      });
    } finally {
      setRunningExpiry(false);
    }
  };

  const getDayLabel = (dayOfWeek: number) => {
    return DAYS_OF_WEEK.find(day => day.value === dayOfWeek)?.label || "Unknown";
  };

  const hasActiveExpiry = expiryRules.some(rule => rule.expiryDays > 0);

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
          {expiryRules.map((rule, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Expiry Rule {index + 1}</h4>
                {expiryRules.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeExpiryRule(index)}
                    className="h-8 w-8 p-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor={`dayOfWeek-${index}`}>Day of Week</Label>
                  <Select
                    value={rule.dayOfWeek.toString()}
                    onValueChange={(value) => updateExpiryRule(index, 'dayOfWeek', parseInt(value))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select day" />
                    </SelectTrigger>
                    <SelectContent>
                      {DAYS_OF_WEEK.map((day) => (
                        <SelectItem key={day.value} value={day.value.toString()}>
                          {day.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor={`expiryDays-${index}`}>Stamp Expiry Period (Days)</Label>
                  <Input
                    id={`expiryDays-${index}`}
                    type="number"
                    min="0"
                    value={rule.expiryDays}
                    onChange={(e) => updateExpiryRule(index, 'expiryDays', parseInt(e.target.value) || 0)}
                    className="mt-1"
                    placeholder="0 = Never expire"
                  />
                </div>

                <div>
                  <Label htmlFor={`notificationDays-${index}`}>Notification Warning (Days Before)</Label>
                  <Input
                    id={`notificationDays-${index}`}
                    type="number"
                    min="1"
                    max={Math.max(1, rule.expiryDays - 1)}
                    value={rule.notificationDays}
                    onChange={(e) => updateExpiryRule(index, 'notificationDays', parseInt(e.target.value) || 3)}
                    className="mt-1"
                    placeholder="3"
                    disabled={rule.expiryDays === 0}
                  />
                </div>
              </div>

              {rule.expiryDays > 0 && (
                <Alert>
                  <Bell className="h-4 w-4" />
                  <AlertDescription>
                    On {getDayLabel(rule.dayOfWeek)}: Stamps will expire after {rule.expiryDays} days. 
                    Customers will be notified {rule.notificationDays} days before expiry.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          ))}

          <Button
            variant="outline"
            onClick={addExpiryRule}
            className="w-full flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Another Expiry Rule
          </Button>

          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <Button 
              onClick={handleSave} 
              disabled={saving}
              className="w-full sm:w-auto"
            >
              {saving ? "Saving..." : "Save Settings"}
            </Button>

            {hasActiveExpiry && (
              <div className="flex flex-col gap-2 w-full sm:w-auto">
                <Button
                  onClick={handleRunExpiryNow}
                  disabled={runningExpiry}
                  variant="outline"
                  className="w-full sm:w-auto flex items-center gap-2"
                >
                  {runningExpiry ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                  {runningExpiry ? "Running..." : "Run Expiry Check Now"}
                </Button>
                
                {lastExpiryRun && (
                  <p className="text-sm text-gray-500">
                    Last run: {new Date(lastExpiryRun).toLocaleString()}
                  </p>
                )}
              </div>
            )}
          </div>

          <p className="text-sm text-gray-500 mt-2">
            Set expiry days to 0 for stamps that never expire. You can create multiple rules for different days of the week.
            Use "Everyday" to apply the same expiry period to all days.
          </p>
        </div>
      </div>
    </Card>
  );
};

export default StampExpirySettings;
