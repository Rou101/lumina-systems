import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { BlurView } from 'expo-blur';
import { ShoppingCart, CheckCheck } from 'lucide-react-native';
import { orderStore, MobileTicket, TicketItem } from '../../store/orderStore';
import { useRouter } from 'expo-router';
import { useHaptic } from '../../hooks/useHaptic';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withSequence, withTiming, FadeInDown, ZoomIn } from 'react-native-reanimated';

// Defines products with their destination station
const PRODUCTS = [
    { id: '1', name: 'Heineken Silver', price: 5.00, station: 'bar', image: 'https://www.heineken.com/media-us/01fszvzz/heineken-silver-bottle.png?quality=85' },
    { id: '2', name: 'Red Bull', price: 4.50, station: 'bar', image: 'https://images.ctfassets.net/lcr8qbvxj7hz/4yC3X4X3X4X3X4X3X4X3X4/Red_Bull_Energy_Drink_250ml.png' },
    { id: '3', name: 'Water', price: 3.00, station: 'bar', image: 'https://www.smartwater.com/content/dam/nagbrands/us/smartwater/en/products/smartwater/en/products/smartwater-original/smartwater-original-1L.png' },
    { id: '4', name: 'Classic Burger', price: 12.00, station: 'kitchen', image: '' },
    { id: '5', name: 'Truffle Fries', price: 8.00, station: 'kitchen', image: '' },
];

