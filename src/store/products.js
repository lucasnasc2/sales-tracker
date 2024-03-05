import { defineStore } from "pinia";
import { useAlertStore } from "./alerts.js";
import {
  getFirestore,
  connectFirestoreEmulator,
  collection,
  setDoc,
  onSnapshot,
  addDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import firebaseApp from "../firebase.js";
const db = getFirestore(firebaseApp);
if (import.meta.env.DEV) {
  connectFirestoreEmulator(db, "127.0.0.1", 8080);
}

// You can name the return value of `defineStore()` anything you want,
// but it's best to use the name of the store and surround it with `use`
// and `Store` (e.g. `useUserStore`, `useCartStore`, `useProductStore`)
// the first argument is a unique id of the store across your application
export const useProductStore = defineStore("product", {
  state: () => ({ products: [], productsSubscription: null }),
  // getters: {
  //   userLoggedIn: (state) => !!state.user,
  // },
  actions: {
    async addToFirestore(product) {
      try {
        const docRef = await addDoc(collection(db, "products"), product);
        console.log("Document written with ID: ", docRef.id);
      } catch (error) {
        alert("error:", error);
      }
    },
    async updateFirestore(product) {
      try {
        let item = JSON.parse(JSON.stringify(product));
        delete item.id;
        const productRef = doc(db, "products", product.id);
        await setDoc(productRef, { ...item }, { merge: true });
        console.log("document updated");
      } catch (error) {
        alert("error:", error)
      }
    },
    async deleteFirestore(product) {
      try {
        await deleteDoc(doc(db, "products", product.id));
      } catch (error) {
        alert("error:", error);
      }
    },
    async fetchProducts() {
      if (!!this.productsSubscription) return;
      const q = collection(db, "products");

      // Subscribe to snapshot changes
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const products = [];
        querySnapshot.forEach((doc) => {
          console.log(doc.id);
          let product = {
            id: doc.id,
            ...doc.data()
          }
          products.push(product);
        });
        this.products = products; // Update store state with fetched products
        console.log(this.products);
      });

      // Optionally return the unsubscribe function if needed
      this.productsSubscription = unsubscribe;
      
    },
  },
});
