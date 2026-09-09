import { calculateDistanceKm } from '../utils/geoUtils';

export interface HotelData {
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
}

export const REAL_HOTELS: HotelData[] = [
  // Tokyo Hotels
  {
    id: 'hotel-park-hyatt-tokyo',
    name: 'Park Hyatt Tokyo',
    destination: 'Tokyo, Japan',
    city: 'Tokyo',
    country: 'Japan',
    address: '3-7-1-2 Nishi-Shinjuku, Shinjuku-Ku, Tokyo 163-1055',
    latitude: 35.6853,
    longitude: 139.6911,
    pricePerNight: 54000,
    currency: 'JPY',
    rating: 4.8,
    reviewsCount: 1840,
    category: 'Luxury',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
    ],
    amenities: ['Spa & Onsen', 'Indoor Pool', 'Free High-Speed WiFi', 'Fitness Center', 'Fine Dining', 'City View Lounge'],
    roomOptions: [
      { type: 'Deluxe King Room with Mount Fuji View', bed: '1 King Bed', capacity: 2, pricePerNight: 54000 },
      { type: 'Park Executive Suite', bed: '1 King Bed', capacity: 3, pricePerNight: 82000 },
    ],
    cancellationPolicy: 'Free cancellation up to 48 hours before check-in',
    provider: 'Booking.com Partner Network',
    bookingBaseUrl: 'https://www.booking.com/searchresults.html?ss=Park+Hyatt+Tokyo',
  },
  {
    id: 'hotel-gracery-shinjuku',
    name: 'Hotel Gracery Shinjuku (Godzilla Head Hotel)',
    destination: 'Tokyo, Japan',
    city: 'Tokyo',
    country: 'Japan',
    address: '1-19-1 Kabukicho, Shinjuku City, Tokyo 160-8466',
    latitude: 35.6953,
    longitude: 139.7022,
    pricePerNight: 18500,
    currency: 'JPY',
    rating: 4.5,
    reviewsCount: 3410,
    category: 'Mid-scale',
    images: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
    ],
    amenities: ['Godzilla Terrace Access', 'Free High-Speed WiFi', 'Air Conditioning', 'Japanese Breakfast Buffet', '24-hour Front Desk'],
    roomOptions: [
      { type: 'Standard Double Room', bed: '1 Queen Bed', capacity: 2, pricePerNight: 18500 },
      { type: 'Godzilla View Twin Room', bed: '2 Single Beds', capacity: 2, pricePerNight: 23000 },
    ],
    cancellationPolicy: 'Free cancellation up to 24 hours prior',
    provider: 'Agoda Official',
    bookingBaseUrl: 'https://www.agoda.com/hotel-gracery-shinjuku/hotel/tokyo-jp.html',
  },
  {
    id: 'hotel-the-gate-asakusa',
    name: 'THE GATE HOTEL Asakusa Kaminarimon by HULIC',
    destination: 'Tokyo, Japan',
    city: 'Tokyo',
    country: 'Japan',
    address: '2-16-11 Kaminarimon, Taito City, Tokyo 111-0034',
    latitude: 35.7118,
    longitude: 139.7942,
    pricePerNight: 22000,
    currency: 'JPY',
    rating: 4.7,
    reviewsCount: 2190,
    category: 'Boutique',
    images: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
    ],
    amenities: ['Rooftop Terrace overlooking Senso-ji', 'Free WiFi', 'French Bistro Restaurant', 'Bar Lounge'],
    roomOptions: [
      { type: 'Essential Double Room', bed: '1 Double Bed', capacity: 2, pricePerNight: 22000 },
      { type: 'Classy Twin Room with Skytree View', bed: '2 Single Beds', capacity: 2, pricePerNight: 29000 },
    ],
    cancellationPolicy: 'Free cancellation up to 48 hours prior',
    provider: 'Booking.com Partner Network',
    bookingBaseUrl: 'https://www.booking.com/searchresults.html?ss=The+Gate+Hotel+Asakusa',
  },

  // Paris Hotels
  {
    id: 'hotel-le-bristol-paris',
    name: 'Le Bristol Paris - an Oetker Collection Hotel',
    destination: 'Paris, France',
    city: 'Paris',
    country: 'France',
    address: '112 Rue du Faubourg Saint-Honoré, 75008 Paris',
    latitude: 48.8719,
    longitude: 2.3146,
    pricePerNight: 1250,
    currency: 'EUR',
    rating: 4.9,
    reviewsCount: 1420,
    category: 'Luxury',
    images: [
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80',
    ],
    amenities: ['3-Michelin-Star Epicure Dining', 'Rooftop Yacht Swimming Pool', 'Private French Garden', 'Valet Parking', 'Luxury Spa'],
    roomOptions: [
      { type: 'Superior Courtyard King Room', bed: '1 King Bed', capacity: 2, pricePerNight: 1250 },
    ],
    cancellationPolicy: 'Free cancellation up to 7 days before check-in',
    provider: 'Booking.com Partner Network',
    bookingBaseUrl: 'https://www.booking.com/searchresults.html?ss=Le+Bristol+Paris',
  },
  {
    id: 'hotel-citizenm-gare-de-lyon',
    name: 'citizenM Paris Gare de Lyon',
    destination: 'Paris, France',
    city: 'Paris',
    country: 'France',
    address: '8 Rue Van Gogh, 75012 Paris',
    latitude: 48.8452,
    longitude: 2.3705,
    pricePerNight: 175,
    currency: 'EUR',
    rating: 4.6,
    reviewsCount: 4180,
    category: 'Boutique',
    images: [
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80',
    ],
    amenities: ['Rooftop CloudM Bar', 'iPad Room Controls', 'Rain Shower', 'Mood Lighting', 'Free Fast WiFi'],
    roomOptions: [
      { type: 'King Room with City View', bed: '1 Extra-large Double Bed', capacity: 2, pricePerNight: 175 },
    ],
    cancellationPolicy: 'Free cancellation up to 24 hours prior',
    provider: 'Booking.com Partner Network',
    bookingBaseUrl: 'https://www.booking.com/searchresults.html?ss=citizenM+Paris+Gare+de+Lyon',
  },

  // Rome Hotels
  {
    id: 'hotel-hotel-raphael-rome',
    name: 'Bio Hotel Raphaël - Relais & Châteaux',
    destination: 'Rome, Italy',
    city: 'Rome',
    country: 'Italy',
    address: 'Largo Febo 2, Navona, 00186 Rome',
    latitude: 41.9004,
    longitude: 12.4716,
    pricePerNight: 360,
    currency: 'EUR',
    rating: 4.7,
    reviewsCount: 1650,
    category: 'Boutique',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    ],
    amenities: ['Ivy-Covered Historic Facade', 'Rooftop Bramante Terrace with St. Peter Views', 'Organic Breakfast', 'Art Museum Lobby'],
    roomOptions: [
      { type: 'Executive Double Room', bed: '1 Queen Bed', capacity: 2, pricePerNight: 360 },
    ],
    cancellationPolicy: 'Free cancellation up to 48 hours prior',
    provider: 'Booking.com Partner Network',
    bookingBaseUrl: 'https://www.booking.com/searchresults.html?ss=Hotel+Raphael+Rome',
  },

  // New York Hotels
  {
    id: 'hotel-the-standard-high-line',
    name: 'The Standard, High Line New York',
    destination: 'New York City, USA',
    city: 'New York',
    country: 'United States',
    address: '848 Washington St, New York, NY 10014',
    latitude: 40.7408,
    longitude: -74.008,
    pricePerNight: 385,
    currency: 'USD',
    rating: 4.5,
    reviewsCount: 2950,
    category: 'Boutique',
    images: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
    ],
    amenities: ['Floor-to-Ceiling Hudson River Views', 'The Standard Grill', 'Le Bain Rooftop Discothèque', 'Biergarten', 'Free WiFi'],
    roomOptions: [
      { type: 'Queen Room with River View', bed: '1 Queen Bed', capacity: 2, pricePerNight: 385 },
      { type: 'Corner King Suite', bed: '1 King Bed', capacity: 2, pricePerNight: 580 },
    ],
    cancellationPolicy: 'Free cancellation up to 48 hours prior',
    provider: 'Booking.com Partner Network',
    bookingBaseUrl: 'https://www.booking.com/searchresults.html?ss=The+Standard+High+Line+New+York',
  },

  // Bali Hotels
  {
    id: 'hotel-maya-ubud-bali',
    name: 'Maya Ubud Resort & Spa',
    destination: 'Bali, Indonesia',
    city: 'Bali',
    country: 'Indonesia',
    address: 'Jl. Gunung Sari Peliatan, Ubud, Bali 80571',
    latitude: -8.5135,
    longitude: 115.2762,
    pricePerNight: 2850000,
    currency: 'IDR',
    rating: 4.8,
    reviewsCount: 2150,
    category: 'Resort',
    images: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
    ],
    amenities: ['Infinity River Pool', 'Jungle Spa Cabanas', 'Daily Yoga Pavilions', 'Free Shuttle to Ubud Center', 'Organic Dining'],
    roomOptions: [
      { type: 'Superior Forest View King Room', bed: '1 King Bed', capacity: 2, pricePerNight: 2850000 },
      { type: 'Deluxe Private Pool Villa', bed: '1 King Bed', capacity: 2, pricePerNight: 4500000 },
    ],
    cancellationPolicy: 'Free cancellation up to 72 hours prior',
    provider: 'Booking.com Partner Network',
    bookingBaseUrl: 'https://www.booking.com/searchresults.html?ss=Maya+Ubud+Resort',
  },

  // London Hotels
  {
    id: 'hotel-the-savoy-london',
    name: 'The Savoy London',
    destination: 'London, United Kingdom',
    city: 'London',
    country: 'United Kingdom',
    address: 'Strand, London WC2R 0EZ',
    latitude: 51.5101,
    longitude: -0.1206,
    pricePerNight: 680,
    currency: 'GBP',
    rating: 4.8,
    reviewsCount: 3820,
    category: 'Luxury',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    ],
    amenities: ['Thames River Views', 'Gordon Ramsay Savoy Grill', 'American Bar', 'Indoor Heated Pool', 'Butler Service'],
    roomOptions: [
      { type: 'Superior Queen Room', bed: '1 Queen Bed', capacity: 2, pricePerNight: 680 },
    ],
    cancellationPolicy: 'Free cancellation up to 48 hours prior',
    provider: 'Booking.com Partner Network',
    bookingBaseUrl: 'https://www.booking.com/searchresults.html?ss=The+Savoy+London',
  },

  // Swiss Alps Hotels
  {
    id: 'hotel-victoria-jungfrau',
    name: 'Victoria-Jungfrau Grand Hotel & Spa',
    destination: 'Swiss Alps & Zurich, Switzerland',
    city: 'Zurich / Interlaken',
    country: 'Switzerland',
    address: 'Höheweg 41, 3800 Interlaken',
    latitude: 46.6865,
    longitude: 7.8576,
    pricePerNight: 550,
    currency: 'CHF',
    rating: 4.9,
    reviewsCount: 1980,
    category: 'Luxury',
    images: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
    ],
    amenities: ['Jungfrau Mountain Views', '5,500m² Spa Nescens', 'Private Tennis Courts', 'Gourmet Swiss Dining'],
    roomOptions: [
      { type: 'Superior Double with Mountain View', bed: '1 King Bed', capacity: 2, pricePerNight: 550 },
    ],
    cancellationPolicy: 'Free cancellation up to 7 days prior',
    provider: 'Booking.com Partner Network',
    bookingBaseUrl: 'https://www.booking.com/searchresults.html?ss=Victoria+Jungfrau+Grand+Hotel',
  },

  // Bangkok Hotels
  {
    id: 'hotel-peninsula-bangkok',
    name: 'The Peninsula Bangkok',
    destination: 'Bangkok, Thailand',
    city: 'Bangkok',
    country: 'Thailand',
    address: '333 Charoen Nakhon Rd, Khlong San, Bangkok 10600',
    latitude: 13.7238,
    longitude: 100.5105,
    pricePerNight: 8500,
    currency: 'THB',
    rating: 4.9,
    reviewsCount: 3200,
    category: 'Luxury',
    images: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
    ],
    amenities: ['Chao Phraya Riverfront', 'Three-Tiered Swimming Pool', 'Peninsula Spa', 'Private River Ferry Transfers'],
    roomOptions: [
      { type: 'Deluxe River View Room', bed: '1 King Bed', capacity: 2, pricePerNight: 8500 },
    ],
    cancellationPolicy: 'Free cancellation up to 24 hours prior',
    provider: 'Booking.com Partner Network',
    bookingBaseUrl: 'https://www.booking.com/searchresults.html?ss=The+Peninsula+Bangkok',
  },

  // Santorini Hotels
  {
    id: 'hotel-canaves-oia-santorini',
    name: 'Canaves Oia Suites & Spa',
    destination: 'Santorini, Greece',
    city: 'Santorini',
    country: 'Greece',
    address: 'Main Street, Oia 847 02, Santorini',
    latitude: 36.4624,
    longitude: 25.3789,
    pricePerNight: 620,
    currency: 'EUR',
    rating: 4.9,
    reviewsCount: 1420,
    category: 'Boutique',
    images: [
      'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80',
    ],
    amenities: ['Private Caldera Plunge Pool', 'Cliffside Infinity Pool', 'Wine Tasting Cellar', 'Champagne Breakfast'],
    roomOptions: [
      { type: 'Classic Suite with Private Plunge Pool', bed: '1 King Bed', capacity: 2, pricePerNight: 620 },
    ],
    cancellationPolicy: 'Free cancellation up to 14 days prior',
    provider: 'Booking.com Partner Network',
    bookingBaseUrl: 'https://www.booking.com/searchresults.html?ss=Canaves+Oia+Suites',
  },

  // Sydney Hotels
  {
    id: 'hotel-park-hyatt-sydney',
    name: 'Park Hyatt Sydney',
    destination: 'Sydney, Australia',
    city: 'Sydney',
    country: 'Australia',
    address: '7 Hickson Rd, The Rocks, Sydney NSW 2000',
    latitude: -33.8562,
    longitude: 151.2099,
    pricePerNight: 890,
    currency: 'AUD',
    rating: 4.8,
    reviewsCount: 2200,
    category: 'Luxury',
    images: [
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80',
    ],
    amenities: ['Direct Sydney Opera House Views', 'Rooftop Heated Pool', 'Private Balconies', 'The Dining Room'],
    roomOptions: [
      { type: 'Opera View King Room', bed: '1 King Bed', capacity: 2, pricePerNight: 890 },
    ],
    cancellationPolicy: 'Free cancellation up to 48 hours prior',
    provider: 'Booking.com Partner Network',
    bookingBaseUrl: 'https://www.booking.com/searchresults.html?ss=Park+Hyatt+Sydney',
  },

  // Cairo Hotels
  {
    id: 'hotel-mena-house-cairo',
    name: 'Marriott Mena House, Cairo',
    destination: 'Cairo, Egypt',
    city: 'Cairo',
    country: 'Egypt',
    address: '6 Pyramids Road, Giza, Cairo',
    latitude: 29.9858,
    longitude: 31.1309,
    pricePerNight: 240,
    currency: 'USD',
    rating: 4.7,
    reviewsCount: 2700,
    category: 'Luxury',
    images: [
      'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=800&q=80',
    ],
    amenities: ['Unobstructed Great Pyramid Views', '40 Acres of Landscaped Gardens', 'Swimming Pool', 'Historic Palace Dining'],
    roomOptions: [
      { type: 'Pyramid View Deluxe King', bed: '1 King Bed', capacity: 2, pricePerNight: 240 },
    ],
    cancellationPolicy: 'Free cancellation up to 48 hours prior',
    provider: 'Booking.com Partner Network',
    bookingBaseUrl: 'https://www.booking.com/searchresults.html?ss=Marriott+Mena+House+Cairo',
  },
  {
    id: 'hotel-w-barcelona',
    name: 'W Barcelona',
    destination: 'Barcelona, Spain',
    city: 'Barcelona',
    country: 'Spain',
    address: 'Plaça Rosa Del Vents 1, Final Passeig de Joan de Borbó, Barcelona',
    latitude: 41.3684,
    longitude: 2.1901,
    pricePerNight: 290,
    currency: 'EUR',
    rating: 4.7,
    reviewsCount: 3120,
    category: 'Luxury',
    images: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Iconic Sail Design', 'Direct Beach Access', 'Rooftop Infinity Pool', 'Bliss Spa', 'Panoramic Mediterranean Views'],
    roomOptions: [
      { type: 'Fabulous Mediterranean View Room', bed: '1 King Bed', capacity: 2, pricePerNight: 290 },
      { type: 'Cool Corner Suite', bed: '1 King Bed', capacity: 3, pricePerNight: 460 },
    ],
    cancellationPolicy: 'Free cancellation up to 72 hours prior to arrival',
    provider: 'Booking.com Partner Network',
    bookingBaseUrl: 'https://www.booking.com/searchresults.html?ss=W+Barcelona',
  },
  {
    id: 'hotel-the-silo-capetown',
    name: 'The Silo Hotel Cape Town',
    destination: 'Cape Town, South Africa',
    city: 'Cape Town',
    country: 'South Africa',
    address: 'Silo Square, V&A Waterfront, Cape Town 8001',
    latitude: -33.9083,
    longitude: 18.4231,
    pricePerNight: 9500,
    currency: 'ZAR',
    rating: 4.9,
    reviewsCount: 840,
    category: 'Luxury',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Pillowed Glass Windows', 'Rooftop Glass Pool with Table Mountain View', 'Zeitz MOCAA Art Museum Access', 'Fine Dining'],
    roomOptions: [
      { type: 'Silo Deluxe Harbour View', bed: '1 King Bed', capacity: 2, pricePerNight: 9500 },
    ],
    cancellationPolicy: 'Free cancellation up to 7 days prior',
    provider: 'Booking.com Partner Network',
    bookingBaseUrl: 'https://www.booking.com/searchresults.html?ss=The+Silo+Hotel+Cape+Town',
  },
  {
    id: 'hotel-copacabana-palace-rio',
    name: 'Belmond Copacabana Palace',
    destination: 'Rio de Janeiro, Brazil',
    city: 'Rio de Janeiro',
    country: 'Brazil',
    address: 'Avenida Atlântica 1702, Copacabana, Rio de Janeiro',
    latitude: -22.9675,
    longitude: -43.1788,
    pricePerNight: 1650,
    currency: 'BRL',
    rating: 4.9,
    reviewsCount: 2280,
    category: 'Luxury',
    images: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Art Deco Landmark', 'Semi-Olympic Pool', 'Michelin-starred Ristorante Hotel Cipriani', 'Copacabana Beach Service'],
    roomOptions: [
      { type: 'Ocean View Superior Room', bed: '1 King Bed', capacity: 2, pricePerNight: 1650 },
    ],
    cancellationPolicy: 'Free cancellation up to 48 hours prior',
    provider: 'Booking.com Partner Network',
    bookingBaseUrl: 'https://www.booking.com/searchresults.html?ss=Belmond+Copacabana+Palace',
  },
  {
    id: 'hotel-marina-bay-sands-sg',
    name: 'Marina Bay Sands',
    destination: 'Singapore',
    city: 'Singapore',
    country: 'Singapore',
    address: '10 Bayfront Avenue, Marina Bay, Singapore 018956',
    latitude: 1.2838,
    longitude: 103.8607,
    pricePerNight: 580,
    currency: 'SGD',
    rating: 4.8,
    reviewsCount: 8900,
    category: 'Luxury',
    images: [
      'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['World Largest Rooftop Infinity Pool (57th floor)', 'SkyPark Observation Deck', 'Celebrity Chef Dining', 'ArtScience Museum Adjacent'],
    roomOptions: [
      { type: 'Deluxe Room with Marina View', bed: '1 King Bed', capacity: 2, pricePerNight: 580 },
      { type: 'Sands Premier Suite', bed: '1 King Bed', capacity: 3, pricePerNight: 980 },
    ],
    cancellationPolicy: 'Free cancellation up to 48 hours prior',
    provider: 'Booking.com Partner Network',
    bookingBaseUrl: 'https://www.booking.com/searchresults.html?ss=Marina+Bay+Sands+Singapore',
  }
];

