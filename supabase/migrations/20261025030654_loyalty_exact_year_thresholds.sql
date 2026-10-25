-- Loyalty awards: award ONLY on exact milestone years (per the Reporting spec:
-- "if 11 years, none; if 14, none"). Milestones are driven by the
-- employee_loyalty_threshold table, so they stay configurable.

-- Make the threshold table manageable like the other admin lists: add a
-- soft-delete column (paginatedData and the CRUD page rely on it) and keep
-- updated_at fresh on edits.
ALTER TABLE public.employee_loyalty_threshold
    ADD COLUMN IF NOT EXISTS archived_at TIMESTAMP WITH TIME ZONE;

CREATE INDEX IF NOT EXISTS idx_employee_loyalty_threshold_archived_at
    ON public.employee_loyalty_threshold(archived_at);

DROP TRIGGER IF EXISTS update_employee_loyalty_threshold_updated_at
    ON public.employee_loyalty_threshold;
CREATE TRIGGER update_employee_loyalty_threshold_updated_at
    BEFORE UPDATE ON public.employee_loyalty_threshold
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Keep the existing 5-year threshold and add the missing 40-year one.
INSERT INTO public.employee_loyalty_threshold (year_threshold)
SELECT t.year_threshold
FROM (VALUES (40)) AS t(year_threshold)
WHERE NOT EXISTS (
    SELECT 1 FROM public.employee_loyalty_threshold e
    WHERE e.year_threshold = t.year_threshold
);

-- Replace the range-based logic (BETWEEN 10 AND 14 -> "10 years", capped at
-- "35+") with exact-match logic joined to the threshold table. An employee is
-- credited for a loyalty award only in the exact year their years-of-service
-- equals a configured threshold; everyone else is "Not eligible this year".
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
        SELECT
            EXTRACT(
                YEAR FROM age(CURRENT_DATE, u.date_of_original_appointment)
            )::int AS yos
        FROM public.users u
        WHERE u.date_of_original_appointment IS NOT NULL
          AND u.archived_at IS NULL
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
