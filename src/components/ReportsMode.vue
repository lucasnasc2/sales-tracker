<template>
  <v-container fluid class="fill-height">
    <v-row align="center" justify="center" class="fill-height">
      <v-col cols="12">
        <v-card>
          <v-card-title>Informe de hoy</v-card-title>
          <v-card-text>
            <v-list lines="two">
              <v-list-subheader inset>Ventas</v-list-subheader>
              <v-list-item v-for="sale in sales" :key="sale.id" :subtitle="sale.checkoutPrice" :title="sale.checkoutTime">
                <template v-slot:prepend>
                  <v-avatar color="grey-lighten-1">
                    <v-icon color="white">mdi-receipt-text</v-icon>
                  </v-avatar>
                </template>

                <template v-slot:append>
                  <v-btn @click="selectSale(sale)" color="grey-lighten-1" icon="mdi-information" variant="text"></v-btn>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <v-dialog v-model="dialog" max-width="500px">
    <v-card>
      <v-card-title>Venta {{ selectedSale.id }}</v-card-title>
      <v-card-subtitle>{{ selectedSale.checkoutTime }}</v-card-subtitle>
      <v-card-text class="px-0">
        <div class="d-flex py-0 justify-space-between">
          <v-list-item density="compact">
            <v-list-item-title>Subtotal</v-list-item-title>
          </v-list-item>

          <v-list-item density="compact">
            <v-list-item-title>${{ selectedSale.checkoutPrice }}</v-list-item-title>
          </v-list-item>
        </div>
        <v-divider></v-divider>
        <v-list lines="two">
          <v-list-subheader>Productos</v-list-subheader>

          <v-list-item v-for="item in selectedSale.items" :key="item.id" :subtitle="'x' + item.quantity" :title="item.id">
            <template v-slot:prepend>

            </template>

            <template v-slot:append>
              ${{ item.price }}
            </template>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </v-dialog>

  <v-dialog v-model="showDatePicker" max-width="500px">
    <v-container>
      <v-row justify="space-around">
        <v-date-picker @update:model-value="chengeDate" show-adjacent-months></v-date-picker>
      </v-row>
    </v-container>
  </v-dialog>

  <div style="position: fixed; bottom: 20px; right: 20px">
    <v-btn icon="mdi-calendar" size="x-large" color="primary" @click="showDatePicker = true"></v-btn>
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
      selectedSale: {
        checkoutPrice: 0,
        userId: '',
        checkoutTime: '',
        id: '',
        items: []
      },
      dialog: false,
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
    saleIsSelected() {
      return !!selectedSale
    }
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
    selectSale(sale) {
      this.selectedSale = { ...sale }
      this.dialog = true
    },
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
