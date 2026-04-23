-- Widen all NUMERIC columns in leave_card_entries from NUMERIC(6,3) to NUMERIC(10,3).
-- NUMERIC(6,3) caps at 999.999 — leave balances can accumulate well beyond that.
-- NUMERIC(10,3) allows up to 9,999,999.999 which is more than sufficient.

ALTER TABLE public.leave_card_entries
  ALTER COLUMN earned_vacation      TYPE NUMERIC(10,3),
  ALTER COLUMN earned_sick          TYPE NUMERIC(10,3),
  ALTER COLUMN enjoyed_vacation     TYPE NUMERIC(10,3),
  ALTER COLUMN enjoyed_sick         TYPE NUMERIC(10,3),
  ALTER COLUMN undertime_hours      TYPE NUMERIC(10,3),
  ALTER COLUMN undertime_minutes    TYPE NUMERIC(10,3),
  ALTER COLUMN undertime_days_equiv TYPE NUMERIC(10,3),
  ALTER COLUMN total_spent_vacation TYPE NUMERIC(10,3),
  ALTER COLUMN total_spent_sick     TYPE NUMERIC(10,3),
  ALTER COLUMN lwop_vacation        TYPE NUMERIC(10,3),
  ALTER COLUMN lwop_sick            TYPE NUMERIC(10,3),
  ALTER COLUMN balance_vacation     TYPE NUMERIC(10,3),
  ALTER COLUMN balance_sick         TYPE NUMERIC(10,3),
  ALTER COLUMN maternity_leave      TYPE NUMERIC(10,3);
