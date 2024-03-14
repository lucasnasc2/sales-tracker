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

export const useStockStore = defineStore("stock", {
  state: () => ({ stockRecord: [], stockSubscription: null }),
  actions: {
    cancelSubscription() {
      if (this.stockSubscription) {
        this.stockSubscription();
        this.stockSubscription = null;
      }
    },
    async stockRemove(stockItems) {
      const userStore = useUserStore();
      const alertStore = useAlertStore();
      const batch = writeBatch(db); // Initialize a Firestore batch

      try {
        let stockObject = {
          ...stockItems,
          userId: userStore.user.email,
          updateTime: serverTimestamp(),
          transactionType: "stockRemove",
        };
        // Create a reference for the new sale document
        const docRef = doc(collection(db, "stockRecord"));

        // Add sale creation operation to the batch
        batch.set(docRef, stockObject);

        // Update stock for each item in the sale
        for (const item of stockObject.items) {
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
        console.log(error);
        alertStore.setAlert(error.message, "error", 8);
      }
    },
    async stockAdd(stockItems) {
      const userStore = useUserStore();
      const alertStore = useAlertStore();
      const batch = writeBatch(db); // Initialize a Firestore batch

      try {
        let stockObject = {
          ...stockItems,
          userId: userStore.user.email,
          updateTime: serverTimestamp(),
          transactionType: "stockAdd",
        };
        // Create a reference for the new sale document
        const docRef = doc(collection(db, "stockRecord"));

        // Add sale creation operation to the batch
        batch.set(docRef, stockObject);

        // Update stock for each item in the sale
        for (const item of stockObject.items) {
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
      }
    },
    async fetchStockRecord(startDate, endDate) {
      if (!!this.stockSubscription) return;
      console.log(startDate, endDate);
      const q = query(
        collection(db, "stockRecord"),
        where("updateTime", ">=", startDate),
        where("updateTime", "<", endDate)
      );

      // Subscribe to snapshot changes
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const stockRecord = [];
        querySnapshot.forEach((doc) => {
          console.log(doc.id);
          let record = {
            id: doc.id,
            ...doc.data(),
          };
          stockRecord.push(record);
        });
        this.stockRecord = stockRecord;
        console.log(this.stockRecord);
      });

      this.stockSubscription = unsubscribe;
    },
  },
});
