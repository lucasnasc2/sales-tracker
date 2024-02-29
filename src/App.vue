<template>
  <v-app>
    <v-main>
      <RouterView />
    </v-main>
  </v-app>
</template>

<script>

import { mapStores } from 'pinia'
import { useUserStore } from './store/user.js'

export default {
  data() {
    return {};
  },
  computed: {
    ...mapStores(useUserStore)
  },
  mounted() {
    
  },
};
</script>
