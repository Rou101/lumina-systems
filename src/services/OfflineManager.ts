import { db } from './firebase';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';

interface QueuedAction {
    id: string;
    type: 'ADD_DOC' | 'UPDATE_DOC';
    collection: string;
    data: any;
    docId?: string; // For updates
    timestamp: number;
}

class OfflineManagerService {
    isOffline: boolean = !navigator.onLine;
    queue: QueuedAction[] = [];
    listeners: Function[] = [];

    constructor() {
        // Load Queue
        const saved = localStorage.getItem('lumina_offline_queue');
        if (saved) {
            this.queue = JSON.parse(saved);
        }

        // Listeners
        window.addEventListener('online', this.handleOnline);
        window.addEventListener('offline', this.handleOffline);
    }

    private handleOnline = () => {
        console.log('[OfflineManager] connection restored.');
        this.isOffline = false;
        this.notify();
        this.flushQueue();
    };

    private handleOffline = () => {
        console.log('[OfflineManager] connection lost.');
        this.isOffline = true;
        this.notify();
    };

    // --- Public API ---

    public subscribe(cb: Function) {
        this.listeners.push(cb);
        return () => {
            this.listeners = this.listeners.filter(l => l !== cb);
        };
    }

    private notify() {
        this.listeners.forEach(cb => cb(this.isOffline, this.queue.length));
    }

    // Generic Write Wrapper
    public async performWrite(type: 'ADD_DOC' | 'UPDATE_DOC', col: string, data: any, docId?: string) {
        if (this.isOffline) {
            // ENQUEUE
            console.warn('[OfflineManager] Network down. Enqueuing action:', type);
            this.queue.push({
                id: crypto.randomUUID(),
                type,
                collection: col,
                data,
                docId,
                timestamp: Date.now()
            });
            this.persist();
            this.notify();
            return;
        }

        // DIRECT EXECUTION
        try {
            await this.executeAction(type, col, data, docId);
        } catch (error) {
            console.error('[OfflineManager] Write failed, falling back to queue:', error);
            this.isOffline = true;
            this.queue.push({
                id: crypto.randomUUID(),
                type,
                collection: col,
                data,
                docId,
                timestamp: Date.now()
            });
            this.persist();
            this.notify();
        }
    }

    private async executeAction(type: string, col: string, data: any, docId?: string) {
        if (type === 'ADD_DOC') {
            await addDoc(collection(db, col), data);
        } else if (type === 'UPDATE_DOC' && docId) {
            const ref = doc(db, col, docId);
            await updateDoc(ref, data);
        }
    }

    private async flushQueue() {
        if (this.queue.length === 0) return;

        console.log(`[OfflineManager] Flushing ${this.queue.length} actions...`);
        const backupQueue = [...this.queue];
        this.queue = []; // Clear immediately to prevent double flush, restore on error
        this.persist();
        this.notify();

        for (const action of backupQueue) {
            try {
                // Conflict Strategy: Server Last-Write-Wins usually, but here we just push.
                // ideally we check timestamp but for MVP we just replay.
                await this.executeAction(action.type, action.collection, action.data, action.docId);
                console.log('[OfflineManager] Replayed:', action.id);
            } catch (error) {
                console.error('[OfflineManager] Replay failed for:', action.id, error);
                // Decide strategy: discard or requeue?
                // For now, partial Requeue could be dangerous (infinite loop). Log and Drop for MVP.
            }
        }
    }

    private persist() {
        localStorage.setItem('lumina_offline_queue', JSON.stringify(this.queue));
    }
}

export const OfflineManager = new OfflineManagerService();
