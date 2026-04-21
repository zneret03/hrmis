import { NextRequest } from 'next/server';
import { createClient } from '@/config';
import { paginatedData } from '../../helpers/paginated-data';
import {
  badRequestResponse,
  generalErrorResponse,
  successResponse,
  validationErrorNextResponse,
} from '../../helpers/response';

export async function GET(req: NextRequest) {}
