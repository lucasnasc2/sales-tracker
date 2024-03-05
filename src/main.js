/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from "@/plugins";

// Components
import App from "./App.vue";

import { createApp } from "vue";
import router from "./router";
import { createPinia } from "pinia";
import { useUserStore } from "./store/user.js";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import firebaseApp from "./firebase.js";
import globalConfigPlugin from './plugins/globalConfigPlugin';


const pinia = createPinia();
const app = createApp(App);
registerPlugins(app);

app.use(router);
app.use(pinia);
app.use(globalConfigPlugin);
app.mount("#app");

const userStore = useUserStore();
let isLoggedIn = false;
const auth = getAuth(firebaseApp);
onAuthStateChanged(auth, (user) => {
  isLoggedIn = !!user;
  userStore.user = user
});

router.beforeEach(async (to, from, next) => {
  await new Promise((resolve) => {
    onAuthStateChanged(auth, () => {
      resolve();
    });
  });

  if (to.name === "Login" && isLoggedIn) {
    next({ name: "Home" }); // Redirect to Home if user is logged in and tries to access Login
  } else if (to.name !== "Login" && !isLoggedIn) {
    next({ name: "Login" }); // Redirect to Login if user is not logged in and tries to access other routes
  } else {
    next(); // Continue navigation
  }
});
