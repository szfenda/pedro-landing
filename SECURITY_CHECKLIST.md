# 🔒 SECURITY CHECKLIST - FIREBASE CREDENTIALS

## ⚠️ NATYCHMIASTOWE DZIAŁANIA

### 1. Wygeneruj nowe klucze Firebase Admin
1. Idź do Firebase Console: https://console.firebase.google.com/
2. Wybierz projekt: pedro-bolt-app
3. Project Settings → Service Accounts
4. Kliknij "Generate new private key"
5. Pobierz nowy plik JSON

### 2. Zaktualizuj zmienne w Vercel
```bash
# Usuń stare klucze
vercel env rm FIREBASE_PRIVATE_KEY
vercel env rm FIREBASE_CLIENT_EMAIL

# Dodaj nowe klucze
vercel env add FIREBASE_PRIVATE_KEY
vercel env add FIREBASE_CLIENT_EMAIL
```

### 3. Usuń stare klucze z Firebase
1. W Firebase Console → Service Accounts
2. Znajdź stary klucz i usuń go

## ✅ OBECNY STAN BEZPIECZEŃSTWA

### Co jest BEZPIECZNE:
- ✅ Klucze są tylko w server-side kodzie
- ✅ Chronione przez `typeof window === 'undefined'`
- ✅ W zmiennych środowiskowych, nie w kodzie
- ✅ Next.js nie wysyła ich do przeglądarki
- ✅ Vercel szyfruje zmienne środowiskowe

### Co można POPRAWIĆ:
- 🔄 Rotacja kluczy (zalecane po każdym udostępnieniu)
- 🔄 Ograniczenie uprawnień service account
- 🔄 Monitoring dostępu do Firebase

## 🛡️ DODATKOWE ZABEZPIECZENIA

### 1. Ograniczenie uprawnień Service Account
W Firebase Console → IAM & Admin:
- Usuń "Editor" role
- Dodaj tylko potrzebne role:
  - Firebase Admin SDK Administrator Service Agent
  - Cloud Datastore User

### 2. Monitoring
- Włącz audit logs w Firebase
- Monitoruj nietypową aktywność

### 3. Firestore Security Rules
Sprawdź czy rules są restrykcyjne:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /USER/{userId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == userId;
    }
    match /PARTNER/{partnerId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
  }
}
```

## 📋 CHECKLIST WYKONANIA

- [ ] Wygenerowano nowe klucze Firebase
- [ ] Zaktualizowano zmienne w Vercel
- [ ] Usunięto stare klucze z Firebase
- [ ] Przetestowano aplikację
- [ ] Ograniczono uprawnienia service account
- [ ] Włączono monitoring