# Sales tracker
This app will assist you in the sales process. It lets you register products, register sales and give you reports on those sales, keeping you and your organization up to date with your retail operation.

## Functionalities:
- Create products with category, price and picture.
- Add items to cart.
- Visualize the products with a neat color coated grid of items.
- Filter the items by category and search them with the search bar.
- Checkout cart and update database with a new sale.
- Get reports by day with the sum of product sold, category and overall.
- Export sales reports as an .xlsx excel spreadsheet.
- Keeping track of your stock (some time in the future)
- Handle conflicts in sales tickets (some time in the future)
- Apply discounts (some time in the future)

## What it is not meant to be:
This app is not meant to be used profesionally.
- It doesn't connect you any government tax authorities, so it's not authorized to emit valid receipts.
- It doesn't give you IVA(tax) options.

# How to set it up?
## You will have to know a little bit of code and how to go around the terminal and CLI tools.
But it's nothing to crazy. You can follow the guide and google what you don't understand.
## Pre-requisites:
You should have the latest version of Git and Node installed on your machine.

## Vite, Vue 3, Vuetify 3.5, Firebase
Vite, Vue 3, Vuetify 3.5 and Firebase are the main technologies being used in this project. You should take a look at their documentation for detailed reference.

## Clone and configure
- Clone this repository into our machine and using Node and NPM, install the dependencies. Run `npm install` on the root folder.
- Also on the root folter, create a `.env.local` file for your firebase credentials and app [style configurations](#style) (name of your organization, the color and your currency). See how to configure the [colors](#configuring)

## Firebase backend/hosting
This app is built with the Firebase suit. It includes a noSql database, authentication and hosting.
Each organization should create a Firebase account, [create a new project](https://console.firebase.google.com/) and connect it to the app.

### API keys:
To register your app, fill out the `.env.local` file like so:
```
VITE_FIREBASE_API_KEY=your apiKey
VITE_FIREBASE_AUTH_DOMAIN=your authDomain
VITE_FIREBASE_PROJECT_ID=your projectId
VITE_FIREBASE_STORAGE_BUCKET=your storageBucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your messagingSenderId
VITE_FIREBASE_APP_ID=your appId
```

### Authentication:
On the Firebase console, go to your project and activate the authentication methods.
Under Authentication > Sign-in method > Sign-in providers > Add new provider:
Add Email/Password provider

### Firestore (noSql database):
On the Firebase console, go to your project and activate Firestore.

### Firebase SDK:
This repository comes with configuration for firestore rules, emulator and hosting. You will need to initiate the firebase sdk to use these functions.

install de sdk:
`npm install --save firebase-admin`

Login into firebase:
`firebase login`

On the root folder, edit your `.firebaserc` file to include your project id.
```json
{
  "projects": {
    "default": "your-firebase-project-id"
  }
}
```

### Style and brand
On the `.env.local` file, add the following lines and edit the name, currency, [colors](#configuring) and icon:
```
VITE_ORGANIZATION_NAME=My organization/Brand
VITE_THEME_COLOR=blueGray.base
VITE_SECONDARY_COLOR=blueGray.lighten4
VITE_CURRENCY=€
VITE_ORGANIZATION_ICON=mdi-cart-percent
```

### Development
If you wanna preview the app in development mode on you local machine, you can run the Vite development server, for frontend, and see changes in realtime, and the Firebase emulator suit, for an emulated version of firebase, with authentication and firestore database. The Firebase emulator comes with a neat interface in which you can create users and set the custom claims necessary for the app to work.

1. To spin the development server `npm run dev` on your root folder.
2. in another terminal tab, spin the Firebase emulator `firebase emulators:start`.

In both cases, the terminal will tell you in which port these services are running and will give you a link that you can preview everything on the browser.

### Build and deploy:
When you're sure everything is working good on the development preview, you can build the production version of the app and deploy it to firebase histing.
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

### Setting the icon on the `.env.local` file:
Every icon in this project is from [MDI Icons](https://pictogrammers.com/library/mdi/).
You can search their huge list of icons to pick whatever fits your organization. If you wanna use a custom svg or png icon, you will have to modify the components yourself on the `./src` folder.
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
  checkoutTime: firebase timestamp, //timestamp created by firebase when document is created. It have some methods of it's own. Consult firebase/firestore/timestamp api docs for more info.
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
  - Then you can generate a new private key. It's a Json file that should be stored locally, never upload this file in a public way. Whoever have access to your private key can control your whole Firebase project.
- Go to the [FirebaseAdminCLI](https://github.com/lucasnasc2/firebaseAdminCLI/blob/main/README.md) repository to install the tool.



