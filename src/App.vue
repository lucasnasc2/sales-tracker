<template>
  <v-app>
    <v-main>
      <RouterView />
    </v-main>
    <AlertSnackbar></AlertSnackbar>
    <LoaderOverlay v-if="loaderStore.state"></LoaderOverlay>
  </v-app>
</template>

<script>
import { mapStores } from 'pinia';
import { useLoaderStore } from './store/loader';
export default {
  data() {
    return {};
  },
  computed: {
    ...mapStores(useLoaderStore)
  },
  mounted() {
    
  },
};
</script>
<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>