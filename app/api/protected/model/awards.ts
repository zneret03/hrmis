import { Awards } from '@/lib/types/awards';
import { generalErrorResponse, successResponse } from '../../helpers/response';
import { createClient } from '@/config';

export const addAwards = async (data: Partial<Awards>) => {
  try {
    const supabase = await createClient();

    const { error } = await supabase.from('awards').insert(data);

    if (error) {
      return generalErrorResponse({ error: error.message });
    }

    return successResponse({
      message: 'Successfuly added award',
    });
  } catch (error) {
    const newError = error as Error;
    return generalErrorResponse({ error: newError.message });
  }
};

export const updateAward = async (data: Partial<Awards>, id: string) => {
  try {
    const supabase = await createClient();

    const { error } = await supabase.from('awards').update(data).eq('id', id);

    if (error) {
      return generalErrorResponse({ error: error.message });
    }

    return successResponse({
      message: 'Successfuly updated award',
    });
  } catch (error) {
    const newError = error as Error;
    return generalErrorResponse({ error: newError.message });
  }
};

export const updateThreshold = async (value: number, id: string) => {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from('employee_loyalty_threshold')
      .update({
        year_threshold: value,
      })
      .eq('id', id);

    if (error) {
      return generalErrorResponse({ error: error.message });
    }

    return successResponse({
      message: 'Successfuly updated award',
    });
  } catch (error) {
    const newError = error as Error;
    return generalErrorResponse({ error: newError.message });
  }
};
