# macro-max

A web-based macronutrient tracker. Type what you ate in natural language and track your daily macros with visual activity rings and charts.

## Firebase backend setup

This app now supports a Firebase-backed data layer using:

- Firebase Authentication with anonymous sign-in
- Cloud Firestore for profiles and food logs

### 1. Create a Firebase project

In the Firebase console:

- Create a project
- Enable `Authentication`
- Enable the `Anonymous` sign-in provider
- Create a `Cloud Firestore` database in production or test mode

### 2. Add environment variables

Copy `.env.example` to `.env.local` and fill in your Firebase web app config:

```bash
cp .env.example .env.local
```

Required variables:

- `OPENAI_API_KEY`
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

If these are missing, the app falls back to local browser storage so development does not break.

### 3. Apply Firestore rules

Use the rules in [firebase/firestore.rules](/Users/piyush-srcy/Documents/cc-proj/macro-max/firebase/firestore.rules).

They restrict access so each anonymous user can only read and write their own documents.

### 4. Data model

Firestore documents are stored under:

- `users/{uid}/profile/main`
- `users/{uid}/logs/{YYYY-MM-DD}`

When Firebase is enabled, existing local data is migrated automatically the first time that browser signs in anonymously.
