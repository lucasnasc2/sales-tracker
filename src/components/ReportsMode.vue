<template>
  <div class="px-3 pb-2">
    <v-chip-group
      :disabled="!salesStore.sales.length"
      v-model="reportMode"
      mandatory
      column
    >
      <v-chip
        color="primary"
        filter
        class="mx-1"
        :value="report"
        v-for="(report, index) in reports"
        :key="index"
        @click="changeReport(report)"
      >
        {{ report }}
      </v-chip>
    </v-chip-group>
  </div>
  <v-container fluid class="fill-height pt-0">
    <v-row align="center" justify="center" class="fill-height">
      <v-col v-if="salesStore.sales.length" cols="12">
        <v-card variant="tonal" color="primary">
          <v-card-title>Informe de ventas</v-card-title>
          <v-card-subtitle
            ><span v-if="salesStore.sales.length > 1">Desde: </span
            >{{ tsToDate(salesStore.sales[0].checkoutTime) }}</v-card-subtitle
          >
          <v-card-subtitle v-if="salesStore.sales.length > 1">
            <span>Hasta: </span
            >{{
              tsToDate(
                salesStore.sales[salesStore.sales.length - 1].checkoutTime
              )
            }}</v-card-subtitle
          >
          <v-divider></v-divider>
          <v-card-text class="pa-0">
            <v-list>
              <v-list-item title="Total">
                <template v-slot:append>
                  {{ $globals.currency }}{{ totalProfit }}</template
                >
              </v-list-item>
            </v-list>
            <v-divider></v-divider>
            <v-list v-if="reportMode == 'categorias'">
              <v-list-item
                v-for="(value, key) in totalItemsByCategory"
                :key="key"
                density="compact"
              >
                <v-list-item-title>{{ key }}</v-list-item-title>

                <template v-slot:append>
                  x{{ value.totalQuantity }} => {{ $globals.currency
                  }}{{ value.totalPrice }}</template
                >
              </v-list-item>
            </v-list>
            <v-list v-if="reportMode == 'productos'">
              <v-list-item
                v-for="(value, key) in totalItemsByProduct"
                :key="key"
                density="compact"
              >
                <v-list-item-title>{{ value.name }}</v-list-item-title>

                <template v-slot:append>
                  x{{ value.totalQuantity }} => {{ $globals.currency
                  }}{{ value.totalPrice }}</template
                >
              </v-list-item>
            </v-list>
            <v-list density="compact">
              <v-divider></v-divider>
              <v-list-item
                v-for="sale in sortedSalesByDate"
                :key="sale.id"
                :title="tsToDate(sale.checkoutTime)"
                @click="selectSale(sale)"
              >
                <template v-slot:prepend>
                  <v-avatar color="grey-lighten-1">
                    <v-icon color="white">mdi-receipt-text</v-icon>
                  </v-avatar>
                </template>

                <template v-slot:append>
                  {{ $globals.currency }}{{ sale.checkoutPrice }}
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col v-else cols="12">
        <v-card variant="tonal">
          <v-card-title>Seleccione una fecha</v-card-title>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <v-dialog v-model="dialog" max-width="500px">
    <v-card>
      <v-card-title>Venta {{ selectedSale.id }}</v-card-title>
      <v-card-subtitle>{{
        tsToDate(selectedSale.checkoutTime)
      }}</v-card-subtitle>
      <v-card-subtitle>{{ selectedSale.userId }}</v-card-subtitle>
      <v-card-text class="px-0">
        <div class="d-flex py-0 justify-space-between">
          <v-list-item density="compact">
            <v-list-item-title>Total</v-list-item-title>
          </v-list-item>

          <v-list-item density="compact">
            <v-list-item-title
              >{{ $globals.currency
              }}{{ selectedSale.checkoutPrice }}</v-list-item-title
            >
          </v-list-item>
        </div>

        <v-divider></v-divider>
        <v-list lines="two">
          <v-list-subheader>Productos</v-list-subheader>

          <v-list-item
            v-for="item in selectedSale.items"
            :key="item.id"
            :subtitle="item.description"
            :title="item.name"
          >
            <v-list-item-subtitle>{{ item.category }}</v-list-item-subtitle>

            <template v-slot:append
              >{{ item.quantity }}x {{ $globals.currency }}{{ item.price }} =
              {{ $globals.currency }}{{ item.quantity * item.price }}
            </template>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </v-dialog>

  <v-dialog v-model="showDatePicker" max-width="328">
    <v-card>
      <v-date-picker
        multiple
        v-model="dates"
        color="primary"
        :max="todaysDateString"
        show-adjacent-months
      ></v-date-picker>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="fetchSalesReport">Consultar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <div style="position: fixed; bottom: 20px; right: 20px">
    <v-btn
      elevation="5"
      icon="mdi-calendar"
      size="x-large"
      color="primary"
      @click="showDatePicker = true"
    ></v-btn>
  </div>
  <div style="position: fixed; bottom: 20px; left: 20px">
    <v-btn
      icon="mdi-file-download-outline"
      color="primary"
      :disabled="!salesStore.sales.length"
      @click="downloadExcel"
    ></v-btn>
  </div>
