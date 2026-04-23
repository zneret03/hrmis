import { createClient } from '@/config';
import { generalErrorResponse, successResponse } from '../../helpers/response';
import { LeaveCardEntryInsert } from '@/lib/types/leave_card_entries';

export const addLeaveCardEntry = async (data: LeaveCardEntryInsert) => {
  try {
    const supabase = await createClient();

    const { error } = await supabase.from('leave_card_entries').insert(data);

    if (error) {
      return generalErrorResponse({ error: error.message });
    }

    return successResponse({ message: 'Successfully added leave card entry.' });
  } catch (error) {
    const newError = error as Error;
    return generalErrorResponse({ error: newError.message });
  }
};

export const updateLeaveCardEntry = async (
  id: string,
  data: Partial<LeaveCardEntryInsert>,
) => {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from('leave_card_entries')
      .update(data)
      .eq('id', id);

    if (error) {
      return generalErrorResponse({ error: error.message });
    }

    return successResponse({
      message: 'Successfully updated leave card entry.',
    });
  } catch (error) {
    const newError = error as Error;
    return generalErrorResponse({ error: newError.message });
  }
};

export const deleteLeaveCardEntry = async (id: string) => {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from('leave_card_entries')
      .update({ archived_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      return generalErrorResponse({ error: error.message });
    }

    return successResponse({
      message: 'Successfully deleted leave card entry.',
    });
  } catch (error) {
    const newError = error as Error;
    return generalErrorResponse({ error: newError.message });
  }
};
