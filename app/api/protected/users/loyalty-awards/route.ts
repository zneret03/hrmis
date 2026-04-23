import {
  generalErrorResponse,
  successResponse,
} from '@/app/api/helpers/response';
import { createClient } from '@/config';

export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase.rpc('get_loyalty_award_statistics');

    if (error) {
      return generalErrorResponse({ message: error.message });
    }

    return successResponse({
      message: 'Successfully fetched loyalty award statistics',
      data,
    });
  } catch (error) {
    return generalErrorResponse({ message: error });
  }
}
