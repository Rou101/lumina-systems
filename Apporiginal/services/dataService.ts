
import { useState, useEffect } from 'react';
import { Order, OrderStatus, Product, StaffMember, EventConfig, PickupZone, PaymentStatus, Promotion, BrandPalette, Customer } from '../types';
import { getDefaultPalettes, applyTheme } from './themeService';

// --- MOCK DATA ---
const INITIAL_PRODUCTS: Product[] = [
  { 
      id: '1', name: 'Pisco Sour Catedral', description: 'Clásico chileno 40°', category: 'Coctelería', station: 'bar', 
      imageUrl: 'https://images.unsplash.com/photo-1629247312953-294b5952c423?auto=format&fit=crop&w=300&q=80', 
      isAvailable: true, 
      cost: 2000, price: 6500, priceVip: 5500, price2: 6000, price3: 7000,
      stock: 50, warehouseStock: 500 
  },
  { 
      id: '2', name: 'Shop Artesanal IPA', description: 'Cerveza local', category: 'Cervezas', station: 'bar', 
      imageUrl: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=300&q=80', 
      isAvailable: true, 
      cost: 1200, price: 4500, priceVip: 3500, price2: 4000, price3: 5000,
      stock: 20, warehouseStock: 200 
  },
  { 
      id: '4', name: 'Burger Doble Queso', description: 'Doble carne smash', category: 'Comida', station: 'kitchen', 
      imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80', 
      isAvailable: true, 
      cost: 3500, price: 8500, priceVip: 7500, price2: 8000, price3: 9000,
      stock: 0, warehouseStock: 1000 // Mock sold out
  },
];

const DEFAULT_ZONES: PickupZone[] = [
  { id: 'z1', name: 'Barra General', code: 'GEN', isActive: true },
  { id: 'z2', name: 'Zona VIP', code: 'VIP', isActive: true },
];

const DEFAULT_STAFF: StaffMember[] = [
  { id: 's1', name: 'Manager Evento', pin: '9999', role: 'manager', assignedZoneIds: ['z1', 'z2'], nationalId: '12.345.678-9' },
  { id: 's2', name: 'Runner Barra 1', pin: '1234', role: 'runner', assignedZoneIds: ['z1'], nationalId: '18.999.888-K' },
  { id: 's3', name: 'Scanner Acceso', pin: '1111', role: 'scanner', assignedZoneIds: ['z1', 'z2'], nationalId: '15.555.444-3' },
];

const INITIAL_CUSTOMERS: Customer[] = [
    { id: 'c1', name: 'Juan Pérez', email: 'juan@gmail.com', segment: 'General', totalSpent: 0, visitCount: 1, tags: [] },
    { id: 'c2', name: 'Maria VIP', email: 'maria@empresa.com', segment: 'VIP', totalSpent: 50000, visitCount: 3, tags: ['High Value'] },
];

const INITIAL_PROMOS: Promotion[] = [
    {
        id: 'promo_trigger_1',
        type: 'flash',
        title: '¡GOL DE LA UC!',
        description: '50% en Schop IPA por 5 minutos',
        discountPercent: 50,
        active: false,
        triggerLabel: 'GOL CATÓLICA',
        durationMinutes: 5,
        startsAt: 0,
        applicableProductIds: ['2'] // Shop IPA
    },
    {
        id: 'promo_trigger_2',
        type: 'flash',
        title: 'TIMEOUT BREAK',
        description: '2x1 en Pisco Sour',
        discountPercent: 50, // Math for 2x1 approx
        active: false,
        triggerLabel: 'TIEMPO FUERA',
        durationMinutes: 2,
        startsAt: 0,
        applicableProductIds: ['1'] // Pisco
    }
];

const defaultPalettes = getDefaultPalettes();

let currentConfig: EventConfig = {
  name: "Lumina Fest 2024",
  activePalette: defaultPalettes[0],
  generatedPalettes: defaultPalettes,
  pickupZones: DEFAULT_ZONES,
  staff: DEFAULT_STAFF,
  activePromotions: INITIAL_PROMOS,
  customers: INITIAL_CUSTOMERS
};

// Initial theme application
applyTheme(currentConfig.activePalette);

