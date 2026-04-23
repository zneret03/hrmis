-- =============================================
-- Personnel Leave Card entries table
-- Each row = one month/period entry per employee
-- HR/Admin encodes these manually
-- =============================================
CREATE TABLE public.leave_card_entries (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                 UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    year                    INTEGER NOT NULL,
    month                   TEXT NOT NULL,
    -- No. of Days Leave Earned
    earned_vacation         NUMERIC(6,3) NOT NULL DEFAULT 0,
    earned_sick             NUMERIC(6,3) NOT NULL DEFAULT 0,
    -- Leave Enjoyed
    enjoyed_vacation        NUMERIC(6,3) NOT NULL DEFAULT 0,
    enjoyed_sick            NUMERIC(6,3) NOT NULL DEFAULT 0,
    -- No. Tardy for 5 mins. or more
    tardy_count             INTEGER NOT NULL DEFAULT 0,
    -- Undertime
    undertime_hours         NUMERIC(6,2) NOT NULL DEFAULT 0,
    undertime_minutes       NUMERIC(6,2) NOT NULL DEFAULT 0,
    undertime_days_equiv    NUMERIC(6,3) NOT NULL DEFAULT 0,
    -- Total Leave Spent
    total_spent_vacation    NUMERIC(6,3) NOT NULL DEFAULT 0,
    total_spent_sick        NUMERIC(6,3) NOT NULL DEFAULT 0,
    -- Leave Without Pay
    lwop_vacation           NUMERIC(6,3) NOT NULL DEFAULT 0,
    lwop_sick               NUMERIC(6,3) NOT NULL DEFAULT 0,
    -- Balance
    balance_vacation        NUMERIC(6,3) NOT NULL DEFAULT 0,
    balance_sick            NUMERIC(6,3) NOT NULL DEFAULT 0,
    -- Maternity Leave
    maternity_leave         NUMERIC(6,3) NOT NULL DEFAULT 0,
    -- Remarks
    remarks                 TEXT,
    -- Audit
    encoded_by              UUID REFERENCES users(id),
    leave_application_id    UUID REFERENCES leave_applications(id),
    created_at              TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at              TIMESTAMP WITH TIME ZONE,
    archived_at             TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_leave_card_entries_user_id   ON public.leave_card_entries(user_id);
CREATE INDEX idx_leave_card_entries_year      ON public.leave_card_entries(year);
CREATE INDEX idx_leave_card_entries_archived  ON public.leave_card_entries(archived_at);

CREATE TRIGGER update_leave_card_entries_updated_at
    BEFORE UPDATE ON public.leave_card_entries
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.leave_card_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY admin_all_leave_card_entries ON public.leave_card_entries
    FOR ALL TO authenticated
    USING (
        (SELECT role FROM users WHERE id = auth.uid()) IN ('admin', 'staff')
    )
    WITH CHECK (
        (SELECT role FROM users WHERE id = auth.uid()) IN ('admin', 'staff')
    );

CREATE POLICY employee_own_leave_card_entries ON public.leave_card_entries
    FOR SELECT TO authenticated
    USING (user_id = auth.uid() AND archived_at IS NULL);


-- =============================================
-- Notifications table
-- Inserted when employee files a leave application
-- HR/Admin receives and can mark as read
-- =============================================
CREATE TABLE public.notifications (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_id    UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    sender_id       UUID REFERENCES users(id) ON DELETE SET NULL,
    type            TEXT NOT NULL CHECK (type IN ('leave_filed', 'leave_approved', 'leave_disapproved')),
    reference_id    UUID,
    message         TEXT NOT NULL,
    read_at         TIMESTAMP WITH TIME ZONE,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    archived_at     TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_notifications_recipient_id ON public.notifications(recipient_id);
CREATE INDEX idx_notifications_read_at      ON public.notifications(read_at);
CREATE INDEX idx_notifications_archived_at  ON public.notifications(archived_at);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY admin_own_notifications ON public.notifications
    FOR ALL TO authenticated
    USING (recipient_id = auth.uid() AND archived_at IS NULL)
    WITH CHECK (recipient_id = auth.uid());

CREATE POLICY insert_notifications ON public.notifications
    FOR INSERT TO authenticated
    WITH CHECK (true);


-- =============================================
-- Extend leave_applications with HR review fields
-- =============================================
ALTER TABLE public.leave_applications
    ADD COLUMN IF NOT EXISTS hr_comment   TEXT,
    ADD COLUMN IF NOT EXISTS reviewed_by  UUID REFERENCES users(id),
    ADD COLUMN IF NOT EXISTS reviewed_at  TIMESTAMP WITH TIME ZONE;
