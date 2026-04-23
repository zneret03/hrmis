CREATE OR REPLACE FUNCTION get_employment_status_statistics()
RETURNS TABLE (
    employment_status TEXT,
    no_of_employees BIGINT,
    percentage NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        u.employment_status,
        COUNT(u.id)::BIGINT AS no_of_employees,
        ROUND((COUNT(u.id) * 100.0) / NULLIF(SUM(COUNT(u.id)) OVER(), 0), 2) AS percentage
    FROM
        public.users u
    WHERE
        u.employment_status IS NOT NULL
        AND u.archived_at IS NULL
    GROUP BY
        u.employment_status
    ORDER BY
        u.employment_status ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
