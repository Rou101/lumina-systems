import { i18nRouter } from 'next-i18n-router';
import { NextRequest } from 'next/server';

const i18nConfig = {
    locales: ['en', 'es'],
    defaultLocale: 'en'
};

export function middleware(request: NextRequest) {
    return i18nRouter(request, i18nConfig);
}

export const config = {
    matcher: '/((?!api|static|.*\\..*|_next).*)'
};
