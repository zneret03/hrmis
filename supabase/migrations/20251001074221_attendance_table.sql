
-- Enabling necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Attendance table for monthly attendance records
CREATE TABLE public.attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id TEXT REFERENCES users(employee_id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    month DATE NOT NULL,
    days_present INTEGER NOT NULL,
    days_absent INTEGER NOT NULL,
    tardiness_count INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE,
    archived_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT idx_unique_combination UNIQUE (employee_id, month)
);

-- Indexes for attendance table
CREATE INDEX idx_attendance_employee_id ON public.attendance(employee_id);
CREATE INDEX idx_attendance_user_id ON public.attendance(user_id);
CREATE INDEX idx_attendance_month ON public.attendance(month);
CREATE INDEX idx_attendance_days_absent ON public.attendance(days_absent);
-- CREATE INDEX idx_attendance_tardiness_count ON public.attendance(tardiness_count);
CREATE INDEX idx_attendance_archived_at ON public.attendance(archived_at);


ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;


-- Attendance table policies
CREATE POLICY admin_all_attendance ON public.attendance
    FOR ALL
    TO authenticated
    USING (
      ((( SELECT users_1.role
            FROM users users_1
            WHERE (users_1.id = auth.uid())) = 'admin'::text))
       AND archived_at IS NULL)
    WITH CHECK (
      ((( SELECT users_1.role
            FROM users users_1
            WHERE (users_1.id = auth.uid())) = 'admin'::text))
    );

CREATE POLICY employee_own_attendance ON public.attendance
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid() AND archived_at IS NULL);
