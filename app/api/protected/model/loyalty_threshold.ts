import {
  conflictRequestResponse,
  generalErrorResponse,
  successResponse,
} from '../../helpers/response';
import { createClient } from '@/config';

export const addLoyaltyThreshold = async (yearThreshold: number) => {
  try {
    const supabase = await createClient();

    // Guard duplicates: the loyalty RPC joins on year_threshold, so a repeated
    // active value would double-count employees at that milestone.
    const { data: existing } = await supabase
      .from('employee_loyalty_threshold')
      .select('id')
      .eq('year_threshold', yearThreshold)
      .is('archived_at', null)
      .limit(1);

    if (existing && existing.length > 0) {
      return conflictRequestResponse({
        error: `${yearThreshold} years threshold already exists.`,
      });
    }

    const { error } = await supabase
      .from('employee_loyalty_threshold')
      .insert({ year_threshold: yearThreshold });

    if (error) {
      return generalErrorResponse({ error: error.message });
    }

    return successResponse({
      message: 'Successfuly added loyalty threshold',
    });
  } catch (error) {
    const newError = error as Error;
    return generalErrorResponse({ error: newError.message });
  }
};

export const editLoyaltyThreshold = async (
  data: { [key: string]: number | Date },
  id: string,
) => {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from('employee_loyalty_threshold')
      .update(data)
      .eq('id', id);

    if (error) {
      return generalErrorResponse({ error: error.message });
    }

    return successResponse({
      message: 'Successfuly updated loyalty threshold',
    });
  } catch (error) {
    const newError = error as Error;
    return generalErrorResponse({ error: newError.message });
  }
};
