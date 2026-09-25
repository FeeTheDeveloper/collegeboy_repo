import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse, type NextRequest } from 'next/server';

const isProtectedRoute = createRouteMatcher(['/account(.*)']);
const clerkConfigured = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY);
const protectedProxy = clerkMiddleware(async (auth, request) => {
  if (isProtectedRoute(request)) await auth.protect();
});

export default function proxy(request: NextRequest) {
  if (!clerkConfigured) return NextResponse.next();
  return protectedProxy(request, {} as never);
}

export const config = {
  matcher: ['/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)', '/(api|trpc)(.*)']
};
