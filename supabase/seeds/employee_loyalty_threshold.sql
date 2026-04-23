BEGIN;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'uuid-ossp') THEN
        CREATE EXTENSION "uuid-ossp" SCHEMA public;
    END IF;
END;
$$;

-- Insert year_thresholds for loyalty awards, avoiding duplicates
INSERT INTO public.employee_loyalty_threshold (id, year_threshold, created_at, updated_at)
SELECT 
    uuid_generate_v4(),
    t.year_threshold,
    CURRENT_TIMESTAMP,
    NULL
FROM (VALUES (5), (10), (15), (20), (25), (30), (35)) AS t(year_threshold)
WHERE NOT EXISTS (
    SELECT 1 FROM public.employee_loyalty_threshold WHERE year_threshold = t.year_threshold
);
COMMIT;