</template>

<script>
import { mapStores } from "pinia";
import { useProductStore } from "@/store/products.js";
import { useSalesStore } from "@/store/sales.js";
import { useAlertStore } from "@/store/alerts";
import { useLoaderStore } from "@/store/loader.js";
import { generateExcelSales } from "@/plugins/getExcel.js";
const todaysDate = new Date();
todaysDate.setHours(0, 0, 0, 0);

const tomorrow = new Date(todaysDate);
tomorrow.setDate(todaysDate.getDate() + 1);
export default {
  data() {
    return {
      selectedDate: todaysDate,
      dates: [],
      dateRange: [],
      selectedSale: {
        checkoutPrice: 0,
        userId: "",
        checkoutTime: "",
        id: "",
        items: [],
      },
      dialog: false,
      reports: ["productos", "categorias"],
      reportMode: "productos",
      showDatePicker: false, // Initialize with an empty array
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
          new Date(a.checkoutTime.toMillis()) -
          new Date(b.checkoutTime.toMillis())
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
    saleIsSelected() {
      return !!selectedSale;
    },
    todaysDateString() {
      return todaysDate.toDateString();
    },
  },
  watch: {
    dates: {
      handler(v, oldV) {
        if (v.length > 1) {
          if (v.length < oldV.length) {
            this.dates = [this.findMissingDate(oldV, v)];
          } else if (v.toString() != oldV.toString()) {
            this.sortAndFillDates(v);
          }
          this.dateRange = [v[0], v[v.length - 1]];
        } else if (v.length == 1) {
          this.dateRange = [v[0]];
        }
        console.log(this.dateRange);
      },
    },
  },
  mounted() {
    this.salesStore.fetchSales(todaysDate, tomorrow);
  },
  methods: {
    tsToDate(timestamp) {
      const milliseconds = timestamp.toMillis();
      // Create a new JavaScript Date object using the milliseconds
      const convertedDate = new Date(milliseconds).toLocaleString();
      return convertedDate;
    },
    fetchSalesReport() {
      let startDate = new Date(this.dateRange[0]);
      let endDate = new Date(
        this.dateRange[1]
          ? this.dateRange[1].setDate(this.dateRange[1].getDate() + 1)
          : this.dateRange[0].setDate(this.dateRange[0].getDate() + 1)
      );
      console.log("start and end dates: ", startDate, endDate);

      this.salesStore.cancelSubsctription();

      this.salesStore.fetchSales(startDate, endDate);

      this.dates = [];
      this.dateRange = [];
      this.showDatePicker = false;
    },
    selectSale(sale) {
      this.selectedSale = { ...sale };
      this.dialog = true;
    },
    chengeDate(v) {
      this.selectedDate = v;
      this.showDatePicker = false;
    },
    changeReport(mode) {
      this.reportMode = mode;
    },
    findMissingDate(sortedArray1, sortedArray2) {
      // Iterate through both arrays simultaneously
      for (let i = 0; i < sortedArray1.length; i++) {
        // If dates at current indices are not equal, return the date from the first array
        if (sortedArray1[i] !== sortedArray2[i]) {
          return sortedArray1[i];
        }
      }
      // If no difference found, return the last date from the first array
      return sortedArray1[sortedArray1.length - 1];
    },
    sortAndFillDates(dateArray) {
      if (dateArray.length <= 1) return;
      // Sort the input array of dates
      dateArray.sort((a, b) => a - b);

      // Function to get dates between two dates
      function getDatesBetween(startDate, endDate) {
        const dates = [];
        let currentDate = new Date(startDate);

        while (currentDate <= endDate) {
          dates.push(new Date(currentDate));
          currentDate.setDate(currentDate.getDate() + 1);
        }

        return dates;
      }

      // Initialize result array with first date from input array
      const resultArray = [new Date(dateArray[0])];

      // Loop through input array to add dates in between
      for (let i = 0; i < dateArray.length - 1; i++) {
        const currentDate = new Date(dateArray[i]);
        const nextDate = new Date(dateArray[i + 1]);

        // Get dates in between current and next date
        const datesBetween = getDatesBetween(currentDate, nextDate);

        // Add dates in between to result array
        resultArray.push(...datesBetween.slice(1));
      }

      this.dates = resultArray;
    },
    async downloadExcel() {
      try {
        if (confirm("Descargar informe en formato .xlsx?")) {
          this.loaderStore.state = true;
          // Assuming salesData and productsData are available in your component
          const excelBlob = await generateExcelSales(this.salesStore.sales);
          const url = window.URL.createObjectURL(excelBlob);
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "sales_data.xlsx");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          this.loaderStore.state = false;
        }
      } catch (error) {
        console.log(error);
        this.loaderStore.state = false;
        this.alertStore.setAlert(error, "error", 7);
      }
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
