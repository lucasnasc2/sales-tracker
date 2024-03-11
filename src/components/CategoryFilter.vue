<template>
  <v-chip-group filter column>
    <v-chip
      :color="colorPalette[index]"
      class="mx-1"
      v-for="(item, index) in items"
      :key="index"
      @click="selectItem(item)"
    >
      {{ item }}
    </v-chip>
  </v-chip-group>
</template>

<script>
import { generateAnalogousColorPalette } from "../plugins/colorPalette.js";
import { getColorByValuePath } from "../plugins/getColorByValuePath.js";
export default {
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
  computed: {
    colorPalette() {
      let baseColor = this.$globals.secondaryColor.split(".")[0] + ".base";
      return generateAnalogousColorPalette(
        getColorByValuePath(baseColor),
        this.items.length
      );
    },
  },
  methods: {
    selectItem(item) {
      this.$emit("selected", item);
    },
  },
};
</script>
<style scoped></style>
