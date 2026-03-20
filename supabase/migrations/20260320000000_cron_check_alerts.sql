-- ============================================================
-- Migration: schedule check-alerts Edge Function via pg_cron
--
-- USE THIS if your Supabase CLI version does not support [[crons]]
-- in config.toml, OR if you are running on the hosted Supabase
-- platform and want to schedule via SQL.
--
-- Requires the pg_cron extension (enabled by default on Supabase).
-- Run in Supabase SQL Editor → this is idempotent.
-- ============================================================

-- Enable pg_cron if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Remove old job if it exists (idempotent re-run)
SELECT cron.unschedule('check-alerts-hourly')
WHERE EXISTS (
  SELECT 1 FROM cron.job WHERE jobname = 'check-alerts-hourly'
);

-- Schedule: every hour on the hour
-- Calls the Edge Function via HTTP using the service role key.
-- Replace <PROJECT_REF> and <SERVICE_ROLE_KEY> with your actual values,
-- or store them via Vault (recommended for production).
SELECT cron.schedule(
  'check-alerts-hourly',
  '0 * * * *',
  $$
    SELECT net.http_post(
      url     := 'https://<PROJECT_REF>.supabase.co/functions/v1/check-alerts',
      headers := jsonb_build_object(
        'Content-Type',  'application/json',
        'Authorization', 'Bearer <SERVICE_ROLE_KEY>'
      ),
      body    := '{}'::jsonb
    );
  $$
);

-- Verify
SELECT jobid, jobname, schedule, command
FROM cron.job
WHERE jobname = 'check-alerts-hourly';
