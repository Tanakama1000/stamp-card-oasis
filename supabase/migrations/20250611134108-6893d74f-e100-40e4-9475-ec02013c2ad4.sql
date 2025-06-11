
-- Add columns to support day-specific expiry settings
ALTER TABLE public.businesses 
ADD COLUMN IF NOT EXISTS expiry_day_rules jsonb DEFAULT '[]'::jsonb;

-- Update the comment to explain the new column
COMMENT ON COLUMN public.businesses.expiry_day_rules IS 'JSON array of day-specific expiry rules. Each rule has: {dayOfWeek: number (-1 for everyday, 0-6 for specific days), expiryDays: number, notificationDays: number}';
