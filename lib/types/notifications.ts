import { Users } from './users';

export type NotificationType = 'leave_filed' | 'leave_approved' | 'leave_disapproved';

export interface Notification {
  id: string;
  recipient_id: string;
  sender_id: string | null;
  type: NotificationType;
  reference_id: string | null;
  message: string;
  read_at: string | null;
  created_at: string | null;
  archived_at: string | null;
}

export interface NotificationWithSender extends Notification {
  sender: Pick<Users, 'id' | 'username' | 'email'> | null;
}
