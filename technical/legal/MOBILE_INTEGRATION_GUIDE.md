# PEDRO Legal Documents - Mobile Integration Guide

## Overview

System dokumentów prawnych PEDRO został zaprojektowany z myślą o integracji z aplikacją mobilną React Native. Ten przewodnik opisuje jak zintegrować dokumenty prawne z aplikacją mobilną oraz jak zarządzać aktualizacjami.

## API Endpoints dla Aplikacji Mobilnej

### Base URL
```
Production: https://pedro.app
Development: http://localhost:3000
```

### Dostępne Endpointy

#### 1. Regulamin
```
GET /api/legal/regulamin
```

**Response Format:**
```json
{
  "success": true,
  "document": {
    "id": "regulamin",
    "title": "Regulamin korzystania z aplikacji PEDRO",
    "version": "1.0.0-beta",
    "lastUpdated": "2025-01-02",
    "description": "Regulamin określa zasady korzystania z aplikacji...",
    "content": [
      {
        "id": "informacje-ogolne",
        "title": "§1. Informacje ogólne",
        "content": "",
        "subsections": [
          {
            "id": "definicja-regulaminu",
            "title": "1.",
            "content": "Niniejszy Regulamin określa zasady..."
          }
        ]
      }
    ],
    "pdfUrl": "/legal/regulamin-pedro-beta.pdf",
    "webUrl": "/legal/regulamin"
  },
  "metadata": {
    "timestamp": "2026-01-02T10:02:31.122Z",
    "apiVersion": "1.0.0"
  }
}
```

#### 2. Polityka Prywatności
```
GET /api/legal/polityka-prywatnosci
```

**Response Format:** Identyczny jak regulamin, ale z zawartością polityki prywatności.

### Error Handling

**404 - Document Not Found:**
```json
{
  "success": false,
  "error": "Document not found"
}
```

**500 - Server Error:**
```json
{
  "success": false,
  "error": "Internal server error"
}
```

## Implementacja w React Native

### 1. Service Layer

Utwórz serwis do komunikacji z API:

```typescript
// services/legalService.ts
interface LegalDocument {
  id: string
  title: string
  version: string
  lastUpdated: string
  description: string
  content: LegalSection[]
  pdfUrl: string
  webUrl: string
}

interface LegalSection {
  id: string
  title: string
  content: string
  subsections?: LegalSubsection[]
}

interface LegalSubsection {
  id: string
  title: string
  content: string
}

interface LegalApiResponse {
  success: boolean
  document: LegalDocument
  metadata: {
    timestamp: string
    apiVersion: string
  }
}

class LegalService {
  private baseUrl = 'https://pedro.app'
  
  async getRegulamin(): Promise<LegalDocument> {
    const response = await fetch(`${this.baseUrl}/api/legal/regulamin`)
    const data: LegalApiResponse = await response.json()
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch regulamin')
    }
    
    return data.document
  }
  
  async getPolitykaPrywatnosci(): Promise<LegalDocument> {
    const response = await fetch(`${this.baseUrl}/api/legal/polityka-prywatnosci`)
    const data: LegalApiResponse = await response.json()
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch polityka prywatnosci')
    }
    
    return data.document
  }
  
  getPdfUrl(documentType: 'regulamin' | 'polityka-prywatnosci'): string {
    const pdfMap = {
      'regulamin': '/legal/regulamin-pedro-beta.pdf',
      'polityka-prywatnosci': '/legal/polityka-prywatnosci-pedro.pdf'
    }
    
    return `${this.baseUrl}${pdfMap[documentType]}`
  }
  
  getWebUrl(documentType: 'regulamin' | 'polityka-prywatnosci'): string {
    return `${this.baseUrl}/legal/${documentType}`
  }
}

export const legalService = new LegalService()
```

### 2. React Native Components

#### Document Viewer Component

