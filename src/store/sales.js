import { defineStore } from "pinia";
import { useUserStore } from "./user.js";
import {
  getFirestore,
  connectFirestoreEmulator,
  collection,
  setDoc,
  onSnapshot,
  addDoc,
  query,
  where,
  doc,
  getDocs,
  deleteDoc,
  serverTimestamp,
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
export const useSalesStore = defineStore("sales", {
  state: () => ({ sales: [], salesReport: [], salesSubscription: null }),
  // getters: {
  //   userLoggedIn: (state) => !!state.user,
  // },
  actions: {
    cancelSubsctription() {
      if(this.salesSubscription) {
        this.salesSubscription()
        this.salesSubscription = null
      }
    },
    async addToFirestore(sale) {
      const userStore = useUserStore();
      try {
        let saleObject = {
          ...sale,
          userId: userStore.user.email,
          checkoutTime: serverTimestamp(),
        };
        const docRef = await addDoc(collection(db, "sales"), saleObject);
        console.log("Document written with ID: ", docRef.id);
      } catch (error) {
        console.log(error);
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
        alert("error:", error);
      }
    },
    async deleteFirestore(sale) {
      try {
        await deleteDoc(doc(db, "sales", sale.id));
      } catch (error) {
        alert("error:", error);
      }
    },
    async fetchSales(startDate, endDate) {
      if (!!this.salesSubscription) return
      console.log(startDate, endDate);
      const q = query(
        collection(db, "sales"),
        where("checkoutTime", ">=", startDate),
        where("checkoutTime", "<", endDate)
      );

      // Subscribe to snapshot changes
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const sales = [];
        querySnapshot.forEach((doc) => {
          console.log(doc.id);
          let sale = {
            id: doc.id,
            ...doc.data(),
          };
          sales.push(sale);
        });
        this.sales = sales
        console.log(this.sales);
      });

      this.salesSubscription = unsubscribe
    },
    async fetchSalesReport(startDate, endDate) {
      console.log("start",startDate);
      console.log("end" ,endDate);
      const q = query(
        collection(db, "sales"),
        where("checkoutTime", ">=", startDate),
        where("checkoutTime", "<", endDate)
      );
      const salesReport = [];
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        console.log(doc.id);
        let sale = {
          id: doc.id,
          ...doc.data(),
        };
        salesReport.push(sale);
      });
      this.salesReport = salesReport; // Update store state with fetched products
      console.log(this.salesReport);
    },
  },
});
