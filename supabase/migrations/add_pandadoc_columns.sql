ALTER TABLE proposal_progress
ADD COLUMN IF NOT EXISTS pandadoc_document_id TEXT,
ADD COLUMN IF NOT EXISTS pandadoc_status TEXT DEFAULT 'pending';
