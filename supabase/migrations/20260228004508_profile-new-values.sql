ALTER TABLE public.users
  ADD COLUMN first_name TEXT,
  ADD COLUMN last_name TEXT,
  ADD COLUMN middle_name TEXT,
  ADD COLUMN address TEXT,
  ADD COLUMN contact_number TEXT,

  ADD COLUMN bp_number TEXT,
  ADD COLUMN philhealth TEXT,
  ADD COLUMN pagibig TEXT,
  ADD COLUMN tin TEXT,

  ADD COLUMN position TEXT,
  ADD COLUMN birthdate DATE,
  ADD COLUMN date_of_original_appointment DATE,
  ADD COLUMN gender TEXT,

  ADD COLUMN civil_status TEXT,
  ADD COLUMN employment_status TEXT;

ALTER TABLE public.users
  ADD CONSTRAINT check_civil_status 
  CHECK (civil_status IN ('Single', 'Married')),

  ADD CONSTRAINT check_employment_status 
  CHECK (employment_status IN ('Permanent', 'Casual', 'Elected'));

CREATE INDEX idx_users_tin ON public.users(tin);
CREATE INDEX idx_users_bp_number ON public.users(bp_number);
