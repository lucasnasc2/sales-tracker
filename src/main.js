/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from "@/plugins";

// Components
import App from "./App.vue";
import Home from "./views/Home.vue";
import Login from "./views/Login.vue";

import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import { createPinia } from "pinia";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import firebaseApp from "./firebase.js";

const routes = [
  { path: "/", name: "Home", component: Home },
  { path: "/login", name: "Login", component: Login },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const pinia = createPinia();
const app = createApp(App);
registerPlugins(app);

app.use(router, pinia).mount("#app");
let isLoggedIn = false;
const auth = getAuth(firebaseApp);
onAuthStateChanged(auth, (user) => {
  isLoggedIn = !!user;
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
