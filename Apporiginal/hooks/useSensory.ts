
import { useCallback } from 'react';

export const useSensory = () => {
    
    const vibrate = useCallback((pattern: 'light' | 'medium' | 'heavy' | 'success' | 'error' = 'light') => {
        if (!navigator.vibrate) return;

        switch (pattern) {
            case 'light':
                navigator.vibrate(10); // Subtle click
                break;
            case 'medium':
                navigator.vibrate(40); // Standard tap
                break;
            case 'heavy':
                navigator.vibrate(80); // Strong interaction
                break;
            case 'success':
                navigator.vibrate([50, 30, 50]); // Da-da-da
                break;
            case 'error':
                navigator.vibrate([50, 50, 50, 50]); // Buzz buzz
                break;
        }
    }, []);

    // Future: Audio implementation
    const playSound = useCallback((type: 'pop' | 'cha-ching') => {
        // Placeholder for Web Audio API
    }, []);

    return { vibrate, playSound };
};
