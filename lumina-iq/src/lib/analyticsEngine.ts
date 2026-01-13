import { Order, OrderItem } from '@/types/lumina';

export interface TimeBucket {
    time: string; // "22:00", "22:15"
    revenue: number;
    alcoholUnits: number;
    isPredicted: boolean;
    timestamp: number;
}

export const processTimeBuckets = (orders: Order[]): TimeBucket[] => {
    // 1. Sort orders by timestamp
    const sortedOrders = [...orders].sort((a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    if (sortedOrders.length === 0) return [];

    // 2. Define buckets (15 min intervals)
    // For this mock, we'll start from the first order time and go 4 hours forward
    const startTime = new Date(sortedOrders[0].timestamp);
    startTime.setMinutes(0, 0, 0); // Snap to nearest hour for cleanliness

    const buckets: TimeBucket[] = [];
    const bucketSizeMs = 15 * 60 * 1000; // 15 mins
    const numberOfBuckets = 16; // 4 hours worth of data

    for (let i = 0; i < numberOfBuckets; i++) {
        const bucketStart = new Date(startTime.getTime() + (i * bucketSizeMs));
        const bucketEnd = new Date(bucketStart.getTime() + bucketSizeMs);

        // Filter orders in this bucket
        const bucketOrders = sortedOrders.filter(o => {
            const t = new Date(o.timestamp).getTime();
            return t >= bucketStart.getTime() && t < bucketEnd.getTime();
        });

        // Calculate metrics
        const revenue = bucketOrders.reduce((acc, o) => acc + o.total, 0);
        const alcoholUnits = bucketOrders.reduce((acc, o) => {
            const drinks = o.items.filter(item => item.category === 'drink');
            return acc + drinks.reduce((sum, d) => sum + d.quantity, 0);
        }, 0);

        buckets.push({
            time: bucketStart.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
            revenue,
            alcoholUnits,
            isPredicted: false,
            timestamp: bucketStart.getTime()
        });
    }

    return buckets;
};

export const generatePredictions = (historicalBuckets: TimeBucket[]): TimeBucket[] => {
    // Simple Moving Average (SMA) of last 3 points
    const predictions: TimeBucket[] = [];
    const lastBucket = historicalBuckets[historicalBuckets.length - 1];
    let nextTimestamp = lastBucket.timestamp + (15 * 60 * 1000); // +15 mins

    // Deep copy to avoid mutating historical data for calculation source
    let calculationSource = [...historicalBuckets];

    for (let i = 0; i < 4; i++) { // Predict next 1 hour (4 buckets)
        const last3 = calculationSource.slice(-3);
        const avgRevenue = last3.reduce((acc, b) => acc + b.revenue, 0) / 3;
        const avgAlcohol = last3.reduce((acc, b) => acc + b.alcoholUnits, 0) / 3;

        // Apply a specialized "Partying Algorithm" (Growth Mult)
        // Simulates late night acceleration
        const growthMult = 1.05;

        const newBucket: TimeBucket = {
            time: new Date(nextTimestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
            revenue: Math.round(avgRevenue * growthMult),
            alcoholUnits: Math.round(avgAlcohol * growthMult),
            isPredicted: true,
            timestamp: nextTimestamp
        };

        predictions.push(newBucket);
        calculationSource.push(newBucket); // Add to source for next rolling average
        nextTimestamp += (15 * 60 * 1000);
    }

    return predictions;
};
