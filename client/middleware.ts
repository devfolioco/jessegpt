import { isProjectPaused } from '@/config/availability';
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  if (!isProjectPaused()) return NextResponse.next();

  const { pathname } = request.nextUrl;

  // Block every API, including future endpoints, before any provider work runs.
  if (pathname === '/api' || pathname.startsWith('/api/')) {
    return NextResponse.json(
      { error: 'JesseGPT is taking a break. The service is temporarily unavailable.' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  // Keep only the homepage and its static assets reachable during the pause.
  if (
    pathname === '/' ||
    pathname.startsWith('/_next/static/') ||
    pathname === '/_next/image' ||
    pathname === '/frame/jesse-vacation.webp' ||
    pathname.startsWith('/favicon_io/') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  const destination = request.nextUrl.clone();
  destination.pathname = '/';
  destination.search = '';
  const response = NextResponse.redirect(destination, 307);
  response.headers.set('Cache-Control', 'no-store');
  return response;
}

export const config = {
  matcher: '/:path*',
};
