
-- Add referee bonus points column to businesses table
ALTER TABLE public.businesses 
ADD COLUMN referral_referee_bonus_points INTEGER DEFAULT 3;

-- Update the handle_referral_bonus function to support separate referee bonuses
CREATE OR REPLACE FUNCTION public.handle_referral_bonus()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
DECLARE
  referrer_member_id UUID;
  business_referral_enabled BOOLEAN;
  business_referrer_bonus_points INTEGER;
  business_referee_bonus_points INTEGER;
BEGIN
  -- Check if this is the first stamp completion and referral hasn't been awarded yet
  IF NEW.stamps > 0 AND 
     OLD.first_stamp_completed = FALSE AND 
     NEW.first_stamp_completed = TRUE AND
     NEW.referred_by_code IS NOT NULL AND
     NEW.referral_bonus_awarded = FALSE THEN
    
    -- Get business referral settings
    SELECT referral_enabled, referral_bonus_points, referral_referee_bonus_points
    INTO business_referral_enabled, business_referrer_bonus_points, business_referee_bonus_points
    FROM public.businesses 
    WHERE id = NEW.business_id;
    
    -- Only proceed if referral is enabled for this business
    IF business_referral_enabled = TRUE THEN
      -- Find the referrer
      SELECT id INTO referrer_member_id
      FROM public.business_members 
      WHERE referral_code = NEW.referred_by_code 
        AND business_id = NEW.business_id;
      
      -- Award bonus to referrer if found
      IF referrer_member_id IS NOT NULL THEN
        UPDATE public.business_members 
        SET stamps = stamps + business_referrer_bonus_points,
            total_stamps_collected = total_stamps_collected + business_referrer_bonus_points
        WHERE id = referrer_member_id;
        
        -- Award bonus to referee (new customer)
        UPDATE public.business_members 
        SET stamps = stamps + business_referee_bonus_points,
            total_stamps_collected = total_stamps_collected + business_referee_bonus_points
        WHERE id = NEW.id;
        
        -- Mark bonus as awarded
        NEW.referral_bonus_awarded := TRUE;
      END IF;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$function$;
