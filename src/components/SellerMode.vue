<template>
  <v-container class="pa-0">
    <!-- Chips for filtering -->
    <div class="px-2">
      <CategoryFilter
        :items="categoryOptions"
        @selected="toggleFilterByCategory"
      ></CategoryFilter>
    </div>

    <!-- Grid of square cards -->
    <ProductGrid
      :items="searchedItems"
      :categories="categoryOptions"
      @selected="showDetails"
    ></ProductGrid>

    <!-- Popup dialog for product details -->
    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-list lines="two">
          <v-list-item
            density="compact"
            :subtitle="selectedItem.description"
            :title="selectedItem.name"
          >
            <v-list-item-subtitle>{{
              selectedItem.category
            }}</v-list-item-subtitle>
            <template v-slot:append
              >{{ quantity }}x {{ $globals.currency
              }}{{ selectedItem.price * quantity }}
            </template>
          </v-list-item>
        </v-list>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-row style="max-width: 250px" justify="center">
            <v-col class="text-center" cols="4">
              <v-btn icon flat @click="decrementQuantity">
                <v-icon>mdi-minus</v-icon>
              </v-btn>
            </v-col>
            <v-col class="text-center" cols="4">
              <div
                style="
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  height: 100%;
                  width: 100%;
                "
              >
                <v-text-field v-model="quantity" number></v-text-field>
              </div>
            </v-col>
            <v-col class="text-center" cols="4">
              <v-btn icon flat @click="incrementQuantity">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-spacer></v-spacer>
        </v-card-actions>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="closeProductDetails">Close</v-btn>
          <v-btn color="primary" @click="addItemToCart(selectedItem)"
            >Add to Cart</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Cart dialog -->
    <v-dialog v-model="cartDialog" max-width="600">
      <v-card>
        <v-card-title>Cart</v-card-title>
        <v-card-actions>
          <v-btn color="primary" @click="clearCart">Clear Cart</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="checkout">Checkout</v-btn>
        </v-card-actions>
        <v-list>
          <v-list-item>
            <v-list-item-title>Total</v-list-item-title>

            <template v-slot:append>
              {{ checkoutPrice }}
            </template>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item
            density="compact"
            class="pa-2"
            v-for="(cartItem, index) in cart"
            :key="index"
          >
            <v-list-item-title>{{
              getProductById(cartItem.id).name
            }}</v-list-item-title>
            <v-list-item-subtitle>{{
              getProductById(cartItem.id).description
            }}</v-list-item-subtitle>
            <v-list-item-subtitle>{{
              getProductById(cartItem.id).category
            }}</v-list-item-subtitle>

            <template v-slot:append>
              {{ cartItem.quantity }} x {{ $globals.currency
              }}{{ cartItem.price }} = {{ $globals.currency
              }}{{ cartItem.quantity * cartItem.price }}
              <v-btn flat icon="mdi-delete" @click="removeItemFromCart(index)">
              </v-btn>
            </template>
          </v-list-item>
        </v-list>
      </v-card>
    </v-dialog>
  </v-container>

  <!-- Fixed button with cart icon -->

  <div style="position: fixed; bottom: 20px; right: 20px">
    <v-btn
      icon
      size="x-large"
      color="primary"
      @click="toggleCartDialog"
      :disabled="cart.length === 0"
    >
      <v-icon>mdi-cart</v-icon>
      <v-badge
        v-if="cart.length >= 1"
        :content="totalQuantityInCart"
        overlap
      ></v-badge>
    </v-btn>
  </div>
</template>

<script>
import { mapStores } from "pinia";
import { useProductStore } from "@/store/products.js";
import { useSalesStore } from "@/store/sales.js";
import { useSearchStore } from "@/store/search.js";
export default {
  data() {
    return {
      filteredCategory: "",
      selectedItem: {},
      dialog: false,
      cartDialog: false,
      cart: [], // Array to store items in the cart
      quantity: 1, // Default quantity,
    };
  },
  computed: {
    ...mapStores(useProductStore, useSalesStore, useSearchStore),
    categoryOptions() {
      let categories = [
        ...new Set(this.productStore.products.map((item) => item.category)),
      ];
      return categories;
    },
    filteredItems() {
    return this.productStore.products.filter((item) => {
      const isActive = item.active;
      return isActive && (!this.filteredCategory || this.filteredCategory === item.category);
    });
  },
    searchedItems() {
      let text = this.searchStore.text.toLowerCase()
      return this.filteredItems.filter((item) =>
        !!this.searchStore.text
          ? item.name.toLowerCase().includes(text)
          : true
      );
    },
    totalQuantityInCart() {
      return this.cart.reduce((total, item) => total + item.quantity, 0);
    },
    checkoutPrice() {
      return this.cart.reduce((total, item) => {
        return total + item.price * item.quantity;
      }, 0);
    },
  },
  mounted() {
    this.productStore.fetchProducts();
  },
  watch: {},
  methods: {
    getProductById(id) {
      const index = this.productStore.products.findIndex(
        (product) => product.id === id
      );
      return this.productStore.products[index];
    },
    toggleFilterByCategory(category) {
      if (
        !this.filteredCategory ||
        (!!this.filteredCategory && this.filteredCategory != category)
      ) {
        this.filteredCategory = category;
      } else if (this.filteredCategory == category) {
        this.filteredCategory = "";
      }
    },
    showDetails(item) {
      this.selectedItem = item;
      this.quantity = 1;
      this.dialog = true;
    },
    closeProductDetails() {
      this.quantity = 1;
      this.dialog = false;
    },
    addItemToCart(item) {
      console.log(item);
      const index = this.cart.findIndex((cartItem) => cartItem.id === item.id);
      console.log(index);
      if (index !== -1) {
        this.cart[index].quantity += this.quantity;
      } else {
        this.cart.push({
          id: item.id,
          name: item.name,
          description: item.description,
          category: item.category,
          price: item.price,
          quantity: this.quantity,
        });
      }
      this.closeProductDetails() // Close product detail dialog after adding to cart

      // Close cart dialog if cart is empty
      if (this.cart.length === 0) {
        this.cartDialog = false;
      }
    },
    removeItemFromCart(index) {
      this.cart.splice(index, 1);
      if (this.cart.length == 0) this.toggleCartDialog();
    },
    toggleCartDialog() {
      this.cartDialog = !this.cartDialog;
    },
    checkout() {
      let saleObject = {
        items: [...this.cart],
        checkoutPrice: this.checkoutPrice,
      };
      this.salesStore.addToFirestore(saleObject);
      this.clearCart();
    },
    clearCart() {
      this.cart = [];
      this.cartDialog = false; // Close cart dialog when clearing cart
    },
    incrementQuantity() {
      this.quantity++;
    },
    decrementQuantity() {
      if (this.quantity > 1) {
        this.quantity--;
      }
    },
  },
};
</script>

<style></style>
