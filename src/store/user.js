import { defineStore } from "pinia";
import { useProductStore } from "./products.js";
import { useSalesStore } from "./sales.js";
import { useAlertStore } from "./alerts.js";
import {
  getAuth,
  connectAuthEmulator,
  signInWithEmailAndPassword,
  sendPasswordResetEmail ,
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
      const alertStore = useAlertStore();
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
        alertStore.setAlert(error,errorMessage, 5)
      }
    },
    async recover(email) {
      try {
        await sendPasswordResetEmail(auth, email);
        console.log('Password recovery email sent successfully');
        router.push("login");
        alertStore.setAlert('Password recovery email sent successfully',"success", 5)
      } catch (error) {
        console.error('Error sending password recovery email:', error.message);
        console.log(error);
          alertStore.setAlert(error,"error", 5)
      }
    },
    logout() {
      const alertStore = useAlertStore();
      const productStore = useProductStore();
      const salesStore = useSalesStore();

        productStore.cancelSubsctription();
        salesStore.cancelSubsctription();
        
      signOut(auth)
        .then(() => {
          router.push("login");
        })
        .catch((error) => {
          console.log(error);
          alertStore.setAlert(error,"error", 5)
        });
    },
  },
});
