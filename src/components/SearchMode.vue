<template>
  <v-container fluid class="fill-height pt-0">
    <v-row align="center" justify="center" class="fill-height">
      <v-col cols="12">
        <v-card color="primary" class="mb-3">
          <v-card-title>Buscar tickets</v-card-title>
          <v-card-actions><v-text-field v-model="searchText" hide-details single-line autofocus density="compact" variant="solo"
            rounded></v-text-field>
          <v-btn @click="search()" icon="mdi-magnify"></v-btn></v-card-actions>
        </v-card>
        <v-card v-if="searchResult">
          <v-list density="compact">
              <v-list-item :title="tsToDate(searchResult.checkoutTime)"
                :subtitle="searchResult.userId" @click="selectSale(searchResult)" density="compact">
                <template v-slot:prepend>
                  <v-avatar size="small" density="compact" :color="searchResult.donation ? 'primary' : 'grey-lighten-1'">
                    <v-icon size="small" color="white">mdi-receipt-text</v-icon>
                  </v-avatar>
                </template>

                <template v-slot:append>
                  {{ $globals.currency }}{{ searchResult.checkoutPrice }}
                </template>
              </v-list-item>
            </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <v-dialog v-model="dialog" v-if="searchResult" max-width="500px">
    <v-card>
      <v-card-title>Venta {{ searchResult.id }}</v-card-title>
      <v-card-subtitle>{{
        tsToDate(searchResult.checkoutTime)
      }}</v-card-subtitle>
      <v-card-subtitle>{{ searchResult.userId }}</v-card-subtitle>
      <v-card-text class="px-0">
        <div class="d-flex py-0 justify-space-between">
          <v-list-item density="compact">
            <v-list-item-title>Total</v-list-item-title>
          </v-list-item>

          <v-list-item density="compact">
            <v-list-item-title>{{ $globals.currency
              }}{{ searchResult.checkoutPrice }}</v-list-item-title>
          </v-list-item>
        </div>

        <div v-if="searchResult.donation" class="d-flex py-0 justify-space-between">
          <v-list-item density="compact">
            <v-list-item-title>Donación</v-list-item-title>
          </v-list-item>

          <v-list-item density="compact">
            <v-list-item-title>{{ $globals.currency
              }}{{ searchResult.donation }}</v-list-item-title>
          </v-list-item>
        </div>
        <v-divider></v-divider>
        <v-list>
          <v-list-item v-for="item in searchResult.items" :key="item.id" :title="item.name" density="compact">
            <v-list-item-subtitle>{{ item.category }}</v-list-item-subtitle>

            <template v-slot:append>{{ item.quantity }}x {{ $globals.currency }}{{ item.price }} =
              {{ $globals.currency }}{{ item.quantity * item.price }}
            </template>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </v-dialog>

  <div style="height: 80px"></div>
</template>

<script>
import { mapStores } from "pinia";
import { useProductStore } from "@/store/products.js";
import { useSalesStore } from "@/store/sales.js";
import { useAlertStore } from "@/store/alerts";
import { useLoaderStore } from "@/store/loader.js";
export default {
  data() {
    return {
      searchText:"",
      searchResult: null,
      dialog: false,
    };
  },
  computed: {
    ...mapStores(useProductStore, useSalesStore, useAlertStore, useLoaderStore),
    formattedSelectedDate() {
      return new Date(this.selectedDate).toLocaleDateString();
    },
    sortedSalesByDate() {
      return this.salesStore.sales.slice().sort((a, b) => {
        return (
          new Date(b.checkoutTime.toMillis()) -
          new Date(a.checkoutTime.toMillis())
        );
      });
    },
    totalItemsByCategory() {
      const totalsByCategory = {};

      for (const sale of this.salesStore.sales) {
        for (const item of sale.items) {
          if (!totalsByCategory[item.category]) {
            totalsByCategory[item.category] = {
              totalQuantity: 0,
              totalPrice: 0,
            };
          }
          totalsByCategory[item.category].totalQuantity += item.quantity;
          totalsByCategory[item.category].totalPrice +=
            item.price * item.quantity;
        }
      }

      return totalsByCategory;
    },
    totalItemsByProduct() {
      const totalsByProduct = {};

      for (const sale of this.salesStore.sales) {
        for (const item of sale.items) {
          if (!totalsByProduct[item.id]) {
            totalsByProduct[item.id] = {
              name: item.name,
              totalQuantity: 0,
              totalPrice: 0,
            };
          }
          totalsByProduct[item.id].totalQuantity += item.quantity;
          totalsByProduct[item.id].totalPrice += item.price * item.quantity;
        }
      }

      return totalsByProduct;
    },
    totalProfit() {
      let total = 0;
      for (const sale of this.salesStore.sales) {
        total += sale.checkoutPrice;
      }
      return total;
    },
    totalDonations() {
      let total = 0;
      for (const sale of this.salesStore.sales) {
        if (sale.donation) {
          total += sale.donation;
        }
      }
      return total;
    },
    saleIsSelected() {
      return !!selectedSale;
    },
    todaysDateString() {
      return todaysDate.toDateString();
    },
  },
  watch: {
  },
  mounted() {
  },
  methods: {
    tsToDate(timestamp) {
      const milliseconds = timestamp.toMillis();
      // Create a new JavaScript Date object using the milliseconds
      const convertedDate = new Date(milliseconds).toLocaleString();
      return convertedDate;
    },
    selectSale(sale) {
      this.selectedSale = { ...sale };
      this.dialog = true;
    },
    search() {
      this.salesStore.searchSaleById(this.searchText).then(data => {
        if (data) {
          this.searchResult = data;
          console.log("Document data:", data);
        } else {
          this.alertStore.setAlert("No such document!", "error", 5);
        }
      })
        .catch(error => {
          this.alertStore.setAlert(error, "error", 7);
        });
    }
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
