
import { BrandPalette } from '../types';

// Helper to convert hex to RGB
const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
};

// Helper to lighten/darken color
const adjustColor = (color: string, amount: number) => {
    return '#' + color.replace(/^#/, '').replace(/../g, color => ('0'+Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
}

// APPLY THEME TO DOM
export const applyTheme = (palette: BrandPalette) => {
    if (palette.mode === 'light') {
        document.body.classList.add('light-mode');
    } else {
        document.body.classList.remove('light-mode');
    }
    
    // Future: We could allow granular overrides of specific CSS variables here if needed
    // document.documentElement.style.setProperty('--lumina-base', palette.background);
};

// THE "AI" LOGIC
// Extracts dominant color from image and generates 3 harmonic palettes
export const generatePalettesFromLogo = async (imageUrl: string): Promise<BrandPalette[]> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = imageUrl;
        
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if(!ctx) return resolve(getDefaultPalettes());
            
            canvas.width = 100; // Small size for performance
            canvas.height = 100;
            ctx.drawImage(img, 0, 0, 100, 100);
            
            // Get center pixel or average (simplification)
            const p = ctx.getImageData(50, 50, 1, 1).data;
            const primaryHex = "#" + ((1 << 24) + (p[0] << 16) + (p[1] << 8) + p[2]).toString(16).slice(1);
            
            resolve(createVariations(primaryHex));
        };
        
        img.onerror = () => resolve(getDefaultPalettes());
    });
};

const createVariations = (baseColor: string): BrandPalette[] => {
    return [
        {
            id: 'vibrant',
            name: 'Neón Festival (Dark)',
            primary: baseColor,
            secondary: adjustColor(baseColor, 40),
            background: '#050505',
            cardBg: '#0A0A0A',
            text: '#EDEDED',
            mode: 'dark'
        },
        {
            id: 'elegant',
            name: 'Midnight Void (Dark)',
            primary: '#ffffff',
            secondary: '#888888',
            background: '#000000',
            cardBg: '#111111',
            text: '#ffffff',
            mode: 'dark'
        },
        {
            id: 'clinical',
            name: 'Daylight Clinical (Light)',
            primary: baseColor, // Keep brand color
            secondary: '#4B5563',
            background: '#F0F2F5', 
            cardBg: '#FFFFFF',
            text: '#111111',
            mode: 'light'
        }
    ];
};

export const getDefaultPalettes = (): BrandPalette[] => {
    return createVariations('#8b5cf6'); // Default Violet
};
