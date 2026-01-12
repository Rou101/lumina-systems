import SwiftUI
import Combine

// MARK: - 1. CONFIGURATION & THEME

enum LuminaTheme {
    static let background = Color(hex: "050505")
    static let cyanNeon = Color(hex: "00f0ff")
    static let electricPurple = Color(hex: "bd00ff")
    static let textPrimary = Color.white
    static let textSecondary = Color(hex: "9ca3af") // Gray-400
    static let surface = Color(hex: "121212")
}

extension Color {
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch hex.count {
        case 3: // RGB (12-bit)
            (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
        case 6: // RGB (24-bit)
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8: // ARGB (32-bit)
            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            (a, r, g, b) = (1, 1, 1, 0)
        }
        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue:  Double(b) / 255,
            opacity: Double(a) / 255
        )
    }
}

// MARK: - 2. MODELS

struct Product: Identifiable, Hashable {
    let id = UUID()
    let name: String
    let description: String
    let price: Double
    let category: String
    let stock: Int
    let imageUrl: String
}

struct CartItem: Identifiable {
    let id = UUID()
    let product: Product
    var quantity: Int
}

struct Order: Identifiable {
    let id = UUID()
    let pickupCode: String
    let status: String
    let total: Double
    let timestamp: Date
}

struct Promotion: Identifiable {
    let id = UUID()
    let triggerLabel: String
    let duration: TimeInterval
    let discountPercent: Double
}

// MARK: - 3. STORE MANAGER (VIEW MODEL)

class StoreManager: ObservableObject {
    @Published var products: [Product] = []
    @Published var cart: [CartItem] = []
    @Published var activeCategory: String = "Coctelería"
    @Published var activePromotion: Promotion?
    @Published var currentOrder: Order?
    
    // UI States
    @Published var isProcessingPayment = false
    @Published var showPaymentSheet = false
    @Published var showTicket = false
    @Published var hypeOverlayVisible = false
    
    init() {
        loadMockData()
        scheduleHypeTrigger()
    }
    
    var categories: [String] {
        Array(Set(products.map { $0.category })).sorted()
    }
    
    var filteredProducts: [Product] {
        products.filter { $0.category == activeCategory }
    }
    
    var cartTotal: Double {
        cart.reduce(0) { $0 + ($1.product.price * Double($1.quantity)) }
    }
    
    var cartItemCount: Int {
        cart.reduce(0) { $0 + $1.quantity }
    }
    
    func addToCart(_ product: Product) {
        if product.stock <= 0 { return }
        triggerHaptic(style: .medium)
        
        if let index = cart.firstIndex(where: { $0.product.id == product.id }) {
            cart[index].quantity += 1
        } else {
            cart.append(CartItem(product: product, quantity: 1))
        }
    }
    
    func removeFromCart(_ product: Product) {
        triggerHaptic(style: .light)
        if let index = cart.firstIndex(where: { $0.product.id == product.id }) {
            if cart[index].quantity > 1 {
                cart[index].quantity -= 1
            } else {
                cart.remove(at: index)
            }
        }
    }
    
    func processPayment() {
        triggerHaptic(style: .heavy)
        isProcessingPayment = true
        
        // Simulate Network Delay
        DispatchQueue.main.asyncAfter(deadline: .now() + 2.5) {
            self.isProcessingPayment = false
            self.showPaymentSheet = false
            
            // Create Order
            let code = "L-\(Int.random(in: 10...99))"
            self.currentOrder = Order(pickupCode: code, status: "PAID", total: self.cartTotal, timestamp: Date())
            self.cart = []
            
            // Show Ticket
            withAnimation {
                self.showTicket = true
            }
            self.triggerHaptic(style: .success)
        }
    }
    
