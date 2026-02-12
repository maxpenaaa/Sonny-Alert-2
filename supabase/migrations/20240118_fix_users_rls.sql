-- Add RLS policy to allow authenticated users to insert/update their own row

-- Enable RLS if not already enabled
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Allow users to select their own row
DROP POLICY IF EXISTS "Users can view own row" ON public.users;
CREATE POLICY "Users can view own row"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

-- Allow users to insert their own row (for self-registration)
DROP POLICY IF EXISTS "Users can insert own row" ON public.users;
CREATE POLICY "Users can insert own row"
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Allow users to update their own row
DROP POLICY IF EXISTS "Users can update own row" ON public.users;
CREATE POLICY "Users can update own row"
  ON public.users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
