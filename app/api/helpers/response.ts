import { NextResponse } from 'next/server';

export function generalErrorResponse<T>(data?: T): Response {
  const message = JSON.stringify(data || { message: 'General Error' });

  console.error(message);
  return new NextResponse(
    JSON.stringify(data || { message: 'General Error' }),
    {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    },
  );
}

export function conflictRequestResponse<T>(data?: T): NextResponse {
  const message = JSON.stringify(data || { message: 'entry conflict' });

  console.error(message);
  return new NextResponse(message, {
    status: 409,
    headers: { 'Content-Type': 'application/json' },
  });
}

export function successResponse<T>(data?: T): NextResponse {
  return new NextResponse(JSON.stringify(data || { message: 'Successfuly' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

export function notFoundResponse<T>(data?: T): NextResponse {
  const message = JSON.stringify(data || { message: 'Not Found' });

  console.error(message);
  return new NextResponse(message, {
    status: 404,
    headers: { 'Content-Type': 'application/json' },
  });
}

export function badRequestResponse<T>(data?: T): NextResponse {
  const message = JSON.stringify(data || { message: 'Bad request' });

  console.error(message);
  return new NextResponse(message, {
    status: 400,
    headers: { 'Content-Type': 'application/json' },
  });
}

export function unauthorizedResponse<T>(data?: T): NextResponse {
  const message = JSON.stringify(data || { message: 'Unauthorized' });

  console.error(message);
  return new NextResponse(message, {
    status: 401,
    headers: { 'Content-Type': 'application/json' },
  });
}

export function forbiddenResponse<T>(data?: T): NextResponse {
  const message = JSON.stringify(data || { message: 'Forbidden' });

  console.error(message);
  return new NextResponse(message, {
    status: 403,
    headers: { 'Content-Type': 'application/json' },
  });
}

export function validationErrorNextResponse<T>(data?: T): NextResponse {
  const message = JSON.stringify(data || { message: 'Validation Error' });

  console.error(message);
  return new NextResponse(message, {
    status: 400,
    headers: { 'Content-Type': 'application/json' },
  });
}
