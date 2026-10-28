import {
  badRequestResponse,
  generalErrorResponse,
  successResponse,
} from '../../helpers/response';
import { createClient } from '@/config';
import { DATE_RANGE_ERROR, isValidDateRange } from '@/helpers/serviceRecord';

interface ServiceRecordInput {
  user_id?: string;
  position?: string | null;
  status?: string | null;
  salary?: string | null;
  station?: string | null;
  from_date?: string | null;
  to_date?: string | null;
  remarks?: string | null;
}

// Empty date strings must become NULL (the DATE column rejects '').
const pickFields = (data: ServiceRecordInput) => ({
  position: data.position ?? null,
  status: data.status ?? null,
  salary: data.salary ?? null,
  station: data.station ?? null,
  from_date: data.from_date || null,
  to_date: data.to_date || null,
  remarks: data.remarks ?? null,
});

export const addServiceRecord = async (data: ServiceRecordInput) => {
  if (!isValidDateRange(data.from_date, data.to_date)) {
    return badRequestResponse({ error: DATE_RANGE_ERROR });
  }

  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from('service_record')
      .insert({ user_id: data.user_id, ...pickFields(data) });

    if (error) {
      return generalErrorResponse({ error: error.message });
    }

    return successResponse({ message: 'Successfuly added service record' });
  } catch (error) {
    const newError = error as Error;
    return generalErrorResponse({ error: newError.message });
  }
};

export const editServiceRecord = async (
  data: ServiceRecordInput & { archived_at?: string | Date },
  id: string,
) => {
  const isArchive = data.archived_at !== undefined;
  if (!isArchive && !isValidDateRange(data.from_date, data.to_date)) {
    return badRequestResponse({ error: DATE_RANGE_ERROR });
  }

  try {
    const supabase = await createClient();

    const payload = isArchive
      ? { archived_at: data.archived_at }
      : pickFields(data);

    const { error } = await supabase
      .from('service_record')
      .update(payload)
      .eq('id', id);

    if (error) {
      return generalErrorResponse({ error: error.message });
    }

    return successResponse({ message: 'Successfuly updated service record' });
  } catch (error) {
    const newError = error as Error;
    return generalErrorResponse({ error: newError.message });
  }
};
