-- Personal Data Sheet (PDS) table based on CSC Form 212 Revised 2017
CREATE TABLE public.pds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    personal_information JSONB,
    family_background JSONB,
    educational_background JSONB,
    civil_service_eligibility JSONB,
    work_experience JSONB,
    voluntary_work JSONB,
    training_programs JSONB,
    other_information JSONB,
    other_static_data JSONB,
    pds_references JSONB,
    file TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE,
    archived_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.pds ENABLE ROW LEVEL SECURITY;

-- Indexes for pds table
CREATE INDEX idx_pds_user_id ON public.pds(user_id);
CREATE INDEX idx_pds_archived_at ON public.pds(archived_at);
CREATE INDEX idx_pds_personal_information ON public.pds USING GIN (personal_information);


INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('pds_documents', 'pds_documents', TRUE, 5242880); -- 5MB limit

CREATE POLICY "Upload Select pds documents" ON storage.objects
    FOR SELECT TO public USING (bucket_id = 'pds_documents');
CREATE POLICY "Upload Insert pds documents" ON storage.objects
    FOR INSERT TO public WITH CHECK (bucket_id = 'pds_documents');
CREATE POLICY "Upload Update pds documents" ON storage.objects
    FOR UPDATE TO public USING (bucket_id = 'pds_documents');
CREATE POLICY "Upload Delete pds documents" ON storage.objects
    FOR DELETE TO public USING (bucket_id = 'pds_documents');

-- Trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_pds_updated_at
    BEFORE UPDATE ON public.pds
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- PDS table policies
CREATE POLICY admin_all_pds ON public.pds
    FOR ALL
    TO authenticated
    USING (
      ((( SELECT users_1.role
            FROM users users_1
            WHERE (users_1.id = auth.uid())) = 'admin'::text)) AND archived_at IS NULL)
    WITH CHECK (
      ((( SELECT users_1.role
            FROM users users_1
            WHERE (users_1.id = auth.uid())) = 'admin'::text))
    );

CREATE POLICY insert_employee_pds ON public.pds
    FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid() AND archived_at IS NULL);

CREATE POLICY update_employee_own_pds ON public.pds
    FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid() AND archived_at IS NULL OR 
      ((( SELECT users_1.role
            FROM users users_1
            WHERE (users_1.id = auth.uid())) = 'admin'::text))
    )
    WITH CHECK (user_id = auth.uid() OR 
      ((( SELECT users_1.role
            FROM users users_1
            WHERE (users_1.id = auth.uid())) = 'admin'::text))
    );

CREATE POLICY employee_own_pds ON public.pds
    FOR ALL
    TO authenticated
    USING (user_id = auth.uid() AND archived_at IS NULL)
    WITH CHECK (user_id = auth.uid());
