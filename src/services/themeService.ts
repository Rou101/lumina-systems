import { BrandPalette } from '../types';

export const generatePalettesFromLogo = async (logoUrl: string): Promise<BrandPalette[]> => {
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 800));

    return [
        {
            id: `pal_${Date.now()}_1`,
            name: 'Vibrant Day',
            mode: 'light',
            primary: '#f43f5e',
            secondary: '#f59e0b',
            background: '#fff1f2',
            cardBg: '#ffffff',
            text: '#881337'
        },
        {
            id: `pal_${Date.now()}_2`,
            name: 'Midnight Neon',
            mode: 'dark',
            primary: '#22d3ee',
            secondary: '#a855f7',
            background: '#083344',
            cardBg: '#164e63',
            text: '#ecfeff'
        },
        {
            id: `pal_${Date.now()}_3`,
            name: 'Toxic Lime',
            mode: 'dark',
            primary: '#bef264',
            secondary: '#10b981',
            background: '#1a2e05',
            cardBg: '#365314',
            text: '#ecfccb'
        }
    ];
};
