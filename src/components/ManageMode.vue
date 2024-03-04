<template>
  <v-container class="pa-0">
    <!-- Chips for filtering -->
    <div class="px-2">
      <v-chip-group column>
        <v-chip filter class="mx-1" v-for="(category, index) in categoryOptions" :key="index"
          @click="toggleFilterByCategory(category)">
          {{ category }}
        </v-chip>
      </v-chip-group>
    </div>

    <!-- Grid of square cards -->
    <ProductGrid :items="filteredItems" @selected="editItem"></ProductGrid>

    <!-- Popup dialog -->
    <v-dialog v-model="dialog" max-width="500">
      <v-card v-if="dialog">
        <v-card-title>{{
          isEditing ? "Edit Item" : "Add Product"
        }}</v-card-title>
        <v-card-text>
          <FileUploader :src="editedItem.img" @fileDiscarded="editedItem.img=''" @imageUploaded="handleImageUploaded" />
          <v-form class="mt-4" ref="form">
            <v-text-field v-model="editedItem.name" label="Name" @input="checkFieldsFilled"></v-text-field>
            <v-text-field v-model="editedItem.description" label="Description" @input="checkFieldsFilled"></v-text-field>
            <v-text-field v-model="editedItem.category" label="Category" @input="checkFieldsFilled"></v-text-field>
            <v-text-field v-model="editedItem.price" label="Price" @input="checkFieldsFilled"></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn v-if="isEditing" @click="confirmDelete">Delete</v-btn>
          <v-spacer></v-spacer>
          <v-btn @click="dialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="saveChanges" :disabled="!checkFieldsFilled()">{{ isEditing ? "Save" : "Add"
          }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>

  <!-- Add Product button (floating) -->
  <div style="position: fixed; bottom: 20px; right: 20px">
    <v-btn icon size="x-large" color="primary" @click="addProduct">
      <v-icon>mdi-plus</v-icon>
    </v-btn>
  </div>
</template>

<script>
import { mapStores } from "pinia";
import { useProductStore } from "@/store/products.js";

export default {
  data() {
    return {
      items: [],
      filteredItems: [],
      filteredCategory: "",
      editedItem: {
        name: "",
        description: "",
        stock: 1,
        active: true,
        img: "",
        category: "",
        price: 0,
      },
      dialog: false,
      isEditing: false, // Added to track if editing or adding new product
    };
  },
  computed: {
    ...mapStores(useProductStore),
    categoryOptions() {
      return [...new Set(this.items.map((item) => item.category))];
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
      if (
        !this.filteredCategory ||
        (!!this.filteredCategory && this.filteredCategory != category)
      ) {
        this.filteredCategory = category;
      } else if (this.filteredCategory == category) {
        this.filteredCategory = "";
      }
      this.filterItems();
    },
    filterItems() {
      this.filteredItems = this.items.filter((item) =>
        !!this.filteredCategory ? this.filteredCategory == item.category : true
      );
    },
    handleImageUploaded(compressedImage) {
      this.editedItem.img = compressedImage
    },
    editItem(item) {
      this.editedItem = { ...item };
      this.dialog = true;
      this.isEditing = true;
    },
    addProduct() {
      this.editedItem = {
        name: "",
        description: "",
        stock: 1,
        active: true,
        img: "",
        category: "",
        price: 0,
      };
      this.dialog = true;
      this.isEditing = false;
    },
    saveChanges() {
      if (this.isEditing) {
        // Implement your logic to save changes for editing
        this.productStore.updateFirestore(this.editedItem);
      } else {
        this.productStore.addToFirestore(this.editedItem);
      }
      this.dialog = false;
    },
    confirmDelete() {
      if (confirm("Are you sure you want to delete this item?")) {
        this.deleteItemConfirmed();
      }
    },
    deleteItemConfirmed() {
      this.productStore.deleteFirestore(this.editedItem);
      this.dialog = false;
    },
    checkFieldsFilled() {
      return (
        this.editedItem.name &&
        this.editedItem.category &&
        this.editedItem.price
      );
    },
  },
};
</script>

<style></style>
