-- Employee Status: a dynamic, admin-managed list of employment statuses
-- (Permanent, Elected, Casual, Contractual, etc.) used as the options for the
-- `users.employment_status` field during employee registration.

CREATE TABLE IF NOT EXISTS public.employee_status (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE,
    archived_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_employee_status_name
    ON public.employee_status(name);
CREATE INDEX IF NOT EXISTS idx_employee_status_archived_at
    ON public.employee_status(archived_at);

-- Keep updated_at fresh on every update (function defined in the base schema).
DROP TRIGGER IF EXISTS update_employee_status_updated_at ON public.employee_status;
CREATE TRIGGER update_employee_status_updated_at
    BEFORE UPDATE ON public.employee_status
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Row Level Security (mirrors leave_categories).
ALTER TABLE public.employee_status ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS all_employee_status ON public.employee_status;
CREATE POLICY all_employee_status ON public.employee_status
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS select_employee_status ON public.employee_status;
CREATE POLICY select_employee_status ON public.employee_status
    FOR SELECT
    TO authenticated
    USING (archived_at IS NULL);

-- Seed the known statuses (idempotent; "Contractual" was missing from the old
-- hardcoded list). Admins can add/edit/delete more at runtime.
INSERT INTO public.employee_status (name)
SELECT t.name
FROM (VALUES ('Permanent'), ('Elected'), ('Casual'), ('Contractual')) AS t(name)
WHERE NOT EXISTS (
    SELECT 1 FROM public.employee_status es WHERE es.name = t.name
);
