
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
  const [timeRemaining, setTimeRemaining] = useState<string>("");

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
          const bonusPeriods = data.bonus_periods as unknown as BonusPeriod[];
          const now = new Date();
          const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
          const currentTime = now.toTimeString().substr(0, 5); // "HH:MM" format

          const activePeriod = bonusPeriods.find(period => {
            // Check if it's an "everyday" period (-1) or matches the current day
            const isCorrectDay = period.day_of_week === -1 || period.day_of_week === currentDay;
            const isInTimeRange = currentTime >= period.start_time && currentTime <= period.end_time;
            
            return isCorrectDay && isInTimeRange;
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

  useEffect(() => {
    if (!activeBonusPeriod) {
      setTimeRemaining("");
      return;
    }

    const calculateTimeRemaining = () => {
      const now = new Date();
      const endTime = new Date();
      const [hours, minutes] = activeBonusPeriod.end_time.split(':').map(Number);
      endTime.setHours(hours, minutes, 0, 0);

      // If end time is before current time, it means it's for the next day
      if (endTime < now) {
        endTime.setDate(endTime.getDate() + 1);
      }

      const timeDiff = endTime.getTime() - now.getTime();
      
      if (timeDiff <= 0) {
        setTimeRemaining("Expired");
        setActiveBonusPeriod(null);
        return;
      }

      const hoursLeft = Math.floor(timeDiff / (1000 * 60 * 60));
      const minutesLeft = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const secondsLeft = Math.floor((timeDiff % (1000 * 60)) / 1000);

      if (hoursLeft > 0) {
        setTimeRemaining(`${hoursLeft}h ${minutesLeft}m ${secondsLeft}s`);
      } else if (minutesLeft > 0) {
        setTimeRemaining(`${minutesLeft}m ${secondsLeft}s`);
      } else {
        setTimeRemaining(`${secondsLeft}s`);
      }
    };

    calculateTimeRemaining();
    const timer = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(timer);
  }, [activeBonusPeriod]);

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
        <div className="ml-auto flex items-center gap-1">
          <Clock className="h-4 w-4" />
          <span className="font-mono text-sm">{timeRemaining}</span>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default BonusTimeAlert;
