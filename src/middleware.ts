import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest, response: NextResponse) {
  // console.log(request);
  // console.log(response);
}

export const config = {
  matcher: '/new-game/:path*',
};
