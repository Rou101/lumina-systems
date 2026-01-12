# Lumina - Project State Master
> **Status:** ACTIVE
> **Director Mode:** ON

## 🌐 Global Architecture
*   **Core:** Monorepo-style structure structure (simulated)
*   **Design System:** "Cyberpunk Luxury" (Dark, Neon, Glassmorphism)
*   **Tech Stack:** Next.js, TailwindCSS, TypeScript

## 📂 Sub-Systems Status

### 1. 📢 Marketing Site (`/marketing`)
*   **Status:** 🚧 IN PROGRESS
*   **Key Features:** Landing Page, i18n (Eng/Esp).
*   **Current Focus:** Hero section and navigation.

### 2. 🧠 Lumina IQ (`/lumina-iq`)
*   **Status:** ✅ MVP COMPLETE
*   **Key Features:** Analytics Dashboard, Data Visualization, "Crystal Ball" Prediction.
*   **Next:** Real ML Model integration.

### 3. 📱 Lumina Mobile (`/LuminaMobile`)
*   **Status:** 🚧 SCAFFOLDED
*   **Key Features:** End-user event companion app (iOS/Android).
*   **R&D:** 🕶️ AR Friend Finder & POI Compass.
*   **Current State:** Expo Router & NativeWind Configured. Login & Tab Bar implemented.

### 4. 🦇 Lumina Core (`/LuminaCore`)
*   **Status:** 🚧 PROTOTYPE READY
*   **Key Features:** Global "God Mode" Dashboard, Stripe Connect Manager, Circuit Breakers.
*   **Aesthetic:** "Deep Command Center" (Simpler, Data-Dense, Red/Alerts).

## 📋 Active Backlog
| ID | Priority | Task | Status | Assigned To |
|----|----------|------|--------|-------------|
| M-01 | HIGH | Setup Director-Worker Protocols | ✅ COMPLETED | Director |
| M-02 | HIGH | Finalize Landing Page Hero | ✅ COMPLETED | Director (Intervention) |
| A-01 | MED | Refactor Admin Dashboard | ✅ COMPLETED | Worker (Polished & i18n) |
| A-02 | -- | Style Propagation to Main App | ✅ COMPLETED | Worker |
| IQ-01 | HIGH | Analytics Engine & Viz | ✅ COMPLETED | Worker |
| MOB-01 | HIGH | Mobile App Scaffolding | ✅ COMPLETED | Worker |
| CORE-01| HIGH | Build "Batman Cave" Prototype | ✅ COMPLETED | Worker |
| CORE-02| HIGH | Add "Profit Stream" Window | ✅ COMPLETED | Worker |
| SEC-01 | CRITICAL | Implement Master Key Auth | ✅ COMPLETED | Worker (Client-Side Prototype) |
| MOB-02 | R&D | Prototype AR Friend Finder | ✅ PROTOTYPE | Worker (Sensors + HUD) |
| MOB-03 | HIGH | Implement Google Auth (Mobile) | ✅ COMPLETED | Worker (Simulated + LocalAuth) |
| WEB-01 | HIGH | Implement Google Auth (Web)    | ✅ COMPLETED | Worker (Simulated Context) |
| DB-01  | CRITICAL | Unified Database Schema Strategy | ✅ COMPLETED | Director (Docs Only) |
| SIM-01 | HIGH | "Chaos Engine" Event Simulator | ✅ COMPLETED | Worker (Client-Side) |
| MOB-04 | HIGH | Mobile Ordering & Payments | ✅ COMPLETED | Worker (Split-Order Logic) |

## 🏗️ Recent Architecture Decisions
*   **2026-01-12:** Adopted Manager-Worker Agentic Architecture.
*   **2026-01-12:** Standardized on `i18next` for internationalization.
*   **2026-01-12:** Admin Panel Standardized: Strict TypeScript and Full i18n implementation enforced.
*   **2026-01-12:** Mobile Strategy: React Native (Expo) + Expo Router + NativeWind.
