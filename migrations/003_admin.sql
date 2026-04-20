-- Add role column to user table for admin access
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'user';

-- Index for role lookups
CREATE INDEX IF NOT EXISTS idx_user_role ON "user"(role);
