-- Add email subscription settings to users table
ALTER TABLE t_p68014762_remove_login_system.users 
ADD COLUMN IF NOT EXISTS subscribed_to_updates boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS unsubscribe_token varchar(64) DEFAULT NULL;