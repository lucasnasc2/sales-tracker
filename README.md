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

## Vite, Vue 3, Vuetify 3.5, Firebase
Vite, Vue 3, Vuetify 3.5 and Firebase are the main technologies being used in this project. You should take a look in their documentation for detailed reference.

## Clone and configure
- Clone this repository into our machine and using Node and NPM, install the dependencies. Run `npm install` on the root folder. 
- Also on the root folder, find the file `.env` and edit the name of your organization, the color and your currency. [See how to configure the colors](#configuring)
- lastly, on the root folter, create a `.env.local` file (for firebase credentials)

## Firebase backend/hosting
This app is built with the firebase suit. It includes a noSql database, authentication and hosting.
Each organization should create a firebase account, [create a new project](https://console.firebase.google.com/) and connect it to the app.

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
```json
{
  "projects": {
    "default": "your-project-id"
  }
}
```
### Development
If you wanna see the app in development mode in you local machine, you can run the Vite development server, for fronten, and see changes in realtime, and the Firebase emulator suit, for an emulated version of firebase, with authentication and firestore database. The Firebase emulator comes with a neat interface in which you can create users and set the custom claims necessary for the app to work.

1. To spin the dev server `npm run dev` on your root folder.
2. in another terminal tab, spin the Firebase emulator `firebase emulators:start`.

In both cases, the terminal will tell you in which port these services are running.

### Build and deploy:
Use `npm run build` to build your app, then `firebase deploy` to deploy your app to firebase hosting.

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

### Setting the icon on the .env file:
Every icon in this project is from [MDI Icons](https://pictogrammers.com/library/mdi/).
You can search their huge list of icons to pick whatever fits your organization. If you wanna use a custom svg or png icon, you have to modify the component yourself.
The systax for the icon is `mdi-icon-name`.

# Firebase Firestore details
## Data structures
### Products:
Products is a collection of product objects with the following structure:
```javascript
const product = {
  id: firebaseId, //id asigned by firebase when document is created.
  name: string, //Product name
  description: string, //Product description
  category: string, //Product category
  img: string, //base64 image string
  price: number, //Product price
  stock: number, //This property is here for future implementation
  active: boolean, //This Property is here for future implementation
}
```
### Sales:
Sales is a collection of sale objects with the following structure:
```javascript
const sale = {
  id: firebaseId, //id asigned by firebase when document is created.
  checkoutTime: firebase timestamp, //timestamp created by firebase when document is created. It have some methods of it's own. Consult firebase docs for more info.
  checkoutPrice: number, //Total price of the checkout.
  userId: string, //User who made the checkout
  items: [{ //Array of checked out items
    id: string, //Product ID
    category: string, //Product category
    price: number, //Product price
    quantity: number, //Quantity of units sold of this item.
  }],
}
```

## Firestore Rules
To control who have access to which document in the database, firestore have a rules section.
Look for the `firestore.rules` file to see the defaul configuration.
Consult the Firestore rules documentation for more details.

## Custom claims
Every user recently created in the firebase console will have limited access in the app. They can not add, delete or edit products, only visualize them.
Only users with a custom claim of `admin` can have access to those functions.
For that you have to set a custom claim for this user. This can not be done in the console or the app (for now), but we provide a tool for managing your users from your terminal.

## Firebase Admin CLI
This tool was created to help set custom claim to a user with little configuration.
- First you will have to get your Firebase admin key on the firebase console (edit the link below to have the correct project ID):
  - `https://console.firebase.google.com/u/0/project/YOUR-PROJECT-ID/settings/serviceaccounts/adminsdk`
  - Alternatively you can navigate to you project console `project settings -> service accounts`
  - Then you can generate a new private key. It's a Json file that should be stored locally, never upload this file in a public way. Whoever have access to your private key can control your whole project.
- Go to the [FirebaseAdminCLI](https://github.com/lucasnasc2/firebaseAdminCLI/blob/main/README.md) repository to install the tool.