    private func loadMockData() {
        self.products = [
            Product(name: "Neon Margarita", description: "Tequila, Blue Curaçao, Lime, Glow Stick", price: 12000, category: "Coctelería", stock: 50, imageUrl: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=500&q=60"),
            Product(name: "Cyber Martini", description: "Gin, Dry Vermouth, Olive, LED Coaster", price: 11000, category: "Coctelería", stock: 20, imageUrl: "https://images.unsplash.com/photo-1575023782549-62ca0d244b39?auto=format&fit=crop&w=500&q=60"),
            Product(name: "Void Stout", description: "Dark Beer with Coffee notes", price: 6000, category: "Cervezas", stock: 100, imageUrl: "https://images.unsplash.com/photo-1566633806327-68e152aaf26d?auto=format&fit=crop&w=500&q=60"),
            Product(name: "Quantum Burger", description: "Smashed patty, neon cheese, brioche", price: 14500, category: "Comida", stock: 15, imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=60"),
            Product(name: "Synapse Fries", description: "Truffle oil, parmesan, spicy mayo", price: 8000, category: "Comida", stock: 0, imageUrl: "https://images.unsplash.com/photo-1573080496987-a199f8cd4058?auto=format&fit=crop&w=500&q=60"), // SOLD OUT
            Product(name: "Data Stream Water", description: "Sparkling water, lemon twist", price: 3000, category: "Bebidas", stock: 200, imageUrl: "https://images.unsplash.com/photo-1564419320461-6870880221ad?auto=format&fit=crop&w=500&q=60"),
            Product(name: "VIP Table Access", description: "Zone A Access Code", price: 150000, category: "VIP", stock: 5, imageUrl: "https://images.unsplash.com/photo-1570872626485-d8ffea69f463?auto=format&fit=crop&w=500&q=60")
        ]
    }
    
    private func scheduleHypeTrigger() {
        DispatchQueue.main.asyncAfter(deadline: .now() + 10) {
            withAnimation(.spring()) {
                self.activePromotion = Promotion(triggerLabel: "HAPPY HOUR", duration: 300, discountPercent: 20)
                self.hypeOverlayVisible = true
            }
            self.triggerHaptic(style: .warning)
        }
    }
    
    private func triggerHaptic(style: UIImpactFeedbackGenerator.FeedbackStyle) {
        let generator = UIImpactFeedbackGenerator(style: style)
        generator.impactOccurred()
    }
    
    private func triggerHaptic(style: UINotificationFeedbackGenerator.FeedbackType) {
        let generator = UINotificationFeedbackGenerator()
        generator.notificationOccurred(style)
    }
}

// MARK: - 4. VIEWS

@main
struct LuminaClientApp: App {
    var body: some Scene {
        WindowGroup {
            MainView()
                .preferredColorScheme(.dark)
        }
    }
}

struct MainView: View {
    @StateObject private var store = StoreManager()
    
    var body: some View {
        ZStack {
            LuminaTheme.background.ignoresSafeArea()
            
            VStack(spacing: 0) {
                // Header
                HeaderView()
                
                // Categories
                CategoryTabs(store: store)
                    .padding(.vertical)
                
                // Grid
                ScrollView {
                    LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 16) {
                        ForEach(store.filteredProducts) { product in
                            ProductCard(product: product, store: store)
                        }
                    }
                    .padding(.horizontal)
                    .padding(.bottom, 100)
                }
            }
            .blur(radius: store.showPaymentSheet || store.showTicket ? 10 : 0)
            
            // Hype Overlay
            if let promo = store.activePromotion, store.hypeOverlayVisible {
                HypeOverlay(promotion: promo, isVisible: $store.hypeOverlayVisible)
            }
            
            // Floating Cart
            if !store.cart.isEmpty && !store.showPaymentSheet && !store.showTicket {
                VStack {
                    Spacer()
                    FloatingCartButton(store: store)
                        .padding()
                        .transition(.move(edge: .bottom).combined(with: .opacity))
                }
            }
            
            // Payment Sheet
            if store.showPaymentSheet {
                Color.black.opacity(0.4).ignoresSafeArea()
                    .onTapGesture { withAnimation { store.showPaymentSheet = false } }
                
                VStack {
                    Spacer()
                    PaymentSheetView(store: store)
                        .transition(.move(edge: .bottom))
                }
                .edgesIgnoringSafeArea(.bottom)
                .zIndex(2)
            }
            
            // Digital Ticket
            if store.showTicket, let order = store.currentOrder {
                DigitalTicketView(order: order, onClose: {
                    withAnimation {
                        store.showTicket = false
                        store.currentOrder = nil
                    }
                })
                .zIndex(3)
                .transition(.opacity.combined(with: .scale))
            }
        }
    }
}

// --- SUBVIEWS ---

struct HeaderView: View {
    var body: some View {
        HStack {
            HStack(spacing: 8) {
                ZStack {
                    RoundedRectangle(cornerRadius: 4)
                        .fill(LuminaTheme.cyanNeon)
                        .frame(width: 32, height: 32)
                    Text("L")
                        .font(.system(size: 20, weight: .black))
                        .foregroundColor(.black)
                }
                
                VStack(alignment: .leading, spacing: 2) {
                    Text("LUMINA.OS")
                        .font(.caption)
                        .fontWeight(.black)
                        .tracking(2)
                        .foregroundColor(.white)
                    
                    HStack(spacing: 4) {
                        Image(systemName: "lock.fill")
                            .font(.system(size: 8))
                            .foregroundColor(LuminaTheme.cyanNeon)
                        Text("SECURE TUNNEL")
                            .font(.system(size: 8, weight: .bold, design: .monospaced))
                            .foregroundColor(LuminaTheme.cyanNeon)
                    }
                }
            }
            
            Spacer()
            
            HStack(spacing: 6) {
                Circle()
                    .fill(Color.green)
                    .frame(width: 6, height: 6)
                Text("LIVE")
                    .font(.system(size: 10, weight: .bold))
                    .foregroundColor(.white)
            }
            .padding(.horizontal, 10)
            .padding(.vertical, 5)
            .background(Color.white.opacity(0.1))
            .clipShape(Capsule())
        }
        .padding()
        .background(.ultraThinMaterial)
    }
}

struct CategoryTabs: View {
    @ObservedObject var store: StoreManager
    
    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 20) {
                ForEach(store.categories, id: \.self) { category in
                    Button(action: {
                        withAnimation { store.activeCategory = category }
                    }) {
                        VStack(spacing: 4) {
                            Text(category.uppercased())
                                .font(.system(size: 14, weight: .bold))
                                .tracking(1)
                                .foregroundColor(store.activeCategory == category ? LuminaTheme.cyanNeon : LuminaTheme.textSecondary)
                            
                            Rectangle()
                                .fill(store.activeCategory == category ? LuminaTheme.cyanNeon : Color.clear)
                                .frame(height: 2)
                        }
                    }
                }
            }
            .padding(.horizontal)
        }
    }
}

