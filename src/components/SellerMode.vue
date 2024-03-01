<template>
  <v-container>
    <!-- Chips for filtering -->
    <v-row>
      <v-chip
        class="mx-1"
        v-for="(category, index) in categoryOptions"
        :key="index"
        @click="toggleFilterByCategory(category)"
        :class="{ active: filteredCategories.includes(category) }"
      >
        {{ category }}
      </v-chip>
    </v-row>

    <!-- Grid of square cards -->
    <v-row>
      <v-col
        v-for="(item, index) in filteredItems"
        :key="index"
        :sm="6"
        :md="4"
        :lg="3"
        :xl="2"
      >
        <v-card @click="showDetails(item)">
          <v-card-title>{{ item.name }}</v-card-title>
          <v-card-subtitle>{{ item.category }}</v-card-subtitle>
          <v-card-text>{{ item.price }}</v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Popup dialog for product details -->
    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title>{{ selectedItem.name }}</v-card-title>
        <v-card-subtitle>{{ selectedItem.category }}</v-card-subtitle>
        <v-card-text>{{ selectedItem.price }}</v-card-text>
        <v-row align="center">
          <v-col cols="3">Quantity:</v-col>
          <v-col cols="9">
            <v-btn icon @click="decrementQuantity">
              <v-icon>mdi-minus</v-icon>
            </v-btn>
            {{ quantity }}
            <v-btn icon @click="incrementQuantity">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <v-card-actions>
          <v-btn color="primary" @click="addItemToCart(selectedItem)"
            >Add to Cart</v-btn
          >
          <v-btn color="primary" @click="dialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Cart dialog -->
    <v-dialog v-model="cartDialog" max-width="600">
      <v-card>
        <v-card-title>Cart</v-card-title>
        <v-list>
          <v-list-item
            class="pa-2"
            v-for="(cartItem, index) in cart"
            :key="index"
          >
            <v-list-item-title>{{ cartItem.name }}</v-list-item-title>
            <v-list-item-subtitle
              >Quantity: {{ cartItem.quantity }}</v-list-item-subtitle
            >
            <v-list-item-subtitle
              >Price: {{ cartItem.price }}</v-list-item-subtitle
            >
            <template v-slot:append>
              <v-btn icon="mdi-delete" @click="removeItemFromCart(index)">
              </v-btn>
            </template>
          </v-list-item>
        </v-list>
        <v-card-actions>
          <v-btn color="primary" @click="checkout">Checkout</v-btn>
          <v-btn color="primary" @click="clearCart">Clear Cart</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>

  <!-- Fixed button with cart icon -->

  <div class="cart-container">
    <v-btn
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
export default {
  data() {
    return {
      items: [],
      filteredCategories: [],
      filteredItems: [],
      selectedItem: {},
      dialog: false,
      cartDialog: false,
      cart: [], // Array to store items in the cart
      quantity: 1, // Default quantity
    };
  },
  computed: {
    ...mapStores(useProductStore, useSalesStore),
    categoryOptions() {
      return [...new Set(this.items.map((item) => item.category))];
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
    this.filteredItems = this.items;
  },
  watch: {
    "productStore.products": {
      handler(newValue, oldValue) {
        this.items.splice(0, this.items.length, ...newValue);
        this.filterItems();
      },
      immediate: true, // Immediately trigger the handler with the current value
    },
  },
  methods: {
    toggleFilterByCategory(category) {
      const index = this.filteredCategories.indexOf(category);
      if (index === -1) {
        this.filteredCategories.push(category);
      } else {
        this.filteredCategories.splice(index, 1);
      }
      this.filterItems();
    },
    filterItems() {
      if (this.filteredCategories.length === 0) {
        this.filteredItems = this.items;
      } else {
        this.filteredItems = this.items.filter((item) =>
          this.filteredCategories.includes(item.category)
        );
      }
    },
    showDetails(item) {
      this.selectedItem = item;
      this.dialog = true;
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
          category: item.category,
          price: item.price,
          quantity: this.quantity,
        });
      }
      this.quantity = 1; // Reset quantity after adding to cart
      this.dialog = false; // Close product detail dialog after adding to cart

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

<style>
.cart-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
}
</style>
