
BEGIN;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'uuid-ossp') THEN
        CREATE EXTENSION "uuid-ossp" SCHEMA public;
    END IF;
END;
$$;

INSERT INTO public.leave_categories (id, name, created_at, updated_at)
SELECT 
    uuid_generate_v4(),
    'Vacation Leave',
    CURRENT_TIMESTAMP,
    NULL
WHERE NOT EXISTS (
    SELECT 1 FROM public.leave_categories WHERE name = 'Vacation Leave'
);

COMMIT;
