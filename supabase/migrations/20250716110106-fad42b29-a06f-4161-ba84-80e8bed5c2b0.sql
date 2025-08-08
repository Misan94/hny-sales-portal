
-- Enable Row Level Security on the fmcg sample transaction data table
ALTER TABLE "fmcg sample transaction data" ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow public read access (consistent with customer data)
CREATE POLICY "Allow public read access to transaction data" 
  ON "fmcg sample transaction data" 
  FOR SELECT 
  USING (true);
