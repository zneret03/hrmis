
CREATE TABLE public.attendance_summary (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id TEXT REFERENCES users(employee_id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    total_hours INTEGER NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('completed', 'incomplete', 'half-day')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE,
    archived_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT idx_unique_attendance_summary UNIQUE (employee_id, user_id, timestamp)
);

ALTER TABLE public.attendance_summary ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_attendance_summary_employee_id ON public.attendance_summary(employee_id);
CREATE INDEX idx_attendance_summary_user_id ON public.attendance_summary(user_id);
CREATE INDEX idx_attendance_summary_timestamp ON public.attendance_summary(timestamp);
CREATE INDEX idx_attendance_summary_total_hourse ON public.attendance_summary(total_hours);


-- Attendance table policies
CREATE POLICY admin_all_attendance_summary ON public.attendance_summary
    FOR ALL
    TO authenticated
    USING (
      ((( SELECT users_1.role
            FROM users users_1
            WHERE (users_1.id = auth.uid())) = 'admin'::text))
       AND archived_at IS NULL)
    WITH CHECK (
      ((( SELECT users_1.role
            FROM users users_1
            WHERE (users_1.id = auth.uid())) = 'admin'::text))
    );

CREATE POLICY employee_own_attendance_summary ON public.attendance_summary
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid() AND archived_at IS NULL);

-- Create a function to update attendance_summary based on biometrics
CREATE OR REPLACE FUNCTION update_attendance_summary()
RETURNS TRIGGER AS $$
DECLARE
    earliest_login TIMESTAMP WITH TIME ZONE;
    latest_logout TIMESTAMP WITH TIME ZONE;
    total_hours_calculated INTEGER;
    employee_id_val TEXT;
    user_id_val UUID;
BEGIN
    SELECT employee_id, id INTO employee_id_val, user_id_val
    FROM users
    WHERE employee_id = NEW.employee_id;

    IF employee_id_val IS NOT NULL AND user_id_val IS NOT NULL THEN
        -- Check all timestamps for the same employee_id and day
        IF NEW.type IN (1, 15) THEN
            -- Find the earliest login and latest logout on the same day
            SELECT MIN(timestamp) INTO earliest_login
            FROM biometrics
            WHERE employee_id = NEW.employee_id
              AND DATE(timestamp) = DATE(NEW.timestamp)
              AND type IN (1, 15);

            SELECT MAX(timestamp) INTO latest_logout
            FROM biometrics
            WHERE employee_id = NEW.employee_id
              AND DATE(timestamp) = DATE(NEW.timestamp)
              AND type IN (1, 15);

            IF earliest_login IS NOT NULL AND latest_logout IS NOT NULL AND earliest_login != latest_logout THEN
                -- Calculate total hours as the span from earliest login to latest logout
                total_hours_calculated = FLOOR(EXTRACT(EPOCH FROM (latest_logout - earliest_login)) / 3600);

                -- Determine status based on total hours
                IF total_hours_calculated > 8 THEN
                    INSERT INTO attendance_summary (employee_id, user_id, timestamp, total_hours, status)
                    VALUES (employee_id_val, user_id_val, DATE_TRUNC('day', NEW.timestamp), total_hours_calculated, 'completed')
                    ON CONFLICT (employee_id, user_id, timestamp) DO UPDATE
                    SET total_hours = total_hours_calculated,
                        status = 'completed',
                        updated_at = CURRENT_TIMESTAMP;
                ELSIF total_hours_calculated <= 4 THEN
                    INSERT INTO attendance_summary (employee_id, user_id, timestamp, total_hours, status)
                    VALUES (employee_id_val, user_id_val, DATE_TRUNC('day', NEW.timestamp), total_hours_calculated, 'half-day')
                    ON CONFLICT (employee_id, user_id, timestamp) DO UPDATE
                    SET total_hours = total_hours_calculated,
                        status = 'half-day',
                        updated_at = CURRENT_TIMESTAMP;
                ELSE
                    INSERT INTO attendance_summary (employee_id, user_id, timestamp, total_hours, status)
                    VALUES (employee_id_val, user_id_val, DATE_TRUNC('day', NEW.timestamp), total_hours_calculated, 'completed')
                    ON CONFLICT (employee_id, user_id, timestamp) DO UPDATE
                    SET total_hours = total_hours_calculated,
                        status = 'completed',
                        updated_at = CURRENT_TIMESTAMP;
                END IF;
            ELSE
                -- No valid span (e.g., only one timestamp or all same time), mark as incomplete
                INSERT INTO attendance_summary (employee_id, user_id, timestamp, total_hours, status)
                VALUES (employee_id_val, user_id_val, DATE_TRUNC('day', NEW.timestamp), 0, 'incomplete')
                ON CONFLICT (employee_id, user_id, timestamp) DO UPDATE
                SET total_hours = 0,
                    status = 'incomplete',
                    updated_at = CURRENT_TIMESTAMP;
            END IF;
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
CREATE TRIGGER trigger_update_attendance_summary
AFTER INSERT ON biometrics
FOR EACH ROW
EXECUTE FUNCTION update_attendance_summary();


