import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DestinationProvider } from './context/DestinationContext';
import { CurrencyProvider } from './context/CurrencyContext';

// Layout & Protected Route Wrapper
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Pages
import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { DashboardPage } from './pages/DashboardPage';
import { PlanTripPage } from './pages/PlanTripPage';
import { ExplorePage } from './pages/ExplorePage';
import { HotelsPage } from './pages/HotelsPage';
import { MyTripsPage } from './pages/MyTripsPage';
import { TripDetailPage } from './pages/TripDetailPage';
import { MapPage } from './pages/MapPage';
import { TranslatorPage } from './pages/TranslatorPage';
import { CurrencyPage } from './pages/CurrencyPage';
import { AiAssistantPage } from './pages/AiAssistantPage';
import { SavedPlacesPage } from './pages/SavedPlacesPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';

// Root gate component: Redirects unauthenticated users directly to /login
const RootRedirect: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return null;
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
};

// Layout wrapper for authenticated pages
const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-100 flex flex-col justify-between selection:bg-sky-500 selection:text-white">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DestinationProvider>
          <CurrencyProvider>
            <Routes>
              {/* Public Authentication Gate Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />

              {/* Root entry redirect: ALWAYS redirects unauthenticated users to /login */}
              <Route path="/" element={<RootRedirect />} />

              {/* Protected Platform Pages */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <DashboardPage />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/plan-trip"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <PlanTripPage />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/explore"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <ExplorePage />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/hotels"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <HotelsPage />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-trips"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <MyTripsPage />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/trips/:id"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <TripDetailPage />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/map"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <MapPage />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/saved"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <SavedPlacesPage />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/translator"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <TranslatorPage />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/currency"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <CurrencyPage />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ai-assistant"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <AiAssistantPage />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <ProfilePage />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <SettingsPage />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />

              {/* Catch-all unknown routes redirect to root / which enforces login */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </CurrencyProvider>
        </DestinationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};
