import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Order, EventConfig, HypeState, Customer, Staff, Zone, KPIs } from '../types';
import { DataService } from '../services/dataService';

interface EventContextType {
    products: Product[];
    orders: Order[];
    eventConfig: EventConfig;
    hype: HypeState;
    kpis: KPIs;
    customers: Customer[];
    staff: Staff[];
    zones: Zone[];

    loading: boolean;
    refreshData: () => Promise<void>; // Kept for interface compatibility but logic is reactive now
    placeOrder: (order: Order) => Promise<void>;
    updateOrderStatus: (orderId: string, status: Order['status']) => void;
    triggerHype: (message: string) => void;
    updateProductStock: (id: string, stock: number) => void;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const useEventContext = () => {
    const context = useContext(EventContext);
    if (!context) {
        throw new Error('useEventContext must be used within an EventProvider');
    }
    return context;
};

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Sync state with DataStore
    const [products, setProducts] = useState<Product[]>(DataService.products);
    const [orders, setOrders] = useState<Order[]>(DataService.orders);
    const [eventConfig, setEventConfig] = useState<EventConfig>(DataService.eventConfig);
    const [hype, setHype] = useState<HypeState>(DataService.hype);
    const [customers, setCustomers] = useState<Customer[]>(DataService.customers);
    const [staff, setStaff] = useState<Staff[]>(DataService.staff);
    const [zones, setZones] = useState<Zone[]>(DataService.zones);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Subscribe to DataService changes
        const unsubscribe = DataService.subscribe(() => {
            setProducts([...DataService.products]);
            setOrders([...DataService.orders]);
            setEventConfig({ ...DataService.eventConfig });
            setHype({ ...DataService.hype });
            setCustomers([...DataService.customers]);
            setStaff([...DataService.staff]);
            setZones([...DataService.zones]);
        });

        return unsubscribe;
    }, []);

    // Wrappers for actions
    const refreshData = async () => { }; // No-op in reactive model
    const placeOrder = (o: Order) => DataService.createOrder(o).then();
    const updateOrderStatus = (id: string, s: Order['status']) => DataService.updateOrderStatus(id, s);
    const triggerHype = (msg: string) => DataService.triggerHype(msg);
    const updateProductStock = (id: string, stock: number) => DataService.updateProductStock(id, stock);

    const kpis = DataService.getKPIs();

    return (
        <EventContext.Provider value={{
            products, orders, eventConfig, hype, kpis, customers, staff, zones,
            loading, refreshData, placeOrder, updateOrderStatus, triggerHype, updateProductStock
        }}>
            {children}
        </EventContext.Provider>
    );
};
