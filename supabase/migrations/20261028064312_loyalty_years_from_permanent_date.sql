-- Loyalty: Years of Service count from the date the employee became PERMANENT,
-- not from their original appointment. An employee who started Casual in 1990
-- and became Permanent on 2010-06-07 has 16 years (as of 2026-10-28), not 36.
--
-- get_employee_years_of_service() is the single source of truth, used by both
-- the Loyalty Award Statistics chart (get_loyalty_award_statistics) and its
-- View/Export employee list (/api/protected/users/by-category?category=loyalty).
--
-- permanent_since = earliest From date of the employee's active service-record
--                   entries whose Status is "Permanent" (case/space-insensitive);
--                   fallback: date_of_original_appointment, only when there is
--                   no Permanent entry yet and users.employment_status is
--                   "Permanent".
-- Employees without a permanent_since (Elected, Casual, Contractual, ...), or
-- whose Permanent date is still in the future, are not counted.
CREATE OR REPLACE FUNCTION public.get_employee_years_of_service()
RETURNS TABLE (
    user_id UUID,
    permanent_since DATE,
    years_of_service INT
) AS $$
    WITH permanent_start AS (
        SELECT s.user_id, MIN(s.from_date) AS permanent_since
        FROM public.service_record s
        WHERE s.archived_at IS NULL
          AND s.from_date IS NOT NULL
          AND lower(btrim(s.status)) = 'permanent'
        GROUP BY s.user_id
    ),
    counted AS (
        SELECT
            u.id AS user_id,
            COALESCE(
                ps.permanent_since,
                CASE
                    WHEN lower(btrim(u.employment_status)) = 'permanent'
                        THEN u.date_of_original_appointment
                END
            ) AS permanent_since
        FROM public.users u
        LEFT JOIN permanent_start ps ON ps.user_id = u.id
        WHERE u.archived_at IS NULL
    )
    SELECT
        c.user_id,
        c.permanent_since,
        EXTRACT(YEAR FROM age(CURRENT_DATE, c.permanent_since))::int
            AS years_of_service
    FROM counted c
    WHERE c.permanent_since IS NOT NULL
      AND c.permanent_since <= CURRENT_DATE;
$$ LANGUAGE sql STABLE;

-- Runs with the caller's rights (SECURITY INVOKER), so service_record RLS still
-- applies to direct /rpc calls; the server uses the service role. EXECUTE is
-- deliberately not revoked: on the local supabase/postgres 17.6.1.106 image a
-- permission-denied function call crashes the backend (signal 11).

-- Same exact-milestone logic as before (see loyalty_exact_year_thresholds);
-- only the years-of-service source changes.
CREATE OR REPLACE FUNCTION get_loyalty_award_statistics()
RETURNS TABLE (
    years_of_service TEXT,
    no_of_employees BIGINT,
    percentage NUMERIC,
    total BIGINT
) AS $$
BEGIN
    RETURN QUERY
    WITH service_years AS (
        SELECT ys.years_of_service AS yos
        FROM public.get_employee_years_of_service() ys
    ),
    labeled AS (
        SELECT
            CASE
                WHEN t.year_threshold IS NOT NULL
                    THEN sy.yos || ' years loyalty award'
                ELSE 'Not eligible this year'
            END AS award_bracket,
            CASE
                WHEN t.year_threshold IS NOT NULL THEN sy.yos
                ELSE -1
            END AS sort_key
        FROM service_years sy
        LEFT JOIN public.employee_loyalty_threshold t
            ON t.year_threshold = sy.yos
            AND t.archived_at IS NULL
    )
    SELECT
        award_bracket AS years_of_service,
        COUNT(*)::BIGINT AS no_of_employees,
        ROUND((COUNT(*) * 100.0) / NULLIF(SUM(COUNT(*)) OVER(), 0), 2)
            AS percentage,
        SUM(COUNT(*)) OVER()::BIGINT AS total
    FROM labeled
    GROUP BY award_bracket, sort_key
    ORDER BY sort_key ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
