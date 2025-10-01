
-- Leave Credits table
CREATE TABLE public.leave_credits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    credits INTEGER NOT NULL DEFAULT 0,
    max_credits INTEGER NOT NULL DEFAULT 10,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE,
    archived_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT idx_unique_ids UNIQUE (user_id)
);

ALTER TABLE public.leave_credits ENABLE ROW LEVEL SECURITY;

-- Indexes for leave_credits table
CREATE UNIQUE INDEX idx_leave_credits_user_id ON public.leave_credits(user_id);
CREATE INDEX idx_leave_credits_archived_at ON public.leave_credits(archived_at);

-- Trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_leave_credits_updated_at
    BEFORE UPDATE ON public.leave_credits
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


CREATE POLICY staff_all_leave_credits ON public.leave_credits
    FOR ALL
    TO authenticated
    USING (
      ((( SELECT users_1.role
            FROM users users_1
            WHERE (users_1.id = auth.uid())) = 'staff'::text))
      AND archived_at IS NULL)
    WITH CHECK(
      ((( SELECT users_1.role
            FROM users users_1
            WHERE (users_1.id = auth.uid())) = 'staff'::text))
      AND archived_at IS NULL
    );
    

-- Leave Credits table policies
CREATE POLICY admin_all_leave_credits ON public.leave_credits
    FOR SELECT
    TO authenticated
    USING (
      ((( SELECT users_1.role
            FROM users users_1
            WHERE (users_1.id = auth.uid())) = 'admin'::text))
      AND archived_at IS NULL);

CREATE POLICY insert_leave_credits ON public.leave_credits
    FOR INSERT
    TO authenticated
    WITH CHECK (
        ((user_id = auth.uid()) OR (( SELECT users_1.role
         FROM users users_1
        WHERE (users_1.id = auth.uid())) = 'admin'::text))
    );

CREATE POLICY update_leave_credits ON public.leave_credits
    FOR UPDATE
    TO authenticated
    USING (
      true
    );

CREATE POLICY employee_own_leave_credits ON public.leave_credits
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid() AND archived_at IS NULL);

CREATE OR REPLACE FUNCTION decrement_update_credits(p_user_id UUID, count_dates INTEGER)
RETURNS VOID AS $$
DECLARE
  current_credits INTEGER;
BEGIN
  SELECT credits INTO current_credits FROM leave_credits WHERE user_id = p_user_id;

  IF count_dates > current_credits THEN
    RAISE EXCEPTION 'Not enough leave credits, try again';
  END IF;

  IF current_credits = 0 THEN
    RAISE EXCEPTION 'User no longer have leave credits left';
  END IF;

  UPDATE leave_credits 
  SET credits = leave_credits.credits - count_dates
  WHERE leave_credits.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION increment_update_credits(p_user_id UUID, count_dates INTEGER)
RETURNS VOID AS $$
DECLARE
  current_credits INTEGER;
BEGIN
  SELECT credits INTO current_credits FROM leave_credits WHERE user_id = p_user_id;

  IF current_credits = 10 THEN
    RAISE EXCEPTION 'Your leave credits is already full';
  END IF;

  UPDATE leave_credits 
  SET credits = leave_credits.credits + count_dates
  WHERE leave_credits.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


CREATE OR REPLACE FUNCTION public.update_credits_for_latest_month()
RETURNS TEXT AS $$
DECLARE
    v_latest_month DATE;
    updated_count INTEGER;
BEGIN
    SELECT DATE_TRUNC('month', MAX(month))
    INTO v_latest_month
    FROM public.attendance;

    IF v_latest_month IS NOT NULL THEN
        UPDATE public.leave_credits AS lc
        SET
            credits = lc.credits + 3,
            max_credits = lc.max_credits + 3,
            updated_at = CURRENT_TIMESTAMP
        FROM
            public.attendance AS a
        WHERE
            lc.user_id = a.user_id
            AND a.days_absent = 0
            AND DATE_TRUNC('month', a.month) = v_latest_month;

        GET DIAGNOSTICS updated_count = ROW_COUNT;

        RETURN 'Processing complete for ' || TO_CHAR(v_latest_month, 'FMMonth YYYY') || '. Updated credits for ' || updated_count || ' users.';
    ELSE
        RETURN 'No attendance records found. Nothing to process.';
    END IF;
END;
$$ LANGUAGE plpgsql;


CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;

GRANT USAGE ON SCHEMA cron TO postgres;
GRANT EXECUTE ON FUNCTION public.update_credits_for_latest_month() TO postgres;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'update-credits-for-latest-month') THEN
        PERFORM cron.unschedule('update-credits-for-latest-month');
    END IF;

    PERFORM cron.schedule(
        'update-credits-for-latest-month',
        '59 15 1 * *', 
        'SELECT public.update_credits_for_latest_month()'
    );
END;
$$;
