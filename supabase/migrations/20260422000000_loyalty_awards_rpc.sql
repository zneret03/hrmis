CREATE OR REPLACE FUNCTION get_loyalty_award_statistics()
RETURNS TABLE (
    years_of_service TEXT,
    no_of_employees BIGINT,
    percentage NUMERIC,
    total BIGINT
) AS $$
BEGIN
    RETURN QUERY
    WITH ServiceYears AS (
        SELECT
            CASE
                WHEN EXTRACT(YEAR FROM age(CURRENT_DATE, u.date_of_original_appointment)) BETWEEN 10 AND 14 THEN '10 years loyalty award'
                WHEN EXTRACT(YEAR FROM age(CURRENT_DATE, u.date_of_original_appointment)) BETWEEN 15 AND 19 THEN '15 years loyalty award'
                WHEN EXTRACT(YEAR FROM age(CURRENT_DATE, u.date_of_original_appointment)) BETWEEN 20 AND 24 THEN '20 years loyalty award'
                WHEN EXTRACT(YEAR FROM age(CURRENT_DATE, u.date_of_original_appointment)) BETWEEN 25 AND 29 THEN '25 years loyalty award'
                WHEN EXTRACT(YEAR FROM age(CURRENT_DATE, u.date_of_original_appointment)) BETWEEN 30 AND 34 THEN '30 years loyalty award'
                WHEN EXTRACT(YEAR FROM age(CURRENT_DATE, u.date_of_original_appointment)) >= 35 THEN '35+ years loyalty award'
                ELSE 'Not eligible yet (< 10 years)'
            END AS award_bracket
        FROM
            public.users u
        WHERE
            u.date_of_original_appointment IS NOT NULL
            AND u.archived_at IS NULL
    )
    SELECT
        award_bracket AS years_of_service,
        COUNT(*)::BIGINT AS no_of_employees,
        ROUND((COUNT(*) * 100.0) / NULLIF(SUM(COUNT(*)) OVER(), 0), 2) AS percentage,
        SUM(COUNT(*)) OVER()::BIGINT AS total
    FROM
        ServiceYears
    GROUP BY
        award_bracket
    ORDER BY
        CASE award_bracket
            WHEN 'Not eligible yet (< 10 years)' THEN 1
            WHEN '10 years loyalty award' THEN 2
            WHEN '15 years loyalty award' THEN 3
            WHEN '20 years loyalty award' THEN 4
            WHEN '25 years loyalty award' THEN 5
            WHEN '30 years loyalty award' THEN 6
            WHEN '35+ years loyalty award' THEN 7
            ELSE 8
        END ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