struct ProductCard: View {
    let product: Product
    @ObservedObject var store: StoreManager
    
    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            // Image Area
            ZStack(alignment: .topTrailing) {
                AsyncImage(url: URL(string: product.imageUrl)) { image in
                    image.resizable().aspectRatio(contentMode: .fill)
                } placeholder: {
                    Rectangle().fill(Color.gray.opacity(0.2))
                }
                .frame(height: 140)
                .clipped()
                
                if product.stock <= 0 {
                    Color.black.opacity(0.7)
                    Text("SOLD OUT")
                        .font(.caption)
                        .fontWeight(.bold)
                        .padding(4)
                        .background(Color.white)
                        .foregroundColor(.black)
                        .position(x: 50, y: 70)
                }
            }
            .frame(height: 140)
            
            // Content
            VStack(alignment: .leading, spacing: 8) {
                Text(product.name.uppercased())
                    .font(.system(size: 14, weight: .bold))
                    .lineLimit(1)
                    .foregroundColor(.white)
                
                Text(product.description)
                    .font(.caption)
                    .foregroundColor(LuminaTheme.textSecondary)
                    .lineLimit(2)
                
                HStack {
                    Text("$\(Int(product.price))")
                        .font(.system(size: 16, weight: .heavy, design: .monospaced))
                        .foregroundColor(LuminaTheme.cyanNeon)
                    
                    Spacer()
                    
                    Button(action: { store.addToCart(product) }) {
                        Image(systemName: "plus")
                            .font(.system(size: 14, weight: .bold))
                            .foregroundColor(.black)
                            .frame(width: 28, height: 28)
                            .background(product.stock > 0 ? Color.white : Color.gray)
                            .clipShape(Circle())
                    }
                    .disabled(product.stock <= 0)
                }
            }
            .padding(12)
            .background(LuminaTheme.surface)
        }
        .clipShape(RoundedRectangle(cornerRadius: 12))
        .overlay(
            RoundedRectangle(cornerRadius: 12)
                .stroke(Color.white.opacity(0.1), lineWidth: 1)
        )
    }
}

struct FloatingCartButton: View {
    @ObservedObject var store: StoreManager
    
