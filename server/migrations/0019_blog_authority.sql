-- Migration: 0019 — Blog Authority & Expert References
-- Adds fields for expert credibility: reviewer tracking, content revision dates,
-- and structured references (legal citations, standards, news sources)

-- Track when content was last meaningfully revised (distinct from updated_at which fires on any field change)
ALTER TABLE posts ADD COLUMN last_updated_at TEXT;

-- Name of the lead engineer who reviewed the article
ALTER TABLE posts ADD COLUMN reviewed_by TEXT;

-- JSON array of reference objects: [{ title, url, type }]
-- type: 'law' | 'standard' | 'news' | 'vendor'
ALTER TABLE posts ADD COLUMN [references] TEXT NOT NULL DEFAULT '[]';
