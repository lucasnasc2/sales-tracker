<template>
  <v-container>
    <v-row class="pa-1">
      <v-col class="pa-2" v-for="(item, index) in items" :key="index" cols="6" :sm="3" :md="2">
        <v-card :color="item.active ? getColorByCategory(item.category) : 'grey-lighten-1'" @click="selectItem(item)">
          <v-img class="align-end text-white" height="100" :src="item.img" cover>
            <v-card-title :style="!item.img ? 'color: black;' : ''">{{ item.name }}</v-card-title>
            <v-card-subtitle :style="!item.img ? 'color: black;' : ''">{{ item.description }}</v-card-subtitle>
          </v-img>
          <v-list :bg-color="item.active ? getColorByCategory(item.category) : 'grey-lighten-1'" lines="one">
            <v-list-item  density="compact" :subtitle="item.category">
              <template v-slot:append>{{ $globals.currency }}{{ item.price }}</template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { generateAnalogousColorPalette } from "../plugins/colorPalette.js"
import { getColorByValuePath } from "../plugins/getColorByValuePath.js";
export default {
  props: {
    items: {
      type: Array,
      required: true
    },
    categories: {
      type: Array,
      required: true
    },
  },
  computed: {
    colorPalette() {
      return generateAnalogousColorPalette(getColorByValuePath(this.$globals.secondaryColor), this.categories.length)
    },
    getColorByCategory() {
      return (category) => {
        let index = this.categories.indexOf(category)
        return index !== -1 ? this.colorPalette[index] : ''
      }

    }
  },
  methods: {
    selectItem(item) {
      this.$emit('selected', item);
    },
  }
};
</script>
