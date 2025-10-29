-- Add password reset fields to users table
ALTER TABLE t_p68014762_remove_login_system.users 
ADD COLUMN IF NOT EXISTS reset_token varchar(64) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS reset_token_expires timestamp without time zone DEFAULT NULL;