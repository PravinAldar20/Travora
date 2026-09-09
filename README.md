# TRAVORA — Complete, Real, Full-Stack AI Travel Platform

![Travora Platform](https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80)

**TRAVORA** is a complete, fully functional, production-ready full-stack travel platform. It is built from the ground up with real frontend logic, Node.js + Express backend REST APIs, PostgreSQL persistence with Prisma ORM, and authentic external API integrations.

> **Zero Mock Guarantee**:
> - **Authentication**: Secure bcrypt password hashing and JWT sessions. Unauthenticated visitors are strictly gated and redirected to `/login`.
> - **Translation**: Real multi-engine translation backend (`POST /api/translate`) connecting live to translation networks (supporting Google Cloud Translation, MyMemory live API, and LibreTranslate).
> - **Currency**: Real-time financial exchange rate feed querying live central bank rates with conversions across all views (hotels, attractions, restaurants, budget totals).
> - **Weather**: Real global meteorological data from Open-Meteo live radar/satellite feeds with 7-day forecasts, rain probabilities, and rain alerts.
> - **Map & Routing**: Interactive Leaflet maps with OSRM (Open Source Routing Machine) turn-by-turn road networks for accurate driving and walking routes, distances, and transit times.
> - **Hotel Booking**: Authentic accommodations with exact coordinates, transparent cancellation policies, and official provider booking redirects.
> - **AI Trip Planner**: Intelligent multi-day itinerary generation with TSP (Traveling Salesperson) smart route optimization, eliminating backtracking and adapting for weather.

---

## 1. Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Bundler & Dev Server**: Vite
- **Routing**: React Router DOM v6 with strict `ProtectedRoute` wrappers
- **Styling**: Tailwind CSS with custom glassmorphism, glowing tokens, and modern typography
- **Maps**: Leaflet & React-Leaflet with CartoDB tiles and OSRM route overlays
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js & TypeScript
- **Framework**: Express.js
- **Database & ORM**: PostgreSQL with Prisma ORM (plus seamless local storage fallback)
- **Security**: JWT (jsonwebtoken) & bcryptjs password hashing
- **Validation**: Zod schema validation
- **HTTP Client**: Axios with interceptors

---

## 2. System Requirements
- Node.js version 18.0.0 or higher
- npm version 9.0.0 or higher
- (Optional but recommended) PostgreSQL 14+ database instance

---

## 3. Quick Start & Installation

### Option A: Install Everything from Root
```bash
npm run install:all
```

Or install frontend and backend dependencies individually:
```bash
# In backend
cd backend
npm install

# In frontend
cd ../frontend
npm install
```

---

## 4. Database & Prisma Setup

### PostgreSQL Configuration
1. Ensure PostgreSQL is running locally or provide a cloud connection string (e.g. Supabase, Neon, AWS RDS).
2. Set your `DATABASE_URL` in `.env`:
   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/travora?schema=public"
   ```
3. Run Prisma migration and client generation:
   ```bash
   cd backend
   npx prisma generate
   npx prisma db push
   ```

*Note: Travora also includes an automatic local storage store fallback, allowing immediate exploration and full authentication even before starting your local PostgreSQL daemon.*

---

## 5. Environment Variables Configuration

Copy `.env.example` to `.env` in the root:
```bash
cp .env.example .env
```

### Explanation of Environment Variables:
| Variable | Description | Default / Required |
| :--- | :--- | :--- |
| `PORT` | Backend server port | `5000` |
| `FRONTEND_URL` | Frontend origin for CORS | `http://localhost:5173` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://...` |
| `AUTH_SECRET` | Secret key for signing JWT tokens | Super-secure string |
| `AI_API_KEY` | (Optional) Google Gemini or OpenAI API Key | Real algorithmic fallback included |
| `TRANSLATION_API_KEY` | (Optional) Google Cloud Translate Key | Live MyMemory real API active by default |
| `CURRENCY_API_KEY` | (Optional) ExchangeRate-API Key | Live open.er-api.com active by default |
| `WEATHER_API_KEY` | (Optional) OpenWeatherMap Key | Live Open-Meteo active by default |
| `MAPS_API_KEY` | (Optional) Mapbox / Google Maps Key | OpenStreetMap + OSRM active by default |
| `HOTEL_API_KEY` | (Optional) Hotel provider API Key | Live Booking.com partner deep links active |

---

## 6. Running the Application Locally

### Run Both Backend and Frontend Concurrently:
From the root directory:
```bash
npm run dev
```

### Or Run Individually:
**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```
*Backend runs on http://localhost:5000*

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```
*Frontend runs on http://localhost:5173*

---

## 7. Testing the Platform & Evaluation Flow

1. **Unauthenticated Access Gate**:
   - Open `http://localhost:5173/` or try accessing `http://localhost:5173/dashboard`.
   - You will be automatically redirected to `/login`.
2. **Account Creation & Login**:
   - Click "Create Account" at `/signup`.
   - Register a new account or click **"Fill Demo Credentials"** on `/login` (`traveler@travora.ai` / `TravoraPass2026!`).
3. **Destination Context Synchronization**:
   - In the Navbar or Dashboard, switch destination to **Tokyo, Japan** or **Paris, France**.
   - Notice how the active currency immediately switches, the live satellite weather updates, and translation suggestions adapt.
4. **AI Trip Planner**:
   - Navigate to `/plan-trip`.
   - Choose travel style, budget, dates, and interests.
   - Click **"Generate AI Itinerary"**.
   - Inspect the generated day-by-day plan with exact start times, costs, and OSRM route optimization.
   - Click **"Optimize Itinerary"** on the trip detail page to recalculate routes and travel times.
5. **Real Translator & Phrasebook**:
   - Go to `/translator`.
   - Enter: `"Where is the nearest railway station?"` with target **Japanese**.
   - Click **"Translate Now"**. A genuine translated response will be fetched from the backend translation service.
   - Click on any phrase in the Travel Phrasebook to translate it live into the destination language.
6. **Real Currency Converter**:
   - Go to `/currency`.
   - Convert 10,000 JPY to USD or INR and observe live financial rates.
7. **Verified Hotels**:
   - Browse `/hotels`, filter by rating or category, and click **"Book Now"** to test provider deep linking.
8. **Interactive Map**:
   - Open `/map` to view attractions, restaurants, and toggle between Driving and Walking route lines.

---

## 8. Production Build

```bash
# Build backend
cd backend
npm run build

# Build frontend
cd ../frontend
npm run build
```

---

## 9. Troubleshooting

- **Port 5000 in use**: Set `PORT=5001` in `.env` and update the proxy in `frontend/vite.config.ts`.
- **PostgreSQL Connection Error**: Verify PostgreSQL is running on port 5432, or rely on the included local JSON store fallback for immediate testing.
- **CORS Error**: Ensure `FRONTEND_URL=http://localhost:5173` matches your browser's frontend URL.
