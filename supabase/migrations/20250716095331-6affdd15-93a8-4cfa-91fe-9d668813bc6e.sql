
-- Enable Row Level Security on the fmcg sample customer data table
ALTER TABLE public."fmcg sample customer data" ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow public read access to the customer data
-- This is appropriate for demo/sample data
CREATE POLICY "Allow public read access to customer data" 
ON public."fmcg sample customer data"
FOR SELECT
TO public
USING (true);
