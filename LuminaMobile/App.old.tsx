import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  Modal,
  ActivityIndicator,
  StatusBar,
  Platform
} from 'react-native';
import * as Haptics from 'expo-haptics';

// --- TYPES ---
type Product = {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  imageUrl?: string;
};

type CartItem = Product & { quantity: number; };

type Order = {
  id: string;
  pickupCode: string;
  total: number;
  status: 'confirmed';
};

// --- MOCK DATA ---
const MOCK_PRODUCTS: Product[] = [
  { id: '1', name: 'Cyber Cerveza', description: 'Lager premium de fermentación criogénica.', category: 'Cervezas', price: 5000, stock: 100, imageUrl: 'https://via.placeholder.com/150/00F0FF/000000?text=BEER' },
  { id: '2', name: 'Neon Gin', description: 'Infusión de moras eléctricas y tónica.', category: 'Tragos', price: 8500, stock: 50, imageUrl: 'https://via.placeholder.com/150/BD00FF/000000?text=GIN' },
  { id: '3', name: 'Tech Burger', description: 'Carne sintética de alta calidad con queso azul.', category: 'Comida', price: 12000, stock: 20, imageUrl: 'https://via.placeholder.com/150/FFFFFF/000000?text=BURGER' },
  { id: '4', name: 'Glitch Fries', description: 'Papas fritas con salsa secreta del sistema.', category: 'Comida', price: 4500, stock: 0, imageUrl: 'https://via.placeholder.com/150/FF0055/000000?text=FRIES' },
  { id: '5', name: 'Bio Water', description: 'Agua purificada nivel molecular.', category: 'Bebidas', price: 2500, stock: 200 },
];

const CATEGORIES = ['Todos', 'Cervezas', 'Tragos', 'Comida', 'Bebidas'];

// --- THEME ---
const COLORS = {
  bg: '#050505',
  cardBg: '#101010',
  cyan: '#00F0FF',
  purple: '#BD00FF',
  text: '#FFFFFF',
  textMuted: '#888888',
  success: '#34C759',
  border: '#222222',
};

// --- COMPONENTS ---

const Header = ({ selectedCategory, onSelectCategory }: { selectedCategory: string, onSelectCategory: (c: string) => void }) => (
  <View style={styles.headerContainer}>
    <View style={styles.headerTop}>
      <Text style={styles.headerTitle}>LUMINA <Text style={{ fontWeight: '300' }}>SYSTEM</Text></Text>
      <View style={styles.secureBadge}>
        <View style={styles.secureDot} />
        <Text style={styles.secureText}>SECURE TUNNEL</Text>
      </View>
    </View>
    <FlatList
      horizontal
      data={CATEGORIES}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.tabsContainer}
      keyExtractor={(item) => item}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onSelectCategory(item);
          }}
          style={[styles.tab, item === selectedCategory && styles.tabActive]}
        >
          <Text style={[styles.tabText, item === selectedCategory && styles.tabTextActive]}>{item}</Text>
        </TouchableOpacity>
      )}
    />
  </View>
);

