import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  if (request.cookies.get('username')?.value)
    console.log(request.cookies.get('username')?.value);
}

export const config = {
  matcher: '/new-game/:path*',
};