let ordersState: Order[] = [];
let productsState: Product[] = [...INITIAL_PRODUCTS];
let pickupCounter = 100;

type Listener = () => void;
const listeners: Set<Listener> = new Set();
const notifyListeners = () => listeners.forEach(l => l());

// --- API METHODS ---

export const getProducts = async (): Promise<Product[]> => [...productsState];

export const registerCustomer = (name: string, email: string): Customer => {
    let customer = currentConfig.customers.find(c => c.email.toLowerCase() === email.toLowerCase());
    if (!customer) {
        customer = {
            id: `c-${Date.now()}`,
            name,
            email,
            segment: 'General', 
            totalSpent: 0,
            visitCount: 1,
            tags: ['New']
        };
        currentConfig = { ...currentConfig, customers: [...currentConfig.customers, customer] };
        notifyListeners();
    }
    return customer;
};

export const importCustomers = (newCustomers: Customer[]) => {
    const updatedList = [...currentConfig.customers];
    newCustomers.forEach(nc => {
        const idx = updatedList.findIndex(c => c.email.toLowerCase() === nc.email.toLowerCase());
        if(idx !== -1) {
            updatedList[idx] = { ...updatedList[idx], ...nc, id: updatedList[idx].id }; 
        } else {
            updatedList.push(nc);
        }
    });
    currentConfig = { ...currentConfig, customers: updatedList };
    notifyListeners();
};

export const transferStock = (productId: string, amount: number) => {
    const idx = productsState.findIndex(p => p.id === productId);
    if (idx !== -1) {
        const product = productsState[idx];
        if (product.warehouseStock >= amount) {
            productsState[idx] = {
                ...product,
                warehouseStock: product.warehouseStock - amount,
                stock: product.stock + amount
            };
            notifyListeners();
        }
    }
};

export const importProducts = (newProducts: Product[]) => {
    productsState = newProducts;
    notifyListeners();
};

export const updateProductStock = (productId: string, newStock: number) => {
    const idx = productsState.findIndex(p => p.id === productId);
    if (idx !== -1) {
        productsState[idx] = { ...productsState[idx], stock: Math.max(0, newStock) };
        notifyListeners();
    }
};

export const toggleProductAvailability = (productId: string) => {
    const idx = productsState.findIndex(p => p.id === productId);
    if (idx !== -1) {
        productsState[idx] = { ...productsState[idx], isAvailable: !productsState[idx].isAvailable };
        notifyListeners();
    }
};

export const sendOrder = async (order: Order) => {
    pickupCounter++;
    const code = `${currentConfig.pickupZones.find(z => z.id === order.zoneId)?.code || 'A'}-${pickupCounter}`;
    
    for (const item of order.items) {
        const product = productsState.find(p => p.id === item.id);
        if (product && product.stock < item.quantity) {
            throw new Error(`Stock insuficiente para ${item.name}`);
        }
    }

    const newOrder: Order = {
        ...order,
        pickupCode: order.status === OrderStatus.HELD ? undefined : code,
        paymentStatus: 'paid', 
    };

    ordersState = [...ordersState, newOrder];
    
    if (order.customerEmail) {
        const cIdx = currentConfig.customers.findIndex(c => c.email === order.customerEmail);
        if (cIdx !== -1) {
            const cust = currentConfig.customers[cIdx];
            currentConfig.customers[cIdx] = {
                ...cust,
                totalSpent: cust.totalSpent + order.total,
                visitCount: cust.visitCount + 1
            };
        }
    }
    
    order.items.forEach(item => {
        const idx = productsState.findIndex(prod => prod.id === item.id);
        if (idx !== -1) {
            productsState[idx].stock = Math.max(0, productsState[idx].stock - item.quantity);
        }
    });

    notifyListeners();
    return newOrder;
};

export const redeemWalletOrder = async (orderId: string) => {
    const idx = ordersState.findIndex(o => o.id === orderId);
    if (idx === -1) throw new Error("Order not found");
    
    pickupCounter++;
    const zoneCode = currentConfig.pickupZones.find(z => z.id === ordersState[idx].zoneId)?.code || 'A';

    ordersState[idx] = {
        ...ordersState[idx],
        status: OrderStatus.CONFIRMED, 
        pickupCode: `${zoneCode}-${pickupCounter}`,
        timestamp: Date.now()
    };
    notifyListeners();
    return ordersState[idx];
};

