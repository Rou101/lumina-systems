import type { Metadata } from 'next';
import '../globals.css';
import Navbar from '@/components/Navbar';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Lumina Systems | The OS for Nightlife',
    description: 'Operating system for mass events and elite nightlife.',
};

export default async function RootLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;

    return (
        <html lang={lang} className="dark">
            <body className={`${inter.className} bg-black text-white antialiased selection:bg-cyan-500 selection:text-black`}>
                <Navbar lang={lang} />
                {children}
            </body>
        </html>
    );
}
