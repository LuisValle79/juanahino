-- Script to update the schema - remove CASCADE constraints from notifications

-- Drop existing foreign key constraints
ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_vehiculo_id_fkey;
ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_quote_id_fkey;
ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_user_id_fkey;

-- Recreate foreign key constraints without CASCADE
ALTER TABLE notifications 
ADD CONSTRAINT notifications_vehiculo_id_fkey 
FOREIGN KEY (vehiculo_id) REFERENCES vehicles(id);

ALTER TABLE notifications 
ADD CONSTRAINT notifications_quote_id_fkey 
FOREIGN KEY (quote_id) REFERENCES quotes(id);

ALTER TABLE notifications 
ADD CONSTRAINT notifications_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES users(id);