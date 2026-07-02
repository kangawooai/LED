-- =============================================================================
-- Leads Everyday CRM — Supabase Schema Migration
-- =============================================================================
-- Run this file in the Supabase SQL Editor to create all tables.
-- Safe to re-run: uses IF NOT EXISTS and CREATE OR REPLACE throughout.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 0. Trigger function: auto-update `updated_at` on row modification
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ---------------------------------------------------------------------------
-- 1. profiles — extends auth.users with company info, address, etc.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  first_name TEXT NOT NULL DEFAULT '',
  last_name TEXT NOT NULL DEFAULT '',
  company_name TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  is_admin BOOLEAN NOT NULL DEFAULT FALSE,
  address_line_1 TEXT,
  address_line_2 TEXT,
  city TEXT,
  county TEXT,
  postcode TEXT,
  country TEXT DEFAULT 'GB',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can view own profile') THEN
    CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can insert own profile') THEN
    CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can update own profile') THEN
    CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
  END IF;
END $$;

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ---------------------------------------------------------------------------
-- 2. campaigns — unified proposals + campaigns (stage: 'proposal' | 'campaign')
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stage TEXT NOT NULL DEFAULT 'proposal' CHECK (stage IN ('proposal', 'campaign')),
  name TEXT NOT NULL,
  description TEXT,
  service TEXT NOT NULL,
  target_area TEXT NOT NULL,
  customers_required INTEGER NOT NULL DEFAULT 20,
  monthly_fee NUMERIC NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'GBP',
  billing_day INTEGER NOT NULL DEFAULT 1,

  -- Proposal fields
  proposal_status TEXT CHECK (proposal_status IN ('pending', 'accepted', 'expired')),
  setup_fee NUMERIC,
  expires_at TIMESTAMPTZ,

  -- Campaign fields
  campaign_status TEXT CHECK (campaign_status IN ('active', 'paused')),
  current_spend NUMERIC DEFAULT 0,
  budget_limit NUMERIC,
  total_leads INTEGER DEFAULT 0,
  total_jobs_won INTEGER DEFAULT 0,
  start_date TIMESTAMPTZ,
  current_period_start TIMESTAMPTZ,
  next_billing_date TIMESTAMPTZ,

  -- Period billing
  billing_anchor_date TIMESTAMPTZ,
  billing_day_rule TEXT DEFAULT 'exact' CHECK (billing_day_rule IN ('exact', 'last_day_of_month')),
  last_paid_period TEXT,
  next_due_period TEXT,
  next_due_date TIMESTAMPTZ,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'campaigns' AND policyname = 'Users can view own campaigns') THEN
    CREATE POLICY "Users can view own campaigns" ON campaigns FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'campaigns' AND policyname = 'Users can insert own campaigns') THEN
    CREATE POLICY "Users can insert own campaigns" ON campaigns FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'campaigns' AND policyname = 'Users can update own campaigns') THEN
    CREATE POLICY "Users can update own campaigns" ON campaigns FOR UPDATE USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'campaigns' AND policyname = 'Users can delete own campaigns') THEN
    CREATE POLICY "Users can delete own campaigns" ON campaigns FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_campaigns_user_id ON campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_stage ON campaigns(stage);

