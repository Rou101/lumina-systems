import { getDictionary } from '../../get-dictionary';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Hardware from '@/components/Hardware';
import Contact from '@/components/Contact';
import Performance from '@/components/Performance';
import Mechanics from '@/components/Mechanics';

export default async function Page({ params }: { params: Promise<{ lang: 'en' | 'es' }> }) {
    const { lang } = await params;
    const dict = await getDictionary(lang);

    return (
        <main className="min-h-screen bg-black">
            <Hero dict={dict} />
            <Features dict={dict} />
            <Performance dict={dict} />
            <Mechanics dict={dict} />
            <Hardware />
            <Contact dict={dict} />
        </main>
    );
}
