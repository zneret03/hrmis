-- Employee Status is now admin-managed and dynamic (see the employee_status
-- table). The old CHECK constraint hardcoded employment_status to
-- ('Permanent', 'Casual', 'Elected'), which blocked newly-added statuses such as
-- 'Contractual' from being saved. Drop it so any managed status can be stored.
ALTER TABLE public.users
    DROP CONSTRAINT IF EXISTS check_employment_status;