export const markOrderReady = async (orderId: string) => {
    const idx = ordersState.findIndex(o => o.id === orderId);
    if (idx !== -1) {
        ordersState[idx] = { ...ordersState[idx], status: OrderStatus.READY_FOR_PICKUP };
        notifyListeners();
    }
};

export const completePickupOrder = async (orderId: string) => {
    const idx = ordersState.findIndex(o => o.id === orderId);
    if (idx !== -1) {
        ordersState[idx] = { ...ordersState[idx], status: OrderStatus.COMPLETED };
        notifyListeners();
    }
};

export const validatePickupCode = async (code: string) => {
    const order = ordersState.find(o => o.pickupCode?.toLowerCase() === code.toLowerCase());
    if (!order) throw new Error("Código inválido");
    return order;
};

export const updateEventConfig = (newConfig: EventConfig) => {
    currentConfig = newConfig;
    applyTheme(currentConfig.activePalette); // APPLY THEME HERE
    notifyListeners();
};

export const addPromotion = (promotion: Promotion) => {
    const now = Date.now();
    const finalPromo: Promotion = {
        ...promotion,
        startsAt: now,
        endsAt: (promotion.type === 'flash' && promotion.durationMinutes) 
                ? now + (promotion.durationMinutes * 60000) 
                : undefined
    };

    currentConfig = { 
        ...currentConfig, 
        activePromotions: [...currentConfig.activePromotions, finalPromo] 
    };
    notifyListeners();
};

export const togglePromotion = (promoId: string) => {
    const updatedPromos = currentConfig.activePromotions.map(p => 
        p.id === promoId ? { ...p, active: !p.active } : p
    );
    currentConfig = { ...currentConfig, activePromotions: updatedPromos };
    notifyListeners();
};

// --- NEW: HYPE TRIGGER LOGIC ---
export const activateTrigger = (triggerId: string) => {
    const now = Date.now();
    const updatedPromos = currentConfig.activePromotions.map(p => {
        if (p.id === triggerId) {
            return {
                ...p,
                active: true,
                startsAt: now,
                endsAt: p.durationMinutes ? now + (p.durationMinutes * 60000) : undefined
            };
        }
        return p;
    });
    
    currentConfig = { ...currentConfig, activePromotions: updatedPromos };
    notifyListeners();
};

export const downloadCSVTemplate = () => {
    const headers = "Nombre,Costo,Precio General,Precio VIP,Precio 2,Precio 3,Descripcion,Categoria,Estacion(bar/cocina),Stock Inicial,Stock Bodega,ImgUrl,Grupos Permitidos (ID separados por coma)";
    const example = "Cerveza Lager,1000,4000,3500,3800,4200,Cerveza fria,Cervezas,bar,50,500,https://example.com/beer.jpg,VIP_ZONE;CORP_A";
    const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + example;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "plantilla_productos_lumina.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const downloadCustomersCSVTemplate = () => {
    const headers = "Nombre,Email,Segmento,Grupo Externo ID";
    const example = "Carlos Cliente,carlos@gmail.com,General,\nAna Vip,ana@reinicialo.cl,Reinicialo,CORP_A";
    const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + example;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "plantilla_clientes_lumina.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const downloadFilteredCustomersCSV = (customers: Customer[]) => {
    const headers = "ID,Nombre,Email,Segmento,Grupo Externo,Gasto Total,Visitas";
    const rows = customers.map(c => 
        `${c.id},${c.name},${c.email},${c.segment},${c.externalGroupId || ''},${c.totalSpent},${c.visitCount}`
    ).join("\n");
    
    const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `clientes_filtrados_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const useRealTimeData = () => {
  const [data, setData] = useState({ orders: ordersState, config: currentConfig, products: productsState });
  
  useEffect(() => {
    const listener = () => setData({ orders: ordersState, config: currentConfig, products: productsState });
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  }, []);
  
  return data;
};