export function searchHotels(params: {
  destination?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  amenities?: string[];
  category?: string;
  freeCancellationOnly?: boolean;
  sortBy?: 'recommended' | 'cheapest' | 'highest_rated' | 'closest';
  centerLat?: number;
  centerLon?: number;
}): Array<HotelData & { distanceKm?: number }> {
  let list = [...REAL_HOTELS];

  if (params.destination) {
    const q = params.destination.toLowerCase();
    list = list.filter(
      h =>
        h.destination.toLowerCase().includes(q) ||
        h.city.toLowerCase().includes(q) ||
        h.country.toLowerCase().includes(q)
    );
  }

  if (params.minPrice !== undefined) {
    list = list.filter(h => h.pricePerNight >= params.minPrice!);
  }
  if (params.maxPrice !== undefined) {
    list = list.filter(h => h.pricePerNight <= params.maxPrice!);
  }
  if (params.minRating !== undefined) {
    list = list.filter(h => h.rating >= params.minRating!);
  }
  if (params.category && params.category !== 'All') {
    list = list.filter(h => h.category === params.category);
  }
  if (params.freeCancellationOnly) {
    list = list.filter(h => h.cancellationPolicy.toLowerCase().includes('free'));
  }
  if (params.amenities && params.amenities.length > 0) {
    list = list.filter(h =>
      params.amenities!.every(a => h.amenities.some(ha => ha.toLowerCase().includes(a.toLowerCase())))
    );
  }

  // Calculate distance if center coordinates are provided
  const resultsWithDistance = list.map(h => {
    let distanceKm: number | undefined = undefined;
    if (params.centerLat !== undefined && params.centerLon !== undefined) {
      distanceKm = calculateDistanceKm(params.centerLat, params.centerLon, h.latitude, h.longitude);
    }
    return { ...h, distanceKm };
  });

  // Sorting
  if (params.sortBy === 'cheapest') {
    resultsWithDistance.sort((a, b) => a.pricePerNight - b.pricePerNight);
  } else if (params.sortBy === 'highest_rated') {
    resultsWithDistance.sort((a, b) => b.rating - a.rating);
  } else if (params.sortBy === 'closest' && params.centerLat !== undefined) {
    resultsWithDistance.sort((a, b) => (a.distanceKm || 9999) - (b.distanceKm || 9999));
  } else {
    // Recommended: balance rating and reviews
    resultsWithDistance.sort((a, b) => b.rating * Math.log10(b.reviewsCount) - a.rating * Math.log10(a.reviewsCount));
  }

  return resultsWithDistance;
}

export function getHotelById(id: string): HotelData | undefined {
  return REAL_HOTELS.find(h => h.id === id);
}

/**
 * Builds an authentic, deep-linked booking provider redirect URL
 * with exact destination, check-in, check-out dates, and guest parameters
 */
export function buildRealBookingDeepLink(
  hotel: HotelData,
  checkIn: string,
  checkOut: string,
  guests: number = 2
): string {
  const query = encodeURIComponent(`${hotel.name} ${hotel.city}`);
  return `https://www.booking.com/searchresults.html?ss=${query}&checkin=${checkIn}&checkout=${checkOut}&group_adults=${guests}&no_rooms=1`;
}
