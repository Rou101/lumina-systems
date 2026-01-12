import { db } from './firebase';
import { collection, onSnapshot, updateDoc, doc, addDoc } from 'firebase/firestore';
import { EventConfig, Product, Order } from '../types';

// Initial Mock Config (Static settings, could be moved to DB later)
const INITIAL_CONFIG: EventConfig = {
    id: 'evt-001',
    name: 'Lumina Masivo 2024',
    status: 'live',
    pickupZones: [
        { id: 'Z1', name: 'Bar Main Stage', queueLength: 4 },
        { id: 'Z2', name: 'Food Truck A', queueLength: 12 },
    ],
    activePromotions: [],
    staff: [],
    customers: []
};

// Singleton State using Closure
let state = {
    config: INITIAL_CONFIG,
    products: [] as Product[],
    orders: [] as Order[],
    listeners: [] as Function[]
};

const notify = () => state.listeners.forEach(l => l(state));

// --- REAL-TIME FIRESTORE SUBSCRIPTIONS ---

// --- REAL-TIME FIRESTORE SUBSCRIPTIONS ---
let isInitialized = false;

// 1. Subscribe to Products
function init() {
    if (isInitialized) return;
    isInitialized = true;

    console.log('[Firebase] Initializing Listeners...');

    onSnapshot(collection(db, 'products'), (snapshot) => {
        state.products = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Product));
        console.log(`[Firebase] Loaded ${state.products.length} products`);
        notify();
    }, (error) => {
        console.error('[Firebase] Products Error:', error);
    });

    // 2. Subscribe to Orders (Tickets)
    onSnapshot(collection(db, 'orders'), (snapshot) => {
        state.orders = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Order));
        console.log(`[Firebase] Synced ${state.orders.length} orders`);
        notify();
    }, (error) => {
        console.error('[Firebase] Orders Error:', error);
    });
}

// --- HOOK ---
import { useState, useEffect } from 'react';

export function useRealTimeData() {
    const [snapshot, setSnapshot] = useState(state);

    useEffect(() => {
        init(); // Start listeners on first component mount
        state.listeners.push(setSnapshot);
        // Trigger initial update
        setSnapshot({ ...state });
        return () => {
            state.listeners = state.listeners.filter(l => l !== setSnapshot);
        };
    }, []);

    return snapshot;
}

// --- ACTIONS ---
import { OfflineManager } from './OfflineManager';

export async function updateOrderStatus(orderId: string, status: 'ready' | 'delivered') {
    // Wrap with Offline Manager
    await OfflineManager.performWrite('UPDATE_STATUS', 'orders', { status }, orderId);
}

export function updateEventConfig(newConfig: EventConfig) {
    state.config = newConfig;
    notify();
    // Ideally save to DB too
}

export const completePickupOrder = async (orderId: string) => {
    await updateOrderStatus(orderId, 'delivered');
};

export const markOrderReady = async (orderId: string) => {
    await updateOrderStatus(orderId, 'ready');
};

// --- LEGACY / SHIM EXPORTS (To fix build errors during refactor) ---

export const activateTrigger = async (triggerId: string) => {
    console.log('[Firebase] Trigger activated:', triggerId);
    // TODO: Write to 'triggers' collection
};

export const updateProductStock = async (itemId: string, newStock: number) => {
    console.log('[Firebase] Stock updated:', itemId, newStock);
    // TODO: Write to 'products' collection
};

// Alias for backward compatibility if needed, or remove if unused
export const updateStock = updateProductStock;

export const validatePickupCode = async (code: string): Promise<boolean> => {
    console.log('[Firebase] Validating code:', code);
    return true; // Mock success
};

export const registerCustomer = async (data: any) => {
    console.log('[Firebase] Customer registered:', data);
    return { id: 'user_' + Date.now() };
};

export const getProducts = async (): Promise<Product[]> => {
    return state.products;
};

export const sendOrder = async (order: any) => {
    const payload = {
        ...order,
        status: 'prep',
        timestamp: Date.now()
    };

    // Offline Safe Write
    await OfflineManager.performWrite('ADD_ORDER', 'orders', payload);
};

export const addPromotion = async (promotion: any) => {
    console.log('[Firebase] Promotion added:', promotion);
    // TODO: Write to 'promotions' collection
    return { id: 'promo_' + Date.now() };
};

export const downloadCSVTemplate = () => {
    console.log('[Firebase] Downloading Inventory CSV...');
};

export const downloadCustomersCSVTemplate = () => {
    console.log('[Firebase] Downloading Customers CSV...');
};

export const toggleProductAvailability = async (productId: string) => {
    console.log('[Firebase] Toggled availability:', productId);
    // TODO: Write to Firestore
};

// Class Shim for EventContext (Legacy Support)
export class DataService {
    static products: Product[] = [];
    static orders: Order[] = [];
    static eventConfig: EventConfig = INITIAL_CONFIG;
    static hype: any = { level: 0, message: '' };
    static customers: any[] = [];
    static staff: any[] = [];
    static zones: any[] = [];

    static subscribe(callback: Function) {
        state.listeners.push(callback);
        return () => {
            state.listeners = state.listeners.filter(l => l !== callback);
        };
    }

    static async createOrder(order: any) { await sendOrder(order); }
    static async updateOrderStatus(id: string, status: any) { await updateOrderStatus(id, status); }
    static async triggerHype(msg: string) { await activateTrigger('hype_' + msg); }
    static async updateProductStock(id: string, stock: number) { await updateProductStock(id, stock); }
    static getKPIs() { return { revenue: 0, activeOrders: 0 }; }
}
