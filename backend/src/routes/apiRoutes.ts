import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware';

// Auth controllers
import {
  register,
  login,
  logout,
  forgotPassword,
  getProfile,
  updateProfile,
  updatePreferences,
} from '../controllers/authController';

// Trip controllers
import {
  createTrip,
  getUserTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  duplicateTrip,
  generateItineraryForTrip,
  optimizeTripItinerary,
} from '../controllers/tripController';

// Hotel controllers
import {
  searchHotelsHandler,
  getHotelDetailsHandler,
  bookHotelHandler,
  getUserBookingsHandler,
} from '../controllers/hotelController';

// Place & Route controllers
import {
  searchDestinationsHandler,
  getDestinationDetailsHandler,
  getExploreFeedHandler,
  calculateRouteHandler,
  recommendDestinationsHandler,
} from '../controllers/placeController';

// Weather controller
import { getWeatherHandler } from '../controllers/weatherController';

// Currency controller
import { getCurrencyRatesHandler, convertCurrencyHandler } from '../controllers/currencyController';

// Translate controller
import {
  translateHandler,
  getSupportedLanguagesHandler,
  getPhrasebookHandler,
  getTranslationHistoryHandler,
  deleteTranslationHistoryHandler,
} from '../controllers/translateController';

// Saved places controller
import {
  getSavedItemsHandler,
  addSavedItemHandler,
  removeSavedItemHandler,
} from '../controllers/savedController';

// AI assistant controller
import { aiChatHandler } from '../controllers/aiController';

const router = Router();

// ------------------------------------------
// 1. AUTH & USER ROUTES
// ------------------------------------------
router.post('/auth/register', register);
router.post('/auth/login', login);
router.post('/auth/logout', logout);
router.post('/auth/forgot-password', forgotPassword);

router.get('/user/profile', requireAuth, getProfile);
router.put('/user/profile', requireAuth, updateProfile);
router.put('/user/preferences', requireAuth, updatePreferences);

// ------------------------------------------
// 2. TRIPS & ITINERARY ROUTES
// ------------------------------------------
router.post('/trips', requireAuth, createTrip);
router.get('/trips', requireAuth, getUserTrips);
router.get('/trips/:id', requireAuth, getTripById);
router.put('/trips/:id', requireAuth, updateTrip);
router.delete('/trips/:id', requireAuth, deleteTrip);
router.post('/trips/:id/duplicate', requireAuth, duplicateTrip);

router.post('/trips/generate-itinerary', requireAuth, generateItineraryForTrip);
router.post('/trips/:id/generate-itinerary', requireAuth, generateItineraryForTrip);
router.post('/trips/:id/optimize', requireAuth, optimizeTripItinerary);

// ------------------------------------------
// 3. HOTEL SEARCH & REAL BOOKING ROUTES
// ------------------------------------------
router.get('/hotels/search', searchHotelsHandler);
router.get('/hotels/bookings', requireAuth, getUserBookingsHandler);
router.get('/hotels/:id', getHotelDetailsHandler);
router.post('/hotels/book', requireAuth, bookHotelHandler);

// ------------------------------------------
// 4. DESTINATIONS, PLACES & ROUTING
// ------------------------------------------
router.get('/places/search', searchDestinationsHandler);
router.get('/places/destinations', searchDestinationsHandler);
router.get('/places/destinations/:id', getDestinationDetailsHandler);
router.get('/places/explore', getExploreFeedHandler);
router.post('/places/recommend', recommendDestinationsHandler);
router.post('/routes', calculateRouteHandler);

// ------------------------------------------
// 5. WEATHER
// ------------------------------------------
router.get('/weather', getWeatherHandler);

// ------------------------------------------
// 6. CURRENCY CONVERSION & LIVE RATES
// ------------------------------------------
router.get('/currency/rates', getCurrencyRatesHandler);
router.post('/currency/convert', convertCurrencyHandler);

// ------------------------------------------
// 7. REAL TRANSLATION ENGINE & PHRASEBOOK
// ------------------------------------------
router.post('/translate', translateHandler);
router.get('/translate/languages', getSupportedLanguagesHandler);
router.get('/translate/phrasebook', getPhrasebookHandler);
router.get('/translate/history', requireAuth, getTranslationHistoryHandler);
router.delete('/translate/history/:id', requireAuth, deleteTranslationHistoryHandler);

// ------------------------------------------
// 8. SAVED ITEMS (HOTELS, RESTAURANTS, ATTRACTIONS)
// ------------------------------------------
router.get('/saved', requireAuth, getSavedItemsHandler);
router.post('/saved', requireAuth, addSavedItemHandler);
router.delete('/saved/:id', requireAuth, removeSavedItemHandler);

// ------------------------------------------
// 9. AI TRAVEL ASSISTANT
// ------------------------------------------
router.post('/ai/chat', aiChatHandler);

export default router;
