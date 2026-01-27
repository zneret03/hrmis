-- Biometrics table for raw attendance logs
CREATE TABLE public.biometrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id TEXT REFERENCES users(employee_id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    type INTEGER NOT NULL CHECK (type IN (1, 2, 15)), -- 1=login, 2=logout, 15=manual login
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE,
    archived_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.biometrics ENABLE ROW LEVEL SECURITY;

-- Indexes for biometrics table
CREATE INDEX idx_biometrics_employee_id ON public.biometrics(employee_id);
CREATE INDEX idx_biometrics_timestamp ON public.biometrics(timestamp);
CREATE INDEX idx_biometrics_type ON public.biometrics(type);

CREATE TRIGGER update_biometrics_updated_at
    BEFORE UPDATE ON public.biometrics
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Biometrics table policies
CREATE POLICY admin_all_biometrics ON public.biometrics
    FOR ALL
    TO authenticated
    USING (
      ((( SELECT users_1.role
            FROM users users_1
            WHERE (users_1.id = auth.uid())) = 'admin'::text))
    )
    WITH CHECK (
      ((( SELECT users_1.role
            FROM users users_1
            WHERE (users_1.id = auth.uid())) = 'admin'::text))
    );


-- Trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE POLICY employee_own_biometrics ON public.biometrics
    FOR SELECT
    TO authenticated
    USING (employee_id IN (SELECT employee_id FROM public.users WHERE id = auth.uid()));