DROP TRIGGER IF EXISTS update_campaigns_updated_at ON campaigns;
CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON campaigns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ---------------------------------------------------------------------------
-- 3. customers — unified leads + jobs (stage: 'lead' | 'job')
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
  campaign_name TEXT,
  stage TEXT NOT NULL DEFAULT 'lead' CHECK (stage IN ('lead', 'job')),
  first_name TEXT NOT NULL DEFAULT '',
  last_name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  company_name TEXT,
  value NUMERIC,
  currency TEXT NOT NULL DEFAULT 'GBP',
  address_street TEXT,
  address_city TEXT,
  address_postcode TEXT,

  -- Lead fields
  type TEXT CHECK (type IN ('call', 'text')),
  lead_status TEXT DEFAULT 'new' CHECK (lead_status IN ('new', 'contacted', 'qualified', 'converted', 'lost')),
  lead_source TEXT,
  ai_summary TEXT,
  lost_reason TEXT,
  visit_date DATE,
  visit_time TIME,
  visit_duration INTEGER,

  -- Job fields
  job_status TEXT CHECK (job_status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  title TEXT,
  description TEXT,
  scheduled_date DATE,
  scheduled_time TIME,
  scheduled_duration INTEGER,
  calendar_event_id TEXT,
  completed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  cancelled_reason TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'customers' AND policyname = 'Users can view own customers') THEN
    CREATE POLICY "Users can view own customers" ON customers FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'customers' AND policyname = 'Users can insert own customers') THEN
    CREATE POLICY "Users can insert own customers" ON customers FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'customers' AND policyname = 'Users can update own customers') THEN
    CREATE POLICY "Users can update own customers" ON customers FOR UPDATE USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'customers' AND policyname = 'Users can delete own customers') THEN
    CREATE POLICY "Users can delete own customers" ON customers FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_customers_user_id ON customers(user_id);
CREATE INDEX IF NOT EXISTS idx_customers_stage ON customers(stage);
CREATE INDEX IF NOT EXISTS idx_customers_campaign_id ON customers(campaign_id);

DROP TRIGGER IF EXISTS update_customers_updated_at ON customers;
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ---------------------------------------------------------------------------
-- 4. customer_notes — text and voice notes attached to customers
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS customer_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_voice_note BOOLEAN NOT NULL DEFAULT FALSE,
  audio_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE customer_notes ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'customer_notes' AND policyname = 'Users can view notes on own customers') THEN
    CREATE POLICY "Users can view notes on own customers" ON customer_notes FOR SELECT
      USING (EXISTS (SELECT 1 FROM customers WHERE customers.id = customer_notes.customer_id AND customers.user_id = auth.uid()));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'customer_notes' AND policyname = 'Users can insert notes on own customers') THEN
    CREATE POLICY "Users can insert notes on own customers" ON customer_notes FOR INSERT
      WITH CHECK (EXISTS (SELECT 1 FROM customers WHERE customers.id = customer_notes.customer_id AND customers.user_id = auth.uid()));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'customer_notes' AND policyname = 'Users can delete notes on own customers') THEN
    CREATE POLICY "Users can delete notes on own customers" ON customer_notes FOR DELETE
      USING (EXISTS (SELECT 1 FROM customers WHERE customers.id = customer_notes.customer_id AND customers.user_id = auth.uid()));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_customer_notes_customer_id ON customer_notes(customer_id);

-- ---------------------------------------------------------------------------
-- 5. customer_communications — call / email / text records
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS customer_communications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('call', 'email', 'text')),
  direction TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  summary TEXT,
  transcript TEXT,
  duration INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE customer_communications ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'customer_communications' AND policyname = 'Users can view comms on own customers') THEN
    CREATE POLICY "Users can view comms on own customers" ON customer_communications FOR SELECT
      USING (EXISTS (SELECT 1 FROM customers WHERE customers.id = customer_communications.customer_id AND customers.user_id = auth.uid()));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'customer_communications' AND policyname = 'Users can insert comms on own customers') THEN
    CREATE POLICY "Users can insert comms on own customers" ON customer_communications FOR INSERT
      WITH CHECK (EXISTS (SELECT 1 FROM customers WHERE customers.id = customer_communications.customer_id AND customers.user_id = auth.uid()));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_customer_comms_customer_id ON customer_communications(customer_id);

