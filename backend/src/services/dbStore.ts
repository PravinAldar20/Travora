import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

// Local resilient storage fallback if PostgreSQL server is not yet running
const DATA_DIR = path.join(__dirname, '../../data');
const DATA_FILE = path.join(DATA_DIR, 'travora_local_db.json');

interface LocalDatabase {
  users: any[];
  preferences: any[];
  trips: any[];
  itineraryItems: any[];
  savedPlaces: any[];
  hotelBookings: any[];
  translationHistory: any[];
}

function loadLocalDb(): LocalDatabase {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Could not read local data file, initializing fresh store');
  }

  const initial: LocalDatabase = {
    users: [],
    preferences: [],
    trips: [],
    itineraryItems: [],
    savedPlaces: [],
    hotelBookings: [],
    translationHistory: [],
  };
  saveLocalDb(initial);
  return initial;
}

function saveLocalDb(db: LocalDatabase) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to persist local DB:', err);
  }
}

let db = loadLocalDb();

export const dbStore = {
  async findUserByEmail(email: string) {
    return db.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  async findUserById(id: string) {
    return db.users.find(u => u.id === id) || null;
  },

  async createUser(userData: {
    name: string;
    email: string;
    passwordHash: string;
    homeCurrency?: string;
    language?: string;
  }) {
    const user = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: userData.name,
      email: userData.email.toLowerCase(),
      passwordHash: userData.passwordHash,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userData.name)}`,
      homeCurrency: userData.homeCurrency || 'USD',
      language: userData.language || 'en',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.users.push(user);

    // Create default preferences
    const pref = {
      id: `pref_${Date.now()}`,
      userId: user.id,
      travelStyle: 'Standard',
      interests: ['Historical places', 'Food', 'Culture', 'Museums'],
      foodPreferences: [],
      transportPreference: 'Public Transit & Walking',
      hotelPreference: 'Mid-range Boutique',
      walkingTolerance: 'Moderate',
      activityIntensity: 'Balanced',
      indoorOutdoorPref: 'Balanced',
      morningEveningPref: 'Morning Active',
      updatedAt: new Date().toISOString(),
    };
    db.preferences.push(pref);

    saveLocalDb(db);
    return user;
  },

  async updateUser(id: string, updates: Partial<{ name: string; homeCurrency: string; language: string; avatarUrl: string }>) {
    const user = db.users.find(u => u.id === id);
    if (!user) return null;
    Object.assign(user, updates, { updatedAt: new Date().toISOString() });
    saveLocalDb(db);
    return user;
  },

  async getPreferences(userId: string) {
    return db.preferences.find(p => p.userId === userId) || null;
  },

  async updatePreferences(userId: string, prefs: any) {
    let pref = db.preferences.find(p => p.userId === userId);
    if (!pref) {
      pref = { id: `pref_${Date.now()}`, userId, ...prefs, updatedAt: new Date().toISOString() };
      db.preferences.push(pref);
    } else {
      Object.assign(pref, prefs, { updatedAt: new Date().toISOString() });
    }
    saveLocalDb(db);
    return pref;
  },

  // Trips CRUD
  async getTripsByUser(userId: string) {
    const userTrips = db.trips.filter(t => t.userId === userId);
    return userTrips.map(t => ({
      ...t,
      itineraryItems: db.itineraryItems.filter(i => i.tripId === t.id),
    }));
  },

  async getTripById(id: string) {
    const trip = db.trips.find(t => t.id === id || t.shareId === id);
    if (!trip) return null;
    const items = db.itineraryItems.filter(i => i.tripId === trip.id);
    items.sort((a, b) => a.dayNumber - b.dayNumber || a.orderIndex - b.orderIndex);
    return { ...trip, itineraryItems: items };
  },

  async createTrip(tripData: any) {
    const trip = {
      id: `trip_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      shareId: `share_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      status: 'planning',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...tripData,
    };
    db.trips.push(trip);

    if (tripData.itineraryItems && Array.isArray(tripData.itineraryItems)) {
      for (const item of tripData.itineraryItems) {
        const itemRecord = {
          id: `item_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          tripId: trip.id,
          createdAt: new Date().toISOString(),
          ...item,
        };
        db.itineraryItems.push(itemRecord);
      }
    }

    saveLocalDb(db);
    return this.getTripById(trip.id);
  },

  async updateTrip(id: string, updates: any) {
    const trip = db.trips.find(t => t.id === id);
    if (!trip) return null;

    Object.assign(trip, updates, { updatedAt: new Date().toISOString() });

    if (updates.itineraryItems && Array.isArray(updates.itineraryItems)) {
      // Replace existing items for this trip
      db.itineraryItems = db.itineraryItems.filter(i => i.tripId !== id);
      for (const item of updates.itineraryItems) {
        db.itineraryItems.push({
          id: item.id || `item_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          tripId: id,
          createdAt: new Date().toISOString(),
          ...item,
        });
      }
    }

    saveLocalDb(db);
    return this.getTripById(id);
  },

  async deleteTrip(id: string) {
    db.trips = db.trips.filter(t => t.id !== id);
    db.itineraryItems = db.itineraryItems.filter(i => i.tripId !== id);
    saveLocalDb(db);
    return true;
  },

  async duplicateTrip(id: string, userId: string) {
    const original = await this.getTripById(id);
    if (!original) return null;

    const copyData = {
      ...original,
      userId,
      title: `${original.title} (Copy)`,
      shareId: `share_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      itineraryItems: (original.itineraryItems || []).map((item: any) => ({ ...item })),
    };
    delete (copyData as any).id;
    return this.createTrip(copyData);
  },

  // Saved items
  async getSavedPlaces(userId: string) {
    return db.savedPlaces.filter(s => s.userId === userId);
  },

  async addSavedPlace(userId: string, data: { placeType: string; placeId: string; name: string; destination: string; metadata?: any }) {
    const existingIndex = db.savedPlaces.findIndex(
      s => s.userId === userId && s.placeType === data.placeType && s.placeId === data.placeId
    );
    if (existingIndex >= 0) {
      return db.savedPlaces[existingIndex];
    }
    const item = {
      id: `saved_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId,
      ...data,
      metadata: typeof data.metadata === 'string' ? data.metadata : JSON.stringify(data.metadata || {}),
      createdAt: new Date().toISOString(),
    };
    db.savedPlaces.push(item);
    saveLocalDb(db);
    return item;
  },

  async removeSavedPlace(id: string, userId: string) {
    db.savedPlaces = db.savedPlaces.filter(s => s.id !== id || s.userId !== userId);
    saveLocalDb(db);
    return true;
  },

  // Bookings
  async createHotelBooking(bookingData: any) {
    const booking = {
      id: `bk_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      bookingReference: `TRAV-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      ...bookingData,
    };
    db.hotelBookings.push(booking);
    saveLocalDb(db);
    return booking;
  },

  async getBookingsByUser(userId: string) {
    return db.hotelBookings.filter(b => b.userId === userId);
  },

  // Translation history
  async logTranslation(userId: string, originalText: string, sourceLang: string, targetLang: string, translatedText: string) {
    const record = {
      id: `tr_${Date.now()}`,
      userId,
      originalText,
      sourceLang,
      targetLang,
      translatedText,
      createdAt: new Date().toISOString(),
    };
    db.translationHistory.unshift(record);
    if (db.translationHistory.length > 50) {
      db.translationHistory.pop();
    }
    saveLocalDb(db);
    return record;
  },

  async getTranslationHistory(userId: string) {
    return db.translationHistory.filter(t => t.userId === userId).slice(0, 20);
  },

  async deleteTranslationHistory(id: string, userId: string) {
    db.translationHistory = db.translationHistory.filter(t => t.id !== id || t.userId !== userId);
    saveLocalDb(db);
    return true;
  },
};
