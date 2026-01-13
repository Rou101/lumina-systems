import { db } from '../services/firebase';
import { collection, addDoc, onSnapshot } from 'firebase/firestore';
import { Alert } from 'react-native';

export interface TicketItem {
    id: string;
    qty: number;
    name: string;
    price: number;
}

export interface MobileTicket {
    id: string; // Firebase Doc ID or custom ID
    station: 'bar' | 'kitchen';
    status: 'prep' | 'ready' | 'delivered';
    items: TicketItem[];
    timestamp: number;
}

class OrderStore {
    tickets: MobileTicket[] = [];
    listeners: Function[] = [];

    constructor() {
        // Subscribe to MY orders (For demo, we listen to ALL, but IRL filter by UserID)
        // This makes the "Kitchen" status update visible on the Phone automatically!
        onSnapshot(collection(db, 'orders'), (snapshot) => {
            this.tickets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MobileTicket));
            this.notify();
        });
    }

    async addTickets(newTickets: MobileTicket[]) {
        try {
            // Push to Firestore
            for (const ticket of newTickets) {
                await addDoc(collection(db, 'orders'), ticket);
            }
            // No need to manually update 'this.tickets' because onSnapshot will fire!
            console.log('Orders synced to Cloud');
        } catch (error) {
            console.error('Firebase Error:', error);
            Alert.alert('Offline Mode', 'Saving locally...');
        }
    }

    subscribe(listener: Function) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    notify() {
        this.listeners.forEach(l => l(this.tickets));
    }
}

export const orderStore = new OrderStore();