    var body: some View {
        Button(action: { withAnimation { store.showPaymentSheet = true } }) {
            HStack {
                ZStack {
                    Circle()
                        .fill(LuminaTheme.cyanNeon)
                        .frame(width: 24, height: 24)
                    Text("\(store.cartItemCount)")
                        .font(.caption2)
                        .fontWeight(.black)
                        .foregroundColor(.black)
                }
                
                Text("VER BOLSA")
                    .font(.system(size: 14, weight: .heavy))
                    .tracking(1)
                    .foregroundColor(.white)
                
                Spacer()
                
                Text("$\(Int(store.cartTotal))")
                    .font(.system(size: 16, weight: .heavy, design: .monospaced))
                    .foregroundColor(LuminaTheme.cyanNeon)
                
                Image(systemName: "chevron.right")
                    .font(.caption)
                    .foregroundColor(LuminaTheme.textSecondary)
            }
            .padding()
            .background(.ultraThinMaterial)
            .background(Color.black.opacity(0.8))
            .clipShape(RoundedRectangle(cornerRadius: 16))
            .overlay(
                RoundedRectangle(cornerRadius: 16)
                    .stroke(LuminaTheme.cyanNeon.opacity(0.3), lineWidth: 1)
            )
            .shadow(color: Color.black.opacity(0.5), radius: 10, x: 0, y: 5)
        }
    }
}

struct PaymentSheetView: View {
    @ObservedObject var store: StoreManager
    
    var body: some View {
        VStack(spacing: 24) {
            // Handle
            Capsule()
                .fill(Color.gray.opacity(0.3))
                .frame(width: 40, height: 4)
                .padding(.top)
            
            Text("CONFIRMAR PAGO")
                .font(.headline)
                .fontWeight(.bold)
                .tracking(2)
                .foregroundColor(.white)
            
            // Fake Card
            ZStack(alignment: .bottomLeading) {
                LinearGradient(colors: [Color(hex: "2d2d2d"), Color(hex: "1a1a1a")], startPoint: .topLeading, endPoint: .bottomTrailing)
                
                VStack(alignment: .leading) {
                    HStack {
                        Spacer()
                        Image(systemName: "wave.3.right")
                            .foregroundColor(.white.opacity(0.3))
                    }
                    Spacer()
                    Text("•••• •••• •••• 8842")
                        .font(.system(size: 18, design: .monospaced))
                        .foregroundColor(.white)
                        .padding(.bottom, 4)
                    
                    HStack {
                        Text("LUMINA CARD")
                            .font(.caption)
                            .foregroundColor(.gray)
                        Spacer()
                        Circle()
                            .fill(Color.white.opacity(0.5))
                            .frame(width: 20)
                            .overlay(Circle().fill(Color.white.opacity(0.5)).offset(x: 12))
                    }
                }
                .padding(20)
            }
            .frame(height: 200)
            .cornerRadius(16)
            .overlay(
                RoundedRectangle(cornerRadius: 16)
                    .stroke(LinearGradient(colors: [.white.opacity(0.2), .clear], startPoint: .topLeading, endPoint: .bottomTrailing), lineWidth: 1)
            )
            .padding(.horizontal)
            
            // Total Row
            HStack {
                Text("TOTAL A PAGAR")
                    .font(.caption)
                    .fontWeight(.bold)
                    .foregroundColor(.gray)
                Spacer()
                Text("$\(Int(store.cartTotal))")
                    .font(.system(size: 32, weight: .heavy, design: .monospaced))
                    .foregroundColor(.white)
            }
            .padding(.horizontal)
            
            // Pay Button
            Button(action: { store.processPayment() }) {
                ZStack {
                    RoundedRectangle(cornerRadius: 12)
                        .fill(store.isProcessingPayment ? Color.gray.opacity(0.3) : Color.white)
                        .frame(height: 56)
                    
                    if store.isProcessingPayment {
                        ProgressView()
                            .progressViewStyle(CircularProgressViewStyle(tint: .white))
                    } else {
                        HStack {
                            Image(systemName: "applelogo")
                            Text("PAY")
                        }
                        .font(.system(size: 18, weight: .bold))
                        .foregroundColor(.black)
                    }
                }
            }
            .disabled(store.isProcessingPayment)
            .padding(.horizontal)
            .padding(.bottom, 40)
        }
        .background(Color(hex: "1C1C1E"))
        .cornerRadius(24, corners: [.topLeft, .topRight])
    }
}

struct DigitalTicketView: View {
    let order: Order
    let onClose: () -> Void
    
