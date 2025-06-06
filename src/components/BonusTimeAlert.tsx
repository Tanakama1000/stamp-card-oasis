
import React, { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Zap, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface BonusTimeAlertProps {
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

const BonusTimeAlert: React.FC<BonusTimeAlertProps> = ({ businessId }) => {
  const [activeBonusPeriod, setActiveBonusPeriod] = useState<BonusPeriod | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkActiveBonusPeriod = async () => {
      if (!businessId) return;

      try {
        const { data, error } = await supabase
          .from('businesses')
          .select('bonus_periods')
          .eq('id', businessId)
          .single();

        if (error) {
          console.error('Error fetching bonus periods:', error);
          return;
        }

        if (data?.bonus_periods && Array.isArray(data.bonus_periods)) {
          const bonusPeriods = data.bonus_periods as BonusPeriod[];
          const now = new Date();
          const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
          const currentTime = now.toTimeString().substr(0, 5); // "HH:MM" format

          const activePeriod = bonusPeriods.find(period => {
            return (
              period.day_of_week === currentDay &&
              currentTime >= period.start_time &&
              currentTime <= period.end_time
            );
          });

          setActiveBonusPeriod(activePeriod || null);
        }
      } catch (error) {
        console.error('Error checking active bonus period:', error);
      } finally {
        setLoading(false);
      }
    };

    checkActiveBonusPeriod();
    
    // Check every minute for bonus period changes
    const interval = setInterval(checkActiveBonusPeriod, 60000);
    
    return () => clearInterval(interval);
  }, [businessId]);

  if (loading || !activeBonusPeriod) {
    return null;
  }

  const getBonusText = () => {
    if (activeBonusPeriod.bonus_type === "multiplier") {
      return `Earn ${activeBonusPeriod.bonus_value}x stamps`;
    } else {
      return `Earn +${activeBonusPeriod.bonus_value} extra stamp${activeBonusPeriod.bonus_value !== 1 ? 's' : ''}`;
    }
  };

  return (
    <Alert className="bg-gradient-to-r from-orange-500 to-yellow-500 border-orange-400 text-white mb-4 animate-pulse">
      <Zap className="h-4 w-4" />
      <AlertDescription className="flex items-center gap-2">
        <span className="text-lg">🚀</span>
        <strong>{activeBonusPeriod.name}!</strong>
        <span>{getBonusText()} now!</span>
        <Clock className="h-4 w-4 ml-auto" />
      </AlertDescription>
    </Alert>
  );
};

export default BonusTimeAlert;
