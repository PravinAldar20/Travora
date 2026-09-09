export interface DestinationData {
  id: string;
  name: string;
  city: string;
  country: string;
  countryCode: string;
  continent: 'Asia' | 'Europe' | 'North America' | 'South America' | 'Africa' | 'Oceania' | 'Middle East';
  latitude: number;
  longitude: number;
  currency: string;
  language: string;
  languageName: string;
  timezone: string;
  description: string;
  coverImage: string;
  bestSeasons: Array<'Spring' | 'Summer' | 'Autumn' | 'Winter'>;
  idealDaysMin: number;
  idealDaysMax: number;
  budgetTier: 'Budget' | 'Moderate' | 'Luxury';
  estimatedDailyCostUSD: number;
  tags: string[];
  transportInfo: {
    metro: boolean;
    transitCards: string;
    taxiApps: string;
    walkingFriendly: boolean;
  };
  topAttractions: Array<{
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
  }>;
  restaurants: Array<{
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
  }>;
}

export const DESTINATIONS_CATALOG: DestinationData[] = [
  // 1. TOKYO, JAPAN
  {
    id: 'tokyo-japan',
    name: 'Tokyo, Japan',
    city: 'Tokyo',
    country: 'Japan',
    countryCode: 'JP',
    continent: 'Asia',
    latitude: 35.6762,
    longitude: 139.6503,
    currency: 'JPY',
    language: 'ja',
    languageName: 'Japanese',
    timezone: 'Asia/Tokyo',
    description: 'A dazzling juxtaposition of ultra-modern neon skyscrapers and centuries-old historic shrines with legendary cuisine.',
    coverImage: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
    bestSeasons: ['Spring', 'Autumn'],
    idealDaysMin: 4,
    idealDaysMax: 8,
    budgetTier: 'Moderate',
    estimatedDailyCostUSD: 140,
    tags: ['Historical', 'Food', 'Culture', 'Museums', 'Shopping', 'Nightlife', 'Urban Metropolis'],
    transportInfo: {
      metro: true,
      transitCards: 'Suica / Pasmo IC card',
      taxiApps: 'GO, Uber, S.RIDE',
      walkingFriendly: true,
    },
    topAttractions: [
      {
        id: 'senso-ji',
        name: 'Senso-ji Temple & Asakusa',
        category: 'Historical places',
        description: "Tokyo's oldest and most revered Buddhist temple founded in 645 AD.",
        latitude: 35.7148,
        longitude: 139.7967,
        price: 0,
        currency: 'JPY',
        rating: 4.8,
        openingHours: '06:00 - 17:00',
        image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=800&q=80',
        indoor: false,
        durationMinutes: 90,
      },
      {
        id: 'teamlab-planets',
        name: 'teamLab Planets Digital Art Museum',
        category: 'Museums',
        description: 'Immersive body-interactive digital art exhibition where visitors walk through water and crystal light installations.',
        latitude: 35.6496,
        longitude: 139.7901,
        price: 3800,
        currency: 'JPY',
        rating: 4.9,
        openingHours: '09:00 - 22:00',
        image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
        indoor: true,
        durationMinutes: 120,
      },
      {
        id: 'meiji-shrine',
        name: 'Meiji Jingu Shrine & Yoyogi Forest',
        category: 'Nature',
        description: 'Serene forested Shinto shrine in the center of bustling Shibuya.',
        latitude: 35.6764,
        longitude: 139.6993,
        price: 0,
        currency: 'JPY',
        rating: 4.7,
        openingHours: '05:30 - 18:00',
        image: 'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=800&q=80',
        indoor: false,
        durationMinutes: 75,
      }
    ],
    restaurants: [
      {
        id: 'ichiran-shibuya',
        name: 'Ichiran Ramen Shibuya',
        cuisine: 'Japanese Tonkotsu Ramen',
        priceLevel: '$$',
        avgCost: 1400,
        currency: 'JPY',
        rating: 4.7,
        latitude: 35.6601,
        longitude: 139.7001,
        address: '1-22-7 Jinnan, Shibuya City, Tokyo',
        image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80',
        dietary: ['Pork-free broth available', 'Custom spice'],
        isFamilyFriendly: true,
      }
    ]
  },

  // 2. BALI, INDONESIA
  {
    id: 'bali-indonesia',
    name: 'Bali, Indonesia',
    city: 'Bali',
    country: 'Indonesia',
    countryCode: 'ID',
    continent: 'Asia',
    latitude: -8.4095,
    longitude: 115.1889,
    currency: 'IDR',
    language: 'id',
    languageName: 'Indonesian',
    timezone: 'Asia/Makassar',
    description: 'Tropical paradise known for verdant rice terraces, spiritual sea temples, world-class surf breaks, and tranquil wellness retreats.',
    coverImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
    bestSeasons: ['Summer', 'Spring', 'Autumn'],
    idealDaysMin: 5,
    idealDaysMax: 10,
    budgetTier: 'Budget',
    estimatedDailyCostUSD: 55,
    tags: ['Beaches', 'Nature', 'Relaxation', 'Culture', 'Adventure', 'Romantic', 'Budget-Friendly'],
    transportInfo: {
      metro: false,
      transitCards: 'None',
      taxiApps: 'Grab, Gojek',
      walkingFriendly: false,
    },
    topAttractions: [
      {
        id: 'ubud-monkey-forest',
        name: 'Sacred Monkey Forest Sanctuary Ubud',
        category: 'Nature',
        description: 'Lush natural sanctuary home to over 1,000 Balinese long-tailed macaques and ancient moss-covered temples.',
        latitude: -8.5188,
        longitude: 115.2585,
        price: 80000,
        currency: 'IDR',
        rating: 4.6,
        openingHours: '09:00 - 18:00',
        image: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80',
        indoor: false,
        durationMinutes: 90,
      },
      {
        id: 'tanah-lot',
        name: 'Tanah Lot Sea Temple',
        category: 'Historical places',
        description: 'Iconic offshore rock formation and Hindu pilgrimage temple renowned for breathtaking ocean sunsets.',
        latitude: -8.6212,
        longitude: 115.0868,
        price: 60000,
        currency: 'IDR',
        rating: 4.7,
        openingHours: '07:00 - 19:00',
        image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
        indoor: false,
        durationMinutes: 75,
      },
      {
        id: 'tegalalang-rice-terrace',
        name: 'Tegalalang Rice Terraces',
        category: 'Nature',
        description: 'Spectacular stepped emerald paddy fields showcasing the traditional Balinese subak cooperative irrigation system.',
        latitude: -8.4342,
        longitude: 115.2796,
        price: 25000,
        currency: 'IDR',
        rating: 4.7,
        openingHours: '08:00 - 18:00',
        image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80',
        indoor: false,
        durationMinutes: 90,
      }
    ],
    restaurants: [
      {
        id: 'warung-babi-guling-ibu-oka',
        name: 'Warung Babi Guling Ibu Oka',
        cuisine: 'Traditional Balinese Roasted Pork',
        priceLevel: '$',
        avgCost: 75000,
        currency: 'IDR',
        rating: 4.6,
        latitude: -8.5069,
        longitude: 115.2625,
        address: 'Jl. Suweta No.2, Ubud, Bali',
        image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
        dietary: ['Authentic Balinese spices'],
        isFamilyFriendly: true,
      }
    ]
  },

  // 3. PARIS, FRANCE
  {
    id: 'paris-france',
    name: 'Paris, France',
    city: 'Paris',
    country: 'France',
    countryCode: 'FR',
    continent: 'Europe',
    latitude: 48.8566,
    longitude: 2.3522,
    currency: 'EUR',
    language: 'fr',
    languageName: 'French',
    timezone: 'Europe/Paris',
    description: 'The City of Light, celebrated for high fashion, romantic boulevards, world-renowned museums, and Michelin gastronomy.',
    coverImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
    bestSeasons: ['Spring', 'Autumn', 'Summer'],
    idealDaysMin: 4,
    idealDaysMax: 7,
    budgetTier: 'Moderate',
    estimatedDailyCostUSD: 165,
    tags: ['Romantic', 'Culture', 'Museums', 'Historical', 'Food', 'Shopping', 'Architecture'],
    transportInfo: {
      metro: true,
      transitCards: 'Navigo Easy / Paris Visite',
      taxiApps: 'G7, Uber, Bolt',
      walkingFriendly: true,
    },
    topAttractions: [
      {
        id: 'eiffel-tower',
        name: 'Eiffel Tower & Champ de Mars',
        category: 'Historical places',
        description: 'The global emblem of France offering breathtaking vistas from the summit.',
        latitude: 48.8584,
        longitude: 2.2945,
        price: 28,
        currency: 'EUR',
        rating: 4.8,
        openingHours: '09:00 - 23:45',
        image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=800&q=80',
        indoor: false,
        durationMinutes: 120,
      },
      {
        id: 'louvre-museum',
        name: 'Louvre Museum',
        category: 'Museums',
        description: "The world's largest art museum, home to Leonardo da Vinci's Mona Lisa.",
        latitude: 48.8606,
        longitude: 2.3376,
        price: 22,
        currency: 'EUR',
        rating: 4.8,
        openingHours: '09:00 - 18:00 (Closed Tue)',
        image: 'https://images.unsplash.com/photo-1565099824688-e93eb20fe527?auto=format&fit=crop&w=800&q=80',
        indoor: true,
        durationMinutes: 180,
      }
    ],
    restaurants: [
      {
        id: 'bouillon-chartier',
        name: 'Bouillon Chartier',
        cuisine: 'Classic Belle Époque French Brasserie',
        priceLevel: '$',
        avgCost: 18,
        currency: 'EUR',
        rating: 4.5,
        latitude: 48.8718,
        longitude: 2.3432,
        address: '7 Rue du Faubourg Montmartre, Paris',
        image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80',
        dietary: ['Vegetarian choices', 'French classics'],
        isFamilyFriendly: true,
      }
    ]
  },

  // 4. ROME, ITALY
  {
    id: 'rome-italy',
    name: 'Rome, Italy',
    city: 'Rome',
    country: 'Italy',
    countryCode: 'IT',
    continent: 'Europe',
    latitude: 41.9028,
    longitude: 12.4964,
    currency: 'EUR',
    language: 'it',
    languageName: 'Italian',
    timezone: 'Europe/Rome',
    description: 'The Eternal City where ancient Roman amphitheaters, Renaissance palaces, and authentic pasta trattorias unite.',
    coverImage: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80',
    bestSeasons: ['Spring', 'Autumn'],
    idealDaysMin: 3,
    idealDaysMax: 6,
    budgetTier: 'Moderate',
    estimatedDailyCostUSD: 130,
    tags: ['Historical', 'Culture', 'Food', 'Architecture', 'Romantic'],
    transportInfo: {
      metro: true,
      transitCards: 'Metrebus Roma ticket',
      taxiApps: 'FreeNow, Uber',
      walkingFriendly: true,
    },
    topAttractions: [
      {
        id: 'colosseum',
        name: 'Colosseum & Roman Forum',
        category: 'Historical places',
        description: 'The awe-inspiring ancient gladiator amphitheater and civic heart of the Roman Empire.',
        latitude: 41.8902,
        longitude: 12.4922,
        price: 18,
        currency: 'EUR',
        rating: 4.8,
        openingHours: '08:30 - 19:15',
        image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80',
        indoor: false,
        durationMinutes: 150,
      },
      {
        id: 'pantheon-rome',
        name: 'The Pantheon',
        category: 'Historical places',
        description: 'Immaculately preserved temple from 125 AD boasting the world’s largest unreinforced concrete dome.',
        latitude: 41.8986,
        longitude: 12.4769,
        price: 5,
        currency: 'EUR',
        rating: 4.9,
        openingHours: '09:00 - 19:00',
        image: 'https://images.unsplash.com/photo-1543429776-2782fc8e1acd?auto=format&fit=crop&w=800&q=80',
        indoor: true,
        durationMinutes: 60,
      }
    ],
    restaurants: [
      {
        id: 'da-enzo-trastevere',
        name: 'Da Enzo al 29',
        cuisine: 'Roman Cacio e Pepe & Carbonara',
        priceLevel: '$$',
        avgCost: 24,
        currency: 'EUR',
        rating: 4.8,
        latitude: 41.8887,
        longitude: 12.4777,
        address: 'Via dei Vascellari 29, Rome',
        image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281691?auto=format&fit=crop&w=800&q=80',
        dietary: ['Vegetarian pasta', 'Artisanal tiramisu'],
        isFamilyFriendly: true,
      }
    ]
  },

  // 5. LONDON, UNITED KINGDOM
  {
    id: 'london-uk',
    name: 'London, United Kingdom',
    city: 'London',
    country: 'United Kingdom',
    countryCode: 'GB',
    continent: 'Europe',
    latitude: 51.5074,
    longitude: -0.1278,
    currency: 'GBP',
    language: 'en',
    languageName: 'English',
    timezone: 'Europe/London',
    description: 'Dynamic royal capital famed for Westminster, world-class free museums, West End theatre, and historic Thames riverfronts.',
    coverImage: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80',
    bestSeasons: ['Summer', 'Spring', 'Autumn'],
    idealDaysMin: 4,
    idealDaysMax: 7,
    budgetTier: 'Moderate',
    estimatedDailyCostUSD: 160,
    tags: ['Historical', 'Museums', 'Culture', 'Theatre', 'Urban Metropolis', 'Shopping'],
    transportInfo: {
      metro: true,
      transitCards: 'Oyster card / Contactless bank card',
      taxiApps: 'Uber, FreeNow, London Black Cabs',
      walkingFriendly: true,
    },
    topAttractions: [
      {
        id: 'british-museum',
        name: 'The British Museum',
        category: 'Museums',
        description: 'Vast treasury dedicated to human history, art, and culture, home to the Rosetta Stone and Egyptian mummies.',
        latitude: 51.5194,
        longitude: -0.127,
        price: 0,
        currency: 'GBP',
        rating: 4.8,
        openingHours: '10:00 - 17:00',
        image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80',
        indoor: true,
        durationMinutes: 180,
      },
      {
        id: 'tower-bridge',
        name: 'Tower Bridge & Tower of London',
        category: 'Historical places',
        description: 'Famous Victorian bascule bridge and ancient royal fortress housing the Crown Jewels.',
        latitude: 51.5055,
        longitude: -0.0754,
        price: 33,
        currency: 'GBP',
        rating: 4.8,
        openingHours: '09:00 - 17:30',
        image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80',
        indoor: false,
        durationMinutes: 150,
      }
    ],
    restaurants: [
      {
        id: 'dishoom-covent-garden',
        name: 'Dishoom Covent Garden',
        cuisine: 'Bombay Cafe & Indian Street Food',
        priceLevel: '$$',
        avgCost: 28,
        currency: 'GBP',
        rating: 4.7,
        latitude: 51.5126,
        longitude: -0.1278,
        address: '12 Upper St Martin’s Lane, London',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
        dietary: ['Vegetarian', 'Vegan menu', 'Halal options'],
        isFamilyFriendly: true,
      }
    ]
  },

  // 6. SWISS ALPS (ZURICH & INTERLAKEN), SWITZERLAND
  {
    id: 'swiss-alps-switzerland',
    name: 'Swiss Alps & Zurich, Switzerland',
    city: 'Zurich / Interlaken',
    country: 'Switzerland',
    countryCode: 'CH',
    continent: 'Europe',
    latitude: 46.6863,
    longitude: 7.8632,
    currency: 'CHF',
    language: 'de',
    languageName: 'German / French',
    timezone: 'Europe/Zurich',
    description: 'Postcard-perfect alpine wonderland of snow-capped peaks, crystal glacial lakes, cogwheel mountain railways, and luxury chocolate.',
    coverImage: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80',
    bestSeasons: ['Winter', 'Summer'],
    idealDaysMin: 4,
    idealDaysMax: 8,
    budgetTier: 'Luxury',
    estimatedDailyCostUSD: 230,
    tags: ['Mountains', 'Adventure', 'Nature', 'Romantic', 'Luxury', 'Skiing', 'Scenic Views'],
    transportInfo: {
      metro: true,
      transitCards: 'Swiss Travel Pass',
      taxiApps: 'SBB Train Mobile App, Uber',
      walkingFriendly: true,
    },
    topAttractions: [
      {
        id: 'jungfraujoch',
        name: 'Jungfraujoch - Top of Europe',
        category: 'Mountains',
        description: 'Highest railway station in Europe at 3,454m surrounded by perpetual snow, ice palaces, and Aletsch Glacier.',
        latitude: 46.5475,
        longitude: 7.9824,
        price: 185,
        currency: 'CHF',
        rating: 4.9,
        openingHours: '08:00 - 17:00',
        image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80',
        indoor: false,
        durationMinutes: 240,
      }
    ],
    restaurants: [
      {
        id: 'fondue-chalet-interlaken',
        name: 'Chalet Swiss Restaurant',
        cuisine: 'Traditional Swiss Cheese Fondue & Raclette',
        priceLevel: '$$$',
        avgCost: 55,
        currency: 'CHF',
        rating: 4.7,
        latitude: 46.685,
        longitude: 7.859,
        address: 'Seestrasse 22, Interlaken',
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
        dietary: ['Vegetarian cheese options'],
        isFamilyFriendly: true,
      }
    ]
  },

  // 7. DUBAI, UAE
  {
    id: 'dubai-uae',
    name: 'Dubai, UAE',
    city: 'Dubai',
    country: 'United Arab Emirates',
    countryCode: 'AE',
    continent: 'Middle East',
    latitude: 25.2048,
    longitude: 55.2708,
    currency: 'AED',
    language: 'ar',
    languageName: 'Arabic',
    timezone: 'Asia/Dubai',
    description: 'Futuristic desert metropolis boasting towering architectural marvels, luxury shopping malls, and desert safari adventures.',
    coverImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
    bestSeasons: ['Winter', 'Spring', 'Autumn'],
    idealDaysMin: 3,
    idealDaysMax: 6,
    budgetTier: 'Luxury',
    estimatedDailyCostUSD: 190,
    tags: ['Luxury', 'Shopping', 'Architecture', 'Desert', 'Nightlife', 'Family', 'Entertainment'],
    transportInfo: {
      metro: true,
      transitCards: 'Nol Card',
      taxiApps: 'Careem, Uber',
      walkingFriendly: false,
    },
    topAttractions: [
      {
        id: 'burj-khalifa',
        name: 'Burj Khalifa Observation Deck',
        category: 'Entertainment',
        description: 'The world’s tallest skyscraper soaring 828m with panoramic vistas over the Arabian Gulf.',
        latitude: 25.1972,
        longitude: 55.2744,
        price: 179,
        currency: 'AED',
        rating: 4.8,
        openingHours: '08:30 - 23:00',
        image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=800&q=80',
        indoor: true,
        durationMinutes: 120,
      }
    ],
    restaurants: [
      {
        id: 'arabian-tea-house',
        name: 'Arabian Tea House',
        cuisine: 'Traditional Emirati Barbecue & Mezze',
        priceLevel: '$$',
        avgCost: 85,
        currency: 'AED',
        rating: 4.7,
        latitude: 25.2631,
        longitude: 55.2972,
        address: 'Al Fahidi Historical District, Bur Dubai',
        image: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=800&q=80',
        dietary: ['Halal certified', 'Vegetarian friendly'],
        isFamilyFriendly: true,
      }
    ]
  },

  // 8. BANGKOK & PHUKET, THAILAND
  {
    id: 'bangkok-thailand',
    name: 'Bangkok, Thailand',
    city: 'Bangkok',
    country: 'Thailand',
    countryCode: 'TH',
    continent: 'Asia',
    latitude: 13.7563,
    longitude: 100.5018,
    currency: 'THB',
    language: 'th',
    languageName: 'Thai',
    timezone: 'Asia/Bangkok',
    description: 'Electric Asian capital of golden Buddhist wats, floating markets, bustling tuk-tuks, and world-famous aromatic street food.',
    coverImage: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1200&q=80',
    bestSeasons: ['Winter', 'Spring'],
    idealDaysMin: 3,
    idealDaysMax: 7,
    budgetTier: 'Budget',
    estimatedDailyCostUSD: 45,
    tags: ['Food', 'Culture', 'Historical', 'Budget-Friendly', 'Nightlife', 'Shopping', 'Local experiences'],
    transportInfo: {
      metro: true,
      transitCards: 'Rabbit Card / BTS SkyTrain',
      taxiApps: 'Grab, Bolt',
      walkingFriendly: false,
    },
    topAttractions: [
      {
        id: 'wat-pho',
        name: 'Wat Pho & The Reclining Buddha',
        category: 'Historical places',
        description: 'Majestic 46m long gold-leaf reclining Buddha and birthplace of traditional Thai massage.',
        latitude: 13.7465,
        longitude: 100.4933,
        price: 200,
        currency: 'THB',
        rating: 4.8,
        openingHours: '08:00 - 18:30',
        image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=800&q=80',
        indoor: false,
        durationMinutes: 90,
      }
    ],
    restaurants: [
      {
        id: 'thip-samai-pad-thai',
        name: 'Thip Samai Pad Thai',
        cuisine: 'World Famous Fire-Wok Pad Thai',
        priceLevel: '$',
        avgCost: 150,
        currency: 'THB',
        rating: 4.6,
        latitude: 13.7527,
        longitude: 100.5048,
        address: '313 Maha Chai Rd, Samran Rat, Bangkok',
        image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=800&q=80',
        dietary: ['Prawn, Chicken, Tofu Pad Thai'],
        isFamilyFriendly: true,
      }
    ]
  },

  // 9. NEW YORK CITY, USA
  {
    id: 'new-york-usa',
    name: 'New York City, USA',
    city: 'New York',
    country: 'United States',
    countryCode: 'US',
    continent: 'North America',
    latitude: 40.7128,
    longitude: -74.006,
    currency: 'USD',
    language: 'en',
    languageName: 'English',
    timezone: 'America/New_York',
    description: 'The City That Never Sleeps: iconic Broadway theatre, the sprawling greenery of Central Park, and unforgettable skyline views.',
    coverImage: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80',
    bestSeasons: ['Autumn', 'Spring', 'Winter'],
    idealDaysMin: 4,
    idealDaysMax: 7,
    budgetTier: 'Moderate',
    estimatedDailyCostUSD: 195,
    tags: ['Urban Metropolis', 'Museums', 'Food', 'Entertainment', 'Shopping', 'Culture'],
    transportInfo: {
      metro: true,
      transitCards: 'OMNY contactless tap / MetroCard',
      taxiApps: 'Uber, Lyft, Yellow Cabs',
      walkingFriendly: true,
    },
    topAttractions: [
      {
        id: 'central-park',
        name: 'Central Park',
        category: 'Nature',
        description: '843-acre urban sanctuary featuring Bethesda Terrace and Bow Bridge.',
        latitude: 40.7829,
        longitude: -73.9654,
        price: 0,
        currency: 'USD',
        rating: 4.9,
        openingHours: '06:00 - 01:00',
        image: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&w=800&q=80',
        indoor: false,
        durationMinutes: 120,
      }
    ],
    restaurants: [
      {
        id: 'katz-deli',
        name: "Katz's Delicatessen",
        cuisine: 'Legendary Hand-Carved Pastrami',
        priceLevel: '$$',
        avgCost: 28,
        currency: 'USD',
        rating: 4.6,
        latitude: 40.7222,
        longitude: -73.9874,
        address: '205 E Houston St, New York',
        image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80',
        dietary: ['Kosher-style deli'],
        isFamilyFriendly: true,
      }
    ]
  },

  // 10. CANCUN & RIVIERA MAYA, MEXICO
  {
    id: 'cancun-mexico',
    name: 'Cancun & Riviera Maya, Mexico',
    city: 'Cancun',
    country: 'Mexico',
    countryCode: 'MX',
    continent: 'North America',
    latitude: 21.1619,
    longitude: -86.8515,
    currency: 'MXN',
    language: 'es',
    languageName: 'Spanish',
    timezone: 'America/Cancun',
    description: 'Caribbean coast jewel boasting turquoise waters, pristine coral reefs, cenotes, and ancient Mayan ruins.',
    coverImage: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1200&q=80',
    bestSeasons: ['Winter', 'Spring'],
    idealDaysMin: 4,
    idealDaysMax: 8,
    budgetTier: 'Moderate',
    estimatedDailyCostUSD: 85,
    tags: ['Beaches', 'Adventure', 'Historical', 'Relaxation', 'Family', 'Water Sports'],
    transportInfo: {
      metro: false,
      transitCards: 'None',
      taxiApps: 'Uber, Didi, Local Taxis',
      walkingFriendly: false,
    },
    topAttractions: [
      {
        id: 'chichen-itza',
        name: 'Chichen Itza Mayan Pyramid',
        category: 'Historical places',
        description: 'New 7 Wonder of the World: ancient monumental Maya ceremonial city dominated by El Castillo.',
        latitude: 20.6843,
        longitude: -88.5678,
        price: 614,
        currency: 'MXN',
        rating: 4.8,
        openingHours: '08:00 - 17:00',
        image: 'https://images.unsplash.com/photo-1518638150340-f706e86654de?auto=format&fit=crop&w=800&q=80',
        indoor: false,
        durationMinutes: 180,
      }
    ],
    restaurants: [
      {
        id: 'los-chilitos-cancun',
        name: 'Los Chilitos Mexican Grill',
        cuisine: 'Fresh Ceviche & Tacos al Pastor',
        priceLevel: '$$',
        avgCost: 320,
        currency: 'MXN',
        rating: 4.7,
        latitude: 21.145,
        longitude: -86.82,
        address: 'Av. Yaxchilan, Cancun',
        image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=800&q=80',
        dietary: ['Fresh Seafood', 'Gluten-Free Corn Tortillas'],
        isFamilyFriendly: true,
      }
    ]
  },

  // 11. SANTORINI, GREECE
  {
    id: 'santorini-greece',
    name: 'Santorini, Greece',
    city: 'Santorini',
    country: 'Greece',
    countryCode: 'GR',
    continent: 'Europe',
    latitude: 36.3932,
    longitude: 25.4615,
    currency: 'EUR',
    language: 'el',
    languageName: 'Greek',
    timezone: 'Europe/Athens',
    description: 'Breathtaking volcanic caldera rimmed with whitewashed cliffside villages, blue-domed chapels, and fiery sunsets.',
    coverImage: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80',
    bestSeasons: ['Spring', 'Summer', 'Autumn'],
    idealDaysMin: 3,
    idealDaysMax: 6,
    budgetTier: 'Luxury',
    estimatedDailyCostUSD: 185,
    tags: ['Romantic', 'Beaches', 'Scenic Views', 'Relaxation', 'Food', 'Culture'],
    transportInfo: {
      metro: false,
      transitCards: 'KTEL Santorini Bus',
      taxiApps: 'Local Taxis, Boat Transfers',
      walkingFriendly: true,
    },
    topAttractions: [
      {
        id: 'oia-village',
        name: 'Oia Sunset Point & Blue Domes',
        category: 'Culture',
        description: 'Iconic clifftop Aegean village legendary for romantic sunset spectacles over the submerged caldera.',
        latitude: 36.4618,
        longitude: 25.3753,
        price: 0,
        currency: 'EUR',
        rating: 4.9,
        openingHours: 'Open 24 hours',
        image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80',
        indoor: false,
        durationMinutes: 120,
      }
    ],
    restaurants: [
      {
        id: 'metaxy-mas-tavern',
        name: 'Metaxy Mas Tavern',
        cuisine: 'Authentic Cretan & Cycladic Seafood',
        priceLevel: '$$',
        avgCost: 35,
        currency: 'EUR',
        rating: 4.8,
        latitude: 36.388,
        longitude: 25.452,
        address: 'Exo Gonia, Santorini',
        image: 'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?auto=format&fit=crop&w=800&q=80',
        dietary: ['Mediterranean Diet', 'Fresh Octopus', 'Vegetarian'],
        isFamilyFriendly: true,
      }
    ]
  },

  // 12. SYDNEY, AUSTRALIA
  {
    id: 'sydney-australia',
    name: 'Sydney, Australia',
    city: 'Sydney',
    country: 'Australia',
    countryCode: 'AU',
    continent: 'Oceania',
    latitude: -33.8688,
    longitude: 151.2093,
    currency: 'AUD',
    language: 'en',
    languageName: 'English',
    timezone: 'Australia/Sydney',
    description: 'Sun-drenched harbour city renowned for the architectural Sydney Opera House, golden Bondi Beach, and coastal walking paths.',
    coverImage: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1200&q=80',
    bestSeasons: ['Spring', 'Summer', 'Autumn'],
    idealDaysMin: 4,
    idealDaysMax: 8,
    budgetTier: 'Moderate',
    estimatedDailyCostUSD: 145,
    tags: ['Beaches', 'Urban Metropolis', 'Culture', 'Nature', 'Adventure', 'Food'],
    transportInfo: {
      metro: true,
      transitCards: 'Opal Card / Contactless tap',
      taxiApps: 'Uber, Didi, 13Cabs',
      walkingFriendly: true,
    },
    topAttractions: [
      {
        id: 'sydney-opera-house',
        name: 'Sydney Opera House & Circular Quay',
        category: 'Culture',
        description: 'World Heritage architectural icon designed by Jørn Utzon with expressive sail-shaped shells.',
        latitude: -33.8568,
        longitude: 151.2153,
        price: 45,
        currency: 'AUD',
        rating: 4.8,
        openingHours: '09:00 - 18:00',
        image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80',
        indoor: true,
        durationMinutes: 90,
      }
    ],
    restaurants: [
      {
        id: 'icebergs-dining-room',
        name: 'Icebergs Dining Room & Bar',
        cuisine: 'Modern Australian & Italian Seaside Dining',
        priceLevel: '$$$',
        avgCost: 75,
        currency: 'AUD',
        rating: 4.6,
        latitude: -33.892,
        longitude: 151.275,
        address: '1 Notts Ave, Bondi Beach, Sydney',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
        dietary: ['Pacific Seafood', 'Vegetarian'],
        isFamilyFriendly: true,
      }
    ]
  },

  // 13. CAIRO, EGYPT
  {
    id: 'cairo-egypt',
    name: 'Cairo, Egypt',
    city: 'Cairo',
    country: 'Egypt',
    countryCode: 'EG',
    continent: 'Africa',
    latitude: 30.0444,
    longitude: 31.2357,
    currency: 'USD',
    language: 'ar',
    languageName: 'Arabic',
    timezone: 'Africa/Cairo',
    description: 'Cradle of civilization where the Great Pyramids of Giza and the Sphinx guard thousands of years of pharaonic heritage.',
    coverImage: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=1200&q=80',
    bestSeasons: ['Winter', 'Spring', 'Autumn'],
    idealDaysMin: 3,
    idealDaysMax: 6,
    budgetTier: 'Budget',
    estimatedDailyCostUSD: 50,
    tags: ['Historical', 'Culture', 'Museums', 'Budget-Friendly', 'Ancient Wonders'],
    transportInfo: {
      metro: true,
      transitCards: 'Cairo Metro ticket',
      taxiApps: 'Uber, Careem',
      walkingFriendly: false,
    },
    topAttractions: [
      {
        id: 'pyramids-of-giza',
        name: 'Great Pyramids of Giza & The Sphinx',
        category: 'Historical places',
        description: 'The sole surviving Wonder of the Ancient World built as monumental tombs for fourth-dynasty pharaohs.',
        latitude: 29.9792,
        longitude: 31.1342,
        price: 25,
        currency: 'USD',
        rating: 4.8,
        openingHours: '08:00 - 17:00',
        image: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=800&q=80',
        indoor: false,
        durationMinutes: 180,
      }
    ],
    restaurants: [
      {
        id: 'abou-tarek-koshary',
        name: 'Koshary Abou Tarek',
        cuisine: 'Traditional Egyptian Koshary',
        priceLevel: '$',
        avgCost: 6,
        currency: 'USD',
        rating: 4.7,
        latitude: 30.052,
        longitude: 31.238,
        address: '16 Marouf, Qasr El Nil, Cairo',
        image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
        dietary: ['100% Vegan friendly lentils & chickpeas'],
        isFamilyFriendly: true,
      }
    ]
  },

  // 14. QUEENSTOWN, NEW ZEALAND
  {
    id: 'queenstown-nz',
    name: 'Queenstown, New Zealand',
    city: 'Queenstown',
    country: 'New Zealand',
    countryCode: 'NZ',
    continent: 'Oceania',
    latitude: -45.0312,
    longitude: 168.6626,
    currency: 'NZD',
    language: 'en',
    languageName: 'English',
    timezone: 'Pacific/Auckland',
    description: 'Adventure capital of the Southern Hemisphere set against Lake Wakatipu and dramatic Southern Alps.',
    coverImage: 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?auto=format&fit=crop&w=1200&q=80',
    bestSeasons: ['Summer', 'Winter', 'Autumn'],
    idealDaysMin: 4,
    idealDaysMax: 8,
    budgetTier: 'Moderate',
    estimatedDailyCostUSD: 140,
    tags: ['Adventure', 'Nature', 'Mountains', 'Skiing', 'Scenic Views'],
    transportInfo: {
      metro: false,
      transitCards: 'Orbus Bee Card',
      taxiApps: 'Uber, Green Cabs',
      walkingFriendly: true,
    },
    topAttractions: [
      {
        id: 'milford-sound-cruise',
        name: 'Milford Sound Fjord Cruise',
        category: 'Nature',
        description: 'Majestic glacier-carved fjord with plunging waterfalls and resident fur seals.',
        latitude: -44.6715,
        longitude: 167.9265,
        price: 120,
        currency: 'NZD',
        rating: 4.9,
        openingHours: '08:00 - 18:00',
        image: 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?auto=format&fit=crop&w=800&q=80',
        indoor: false,
        durationMinutes: 240,
      }
    ],
    restaurants: [
      {
        id: 'fergburger-queenstown',
        name: 'Fergburger',
        cuisine: 'World Legendary Gourmet Burgers',
        priceLevel: '$$',
        avgCost: 22,
        currency: 'NZD',
        rating: 4.8,
        latitude: -45.0315,
        longitude: 168.6601,
        address: '42 Shotover St, Queenstown',
        image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80',
        dietary: ['Gourmet Prime Beef, Lamb, Venison, Tofu'],
        isFamilyFriendly: true,
      }
    ]
  },

  // 15. BARCELONA, SPAIN
  {
    id: 'barcelona-spain',
    name: 'Barcelona, Spain',
    city: 'Barcelona',
    country: 'Spain',
    countryCode: 'ES',
    continent: 'Europe',
    latitude: 41.3879,
    longitude: 2.1686,
    currency: 'EUR',
    language: 'es',
    languageName: 'Spanish',
    timezone: 'Europe/Madrid',
    description: 'Mediterranean jewel blending Gaudí architectural masterpieces, golden city beaches, and legendary tapas culture.',
    coverImage: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=1200&q=80',
    bestSeasons: ['Spring', 'Summer', 'Autumn'],
    idealDaysMin: 3,
    idealDaysMax: 6,
    budgetTier: 'Moderate',
    estimatedDailyCostUSD: 120,
    tags: ['Architecture', 'Beaches', 'Culture', 'Food', 'Nightlife'],
    transportInfo: {
      metro: true,
      transitCards: 'Hola Barcelona Travel Card',
      taxiApps: 'FreeNow, Cabify',
      walkingFriendly: true,
    },
    topAttractions: [
      {
        id: 'sagrada-familia',
        name: 'Basílica de la Sagrada Família',
        category: 'Historical places',
        description: 'Antoni Gaudí’s awe-inspiring modernist basilica with soaring organic spires.',
        latitude: 41.4036,
        longitude: 2.1744,
        price: 26,
        currency: 'EUR',
        rating: 4.9,
        openingHours: '09:00 - 19:00',
        image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=800&q=80',
        indoor: true,
        durationMinutes: 120,
      },
      {
        id: 'park-guell',
        name: 'Park Güell',
        category: 'Nature',
        description: 'Enchanting hilltop park featuring colorful mosaic salamanders and panoramic city views.',
        latitude: 41.4145,
        longitude: 2.1527,
        price: 10,
        currency: 'EUR',
        rating: 4.7,
        openingHours: '09:30 - 19:30',
        image: 'https://images.unsplash.com/photo-1564221710304-0b34005c8790?auto=format&fit=crop&w=800&q=80',
        indoor: false,
        durationMinutes: 90,
      }
    ],
    restaurants: [
      {
        id: 'el-xampanyet',
        name: 'El Xampanyet',
        cuisine: 'Traditional Catalan Tapas & Cava',
        priceLevel: '$$',
        avgCost: 24,
        currency: 'EUR',
        rating: 4.7,
        latitude: 41.3838,
        longitude: 2.1818,
        address: 'Carrer de Montcada, 22, Barcelona',
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
        dietary: ['Anchovies', 'Ibérico Jamón', 'Cava'],
        isFamilyFriendly: true,
      }
    ]
  },

  // 16. CAPE TOWN, SOUTH AFRICA
  {
    id: 'cape-town-south-africa',
    name: 'Cape Town, South Africa',
    city: 'Cape Town',
    country: 'South Africa',
    countryCode: 'ZA',
    continent: 'Africa',
    latitude: -33.9249,
    longitude: 18.4241,
    currency: 'ZAR',
    language: 'en',
    languageName: 'English',
    timezone: 'Africa/Johannesburg',
    description: 'The Mother City perched between dramatic ocean vistas and the towering flat-topped grandeur of Table Mountain.',
    coverImage: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=1200&q=80',
    bestSeasons: ['Summer', 'Spring', 'Autumn'],
    idealDaysMin: 4,
    idealDaysMax: 8,
    budgetTier: 'Budget',
    estimatedDailyCostUSD: 75,
    tags: ['Mountains', 'Nature', 'Beaches', 'Wine', 'Adventure'],
    transportInfo: {
      metro: false,
      transitCards: 'MyCiTi card',
      taxiApps: 'Uber, Bolt',
      walkingFriendly: true,
    },
    topAttractions: [
      {
        id: 'table-mountain-cableway',
        name: 'Table Mountain Aerial Cableway',
        category: 'Nature',
        description: 'Rotating cable car ascent up 1,086 meters offering panoramic Atlantic vistas.',
        latitude: -33.9575,
        longitude: 18.4031,
        price: 395,
        currency: 'ZAR',
        rating: 4.9,
        openingHours: '08:30 - 18:30',
        image: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=800&q=80',
        indoor: false,
        durationMinutes: 150,
      },
      {
        id: 'boulders-beach-penguins',
        name: 'Boulders Beach African Penguin Colony',
        category: 'Nature',
        description: 'Sheltered cove with granite boulders hosting wild African penguins.',
        latitude: -34.1973,
        longitude: 18.4513,
        price: 190,
        currency: 'ZAR',
        rating: 4.8,
        openingHours: '08:00 - 17:00',
        image: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?auto=format&fit=crop&w=800&q=80',
        indoor: false,
        durationMinutes: 90,
      }
    ],
    restaurants: [
      {
        id: 'pot-luck-club-capetown',
        name: 'The Pot Luck Club',
        cuisine: 'Modern Global Tapas & Rooftop Views',
        priceLevel: '$$$',
        avgCost: 550,
        currency: 'ZAR',
        rating: 4.8,
        latitude: -33.9272,
        longitude: 18.4475,
        address: 'Silomill, The Old Biscuit Mill, Woodstock, Cape Town',
        image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80',
        dietary: ['Gourmet Seafood', 'Cape Lamb', 'Vegan Tasting'],
        isFamilyFriendly: true,
      }
    ]
  },

  // 17. RIO DE JANEIRO, BRAZIL
  {
    id: 'rio-de-janeiro-brazil',
    name: 'Rio de Janeiro, Brazil',
    city: 'Rio de Janeiro',
    country: 'Brazil',
    countryCode: 'BR',
    continent: 'South America',
    latitude: -22.9068,
    longitude: -43.1729,
    currency: 'BRL',
    language: 'pt',
    languageName: 'Portuguese',
    timezone: 'America/Sao_Paulo',
    description: 'The Cidade Maravilhosa framed by emerald peaks, legendary Copacabana beach, and infectious Samba rhythms.',
    coverImage: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=1200&q=80',
    bestSeasons: ['Summer', 'Spring', 'Winter'],
    idealDaysMin: 4,
    idealDaysMax: 7,
    budgetTier: 'Budget',
    estimatedDailyCostUSD: 65,
    tags: ['Beaches', 'Music', 'Nature', 'Culture', 'Views'],
    transportInfo: {
      metro: true,
      transitCards: 'MetrôRio Giro Card',
      taxiApps: 'Uber, 99',
      walkingFriendly: true,
    },
    topAttractions: [
      {
        id: 'christ-the-redeemer',
        name: 'Christ the Redeemer & Corcovado',
        category: 'Historical places',
        description: 'Iconic 30-meter Art Deco statue gazing across Guanabara Bay from Mount Corcovado.',
        latitude: -22.9519,
        longitude: -43.2105,
        price: 95,
        currency: 'BRL',
        rating: 4.9,
        openingHours: '08:00 - 19:00',
        image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=800&q=80',
        indoor: false,
        durationMinutes: 120,
      },
      {
        id: 'sugarloaf-mountain',
        name: 'Sugarloaf Mountain (Pão de Açúcar)',
        category: 'Nature',
        description: 'Glass-walled cable cars gliding between Morro da Urca and the Sugarloaf peak.',
        latitude: -22.9492,
        longitude: -43.1545,
        price: 150,
        currency: 'BRL',
        rating: 4.8,
        openingHours: '08:00 - 20:00',
        image: 'https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?auto=format&fit=crop&w=800&q=80',
        indoor: false,
        durationMinutes: 120,
      }
    ],
    restaurants: [
      {
        id: 'churrascaria-palace',
        name: 'Churrascaria Palace Copacabana',
        cuisine: 'Authentic Brazilian Rodízio Barbecue',
        priceLevel: '$$$',
        avgCost: 190,
        currency: 'BRL',
        rating: 4.7,
        latitude: -22.9664,
        longitude: -43.1812,
        address: 'R. Rodolfo Dantas, 16 - Copacabana, Rio de Janeiro',
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
        dietary: ['Picanha', 'Feijoada', 'Salad Bar'],
        isFamilyFriendly: true,
      }
    ]
  },

  // 18. SINGAPORE
  {
    id: 'singapore',
    name: 'Singapore',
    city: 'Singapore',
    country: 'Singapore',
    countryCode: 'SG',
    continent: 'Asia',
    latitude: 1.3521,
    longitude: 103.8198,
    currency: 'SGD',
    language: 'en',
    languageName: 'English',
    timezone: 'Asia/Singapore',
    description: 'Futuristic garden city renowned for Supertree Groves, Michelin-starred hawker centres, and ultra-modern architecture.',
    coverImage: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=80',
    bestSeasons: ['Winter', 'Spring', 'Summer', 'Autumn'],
    idealDaysMin: 3,
    idealDaysMax: 5,
    budgetTier: 'Moderate',
    estimatedDailyCostUSD: 150,
    tags: ['Futuristic', 'Food', 'Gardens', 'Shopping', 'Family'],
    transportInfo: {
      metro: true,
      transitCards: 'EZ-Link / Singapore Tourist Pass',
      taxiApps: 'Grab, ComfortDelGro',
      walkingFriendly: true,
    },
    topAttractions: [
      {
        id: 'gardens-by-the-bay',
        name: 'Gardens by the Bay & Cloud Forest',
        category: 'Nature',
        description: 'Futuristic botanic park with 50-meter Supertree structures and indoor mountain waterfall.',
        latitude: 1.2816,
        longitude: 103.8636,
        price: 32,
        currency: 'SGD',
        rating: 4.9,
        openingHours: '09:00 - 21:00',
        image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80',
        indoor: true,
        durationMinutes: 180,
      },
      {
        id: 'marina-bay-sands-skypark',
        name: 'Marina Bay Sands SkyPark Observation Deck',
        category: 'Historical places',
        description: 'Dramatic 57th-floor cantilevered observation deck providing 360-degree Singapore skyline views.',
        latitude: 1.2838,
        longitude: 103.8607,
        price: 30,
        currency: 'SGD',
        rating: 4.8,
        openingHours: '11:00 - 21:00',
        image: 'https://images.unsplash.com/photo-1506351421178-63b52a2d2562?auto=format&fit=crop&w=800&q=80',
        indoor: false,
        durationMinutes: 90,
      }
    ],
    restaurants: [
      {
        id: 'lau-pa-sat-singapore',
        name: 'Lau Pa Sat Festival Hawker Market',
        cuisine: 'Iconic Singapore Hawker & Satay Street',
        priceLevel: '$',
        avgCost: 16,
        currency: 'SGD',
        rating: 4.6,
        latitude: 1.2806,
        longitude: 103.8504,
        address: '18 Raffles Quay, Singapore',
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
        dietary: ['Satay', 'Hainanese Chicken Rice', 'Laksa', 'Halal options'],
        isFamilyFriendly: true,
      }
    ]
  }
];

