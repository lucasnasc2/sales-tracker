<template>
  <v-app>
    <v-main>
      <RouterView />
    </v-main>
    <AlertSnackbar></AlertSnackbar>
  </v-app>
</template>

<script>

export default {
  data() {
    return {};
  },
  computed: {
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