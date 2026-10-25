import { generalErrorResponse, successResponse } from '../../helpers/response';
import { createClient } from '@/config';

export const addEmployeeStatus = async (name: string) => {
  try {
    const supabase = await createClient();

    const { error } = await supabase.from('employee_status').insert({ name });

    if (error) {
      return generalErrorResponse({ error: error.message });
    }

    return successResponse({
      message: 'Successfuly added employee status',
    });
  } catch (error) {
    const newError = error as Error;
    return generalErrorResponse({ error: newError.message });
  }
};

export const editEmployeeStatus = async (
  data: { [key: string]: string | Date },
  id: string,
) => {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from('employee_status')
      .update(data)
      .eq('id', id);

    if (error) {
      return generalErrorResponse({ error: error.message });
    }

    return successResponse({
      message: 'Successfuly updated employee status',
    });
  } catch (error) {
    const newError = error as Error;
    return generalErrorResponse({ error: newError.message });
  }
};
