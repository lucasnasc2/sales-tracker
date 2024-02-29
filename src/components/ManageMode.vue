<template>
  <v-container>
    <!-- Chips for filtering -->
    <v-row>
      <v-chip
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
      <v-col v-for="(item, index) in filteredItems" :key="index" cols="3">
        <v-card @click="editItem(item)">
          <v-card-title>{{ item.name }}</v-card-title>
          <v-card-subtitle>{{ item.category }}</v-card-subtitle>
          <v-card-text>{{ item.price }}</v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Popup dialog -->
    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title>{{ isEditing ? 'Edit Item' : 'Add Product' }}</v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-text-field v-model="editedItem.name" label="Name" @input="checkFieldsFilled"></v-text-field>
            <v-text-field v-model="editedItem.category" label="Category" @input="checkFieldsFilled"></v-text-field>
            <v-text-field v-model="editedItem.price" label="Price" @input="checkFieldsFilled"></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn v-if="isEditing" color="error" @click="confirmDelete">Delete</v-btn>
          <v-btn color="primary" @click="saveChanges" :disabled="!checkFieldsFilled()">{{ isEditing ? 'Save' : 'Add' }}</v-btn>
          <v-btn color="error" @click="dialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>

  <!-- Add Product button (floating) -->
  <div class="add-product-container">
    <v-btn color="primary" @click="addProduct">Add Product</v-btn>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [
        { name: "Item 1", category: "Category A", price: "$10" },
        { name: "Item 2", category: "Category B", price: "$20" },
        // Add more items as needed
      ],
      filteredItems: [],
      filteredCategories: [],
      editedItem: { name: '', category: '', price: '' },
      dialog: false,
      isEditing: false, // Added to track if editing or adding new product
    };
  },
  computed: {
    categoryOptions() {
      return [...new Set(this.items.map(item => item.category))];
    }
  },
  mounted() {
    this.filteredItems = this.items;
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
    editItem(item) {
      this.editedItem = { ...item };
      this.dialog = true;
      this.isEditing = true;
    },
    addProduct() {
      this.editedItem = { name: '', category: '', price: '' };
      this.dialog = true;
      this.isEditing = false;
    },
    saveChanges() {
      if (this.isEditing) {
        // Implement your logic to save changes for editing
        const index = this.items.findIndex(
          (item) => item.name === this.editedItem.name
        );
        if (index !== -1) {
          this.items[index] = { ...this.editedItem };
        }
      } else {
        // Implement your logic to save new product
        this.items.push({ ...this.editedItem });
      }
      this.dialog = false;
    },
    confirmDelete() {
      if (confirm("Are you sure you want to delete this item?")) {
        this.deleteItemConfirmed();
      }
    },
    deleteItemConfirmed() {
      const index = this.items.findIndex(
        (item) => item.name === this.editedItem.name
      );
      if (index !== -1) {
        this.items.splice(index, 1);
        this.filterItems();
      }
      this.dialog = false;
    },
    checkFieldsFilled() {
      return this.editedItem.name && this.editedItem.category && this.editedItem.price;
    },
  },
};
</script>

<style>
.active {
  background-color: #1976d2;
  color: white;
}
.add-product-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
}
</style>
