-- Employee Service Record: admin-managed service history entries per employee.
-- Employees can view their own; admins can add/edit/delete. (Distinct from the
-- existing service-record PDF certificate generator.)

CREATE TABLE IF NOT EXISTS public.service_record (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    position TEXT,
    status TEXT,
    salary TEXT,
    station TEXT,
    from_date DATE,
    to_date DATE,
    remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE,
    archived_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_service_record_user_id
    ON public.service_record(user_id);
CREATE INDEX IF NOT EXISTS idx_service_record_archived_at
    ON public.service_record(archived_at);

DROP TRIGGER IF EXISTS update_service_record_updated_at ON public.service_record;
CREATE TRIGGER update_service_record_updated_at
    BEFORE UPDATE ON public.service_record
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.service_record ENABLE ROW LEVEL SECURITY;

-- Admins manage every record; employees can read their own active records.
DROP POLICY IF EXISTS admin_all_service_record ON public.service_record;
CREATE POLICY admin_all_service_record ON public.service_record
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.users u
            WHERE u.id = auth.uid() AND u.role = 'admin'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users u
            WHERE u.id = auth.uid() AND u.role = 'admin'
        )
    );

DROP POLICY IF EXISTS own_select_service_record ON public.service_record;
CREATE POLICY own_select_service_record ON public.service_record
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid() AND archived_at IS NULL);
