require('dotenv').config({ path: '.env.local' });
const admin = require('firebase-admin');

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      project_id: process.env.FIREBASE_PROJECT_ID,
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = admin.firestore();

const systemConfig = {
  categories: [
    {
      id: 'restaurant',
      name: 'Restauracja',
      icon: 'pizza',
      color: '#FF6B6B',
      slug: 'restauracja',
      isActive: true,
      sortOrder: 1
    },
    {
      id: 'beauty',
      name: 'Salon urody',
      icon: 'scissors',
      color: '#4ECDC4',
      slug: 'salon-urody',
      isActive: true,
      sortOrder: 2
    },
    {
      id: 'health',
      name: 'Klinika',
      icon: 'health',
      color: '#45B7D1',
      slug: 'klinika',
      isActive: true,
      sortOrder: 3
    },
    {
      id: 'fitness',
      name: 'Fitness',
      icon: 'fitness',
      color: '#96CEB4',
      slug: 'fitness',
      isActive: true,
      sortOrder: 4
    },
    {
      id: 'hotel',
      name: 'Hotel',
      icon: 'hotel',
      color: '#FFEAA7',
      slug: 'hotel',
      isActive: true,
      sortOrder: 5
    }
  ],
  cities: [
    {
      name: 'Warszawa',
      slug: 'warszawa',
      isActive: true,
      sortOrder: 1,
      coordinates: {
        latitude: 52.2297,
        longitude: 21.0122
      }
    },
    {
      name: 'Kraków',
      slug: 'krakow',
      isActive: true,
      sortOrder: 2,
      coordinates: {
        latitude: 50.0647,
        longitude: 19.9450
      }
    },
    {
      name: 'Gdańsk',
      slug: 'gdansk',
      isActive: true,
      sortOrder: 3,
      coordinates: {
        latitude: 54.3520,
        longitude: 18.6466
      }
    },
    {
      name: 'Wrocław',
      slug: 'wroclaw',
      isActive: true,
      sortOrder: 4,
      coordinates: {
        latitude: 51.1079,
        longitude: 17.0385
      }
    },
    {
      name: 'Poznań',
      slug: 'poznan',
      isActive: true,
      sortOrder: 5,
      coordinates: {
        latitude: 52.4064,
        longitude: 16.9252
      }
    },
    {
      name: 'Łódź',
      slug: 'lodz',
      isActive: true,
      sortOrder: 6,
      coordinates: {
        latitude: 51.7592,
        longitude: 19.4560
      }
    },
    {
      name: 'Szczecin',
      slug: 'szczecin',
      isActive: true,
      sortOrder: 7,
      coordinates: {
        latitude: 53.4285,
        longitude: 14.5528
      }
    },
    {
      name: 'Bydgoszcz',
      slug: 'bydgoszcz',
      isActive: true,
      sortOrder: 8,
      coordinates: {
        latitude: 53.1235,
        longitude: 18.0084
      }
    },
    {
      name: 'Lublin',
      slug: 'lublin',
      isActive: true,
      sortOrder: 9,
      coordinates: {
        latitude: 51.2465,
        longitude: 22.5684
      }
    },
    {
      name: 'Katowice',
      slug: 'katowice',
      isActive: true,
      sortOrder: 10,
      coordinates: {
        latitude: 50.2649,
        longitude: 19.0238
      }
    }
  ],
  businessTypes: [
    'Restauracja',
    'Pizzeria',
    'Bar/Pub',
    'Kawiarnia',
    'Cukiernia',
    'Salon urody',
    'Fryzjer',
    'Kosmetyczka',
    'Manicure/Pedicure',
    'Masaż',
    'Klinika',
    'Dentysta',
    'Fizjoterapia',
    'Psycholog',
    'Weterynarz',
    'Fitness',
    'Siłownia',
    'Joga/Pilates',
    'Basen',
    'Sporty walki',
    'Hotel',
    'Pensjonat',
    'Apartamenty',
    'Hostel',
    'Sklep',
    'Warsztat',
    'Mechanik samochodowy',
    'Serwis RTV/AGD',
    'Biuro usług',
    'Księgowość',
    'Prawnik',
    'Notariusz',
    'Ubezpieczenia',
    'Nieruchomości',
    'Edukacja',
    'Korepetycje',
    'Kursy językowe',
    'Szkoła jazdy',
    'Inne'
  ]
};

async function initSystemConfig() {
  try {
    console.log('Sprawdzam czy dokument system_config/main istnieje...');
    
    const configRef = db.collection('system_config').doc('main');
    const configDoc = await configRef.get();
    
    if (configDoc.exists) {
      console.log('✅ Dokument system_config/main już istnieje');
      const data = configDoc.data();
      console.log('Zawartość:', {
        categories: data.categories?.length || 0,
        cities: data.cities?.length || 0,
        businessTypes: data.businessTypes?.length || 0
      });
    } else {
      console.log('❌ Dokument system_config/main nie istnieje. Tworzę...');
      
      await configRef.set(systemConfig);
      
      console.log('✅ Dokument system_config/main został utworzony pomyślnie!');
      console.log('Utworzono:', {
        categories: systemConfig.categories.length,
        cities: systemConfig.cities.length,
        businessTypes: systemConfig.businessTypes.length
      });
    }
  } catch (error) {
    console.error('❌ Błąd podczas inicjalizacji system_config:', error);
    process.exit(1);
  }
}

initSystemConfig()
  .then(() => {
    console.log('🎉 Inicjalizacja zakończona pomyślnie!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Błąd podczas inicjalizacji:', error);
    process.exit(1);
  });