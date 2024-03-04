<template>
    <v-container>
      <v-row class="pa-1">
        <v-col class="pa-2" v-for="(item, index) in items" :key="index" cols="6" :sm="3" :md="2">
          <v-card @click="selectItem(item)" >
            <v-img class="align-end text-white" height="100" :src="item.img" cover>
              <v-card-title :style="!item.img ? 'color: black;': ''">{{ item.name }}</v-card-title>
            </v-img>
            <v-list lines="one">
              <v-list-item density="compact" :subtitle="item.category">
                <template v-slot:append>${{ item.price }}</template>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  export default {
    props: {
      items: {
        type: Array,
        required: true
      }
    },
    methods: {
        selectItem(item) {
        this.$emit('selected', item);
      }
    }
  };
  </script>
  