
// Domain Entities

// Where is it prepared? (For KDS routing)
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

    // Logistics & Costs
    cost: number; // Costo unitario (Transparencia)

    // Multi-Price Tiers
    price: number; // General
    priceVip?: number;
    price2?: number; // Early Bird / Tramo 2
    price3?: number; // Last Minute / Tramo 3

    // Stock Management
    stock: number; // Active Stock (Punto de Venta)
    warehouseStock: number; // Bodega Central
    optimalStock?: number;

    // EXCLUSIVE ACCESS
    allowedGroups?: string[]; // IDs of user groups (e.g., 'Corporate_A', 'Wedding_B'). If empty, public.
}

export interface CartItem extends Product {
    quantity: number;
    appliedPrice: number; // The price at the moment of purchase (handling Promos)
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
    customerEmail?: string; // Link to CRM
    paymentMode?: PaymentMode;
    pickupCode?: string;
    paymentStatus: PaymentStatus;

    // ANALYTICS
    deviceInfo?: {
        userAgent: string;
        language: string;
    };
    metadata?: {
        isFirstOrder: boolean;
        sessionDurationSeconds: number; // Time from scan to pay
    };
}

// --- CRM & FANBASE ---
export interface Customer {
    id: string;
    name: string;
    email: string;
    segment: string; // 'General', 'VIP', 'Reinicialo', 'Corporate'
    externalGroupId?: string; // Link to Product allowedGroups (e.g. 'Entrada_Pack_Grupal')
    totalSpent: number;
    visitCount: number;
    tags: string[];

    // INTELLIGENCE FIELDS (Phase 2)
    preferences?: {
        favoriteCategory: string; // e.g. 'cocktails'
        priceSensitivity: 'low' | 'medium' | 'high'; // Derived from avgTicket
        isEarlyBird: boolean; // Computed from entry time
    };
    avgTicket?: number;
    lastVisit?: number;
    deviceInfo?: {
        model: string;
        os: string;
        language: string; // For i18n targeting
    };
    referralSource?: string; // 'instagram', 'qr_flyer', 'friend'
}

// Marketing Mechanics
export type PromotionType = 'flash' | 'fixed';

export interface Promotion {
    id: string;
    type: PromotionType; // 'flash' has timer, 'fixed' is infinite until disabled
    title: string;
    description: string;
    discountPercent: number;
    sponsorName?: string;
    sponsorLogo?: string;
    imageUrl?: string; // CUSTOM IMAGE FOR OVERLAY
    active: boolean;
    applicableProductIds?: string[];

    // Targeting & Timer
    targetZoneIds?: string[]; // Spatial segmentation
    targetSegments?: string[]; // CRM segmentation (New)

    startsAt: number; // Always set
    endsAt?: number; // Only for 'flash'
    durationMinutes?: number; // Only for 'flash'

    // HYPE TRIGGERS (New Features)
    triggerLabel?: string; // If present, acts as a template for a live event (e.g. "GOL CATOLICA")
}

// --- BRANDING INTELLIGENCE ---
export interface BrandPalette {
    id: string;
    name: string;
    primary: string;
    secondary: string;
    background: string;
    cardBg: string;
    text: string;
    mode: 'light' | 'dark'; // New: Visual Mode
}

export interface PickupZone {
    id: string;
    name: string;
    code: string;
    isActive: boolean;
}

export type StaffRole = 'manager' | 'runner' | 'scanner' | 'kitchen';

export interface StaffMember {
    id: string;
    pin: string;
    role: StaffRole;
    assignedZoneIds: string[];

    // Detailed HR Data
    name: string;
    nationalId?: string; // RUT/DNI
    age?: number;
    address?: string;
    photoUrl?: string; // ID Photo
    performanceMetrics?: {
        ordersHandled: number;
        avgTime: number;
    };
}

export interface EventConfig {
    name: string;
    logoUrl?: string;
    activePalette: BrandPalette;
    generatedPalettes: BrandPalette[];
    pickupZones: PickupZone[];
    staff: StaffMember[];
    activePromotions: Promotion[];
    customers: Customer[]; // New CRM Database
}

export type AdminTab = 'live' | 'branding' | 'inventory' | 'marketing' | 'crew' | 'logistics' | 'crm';
