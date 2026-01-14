import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware({
    // A list of all locales that are supported
    locales: ['en', 'ko', 'zh', 'ja'],

    // Used when no locale matches
    defaultLocale: 'ko',
    localeDetection: false
});

export default function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Check if accessing admin routes
    // Matches /en/admin, /ko/admin, etc.
    const isAdminRoute = pathname.match(/^\/(en|ko|zh|ja)\/admin/);

    if (isAdminRoute) {
        const session = req.cookies.get('admin_session');
        if (!session) {
            // Redirect to login
            const locale = pathname.split('/')[1];
            return NextResponse.redirect(new URL(`/${locale}/login`, req.url));
        }
    }

    return intlMiddleware(req);
}

export const config = {
    // Match only internationalized pathnames
    matcher: ['/', '/(ko|en|zh|ja)/:path*']
};