CREATE TRIGGER update_attendance_updated_at
    BEFORE UPDATE ON public.attendance
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION update_attendance_on_logout()
RETURNS TRIGGER AS $$
DECLARE
    login_time TIMESTAMP WITH TIME ZONE;
    total_workdays_in_month INTEGER;
    days_present_count INTEGER;
    v_tardiness_count INTEGER;
BEGIN
  SELECT COUNT(*)
    INTO total_workdays_in_month
    FROM generate_series(
        DATE_TRUNC('month', NEW.timestamp)::date,
        (DATE_TRUNC('month', NEW.timestamp) + INTERVAL '1 month - 1 day')::date,
        '1 day'::interval
    ) AS calendar_day
    WHERE EXTRACT(ISODOW FROM calendar_day) < 6; -- Monday=1, Friday=5, Saturday=6

    IF NEW.type IN (1, 15) THEN
        SELECT timestamp INTO login_time
        FROM biometrics
        WHERE employee_id = NEW.employee_id AND DATE(timestamp) = DATE(NEW.timestamp) AND timestamp < NEW.timestamp
        AND NOT EXISTS (
            SELECT 1 FROM biometrics b2
            WHERE b2.employee_id = NEW.employee_id AND DATE(b2.timestamp) = DATE(NEW.timestamp)
            AND b2.timestamp > biometrics.timestamp AND b2.timestamp < NEW.timestamp
        )
        ORDER BY timestamp DESC
        LIMIT 1;

        IF login_time IS NOT NULL THEN
            -- Your confirmed "days_present" logic (unchanged).
            SELECT COUNT(DISTINCT DATE(b.timestamp))
            INTO days_present_count
            FROM biometrics b
            WHERE b.employee_id = NEW.employee_id
              AND DATE_TRUNC('month', b.timestamp) = DATE_TRUNC('month', NEW.timestamp)
              AND EXISTS (
                  SELECT 1
                  FROM biometrics b2
                  WHERE b2.employee_id = b.employee_id
                    AND DATE(b2.timestamp) = DATE(b.timestamp)
                    AND b2.timestamp > b.timestamp
              );

            WITH daily_stats AS (
                SELECT
                    MIN(timestamp) as first_punch,
                    COUNT(*) as punch_count
                FROM biometrics
                WHERE employee_id = NEW.employee_id
                  AND DATE_TRUNC('month', timestamp) = DATE_TRUNC('month', NEW.timestamp)
                GROUP BY DATE(timestamp)
            )
            SELECT COUNT(*)
            INTO v_tardiness_count
            FROM daily_stats
            WHERE
                punch_count > 1 
                AND first_punch::time > '08:00:00'; 

            INSERT INTO attendance (employee_id, user_id, month, days_present, days_absent, tardiness_count)
            VALUES (
                NEW.employee_id,
                (SELECT id FROM users WHERE employee_id = NEW.employee_id),
                DATE_TRUNC('month', NEW.timestamp),
                days_present_count,
                total_workdays_in_month - days_present_count,
                v_tardiness_count
            )
            ON CONFLICT (employee_id, month) DO UPDATE
            SET days_present = days_present_count,
                days_absent = total_workdays_in_month - days_present_count,
                tardiness_count = v_tardiness_count,
                updated_at = CURRENT_TIMESTAMP;
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
CREATE TRIGGER trigger_update_attendance
AFTER INSERT ON biometrics
FOR EACH ROW
EXECUTE FUNCTION update_attendance_on_logout();