const ProductCard = ({ product, onAdd }: { product: Product, onAdd: (p: Product) => void }) => {
  const soldOut = product.stock <= 0;

  return (
    <View style={[styles.card, soldOut && styles.cardSoldOut]}>
      <View style={styles.cardImageContainer}>
        {product.imageUrl ? (
          <Image source={{ uri: product.imageUrl }} style={styles.cardImage} />
        ) : (
          <View style={[styles.cardImage, { backgroundColor: '#1a1a1a', justifyContent: 'center', alignItems: 'center' }]}>
            <Text style={{ color: '#333' }}>NO IMG</Text>
          </View>
        )}
        {soldOut && (
          <View style={styles.soldOutOverlay}>
            <Text style={styles.soldOutText}>SOLD OUT</Text>
          </View>
        )}
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{product.name}</Text>
        <Text style={styles.cardDesc} numberOfLines={2}>{product.description}</Text>
        <View style={styles.cardFooter}>
          <Text style={styles.cardPrice}>${product.price.toLocaleString()}</Text>
          <TouchableOpacity
            style={[styles.addButton, soldOut && styles.addButtonDisabled]}
            disabled={soldOut}
            onPress={() => onAdd(product)}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// --- MAIN APP COMPONENT ---

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isPaymentVisible, setPaymentVisible] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const products = MOCK_PRODUCTS.filter(p => selectedCategory === 'Todos' || p.category === selectedCategory);

  const addToCart = (product: Product) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setCart(prev => {
      const existing = prev.find(p => p.id === product.id);
      if (existing) {
        return prev.map(p => p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handlePay = () => {
    setIsProcessing(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);

    setTimeout(() => {
      setIsProcessing(false);
      setPaymentVisible(false);
      setCart([]);

      const newOrder: Order = {
        id: Math.random().toString(36).substr(2, 9).toUpperCase(),
        pickupCode: `A-${Math.floor(Math.random() * 90) + 10}`,
        total: total,
        status: 'confirmed'
      };

      setConfirmedOrder(newOrder);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 2000);
  };

  // --- TICKET VIEW ---
  if (confirmedOrder) {
    return (
      <View style={styles.ticketContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#050505" />
        <View style={styles.ticketContent}>
          <View style={styles.successIconContainer}>
            <Text style={{ fontSize: 40, color: '#000' }}>✓</Text>
          </View>
          <Text style={styles.ticketTitle}>ORDEN CONFIRMADA</Text>
          <Text style={styles.ticketSubtitle}>Tu pedido está siendo preparado.</Text>

          <View style={styles.ticketCard}>
            <Text style={styles.pickupLabel}>PICKUP CODE</Text>
            <Text style={styles.pickupCode}>{confirmedOrder.pickupCode}</Text>
            <View style={styles.qrPlaceholder}>
              <Text style={styles.qrText}>[ QR CODE ]</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.newOrderButton}
            onPress={() => setConfirmedOrder(null)}
          >
            <Text style={styles.newOrderText}>NUEVA ORDEN</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // --- MAIN VIEW ---
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#050505" />
      <Header selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />

      <FlatList
        data={products}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => <ProductCard product={item} onAdd={addToCart} />}
      />

      {/* FLOATING CART */}
      {cart.length > 0 && (
        <View style={styles.floatContainer}>
          <TouchableOpacity
            style={styles.cartButton}
            onPress={() => setPaymentVisible(true)}
            activeOpacity={0.8}
          >
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{itemCount}</Text>
            </View>
            <Text style={styles.cartText}>VER BOLSA</Text>
            <Text style={styles.cartTotal}>${total.toLocaleString()}</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* PAYMENT MODAL */}
      <Modal
        visible={isPaymentVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setPaymentVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalBackdrop} onPress={() => setPaymentVisible(false)} />
          <View style={styles.modalContent}>
            <View style={styles.modalIndicator} />
            <Text style={styles.modalTitle}>Resumen</Text>

            {cart.map(item => (
              <View key={item.id} style={styles.cartRow}>
                <Text style={styles.cartItemName}>{item.quantity}x {item.name}</Text>
                <Text style={styles.cartItemPrice}>${(item.price * item.quantity).toLocaleString()}</Text>
              </View>
            ))}

            <View style={styles.divider} />
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total a pagar</Text>
              <Text style={styles.totalValue}>${total.toLocaleString()}</Text>
            </View>

            <TouchableOpacity
              style={[styles.payButton, isProcessing && styles.payButtonDisabled]}
              onPress={handlePay}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text style={styles.payButtonText}>Pagar con G Pay</Text>
              )}
            </TouchableOpacity>

            <View style={styles.safeAreaBottom} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  // Header
  headerContainer: {
    paddingTop: Platform.OS === 'android' ? 40 : 60,
    backgroundColor: 'rgba(5,5,5,0.95)',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    zIndex: 10,
  },
  headerTop: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 1,
  },
  secureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(52, 199, 89, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(52, 199, 89, 0.1)',
  },
  secureDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.success,
  },
  secureText: {
    color: COLORS.success,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  tabsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 0,
  },
  tab: {
    marginRight: 24,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: COLORS.cyan,
  },
  tabText: {
    color: COLORS.textMuted,
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  tabTextActive: {
    color: COLORS.cyan,
  },
  // List
  listContent: {
    padding: 20,
    paddingBottom: 120, // Space for fab
  },
  // Product Card
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    height: 120,
  },
  cardSoldOut: {
    opacity: 0.5,
  },
  cardImageContainer: {
    width: 100,
    height: '100%',
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  soldOutOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  soldOutText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    borderWidth: 1,
    borderColor: '#fff',
    padding: 4,
  },
  cardContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  cardTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  cardDesc: {
    color: COLORS.textMuted,
    fontSize: 12,
    lineHeight: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardPrice: {
    color: COLORS.cyan,
    fontSize: 16,
    fontWeight: '700',
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonDisabled: {
    backgroundColor: '#333',
  },
  addButtonText: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: -2,
  },
  // Floating Cart
  floatContainer: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
  },
  cartButton: {
    backgroundColor: 'rgba(20, 20, 20, 0.9)',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(0, 240, 255, 0.3)',
    shadowColor: "#00F0FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  cartBadge: {
    backgroundColor: COLORS.cyan,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cartText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 2,
    marginLeft: 12,
  },
  cartTotal: {
    color: COLORS.cyan,
    fontSize: 18,
    fontWeight: '700',
  },
  // Modal
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  modalBackdrop: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: '#1C1C1E',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  modalIndicator: {
    width: 40,
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 24,
  },
  cartRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cartItemName: {
    color: '#bbb',
    fontSize: 16,
  },
  cartItemPrice: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#333',
    marginVertical: 16,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 30,
  },
  totalLabel: {
    color: '#888',
    fontSize: 14,
  },
  totalValue: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  payButton: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payButtonDisabled: {
    backgroundColor: '#555',
  },
  payButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  safeAreaBottom: {
    height: 20,
  },
  // Ticket
  ticketContainer: {
    flex: 1,
    backgroundColor: COLORS.bg,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  ticketContent: {
    width: '100%',
    alignItems: 'center',
  },
  successIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.cyan,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: COLORS.cyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  ticketTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 1,
  },
  ticketSubtitle: {
    color: COLORS.textMuted,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 40,
  },
  ticketCard: {
    backgroundColor: '#fff',
    width: '100%',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    marginBottom: 40,
  },
  pickupLabel: {
    color: '#888',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 4,
  },
  pickupCode: {
    color: '#000',
    fontSize: 64,
    fontWeight: '900',
    marginBottom: 24,
  },
  qrPlaceholder: {
    width: 200,
    height: 200,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  qrText: {
    color: '#aaa',
    fontWeight: 'bold',
  },
  newOrderButton: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  newOrderText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
});