```tsx
// components/LegalDocumentViewer.tsx
import React, { useState, useEffect } from 'react'
import { ScrollView, Text, View, StyleSheet, ActivityIndicator } from 'react-native'
import { legalService, LegalDocument } from '../services/legalService'

interface Props {
  documentType: 'regulamin' | 'polityka-prywatnosci'
}

export const LegalDocumentViewer: React.FC<Props> = ({ documentType }) => {
  const [document, setDocument] = useState<LegalDocument | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadDocument()
  }, [documentType])

  const loadDocument = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const doc = documentType === 'regulamin' 
        ? await legalService.getRegulamin()
        : await legalService.getPolitykaPrywatnosci()
      
      setDocument(doc)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text>Ładowanie dokumentu...</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>Błąd: {error}</Text>
      </View>
    )
  }

  if (!document) {
    return (
      <View style={styles.centered}>
        <Text>Dokument nie został znaleziony</Text>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{document.title}</Text>
      <Text style={styles.metadata}>
        Wersja: {document.version} | 
        Ostatnia aktualizacja: {new Date(document.lastUpdated).toLocaleDateString('pl-PL')}
      </Text>
      <Text style={styles.description}>{document.description}</Text>
      
      {document.content.map((section) => (
        <View key={section.id} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          
          {section.content && (
            <Text style={styles.content}>
              {section.content.replace(/\*\*(.*?)\*\*/g, '$1')}
            </Text>
          )}
          
          {section.subsections?.map((subsection) => (
            <View key={subsection.id} style={styles.subsection}>
              {subsection.title && (
                <Text style={styles.subsectionTitle}>{subsection.title}</Text>
              )}
              <Text style={styles.content}>
                {subsection.content.replace(/\*\*(.*?)\*\*/g, '$1')}
              </Text>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2D3436',
  },
  metadata: {
    fontSize: 12,
    color: '#636e72',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#636e72',
    marginBottom: 24,
    lineHeight: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#2D3436',
  },
  subsection: {
    marginLeft: 16,
    marginBottom: 12,
  },
  subsectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    color: '#2D3436',
  },
  content: {
    fontSize: 14,
    lineHeight: 20,
    color: '#2D3436',
  },
  error: {
    color: '#d63031',
    fontSize: 16,
  },
})
```

#### Legal Links Component

```tsx
// components/LegalLinks.tsx
import React from 'react'
import { View, Text, TouchableOpacity, Linking, StyleSheet } from 'react-native'
import { legalService } from '../services/legalService'

export const LegalLinks: React.FC = () => {
  const openDocument = (type: 'regulamin' | 'polityka-prywatnosci') => {
    const url = legalService.getWebUrl(type)
    Linking.openURL(url)
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.link} 
        onPress={() => openDocument('regulamin')}
      >
        <Text style={styles.linkText}>Regulamin</Text>
      </TouchableOpacity>
      
      <Text style={styles.separator}> | </Text>
      
      <TouchableOpacity 
        style={styles.link} 
        onPress={() => openDocument('polityka-prywatnosci')}
      >
        <Text style={styles.linkText}>Polityka Prywatności</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  link: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  linkText: {
    color: '#6C5CE7',
    fontSize: 12,
    textDecorationLine: 'underline',
  },
  separator: {
    color: '#636e72',
    fontSize: 12,
  },
})
```

### 3. Użycie w Aplikacji

#### W ekranie rejestracji:

```tsx
// screens/RegisterScreen.tsx
import { LegalLinks } from '../components/LegalLinks'

export const RegisterScreen = () => {
  return (
    <View style={styles.container}>
      {/* Formularz rejestracji */}
      
      <Text style={styles.termsText}>
        Rejestrując się, akceptujesz nasze dokumenty prawne:
      </Text>
      
      <LegalLinks />
    </View>
  )
}
```

#### W ustawieniach aplikacji:

```tsx
// screens/SettingsScreen.tsx
import { LegalDocumentViewer } from '../components/LegalDocumentViewer'

export const SettingsScreen = () => {
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null)

  if (selectedDocument) {
    return (
      <LegalDocumentViewer 
        documentType={selectedDocument as 'regulamin' | 'polityka-prywatnosci'} 
      />
    )
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setSelectedDocument('regulamin')}>
        <Text>Regulamin</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => setSelectedDocument('polityka-prywatnosci')}>
        <Text>Polityka Prywatności</Text>
      </TouchableOpacity>
    </View>
  )
}
```

