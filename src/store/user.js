import { defineStore } from "pinia";
import { useProductStore } from "./products.js";
import { useSalesStore } from "./sales.js";
import {
  getAuth,
  connectAuthEmulator,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import firebaseApp from "../firebase.js";
import router from "@/router/index.js";
const auth = getAuth(firebaseApp);
if (import.meta.env.DEV) {
  connectAuthEmulator(auth, "http://127.0.0.1:9099");
}

// You can name the return value of `defineStore()` anything you want,
// but it's best to use the name of the store and surround it with `use`
// and `Store` (e.g. `useUserStore`, `useCartStore`, `useProductStore`)
// the first argument is a unique id of the store across your application
export const useUserStore = defineStore("user", {
  state: () => ({ user: null }),
  getters: {
    userLoggedIn: (state) => !!state.user,
  },
  actions: {
    async login(email, password) {
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        // Signed in
        const user = userCredential.user;
        console.log(user);
        router.push("/");
      } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      }
    },
    logout() {
      const productStore = useProductStore();
      const salesStore = useSalesStore();
      if (productStore.productsSubscription) {
        productStore.productsSubscription();
      }
      if (salesStore.salesSubscription) {
        salesStore.salesSubscription();
      }
      signOut(auth)
        .then(() => {
          router.push("login");
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
});
