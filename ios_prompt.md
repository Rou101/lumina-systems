# Prompt para iOS Developer AI (SwiftUI)

**Contexto:** Necesito crear una aplicación nativa de iOS para la "Vista de Cliente" de Lumina, un sistema operativo para eventos masivos y discotecas. La estética es "Cyberpunk Luxury". **NO usar HTML/WebViews**. Debe ser código nativo SwiftUI puro.

**Rol:** Eres un Senior iOS Developer experto en SwiftUI, animaciones avanzadas y arquitectura MVVM.

**Tarea:** Generar el código completo para una app de una sola vista principal (Single View App) con navegación modal para el flujo de compra.

## 1. Estética y Diseño (Critical)
*   **Tema:** Dark Mode profundo. Fondo `#050505`.
*   **Colores:**
    *   Primario: Cyan Neon (`#00f0ff`)
    *   Secundario: Electric Purple (`#bd00ff`)
    *   Texto: Blanco y Gris Platino.
*   **Componentes:** Uso intensivo de `UltraThinMaterial` (Glassmorphism) para paneles flotantes y headers.
*   **Tipografía:** San Francisco (System) pero con pesos `Black` y `Bold` para títulos en mayúsculas (tracking `tight`).

## 2. Modelos de Datos (Swift Structs)
Basado en las especificaciones del sistema, define:
*   `Product`: id, name, description, price, category, stock, imageUrl.
*   `CartItem`: id, product, quantity.
*   `Order`: id, pickupCode, status, total.
*   `Promotion`: id, triggerLabel, duration.

## 3. Arquitectura y State
*   **`StoreManager` (ObservableObject):** Maneja la lógica de negocio.
    *   Lista de productos (Mockeada con 10-15 items variados).
    *   Carrito de compras (Dictionary o Array).
    *   Lógica de "Checkout" (simular delay de red).
*   **`HapticFeedback`:** Usa `UIImpactFeedbackGenerator` para cada interacción (añadir al carrito, pagar).

## 4. Vistas Requeridas

### A. MainView (Pantalla Principal)
*   **Header Seguro:** Barra superior con efecto blur, logo de Lumina y un icono de candado "Secure Tunnel".
*   **Selector de Categorías:** Scroll horizontal de "pills" (Tragos, Comida, VIP). Filtra la lista de productos con animación `easeInOut`.
*   **Grid de Productos:**
    *   Celda personalizada: Imagen cuadrada, Título (Truncated), Precio en Cyan.
    *   Botón "+": Feedback táctil fuerte al presionar.
    *   Estado "Sold Out": Overlay semitransparente si stock es 0.

### B. Floating Cart (Bottom Bar)
*   Solo aparece si `cart.count > 0`.
*   Estilo vidrio flotante en la parte inferior.
*   Muestra contador de items y Total. Botón "Ver Bolsa".

### C. PaymentSheet (Custom Modal)
*   **NO usar la hoja nativa de Apple Pay**, crear una custom que parezca del sistema operativo "Lumina OS".
*   Fondo negro con blur.
*   Tarjeta de crédito simulada con brillo (gradient animation).
*   Botón de pago grande. Al presionar: Spinner de carga -> Checkmark verde -> Transición a Ticket.

### D. DigitalTicketView (Pantalla de Éxito)
*   Aparece tras el pago exitoso.
*   **Pickup Code:** Texto gigante (ej: "X-42").
*   **QR Code:** Imagen generada (usar `https://api.qrserver.com...` o UI dummy).
*   Animación de entrada triunfal (Scale effect + Fade in).

### E. HypeOverlay (Promoción Flash)
*   Simular un "Trigger" que ocurre a los 10 segundos de abrir la app.
*   Pantalla completa roja, timer de cuenta regresiva, oferta exclusiva.

## 5. Instrucciones de Código
*   Usa `AsyncImage` para cargar imágenes (usa URLs de Unsplash para los mocks).
*   Implementa todo en un solo archivo o indica claramente la separación si es muy largo.
*   Prioriza la robustez: los botones no deben funcionar si está cargando.
