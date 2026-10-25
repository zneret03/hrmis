-- Sample data for local development & demos: employees, biometric punches, and
-- service records. Idempotent (delete-then-insert on fixed keys). Loaded on
-- `make migrate-reset`. Safe to remove in production.
--
-- Password for all sample accounts: Password123! (same bcrypt hash as the admin).

BEGIN;

-- Clean any prior sample rows (cascades to public.users and service_record).
DELETE FROM public.biometrics
WHERE employee_id IN ('10-023', '102-3', '120-2', '130-5', '140-9');

DELETE FROM auth.users
WHERE email IN (
  'jan.rosum@example.com',
  'janny.golsing@example.com',
  'ken.thompson@example.com',
  'maria.santos@example.com',
  'pedro.cruz@example.com'
);

-- Auth accounts for the sample employees.
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_user_meta_data, created_at, updated_at, confirmation_token, email_change,
  email_change_token_new, recovery_token, raw_app_meta_data
)
VALUES
  ('00000000-0000-0000-0000-000000000000', 'e0000000-0000-0000-0000-000000000001', 'authenticated', 'authenticated', 'jan.rosum@example.com',     '$2a$10$TQutGZloa83.p0gmdKX0PO1rplnzkVrM3J9HwVYOXjzmrQVAISDNO', now(), '{"email_verified":true}'::jsonb, now(), now(), '', '', '', '', '{"provider":"email","providers":["email"]}'::jsonb),
  ('00000000-0000-0000-0000-000000000000', 'e0000000-0000-0000-0000-000000000002', 'authenticated', 'authenticated', 'janny.golsing@example.com', '$2a$10$TQutGZloa83.p0gmdKX0PO1rplnzkVrM3J9HwVYOXjzmrQVAISDNO', now(), '{"email_verified":true}'::jsonb, now(), now(), '', '', '', '', '{"provider":"email","providers":["email"]}'::jsonb),
  ('00000000-0000-0000-0000-000000000000', 'e0000000-0000-0000-0000-000000000003', 'authenticated', 'authenticated', 'ken.thompson@example.com',  '$2a$10$TQutGZloa83.p0gmdKX0PO1rplnzkVrM3J9HwVYOXjzmrQVAISDNO', now(), '{"email_verified":true}'::jsonb, now(), now(), '', '', '', '', '{"provider":"email","providers":["email"]}'::jsonb),
  ('00000000-0000-0000-0000-000000000000', 'e0000000-0000-0000-0000-000000000004', 'authenticated', 'authenticated', 'maria.santos@example.com',  '$2a$10$TQutGZloa83.p0gmdKX0PO1rplnzkVrM3J9HwVYOXjzmrQVAISDNO', now(), '{"email_verified":true}'::jsonb, now(), now(), '', '', '', '', '{"provider":"email","providers":["email"]}'::jsonb),
  ('00000000-0000-0000-0000-000000000000', 'e0000000-0000-0000-0000-000000000005', 'authenticated', 'authenticated', 'pedro.cruz@example.com',    '$2a$10$TQutGZloa83.p0gmdKX0PO1rplnzkVrM3J9HwVYOXjzmrQVAISDNO', now(), '{"email_verified":true}'::jsonb, now(), now(), '', '', '', '', '{"provider":"email","providers":["email"]}'::jsonb);

-- Public profiles (varied gender/age/employment status/years-of-service).
INSERT INTO public.users (
  id, email, employee_id, role, username, first_name, last_name, gender,
  employment_status, position, birthdate, date_of_original_appointment
)
VALUES
  ('e0000000-0000-0000-0000-000000000001', 'jan.rosum@example.com',     '10-023', 'employee', 'jan.rosum',     'Jan',   'Rosum',    'Male',   'Permanent',   'Administrative Officer', '1994-03-10', '2016-05-01'),
  ('e0000000-0000-0000-0000-000000000002', 'janny.golsing@example.com', '102-3',  'employee', 'janny.golsing', 'Janny', 'Golsing',  'Female', 'Casual',      'Clerk',                  '1998-07-22', '2021-01-01'),
  ('e0000000-0000-0000-0000-000000000003', 'ken.thompson@example.com',  '120-2',  'employee', 'ken.thompson',  'Ken',   'Thompson', 'Male',   'Contractual', 'Engineer',               '2002-02-15', '2024-01-01'),
  ('e0000000-0000-0000-0000-000000000004', 'maria.santos@example.com',  '130-5',  'employee', 'maria.santos',  'Maria', 'Santos',   'Female', 'Elected',     'Councilor',              '1985-11-05', '2006-06-01'),
  ('e0000000-0000-0000-0000-000000000005', 'pedro.cruz@example.com',    '140-9',  'employee', 'pedro.cruz',    'Pedro', 'Cruz',     'Male',   'Permanent',   'Accountant',             '1979-09-01', '2011-03-01');

-- Biometric punches (timestamps are local + 8h, matching the app's normalisation).
-- 10-023: Jan 12 on-time full day; Jan 13 late (08:45) + undertime (out 4pm).
-- 102-3: Jan 12 early-in, long day. 140-9: Jan 14 with lunch break (8h).
INSERT INTO public.biometrics (employee_id, timestamp, type)
VALUES
  ('10-023', '2026-01-12T16:00:00Z', 1), ('10-023', '2026-01-13T01:00:00Z', 1),
  ('10-023', '2026-01-13T16:45:00Z', 1), ('10-023', '2026-01-14T00:00:00Z', 1),
  ('102-3',  '2026-01-12T15:50:00Z', 1), ('102-3',  '2026-01-13T01:30:00Z', 1),
  ('140-9',  '2026-01-14T16:00:00Z', 1), ('140-9',  '2026-01-14T20:00:00Z', 1),
  ('140-9',  '2026-01-14T21:00:00Z', 1), ('140-9',  '2026-01-15T01:00:00Z', 1);

-- Service records.
INSERT INTO public.service_record (
  user_id, position, status, salary, station, from_date, to_date, remarks
)
VALUES
  ('e0000000-0000-0000-0000-000000000001', 'Clerk I',                'Permanent', '25000', 'Main Office', '2016-05-01', '2020-12-31', 'Promoted'),
  ('e0000000-0000-0000-0000-000000000001', 'Administrative Officer', 'Permanent', '38000', 'Main Office', '2021-01-01', NULL,         'Current'),
  ('e0000000-0000-0000-0000-000000000004', 'Councilor',              'Elected',   '45000', 'City Hall',   '2019-06-30', '2022-06-30', 'First term');

COMMIT;