-- ---------------------------------------------------------------------------
-- 6. customer_change_logs — audit trail with revert support
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS customer_change_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  field_name TEXT NOT NULL,
  old_value TEXT,
  new_value TEXT,
  change_type TEXT NOT NULL DEFAULT 'update',
  reverted_at TIMESTAMPTZ,
  reverted_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE customer_change_logs ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'customer_change_logs' AND policyname = 'Users can view own change logs') THEN
    CREATE POLICY "Users can view own change logs" ON customer_change_logs FOR SELECT
      USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'customer_change_logs' AND policyname = 'Users can insert own change logs') THEN
    CREATE POLICY "Users can insert own change logs" ON customer_change_logs FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'customer_change_logs' AND policyname = 'Users can update own change logs') THEN
    CREATE POLICY "Users can update own change logs" ON customer_change_logs FOR UPDATE
      USING (auth.uid() = user_id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_change_logs_customer_id ON customer_change_logs(customer_id);

-- ---------------------------------------------------------------------------
-- 7. account_settings — notifications, calendar, currency, work schedule
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS account_settings (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  notify_new_leads BOOLEAN NOT NULL DEFAULT TRUE,
  notify_new_proposals BOOLEAN NOT NULL DEFAULT TRUE,
  sync_jobs_to_calendar BOOLEAN NOT NULL DEFAULT FALSE,
  sync_lead_visits_to_calendar BOOLEAN NOT NULL DEFAULT FALSE,
  selected_calendar_id TEXT,
  reminder_minutes_before INTEGER NOT NULL DEFAULT 15,
  ical_feed_token TEXT UNIQUE,
  currency TEXT NOT NULL DEFAULT 'GBP',
  work_schedule JSONB DEFAULT '{"1":{"startTime":"09:00","endTime":"17:00"},"2":{"startTime":"09:00","endTime":"17:00"},"3":{"startTime":"09:00","endTime":"17:00"},"4":{"startTime":"09:00","endTime":"17:00"},"5":{"startTime":"09:00","endTime":"17:00"}}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE account_settings ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'account_settings' AND policyname = 'Users can view own settings') THEN
    CREATE POLICY "Users can view own settings" ON account_settings FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'account_settings' AND policyname = 'Users can insert own settings') THEN
    CREATE POLICY "Users can insert own settings" ON account_settings FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'account_settings' AND policyname = 'Users can update own settings') THEN
    CREATE POLICY "Users can update own settings" ON account_settings FOR UPDATE USING (auth.uid() = user_id);
  END IF;
END $$;

DROP TRIGGER IF EXISTS update_account_settings_updated_at ON account_settings;
CREATE TRIGGER update_account_settings_updated_at BEFORE UPDATE ON account_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ---------------------------------------------------------------------------
-- 8. billing_info — Stripe customer and subscription data
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS billing_info (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  status TEXT NOT NULL DEFAULT 'none' CHECK (status IN ('active', 'past_due', 'cancelled', 'none')),
  current_plan TEXT,
  next_billing_date TIMESTAMPTZ,
  amount NUMERIC,
  currency TEXT NOT NULL DEFAULT 'GBP',
  payment_method_last4 TEXT,
  payment_method_brand TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE billing_info ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'billing_info' AND policyname = 'Users can view own billing') THEN
    CREATE POLICY "Users can view own billing" ON billing_info FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'billing_info' AND policyname = 'Users can insert own billing') THEN
    CREATE POLICY "Users can insert own billing" ON billing_info FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'billing_info' AND policyname = 'Users can update own billing') THEN
    CREATE POLICY "Users can update own billing" ON billing_info FOR UPDATE USING (auth.uid() = user_id);
  END IF;
END $$;

DROP TRIGGER IF EXISTS update_billing_info_updated_at ON billing_info;
CREATE TRIGGER update_billing_info_updated_at BEFORE UPDATE ON billing_info
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ---------------------------------------------------------------------------
-- 9. google_calendar_tokens — OAuth tokens (server-side only, NO RLS)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS google_calendar_tokens (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  token_expiry TIMESTAMPTZ NOT NULL,
  calendar_id TEXT NOT NULL DEFAULT 'primary',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- No RLS on google_calendar_tokens — accessed only via service role from server-side code.

DROP TRIGGER IF EXISTS update_google_tokens_updated_at ON google_calendar_tokens;
CREATE TRIGGER update_google_tokens_updated_at BEFORE UPDATE ON google_calendar_tokens
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
