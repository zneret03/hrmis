import { createClient } from '@/config';
import { generalErrorResponse, successResponse } from '../../helpers/response';

export const insertLeaveNotificationsForAdmins = async (args: {
  senderId: string;
  senderEmail: string;
  leaveApplicationId: string;
}) => {
  try {
    const supabase = await createClient();

    const { data: admins, error: adminsError } = await supabase
      .from('users')
      .select('id')
      .in('role', ['admin', 'staff'])
      .is('archived_at', null);

    if (adminsError) {
      return generalErrorResponse({ error: adminsError.message });
    }

    if (!admins || admins.length === 0) {
      return successResponse({ message: 'No admin recipients.' });
    }

    const notifications = admins.map((admin) => ({
      recipient_id: admin.id,
      sender_id: args.senderId,
      type: 'leave_filed' as const,
      reference_id: args.leaveApplicationId,
      message: `${args.senderEmail} filed a new leave application.`,
    }));

    const { error } = await supabase.from('notifications').insert(notifications);

    if (error) {
      return generalErrorResponse({ error: error.message });
    }

    return successResponse({ message: 'Notifications sent.' });
  } catch (error) {
    const newError = error as Error;
    return generalErrorResponse({ error: newError.message });
  }
};

export const notifyEmployee = async (args: {
  recipientId: string;
  senderId: string;
  leaveApplicationId: string;
  status: 'approved' | 'disapproved';
}) => {
  try {
    const supabase = await createClient();

    const { data: reviewer } = await supabase
      .from('users')
      .select('email')
      .eq('id', args.senderId)
      .maybeSingle();

    const reviewerLabel = reviewer?.email ?? 'HR';
    const actionLabel = args.status === 'approved' ? 'approved' : 'disapproved';

    const { error } = await supabase.from('notifications').insert({
      recipient_id: args.recipientId,
      sender_id: args.senderId,
      type: args.status === 'approved' ? 'leave_approved' : 'leave_disapproved',
      reference_id: args.leaveApplicationId,
      message: `Your leave request has been ${actionLabel} by ${reviewerLabel}.`,
    });

    if (error) {
      return generalErrorResponse({ error: error.message });
    }

    return successResponse({ message: 'Employee notified.' });
  } catch (error) {
    const newError = error as Error;
    return generalErrorResponse({ error: newError.message });
  }
};

export const markNotificationRead = async (id: string) => {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from('notifications')
      .update({ read_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      return generalErrorResponse({ error: error.message });
    }

    return successResponse({ message: 'Notification marked as read.' });
  } catch (error) {
    const newError = error as Error;
    return generalErrorResponse({ error: newError.message });
  }
};
