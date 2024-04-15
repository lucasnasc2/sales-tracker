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
.align-right .v-input__control input {
  text-align: right;
}
.firebase-emulator-warning {
  background-color: transparent !important;
  border: none !important;
  color: rgba(245, 66, 66, 0.3) !important;
}
</style>