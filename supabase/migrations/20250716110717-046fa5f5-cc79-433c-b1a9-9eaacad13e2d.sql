
-- Enable Row Level Security on the fcmg sample product list table
ALTER TABLE "fcmg sample product list" ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow public read access (consistent with other data tables)
CREATE POLICY "Allow public read access to product list" 
  ON "fcmg sample product list" 
  FOR SELECT 
  USING (true);