export default function MenuScreen() {
    const router = useRouter();
    const { trigger } = useHaptic();
    const [cart, setCart] = useState<{ [key: string]: number }>({});
    const [status, setStatus] = useState<'browsing' | 'processing' | 'success'>('browsing');

    // Animations
    const badgeScales = PRODUCTS.reduce((acc, p) => ({ ...acc, [p.id]: useSharedValue(1) }), {} as Record<string, Animated.SharedValue<number>>);

    const addToCart = (id: string) => {
        trigger('light');
        setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));

        // Pop Animation
        if (badgeScales[id]) {
            badgeScales[id].value = withSequence(withSpring(1.5), withSpring(1));
        }
    };

    const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
    const totalPrice = Object.entries(cart).reduce((total, [id, qty]) => {
        const product = PRODUCTS.find(p => p.id === id);
        return total + (product ? product.price * qty : 0);
    }, 0);

    const handleCheckout = () => {
        trigger('selection');
        setStatus('processing');

        // Simulate Payment Processing
        setTimeout(() => {
            // Split Order Logic
            const barItems: TicketItem[] = [];
            const kitchenItems: TicketItem[] = [];

            Object.entries(cart).forEach(([id, qty]) => {
                const product = PRODUCTS.find(p => p.id === id);
                if (product) {
                    const item: TicketItem = { id, qty, name: product.name, price: product.price };
                    if (product.station === 'bar') barItems.push(item);
                    if (product.station === 'kitchen') kitchenItems.push(item);
                }
            });

            const newTickets: MobileTicket[] = [];
            const timestamp = Date.now();
            const orderIdBase = Math.floor(Math.random() * 1000);

            if (barItems.length > 0) {
                newTickets.push({
                    id: `B-${orderIdBase}`,
                    station: 'bar',
                    status: 'ready', // Simulate Bar is instant for demo
                    items: barItems,
                    timestamp
                });
            }

            if (kitchenItems.length > 0) {
                newTickets.push({
                    id: `K-${orderIdBase}`,
                    station: 'kitchen',
                    status: 'prep', // Kitchen takes time
                    items: kitchenItems,
                    timestamp
                });
            }

            // Dispatch
            orderStore.addTickets(newTickets);

            // Success
            trigger('success');
            setStatus('success');
            setCart({});

            // Redirect after celebration
            setTimeout(() => {
                setStatus('browsing');
                router.push('/(tabs)/orders');
            }, 2500);

        }, 1500);
    };

    if (status === 'success') {
        return (
            <Animated.View entering={FadeInDown} style={styles.centerContainer}>
                <Animated.View entering={ZoomIn.duration(500).springify()} style={{ alignItems: 'center' }}>
                    <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: '#10B981', justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>
                        <CheckCheck size={50} color="#000" strokeWidth={3} />
                    </View>
                    <Text style={[styles.title, { color: '#10B981', textAlign: 'center' }]}>PAYMENT ACCEPTED</Text>
                    <Text style={styles.subtitle}>TICKETS GENERATED</Text>
                </Animated.View>
            </Animated.View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>MENU</Text>
                <Text style={styles.subtitle}>BAR & KITCHEN</Text>
            </View>

            <ScrollView contentContainerStyle={styles.grid}>
                {PRODUCTS.map(product => {
                    const animatedStyle = useAnimatedStyle(() => ({
                        transform: [{ scale: badgeScales[product.id].value }]
                    }));

                    return (
                        <TouchableOpacity key={product.id} onPress={() => addToCart(product.id)} style={styles.card} activeOpacity={0.7}>
                            <View style={styles.imagePlaceholder}>
                                <View style={[styles.circle, product.station === 'kitchen' && { backgroundColor: '#f59e0b' }]} />
                                <Text style={{ position: 'absolute', color: '#000', fontWeight: 'bold', fontSize: 10 }}>{product.station}</Text>
                            </View>
                            <Text style={styles.productName}>{product.name}</Text>
                            <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
                            {cart[product.id] > 0 && (
                                <Animated.View style={[styles.badge, animatedStyle]}>
                                    <Text style={styles.badgeText}>{cart[product.id]}</Text>
                                </Animated.View>
                            )}
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            {/* Checkout Button */}
            {totalItems > 0 && (
                <Animated.View entering={FadeInDown.springify()} style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
                    <BlurView intensity={80} tint="dark" style={styles.bottomBar}>
                        <View>
                            <Text style={styles.totalLabel}>{totalItems} ITEMS</Text>
                            <Text style={styles.totalPrice}>${totalPrice.toFixed(2)}</Text>
                        </View>
                        <TouchableOpacity
                            onPress={handleCheckout}
                            disabled={status === 'processing'}
                            style={styles.checkoutBtn}
                        >
                            {status === 'processing' ? (
                                <ActivityIndicator color="#000" />
                            ) : (
                                <>
                                    <ShoppingCart color="#000" size={20} />
                                    <Text style={styles.checkoutText}>PAY</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </BlurView>
                </Animated.View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000', paddingTop: 60 },
    centerContainer: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center', padding: 20 },
    header: { paddingHorizontal: 20, marginBottom: 20 },
    title: { color: '#fff', fontSize: 32, fontWeight: '900', letterSpacing: -1 },
    subtitle: { color: '#555', fontSize: 12, fontWeight: 'bold', letterSpacing: 2 },
    grid: { paddingHorizontal: 10, flexDirection: 'row', flexWrap: 'wrap', paddingBottom: 100 },
    card: { width: '45%', backgroundColor: '#111', margin: '2.5%', borderRadius: 16, padding: 15, alignItems: 'center', borderWidth: 1, borderColor: '#222' },
    imagePlaceholder: { width: 80, height: 80, marginBottom: 10, justifyContent: 'center', alignItems: 'center' },
    circle: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#00f0ff', justifyContent: 'center', alignItems: 'center' },
    productName: { color: '#fff', fontWeight: 'bold', fontSize: 14, textAlign: 'center', marginBottom: 5 },
    productPrice: { color: '#aaa', fontSize: 12 },
    badge: { position: 'absolute', top: 10, right: 10, backgroundColor: '#00f0ff', width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    badgeText: { color: '#000', fontWeight: 'bold', fontSize: 10 },
    bottomBar: { padding: 20, paddingBottom: 40, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#333' },
    totalLabel: { color: '#aaa', fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },
    totalPrice: { color: '#fff', fontSize: 24, fontWeight: '900' },
    checkoutBtn: { backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 25, paddingVertical: 12, borderRadius: 30, gap: 10 },
    checkoutText: { color: '#000', fontWeight: 'bold', fontSize: 16 }
});
