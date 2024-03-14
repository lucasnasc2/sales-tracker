<template>
  <v-list>
    <v-list-item
      @click="selectItem(item)"
      v-for="(item, index) in items"
      :key="index"
    >
      <v-list-item-title>{{ item.name }}</v-list-item-title>
      <v-list-item-subtitle>{{ item.description }}</v-list-item-subtitle>
      <template v-slot:append>{{ item.stock }}</template>
    </v-list-item>
  </v-list>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
  computed: {},
  methods: {
    selectItem(item) {
      this.$emit("selected", item);
    },
  },
};
</script>
