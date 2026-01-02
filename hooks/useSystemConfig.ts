'use client'

import { useState, useEffect } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/lib/auth-context'

interface Category {
  id: string
  name: string
  icon: string
  color: string
  slug: string
  isActive: boolean
  sortOrder: number
}

interface City {
  name: string
  slug: string
  isActive: boolean
  sortOrder: number
  coordinates: {
    latitude: number
    longitude: number
  }
}

interface SystemConfig {
  categories: Category[]
  cities: City[]
  businessTypes: string[]
}

export function useSystemConfig() {
  const { loading: authLoading } = useAuth()
  const [config, setConfig] = useState<SystemConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fallback data in case Firebase is not available
  const fallbackConfig: SystemConfig = {
    categories: [],
    cities: [
      { name: 'Warszawa', slug: 'warszawa', isActive: true, sortOrder: 1, coordinates: { latitude: 52.2297, longitude: 21.0122 } },
      { name: 'Kraków', slug: 'krakow', isActive: true, sortOrder: 2, coordinates: { latitude: 50.0647, longitude: 19.9450 } },
      { name: 'Gdańsk', slug: 'gdansk', isActive: true, sortOrder: 3, coordinates: { latitude: 54.3520, longitude: 18.6466 } },
      { name: 'Wrocław', slug: 'wroclaw', isActive: true, sortOrder: 4, coordinates: { latitude: 51.1079, longitude: 17.0385 } },
      { name: 'Poznań', slug: 'poznan', isActive: true, sortOrder: 5, coordinates: { latitude: 52.4064, longitude: 16.9252 } },
      { name: 'Łódź', slug: 'lodz', isActive: true, sortOrder: 6, coordinates: { latitude: 51.7592, longitude: 19.4560 } },
      { name: 'Katowice', slug: 'katowice', isActive: true, sortOrder: 7, coordinates: { latitude: 50.2649, longitude: 19.0238 } },
      { name: 'Białystok', slug: 'bialystok', isActive: true, sortOrder: 8, coordinates: { latitude: 53.1325, longitude: 23.1688 } },
      { name: 'Lublin', slug: 'lublin', isActive: true, sortOrder: 9, coordinates: { latitude: 51.2465, longitude: 22.5684 } },
      { name: 'Szczecin', slug: 'szczecin', isActive: true, sortOrder: 10, coordinates: { latitude: 53.4285, longitude: 14.5528 } },
    ],
    businessTypes: [
      'Restauracja/Gastronomia',
      'Salon urody/Fryzjer',
      'Zdrowie/Medycyna',
      'Fitness/Sport',
      'Rozrywka/Kultura',
      'Turystyka/Podróże',
      'Handel detaliczny',
      'Usługi profesjonalne',
      'Motoryzacja',
      'Inne'
    ]
  }

  useEffect(() => {
    // Wait for auth to initialize before fetching config
    if (authLoading) {
      console.log('Waiting for auth to initialize...')
      return
    }

    const fetchSystemConfig = async (retryCount = 0) => {
      try {
        setLoading(true)
        if (retryCount === 0) {
          setError(null)
        }

        console.log(`Attempting to fetch system config from Firebase... (attempt ${retryCount + 1})`)
        console.log('Firebase config:', {
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
        })
        
        const configDoc = await getDoc(doc(db, 'system_config', 'main'))
        
        if (!configDoc.exists()) {
          console.log('System config document does not exist')
          throw new Error('System config not found')
        }

        const configData = configDoc.data()
        
        console.log('System config loaded from Firebase:', {
          categories: configData.categories?.length || 0,
          cities: configData.cities?.length || 0,
          businessTypes: configData.businessTypes?.length || 0
        })
        
        // Process categories - filter active and sort
        const categories = (configData.categories || [])
          .filter((cat: Category) => cat.isActive !== false)
          .sort((a: Category, b: Category) => (a.sortOrder || 0) - (b.sortOrder || 0))

        // Process cities - filter active and sort
        const cities = (configData.cities || [])
          .filter((city: City) => city.isActive !== false)
          .sort((a: City, b: City) => (a.sortOrder || 0) - (b.sortOrder || 0))

        // Business types - use as is
        const businessTypes = configData.businessTypes || []

        setConfig({
          categories,
          cities,
          businessTypes
        })
        
        console.log('System config processed successfully:', {
          categories: categories.length,
          cities: cities.length,
          businessTypes: businessTypes.length
        })
        
        // Clear any previous error
        setError(null)
      } catch (err: any) {
        console.error('Error fetching system config:', err)
        console.error('Error details:', {
          code: err.code,
          message: err.message,
          stack: err.stack
        })
        
        // If it's a permission error and we haven't retried too many times, try again
        if (err.code === 'permission-denied' && retryCount < 2) {
          console.log(`Permission denied, retrying in ${(retryCount + 1) * 2} seconds...`)
          setTimeout(() => {
            fetchSystemConfig(retryCount + 1)
          }, (retryCount + 1) * 2000)
          return
        }
        
        console.log('Using fallback configuration')
        setError(`Błąd Firebase: ${err.code || err.message}. Korzystam z lokalnej konfiguracji.`)
        // Use fallback config when Firebase is not available
        setConfig(fallbackConfig)
      } finally {
        if (retryCount === 0) {
          setLoading(false)
        }
      }
    }

    fetchSystemConfig()
  }, [authLoading]) // Add authLoading as dependency

  return {
    config,
    loading,
    error,
    // Helper functions
    getCategories: () => config?.categories || [],
    getCities: () => config?.cities || [],
    getBusinessTypes: () => config?.businessTypes || [],
    getCityNames: () => config?.cities.map(city => city.name) || [],
  }
}