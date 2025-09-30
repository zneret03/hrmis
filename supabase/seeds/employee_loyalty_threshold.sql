BEGIN;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'uuid-ossp') THEN
        CREATE EXTENSION "uuid-ossp" SCHEMA public;
    END IF;
END;
$$;

-- Insert year_threshold of 5, avoiding duplicates
INSERT INTO public.employee_loyalty_threshold (id, year_threshold, created_at, updated_at)
SELECT 
    uuid_generate_v4(),
    5,
    CURRENT_TIMESTAMP,
    NULL
WHERE NOT EXISTS (
    SELECT 1 FROM public.employee_loyalty_threshold WHERE year_threshold = 5
);

COMMIT;
