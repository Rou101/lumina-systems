import { Order, OrderStatus, PaymentStatus, Product, Customer } from '@/types/lumina';

const PRODUCTS: Product[] = [
    { id: 'p1', name: 'Premium Vodka Bottle', description: 'Grey Goose', category: 'Bottle', station: 'bar', cost: 30, price: 150, stock: 50, warehouseStock: 200, isAvailable: true },
    { id: 'p2', name: 'Champagne Magnum', description: 'Moet & Chandon', category: 'Bottle', station: 'bar', cost: 50, price: 300, stock: 20, warehouseStock: 100, isAvailable: true },
    { id: 'p3', name: 'Craft Cocktail', description: 'Signature Mix', category: 'Cocktail', station: 'bar', cost: 5, price: 20, stock: 500, warehouseStock: 500, isAvailable: true },
    { id: 'p4', name: 'Beer Bucket', description: '6x Corona', category: 'Beer', station: 'bar', cost: 10, price: 40, stock: 100, warehouseStock: 300, isAvailable: true },
    { id: 'p5', name: 'VIP Table Service', description: 'Full Service', category: 'Service', station: 'bar', cost: 0, price: 500, stock: 10, warehouseStock: 10, isAvailable: true },
];

const CUSTOMERS: Partial<Customer>[] = [
    { id: 'c1', name: 'Alice V.', segment: 'VIP' },
    { id: 'c2', name: 'Bob M.', segment: 'General' },
    { id: 'c3', name: 'Charlie D.', segment: 'General' },
    { id: 'c4', name: 'Diana P.', segment: 'VIP' },
    { id: 'c5', name: 'Evan R.', segment: 'Corporate' },
];

function randomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomItem<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

export function generateMockDataset(count: number = 500): Order[] {
    const orders: Order[] = [];
    const baseTime = new Date('2026-01-10T20:00:00').getTime(); // Event starts 8 PM

    for (let i = 0; i < count; i++) {
        // Simulate realistic time distribution (Peak 11 PM - 2 AM)
        // Gaussian-like distribution centered around +4 hours (Midnight)
        const hourOffset = Math.floor(Math.abs(randomInt(-2, 8) + randomInt(-2, 8)) / 2);
        const timestamp = baseTime + (hourOffset * 3600000) + randomInt(0, 3600000);

        const numItems = randomInt(1, 4);
        const items = [];
        let total = 0;

        for (let j = 0; j < numItems; j++) {
            const product = randomItem(PRODUCTS);
            const quantity = randomInt(1, 2);
            items.push({
                ...product,
                quantity,
                appliedPrice: product.price // No discounts for now
            });
            total += product.price * quantity;
        }

        orders.push({
            id: `ord_${i}`,
            zoneId: 'z1',
            items,
            total,
            tipAmount: Math.floor(total * 0.1),
            status: OrderStatus.COMPLETED,
            timestamp,
            customerName: randomItem(CUSTOMERS).name,
            paymentStatus: 'paid',
            deviceInfo: {
                userAgent: 'Mozilla/5.0...',
                language: 'en-US'
            },
            metadata: {
                isFirstOrder: Math.random() > 0.7,
                sessionDurationSeconds: randomInt(30, 300)
            }
        });
    }

    return orders.sort((a, b) => a.timestamp - b.timestamp);
}
