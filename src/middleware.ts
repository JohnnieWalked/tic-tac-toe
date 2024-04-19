import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { nextUrl } = request;
  // if (request.cookies.get('username')?.value) {
  //   return;
  // } else {
  return Response.redirect(new URL('/?error=no-username-provided', nextUrl));
  // }
}

export const config = {
  matcher: '/new-game/:path*',
};
