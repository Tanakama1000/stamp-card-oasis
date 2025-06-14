
-- Fix the expire_old_stamps function to properly update member stamp counts
CREATE OR REPLACE FUNCTION public.expire_old_stamps()
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
DECLARE
  expired_count INTEGER := 0;
  business_record RECORD;
  member_record RECORD;
  stamps_to_expire INTEGER;
  current_stamps INTEGER;
  new_stamp_count INTEGER;
BEGIN
  -- Loop through businesses that have stamp expiry enabled
  FOR business_record IN 
    SELECT id, stamp_expiry_days 
    FROM public.businesses 
    WHERE stamp_expiry_days > 0 AND is_active = TRUE
  LOOP
    -- Find members with expired stamps for this business
    FOR member_record IN
      SELECT 
        bm.id as member_id,
        bm.customer_name,
        bm.stamps as current_stamps,
        COUNT(sr.id) as expired_stamps_count
      FROM public.business_members bm
      INNER JOIN public.stamp_records sr ON bm.id = sr.business_member_id
      WHERE sr.business_id = business_record.id
        AND sr.is_expired = FALSE
        AND sr.created_at < (NOW() - INTERVAL '1 day' * business_record.stamp_expiry_days)
      GROUP BY bm.id, bm.customer_name, bm.stamps
      HAVING COUNT(sr.id) > 0
    LOOP
      stamps_to_expire := member_record.expired_stamps_count;
      current_stamps := member_record.current_stamps;
      
      -- Calculate new stamp count, ensuring it doesn't go negative
      new_stamp_count := GREATEST(0, current_stamps - stamps_to_expire);
      
      -- Mark stamps as expired
      UPDATE public.stamp_records 
      SET is_expired = TRUE, expired_at = NOW()
      WHERE business_member_id = member_record.member_id
        AND business_id = business_record.id
        AND is_expired = FALSE
        AND created_at < (NOW() - INTERVAL '1 day' * business_record.stamp_expiry_days);
      
      -- Update member's stamp count (remove the problematic condition)
      UPDATE public.business_members 
      SET stamps = new_stamp_count
      WHERE id = member_record.member_id;
      
      -- Log the expiry with more details
      INSERT INTO public.expired_stamps_log (
        business_id, 
        business_member_id, 
        customer_name, 
        stamps_expired
      ) VALUES (
        business_record.id,
        member_record.member_id,
        member_record.customer_name,
        stamps_to_expire
      );
      
      expired_count := expired_count + stamps_to_expire;
      
      -- Log for debugging
      RAISE NOTICE 'Expired % stamps for member % (had % stamps, now has %)', 
        stamps_to_expire, member_record.customer_name, current_stamps, new_stamp_count;
      
    END LOOP;
  END LOOP;
  
  RETURN expired_count;
END;
$function$
