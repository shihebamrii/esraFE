import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';
import { locales, defaultLocale, localePrefix } from './i18n/settings';

const handleRequest = createMiddleware({
  locales,
  defaultLocale,
  localePrefix
});

export default function middleware(req: NextRequest) {
  // console.log("Middleware processing:", req.nextUrl.pathname);
  return handleRequest(req);
}
 
export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
