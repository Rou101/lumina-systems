type Listener<T> = (data: T) => void;

interface Transaction {
    id: string;
    source: string;
    amount: number;
    timestamp: number;
}

interface NodeUpdate {
    id: string;
    status: 'LIVE' | 'PROVISIONING' | 'OFFLINE';
    latency: string;
    revenue: string;
}

export type Intensity = 'normal' | 'high' | 'chaos' | 'idle';

class SimulationService {
    private intensity: Intensity = 'normal';
    private intervals: NodeJS.Timeout[] = [];
    private transactionListeners: Listener<Transaction>[] = [];
    private nodeListeners: Listener<NodeUpdate>[] = [];

    // Singleton instance
    private static instance: SimulationService;

    private constructor() { }

    public static getInstance(): SimulationService {
        if (!SimulationService.instance) {
            SimulationService.instance = new SimulationService();
        }
        return SimulationService.instance;
    }

    public setIntensity(intensity: Intensity) {
        this.intensity = intensity;
        this.restart();
    }

    public getIntensity(): Intensity {
        return this.intensity;
    }

    public onTransaction(cb: Listener<Transaction>) {
        this.transactionListeners.push(cb);
        return () => {
            this.transactionListeners = this.transactionListeners.filter(l => l !== cb);
        };
    }

    public onNodeUpdate(cb: Listener<NodeUpdate>) {
        this.nodeListeners.push(cb);
        return () => {
            this.nodeListeners = this.nodeListeners.filter(l => l !== cb);
        };
    }

    private restart() {
        this.intervals.forEach(clearInterval);
        this.intervals = [];

        if (this.intensity === 'idle') return;

        const speed = this.intensity === 'chaos' ? 100 : this.intensity === 'high' ? 500 : 2000;

        // Transaction Loop
        this.intervals.push(setInterval(() => {
            this.emitTransaction();
        }, speed));

        // Node Update Loop (Chaos only mostly)
        if (this.intensity === 'chaos' || this.intensity === 'high') {
            this.intervals.push(setInterval(() => {
                this.emitNodeUpdate();
            }, speed * 2));
        }
    }

    private emitTransaction() {
        const sources = ['Lolla CL', 'Ultra MIA', 'Priv-92', 'Tomorrowland', 'Coachella'];
        const amounts = this.intensity === 'chaos' ? [5.50, 10.00, 25.00] : [0.50, 1.50];

        const tx: Transaction = {
            id: `tx-${Date.now()}-${Math.floor(Math.random() * 999)}`,
            source: sources[Math.floor(Math.random() * sources.length)],
            amount: amounts[Math.floor(Math.random() * amounts.length)],
            timestamp: Date.now()
        };

        this.transactionListeners.forEach(cb => cb(tx));
    }

    private emitNodeUpdate() {
        const nodes = ['SCL', 'MIA', 'TKY'];
        const statuses: ('LIVE' | 'OFFLINE')[] = ['LIVE', 'LIVE', 'LIVE', 'OFFLINE'];
        const target = nodes[Math.floor(Math.random() * nodes.length)];

        const update: NodeUpdate = {
            id: target,
            status: Math.random() > 0.8 ? 'OFFLINE' : 'LIVE',
            latency: `${Math.floor(Math.random() * 100)}ms`,
            revenue: `$${(Math.random() * 5).toFixed(1)}M`
        };

        this.nodeListeners.forEach(cb => cb(update));
    }
}

export const simulationService = SimulationService.getInstance();