export interface RecommendationCriteria {
  budgetUSD?: number;
  season?: 'Spring' | 'Summer' | 'Autumn' | 'Winter' | 'Any';
  days?: number;
  vibe?: string;
  continent?: string;
}

export interface RecommendationResult {
  destination: DestinationData;
  matchScore: number;
  matchReasons: string[];
  estimatedTotalCostUSD: number;
  budgetFit: 'Under Budget' | 'On Budget' | 'Stretch';
}

/**
 * Intelligent Destination Suggester Engine
 * Evaluates budget, travel season, duration, and style vibes to find optimal destinations.
 */
export function recommendDestinations(criteria: RecommendationCriteria): RecommendationResult[] {
  const { budgetUSD = 2000, season = 'Any', days = 5, vibe = 'All', continent = 'All' } = criteria;

  const results: RecommendationResult[] = [];

  for (const dest of DESTINATIONS_CATALOG) {
    if (continent !== 'All' && dest.continent.toLowerCase() !== continent.toLowerCase()) {
      continue;
    }

    let score = 50; // base score
    const matchReasons: string[] = [];

    // 1. Season Matching
    if (season === 'Any') {
      score += 15;
      matchReasons.push(`Great to visit year-round`);
    } else if (dest.bestSeasons.includes(season as any)) {
      score += 25;
      matchReasons.push(`Prime travel weather in ${season}`);
    } else {
      score -= 10;
    }

    // 2. Budget Matching
    const estTotalCost = dest.estimatedDailyCostUSD * days;
    let budgetFit: 'Under Budget' | 'On Budget' | 'Stretch' = 'On Budget';

    if (estTotalCost <= budgetUSD * 0.8) {
      score += 20;
      budgetFit = 'Under Budget';
      matchReasons.push(`Well under budget (~$${estTotalCost} for ${days} days)`);
    } else if (estTotalCost <= budgetUSD * 1.1) {
      score += 15;
      budgetFit = 'On Budget';
      matchReasons.push(`Fits your $${budgetUSD} budget comfortably`);
    } else {
      score -= 15;
      budgetFit = 'Stretch';
      matchReasons.push(`Slightly above target budget`);
    }

    // 3. Days / Duration Feasibility
    if (days >= dest.idealDaysMin && days <= dest.idealDaysMax) {
      score += 15;
      matchReasons.push(`${days} days is the ideal duration`);
    } else if (days < dest.idealDaysMin) {
      score -= 5;
    } else {
      score += 5;
    }

    // 4. Vibe / Travel Style Matching
    if (vibe !== 'All') {
      const matchedTag = dest.tags.some(t => t.toLowerCase().includes(vibe.toLowerCase()));
      if (matchedTag) {
        score += 20;
        matchReasons.push(`Renowned for ${vibe}`);
      }
    }

    // Clamp score to 40 - 99
    const finalScore = Math.min(99, Math.max(40, score));

    results.push({
      destination: dest,
      matchScore: finalScore,
      matchReasons,
      estimatedTotalCostUSD: estTotalCost,
      budgetFit,
    });
  }

  // Sort by highest match score descending
  results.sort((a, b) => b.matchScore - a.matchScore);
  return results;
}

export function searchDestinations(query: string): DestinationData[] {
  if (!query || query.trim() === '') {
    return DESTINATIONS_CATALOG;
  }
  const q = query.toLowerCase().trim();
  return DESTINATIONS_CATALOG.filter(
    d =>
      d.name.toLowerCase().includes(q) ||
      d.city.toLowerCase().includes(q) ||
      d.country.toLowerCase().includes(q) ||
      d.continent.toLowerCase().includes(q) ||
      d.tags.some(t => t.toLowerCase().includes(q))
  );
}

export function getDestinationById(id: string): DestinationData | undefined {
  return DESTINATIONS_CATALOG.find(d => d.id === id || d.city.toLowerCase() === id.toLowerCase());
}
