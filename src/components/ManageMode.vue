<template>
  <v-container class="pa-0">
    <!-- Chips for filtering -->
    <div class="px-2">
      <CategoryFilter :items="categoryOptions" @selected="toggleFilterByCategory"></CategoryFilter>
    </div>

    <!-- Grid of square cards -->
    <ProductGrid :items="searchedItems" :categories="categoryOptions" @selected="editItem"></ProductGrid>

    <!-- Popup dialog -->
    <v-dialog v-model="dialog" max-width="500">
      <v-card v-if="dialog">
        <v-card-title>{{
          isEditing ? "Edit Item" : "Add Product"
        }}</v-card-title>
        <span class="text-overline px-2">{{'Creado en: ' +  tsToDate(editedItem.createdTimestamp)}}</span>
        <span class="text-overline px-2" v-if="wasModified(editedItem.createdTimestamp,editedItem.modifiedTimestamp)">{{'Modificado en: ' +  tsToDate(editedItem.modifiedTimestamp)}}<br />{{'Por: ' + editedItem.modifiedBy}}</span>
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
  <div style="position: fixed; bottom: 20px; left: 20px">
    <v-btn
      icon="mdi-file-download-outline"
      color="primary"
      :disabled="!productStore.products.length"
      @click="downloadExcel"
    ></v-btn>
  </div>
</template>

<script>
import { mapStores } from "pinia";
import { useProductStore } from "@/store/products.js";
import { useSearchStore } from "@/store/search.js";
import { useLoaderStore } from "@/store/loader.js";
import { generateExcelInventory } from "@/plugins/getExcel.js";

export default {
  data() {
    return {
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
    ...mapStores(useProductStore, useSearchStore, useLoaderStore),
    categoryOptions() {
      return [...new Set(this.productStore.products.map((item) => item.category))];
    },
    wasModified() {
      return function (createdTs, modifiedTs) {
        let createdDate = this.tsToDate(createdTs)
        let modifiedDate = this.tsToDate(modifiedTs)
        return modifiedDate != createdDate
      }
    },
    filteredItems() {
      return this.productStore.products.filter((item) =>
        !!this.filteredCategory ? this.filteredCategory == item.category : true
      );
    },
    searchedItems() {
      return this.filteredItems.filter((item) =>
        !!this.searchStore.text ? item.name.includes(this.searchStore.text) : true
      );
    },
  },
  mounted() {
    this.productStore.fetchProducts();
  },
  watch: {
  },
  methods: {
    tsToDate(timestamp) {
      const milliseconds = timestamp.toMillis();
      // Create a new JavaScript Date object using the milliseconds
      const convertedDate = new Date(milliseconds).toLocaleString();
      return convertedDate;
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
    async downloadExcel() {
      try {
        if (confirm("Descargar informe en formato .xlsx?")) {
          this.loaderStore.state = true;
          // Assuming salesData and productsData are available in your component
          const excelBlob = await generateExcelInventory(
            this.productStore.products
          );
          const url = window.URL.createObjectURL(excelBlob);
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "inventory_data.xlsx");
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

<style></style>
