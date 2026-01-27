-- Awards table for storing employee awards
CREATE TABLE public.awards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title TEXT,
    description TEXT,
    award_type TEXT NOT NULL CHECK(award_type IN('perfect_attendance', 'lowest_absent', 'lowest_tardy', 'loyalty_award')),
    year INTEGER NOT NULL,
    read TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE,
    archived_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for awards table
CREATE INDEX idx_awards_user_id ON public.awards(user_id);
CREATE INDEX idx_awards_year ON public.awards(year);
CREATE INDEX idx_awards_archived_at ON public.awards(archived_at);


ALTER TABLE public.awards ENABLE ROW LEVEL SECURITY;


CREATE TRIGGER update_awards_updated_at
    BEFORE UPDATE ON public.awards
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to generate yearly awards
CREATE OR REPLACE FUNCTION public.generate_yearly_awards(p_year INTEGER)
RETURNS VOID AS $$
BEGIN
    INSERT INTO public.awards (user_id, award_type, year, created_at)
    SELECT 
        a.user_id,
        'Perfect Attendance' AS award_type,
        p_year AS year,
        CURRENT_TIMESTAMP
    FROM public.attendance a
    WHERE EXTRACT(YEAR FROM a.month) = p_year
    AND a.days_absent = 0
    -- AND a.tardiness_count = 0
    AND a.archived_at IS NULL
    GROUP BY a.user_id
    HAVING COUNT(*) = 12;
END;
$$ language plpgsql;

-- Awards table policies
CREATE POLICY admin_all_awards ON public.awards
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

CREATE POLICY employee_update_awards ON public.awards
    FOR UPDATE
    TO authenticated
    USING (
      user_id = auth.uid() AND archived_at IS NULL
    )
    WITH CHECK (
      user_id = auth.uid() AND archived_at IS NULL
    );

CREATE POLICY employee_own_awards ON public.awards
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid() AND archived_at IS NULL);

CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;

CREATE OR REPLACE FUNCTION public.calculate_year_end_awards(award_year INTEGER)
RETURNS VOID AS $$
DECLARE
    loyalty_threshold INTEGER;
BEGIN
    -- Fetch the most recent loyalty year threshold from the configuration table.
    SELECT year_threshold INTO loyalty_threshold
    FROM public.employee_loyalty_threshold
    ORDER BY created_at DESC
    LIMIT 1;

    IF loyalty_threshold IS NULL THEN
        RAISE NOTICE 'No loyalty year threshold found. Skipping loyalty awards.';
    END IF;

    DELETE FROM public.awards WHERE year = award_year;

    CREATE TEMP TABLE yearly_attendance_summary ON COMMIT DROP AS
    SELECT
        u.id AS user_id,
        u.employee_id,
        COALESCE(SUM(a.days_present), 0) AS total_present,
        COALESCE(SUM(a.days_absent), 0) AS total_absent,
        COALESCE(SUM(a.tardiness_count), 0) AS total_tardy
    FROM
        public.users u
    LEFT JOIN
        public.attendance a ON u.id = a.user_id AND EXTRACT(YEAR FROM a.month) = award_year
    WHERE
        u.role IN ('employee', 'staff')
    GROUP BY
        u.id, u.employee_id;

    -- Award 1: Perfect Attendance
    INSERT INTO public.awards (user_id, award_type, year, title, description)
    SELECT user_id, 'perfect_attendance', award_year, 'Perfect Attendance of the year', 'Please claim your prize/certificate with your supervisor/manager, thank you for your service'
    FROM yearly_attendance_summary
    WHERE total_absent = 0 AND total_tardy = 0;

    -- Award 2: Lowest Absent
    WITH min_absent AS (
        SELECT MIN(total_absent) AS min_val FROM yearly_attendance_summary WHERE total_absent > 0
    )
    INSERT INTO public.awards (user_id, award_type, year, title, description)
    SELECT yas.user_id, 'lowest_absent', award_year, 'Lowest Absent of the year', 'Please claim your prize/certificate with your supervisor/manager, thank you for your service'
    FROM yearly_attendance_summary yas, min_absent
    WHERE yas.total_absent = min_absent.min_val;

    -- Award 3: Lowest Tardy
    WITH min_tardy AS (
        SELECT MIN(total_tardy) AS min_val FROM yearly_attendance_summary WHERE total_tardy > 0
    )
    INSERT INTO public.awards (user_id, award_type, year, title, description)
    SELECT yas.user_id, 'lowest_tardy', award_year, 'Lowest Late of the year', 'Please claim your prize/certificate with your supervisor/manager, thank you for your service'
    FROM yearly_attendance_summary yas, min_tardy
    WHERE yas.total_tardy = min_tardy.min_val;

    -- Award 4: Loyalty Award (only if a threshold was found)
    IF loyalty_threshold IS NOT NULL THEN
        INSERT INTO public.awards (user_id, award_type, year, title, description)
        SELECT id, 'loyalty_award', award_year, 'Loyalty Award of the year', 'Please claim your prize/certificate with your supervisor/manager, thank you for your service'
        FROM public.users
        WHERE DATE_PART('year', AGE(TO_DATE(award_year || '-12-31', 'YYYY-MM-DD'), created_at)) >= loyalty_threshold;
    END IF;

END;
$$ LANGUAGE plpgsql;

GRANT USAGE ON SCHEMA cron TO postgres;
GRANT EXECUTE ON FUNCTION public.calculate_year_end_awards(INTEGER) TO postgres;
GRANT EXECUTE ON FUNCTION public.update_credits_for_latest_month() TO postgres;

DO $$
BEGIN
    -- Safely unschedule the job if it exists
    IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'yearly-award-calculation') THEN
        PERFORM cron.unschedule('yearly-award-calculation');
    END IF;

    -- Schedule new job
    PERFORM cron.schedule(
        'yearly-award-calculation',
        '0 0 1 1 *', -- Runs at 00:00 on January 1st
        'SELECT public.calculate_year_end_awards(EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER - 1)'
    );
END;
$$;
