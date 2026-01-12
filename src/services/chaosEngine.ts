import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';

const PRODUCTS = [
    { id: '1', name: 'Heineken Silver', price: 5.00, station: 'bar' },
    { id: '2', name: 'Red Bull', price: 4.50, station: 'bar' },
    { id: '3', name: 'Water', price: 3.00, station: 'bar' },
    { id: '4', name: 'Classic Burger', price: 12.00, station: 'kitchen' },
    { id: '5', name: 'Truffle Fries', price: 8.00, station: 'kitchen' },
];

export const ChaosEngine = {
    activeBots: [] as NodeJS.Timeout[],

    /**
     * Spawns multiple "bots" that create orders at random intervals.
     * @param userCount Number of concurrent bots to simulate
     * @param durationSeconds How long the simulation runs
     */
    startChaos: (userCount: number = 100, durationSeconds: number = 60) => {
        console.log(`%c[CHAOS ENGINE] Initializing ${userCount} bots for ${durationSeconds}s...`, 'background: #red; color: white; font-size: 14px');

        // Clear previous if any
        ChaosEngine.stopChaos();

        for (let i = 0; i < userCount; i++) {
            const botId = `BOT-${Math.floor(1000 + Math.random() * 9000)}`;
            const frequency = Math.random() * 5000 + 500; // Random burst between 0.5s and 5.5s

            const interval = setInterval(() => {
                ChaosEngine.botAction(botId);
            }, frequency);

            ChaosEngine.activeBots.push(interval);
        }

        // Auto-stop
        setTimeout(() => {
            ChaosEngine.stopChaos();
            console.log('%c[CHAOS ENGINE] Simulation Complete. Cooling down...', 'background: #00ff00; color: black');
        }, durationSeconds * 1000);
    },

    stopChaos: () => {
        ChaosEngine.activeBots.forEach(clearInterval);
        ChaosEngine.activeBots = [];
    },

    botAction: async (botId: string) => {
        // 1. Pick Random Product
        const product = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
        const qty = Math.floor(Math.random() * 3) + 1;

        console.log(`[${botId}] Purchasing x${qty} ${product.name}...`);

        // 2. Write to Firestore
        try {
            await addDoc(collection(db, 'orders'), {
                id: `${botId}-${Date.now()}`,
                customerName: botId,
                items: [{ ...product, qty }],
                station: product.station,
                status: product.station === 'bar' ? 'ready' : 'prep',
                timestamp: Date.now(),
                isTest: true, // Safety Flag
                total: product.price * qty
            });
        } catch (e) {
            console.error(`[${botId}] Transaction Failed:`, e);
        }
    }
};