    var body: some View {
        ZStack {
            LuminaTheme.background.ignoresSafeArea()
            
            VStack {
                Spacer()
                
                // Success Icon
                Circle()
                    .fill(LuminaTheme.cyanNeon.opacity(0.1))
                    .frame(width: 100, height: 100)
                    .overlay(
                        Image(systemName: "checkmark")
                            .font(.system(size: 40, weight: .bold))
                            .foregroundColor(LuminaTheme.cyanNeon)
                    )
                    .padding(.bottom, 20)
                
                Text("ORDEN CONFIRMADA")
                    .font(.title2)
                    .fontWeight(.black)
                    .tracking(1)
                    .foregroundColor(.white)
                
                Text("Tu pedido ha sido enviado a la barra")
                    .font(.caption)
                    .foregroundColor(.gray)
                    .padding(.bottom, 40)
                
                // Ticket Card
                VStack(spacing: 0) {
                    // Top Section
                    VStack(spacing: 16) {
                        Text("CÓDIGO DE RETIRO")
                            .font(.system(size: 10, weight: .bold))
                            .tracking(2)
                            .foregroundColor(.gray)
                        
                        Text(order.pickupCode)
                            .font(.system(size: 64, weight: .black))
                            .foregroundColor(.black)
                        
                        Divider()
                    }
                    .padding(32)
                    .background(Color.white)
                    
                    // QR Section
                    VStack {
                        Image(systemName: "qrcode")
                            .resizable()
                            .interpolation(.none)
                            .scaledToFit()
                            .frame(width: 180, height: 180)
                            .foregroundColor(.black)
                            .opacity(0.8)
                        
                        Text("MUESTRA ESTE CÓDIGO")
                            .font(.system(size: 10, weight: .bold))
                            .padding(.top, 12)
                            .foregroundColor(.gray)
                    }
                    .frame(maxWidth: .infinity)
                    .padding(32)
                    .background(Color(hex: "F3F4F6"))
                }
                .frame(maxWidth: 320)
                .cornerRadius(4)
                .shadow(color: LuminaTheme.cyanNeon.opacity(0.2), radius: 20, x: 0, y: 0)
                
                Spacer()
                
                Button(action: onClose) {
                    Text("Cerrar")
                        .font(.headline)
                        .fontWeight(.bold)
                        .foregroundColor(.white)
                        .padding()
                }
            }
        }
    }
}

struct HypeOverlay: View {
    let promotion: Promotion
    @Binding var isVisible: Bool
    @State private var timeLeft: Double
    
    init(promotion: Promotion, isVisible: Binding<Bool>) {
        self.promotion = promotion
        self._isVisible = isVisible
        self._timeLeft = State(initialValue: promotion.duration)
    }
    
    var body: some View {
        ZStack {
            Color.red.ignoresSafeArea()
            
            // Animated Background Glitch effect simulated
            Rectangle() // Ideally a complex gradient
                .fill(LinearGradient(colors: [.red, .black], startPoint: .top, endPoint: .bottom))
                .opacity(0.8)
            
            VStack(spacing: 20) {
                Text("EVENTO EN VIVO")
                    .font(.system(size: 12, weight: .black, design: .monospaced))
                    .padding(6)
                    .background(.black)
                    .foregroundColor(.white)
                
                Text(promotion.triggerLabel)
                    .font(.system(size: 60, weight: .black))
                    .foregroundColor(.white)
                    .textCase(.uppercase)
                    .multilineTextAlignment(.center)
                
                Text("-\(Int(promotion.discountPercent))%")
                    .font(.system(size: 120, weight: .black))
                    .foregroundColor(.white)
                    .shadow(color: .black, radius: 2)
                
                Text("Solo por los próximos 5 minutos")
                    .font(.headline)
                    .fontWeight(.bold)
                    .foregroundColor(.white.opacity(0.9))
                
                Button(action: { withAnimation { isVisible = false } }) {
                    Text("APROVECHAR AHORA")
                        .font(.headline)
                        .fontWeight(.black)
                        .padding(.vertical, 16)
                        .padding(.horizontal, 32)
                        .background(Color.white)
                        .foregroundColor(.red)
                        .clipShape(Capsule())
                }
            }
        }
        .transition(.opacity)
        .onAppear {
            DispatchQueue.main.asyncAfter(deadline: .now() + 5) {
                withAnimation { isVisible = false } // Auto dismiss after 5s to be annoying but not blocking
            }
        }
    }
}

// MARK: - HELPERS

extension View {
    func cornerRadius(_ radius: CGFloat, corners: UIRectCorner) -> some View {
        clipShape(RoundedCorner(radius: radius, corners: corners))
    }
}

struct RoundedCorner: Shape {
    var radius: CGFloat = .infinity
    var corners: UIRectCorner = .allCorners

    func path(in rect: CGRect) -> Path {
        let path = UIBezierPath(roundedRect: rect, byRoundingCorners: corners, cornerRadii: CGSize(width: radius, height: radius))
        return Path(path.cgPath)
    }
}
