ALTER TABLE proposal_progress
ADD COLUMN IF NOT EXISTS veriff_session_id TEXT,
ADD COLUMN IF NOT EXISTS veriff_status TEXT DEFAULT 'pending';
