
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Clock, Plus, Trash2 } from "lucide-react";

interface TimeBonusSettingsProps {
  businessId: string;
}

interface BonusPeriod {
  id: string;
  name: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  bonus_type: "multiplier" | "fixed";
  bonus_value: number;
}

const DAYS_OF_WEEK = [
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
  { value: 0, label: "Sunday" },
];

const TimeBonusSettings: React.FC<TimeBonusSettingsProps> = ({ businessId }) => {
  const [bonusPeriods, setBonusPeriods] = useState<BonusPeriod[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchBonusPeriods();
  }, [businessId]);

  const fetchBonusPeriods = async () => {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('bonus_periods')
        .eq('id', businessId)
        .single();

      if (error) throw error;
      setBonusPeriods(data.bonus_periods || []);
    } catch (error) {
      console.error('Error fetching bonus periods:', error);
      toast({
        title: "Error",
        description: "Failed to load bonus periods.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addBonusPeriod = () => {
    const newPeriod: BonusPeriod = {
      id: Date.now().toString(),
      name: "",
      day_of_week: 1,
      start_time: "09:00",
      end_time: "17:00",
      bonus_type: "fixed",
      bonus_value: 1
    };
    setBonusPeriods([...bonusPeriods, newPeriod]);
  };

  const removeBonusPeriod = (id: string) => {
    setBonusPeriods(bonusPeriods.filter(period => period.id !== id));
  };

  const updateBonusPeriod = (id: string, field: keyof BonusPeriod, value: any) => {
    setBonusPeriods(bonusPeriods.map(period => 
      period.id === id ? { ...period, [field]: value } : period
    ));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('businesses')
        .update({ bonus_periods: bonusPeriods })
        .eq('id', businessId);

      if (error) throw error;

      toast({
        title: "Settings Saved",
        description: "Time-based bonus settings have been updated successfully."
      });
    } catch (error) {
      console.error('Error saving bonus periods:', error);
      toast({
        title: "Error",
        description: "Failed to save bonus periods.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div>Loading time bonus settings...</div>;
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-500" />
            <h3 className="text-lg font-semibold text-coffee-dark">Time-Based Stamp Bonuses</h3>
          </div>
          <Button onClick={addBonusPeriod} size="sm" className="gap-2">
            <Plus size={16} />
            Add Bonus Period
          </Button>
        </div>

        {bonusPeriods.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No bonus periods configured. Click "Add Bonus Period" to create your first time-based bonus.
          </div>
        ) : (
          <div className="space-y-4">
            {bonusPeriods.map((period) => (
              <Card key={period.id} className="p-4 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
                  <div>
                    <Label htmlFor={`name-${period.id}`}>Period Name</Label>
                    <Input
                      id={`name-${period.id}`}
                      value={period.name}
                      onChange={(e) => updateBonusPeriod(period.id, 'name', e.target.value)}
                      placeholder="Happy Hour"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`day-${period.id}`}>Day</Label>
                    <Select
                      value={period.day_of_week.toString()}
                      onValueChange={(value) => updateBonusPeriod(period.id, 'day_of_week', parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue />
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
                    <Label htmlFor={`start-${period.id}`}>Start Time</Label>
                    <Input
                      id={`start-${period.id}`}
                      type="time"
                      value={period.start_time}
                      onChange={(e) => updateBonusPeriod(period.id, 'start_time', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor={`end-${period.id}`}>End Time</Label>
                    <Input
                      id={`end-${period.id}`}
                      type="time"
                      value={period.end_time}
                      onChange={(e) => updateBonusPeriod(period.id, 'end_time', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor={`bonus-${period.id}`}>Bonus Type</Label>
                    <Select
                      value={period.bonus_type}
                      onValueChange={(value: "multiplier" | "fixed") => updateBonusPeriod(period.id, 'bonus_type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fixed">Extra Stamps</SelectItem>
                        <SelectItem value="multiplier">Multiplier</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      value={period.bonus_value}
                      onChange={(e) => updateBonusPeriod(period.id, 'bonus_value', parseInt(e.target.value) || 1)}
                      className="mt-1"
                      placeholder={period.bonus_type === 'multiplier' ? '2' : '1'}
                    />
                  </div>

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeBonusPeriod(period.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </Card>
            ))}
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
    </Card>
  );
};

export default TimeBonusSettings;
