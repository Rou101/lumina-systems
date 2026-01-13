import { create } from 'zustand';
import { Order } from '@/types/lumina';
import { generateMockDataset } from '@/lib/mockData';

interface AppState {
    orders: Order[];
    isPremium: boolean;
    isLoading: boolean;

    // Actions
    togglePremium: () => void;
    loadData: () => void;
}

export const useStore = create<AppState>((set) => ({
    orders: [],
    isPremium: false,
    isLoading: false,

    togglePremium: () => set((state) => ({ isPremium: !state.isPremium })),
    loadData: () => {
        set({ isLoading: true });
        // Simulate network delay
        setTimeout(() => {
            const data = generateMockDataset(500);
            set({ orders: data, isLoading: false });
        }, 800);
    }
}));
