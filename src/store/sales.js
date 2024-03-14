import { defineStore } from "pinia";
import { useUserStore } from "./user.js";
import { useAlertStore } from "./alerts.js";
import {
  getFirestore,
  connectFirestoreEmulator,
  collection,
  onSnapshot,
  addDoc,
  query,
  where,
  doc,
  serverTimestamp,
  getDoc,
  writeBatch,
} from "firebase/firestore";
import firebaseApp from "../firebase.js";

const db = getFirestore(firebaseApp);

if (import.meta.env.DEV) {
  connectFirestoreEmulator(db, "127.0.0.1", 8081);
}

export const useSalesStore = defineStore("sales", {
  state: () => ({ sales: [], salesReport: [], salesSubscription: null }),
  actions: {
    cancelSubscription() {
      if (this.salesSubscription) {
        this.salesSubscription();
        this.salesSubscription = null;
      }
    },
    async recordSale(sale) {
      const userStore = useUserStore();
      const alertStore = useAlertStore();
      const batch = writeBatch(db); // Initialize a Firestore batch

      try {
        let saleObject = {
          ...sale,
          userId: userStore.user.email,
          checkoutTime: serverTimestamp(),
          transactionType: "sale",
        };
        // Create a reference for the new sale document
        const saleRef = doc(collection(db, "sales"));

        // Add sale creation operation to the batch
        batch.set(saleRef, saleObject);

        // Update stock for each item in the sale
        for (const item of sale.items) {
          const productRef = doc(db, "products", item.id);
          const productDoc = await getDoc(productRef);
          if (productDoc.exists()) {
            const productData = productDoc.data();
            if (productData.stock >= item.quantity) {
              const newStock = productData.stock - item.quantity;
              batch.update(productRef, { stock: newStock });
            } else {
              throw new Error(
                `Insufficient stock for product with ID ${item.id}`
              );
            }
          } else {
            throw new Error(`Product with ID ${item.id} does not exist.`);
          }
        }

        await batch.commit(); // Commit the batched writes
      } catch (error) {
        // Rollback changes in case of an error
        console.log("Error adding sale:", error);
        alertStore.setAlert(error.message, "error", 8);
        return; // Exit the function early to prevent further execution
      }
    },
    async recordReturned(returned,saleId) {
      console.log(saleId);
      const userStore = useUserStore();
      const alertStore = useAlertStore();
      const batch = writeBatch(db); // Initialize a Firestore batch

      try {

        const originalSaleRef = doc(db, "sales", saleId);
        const originalSaleDoc = await getDoc(originalSaleRef);

        if (originalSaleDoc.exists()) {
          batch.update(originalSaleRef, { canceled: userStore.user.email });
        } else {
          throw new Error(`Sale with ID ${saleId} does not exist.`);
        }

        // Update stock for each item in the sale
        for (const item of returned.items) {
          const productRef = doc(db, "products", item.id);
          const productDoc = await getDoc(productRef);
          if (productDoc.exists()) {
            const productData = productDoc.data();
            const newStock = productData.stock + item.quantity;
            batch.update(productRef, { stock: newStock });
          } else {
            throw new Error(`Product with ID ${item.id} does not exist.`);
          }
        }

        await batch.commit(); // Commit the batched writes
      } catch (error) {
        console.log(error);
        alertStore.setAlert(error.message, "error", 8);
        return; // Exit the function early to prevent further execution
      }
    },
    async fetchSales(startDate, endDate) {
      if (!!this.salesSubscription) return;
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
        this.sales = sales;
        console.log(this.sales);
      });

      this.salesSubscription = unsubscribe;
    },
  },
});
