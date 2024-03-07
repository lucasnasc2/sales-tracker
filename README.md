# Sales tracker
This app will assist you in the sales process. It lets you register products, register sales and give you reports on those sales, keeping you and your organization up to date with your retail operation.

## Functionalities:
- Create products with category and price.
- Add items to cart.
- Checkout cart and update database with a new sale.
- Get reports by day with a totals by product, category and overall.
- Export sales reports as excel spreadsheet.
- Keeping track of your stock (some time in the future)
- Apply discounts (some time in the future)

## What it is not meant to be:
This app is not meant to be used profesionally.
- It doesn't connect you any government tax authorities, so it's not authorized to emit valid receipts.
- It doesn't give you IVA(tax) options.

# How to set it up?

## Clone and configure
- Clone this repository into our machine and using Node and NPM, install the dependencies. Run `npm install` on the root folder. 
- Also on the root folder, find the file `.env` and edit the name of your organization, the color and your currency. [See how to configure the colors](#configuring)
- lastly, on the root folter, create a `.env.local` file (for firebase credentials)

## Firebase backend/hosting
This app is built with the firebase suit. It includes a noSql database, authentication and hosting.
Each organization should create a firebase account, create a new project and connect it to the app.

### API keys:
To register your app, fill out the .env.local file like so:
```
VITE_FIREBASE_API_KEY=your apiKey
VITE_FIREBASE_AUTH_DOMAIN=your authDomain
VITE_FIREBASE_PROJECT_ID=your projectId
VITE_FIREBASE_STORAGE_BUCKET=your storageBucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your messagingSenderId
VITE_FIREBASE_APP_ID=your appId
```

### Authentication:
On the firebase console, go to your project and activate the authentication methods.
Under Authentication > Sign-in method > Sign-in providers > Add new provider:
Add Email/Password provider

### Firestore (noSql database):
On the firebase console, go to your project and activate Firestore.

### Firebase SDK:
This repository comes with configuration for firebase rules and emulator. You will need to initiate the firebase sdk to use these functions.

install de sdk:
`npm install --save firebase-admin`

Login into firebase:
`firebase login`

On the root folder, edit your `.firebaserc` file to include your project id.
```
{
  "projects": {
    "default": "your-project-id"
  }
}
```

### Build and deploy:
Use `npm run build` to build your app, then `firebase deploy` to deploy your app to firebase hosting. Lastly, run `firebase deploy --only firestore:rules` to update your firestore rules with the preconfigured ones.

## Extras
### Setting the color on the .env file:
To change the color (`VITE_THEME_COLOR`), use the following syntax: `color.variation` Eg.: `pink.accent1`
Down below are the supported colors and below that are the supported variations
You can also use Hex values.
Click the link to see the entire color palette: [Vuetify Material olors](https://vuetifyjs.com/en/styles/colors/#material-colors)

COLORS:
red
pink
purple
deepPurple
indigo
blue
lightBlue
cyan
teal
green
lightGreen
lime
yellow
amber
orange
deepOrange
brown
blueGrey
grey
shades

VARIATIONS:
accent1
accent2
accent3
accent4
base
darken1
darken2
darken3
darken4
lighten1
lighten2
lighten3
lighten4
lighten5

