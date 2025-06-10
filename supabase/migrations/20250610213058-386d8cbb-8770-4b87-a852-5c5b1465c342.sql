
-- Enable required extensions for cron jobs
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create a cron job that runs the stamp expiry function daily at 2 AM
SELECT cron.schedule(
  'daily-stamp-expiry',
  '0 2 * * *', -- Daily at 2 AM
  $$
  SELECT
    net.http_post(
        url:='https://odosaalpddimejppnvjr.supabase.co/functions/v1/expire-stamps',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9kb3NhYWxwZGRpbWVqcHBudmpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2Nzc5NjAsImV4cCI6MjA2MDI1Mzk2MH0.UVBE6vnLelAMc491H19yY62aKfjsOYkankWxV7DBA64"}'::jsonb,
        body:='{"scheduled": true}'::jsonb
    ) as request_id;
  $$
);

-- Add a column to track last expiry run
ALTER TABLE public.businesses 
ADD COLUMN IF NOT EXISTS last_expiry_run timestamp with time zone;
