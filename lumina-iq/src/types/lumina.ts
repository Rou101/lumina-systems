export type ProductStation = 'bar' | 'kitchen';

export interface Product {
    id: string;
    name: string;
    description: string;
    category: string;
    station: ProductStation;
    imageUrl?: string;
    dietary?: string[];
    isAvailable: boolean;
    cost: number;
    price: number;
    priceVip?: number;
    stock: number;
    warehouseStock: number;
    allowedGroups?: string[];
}

export interface CartItem extends Product {
    quantity: number;
    appliedPrice: number;
}

export enum OrderStatus {
    PENDING_CONFIRMATION = 'pending_confirmation',
    CONFIRMED = 'confirmed',
    READY_FOR_PICKUP = 'ready_for_pickup',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
    HELD = 'held'
}

export type PaymentMode = 'individual' | 'split' | 'gift';
export type PaymentStatus = 'pending' | 'paid';

export interface Order {
    id: string;
    zoneId: string;
    items: CartItem[];
    total: number;
    tipAmount: number;
    status: OrderStatus;
    timestamp: number;
    customerName?: string;
    customerEmail?: string;
    paymentMode?: PaymentMode;
    pickupCode?: string;
    paymentStatus: PaymentStatus;
    deviceInfo?: {
        userAgent: string;
        language: string;
    };
    metadata?: {
        isFirstOrder: boolean;
        sessionDurationSeconds: number;
    };
}

export interface Customer {
    id: string;
    name: string;
    email: string;
    segment: string;
    totalSpent: number;
    visitCount: number;
    tags: string[];
    preferences?: {
        favoriteCategory: string;
        priceSensitivity: 'low' | 'medium' | 'high';
        isEarlyBird: boolean;
    };
    avgTicket?: number;
    lastVisit?: number;
}
