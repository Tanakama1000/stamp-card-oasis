
import { supabase } from "@/integrations/supabase/client";

interface BonusPeriod {
  id: string;
  name: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  bonus_type: "multiplier" | "fixed";
  bonus_value: number;
}

export const checkActiveBonusPeriod = async (businessId: string): Promise<number> => {
  try {
    const { data, error } = await supabase
      .from('businesses')
      .select('bonus_periods')
      .eq('id', businessId)
      .single();

    if (error) {
      console.error('Error fetching bonus periods:', error);
      return 1; // Default to 1 stamp
    }

    if (data?.bonus_periods && Array.isArray(data.bonus_periods)) {
      const bonusPeriods = data.bonus_periods as unknown as BonusPeriod[];
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

      if (activePeriod) {
        console.log(`🚀 Active bonus period found: ${activePeriod.name}`);
        if (activePeriod.bonus_type === "multiplier") {
          return activePeriod.bonus_value; // e.g., 2x stamps = 2 stamps
        } else {
          return 1 + activePeriod.bonus_value; // e.g., +1 extra stamp = 2 total stamps
        }
      }
    }

    return 1; // Default to 1 stamp if no bonus period is active
  } catch (error) {
    console.error('Error checking bonus period:', error);
    return 1;
  }
};
