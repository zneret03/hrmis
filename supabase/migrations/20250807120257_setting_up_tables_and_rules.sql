-- Enabling necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table for authentication and basic user information, linked to auth.users
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    employee_id TEXT UNIQUE, -- New column for employee ID from .dat file
    username TEXT UNIQUE,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'employee', 'staff')),
    avatar TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE,
    archived_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for users table
CREATE INDEX idx_users_employee_id ON public.users(employee_id);
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_users_archived_at ON public.users(archived_at);

CREATE TABLE public.employee_loyalty_threshold (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    year_threshold INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Leave Categories table
CREATE TABLE public.leave_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE,
    archived_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for leave_categories table
CREATE INDEX idx_leave_categories_name ON public.leave_categories(name);
CREATE INDEX idx_leave_categories_archived_at ON public.leave_categories(archived_at);

-- Leave Applications table
CREATE TABLE public.leave_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    leave_id UUID REFERENCES leave_categories(id) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'disapproved' , 'cancelled')),
    remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE,
    archived_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for leave_applications table
CREATE INDEX idx_leave_applications_user_id ON public.leave_applications(user_id);
CREATE INDEX idx_leave_applications_leave_id ON public.leave_applications(leave_id);
CREATE INDEX idx_leave_applications_status ON public.leave_applications(status);
CREATE INDEX idx_leave_applications_start_date ON public.leave_applications(start_date);
CREATE INDEX idx_leave_applications_end_date ON public.leave_applications(end_date);
CREATE INDEX idx_leave_applications_archived_at ON public.leave_applications(archived_at);

-- Certificates table for storing generated certificate data
CREATE TABLE public.certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    reason TEXT NOT NULL,
    certificate_type TEXT NOT NULL CHECK (certificate_type IN ('coe', 'service_record', 'nosa', 'coec')),
    data JSONB,
    certificate_status TEXT NOT NULL CHECK (certificate_status IN('pending', 'approved', 'cancelled', 'disapproved')),
    file TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE,
    archived_at TIMESTAMP WITH TIME ZONE
);


INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('certificates', 'certificates', TRUE, 5242880); -- 5MB limit

CREATE POLICY "Upload Select certificates documents" ON storage.objects
    FOR SELECT TO public USING (bucket_id = 'certificates');
CREATE POLICY "Upload Insert certificates documents" ON storage.objects
    FOR INSERT TO public WITH CHECK (bucket_id = 'certificates');
CREATE POLICY "Upload Update certificates documents" ON storage.objects
    FOR UPDATE TO public USING (bucket_id = 'certificates');
CREATE POLICY "Upload Delete certificates documents" ON storage.objects
    FOR DELETE TO public USING (bucket_id = 'certificates');

-- Indexes for certificates table
CREATE INDEX idx_certificates_user_id ON public.certificates(user_id);
CREATE INDEX idx_certificates_certificate_type ON public.certificates(certificate_type);
CREATE INDEX idx_certificates_archived_at ON public.certificates(archived_at);
CREATE INDEX idx_certificates_data ON public.certificates USING GIN (data);

-- Storage bucket for avatars
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('avatars', 'avatars', TRUE, 5242880); -- 5MB limit

CREATE POLICY "Upload Select avatars" ON storage.objects
    FOR SELECT TO public USING (bucket_id = 'avatars');
CREATE POLICY "Upload Insert avatars" ON storage.objects
    FOR INSERT TO public WITH CHECK (bucket_id = 'avatars');
CREATE POLICY "Upload Update avatars" ON storage.objects
    FOR UPDATE TO public USING (bucket_id = 'avatars');
CREATE POLICY "Upload Delete avatars" ON storage.objects
    FOR DELETE TO public USING (bucket_id = 'avatars');


-- Trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for each table
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_leave_categories_updated_at
    BEFORE UPDATE ON public.leave_categories
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_leave_applications_updated_at
    BEFORE UPDATE ON public.leave_applications
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_certificates_updated_at
    BEFORE UPDATE ON public.certificates
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_employee_loyalty_threshold_updated_at
    BEFORE UPDATE ON public.employee_loyalty_threshold
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Row-Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_loyalty_threshold ENABLE ROW LEVEL SECURITY;

CREATE POLICY admin_all_employee_loyalty_threshold ON public.employee_loyalty_threshold
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

-- Users table policies
CREATE POLICY admin_all_users ON public.users
    FOR ALL
    TO authenticated
    USING (role = 'admin')
    WITH CHECK (role = 'admin');

CREATE POLICY insert_users ON public.users
    FOR INSERT
    TO authenticated
    WITH CHECK (role = 'admin');

CREATE POLICY employee_own_account ON public.users
    FOR SELECT
    TO authenticated
    USING (id = auth.uid() AND archived_at IS NULL);

CREATE POLICY update_employee_account ON public.users
    FOR UPDATE
    TO authenticated
    USING (id = auth.uid() AND archived_at IS NULL OR role = 'admin')
    WITH CHECK (id = auth.uid() OR role = 'admin');


CREATE POLICY employe_policies ON public.users
    FOR ALL
    TO authenticated
    USING (role = 'employee')
    WITH CHECK (role = 'employee');

CREATE POLICY staff_manage_users ON public.users
    FOR ALL
    TO authenticated
    USING (id = auth.uid() OR role = 'staff')
    WITH CHECK (id = auth.uid() OR role = 'staff');


-- Leave Categories table policies
CREATE POLICY all_leave_categories ON public.leave_categories
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY select_leave_categories ON public.leave_categories
    FOR SELECT
    TO authenticated
    USING (archived_at IS NULL);

CREATE POLICY insert_leave_categories ON public.leave_categories
    FOR INSERT
    TO authenticated
    WITH CHECK (archived_at IS NULL);

CREATE POLICY update_leave_categories ON public.leave_categories
    FOR UPDATE
    TO authenticated
    USING (archived_at IS NULL);

-- Leave Applications table policies
CREATE POLICY admin_all_leave_applications ON public.leave_applications
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

CREATE POLICY employee_own_leave_applications ON public.leave_applications
    FOR ALL
    TO authenticated
    USING (user_id = auth.uid() AND archived_at IS NULL)
    WITH CHECK (user_id = auth.uid());

-- Certificates table policies
CREATE POLICY admin_all_certificates ON public.certificates
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


CREATE POLICY employee_all_certificates ON public.certificates
    FOR ALL
    TO authenticated
    USING (
     archived_at IS NULL AND user_id = auth.uid()
  )
    WITH CHECK (
     archived_at IS NULL AND user_id = auth.uid()
    );


CREATE POLICY employee_own_certificates ON public.certificates
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid() AND archived_at IS NULL);

CREATE POLICY insert_employee_own_certificates ON public.certificates
    FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid() AND archived_at IS NULL);

CREATE POLICY update_employee_own_certificates ON public.certificates
    FOR UPDATE
    TO authenticated
    WITH CHECK (user_id = auth.uid() AND archived_at IS NULL);

