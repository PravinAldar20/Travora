export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  homeCurrency: string;
  language: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  travelStyle: string;
  interests: string[];
  foodPreferences?: string[];
  transportPreference?: string;
  hotelPreference?: string;
  walkingTolerance?: string;
  activityIntensity?: string;
  indoorOutdoorPref?: string;
  morningEveningPref?: string;
}

export interface Destination {
  id: string;
  name: string;
  city: string;
  country: string;
  countryCode: string;
  continent?: string;
  latitude: number;
  longitude: number;
  currency: string;
  language: string;
  languageName: string;
  timezone: string;
  description: string;
  coverImage: string;
  bestSeasons?: string[];
  idealDaysMin?: number;
  idealDaysMax?: number;
  budgetTier?: string;
  estimatedDailyCostUSD?: number;
  tags?: string[];
  transportInfo: {
    metro: boolean;
    transitCards: string;
    taxiApps: string;
    walkingFriendly: boolean;
  };
  topAttractions: Attraction[];
  restaurants: Restaurant[];
}

export interface DestinationRecommendation {
  destination: Destination;
  matchScore: number;
  matchReasons: string[];
  estimatedTotalCostUSD: number;
  budgetFit: 'Under Budget' | 'On Budget' | 'Stretch';
}

export interface Attraction {
  id: string;
  name: string;
  category: string;
  description: string;
  latitude: number;
  longitude: number;
  price: number;
  currency: string;
  rating: number;
  openingHours: string;
  image: string;
  indoor: boolean;
  durationMinutes: number;
  destination?: string;
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  priceLevel: '$' | '$$' | '$$$' | '$$$$';
  avgCost: number;
  currency: string;
  rating: number;
  latitude: number;
  longitude: number;
  address: string;
  image: string;
  dietary: string[];
  isFamilyFriendly: boolean;
  destination?: string;
}

export interface Hotel {
  id: string;
  name: string;
  destination: string;
  city: string;
  country: string;
  address: string;
  latitude: number;
  longitude: number;
  pricePerNight: number;
  currency: string;
  rating: number;
  reviewsCount: number;
  category: 'Luxury' | 'Boutique' | 'Mid-scale' | 'Budget' | 'Resort';
  images: string[];
  amenities: string[];
  roomOptions: Array<{
    type: string;
    bed: string;
    capacity: number;
    pricePerNight: number;
  }>;
  cancellationPolicy: string;
  provider: string;
  bookingBaseUrl: string;
  distanceKm?: number;
}

export interface HotelBooking {
  id: string;
  userId: string;
  tripId?: string;
  hotelId: string;
  hotelName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  rooms: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  provider: string;
  bookingReference: string;
  bookingUrl: string;
  totalAmount: number;
  currency: string;
  createdAt: string;
}

export interface Trip {
  id: string;
  userId: string;
  title: string;
  destination: string;
  country: string;
  city: string;
  latitude: number;
  longitude: number;
  startDate: string;
  endDate: string;
  adults: number;
  children: number;
  budget: number;
  currency: string;
  travelStyle: string;
  interests: string[];
  hotelId?: string;
  status: 'planning' | 'confirmed' | 'completed';
  shareId: string;
  itineraryItems: ItineraryItem[];
  createdAt: string;
  updatedAt: string;
}

export interface ItineraryItem {
  id: string;
  tripId: string;
  dayNumber: number;
  orderIndex: number;
  name: string;
  category: 'attraction' | 'meal' | 'hotel' | 'transit' | 'activity';
  description: string;
  location: string;
  latitude: number;
  longitude: number;
  openingHours?: string;
  suggestedStartTime: string;
  durationMinutes: number;
  cost: number;
  currency: string;
  distanceKm?: number;
  travelTimeMinutes?: number;
  transportationMethod?: string;
  rating?: number;
  notes?: string;
}

export interface WeatherData {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  condition: string;
  isDay: boolean;
  rainProbability: number;
  dailyForecast: Array<{
    date: string;
    tempMax: number;
    tempMin: number;
    condition: string;
    rainProbability: number;
    weatherCode: number;
  }>;
  hourlyForecast: Array<{
    time: string;
    temp: number;
    rainProbability: number;
  }>;
  alerts?: string[];
  source: string;
}

export interface CurrencyRatesResponse {
  base: string;
  rates: Record<string, number>;
  lastUpdated: string;
  supportedCurrencies: Array<{
    code: string;
    name: string;
    symbol: string;
  }>;
}

export interface TranslationResult {
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  detectedSourceLanguage?: string;
  provider: string;
}

export interface SavedItem {
  id: string;
  placeType: 'hotel' | 'restaurant' | 'attraction' | 'destination' | 'phrase';
  placeId: string;
  name: string;
  destination: string;
  metadata?: any;
  createdAt: string;
}
