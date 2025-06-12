
-- Add cooldown_minutes column to businesses table
ALTER TABLE public.businesses 
ADD COLUMN IF NOT EXISTS cooldown_minutes integer DEFAULT 2;

-- Add comment to explain the column
COMMENT ON COLUMN public.businesses.cooldown_minutes IS 'Minimum minutes customers must wait between stamp collections at this business';
