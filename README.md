# Sales tracker
This app will assist you in the sales process. It lets you register products, register sales and give you reports on those sales, keeping you and your organization up to date with your retail operation.

## Functionalities:
- Create products with category and price.
- Add items to cart.
- Checkout cart and update database with a new sale.
- Get reports by day with a totals by product, category and overall.
- Keeping track of your stock (some time in the future)
- Apply discounts (some time in the future)

## What it is not meant to be:
This app is not meant to be used profesionally.
- It doesn't connect you any government tax authorities, so it's not authorized to emit valid receipts.
- It doesn't give you IVA(tax) options.
- It doesn't keep track of your stock (yet).
- It doesn't let you apply discounts (yet).

# How to set it up?

## Clone and configure
- Clone this repository into our machine and using Node and NPM, install the dependencies.
- On the root folter, create a .env.local file

## Firebase backend/hosting
This app is built with the firebase suit. It includes a noSql database, authentication and hosting.
Each organization should create a firebase account, create a new project and connect it to the app.

### API keys:
To register your app, fill your .env.local file like so:
```
VITE_FIREBASE_API_KEY=your apiKey
VITE_FIREBASE_AUTH_DOMAIN=your authDomain
VITE_FIREBASE_PROJECT_ID=your projectId
VITE_FIREBASE_STORAGE_BUCKET=your storageBucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your messagingSenderId
VITE_FIREBASE_APP_ID=your appId
```

### Authentication:
Under Authentication > Sign-in method > Sign-in providers > Add new provider:
Add Email/Password provider

### Firestore (noSql database):
Activate it.

### Firebase SDK:
npm install --save firebase-admin
firebase login


