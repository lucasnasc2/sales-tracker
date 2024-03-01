<template>
  <v-dialog v-model="showDatePicker" max-width="500px">
    <v-container>
      <v-row justify="space-around">
        <v-date-picker
          @update:model-value="chengeDate"
          show-adjacent-months
        ></v-date-picker>
      </v-row>
    </v-container>
  </v-dialog>
  <div class="cart-container">
    <v-btn color="primary" @click="showDatePicker = true">
      <v-icon>mdi-calendar</v-icon>
    </v-btn>
  </div>
</template>

<script>
import { mapStores } from "pinia";
import { useProductStore } from "@/store/products.js";
import { useSalesStore } from "@/store/sales.js";
const todaysDate = new Date();
todaysDate.setHours(0, 0, 0, 0);

const tomorrow = new Date(todaysDate);
tomorrow.setDate(todaysDate.getDate() + 1);
export default {
  data() {
    return {
      selectedDate: todaysDate, // Initialize with current date
      filteredSales: [],
      sales: [],
      salesReport: [],
      products: [],
      showDatePicker: false, // Initialize with an empty array
    };
  },
  computed: {
    ...mapStores(useProductStore, useSalesStore),
    formattedSelectedDate() {
      return new Date(this.selectedDate).toLocaleDateString();
    },
    totalItemsByCategory() {
      const totalItems = {};
      for (const sale of this.filteredSales) {
        for (const item of sale.items) {
          if (!totalItems[item.category]) {
            totalItems[item.category] = 0;
          }
          totalItems[item.category] += item.quantity;
        }
      }
      return totalItems;
    },
    totalProfit() {
      let total = 0;
      for (const sale of this.filteredSales) {
        total += sale.checkoutPrice;
      }
      return total;
    },
  },
  watch: {
    selectedDate: {
      handler(newValue, oldValue) {
        let t = new Date(newValue);
        t.setDate(t.getDate() + 1);
        this.salesStore.fetchSalesReport(newValue, t);
      },
    },
    "productStore.products": {
      handler(newValue, oldValue) {
        this.products.splice(0, this.products.length, ...newValue);
      },
      immediate: true, // Immediately trigger the handler with the current value
    },
    "salesStore.sales": {
      handler(newValue, oldValue) {
        this.sales.splice(0, this.sales.length, ...newValue);
      },
      immediate: true, // Immediately trigger the handler with the current value
    },
    "salesStore.salesReport": {
      handler(newValue, oldValue) {
        this.salesReport.splice(0, this.salesReport.length, ...newValue);
      },
      immediate: true, // Immediately trigger the handler with the current value
    },
  },
  mounted() {
    this.productStore.fetchProducts();
    this.salesStore.fetchSales(todaysDate, tomorrow);
  },
  methods: {
    chengeDate(v) {
      console.log("1", v);
      this.selectedDate = v;
      console.log("2", this.selectedDate);
    },
    // Method to format checkout time (if needed)
    formatCheckoutTime(timestamp) {
      // Convert Firestore timestamp to milliseconds
      const milliseconds =
        timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000;

      // Create a JavaScript Date object
      const date = new Date(milliseconds);

      // Format the date to your preference (e.g., using toLocaleString)
      return date.toLocaleString(); // Adjust the format as needed
    },
  },
};
</script>

<style scoped>
.cart-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
}
</style>
