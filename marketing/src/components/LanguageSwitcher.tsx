'use client';
import { usePathname, useRouter } from 'next/navigation';
import { i18nRouter } from 'next-i18n-router';

export default function LanguageSwitcher() {
    const pathname = usePathname();
    const router = useRouter();

    const switchLanguage = (lang: string) => {
        // Basic logic: replace current locale segment or prepend it
        // But next-i18n-router might handle it.
        // Manual logic:
        const currentLang = pathname.startsWith('/es') ? 'es' : 'en';
        if (currentLang === lang) return;

        const newPath = lang === 'en'
            ? pathname.replace(/^\/es/, '') || '/'
            : `/es${pathname}`; // Simplification. Correct toggle needed.

        // Better: use next-i18n-router's logic or just strict replacement
        // If we are at /es/foo, switch to /en/foo -> /foo (if en is default)
        // If we are at /foo, switch to /es/foo

        if (lang === 'es' && !pathname.startsWith('/es')) {
            router.push(`/es${pathname}`);
        } else if (lang === 'en' && pathname.startsWith('/es')) {
            router.push(pathname.replace(/^\/es/, '') || '/');
        }
    };

    return (
        <div className="flex gap-4 text-sm font-mono text-gray-500">
            <button onClick={() => switchLanguage('en')} className="hover:text-cyan-400 transition-colors">EN</button>
            <button onClick={() => switchLanguage('es')} className="hover:text-cyan-400 transition-colors">ES</button>
        </div>
    );
}