## Zarządzanie Aktualizacjami

### 1. Proces Aktualizacji Dokumentów

#### Krok 1: Edycja Treści
```bash
# Edytuj pliki w lib/legal/
lib/legal/regulamin.ts           # Dla regulaminu
lib/legal/politykaPrywatnosci.ts # Dla polityki prywatności
```

#### Krok 2: Aktualizacja Metadanych
```typescript
// W pliku dokumentu zaktualizuj:
export function getRegulaminDocument(): LegalDocument {
  return {
    // ...
    lastUpdated: '2025-01-15',  // ← Nowa data
    version: '1.1.0',           // ← Nowa wersja
    // ...
  }
}
```

#### Krok 3: Aktualizacja PDF (opcjonalnie)
```bash
# Zastąp pliki PDF w public/legal/
public/legal/regulamin-pedro-beta.pdf
public/legal/polityka-prywatnosci-pedro.pdf
```

#### Krok 4: Deploy
```bash
# Commit zmian
git add .
git commit -m "Update legal documents to v1.1.0"
git push

# Automatyczny deploy na Vercel
```

### 2. Wersjonowanie

#### Semantic Versioning
- **Major (X.0.0):** Istotne zmiany prawne wymagające ponownej akceptacji
- **Minor (1.X.0):** Dodanie nowych sekcji lub znaczące uzupełnienia
- **Patch (1.1.X):** Drobne poprawki, korekty językowe

#### Przykłady:
```typescript
// Drobna poprawka
version: '1.0.1'

// Dodanie nowej sekcji
version: '1.1.0'

// Istotne zmiany prawne
version: '2.0.0'
```

### 3. Monitoring Zmian w Aplikacji Mobilnej

#### Cache Management
```typescript
// services/legalService.ts
class LegalService {
  private cache = new Map<string, { document: LegalDocument, timestamp: number }>()
  private cacheTimeout = 24 * 60 * 60 * 1000 // 24 godziny

  async getRegulamin(forceRefresh = false): Promise<LegalDocument> {
    const cacheKey = 'regulamin'
    const cached = this.cache.get(cacheKey)
    
    if (!forceRefresh && cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.document
    }

    const document = await this.fetchRegulamin()
    this.cache.set(cacheKey, { document, timestamp: Date.now() })
    
    return document
  }
}
```

#### Version Checking
```typescript
// utils/versionChecker.ts
export class VersionChecker {
  static async checkForUpdates(currentVersion: string, documentType: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/legal/${documentType}`)
      const data = await response.json()
      
      return data.document.version !== currentVersion
    } catch {
      return false
    }
  }
}
```

## Najlepsze Praktyki

### 1. Error Handling
- Zawsze obsługuj błędy sieciowe
- Implementuj retry logic dla krytycznych operacji
- Przechowuj ostatnią wersję lokalnie jako fallback

### 2. Performance
- Cachuj dokumenty lokalnie
- Używaj lazy loading dla dużych dokumentów
- Implementuj pagination dla bardzo długich treści

### 3. User Experience
- Pokazuj loading states
- Informuj o aktualizacjach dokumentów
- Umożliwiaj offline reading

### 4. Security
- Zawsze używaj HTTPS
- Waliduj response format
- Nie przechowuj wrażliwych danych w cache

## Troubleshooting

### Częste Problemy

#### 1. Network Errors
```typescript
// Retry logic
const fetchWithRetry = async (url: string, retries = 3): Promise<Response> => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fetch(url)
    } catch (error) {
      if (i === retries - 1) throw error
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
    }
  }
  throw new Error('Max retries exceeded')
}
```

#### 2. Parsing Errors
```typescript
// Safe JSON parsing
const safeJsonParse = (text: string) => {
  try {
    return JSON.parse(text)
  } catch {
    throw new Error('Invalid JSON response')
  }
}
```

#### 3. Cache Issues
```typescript
// Clear cache when needed
legalService.clearCache()
```

## Kontakt

W przypadku problemów z integracją:
- Email: kontakt@pedro.app
- Dokumentacja techniczna: `/technical/legal/`
- API Status: `GET /api/health`