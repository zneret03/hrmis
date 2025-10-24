
CREATE TABLE public.document_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    file TEXT NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE,
    archived_at TIMESTAMP WITH TIME ZONE
);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_document_templates_updated_at
    BEFORE UPDATE ON public.employee_loyalty_threshold
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.document_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY admin_all_document_templates ON public.document_templates
    FOR ALL
    TO authenticated
    USING (
      ((( SELECT users_1.role
            FROM users users_1
            WHERE (users_1.id = auth.uid())) = 'admin'::text)))
    WITH CHECK (
      ((( SELECT users_1.role
            FROM users users_1
            WHERE (users_1.id = auth.uid())) = 'admin'::text))
    );

